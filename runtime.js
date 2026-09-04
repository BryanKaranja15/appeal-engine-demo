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
  const NAVMAP = [
    [/Vera\u2019s page/i, ['familyaor', 'vera']],
    [/case #24\d\d|Case detail artboard|3 \u00b7 Case detail/i, ['casedetail']],
    [/1 \u00b7 Case queue|case queue/i, ['queue']],
    [/2 \u00b7 Intake|Opens intake|Intake artboard/i, ['intake']],
    [/meeting brief/i, ['stayboard', 'meeting']],
    [/Stay board/i, ['stayboard']],
    [/draft review/i, ['draftreview']],
    [/5 \u00b7 Facilities/i, ['dashboard']],
    [/payer intelligence|6 \u00b7 Payer/i, ['payers']],
    [/8 \u00b7 Outcome/i, ['outcome']],
    [/resident portal|Resident portal artboard/i, ['residentportal']],
    [/Resident filing packet|filing packet artboard/i, ['residentpacket']],
    [/family page/i, ['familyaor']],
  ];
  function navFromMessage(msg) {
    for (const [re, dest] of NAVMAP) {
      if (re.test(msg)) {
        if (/queue filtered to/.test(msg)) {
          const q = (msg.match(/\u201c([^\u201d]+)\u201d/) || [])[1];
          if (q) try { sessionStorage.setItem('ae:pendingQuery', q); } catch (e) {}
        }
        shellToast(msg);
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
    try { vals = c.comp.renderVals(); applyFileHooks(c.screenKey, c.comp, vals); } catch (e) { console.error(e); shellToast('Render error: ' + e.message); return; }
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

    // shell controls
    const scrSel = $('#screen-sel'); if (scrSel.value !== screen) scrSel.value = screen;
    const stSel = $('#state-sel');
    stSel.innerHTML = def.variants.map(v => '<option value="' + v[1] + '"' + (v[1] === scenario ? ' selected' : '') + '>' + v[0] + '</option>').join('');
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
    const nav = e.target.closest && e.target.closest('.nav, .navsub');
    if (nav && $('#screen-root').contains(nav)) {
      if (navFromSidebar(nav, route().screen)) { e.stopPropagation(); e.preventDefault(); }
    }
  }, true);

  // persist on unload too
  window.addEventListener('beforeunload', persist);

  // ---------- shell init ----------
  window.addEventListener('DOMContentLoaded', () => {
    const scrSel = $('#screen-sel');
    scrSel.innerHTML = Object.keys(SCREENS).map(k => '<option value="' + k + '">' + SCREENS[k].title + '</option>').join('');
    scrSel.addEventListener('change', () => go(scrSel.value));
    $('#state-sel').addEventListener('change', (e) => go(route().screen, e.target.value));
    $('#reset-one').addEventListener('click', () => {
      const { screen } = route();
      try { for (const k of Object.keys(localStorage)) if (k.startsWith(STORE_PREFIX + screen + ':')) localStorage.removeItem(k); } catch (e) {}
      mount(); shellToast('This screen was reset to its starting state');
    });
    $('#reset-all').addEventListener('click', () => {
      try { for (const k of Object.keys(localStorage)) if (k.startsWith(STORE_PREFIX)) localStorage.removeItem(k); } catch (e) {}
      location.hash = '#/stayboard/default'; mount(); shellToast('Demo reset — all saved state cleared');
    });
    // scale the fixed 1440x900 screen to the viewport
    const fit = () => {
      const wrap = $('#screen-scale');
      const scale = Math.min(1, (window.innerWidth - 24) / 1440);
      wrap.style.transform = 'scale(' + scale + ')';
      wrap.style.height = (900 * scale) + 'px';
    };
    window.addEventListener('resize', fit); fit();
    mount();
  });
})();
