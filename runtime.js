/* Appeal Engine demo runtime — renders the canvas screen modules as a real site.
   Fictional data throughout. State persists to localStorage per screen+state. */
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const STORE_PREFIX = 'ae1:';

  // ---------- shell toast ----------
  let toastTimer = 0;
  function shellToast(msg) {
    const t = $('#shell-toast');
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.style.display = 'none'; }, 3600);
  }

  // ---------- routing ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [screen, state] = h.split('/');
    return { screen: SCREENS[screen] ? screen : 'stayboard', state: state || null };
  }
  function go(screen, state) {
    const cur = route();
    const st = state || savedScenario(screen) || 'default';
    if (cur.screen === screen && cur.state === st) { mount(); return; }
    location.hash = '#/' + screen + '/' + st;
  }
  window.addEventListener('hashchange', mount);

  function savedScenario(screen) { try { return localStorage.getItem(STORE_PREFIX + screen + ':scenario'); } catch (e) { return null; } }

  // ---------- cross-screen navigation from in-screen messages ----------
  // Shared demo data (from src/shared.mjs via screens.js)
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function pillText(h) { if (h < 0) { const a = -h; return a < 48 ? 'Overdue by ' + a + 'h' : 'Overdue by ' + Math.floor(a / 24) + ' days'; } if (h < 48) return h + 'h left'; return Math.round(h / 24) + 'd left'; }
  function tierOf(h) { return h < 0 ? 'overdue' : h < 24 ? 'critical' : h < 168 ? 'urgent' : 'routine'; }
  function findCase(id) { const D = window.AE_DATA; return D && D.CASES.find(function (x) { return x.id === id; }); }
  function overrideId() { try { return +sessionStorage.getItem('ae:case') || 0; } catch (e) { return 0; } }
  function setOverride(id) { try { sessionStorage.setItem('ae:case', String(id)); } catch (e) {} }

  // Screens built around one sample person; other cases render the same page with their own data.
  const BASES = {
    casedetail: { id: 2418, name: 'Eleanor Whitfield', hon: 'Ms', amt: 11400, room: 214, ins: 0, fac: 0, hours: 9 },
    draftreview: { id: 2418, name: 'Eleanor Whitfield', hon: 'Ms', amt: 11400, room: 214, ins: 0, fac: 0, hours: 9 },
    packet: { id: 2418, name: 'Eleanor Whitfield', hon: 'Ms', amt: 11400, room: 214, ins: 0, fac: 0, hours: 9 },
    outcome: { id: 2395, name: 'Bernard Szymanski', hon: 'Mr', amt: 7200, room: 209, ins: 0, fac: 0, hours: 620 },
  };
  const FEM = ['Ines', 'Dorothy', 'Eleanor', 'Margaret', 'Beatrice', 'Ruth', 'Agnes', 'Clara', 'Mabel', 'Constance', 'Josephine', 'Lorraine', 'Priscilla', 'Wilhelmina', 'Florence', 'Hazel', 'Vera', 'Doris', 'Nina', 'Pearl', 'Harriet', 'Rosalind'];
  const TYPE_TEXT = { mn: 'medical necessity denial', be: 'benefit exclusion', un: 'unclassified denial' };
  const TRACK_TEXT = { ms: 'mid-stay termination', pa: 'prior authorisation' };

  function buildPairs(base, c) {
    const D = window.AE_DATA;
    const parts = c.name.split(' '), first = parts[0], last = parts.slice(1).join(' ');
    const hon = FEM.indexOf(first) >= 0 ? 'Ms' : 'Mr';
    const bparts = base.name.split(' '), bfirst = bparts[0], blast = bparts.slice(1).join(' ');
    const pairs = [
      [base.name, c.name],
      [bfirst[0] + '. ' + blast, first[0] + '. ' + last],
      [base.hon + ' ' + blast, hon + ' ' + last],
      [blast, last],
      [bfirst, first],
      ['#' + base.id, '#' + c.id],
      [String(base.id), String(c.id)],
      ['$' + base.amt.toLocaleString('en-US'), money(c.amt)],
      [base.amt.toLocaleString('en-US'), c.amt.toLocaleString('en-US')],
      ['Room ' + base.room, 'Room ' + c.room],
      ['medical necessity denial · mid-stay termination', TYPE_TEXT[c.type] + ' · ' + TRACK_TEXT[c.track]],
      [pillText(base.hours), pillText(c.hours)],
      ['Nearest: ' + pillText(base.hours).replace(' left', ''), 'Nearest: ' + pillText(c.hours).replace(' left', '')],
    ];
    if (c.ins !== base.ins) {
      pairs.push([D.INSURERS[base.ins], D.INSURERS[c.ins]]);
      pairs.push([D.INSURERS[base.ins].split(' ')[0], D.INSURERS[c.ins].split(' ')[0]]);
    }
    if (c.fac !== base.fac) pairs.push([D.FACILITIES[base.fac], D.FACILITIES[c.fac]]);
    if (c.track === 'pa') {
      pairs.push(['Notice of coverage termination', 'Notice of prior authorisation denial']);
      pairs.push(['Mid-stay termination', 'Prior authorisation']);
    }
    if (c.type === 'be') pairs.push(['Medical necessity', 'Benefit exclusion']);
    if (c.type === 'un') pairs.push(['Medical necessity', 'Unclassified — confirm the type']);
    return pairs;
  }
  function subText(t, pairs) { for (let i = 0; i < pairs.length; i++) { if (t.indexOf(pairs[i][0]) >= 0) t = t.split(pairs[i][0]).join(pairs[i][1]); } return t; }
  function inChrome(el, container) {
    for (let p = el; p && p !== container; p = p.parentElement) {
      if (p.tagName === 'OPTION' || p.tagName === 'SELECT') return true;
      if (p.classList && (p.classList.contains('rail') || p.classList.contains('railmin') || p.classList.contains('sidebar'))) return true;
    }
    return false;
  }
  function retarget(container, screenKey) {
    const base = BASES[screenKey]; if (!base) return;
    const id = overrideId(); if (!id || id === base.id) return;
    const c = findCase(id); if (!c) return;
    const pairs = buildPairs(base, c);
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!n.nodeValue || inChrome(n.parentElement, container)) return;
      const t = subText(n.nodeValue, pairs);
      if (t !== n.nodeValue) n.nodeValue = t;
    });
    container.querySelectorAll('[data-tip],[title],[placeholder]').forEach(function (el) {
      if (inChrome(el, container)) return;
      ['data-tip', 'title', 'placeholder'].forEach(function (at) {
        const v = el.getAttribute(at); if (!v) return;
        const t = subText(v, pairs); if (t !== v) el.setAttribute(at, t);
      });
    });
    container.querySelectorAll('textarea,input').forEach(function (el) {
      if (inChrome(el, container) || !el.value) return;
      const t = subText(el.value, pairs); if (t !== el.value) el.value = t;
    });
    // deadline pills recoloured to this case's real urgency
    const pt = pillText(c.hours), tr = tierOf(c.hours);
    container.querySelectorAll('.pill').forEach(function (pl) {
      const txt = pl.textContent.trim();
      if (txt === pt || txt === 'Nearest: ' + pt.replace(' left', '')) {
        pl.classList.remove('overdue', 'critical', 'urgent', 'routine'); pl.classList.add(tr);
      }
    });
    // the open-cases rail highlights the case actually open
    const rows = container.querySelectorAll('.rc');
    let hit = null; rows.forEach(function (r) { if (r.textContent.indexOf(c.name) >= 0) hit = r; });
    if (hit) { rows.forEach(function (r) { r.classList.remove('cur'); }); hit.classList.add('cur'); }
  }

  const NAVMAP = [
    [/termination response/i, ['familyaor', null, 'The termination checklist screen is not in this demo yet — opening the family page, the piece that is']],
    [/Vera’s page/i, ['familyaor', 'vera']],
    [/Sent to Dr Okafor via/i, ['physicianlink', null, 'This is the page Dr Okafor receives by text']],
    [/Resident portal link|Resident portal artboard/i, ['residentportal', null, 'This is the page the resident receives by text']],
    [/new stay form/i, ['newstay']],
    [/review queue/i, ['queue', 'review']],
    [/Opens Settings/i, ['settings']],
    [/1 · Case queue|case queue/i, ['queue']],
    [/2 · Intake|Opens intake|Intake artboard/i, ['intake']],
    [/meeting brief/i, ['stayboard', 'meeting']],
    [/Stay board/i, ['stayboard']],
    [/draft review/i, ['draftreview']],
    [/5 · Facilities/i, ['dashboard']],
    [/payer intelligence|6 · Payer/i, ['payers']],
    [/8 · Outcome/i, ['outcome']],
    [/resident portal/i, ['residentportal']],
    [/Resident filing packet|filing packet artboard/i, ['residentpacket']],
    [/family page/i, ['familyaor']],
    [/Case detail artboard|3 · Case detail/i, ['casedetail']],
  ];
  function navFromMessage(msg) {
    // any case number routes to that person's own page, with their data on it
    const caseRef = msg.match(/[Cc]ase #(\d{4})/);
    if (caseRef && /case detail|in place|Cases page/i.test(msg)) {
      const id = +caseRef[1];
      const c = findCase(id);
      setOverride(id);
      go(c && (c.stage === 'Filed' || c.stage === 'Decided') ? 'outcome' : 'casedetail');
      return true;
    }
    for (const [re, dest] of NAVMAP) {
      if (re.test(msg)) {
        if (/queue filtered to/.test(msg)) {
          const q = (msg.match(/“([^”]+)”/) || [])[1];
          if (q) try { sessionStorage.setItem('ae:pendingQuery', q); } catch (e) {}
        }
        if (dest[2]) shellToast(dest[2]);
        go(dest[0], dest[1]);
        return true;
      }
    }
    return false;
  }

  // sidebar items navigate for real
  const NAV_LABELS = {
    'Stay board': ['stayboard'], 'Cases': ['queue'], 'Facilities': ['dashboard'], 'Payers': ['payers'],
    'Settings': ['settings'], 'Board': ['stayboard'], 'New stay': ['newstay'], 'New denial': ['intake'],
    'Review': ['queue', 'review'], 'Add facility': ['settings'], 'Meeting brief': ['stayboard', 'meeting'],
  };
  function navFromSidebar(el, screenKey) {
    const label = (el.textContent || '').replace(/\d+$/, '').trim();
    if (label === 'View all') { go(screenKey === 'dashboard' ? 'dashboard' : 'queue'); return true; }
    const dest = NAV_LABELS[label];
    if (dest) { go(dest[0], dest[1]); return true; }
    return false;
  }

  // ---------- flow hooks: actions that complete a stage move to its next screen ----------
  const ACTION_HOOKS = {
    draftreview: { key: 'confirmSign', after: (c) => { if (c.state.signed) { shellToast('Signed \u2014 the filing packet is prepared. Opening it.'); setTimeout(() => go('packet'), 900); } } },
  };
  function applyActionHooks(screenKey, comp, vals) {
    const h = ACTION_HOOKS[screenKey];
    if (!h || typeof vals[h.key] !== 'function') return;
    const orig = vals[h.key];
    vals[h.key] = function () { orig.apply(null, arguments); setTimeout(() => h.after(comp), 30); };
  }

  // ---------- real file choose/drop, dummy-processed ----------
  function openFilePicker(cb) {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.pdf,.png,.jpg,.jpeg,.txt,.tif,.tiff';
    inp.style.display = 'none'; document.body.appendChild(inp);
    inp.addEventListener('change', () => { const f = inp.files && inp.files[0]; document.body.removeChild(inp); if (f) cb(f); });
    inp.click();
  }
  const FILE_HOOKS = {
    intake: { key: 'fakeDrop', ready: (c) => c.state.step === 1,
      run: (c, vals, f) => { shellToast('Reading \u201c' + f.name + '\u201d\u2026'); c.start('whit'); } },
    draftreview: { key: 'uploadDemo', ready: (c) => !!c.state.uploadOpen,
      run: (c, vals, f) => { shellToast('\u201c' + f.name + '\u201d attached'); vals.uploadDemo(); } },
    outcome: { key: 'dropLetter', ready: (c) => !c.state.letter,
      run: (c, vals, f) => { shellToast('Reading \u201c' + f.name + '\u201d\u2026'); vals.dropLetter(); } },
    newstay: { key: 'attachAuth', ready: (c) => !c.state.authFile && !c.state.created,
      run: (c, vals, f) => { c.setState({ authFile: f.name }); shellToast('\u201c' + f.name + '\u201d attached as the authorisation letter'); } },
  };
  function applyFileHooks(screenKey, comp, vals) {
    const h = FILE_HOOKS[screenKey];
    if (!h || typeof vals[h.key] !== 'function') return;
    const orig = vals[h.key];
    vals[h.key] = () => openFilePicker((f) => h.run(comp, { [h.key]: orig }, f));
  }
  document.addEventListener('dragover', (e) => { e.preventDefault(); });
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f || !current || current.dead) return;
    const h = FILE_HOOKS[current.screenKey];
    if (h && h.ready(current.comp)) {
      const vals = current.comp.renderVals();
      if (typeof vals[h.key] === 'function') h.run(current.comp, vals, f);
      else shellToast('\u201c' + f.name + '\u201d \u2014 nothing on this step accepts a file');
    } else shellToast('\u201c' + f.name + '\u201d \u2014 nothing on this screen accepts a file right now');
  });

  // ---------- template engine ----------
  const BOOL_PROPS = { checked: 1, disabled: 1, readonly: 1 };
  const EVENT_MAP = { onclick: 'click', ondoubleclick: 'dblclick', onchange: '_change', oninput: 'input', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave', onmousemove: 'mousemove', onmouseup: 'mouseup', onmousedown: 'mousedown', onkeydown: 'keydown' };

  function resolvePath(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    const parts = path.split('.');
    let v = scope[parts[0]];
    for (let i = 1; i < parts.length && v != null; i++) v = v[parts[i]];
    return v;
  }
  function interpolate(str, scope) {
    return str.replace(/\{\{([^}]+)\}\}/g, (m, p) => { const v = resolvePath(p, scope); return v == null ? '' : String(v); });
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function renderNode(node, scope, out, fkPath, inSvg) {
    if (node.t === 'x') {
      const t = node.s;
      out.appendChild(document.createTextNode(t.indexOf('{{') >= 0 ? interpolate(t, scope) : t));
      return;
    }
    const tag = node.tag;
    if (tag === 'sc-for') {
      const list = resolvePath((node.attrs.list || '').replace(/[{}]/g, ''), scope) || [];
      const as = node.attrs.as || 'item';
      list.forEach((item, i) => {
        const s2 = Object.create(scope); s2[as] = item; s2.$index = i;
        let k = 0;
        for (const c of node.kids) renderNode(c, s2, out, fkPath + '.' + i + '_' + (k++), inSvg);
      });
      return;
    }
    if (tag === 'sc-if') {
      const cond = resolvePath((node.attrs.value || '').replace(/[{}]/g, ''), scope);
      if (cond) { let k = 0; for (const c of node.kids) renderNode(c, scope, out, fkPath + '.if' + (k++), inSvg); }
      return;
    }
    const svgHere = inSvg || tag === 'svg';
    const el = svgHere ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    let deferredValue;
    for (const name in node.attrs) {
      const raw = node.attrs[name];
      if (name.startsWith('hint-')) continue;
      const lname = name.toLowerCase();
      if (EVENT_MAP[lname]) {
        const holeMatch = raw.match(/^\{\{([^}]+)\}\}$/);
        if (holeMatch) {
          const fn = resolvePath(holeMatch[1], scope);
          if (typeof fn === 'function') {
            let ev = EVENT_MAP[lname];
            if (ev === '_change') ev = (tag === 'select' || (tag === 'input' && /checkbox|radio/.test(node.attrs.type || ''))) ? 'change' : 'input';
            el.addEventListener(ev, fn);
          } else if (lname === 'onclick') {
            el.addEventListener('click', () => shellToast('Nothing happens here in this demo state'));
          }
        }
        continue;
      }
      const holeOnly = raw.match(/^\{\{([^}]+)\}\}$/);
      const v = holeOnly ? resolvePath(holeOnly[1], scope) : (raw.indexOf('{{') >= 0 ? interpolate(raw, scope) : raw);
      if (typeof v === 'function') continue;
      if (name === 'value') { deferredValue = v == null ? '' : String(v); continue; }
      if (BOOL_PROPS[name]) { if (v && v !== 'false') el.setAttribute(name, ''); if (name === 'checked') el.checked = !!(v && v !== 'false'); continue; }
      if (v != null && v !== '') el.setAttribute(name, String(v));
      else if (!holeOnly && raw === '') el.setAttribute(name, '');
    }
    let k = 0;
    for (const c of node.kids) renderNode(c, scope, el, fkPath + '.' + (k++), svgHere);
    if (deferredValue !== undefined) el.value = deferredValue;
    if (tag === 'input' || tag === 'textarea' || tag === 'select') el.setAttribute('data-fk', fkPath);
    out.appendChild(el);
  }

  // ---------- responsive layout ----------
  const BAR_H = 46;
  let lastMobile = null;
  function isMobile() { return window.innerWidth < 1024; }
  function hscrolls(el) { return !!el && el.nodeType === 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowX); }
  function responsify() {
    const container = $('#screen-root');
    const root = container.firstElementChild;
    if (!root || !root.style) return;
    root.classList.add('ae-root');
    root.style.width = '100%';
    if (!isMobile()) {
      root.style.height = 'calc(100vh - ' + BAR_H + 'px)';
      root.style.minHeight = '620px';
      root.style.minWidth = '1240px';
      document.body.style.overflowX = window.innerWidth < 1240 ? 'auto' : '';
      return;
    }
    // mobile: stack panes and unroll internal scrolling so the page itself scrolls
    document.body.style.overflowX = '';
    root.classList.add('ae-stack');
    root.style.minWidth = '0';
    root.style.minHeight = 'calc(100vh - ' + BAR_H + 'px)';
    const vw = window.innerWidth;
    const all = () => container.querySelectorAll('*');
    all().forEach((el) => {
      const st = el.style;
      if (!st || el === root) return;
      if (st.position === 'absolute' || st.position === 'fixed') return;
      if (/(auto|scroll|hidden)/.test(st.overflow)) { st.overflow = 'visible'; st.overflowX = 'auto'; }
      if (/(auto|scroll)/.test(st.overflowY)) st.overflowY = 'visible';
      if (st.height === '100%') st.height = 'auto';
      else if (st.height && st.height.endsWith('px') && parseFloat(st.height) > 420) st.height = 'auto';
    });
    // stack column-like flex rows: two or more tall children side by side never fit a phone
    all().forEach((el) => {
      const cs = getComputedStyle(el);
      if (hscrolls(el)) return;
      const isRowFlex = cs.display === 'flex' && cs.flexDirection.indexOf('column') < 0;
      const isMultiColGrid = cs.display === 'grid' && cs.gridTemplateColumns.trim().split(/\s+/).length > 1;
      if (!isRowFlex && !isMultiColGrid) return;
      const kids = Array.from(el.children).filter((ch) => ch.nodeType === 1 && getComputedStyle(ch).position !== 'absolute' && ch.getBoundingClientRect().height > 0);
      const tall = kids.filter((ch) => ch.getBoundingClientRect().height > 160);
      if (tall.length >= 2) {
        if (isMultiColGrid) el.style.gridTemplateColumns = '1fr';
        else { el.style.flexDirection = 'column'; el.style.height = 'auto'; }
        kids.forEach((ch) => { ch.style.maxWidth = '100%'; ch.style.minWidth = '0'; ch.style.boxSizing = 'border-box'; if (isRowFlex) { ch.style.width = '100%'; ch.style.flex = 'none'; } if (ch.style.height === '100%') ch.style.height = 'auto'; });
      }
    });
    // measured passes: anything wider than the viewport is reined in
    for (let pass = 0; pass < 2; pass++) {
      all().forEach((el) => {
        if (el === root || !(el.getBoundingClientRect)) return;
        const cs = getComputedStyle(el);
        if (cs.position === 'absolute' || cs.position === 'fixed') return;
        const w = el.getBoundingClientRect().width;
        const over = w > vw + 6 || (el.scrollWidth > el.clientWidth + 6 && el.clientWidth >= vw - 40);
        if (!over) return;
        if (hscrolls(el) || hscrolls(el.parentElement)) return;
        const tag = el.tagName;
        if (/^(TABLE|THEAD|TBODY|TFOOT|TR|TD|TH|COLGROUP|COL)$/.test(tag)) return; // tables get a scroller below
        if (cs.display === 'grid') {
          const cols = cs.gridTemplateColumns.split(' ').length;
          if (cols > 1) el.style.gridTemplateColumns = '1fr';
        } else if (cs.display === 'flex' && cs.flexDirection.indexOf('column') < 0) {
          el.style.flexWrap = 'wrap';
          Array.from(el.children).forEach((ch) => {
            if (!ch.style || getComputedStyle(ch).position === 'absolute') return;
            if (ch.getBoundingClientRect().width > vw * 0.55) { ch.style.width = '100%'; ch.style.maxWidth = '100%'; ch.style.flex = 'none'; ch.style.boxSizing = 'border-box'; }
          });
        }
        el.style.maxWidth = '100%';
        el.style.boxSizing = 'border-box';
        if (cs.minWidth !== '0px' && cs.minWidth.indexOf('px') > 0 && parseFloat(cs.minWidth) > vw - 32) el.style.minWidth = '0';
        if (el.style.width && el.style.width.endsWith('px') && parseFloat(el.style.width) > vw - 32) el.style.width = 'auto';
      });
    }
    // final catch-all: anything still crossing the right edge is capped
    all().forEach((el) => {
      if (el.tagName && /^(TABLE|THEAD|TBODY|TFOOT|TR|TD|TH|COLGROUP|COL)$/.test(el.tagName)) return;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 6 && !hscrolls(el) && !hscrolls(el.parentElement) && getComputedStyle(el).position !== 'fixed') {
        el.style.maxWidth = '100%'; el.style.boxSizing = 'border-box'; el.style.minWidth = '0';
        if (el.style.width && el.style.width.endsWith('px')) el.style.width = 'auto';
      }
    });
    // any table wider than the phone gets its own horizontal scroller
    container.querySelectorAll('table').forEach((t) => {
      if (t.getBoundingClientRect().width > vw + 2 || t.scrollWidth > vw + 2) {
        const p = t.parentElement;
        if (p && p !== root) { p.style.overflowX = 'auto'; p.style.maxWidth = '100%'; }
      }
    });
  }

  // ---------- component host ----------
  let current = null; // { comp, tpl, container, screenKey, scenario, renderScheduled }

  function jsonSafe(state) {
    try {
      return JSON.stringify(state, (k, v) => (typeof v === 'function' || (k && k.charAt(0) === '_')) ? undefined : v);
    } catch (e) { return null; }
  }
  function stateKey(screenKey, scenario) {
    const id = overrideId();
    return STORE_PREFIX + screenKey + ':' + scenario + (BASES[screenKey] && id && id !== BASES[screenKey].id ? '@' + id : '');
  }
  function persist() {
    if (!current) return;
    const s = jsonSafe(current.comp.state);
    if (s) try { localStorage.setItem(stateKey(current.screenKey, current.scenario), s); } catch (e) {}
  }

  function renderCurrent() {
    if (!current || current.dead) return;
    const c = current;
    c.renderScheduled = false;
    let vals;
    try { vals = c.comp.renderVals(); applyFileHooks(c.screenKey, c.comp, vals); applyActionHooks(c.screenKey, c.comp, vals); } catch (e) { console.error(e); shellToast('Render error: ' + e.message); return; }
    // focus bookkeeping
    const ae = document.activeElement;
    const fk = ae && ae.getAttribute && ae.getAttribute('data-fk');
    const selStart = fk && ae.selectionStart != null ? ae.selectionStart : null;
    // scroll bookkeeping: a state change must not throw away where the reader was
    const pathOf = (el) => { const path = []; for (let e = el; e && e !== c.container && e.parentElement; e = e.parentElement) path.unshift(Array.prototype.indexOf.call(e.parentElement.children, e)); return path.join('.'); };
    const scrolls = [];
    c.container.querySelectorAll('*').forEach((el) => { if (el.scrollTop || el.scrollLeft) scrolls.push([pathOf(el), el.scrollTop, el.scrollLeft]); });
    const winY = window.scrollY;
    const frag = document.createDocumentFragment();
    for (const n of c.tpl) renderNode(n, vals, frag, 'r', false);
    c.container.textContent = '';
    c.container.appendChild(frag);
    if (fk) {
      const nel = c.container.querySelector('[data-fk="' + fk + '"]');
      if (nel) { nel.focus(); if (selStart != null && nel.setSelectionRange) try { nel.setSelectionRange(selStart, selStart); } catch (e) {} }
    }
    responsify();
    retarget(c.container, c.screenKey);
    // queue: the Review sub-item is current when the review view is open
    if (c.screenKey === 'queue') {
      const inReview = c.comp.state.view === 'review';
      c.container.querySelectorAll('.navsub').forEach((el) => {
        const t = el.textContent.trim();
        if (t === 'View all' || t === 'Review') el.classList.toggle('on', inReview === (t === 'Review'));
      });
    }
    scrolls.forEach(([path, st, sl]) => {
      let el = c.container;
      for (const i of path.split('.')) { el = el && el.children[i]; if (!el) return; }
      if (el) { el.scrollTop = st; el.scrollLeft = sl; }
    });
    if (winY) window.scrollTo(0, winY);
  }
  function scheduleRender() {
    if (!current || current.renderScheduled) return;
    current.renderScheduled = true;
    requestAnimationFrame(renderCurrent);
  }

  function mount() {
    const { screen, state } = route();
    const def = SCREENS[screen];
    const scenario = state && def.variants.some(v => v[1] === state) ? state : 'default';
    try { localStorage.setItem(STORE_PREFIX + screen + ':scenario', scenario); } catch (e) {}
    if (current) { current.dead = true; persist(); }

    document.title = 'Appeal Engine · ' + def.title;

    // style
    $('#screen-style').textContent = def.style;

    // template (pre-parsed JSON tree — the HTML parser never touches it)
    const tpl = def.tree;

    // component
    const container = $('#screen-root');
    container.textContent = '';
    const props = {};
    for (const k in def.props) { const p = def.props[k]; if (p && typeof p === 'object' && 'default' in p) props[k] = p.default; }
    props.scenario = scenario;

    const me = { dead: false, screenKey: screen, scenario, container, tpl, renderScheduled: false };
    current = me;

    class DCLogic {
      constructor(p) { this.props = p; this.state = {}; }
      setState(patch) { if (me.dead) return; Object.assign(this.state, patch); scheduleRender(); persist(); }
      forceUpdate() { if (!me.dead) scheduleRender(); }
    }
    let Component;
    try {
      Component = new Function('DCLogic', def.script + '\nreturn Component;')(DCLogic);
    } catch (e) { console.error(e); shellToast('Screen failed to load: ' + e.message); return; }
    const comp = new Component(props);
    me.comp = comp;

    // wrap say(): cross-screen messages become real navigation
    const origSay = comp.say ? comp.say.bind(comp) : null;
    comp.say = (msg) => { if (me.dead) return; if (navFromMessage(msg)) return; if (origSay) origSay(msg); else shellToast(msg); };

    // first render applies the scenario; then overlay any saved state; render
    try { comp.renderVals(); } catch (e) { console.error(e); }
    try {
      const saved = localStorage.getItem(stateKey(screen, scenario));
      if (saved) Object.assign(comp.state, JSON.parse(saved));
    } catch (e) {}
    // phones: the open-cases rail starts collapsed so the case itself leads
    if (isMobile() && (screen === 'casedetail' || screen === 'packet' || screen === 'outcome') && comp.state.railOpen === undefined) comp.state.railOpen = false;
    // another person's case: their stage and assignee, not the sample's
    const ovr = overrideId();
    if (screen === 'casedetail' && ovr && ovr !== 2418) {
      const oc = findCase(ovr);
      if (oc && !('stage' in (JSON.parse(localStorage.getItem(stateKey(screen, scenario)) || '{}')))) {
        comp.state.stage = oc.stage === 'Filed' || oc.stage === 'Decided' ? 'In review' : oc.stage;
        comp.state.who = oc.who || '';
      }
    }
    // pending queue search from another screen's header
    try {
      const pq = sessionStorage.getItem('ae:pendingQuery');
      if (pq && screen === 'queue') {
        sessionStorage.removeItem('ae:pendingQuery');
        const vals = comp.renderVals();
        if (vals.setQuery) vals.setQuery({ target: { value: pq } });
      }
    } catch (e) {}
    renderCurrent();
  }

  // facility chip: a small menu that narrows the dashboard to that facility
  let facMenu = null;
  function closeFacMenu() { if (facMenu) { facMenu.remove(); facMenu = null; } }
  function openFacMenu(chip) {
    closeFacMenu();
    const items = [
      ['All facilities', 'dashboard', 'default'],
      ['Lakeview Care Center', 'dashboard', 'lakeview'],
      ['Prairie Meadows Rehabilitation', 'dashboard', 'prairie'],
      ['Northgate Skilled Nursing', 'dashboard', 'northgate'],
    ];
    const m = document.createElement('div');
    m.style.cssText = 'position:fixed; z-index:120; background:#fff; border:0.5px solid #D3D3CE; border-radius:8px; box-shadow:0 8px 24px rgba(28,28,26,.14); padding:4px; min-width:230px; font-size:13px;';
    items.forEach(([label, scr, st]) => {
      const it = document.createElement('div');
      it.textContent = label;
      it.style.cssText = 'padding:7px 10px; border-radius:6px; cursor:pointer; color:#33332F;';
      it.addEventListener('mouseenter', () => { it.style.background = '#F5F5F4'; });
      it.addEventListener('mouseleave', () => { it.style.background = ''; });
      it.addEventListener('click', (ev) => { ev.stopPropagation(); closeFacMenu(); go(scr, st); });
      m.appendChild(it);
    });
    const note = document.createElement('div');
    note.textContent = 'Dashboards narrow to the facility. The demo’s live cases all run at Lakeview.';
    note.style.cssText = 'padding:6px 10px 5px; color:#8A8A84; font-size:12px; border-top:0.5px solid #E7E7E4; margin-top:3px;';
    m.appendChild(note);
    document.body.appendChild(m);
    const r = chip.getBoundingClientRect();
    m.style.left = Math.max(8, r.left) + 'px';
    m.style.top = (r.bottom + 4) + 'px';
    facMenu = m;
  }
  document.addEventListener('click', () => closeFacMenu());

  // sidebar navigation by delegation (runs before component handlers)
  document.addEventListener('click', (e) => {
    const fac = e.target.closest && e.target.closest('.fac');
    if (fac && $('#screen-root').contains(fac)) {
      e.stopPropagation(); e.preventDefault();
      if (facMenu) closeFacMenu(); else openFacMenu(fac);
      return;
    }
    const nav = e.target.closest && e.target.closest('.nav, .navsub');
    if (nav && $('#screen-root').contains(nav)) {
      document.body.classList.remove('nav-open');
      if (navFromSidebar(nav, route().screen)) { e.stopPropagation(); e.preventDefault(); }
    }
  }, true);

  // persist on unload too
  window.addEventListener('beforeunload', persist);

  // ---------- shell init ----------
  window.addEventListener('DOMContentLoaded', () => {
    $('#reset-all').addEventListener('click', () => {
      try { for (const k of Object.keys(localStorage)) if (k.startsWith(STORE_PREFIX)) localStorage.removeItem(k); } catch (e) {}
      try { sessionStorage.removeItem('ae:case'); sessionStorage.removeItem('ae:pendingQuery'); } catch (e) {}
      location.hash = '#/stayboard/default'; mount(); shellToast('Demo reset — all saved state cleared');
    });
    // responsive: remount when crossing the mobile breakpoint, otherwise re-fit
    lastMobile = isMobile();
    window.addEventListener('resize', () => {
      const m = isMobile();
      if (m !== lastMobile) { lastMobile = m; mount(); } else responsify();
    });
    $('#menu-btn').addEventListener('click', (e) => { e.stopPropagation(); document.body.classList.toggle('nav-open'); });
    document.addEventListener('click', (e) => { if (e.target === document.body) document.body.classList.remove('nav-open'); });
    mount();
  });
})();
