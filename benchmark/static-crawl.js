#!/usr/bin/env node
/**
 * Static curl-based design/copy benchmark capture for a Next.js App Router site.
 *
 * No browser, no npm deps: fetches with `curl` via child_process, parses the
 * server-rendered HTML with a small hand-rolled tokenizer, and decodes the RSC
 * (`self.__next_f.push`) payload for data the HTML renders as placeholders
 * (animated stat numbers, etc).
 *
 * Usage: node benchmark/static-crawl.js [startUrl] [outDir] [maxPages]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const [
  START = 'https://www.exacare.com/platform',
  OUT_DIR = path.join(__dirname, 'out'),
  MAX_PAGES_ARG = '40',
] = process.argv.slice(2);

const MAX_PAGES = Number(MAX_PAGES_ARG) || 40;
const ORIGIN = new URL(START).origin;
const SITEMAP_INDEX = ORIGIN + '/sitemap-index.xml';

const DIRS = {
  screens: path.join(OUT_DIR, 'screens'),
  rsc: path.join(OUT_DIR, 'rsc'),
  css: path.join(OUT_DIR, 'assets', 'css'),
  js: path.join(OUT_DIR, 'assets', 'js'),
};
for (const d of Object.values(DIRS)) fs.mkdirSync(d, { recursive: true });

/* ------------------------------------------------------------------ fetch */

function curl(url, { binary = false } = {}) {
  const args = ['-sS', '-L', '--max-time', '30', '-A', 'Mozilla/5.0', url];
  return execFileSync('curl', args, {
    maxBuffer: 1024 * 1024 * 64,
    encoding: binary ? 'buffer' : 'utf8',
  });
}

// The session proxy drops connections now and then; retry before giving up.
function tryCurl(url, opts, attempts = 3) {
  let last = '';
  for (let i = 0; i < attempts; i++) {
    try {
      return { ok: true, body: curl(url, opts) };
    } catch (err) {
      last = String(err.message || err).slice(0, 300);
      if (i < attempts - 1) {
        try { execFileSync('sleep', [String(1 + i)]); } catch { /* ignore */ }
      }
    }
  }
  return { ok: false, error: last };
}

/* ------------------------------------------------------------- URL policy */

const ASSET_EXT =
  /\.(css|js|mjs|json|xml|txt|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mov|m4v|mp3|wav|pdf|zip|gz|map|lottie)(\?|$)/i;
const SKIP_PATH = /^\/(studio|api|private|_next|cdn-cgi)(\/|$)/i;

function normalizeUrl(href, base) {
  let u;
  try {
    u = new URL(href, base);
  } catch {
    return null;
  }
  if (u.origin !== ORIGIN) return null;
  if (!/^https?:$/.test(u.protocol)) return null;
  u.hash = '';
  u.search = '';
  if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, '');
  u.pathname = u.pathname.replace(/\/{2,}/g, '/');
  if (SKIP_PATH.test(u.pathname)) return null;
  if (ASSET_EXT.test(u.pathname)) return null;
  return u.href;
}

// Lower number = crawled sooner. Marketing pages before the long tail.
function priority(url) {
  const p = new URL(url).pathname;
  if (p === '/platform') return 0;
  if (p === '/') return 1;
  if (/^\/(skilled-nursing|home-health|hospice|admissions|reimbursement)/.test(p)) return 2;
  if (p === '/about-us') return 3;
  if (p === '/resources/customer-stories' || /^\/resources\/customer-stories\//.test(p)) return 4;
  if (p === '/summit-2027' || /^\/summit/.test(p)) return 5;
  if (/^\/(careers|contact)$/.test(p)) return 6;
  if (/^\/resources\/(blog|news|events|insights)$/.test(p)) return 7;
  if (/^\/resources\//.test(p)) return 8;
  if (/^\/(privacy-policy|terms-of-service|legal)/.test(p)) return 99; // only if a slot is left
  return 9;
}

function slugFor(url) {
  const p = new URL(url).pathname.replace(/\/+$/, '');
  if (!p || p === '/') return 'index';
  return p.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'index';
}

/* ------------------------------------------------------------ HTML parser */

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);
const RAW_TAGS = new Set(['script', 'style', 'textarea']);

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rsquo: '’',
  lsquo: '‘', ldquo: '“', rdquo: '”', copy: '©',
  reg: '®', trade: '™', deg: '°', middot: '·',
  times: '×', minus: '−', shy: '­', eacute: 'é',
};

function decodeEntities(s) {
  if (!s || s.indexOf('&') === -1) return s;
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);?/g, (m, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      if (Number.isFinite(code) && code > 0 && code <= 0x10ffff) {
        try { return String.fromCodePoint(code); } catch { return m; }
      }
      return m;
    }
    const hit = NAMED_ENTITIES[body] ?? NAMED_ENTITIES[body.toLowerCase()];
    return hit === undefined ? m : hit;
  });
}

function parseAttrs(src) {
  const attrs = {};
  const re = /([a-zA-Z_:@][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`/]+)))?/g;
  let m;
  while ((m = re.exec(src))) {
    const name = m[1].toLowerCase();
    const val = m[2] ?? m[3] ?? m[4] ?? '';
    if (!(name in attrs)) attrs[name] = decodeEntities(val);
  }
  return attrs;
}

/** Tokenize HTML into a lightweight tree. Good enough for React output. */
function parseHTML(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const len = html.length;
  let i = 0;
  const addText = (t) => {
    if (t) stack[stack.length - 1].children.push({ tag: '#text', text: t });
  };

  while (i < len) {
    const lt = html.indexOf('<', i);
    if (lt < 0) { addText(html.slice(i)); break; }
    if (lt > i) addText(html.slice(i, lt));

    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt);
      i = end < 0 ? len : end + 3;
      continue;
    }
    if (html.startsWith('<!', lt) || html.startsWith('<?', lt)) {
      const end = html.indexOf('>', lt);
      i = end < 0 ? len : end + 1;
      continue;
    }

    // Find the '>' that closes this tag, ignoring quoted attribute values.
    let j = lt + 1;
    let quote = null;
    while (j < len) {
      const c = html[j];
      if (quote) { if (c === quote) quote = null; }
      else if (c === '"' || c === "'") quote = c;
      else if (c === '>') break;
      j++;
    }
    if (j >= len) { addText(html.slice(lt)); break; }

    const raw = html.slice(lt + 1, j);
    i = j + 1;

    if (raw[0] === '/') {
      const name = raw.slice(1).trim().toLowerCase();
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tag === name) { stack.length = k; break; }
      }
      continue;
    }

    const nameMatch = /^([a-zA-Z][^\s/>]*)/.exec(raw);
    if (!nameMatch) continue;
    const name = nameMatch[1].toLowerCase();
    const selfClose = /\/\s*$/.test(raw);
    const node = { tag: name, attrs: parseAttrs(raw.slice(nameMatch[1].length)), children: [] };
    stack[stack.length - 1].children.push(node);

    if (RAW_TAGS.has(name)) {
      const closeRe = new RegExp('</' + name + '\\s*>', 'i');
      const rest = html.slice(i);
      const m = closeRe.exec(rest);
      if (m) {
        node.children.push({ tag: '#text', text: rest.slice(0, m.index), raw: true });
        i += m.index + m[0].length;
      } else {
        node.children.push({ tag: '#text', text: rest, raw: true });
        i = len;
      }
      continue;
    }
    if (!selfClose && !VOID_TAGS.has(name)) stack.push(node);
  }
  return root;
}

/* -------------------------------------------------------------- tree util */

const NO_TEXT_TAGS = new Set(['script', 'style', 'template', 'noscript', 'svg', 'head', 'title']);
const BLOCKISH = new Set([
  'div', 'p', 'li', 'ul', 'ol', 'section', 'article', 'header', 'footer',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'tr', 'td', 'th', 'blockquote', 'figcaption',
]);

function clean(s) {
  return (s || '')
    .replace(/[ ]/g, ' ')
    .replace(/[​‌‍⁠­﻿]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * The site ships mobile and desktop copies of the same string as adjacent
 * inline spans (`<span class="sm:hidden">X</span><span class="hidden sm:inline">X</span>`),
 * which concatenate to "XX" in the text layer. Collapse exact repeats.
 */
function collapseDoubling(s) {
  for (const n of [2, 3]) {
    if (s.length < 5 * n || s.length % n) continue;
    const unit = s.length / n;
    const head = s.slice(0, unit);
    let same = true;
    for (let k = 1; k < n; k++) {
      if (s.slice(k * unit, (k + 1) * unit) !== head) { same = false; break; }
    }
    if (same) return collapseDoubling(head);
  }
  return s;
}

function textOf(node) {
  let out = '';
  (function walk(n) {
    if (n.tag === '#text') { out += decodeEntities(n.text); return; }
    if (NO_TEXT_TAGS.has(n.tag)) return;
    if (BLOCKISH.has(n.tag)) out += ' ';
    for (const c of n.children) walk(c);
    if (BLOCKISH.has(n.tag)) out += ' ';
  })(node);
  return collapseDoubling(clean(out));
}

function classesOf(node) {
  return (node.attrs?.class || '').split(/\s+/).filter(Boolean);
}

function walkAll(node, fn) {
  fn(node);
  for (const c of node.children || []) walkAll(c, fn);
}

function findAll(node, pred) {
  const out = [];
  walkAll(node, (n) => { if (n.tag !== '#text' && pred(n)) out.push(n); });
  return out;
}

function hasDescendant(node, tags) {
  let found = false;
  walkAll(node, (n) => { if (!found && n !== node && tags.has(n.tag)) found = true; });
  return found;
}

/* ------------------------------------------------------- copy extraction  */

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const STRUCTURAL = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'ul', 'ol',
  'a', 'button', 'blockquote', 'img', 'video', 'table', 'figure',
]);
const EYEBROW_CLASS = /^(label|eyebrow|kicker|tagline|overline)$/i;

function isEyebrowish(node, text, ancestorIsLabel) {
  if (ancestorIsLabel) return true;
  if (classesOf(node).some((c) => EYEBROW_CLASS.test(c))) return true;
  if (!text || text.length > 48) return false;
  if (/[.!?]$/.test(text)) return false;
  const letters = text.replace(/[^a-zA-Z]/g, '');
  return letters.length > 1 && letters === letters.toUpperCase();
}

const MEDIA_SRC = /_next\/image\?url=([^&"']+)/;
function realSrc(src) {
  if (!src) return src;
  const m = MEDIA_SRC.exec(src);
  if (m) { try { return decodeURIComponent(m[1]); } catch { return src; } }
  return src;
}

/**
 * Walk one CMS block and emit an ordered, deduped list of copy items plus
 * media inventory. Mobile/desktop duplicate markup is collapsed by value.
 */
function extractBlock(blockNode) {
  const items = [];
  const images = [];
  const videos = [];
  const themes = new Set();
  let svgCount = 0;
  const seen = new Set();

  const emit = (role, data) => {
    const text = clean(data.text || '');
    if (!text && role !== 'stat') return;
    const key = role + '|' + text.toLowerCase() + '|' + (data.href || '');
    if (seen.has(key)) return;
    seen.add(key);
    items.push(Object.assign({ role, text }, data.href ? { href: data.href } : {}, data.extra || {}));
  };

  (function walk(node, hidden, labelCtx) {
    for (const child of node.children || []) {
      if (child.tag === '#text') continue;
      const n = child;
      const tag = n.tag;

      if (tag === 'svg') { svgCount++; continue; }
      if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'template') continue;

      if (n.attrs['data-theme']) themes.add(n.attrs['data-theme']);
      const isHidden = hidden || n.attrs['aria-hidden'] === 'true';
      const isLabel = labelCtx || classesOf(n).some((c) => EYEBROW_CLASS.test(c));

      if (tag === 'img') {
        const src = n.attrs.src || '';
        images.push({ src: realSrc(src), alt: clean(n.attrs.alt || ''), raw: src.slice(0, 200) });
        continue;
      }
      if (tag === 'video') {
        const src = n.attrs.src || (findAll(n, (x) => x.tag === 'source')[0]?.attrs.src || '');
        videos.push({ src, poster: n.attrs.poster || '' });
        continue;
      }

      if (HEADINGS.has(tag)) {
        if (!isHidden) emit('heading', { text: textOf(n), extra: { tag } });
        walk(n, true, false); // still collect media inside headings
        continue;
      }

      if (tag === 'blockquote') {
        if (!isHidden) emit('quote', { text: textOf(n) });
        walk(n, true, false);
        continue;
      }

      if (tag === 'a' || tag === 'button') {
        const href = n.attrs.href || '';
        const label = clean(n.attrs['aria-label'] || '');
        const full = textOf(n);
        // A card, not a button: it wraps block copy, or its visible text runs
        // well past its aria-label (title + description + link stacked inside).
        const isCard = hasDescendant(n, HEADINGS) ||
          hasDescendant(n, new Set(['p', 'li'])) ||
          (label && full.length > label.length + 20);
        if (isCard) {
          if (!isHidden) emit('cardLink', { text: label || full.slice(0, 80), href });
          walk(n, isHidden, isLabel);
        } else {
          if (!isHidden) {
            emit('cta', {
              text: full || label, href,
              extra: label && label !== full ? { ariaLabel: label } : undefined,
            });
          }
          walk(n, true, false);
        }
        continue;
      }

      if (tag === 'li') {
        // Stat items render an animated <number-flow-react>; value comes from RSC.
        const nf = findAll(n, (x) => x.tag === 'number-flow-react')[0];
        if (nf) {
          const value = textOf(nf);
          const label = clean(textOf(n).replace(value, ' '));
          if (!isHidden) emit('stat', { text: label, extra: { value } });
          walk(n, true, false);
          continue;
        }
        if (hasDescendant(n, STRUCTURAL)) { walk(n, isHidden, isLabel); continue; }
        if (!isHidden) emit('bullet', { text: textOf(n) });
        continue;
      }

      if (tag === 'p') {
        if (!isHidden) emit('paragraph', { text: textOf(n) });
        walk(n, true, false);
        continue;
      }

      // Leaf text container (React writes a lot of copy into plain divs/spans).
      if (!hasDescendant(n, STRUCTURAL) && !hasDescendant(n, new Set(['div']))) {
        const t = textOf(n);
        if (t && !isHidden) {
          emit(isEyebrowish(n, t, isLabel) ? 'eyebrow' : 'text', { text: t });
          continue;
        }
        if (t) continue;
      }

      walk(n, isHidden, isLabel);
    }
  })(blockNode, blockNode.attrs['aria-hidden'] === 'true', false);

  // A card link emits its aria-label, and the card's own title repeats it as
  // the next text node; drop that echo.
  for (let i = items.length - 1; i > 0; i--) {
    const prev = items[i - 1];
    if (prev.role === 'cardLink' && items[i].role === 'text' &&
        items[i].text.toLowerCase() === prev.text.toLowerCase()) {
      items.splice(i, 1);
    }
  }

  // Pull-quotes are rendered as plain divs, not <blockquote>.
  for (const it of items) {
    if (it.role === 'text' && /^["\u201c\u2018\u00ab]/.test(it.text) && /["\u201d\u2019\u00bb]$/.test(it.text)) {
      it.role = 'quote';
    }
  }

  // Promote a short non-terminal item that sits directly before the first
  // heading to an eyebrow (the "small label above the headline" pattern).
  const firstHeading = items.findIndex((it) => it.role === 'heading');
  if (firstHeading > 0) {
    const prev = items[firstHeading - 1];
    if (prev.role === 'text' && prev.text.length <= 48 && !/[.!?]$/.test(prev.text)) {
      prev.role = 'eyebrow';
    }
  }

  return { items, images, videos, svgCount, themes: [...themes] };
}

/**
 * Testimonial attribution is a sibling text node, sometimes before the quote
 * (name + role above) and sometimes after. Take the nearest short, non-quote,
 * non-CTA text within two positions.
 */
function attributionFor(items, idx) {
  const ok = (it) =>
    it && (it.role === 'text' || it.role === 'eyebrow' || it.role === 'paragraph') &&
    it.text.length <= 120 && !/^["\u201c]/.test(it.text);
  for (const d of [-1, 1, -2, 2]) {
    const cand = items[idx + d];
    if (ok(cand)) return cand.text;
  }
  return '';
}

/** Group the ordered items into the classified copy shape. */
function classify(items) {
  const out = {
    eyebrow: null, headline: null, subhead: null,
    body: [], bullets: [], ctas: [], quotes: [], stats: [], other: [],
  };
  let headlineIdx = -1;
  items.forEach((it, idx) => {
    switch (it.role) {
      case 'eyebrow': if (!out.eyebrow) out.eyebrow = it.text; else out.other.push(it.text); break;
      case 'heading':
        if (!out.headline) { out.headline = it.text; headlineIdx = idx; }
        else out.other.push(it.text);
        break;
      case 'paragraph':
        if (!out.subhead && headlineIdx >= 0 && idx === headlineIdx + 1) out.subhead = it.text;
        else out.body.push(it.text);
        break;
      case 'bullet': out.bullets.push(it.text); break;
      case 'cta': case 'cardLink': out.ctas.push({ text: it.text, href: it.href || '' }); break;
      case 'quote': out.quotes.push({ text: it.text, attribution: attributionFor(items, idx) }); break;
      case 'stat': out.stats.push({ value: it.value || '', label: it.text }); break;
      default: out.other.push(it.text);
    }
  });
  // Attribution for quotes: the text items following a quote.
  return out;
}

/* --------------------------------------------------------- RSC decoding   */

function decodeRSC(html) {
  const re = /self\.__next_f\.push\(\s*\[\s*\d+\s*,\s*("(?:[^"\\]|\\[\s\S])*")\s*\]\s*\)/g;
  let m, out = '', chunks = 0;
  while ((m = re.exec(html))) {
    try { out += JSON.parse(m[1]); chunks++; } catch { /* non-string chunk */ }
  }
  return { payload: out, chunks };
}

/** Real stat numbers live in the RSC payload, not in the rendered HTML. */
function rscStats(payload) {
  // RSC serializes an absent value as the literal "$undefined" and escapes a
  // leading "$" by doubling it. Symbol spacing is meaningful ("7 min"), so keep
  // interior/edge spaces and only drop zero-width joiners.
  const unq = (raw) => {
    if (raw == null) return '';
    let v;
    try { v = JSON.parse('"' + raw + '"'); } catch { v = raw; }
    if (v === '$undefined') return '';
    if (v.startsWith('$$')) v = v.slice(1);
    return v.replace(/[\u200b\u200c\u200d\u2060\u00ad\ufeff]/g, '').replace(/\s+/g, ' ');
  };
  const out = [];
  const re = /\{"text":"((?:[^"\\]|\\.)*)"[^{}]{0,200}?"number":(-?[\d.]+)\}/g;
  let m;
  while ((m = re.exec(payload))) {
    const seg = m[0];
    const before = unq((/"symbolBefore":"((?:[^"\\]|\\.)*)"/.exec(seg) || [])[1]);
    const after = unq((/"symbolAfter":"((?:[^"\\]|\\.)*)"/.exec(seg) || [])[1]);
    out.push({
      label: clean(unq(m[1])),
      number: Number(m[2]),
      symbolBefore: before,
      symbolAfter: after,
      value: `${before}${m[2]}${after}`.trim(),
    });
  }
  return out;
}

/** Best-effort: pull balanced JSON objects that carry Sanity "_type" keys. */
function rscBlockJson(payload) {
  const found = [];
  const seen = new Set();
  let idx = 0;
  while ((idx = payload.indexOf('"_type"', idx)) !== -1) {
    // Walk backwards to the opening brace of the enclosing object.
    let start = -1, depth = 0;
    for (let i = idx; i >= 0 && idx - i < 20000; i--) {
      const c = payload[i];
      if (c === '}') depth++;
      else if (c === '{') { if (depth === 0) { start = i; break; } depth--; }
    }
    idx += 7;
    if (start < 0) continue;
    // Forward scan for the matching close brace (quote-aware).
    let d = 0, inStr = false, esc = false, end = -1;
    for (let i = start; i < payload.length && i - start < 400000; i++) {
      const c = payload[i];
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (inStr) { if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true;
      else if (c === '{') d++;
      else if (c === '}') { d--; if (d === 0) { end = i + 1; break; } }
    }
    if (end < 0) continue;
    const src = payload.slice(start, end);
    if (seen.has(src)) continue;
    seen.add(src);
    try { found.push(JSON.parse(src)); } catch { /* not standalone JSON */ }
  }
  return found;
}

/* ------------------------------------------------------------ page parse  */

function metaMap(root) {
  const out = {};
  for (const m of findAll(root, (n) => n.tag === 'meta')) {
    const k = m.attrs.name || m.attrs.property || m.attrs.itemprop;
    if (k && !(k in out)) out[k] = m.attrs.content || '';
  }
  return out;
}

function parsePage(url, html) {
  const root = parseHTML(html);
  const meta = metaMap(root);
  const titleNode = findAll(root, (n) => n.tag === 'title')[0];
  const title = titleNode ? clean(textOf({ tag: 'x', attrs: {}, children: titleNode.children.map((c) => ({ ...c, raw: false })) })) : '';

  const canonical = findAll(root, (n) => n.tag === 'link' && (n.attrs.rel || '').includes('canonical'))[0]?.attrs.href || '';

  const blockNodes = findAll(root, (n) => n.attrs['data-block-type'] ||
    /(?:^|\s)Blocks_block__/.test(n.attrs.class || ''));

  let blocks = blockNodes.map((n, i) => {
    const typeAttr = n.attrs['data-block-type'];
    const clsType = /Blocks_([A-Za-z0-9]+)__/.exec(
      (n.attrs.class || '').split(/\s+/).filter((c) => !/^Blocks_block__/.test(c)).join(' ')
    );
    const ex = extractBlock(n);
    return {
      index: i,
      type: typeAttr || (clsType ? clsType[1] : 'Unknown'),
      cmsPath: (/path=([^;]*)/.exec(n.attrs['data-sanity'] || '') || [])[1] || '',
      theme: n.attrs['data-theme'] || '',
      innerThemes: ex.themes,
      items: ex.items,
      copy: classify(ex.items),
      images: ex.images,
      videos: ex.videos,
      inlineSvgCount: ex.svgCount,
    };
  });

  // Pages without CMS blocks (posts, legal, forms): treat <main> as one block.
  if (!blocks.length) {
    const main = findAll(root, (n) => n.tag === 'main')[0] ||
      findAll(root, (n) => n.tag === 'body')[0] || root;
    const ex = extractBlock(main);
    blocks = [{
      index: 0, type: 'Page', cmsPath: '', theme: '', innerThemes: ex.themes,
      items: ex.items, copy: classify(ex.items), images: ex.images,
      videos: ex.videos, inlineSvgCount: ex.svgCount,
    }];
  }

  const allImgs = findAll(root, (n) => n.tag === 'img').map((n) => ({
    src: realSrc(n.attrs.src || ''), alt: clean(n.attrs.alt || ''),
    loading: n.attrs.loading || '', id: n.attrs.id || '',
  }));
  const allVideos = findAll(root, (n) => n.tag === 'video').map((n) => ({
    src: n.attrs.src || (findAll(n, (x) => x.tag === 'source')[0]?.attrs.src || ''),
    poster: n.attrs.poster || '', autoplay: 'autoplay' in n.attrs, loop: 'loop' in n.attrs,
  }));
  for (const s of findAll(root, (n) => n.tag === 'source')) {
    const t = s.attrs.type || '';
    if (/video/.test(t) && s.attrs.src && !allVideos.some((v) => v.src === s.attrs.src)) {
      allVideos.push({ src: s.attrs.src, poster: '', autoplay: false, loop: false });
    }
  }

  const links = [];
  for (const a of findAll(root, (n) => n.tag === 'a' && n.attrs.href)) {
    const abs = normalizeUrl(a.attrs.href, url);
    if (abs) links.push({ href: abs, text: clean(a.attrs['aria-label'] || textOf(a)).slice(0, 80) });
  }

  const nav = findAll(root, (n) => n.tag === 'header' || n.tag === 'nav')
    .flatMap((n) => findAll(n, (x) => x.tag === 'a' && x.attrs.href))
    .map((a) => ({ text: clean(a.attrs['aria-label'] || textOf(a)), href: a.attrs.href }))
    .filter((x) => x.text);
  const footer = findAll(root, (n) => n.tag === 'footer')
    .flatMap((n) => findAll(n, (x) => x.tag === 'a' && x.attrs.href))
    .map((a) => ({ text: clean(a.attrs['aria-label'] || textOf(a)), href: a.attrs.href }))
    .filter((x) => x.text);

  const themes = {};
  for (const n of findAll(root, (x) => x.attrs['data-theme'])) {
    const t = n.attrs['data-theme'];
    themes[t] = (themes[t] || 0) + 1;
  }

  const cssRefs = [...new Set((html.match(/\/_next\/static\/css\/[A-Za-z0-9._-]+\.css/g) || []))];
  const jsRefs = [...new Set((html.match(/\/_next\/static\/chunks\/[A-Za-z0-9._\/-]+\.js/g) || []))];
  const fontRefs = [...new Set((html.match(/\/_next\/static\/media\/[A-Za-z0-9._-]+\.woff2?/g) || []))];
  // Next/font class names (fontDiatype, fontSeason, __className_xxx), not the
  // camelCase CSS properties that appear in React inline styles.
  const CSS_PROP = /^font(Family|Size|Weight|Style|Kerning|Feature|Variant|Stretch|Display|Synthesis|Optical)/;
  const fontClasses = [...new Set((html.match(/\b(?:__)?font[A-Z][A-Za-z0-9_]*/g) || []))]
    .filter((c) => !CSS_PROP.test(c));

  // <video> is mounted client-side, so the server HTML only carries the URLs.
  const videoRefs = [...new Set((html.match(/https?:\/\/[^"'\s)]+\.(?:mp4|webm|mov)|\/[A-Za-z0-9._\/-]+\.(?:mp4|webm|mov)/g) || []))];
  const lotties = [...new Set([
    ...(html.match(/[^"'\s()]+\.lottie/g) || []),
    ...(html.match(/[^"'\s()]+lottie[^"'\s()]*\.json/gi) || []),
    ...findAll(root, (n) => /lottie/i.test(n.attrs.class || '') || n.tag.includes('lottie'))
      .map((n) => n.attrs['data-src'] || n.attrs.src || `<${n.tag} class="${(n.attrs.class || '').slice(0, 60)}">`),
  ])];

  const { payload, chunks } = decodeRSC(html);
  const stats = rscStats(payload);
  // Fold the true stat numbers back into the blocks that render them.
  for (const b of blocks) {
    for (const s of b.copy.stats) {
      const hit = stats.find((x) => x.label && s.label && x.label.toLowerCase() === s.label.toLowerCase());
      if (hit) { s.value = hit.value; s.renderedValue = hit.value; }
    }
    for (const it of b.items) {
      if (it.role !== 'stat') continue;
      const hit = stats.find((x) => x.label && it.text && x.label.toLowerCase() === it.text.toLowerCase());
      if (hit) it.value = hit.value;
    }
  }

  return {
    url, slug: slugFor(url), title,
    description: meta.description || meta['og:description'] || '',
    ogImage: meta['og:image'] || '', canonical,
    meta, blocks,
    blockTypes: blocks.map((b) => b.type),
    links, nav, footer, themes,
    assets: {
      images: allImgs, videos: allVideos, videoRefs, lotties,
      inlineSvgCount: findAll(root, (n) => n.tag === 'svg').length,
      css: cssRefs, js: jsRefs, fonts: fontRefs, fontClasses,
    },
    rsc: { chunks, length: payload.length },
    _payload: payload,
  };
}

/* --------------------------------------------------------------- crawling */

function sitemapSeeds() {
  const urls = [];
  const idx = tryCurl(SITEMAP_INDEX);
  if (!idx.ok) return urls;
  const children = [...idx.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  for (const child of children) {
    const r = tryCurl(child);
    if (!r.ok) continue;
    for (const m of r.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      const u = normalizeUrl(m[1], ORIGIN);
      if (u) urls.push(u);
    }
  }
  return [...new Set(urls)];
}

function downloadAssets(refs, dir, label) {
  const saved = [];
  for (const ref of refs) {
    const name = ref.split('/').pop().split('?')[0];
    const dest = path.join(dir, name.replace(/[^A-Za-z0-9._-]/g, '_'));
    if (fs.existsSync(dest)) { saved.push(dest); continue; }
    const r = tryCurl(new URL(ref, ORIGIN).href);
    if (!r.ok) { console.warn(`  ! ${label} failed: ${ref}`); continue; }
    fs.writeFileSync(dest, r.body);
    saved.push(dest);
  }
  return saved;
}

function colorTokens(cssDir) {
  const tokens = {};
  const other = {};
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith('.css')) continue;
    const css = fs.readFileSync(path.join(cssDir, f), 'utf8');
    for (const m of css.matchAll(/(--[A-Za-z0-9_-]+)\s*:\s*([^;{}]+)[;}]/g)) {
      const name = m[1], val = m[2].trim().slice(0, 120);
      if (/^--color-/.test(name)) { if (!(name in tokens)) tokens[name] = val; }
      else if (!(name in other)) other[name] = val;
    }
  }
  return { colorTokens: tokens, otherTokens: other };
}

function fontFaces(cssDir) {
  const faces = [];
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith('.css')) continue;
    const css = fs.readFileSync(path.join(cssDir, f), 'utf8');
    for (const m of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
      const body = m[1];
      const g = (re) => (re.exec(body) || [])[1] || '';
      faces.push({
        family: g(/font-family:\s*([^;]+)/).replace(/['"]/g, '').trim(),
        weight: g(/font-weight:\s*([^;]+)/).trim(),
        style: g(/font-style:\s*([^;]+)/).trim(),
        src: g(/src:\s*url\(([^)]+)\)/).replace(/['"]/g, '').trim(),
      });
    }
  }
  return faces;
}

/* ---------------------------------------------------------------- output  */

const esc = (s) => String(s == null ? '' : s).replace(/\r?\n/g, ' ').trim();

function copyMarkdown(pages) {
  const L = [];
  L.push('# exacare.com — complete copy inventory');
  L.push('');
  L.push('Static `curl` capture of the server-rendered HTML (no browser, no screenshots).');
  L.push('Every block on every crawled page, in document order. Within a block, items are');
  L.push('listed in the order they appear in the markup. Mobile/desktop duplicate markup is');
  L.push('collapsed to a single entry. Stat values are taken from the RSC payload (the HTML');
  L.push('ships `0` because the numbers animate up on scroll).');
  L.push('');
  L.push(`Captured: ${new Date().toISOString()} — ${pages.length} pages.`);
  L.push('');
  L.push('---');
  L.push('');

  for (const p of pages) {
    L.push(`## ${p.url}`);
    L.push('');
    L.push(`**Title:** ${esc(p.title) || '—'}`);
    if (p.description) L.push(`**Meta description:** ${esc(p.description)}`);
    L.push(`**Blocks (${p.blocks.length}):** ${p.blocks.map((b) => b.type).join(' → ')}`);
    L.push('');
    for (const b of p.blocks) {
      const theme = b.theme ? ` · theme=${b.theme}` : '';
      L.push(`### ${b.index + 1}. ${b.type}${theme}`);
      if (!b.items.length) {
        L.push('');
        L.push('_(no text — media-only block)_');
        L.push('');
        continue;
      }
      L.push('');
      for (const it of b.items) {
        switch (it.role) {
          case 'eyebrow': L.push(`- **eyebrow:** ${esc(it.text)}`); break;
          case 'heading': L.push(`- **${it.tag}:** ${esc(it.text)}`); break;
          case 'paragraph': L.push(`- body: ${esc(it.text)}`); break;
          case 'text': L.push(`- text: ${esc(it.text)}`); break;
          case 'bullet': L.push(`- • ${esc(it.text)}`); break;
          case 'cta': L.push(`- **CTA:** \`${esc(it.text)}\` → ${esc(it.href) || '—'}`); break;
          case 'cardLink': L.push(`- **card link:** \`${esc(it.text)}\` → ${esc(it.href) || '—'}`); break;
          case 'quote': L.push(`- **quote:** ${esc(it.text)}`); break;
          case 'stat': L.push(`- **stat:** ${esc(it.value || '?')} — ${esc(it.text)}`); break;
          default: L.push(`- ${esc(it.text)}`);
        }
      }
      L.push('');
    }
    L.push('---');
    L.push('');
  }
  return L.join('\n');
}

function reportMarkdown(pages, summary, errors) {
  const L = [];
  L.push('# exacare.com — static capture report');
  L.push('');
  L.push('> Static `curl` capture of server-rendered HTML + decoded RSC payload.');
  L.push('> **No screenshots and no scroll video** — those come from the headed');
  L.push('> Playwright run (`benchmark/crawl.js`); headless Chromium has no network here.');
  L.push('');
  L.push(`- Captured: ${new Date().toISOString()}`);
  L.push(`- Pages: ${pages.length}`);
  L.push(`- Start URL: ${START}`);
  L.push('');
  L.push('## Block types seen');
  L.push('');
  L.push('| Block type | Count | Pages |');
  L.push('| --- | ---: | --- |');
  for (const [type, info] of summary.blockTypes) {
    L.push(`| ${type} | ${info.count} | ${info.pages.join(', ')} |`);
  }
  L.push('');
  L.push('## Fonts');
  L.push('');
  L.push('| Family | Weight | Style | Source |');
  L.push('| --- | --- | --- | --- |');
  for (const f of summary.fontFaces) L.push(`| ${f.family} | ${f.weight} | ${f.style} | ${f.src} |`);
  L.push('');
  L.push(`Font utility classes in markup: ${summary.fontClasses.join(', ') || '—'}`);
  L.push('');
  L.push('## Color tokens (`--color-*`)');
  L.push('');
  L.push('| Token | Value |');
  L.push('| --- | --- |');
  for (const [k, v] of Object.entries(summary.colorTokens)) L.push(`| \`${k}\` | \`${v}\` |`);
  L.push('');
  L.push('## Asset totals');
  L.push('');
  L.push(`- images: ${summary.totals.images}`);
  L.push(`- <video> elements in server HTML: ${summary.totals.videoElements} (the site mounts video client-side)`);
  L.push(`- video file URLs referenced: ${summary.totals.uniqueVideos} unique`);
  L.push(`- lottie refs: ${summary.totals.lotties}`);
  L.push(`- inline \`<svg>\`: ${summary.totals.inlineSvg}`);
  L.push(`- CSS files: ${summary.cssFiles.length}`);
  L.push(`- JS chunks: ${summary.jsFiles.length}`);
  L.push('');
  if (errors.length) {
    L.push('## Errors');
    L.push('');
    for (const e of errors) L.push(`- ${e.url} — ${e.error}`);
    L.push('');
  }
  L.push('---');
  L.push('');
  L.push('## Pages');
  L.push('');
  for (const p of pages) {
    L.push(`### ${p.url}`);
    L.push('');
    L.push(`- **title:** ${esc(p.title)}`);
    if (p.description) L.push(`- **description:** ${esc(p.description)}`);
    if (p.canonical) L.push(`- **canonical:** ${p.canonical}`);
    if (p.ogImage) L.push(`- **og:image:** ${p.ogImage}`);
    L.push(`- **themes:** ${Object.entries(p.themes).map(([k, v]) => `${k}×${v}`).join(', ') || '—'}`);
    L.push(`- **assets:** ${p.assets.images.length} img · ${p.assets.videoRefs.length} video url · ${p.assets.lotties.length} lottie · ${p.assets.inlineSvgCount} inline svg`);
    L.push(`- **rsc:** ${p.rsc.chunks} chunks, ${p.rsc.length} chars`);
    L.push('');
    L.push('| # | Block | Theme | Headline | CTAs |');
    L.push('| ---: | --- | --- | --- | --- |');
    for (const b of p.blocks) {
      const ctas = b.copy.ctas.map((c) => c.text).filter(Boolean).join(' / ') || '—';
      L.push(`| ${b.index + 1} | ${b.type} | ${b.theme || '—'} | ${esc(b.copy.headline || b.copy.eyebrow || '—').slice(0, 90)} | ${esc(ctas).slice(0, 90)} |`);
    }
    const darkBlocks = p.blocks.filter((b) => b.theme === 'dark' || b.innerThemes.includes('dark')).map((b) => b.type);
    if (darkBlocks.length) { L.push(''); L.push(`Dark blocks: ${darkBlocks.join(', ')}`); }
    L.push('');
  }
  return L.join('\n');
}

/* ------------------------------------------------------------------- main */

function main() {
  console.log(`Seeding from sitemap ${SITEMAP_INDEX} ...`);
  const seeds = sitemapSeeds();
  console.log(`  ${seeds.length} sitemap URLs`);

  const frontier = new Map(); // url -> true
  const add = (u) => { if (u && !visited.has(u)) frontier.set(u, true); };
  const visited = new Set();
  add(normalizeUrl(START, ORIGIN));
  add(normalizeUrl(ORIGIN + '/', ORIGIN));
  for (const s of seeds) add(s);

  const pages = [];
  const errors = [];
  const cssRefs = new Set();
  const jsRefs = new Set();

  while (pages.length < MAX_PAGES && frontier.size) {
    // Pick the highest-priority pending URL.
    let best = null, bestP = Infinity;
    for (const u of frontier.keys()) {
      const pr = priority(u);
      if (pr < bestP) { bestP = pr; best = u; }
    }
    frontier.delete(best);
    if (visited.has(best)) continue;
    visited.add(best);

    // Legal pages only if slots remain after everything else.
    if (bestP === 99 && frontier.size && pages.length + frontier.size <= MAX_PAGES) {
      // keep it; there is room
    }

    process.stdout.write(`[${pages.length + 1}/${MAX_PAGES}] ${best} `);
    const res = tryCurl(best);
    if (!res.ok) { console.log('ERROR'); errors.push({ url: best, error: res.error }); continue; }
    const html = res.body;

    let page;
    try {
      page = parsePage(best, html);
    } catch (err) {
      console.log('PARSE ERROR');
      errors.push({ url: best, error: 'parse: ' + String(err.message || err).slice(0, 200) });
      continue;
    }

    fs.writeFileSync(path.join(DIRS.screens, page.slug + '.html'), html);
    fs.writeFileSync(path.join(DIRS.rsc, page.slug + '.txt'), page._payload);
    const blockJson = rscBlockJson(page._payload);
    if (blockJson.length) {
      fs.writeFileSync(path.join(DIRS.rsc, page.slug + '.blocks.json'), JSON.stringify(blockJson, null, 2));
      page.rsc.blockJsonObjects = blockJson.length;
    } else {
      page.rsc.blockJsonObjects = 0;
      page.rsc.note = 'No standalone CMS JSON in the RSC payload — it is a serialized React element tree, not raw Sanity documents. Copy was extracted from the rendered HTML; raw payload kept as .txt.';
    }
    delete page._payload;

    for (const c of page.assets.css) cssRefs.add(c);
    for (const j of page.assets.js) jsRefs.add(j);
    for (const l of page.links) add(l.href);

    pages.push(page);
    console.log(`ok — ${page.blocks.length} blocks (${page.blockTypes.join(', ')})`);
  }

  console.log(`\nDownloading ${cssRefs.size} CSS + ${jsRefs.size} JS ...`);
  const cssFiles = downloadAssets([...cssRefs], DIRS.css, 'css');
  const jsFiles = downloadAssets([...jsRefs], DIRS.js, 'js');

  const { colorTokens: tokensAll, otherTokens } = colorTokens(DIRS.css);
  const faces = fontFaces(DIRS.css);

  const blockTypeMap = new Map();
  for (const p of pages) {
    for (const b of p.blocks) {
      if (!blockTypeMap.has(b.type)) blockTypeMap.set(b.type, { count: 0, pages: [] });
      const e = blockTypeMap.get(b.type);
      e.count++;
      if (!e.pages.includes(p.slug)) e.pages.push(p.slug);
    }
  }
  const blockTypes = [...blockTypeMap.entries()].sort((a, b) => b[1].count - a[1].count);

  const summary = {
    startUrl: START,
    capturedAt: new Date().toISOString(),
    method: 'static curl capture of server-rendered HTML + decoded RSC payload (no browser, no screenshots, no video)',
    pageCount: pages.length,
    urls: pages.map((p) => p.url),
    blockTypes,
    fontFaces: faces,
    fontClasses: [...new Set(pages.flatMap((p) => p.assets.fontClasses))],
    fontFiles: [...new Set(pages.flatMap((p) => p.assets.fonts))],
    colorTokens: tokensAll,
    otherTokens,
    cssFiles: cssFiles.map((f) => path.relative(OUT_DIR, f)),
    jsFiles: jsFiles.map((f) => path.relative(OUT_DIR, f)),
    totals: {
      images: pages.reduce((n, p) => n + p.assets.images.length, 0),
      uniqueImages: new Set(pages.flatMap((p) => p.assets.images.map((i) => i.src))).size,
      videoElements: pages.reduce((n, p) => n + p.assets.videos.length, 0),
      videoRefs: pages.reduce((n, p) => n + p.assets.videoRefs.length, 0),
      uniqueVideos: new Set(pages.flatMap((p) => [
        ...p.assets.videos.map((v) => v.src), ...p.assets.videoRefs,
      ].filter(Boolean))).size,
      lotties: pages.reduce((n, p) => n + p.assets.lotties.length, 0),
      inlineSvg: pages.reduce((n, p) => n + p.assets.inlineSvgCount, 0),
      blocks: pages.reduce((n, p) => n + p.blocks.length, 0),
    },
    errors,
  };

  fs.writeFileSync(path.join(OUT_DIR, 'report.json'), JSON.stringify({ summary, pages }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'REPORT.md'), reportMarkdown(pages, summary, errors));

  const copy = {
    capturedAt: summary.capturedAt,
    method: summary.method,
    pages: pages.map((p) => ({
      url: p.url, slug: p.slug, title: p.title, description: p.description,
      blocks: p.blocks.map((b) => ({
        index: b.index, type: b.type, theme: b.theme, cmsPath: b.cmsPath,
        ordered: b.items, ...b.copy,
      })),
    })),
  };
  fs.writeFileSync(path.join(OUT_DIR, 'copy.json'), JSON.stringify(copy, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'COPY.md'), copyMarkdown(pages));

  console.log('\nWrote:');
  for (const f of ['report.json', 'REPORT.md', 'copy.json', 'COPY.md']) {
    console.log('  ' + path.join(OUT_DIR, f));
  }
  console.log(`  ${DIRS.screens}/*.html (${pages.length})`);
  console.log(`  ${DIRS.rsc}/*.txt`);
  console.log(`  ${DIRS.css}/*.css (${cssFiles.length})`);
  console.log(`  ${DIRS.js}/*.js (${jsFiles.length})`);
  if (errors.length) console.log(`\n${errors.length} errors`);
}

main();
