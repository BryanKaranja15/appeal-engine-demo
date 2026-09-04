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
  const CASE_PAGES = { 2418: ['casedetail', 'Eleanor Whitfield'], 2395: ['outcome', 'Bernard Szymanski'] };
  const NAVMAP = [
    [/termination response/i, ['familyaor', null, 'The termination-response checklist is the next build round \u2014 opening the piece that is built: the family page for Vera\u2019s representative']],
    [/Vera\u2019s page/i, ['familyaor', 'vera']],
    [/Sent to Dr Okafor/i, ['physicianlink', null, 'Sent to Dr Okafor by text \u2014 this is the page he receives']],
    [/Resident portal link|Resident portal artboard/i, ['residentportal', null, 'Portal link sent by text \u2014 this is the page Eleanor receives']],
    [/1 \u00b7 Case queue|case queue/i, ['queue']],
    [/2 \u00b7 Intake|Opens intake|Intake artboard/i, ['intake']],
    [/meeting brief/i, ['stayboard', 'meeting']],
    [/Stay board/i, ['stayboard']],
    [/draft review/i, ['draftreview']],
    [/5 \u00b7 Facilities/i, ['dashboard']],
    [/payer intelligence|6 \u00b7 Payer/i, ['payers']],
    [/8 \u00b7 Outcome/i, ['outcome']],
    [/resident portal/i, ['residentportal']],
    [/Resident filing packet|filing packet artboard/i, ['residentpacket']],
    [/family page/i, ['familyaor']],
    [/case #24\d\d|Case detail artboard|3 \u00b7 Case detail/i, ['casedetail']],
  ];
  function navFromMessage(msg) {
    // a case number routes to that person's own page \u2014 or says honestly that only some cases are built out
    const caseRef = msg.match(/[Cc]ase #(\d{4})|#(\d{4}) /);
    if (caseRef && /case detail|opens in place|in place\.|Case detail artboard/i.test(msg)) {
      const id = +(caseRef[1] || caseRef[2]);
      const pg = CASE_PAGES[id];
      if (pg) {
        shellToast('Case #' + id + ' \u00b7 ' + pg[1]);
        setTimeout(() => go(pg[0]), 600);
      } else {
        shellToast('Case #' + id + ' follows the same flow \u2014 the demo builds #2418 \u00b7 Eleanor Whitfield end to end. Open her case to walk it.');
      }
      return true;
    }
    for (const [re, dest] of NAVMAP) {
      if (re.test(msg)) {
        if (/queue filtered to/.test(msg)) {
          const q = (msg.match(/\u201c([^\u201d]+)\u201d/) || [])[1];
          if (q) try { sessionStorage.setItem('ae:pendingQuery', q); } catch (e) {}
        }
        shellToast(dest[2] || msg);
        setTimeout(() => go(dest[0], dest[1]), 700);
        return true;
      }
    }
    return false;
  }

  // sidebar items navigate for real
  const NAV_LABELS = {
    'Stay board': ['stayboard'], 'Cases': ['queue'], 'Facilities': ['dashboard'], 'Payers': ['payers'],
    'Board': ['stayboard'], 'New denial': ['intake'], 'Review · #2418 Whitfield': ['casedetail'],
    'Meeting brief': ['stayboard', 'meeting'],
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
    draftreview: { key: 'confirmSign', after: (c) => { if (c.state.signed) { shellToast('Signed \u2014 packet PK-2418-01 is prepared. Opening it.'); setTimeout(() => go('packet'), 900); } } },
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
      run: (c, vals, f) => { shellToast('Reading \u201c' + f.name + '\u201d \u2014 the demo processes every upload as the Meridian sample letter'); c.start('whit'); } },
    draftreview: { key: 'uploadDemo', ready: (c) => !!c.state.uploadOpen,
      run: (c, vals, f) => { shellToast('\u201c' + f.name + '\u201d attached \u2014 the demo files it as the matching record document'); vals.uploadDemo(); } },
    outcome: { key: 'dropLetter', ready: (c) => !c.state.letter,
      run: (c, vals, f) => { shellToast('Reading \u201c' + f.name + '\u201d \u2014 the demo loads the sample decision letter'); vals.dropLetter(); } },
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
  function persist() {
    if (!current) return;
    const s = jsonSafe(current.comp.state);
    if (s) try { localStorage.setItem(STORE_PREFIX + current.screenKey + ':' + current.scenario, s); } catch (e) {}
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
    const frag = document.createDocumentFragment();
    for (const n of c.tpl) renderNode(n, vals, frag, 'r', false);
    c.container.textContent = '';
    c.container.appendChild(frag);
    if (fk) {
      const nel = c.container.querySelector('[data-fk="' + fk + '"]');
      if (nel) { nel.focus(); if (selStart != null && nel.setSelectionRange) try { nel.setSelectionRange(selStart, selStart); } catch (e) {} }
    }
    responsify();
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
      const saved = localStorage.getItem(STORE_PREFIX + screen + ':' + scenario);
      if (saved) Object.assign(comp.state, JSON.parse(saved));
    } catch (e) {}
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

  // sidebar navigation by delegation (runs before component handlers)
  document.addEventListener('click', (e) => {
    const fac = e.target.closest && e.target.closest('.fac');
    if (fac && $('#screen-root').contains(fac)) {
      shellToast('Every screen in the demo shows Lakeview Care Center \u2014 switching facilities comes with onboarding, a later build round');
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
