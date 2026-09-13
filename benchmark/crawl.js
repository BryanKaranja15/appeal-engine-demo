#!/usr/bin/env node
// Playwright site benchmark: crawls same-origin pages, screen-records a slow
// scroll through each, saves full-page screenshots, downloads assets, and
// extracts design tokens + animation mechanics into report.json / REPORT.md.
//
// Usage: node benchmark/crawl.js <startUrl> [outDir] [maxPages]
// Needs: playwright (npm i -D playwright  OR  NODE_PATH=/opt/node22/lib/node_modules)

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [start = 'https://www.exacare.com/platform', outDir = 'benchmark/out', maxPagesArg = '40'] = process.argv.slice(2);
const MAX_PAGES = Number(maxPagesArg);
const VIEWPORT = { width: 1440, height: 900 };
const LIBS = /webflow|gsap|ScrollTrigger|lottie|framer|lenis|swiper|splide|aos|locomotive|three|barba|motion/i;

const origin = new URL(start).origin;
const slug = (u) => (new URL(u).pathname.replace(/\/+$/, '') || '/index').replace(/[^a-z0-9]+/gi, '_').replace(/^_/, '') || 'index';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Executed in the browser: everything we can learn about design + animation.
function extract() {
  const q = (s) => Array.from(document.querySelectorAll(s));
  const cs = (el) => getComputedStyle(el);
  const abs = (u) => { try { return new URL(u, location.href).href; } catch { return u; } };
  const root = cs(document.documentElement);
  const cssVars = {};
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) if (r.selectorText === ':root' || r.selectorText === 'html') for (const p of r.style) if (p.startsWith('--')) cssVars[p] = r.style.getPropertyValue(p).trim();
  }
  const keyframes = [], transitions = {}, animatedSelectors = [];
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) {
      if (r.type === CSSRule.KEYFRAMES_RULE) keyframes.push({ name: r.name, css: r.cssText.slice(0, 600) });
      else if (r.style && (r.style.transition || r.style.animation)) animatedSelectors.push({ sel: r.selectorText, transition: r.style.transition, animation: r.style.animation });
    }
  }
  const sample = (sel, n = 6) => q(sel).slice(0, n).map((el) => {
    const s = cs(el);
    return { text: (el.innerText || '').trim().slice(0, 80), fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, color: s.color, background: s.backgroundColor, borderRadius: s.borderRadius, padding: s.padding, boxShadow: s.boxShadow, transition: s.transition };
  });
  const sections = q('section, main > div, [class*="section"]').slice(0, 40).map((el) => {
    const s = cs(el); const r = el.getBoundingClientRect();
    return { cls: el.className && String(el.className).slice(0, 120), h: Math.round(r.height), bg: s.backgroundColor, bgImage: s.backgroundImage !== 'none' ? s.backgroundImage.slice(0, 200) : null, padding: s.padding, heading: (el.querySelector('h1,h2,h3')?.innerText || '').trim().slice(0, 100) };
  });
  const animHints = q('[data-w-id],[data-aos],[data-animation],[data-scroll],[data-framer-name],[class*="animate"],[class*="fade"],[class*="reveal"],[class*="lottie"],[data-animation-type]').slice(0, 80).map((el) => ({ tag: el.tagName, cls: String(el.className).slice(0, 120), attrs: Object.fromEntries(Array.from(el.attributes).filter((a) => a.name.startsWith('data-')).map((a) => [a.name, a.value.slice(0, 200)])), style: el.getAttribute('style')?.slice(0, 200) || null }));
  const bgImages = q('*').map((el) => cs(el).backgroundImage).filter((b) => b && b !== 'none').flatMap((b) => Array.from(b.matchAll(/url\(["']?([^"')]+)/g)).map((m) => abs(m[1])));
  return {
    title: document.title,
    meta: Object.fromEntries(q('meta[name],meta[property]').map((m) => [m.getAttribute('name') || m.getAttribute('property'), (m.content || '').slice(0, 200)])),
    generator: document.querySelector('meta[name=generator]')?.content || (document.documentElement.getAttribute('data-wf-site') ? 'Webflow (data-wf-site)' : null),
    htmlAttrs: Object.fromEntries(Array.from(document.documentElement.attributes).map((a) => [a.name, a.value])),
    nav: q('nav a, header a').map((a) => ({ text: (a.innerText || '').trim().slice(0, 60), href: a.href })).filter((a) => a.href),
    links: Array.from(new Set(q('a[href]').map((a) => a.href))),
    headings: q('h1,h2,h3,h4').map((h) => ({ tag: h.tagName, text: (h.innerText || '').trim().slice(0, 140) })),
    fonts: { loaded: Array.from(document.fonts).map((f) => `${f.family} ${f.weight} ${f.style}`).filter((v, i, a) => a.indexOf(v) === i), body: cs(document.body).fontFamily, links: q('link[rel*="font"],link[href*="fonts."]').map((l) => l.href), faceRules: (() => { const out = []; for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch { continue; } for (const r of rs) if (r.type === CSSRule.FONT_FACE_RULE) out.push(r.cssText.slice(0, 300)); } return out; })() },
    colors: { rootVars: cssVars, bodyBg: cs(document.body).backgroundColor, bodyColor: cs(document.body).color, palette: (() => { const c = {}; for (const el of q('*').slice(0, 3000)) { const s = cs(el); for (const k of [s.color, s.backgroundColor, s.borderColor]) if (k && k !== 'rgba(0, 0, 0, 0)') c[k] = (c[k] || 0) + 1; } return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 30); })() },
    typography: { h1: sample('h1'), h2: sample('h2'), h3: sample('h3'), p: sample('p', 4), buttons: sample('a.button, button, [class*="btn"], [class*="button"]') },
    layout: { sections, containerWidths: Array.from(new Set(q('[class*="container"],[class*="wrapper"]').map((el) => Math.round(el.getBoundingClientRect().width)))).slice(0, 10), docHeight: document.documentElement.scrollHeight },
    assets: {
      images: q('img').map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, loading: i.loading, srcset: (i.srcset || '').slice(0, 300) })),
      videos: q('video').map((v) => ({ src: v.currentSrc || v.src || v.querySelector('source')?.src, poster: v.poster, autoplay: v.autoplay, loop: v.loop, muted: v.muted })),
      inlineSvgCount: q('svg').length,
      bgImages: Array.from(new Set(bgImages)),
      iframes: q('iframe').map((f) => f.src),
      lottie: q('[data-animation-type="lottie"],[data-src*=".json"],lottie-player,dotlottie-player').map((el) => el.getAttribute('data-src') || el.getAttribute('src')),
    },
    scripts: { src: q('script[src]').map((s) => s.src), libsDetected: q('script[src]').map((s) => s.src).filter((s) => LIBS_RE.test(s)), globals: ['Webflow', 'gsap', 'ScrollTrigger', 'lottie', 'Lenis', 'Swiper', 'Splide', 'AOS', 'LocomotiveScroll', 'THREE', 'barba', 'Motion', 'jQuery', 'Framer', '__NEXT_DATA__', '__NUXT__', '__remixContext'].filter((g) => g in window) },
    styles: q('link[rel="stylesheet"]').map((l) => l.href),
    animation: { keyframes: keyframes.slice(0, 40), transitionRules: animatedSelectors.slice(0, 80), hints: animHints, scrollBehavior: root.scrollBehavior, hasIntersectionObserver: 'IntersectionObserver' in window, smoothScrollLib: ['Lenis', 'LocomotiveScroll'].some((g) => g in window) },
  };
}
const extractSrc = `(${extract.toString().replace('LIBS_RE', LIBS.toString())})()`;

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) { await page.mouse.wheel(0, 300); await sleep(180); }
  await sleep(800);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1200);
}

async function download(url, dir, log) {
  try {
    const res = await fetch(url); if (!res.ok) return;
    const name = path.basename(new URL(url).pathname).replace(/[^\w.\-]/g, '_') || 'asset';
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    log.push({ url, file, type: res.headers.get('content-type') });
  } catch (e) { log.push({ url, error: e.message }); }
}

(async () => {
  fs.mkdirSync(path.join(outDir, 'video'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'screens'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });
  const browser = await chromium.launch();
  const queue = [start], seen = new Set([start]), report = { start, crawledAt: new Date().toISOString(), pages: [] };

  while (queue.length && report.pages.length < MAX_PAGES) {
    const url = queue.shift();
    const ctx = await browser.newContext({ viewport: VIEWPORT, recordVideo: { dir: path.join(outDir, 'video'), size: VIEWPORT } });
    const page = await ctx.newPage();
    const network = [];
    page.on('response', (r) => { const t = r.headers()['content-type'] || ''; if (/image|video|font|javascript|css|json/.test(t)) network.push({ url: r.url(), type: t.split(';')[0], size: Number(r.headers()['content-length'] || 0) }); });
    const entry = { url, slug: slug(url) };
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      entry.status = resp?.status();
      await sleep(1500);
      // hover nav items to trigger dropdown/mega-menu animations on the recording
      for (const a of (await page.$$('nav a, header a')).slice(0, 8)) { await a.hover().catch(() => {}); await sleep(350); }
      await scrollThrough(page);
      await page.screenshot({ path: path.join(outDir, 'screens', `${entry.slug}.png`), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 }); await sleep(600);
      await page.screenshot({ path: path.join(outDir, 'screens', `${entry.slug}__mobile.png`), fullPage: true });
      await page.setViewportSize(VIEWPORT);
      entry.data = await page.evaluate(extractSrc);
      entry.network = network;
      // DOM snapshot for replica work
      fs.writeFileSync(path.join(outDir, 'screens', `${entry.slug}.html`), await page.content());
      for (const l of entry.data.links) { try { const u = new URL(l); u.hash = ''; const s = u.href; if (u.origin === origin && !seen.has(s) && !/\.(pdf|jpg|png|svg|zip)$/i.test(u.pathname)) { seen.add(s); queue.push(s); } } catch {} }
    } catch (e) { entry.error = e.message; }
    await page.close();
    const v = await page.video()?.path().catch(() => null);
    await ctx.close();
    if (v) { const target = path.join(outDir, 'video', `${entry.slug}.webm`); fs.renameSync(v, target); entry.video = target; }
    report.pages.push(entry);
    console.log(`[${report.pages.length}] ${url} ${entry.status || entry.error}`);
  }
  await browser.close();

  // Download unique assets (images, videos, css, js, fonts, lottie json)
  const dl = [];
  const urls = new Set();
  for (const p of report.pages) { if (!p.data) continue; p.data.assets.images.forEach((i) => urls.add(i.src)); p.data.assets.videos.forEach((v) => v.src && urls.add(v.src)); p.data.assets.bgImages.forEach((u) => urls.add(u)); p.data.styles.forEach((u) => urls.add(u)); p.data.scripts.src.forEach((u) => urls.add(u)); p.data.assets.lottie.forEach((u) => u && urls.add(new URL(u, p.url).href)); p.network.filter((n) => /font/.test(n.type)).forEach((n) => urls.add(n.url)); }
  for (const u of urls) if (/^https?:/.test(u)) await download(u, path.join(outDir, 'assets'), dl);
  report.downloads = dl;
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

  // Markdown digest
  const md = [`# Site benchmark: ${start}`, `Crawled ${report.pages.length} pages at ${report.crawledAt}`, ''];
  for (const p of report.pages) {
    md.push(`## ${p.url}`); if (!p.data) { md.push(`Error: ${p.error}`, ''); continue; }
    const d = p.data;
    md.push(`- Title: ${d.title}`, `- Generator: ${d.generator || 'unknown'} | globals: ${d.scripts.globals.join(', ') || 'none'}`, `- Libs: ${d.scripts.libsDetected.join(', ') || 'none detected'}`, `- Fonts: ${d.fonts.loaded.join('; ') || d.fonts.body}`, `- Body: bg ${d.colors.bodyBg}, text ${d.colors.bodyColor}; top colors: ${d.colors.palette.slice(0, 8).map((c) => c[0]).join(', ')}`, `- CSS vars: ${Object.keys(d.colors.rootVars).length} | keyframes: ${d.animation.keyframes.map((k) => k.name).join(', ') || 'none'} | animated elements: ${d.animation.hints.length}`, `- Assets: ${d.assets.images.length} img, ${d.assets.videos.length} video, ${d.assets.inlineSvgCount} inline svg, ${d.assets.lottie.length} lottie, ${d.assets.bgImages.length} bg images`, `- Sections (${d.layout.sections.length}): ${d.layout.sections.map((s) => s.heading || s.cls).filter(Boolean).slice(0, 12).join(' | ')}`, `- Headings: ${d.headings.map((h) => `${h.tag}: ${h.text}`).slice(0, 15).join(' / ')}`, `- Video: ${p.video} | Screens: screens/${p.slug}.png, screens/${p.slug}__mobile.png`, '');
  }
  fs.writeFileSync(path.join(outDir, 'REPORT.md'), md.join('\n'));
  console.log(`Done. ${report.pages.length} pages, ${dl.length} assets -> ${outDir}`);
})();
