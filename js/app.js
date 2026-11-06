/* =============== MAIN APPLICATION CONTROLLER =============== */
'use strict';

import { DEF, GN, FN, NUT, THEMES, TR } from './data.js';
import { KEYS, ls, isApp, bootStore } from './store.js';

// Application State Variable Container
const S = {
  L: 'ar',
  W: null,
  plans: [],
  cur: null,
  CF: {},
  LOG: {},
  ASG: {},
  PROG: [],
  GCK: {},
  WG: 8,
  WML: 250,
  VIEW: 'ex',
  LD: '',
  PM: 'w',
  swap: null,
  LG: {}
};

// Utilities & Logic Functions
const $ = i => document.getElementById(i);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => parseFloat(v) || 0;
const r1 = n => Math.round(n * 10) / 10;
const clone = o => JSON.parse(JSON.stringify(o));
const h = s => { let x = 5381; for (const c of s) x = ((x << 5) + x + c.charCodeAt(0)) | 0; return String(x); };
const iso = x => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
const pd = d => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd); };
const today = () => iso(new Date());
const addDays = (d, n) => { const x = pd(d); x.setDate(x.getDate() + n); return iso(x); };
const loc = () => S.L === 'ar' ? 'ar-EG' : 'en-GB';
const wkday = d => pd(d).toLocaleDateString(loc(), { weekday: 'long' });
const fdate = d => pd(d).toLocaleDateString(loc(), { day: 'numeric', month: 'short', year: 'numeric' });
const fmt = n => (isFinite(n) ? +n : 0).toLocaleString(S.L === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 1 });
const t = k => TR[S.L][k] || TR.en[k] || k;

const gname = g => g === 'cf' ? t('cfg') : (S.L === 'en' && GN[g]) || g;
const fname = n => (S.L === 'en' && FN[n]) || n;
const NF = n => S.CF[n] || NUT[n] || null;
const add = (T, x) => { T.k += x.k; T.p += x.p; T.c += x.c; T.f += x.f; return T; };
const itemM = it => { const n = NF(it.n); if (!n) return null; const f = num(it.q) / 100; return { k: n.k * f, p: n.p * f, c: n.c * f, f: n.f * f }; };
const mealM = m => m.man ? { k: num(m.k), p: num(m.p), c: num(m.c), f: num(m.f) } : m.items.reduce((T, it) => { const x = itemM(it); return x ? add(T, x) : T; }, { k: 0, p: 0, c: 0, f: 0 });
const bar = a => `<div class="bar">${a.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
const macBar = T => bar([[fmt(Math.round(T.k)), t('kcal')], [fmt(r1(T.p)), t('prot')], [fmt(r1(T.c)), t('carb')], [fmt(r1(T.f)), t('fat')]]);
const msg = (id, s, bad) => { const e = $(id); if (e) { e.textContent = s || ''; e.className = s ? (bad ? 'err' : 'okm') : ''; } };
const opts = g => (g === 'cf' ? Object.keys(S.CF) : Object.keys(S.W[g] || {})).map(k => `<option value="${esc(k)}">${esc(fname(k))}</option>`).join('');
const gopts = (cf, sel) => Object.keys(S.W).concat(cf && Object.keys(S.CF).length ? ['cf'] : []).map(k => `<option value="${esc(k)}"${k === sel ? ' selected' : ''}>${esc(gname(k))}</option>`).join('');

const P = () => S.plans.find(p => p.id === S.cur) || S.plans[0];
const savePlans = () => { ls.set('plans', S.plans); ls.set('cur', S.cur); };
const pk = () => 'prof:' + ((ls.get('acc', null) || {}).u || '');
const dl = d => S.LOG[d] || (S.LOG[d] = { c: {}, w: 0 });

// State Loader
function loadState() {
  S.W = ls.get('dw', null) || clone(DEF);
  for (const g in DEF) if (!S.W[g]) S.W[g] = clone(DEF[g]);
  S.plans = ls.get('plans', null);
  if (!Array.isArray(S.plans) || !S.plans.length) {
    S.plans = [{ id: 1, name: t('firstplan'), meals: [] }];
    ls.set('plans', S.plans);
  }
  S.plans.forEach(p => {
    p.meals = p.meals || [];
    p.meals.forEach(m => {
      m.items = m.items || [];
      if (m.man === undefined) m.man = (num(m.k) + num(m.p) + num(m.c) + num(m.f)) > 0;
    });
  });
  S.cur = ls.get('cur', S.plans[0].id);
  if (!S.plans.some(p => p.id === S.cur)) S.cur = S.plans[0].id;
  S.CF = ls.get('cf', {});
  S.LOG = ls.get('log', {});
  S.ASG = ls.get('assign', {});
  S.PROG = ls.get('prog', []);
  S.GCK = ls.get('gck', {});
  S.WG = ls.get('wg', 8);
  S.WML = ls.get('wml', 250);
  S.LD = S.LD || today();
}

// UI Engine Render Functions
function applyLang() {
  const d = document.documentElement;
  d.lang = S.L;
  d.dir = S.L === 'ar' ? 'rtl' : 'ltr';
  document.title = t('app');
  document.querySelectorAll('[data-i]').forEach(e => e.textContent = t(e.dataset.i));
  document.querySelectorAll('.lgb').forEach(b => b.textContent = S.L === 'ar' ? 'EN' : 'ع');
  document.querySelectorAll('#lgset button').forEach(b => b.classList.toggle('on', b.dataset.l === S.L));
  if ($('tout')) $('tout').innerHTML = '';
  if (!$('app').classList.contains('hide')) renderAll(); else showAuth();
}

function setLang(l) { S.L = l; ls.set('lang', S.L); applyLang(); }

function setTheme(x) {
  if (!THEMES[x]) x = 'dc';
  document.documentElement.setAttribute('data-theme', x);
  ls.set('theme', x);
  if ($('thsel')) $('thsel').value = x;
  document.querySelectorAll('#thbtn button').forEach(b => b.classList.toggle('on', b.dataset.t === x));
}

function showAuth() {
  const acc = ls.get('acc', null);
  $('app').classList.add('hide');
  $('login').classList.remove('hide');
  $('lt').textContent = t(acc ? 'login' : 'create');
  $('lb').textContent = t(acc ? 'enter' : 'mk');
  $('le').textContent = '';
}

function enter() { $('login').classList.add('hide'); $('app').classList.remove('hide'); go(S.VIEW); }

function renderWater() {
  const n = (S.LOG[today()] || {}).w || 0;
  if ($('wchip')) {
    $('wchip').innerHTML = `<button data-w="-1" aria-label="-">−</button><span class="${n >= S.WG ? 'ok' : ''}">💧 ${fmt(n)}/${fmt(S.WG)}</span><button data-w="1" aria-label="+">+</button>`;
  }
}

function renderEx() {
  const g0 = $('exg').value, a0 = $('exa').value;
  $('exg').innerHTML = gopts(false);
  if (g0 && S.W[g0]) $('exg').value = g0;
  $('exa').innerHTML = opts($('exg').value);
  if (a0 && S.W[$('exg').value][a0] !== undefined) $('exa').value = a0;
  exCalc();
}

function exCalc() {
  const g = $('exg').value, a = $('exa').value, q = num($('exq').value), base = (S.W[g] || {})[a];
  if (!base) { $('ext').innerHTML = ''; return; }
  $('ext').innerHTML = `<tr><th>${t('subst')}</th><th>${t('amt')}</th></tr>` +
    Object.entries(S.W[g]).filter(([k]) => k !== a).map(([k, w]) => `<tr><td>${esc(fname(k))}</td><td><b>${fmt(r1(q * w / base))}</b></td></tr>`).join('');
}

function fillProf(o) {
  ['age', 'h', 'w', 'bf', 'bmr', 'tdee', 'tk', 'p', 'f', 'c'].forEach(k => {
    if (o[k] !== undefined && $('pf_' + k)) $('pf_' + k).value = o[k];
  });
}

function renderProf() {
  const o = ls.get(pk(), null);
  if (!o) { $('pfout').innerHTML = `<p class="mut">${t('pf_none')}</p>`; return; }
  fillProf(o);
  const bmi = o.w / ((o.h / 100) ** 2), cat = t(bmi < 18.5 ? 'bmi_u' : bmi < 25 ? 'bmi_n' : bmi < 30 ? 'bmi_o' : 'bmi_b');
  const lo = 18.5 * (o.h / 100) ** 2, hi = 24.9 * (o.h / 100) ** 2, pc = g => Math.round(g / o.tk * 100);
  $('pfout').innerHTML = `<h3>${t('pf_sum')}</h3>` +
    bar([[o.age ? fmt(o.age) : '-', t('yrs')], [fmt(o.h), t('height')], [fmt(o.w), t('weight')], [o.bf ? '~' + fmt(o.bf) + '%' : '-', t('bfl')]]) +
    bar([[fmt(r1(bmi)), 'BMI (' + cat + ')'], [fmt(Math.round(lo)) + '–' + fmt(Math.round(hi)), t('healthy')], [o.bmr ? fmt(o.bmr) : '-', 'BMR'], [o.tdee ? fmt(o.tdee) : '-', 'TDEE']]) +
    bar([[fmt(o.tk), t('tcal')], [fmt(o.p) + ' g (' + fmt(pc(o.p * 4)) + '%)', t('prot')], [fmt(o.f) + ' g (' + fmt(pc(o.f * 9)) + '%)', t('fat')], [fmt(o.c) + ' g (' + fmt(pc(o.c * 4)) + '%)', t('carb')]]) +
    (o.tdee ? `<p class="mut">${t('gap')}: ${o.tk - o.tdee > 0 ? '+' : ''}${fmt(o.tk - o.tdee)} kcal</p>` : '');
}

function renderPlan() {
  const pl = P();
  $('psel').innerHTML = S.plans.map(p => `<option value="${p.id}"${p.id === S.cur ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  $('pname').value = pl.name; $('ptitle').textContent = pl.name;
  const T = { k: 0, p: 0, c: 0, f: 0 };
  pl.meals.forEach(m => add(T, mealM(m)));
  $('pbar').innerHTML = macBar(T);
  $('pmeals').innerHTML = pl.meals.length ? pl.meals.map((m, mi) => {
    const lg = S.LG[mi] && (S.W[S.LG[mi]] || (S.LG[mi] === 'cf' && Object.keys(S.CF).length)) ? S.LG[mi] : Object.keys(S.W)[0];
    return `<div class="meal">
    <div class="row"><label style="flex:2"><span>${t('mname')}</span><input data-a="mn" data-m="${mi}" value="${esc(m.name)}"></label>
    <button class="x noprint" data-a="dm" data-m="${mi}">${t('delmeal')}</button></div>
    ${m.items.map((it, ii) => {
      const x = itemM(it), sk = S.swap && S.swap.m === mi && S.swap.i === ii, ws = S.W[it.g];
      return `<div class="it"><span class="n">${esc(fname(it.n))} <small class="mut">(${esc(gname(it.g))})</small></span>
     <span class="ik" ${x ? '' : `title="${esc(t('nodata'))}"`}>${x ? fmt(Math.round(x.k)) + ' kcal' : '—'}</span>
     <input type="number" inputmode="decimal" min="0" step="any" data-a="q" data-m="${mi}" data-i="${ii}" value="${it.q}"><small>${t('g')}</small>
     ${ws && ws[it.n] ? `<button class="noprint" data-a="sw" data-m="${mi}" data-i="${ii}">${t('swap')}</button>` : ''}
     <button class="x noprint" data-a="di" data-m="${mi}" data-i="${ii}" aria-label="x">✕</button>
     ${sk && ws && ws[it.n] ? `<div class="sw">${Object.entries(ws).filter(([k]) => k !== it.n).map(([k, w]) => `<button data-a="do" data-m="${mi}" data-i="${ii}" data-k="${esc(k)}">${esc(fname(k))}: ${fmt(r1(it.q * w / ws[it.n]))} ${t('g')}</button>`).join('')}</div>` : ''}
    </div>`;
    }).join('')}
    <div class="row noprint" style="margin-top:8px">
     <label><span>${t('group')}</span><select data-a="ag" data-m="${mi}">${gopts(true, lg)}</select></label>
     <label><span>${t('food')}</span><select id="ai${mi}">${opts(lg)}</select></label>
     <label><span>${t('grams')}</span><input id="aq${mi}" type="number" inputmode="decimal" step="any" value="100"></label>
     <button class="p" data-a="ai" data-m="${mi}">${t('add')}</button></div>
    <label class="inl noprint"><input type="checkbox" data-a="man" data-m="${mi}" ${m.man ? 'checked' : ''}>${t('manual')}</label>
    ${m.man ? `<div class="mac">${[['k', 'kcal'], ['p', 'prot'], ['c', 'carb'], ['f', 'fat']].map(([f, l]) => `<label>${t(l)}<input type="number" inputmode="decimal" step="any" data-a="mac" data-f="${f}" data-m="${mi}" value="${num(m[f])}"></label>`).join('')}</div>` : macBar(mealM(m))}
    </div>`;
  }).join('') : `<p class="mut">${t('nomeals')}</p>`;
}

const planFor = d => { const id = S.ASG[d] || S.ASG['d' + pd(d).getDay()]; return S.plans.find(p => p.id === id) || null; };
function dayTot(pl, c) {
  const T = { k: 0, p: 0, c: 0, f: 0 };
  pl.meals.forEach((m, mi) => {
    if (m.man) { if (c['m' + mi]) add(T, mealM(m)); }
    else m.items.forEach((it, ii) => { if (c[mi + '-' + ii]) { const x = itemM(it); if (x) add(T, x); } });
  });
  return T;
}

function gauge(v, tg, lab, u, i) {
  const R0 = 34, C = 2 * Math.PI * R0, p = tg > 0 ? Math.min(v / tg, 1) : 0;
  return `<div class="g"><svg viewBox="0 0 90 90" role="img" aria-label="${lab}"><circle cx="45" cy="45" r="${R0}" class="gb"/><circle cx="45" cy="45" r="${R0}" class="gf c${i}${tg > 0 && v > tg * 1.05 ? ' ov' : ''}" stroke-dasharray="${C * p} ${C}" transform="rotate(-90 45 45)"/><text x="45" y="51" text-anchor="middle" class="gt">${tg > 0 ? fmt(Math.round(v / tg * 100)) + '%' : fmt(Math.round(v))}</text></svg><b>${fmt(Math.round(v))}${tg > 0 ? ' / ' + fmt(Math.round(tg)) : ''} ${u}</b><span>${lab}</span></div>`;
}

function renderLog() {
  const d = S.LD, pl = planFor(d), lg = S.LOG[d] || { c: {}, w: 0 }, c = lg.c || {}, pf = ls.get(pk(), null);
  let h0 = `<div class="card noprint"><h2>${t('log_h')}</h2>
 <div class="dn"><button data-a="prev" aria-label="-">‹</button><label><span>${t('date')}</span><input type="date" data-a="dt" value="${d}"></label><button data-a="next" aria-label="+">›</button><button data-a="tod">${t('today')}</button></div>
 <p><b>${esc(wkday(d))}</b> — ${fdate(d)}</p>
 <div class="row"><label><span>${t('assign')}</span><select id="lps">${S.plans.map(p => `<option value="${p.id}"${pl && pl.id === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label></div>
 <div class="row"><button data-a="a1">${t('thisdate')}</button><button data-a="aw">${t('every').replace('%s', esc(wkday(d)))}</button><button class="x" data-a="ac">${t('clear')}</button></div>
 <p class="mut">${pl ? esc(pl.name) : t('noplan')}</p></div>`;
  const T = pl ? dayTot(pl, c) : { k: 0, p: 0, c: 0, f: 0 }, tg = pf ? { k: pf.tk, p: pf.p, c: pf.c, f: pf.f } : { k: 0, p: 0, c: 0, f: 0 };
  h0 += `<div class="card"><h2>${t('consumed')}</h2><div class="gs">${gauge(T.k, tg.k, t('kcal'), 'kcal', 0)}${gauge(T.p, tg.p, t('prot'), 'g', 1)}${gauge(T.c, tg.c, t('carb'), 'g', 2)}${gauge(T.f, tg.f, t('fat'), 'g', 3)}</div>${pf ? '' : `<p class="mut">${t('notarget')}</p>`}
 <h3>💧 ${t('water')}</h3><div class="wrow noprint"><button data-a="wm" aria-label="-">−</button><b>${fmt(lg.w || 0)} / ${fmt(S.WG)} ${t('glasses')} · ${fmt(r1((lg.w || 0) * S.WML / 1000))} L</b><button data-a="wp" aria-label="+">+</button></div></div>`;
  if (pl) h0 += pl.meals.map((m, mi) => {
    const mm = mealM(m);
    return `<div class="card"><div class="row" style="margin:0"><h2 style="flex:1;margin:0">${esc(m.name)} <small class="mut">${fmt(Math.round(mm.k))} kcal</small></h2>${m.man ? '' : `<button class="noprint" data-a="all" data-m="${mi}">${t('checkall')}</button>`}</div>
  ${m.man ? `<label class="chk ${c['m' + mi] ? 'done' : ''}"><input type="checkbox" data-a="ck" data-k="m${mi}" ${c['m' + mi] ? 'checked' : ''}><span class="nm">${esc(m.name)}</span><span class="qty">${fmt(Math.round(mm.k))} kcal</span></label>` :
      m.items.map((it, ii) => {
        const k = mi + '-' + ii, x = itemM(it);
        return `<label class="chk ${c[k] ? 'done' : ''}"><input type="checkbox" data-a="ck" data-k="${k}" ${c[k] ? 'checked' : ''}><span class="nm">${esc(fname(it.n))}</span><span class="qty">${fmt(num(it.q))} ${t('g')}${x ? ' · ' + fmt(Math.round(x.k)) : ''}</span></label>`;
      }).join('')}</div>`;
  }).join('');
  $('v-log').innerHTML = h0;
}

function chart(key) {
  const pts = S.PROG.filter(e => e[key] > 0).sort((a, b) => a.d < b.d ? -1 : 1);
  if (pts.length < 2) return `<p class="mut">${t('nochart')}</p>`;
  const WD = 600, H = 260, pl = 48, pr = 18, pt = 22, pb = 36, xs = pts.map(e => pd(e.d).getTime()), ys = pts.map(e => e[key]);
  const x0 = xs[0], x1 = xs[xs.length - 1];
  let lo = Math.min(...ys), hi = Math.max(...ys); const pad = (hi - lo) || 1; lo -= pad * .2; hi += pad * .2;
  const X = v => pl + (v - x0) / (x1 - x0 || 1) * (WD - pl - pr), Y = v => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  const line = pts.map((e, i) => (i ? 'L' : 'M') + X(xs[i]).toFixed(1) + ' ' + Y(e[key]).toFixed(1)).join('');
  let g = ''; for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4, y = Y(v); g += `<line class="gl" x1="${pl}" x2="${WD - pr}" y1="${y}" y2="${y}"/><text class="ax" x="${pl - 6}" y="${y + 5}" text-anchor="end">${fmt(r1(v))}</text>`; }
  const lastI = pts.length - 1;
  return `<div class="ch" dir="ltr"><svg viewBox="0 0 ${WD} ${H}" role="img">${g}<path class="ar" d="${line}L${X(xs[lastI])} ${H - pb}L${X(xs[0])} ${H - pb}Z"/><path class="ln" d="${line}"/>${pts.map((e, i) => `<circle class="pt" cx="${X(xs[i]).toFixed(1)}" cy="${Y(e[key]).toFixed(1)}" r="4"/>`).join('')}
 <text class="ax" x="${pl}" y="${H - 8}">${fdate(pts[0].d)}</text><text class="ax" x="${WD - pr}" y="${H - 8}" text-anchor="end">${fdate(pts[lastI].d)}</text></svg></div>` +
    bar([[fmt(ys[0]), t('start')], [fmt(ys[lastI]), t('latest')], [(ys[lastI] - ys[0] > 0 ? '+' : '') + fmt(r1(ys[lastI] - ys[0])), t('change')]]);
}

function renderProg() {
  if (!$('prd').value) $('prd').value = today();
  $('prm').value = S.PM; $('prchart').innerHTML = chart(S.PM);
  const rows = S.PROG.slice().sort((a, b) => a.d < b.d ? 1 : -1);
  $('prlist').innerHTML = rows.length ? `<table><tr><th>${t('date')}</th><th>${t('weight')}</th><th>${t('bfshort')}</th><th>${t('waist')}</th><th class="noprint"></th></tr>${rows.map(e => `<tr><td>${fdate(e.d)}</td><td>${e.w ? fmt(e.w) : '-'}</td><td>${e.bf ? fmt(e.bf) : '-'}</td><td>${e.wa ? fmt(e.wa) : '-'}</td><td class="noprint"><button class="x" data-d="${e.d}" aria-label="x">✕</button></td></tr>`).join('')}</table>` : '';
}

const CATM = { 'بروتين': 'proteins', 'كربوهيدرات': 'pantry', 'دهون صحية': 'pantry', 'فواكه': 'produce', 'خضروات': 'produce', 'ألبان': 'dairy', 'بقوليات': 'pantry' };
const catOf = (g, n) => g === 'cf' ? ((S.CF[n] && S.CF[n].cat) || 'pantry') : ['جبن قريش', 'فيتا لايت'].includes(n) ? 'dairy' : CATM[g] || 'pantry';

function renderShop() {
  const sc0 = $('gsc').value || String(S.cur);
  $('gsc').innerHTML = S.plans.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('') + `<option value="wk">${t('wk')}</option>`;
  $('gsc').value = [...$('gsc').options].some(o => o.value === sc0) ? sc0 : String(S.cur);
  const sc = $('gsc').value, days = Math.max(1, num($('gdays').value) || 1), M = {};
  $('gdl').classList.toggle('hide', sc === 'wk');
  const addp = (pl, mult) => pl && pl.meals.forEach(m => m.items.forEach(it => { const k = it.g + '|' + it.n; (M[k] = M[k] || { g: it.g, n: it.n, q: 0 }).q += num(it.q) * mult; }));
  if (sc === 'wk') { for (let i = 0; i < 7; i++) addp(planFor(addDays(today(), i)), 1); } else addp(S.plans.find(p => String(p.id) === sc), days);
  const by = { produce: [], proteins: [], dairy: [], pantry: [] };
  Object.values(M).forEach(x => by[catOf(x.g, x.n)].push(x));
  const qty = q => q >= 1000 ? fmt(r1(q / 1000)) + ' kg' : fmt(Math.round(q)) + ' ' + t('g');
  const out = ['produce', 'proteins', 'dairy', 'pantry'].filter(c => by[c].length).map(c => `<h3>${{ produce: '🥬', proteins: '🍗', dairy: '🥛', pantry: '🌾' }[c]} ${t(c)}</h3>` + by[c].sort((a, b) => a.n < b.n ? -1 : 1).map(x => `<label class="chk ${S.GCK[x.n] ? 'done' : ''}"><input type="checkbox" data-n="${esc(x.n)}" ${S.GCK[x.n] ? 'checked' : ''}><span class="nm">${esc(fname(x.n))}</span><span class="qty">${qty(x.q)}</span></label>`).join('')).join('');
  $('glist').innerHTML = out || `<p class="mut">${t('emptyshop')}</p>`;
}

function renderSet() {
  setTheme(ls.get('theme', 'dc'));
  $('wgi').value = S.WG; $('wmli').value = S.WML;
  $('cfc').innerHTML = ['produce', 'proteins', 'dairy', 'pantry'].map(c => `<option value="${c}">${t(c)}</option>`).join('');
  const ks = Object.keys(S.CF);
  $('cflist').innerHTML = ks.length ? `<div class="tw"><table>${ks.map(n => { const x = S.CF[n]; return `<tr><td>${esc(n)}<br><small class="mut">${t(x.cat)}</small></td><td><small>${fmt(x.k)} kcal · P ${fmt(x.p)} · C ${fmt(x.c)} · F ${fmt(x.f)}</small></td><td><button class="x" data-n="${esc(n)}" aria-label="x">✕</button></td></tr>`; }).join('')}</table></div>` : '';
  $('wset').innerHTML = Object.entries(S.W).map(([g, items]) => `<h3>${esc(gname(g))}</h3><div class="wg">${Object.entries(items).map(([k, v]) => `<label>${esc(fname(k))}<input type="number" inputmode="decimal" data-g="${esc(g)}" data-k="${esc(k)}" value="${v}" min="1"></label>`).join('')}</div>`).join('');
}

const R = { ex: renderEx, tdee: renderProf, plan: renderPlan, log: renderLog, prog: renderProg, shop: renderShop, set: renderSet };

function go(v) {
  S.VIEW = v;
  Object.keys(R).forEach(k => $('v-' + k).classList.toggle('hide', k !== v));
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  renderWater();
  R[v]();
  window.scrollTo(0, 0);
}

function renderAll() { renderWater(); R[S.VIEW](); }

function wset(d, n) {
  const o = dl(d);
  o.w = Math.max(0, (o.w || 0) + n);
  ls.set('log', S.LOG);
  renderWater();
  if (S.VIEW === 'log') renderLog();
}

function exportData() {
  const data = {};
  ls.keys().filter(k => isApp(k) && k !== 'sess').forEach(k => data[k] = ls.get(k, null));
  return { app: 'diet-planner', v: 2, ts: new Date().toISOString(), data };
}

const bkName = () => 'diet-backup-' + today() + '.json';

function download() {
  try {
    const blob = new Blob([JSON.stringify(exportData(), null, 1)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = bkName();
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    msg('bkmsg', t('bk_ok'));
  } catch (e) { msg('bkmsg', String(e), 1); }
}

async function shareBk() {
  try {
    const f = new File([JSON.stringify(exportData(), null, 1)], bkName(), { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) {
      await navigator.share({ files: [f] });
      msg('bkmsg', t('bk_ok'));
    } else download();
  } catch (e) { if (e && e.name !== 'AbortError') download(); }
}

// Global Event Listeners Binder
function bindEvents() {
  document.addEventListener('click', e => {
    if (e.target.classList && e.target.classList.contains('lgb')) setLang(S.L === 'ar' ? 'en' : 'ar');
  });

  $('lgset').onclick = e => { if (e.target.dataset.l) setLang(e.target.dataset.l); };

  $('thsel').innerHTML = Object.entries(THEMES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  $('thbtn').innerHTML = Object.entries(THEMES).map(([k, v]) => `<button class="t" data-t="${k}">${v}</button>`).join('');
  $('thsel').onchange = e => setTheme(e.target.value);
  $('thbtn').onclick = e => { if (e.target.dataset.t) setTheme(e.target.dataset.t); };

  $('lb').onclick = () => {
    const u = $('lu').value.trim(), p = $('lp').value, acc = ls.get('acc', null);
    if (!u || p.length < 4) { $('le').textContent = t('minc'); return; }
    if (!acc) ls.set('acc', { u, p: h(p) }); else if (acc.u !== u || acc.p !== h(p)) { $('le').textContent = t('badcred'); return; }
    ls.set('sess', true); $('lp').value = ''; enter();
  };
  $('lp').onkeydown = e => { if (e.key === 'Enter') $('lb').click(); };
  $('out').onclick = () => { ls.set('sess', false); showAuth(); };

  $('sacc').onclick = () => {
    const u = $('nu').value.trim(), p = $('np').value;
    if (!u || p.length < 4) { msg('se', t('minc'), 1); return; }
    const old = pk(), pr = ls.get(old, null);
    ls.set('acc', { u, p: h(p) });
    if (pr && old !== pk()) { ls.set(pk(), pr); ls.del(old); }
    msg('se', t('saved')); $('nu').value = $('np').value = '';
  };

  $('nav').onclick = e => { const b = e.target.closest('[data-v]'); if (b) go(b.dataset.v); };

  $('wchip').onclick = e => { const b = e.target.closest('[data-w]'); if (b) wset(today(), +b.dataset.w); };

  $('exg').onchange = () => { $('exa').innerHTML = opts($('exg').value); exCalc(); };
  $('exa').onchange = exCalc;
  $('exq').oninput = exCalc;

  $('tc').onclick = () => {
    const a = num($('ta').value), w = num($('tw').value), hh = num($('th').value), bf = num($('tbf').value), lean = w * (1 - bf / 100), useBf = bf > 0 && bf < 70;
    const bmr = useBf ? 370 + 21.6 * lean : 10 * w + 6.25 * hh - 5 * a + ($('ts').value === 'm' ? 5 : -161);
    const tdee = bmr * num($('tact').value), g = num($('tg').value), tg = tdee + g;
    const p = w * (g < 0 ? 2 : 1.8), f = tg * .25 / 9, c = (tg - p * 4 - f * 9) / 4;
    $('tout').innerHTML = bar([[fmt(Math.round(bmr)), 'BMR'], [fmt(Math.round(tdee)), 'TDEE'], [fmt(Math.round(tg)), t('tcal')], [fmt(r1(w / ((hh / 100) ** 2))), 'BMI']]) +
      bar([[fmt(Math.round(p)) + ' g', t('prot')], [fmt(Math.round(c)) + ' g', t('carb')], [fmt(Math.round(f)) + ' g', t('fat')], [fmt(Math.round(tg)), 'kcal']]) +
      (useBf ? bar([[fmt(bf) + '%', t('bfl')], [fmt(r1(w * bf / 100)) + ' kg', t('fm')], [fmt(r1(lean)) + ' kg', t('lm')], ['Katch-McArdle', t('formula')]]) : '');
    fillProf({ age: a, h: hh, w, bf: bf > 0 ? bf : '', bmr: Math.round(bmr), tdee: Math.round(tdee), tk: Math.round(tg), p: Math.round(p), f: Math.round(f), c: Math.round(c) });
  };

  $('pfsave').onclick = () => {
    const o = {};
    ['age', 'h', 'w', 'bf', 'bmr', 'tdee', 'tk', 'p', 'f', 'c'].forEach(k => o[k] = num($('pf_' + k).value));
    if (!(o.tk > 0) || !(o.w > 0) || !(o.h > 0)) { $('pferr').textContent = t('pf_err'); return; }
    $('pferr').textContent = '';
    ls.set(pk(), o);
    renderProf();
  };

  $('pfdel').onclick = () => {
    if (!confirm(t('pf_conf'))) return;
    ls.del(pk());
    ['age', 'h', 'w', 'bf', 'bmr', 'tdee', 'tk', 'p', 'f', 'c'].forEach(k => $('pf_' + k).value = '');
    renderProf();
  };

  $('psel').onchange = e => { S.cur = +e.target.value; S.swap = null; savePlans(); renderPlan(); };
  $('pnew').onclick = () => { const id = Date.now(); S.plans.push({ id, name: t('newplan'), meals: [] }); S.cur = id; savePlans(); renderPlan(); };
  $('pdel').onclick = () => {
    if (S.plans.length < 2) { alert(t('onlyplan')); return; }
    if (!confirm(t('confdelplan'))) return;
    const id = S.cur; S.plans = S.plans.filter(p => p.id !== id); S.cur = S.plans[0].id;
    for (const k in S.ASG) if (S.ASG[k] === id) delete S.ASG[k];
    ls.set('assign', S.ASG); savePlans(); renderPlan();
  };
  $('pname').oninput = e => { P().name = e.target.value; savePlans(); $('ptitle').textContent = e.target.value; $('psel').options[$('psel').selectedIndex].text = e.target.value; };
  $('padd').onclick = () => { P().meals.push({ name: t('meal') + ' ' + (P().meals.length + 1), items: [], k: 0, p: 0, c: 0, f: 0, man: false }); savePlans(); renderPlan(); };
  $('ppdf').onclick = () => window.print();

  $('pmeals').onclick = e => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const d = b.dataset, a = d.a, pl = P(), m = pl.meals[d.m];
    if (a === 'dm') { pl.meals.splice(d.m, 1); S.swap = null; }
    else if (a === 'di') { m.items.splice(d.i, 1); S.swap = null; }
    else if (a === 'sw') { S.swap = S.swap && S.swap.m == +d.m && S.swap.i == +d.i ? null : { m: +d.m, i: +d.i }; renderPlan(); return; }
    else if (a === 'do') { const it = m.items[d.i]; it.q = r1(it.q * S.W[it.g][d.k] / S.W[it.g][it.n]); it.n = d.k; S.swap = null; }
    else if (a === 'ai') { const g = b.parentNode.querySelector('[data-a=ag]').value, n = $('ai' + d.m).value; if (!n) return; m.items.push({ g, n, q: num($('aq' + d.m).value) }); }
    else return;
    savePlans(); renderPlan();
  };

  $('pmeals').onchange = e => {
    const d = e.target.dataset, a = d.a; if (!a) return;
    const m = P().meals[d.m]; if (!m) return;
    if (a === 'ag') { S.LG[d.m] = e.target.value; renderPlan(); return; }
    if (a === 'mn') { m.name = e.target.value; savePlans(); return; }
    if (a === 'q') m.items[d.i].q = num(e.target.value);
    else if (a === 'mac') m[d.f] = num(e.target.value);
    else if (a === 'man') { m.man = e.target.checked; if (m.man) { const x = mealM({ items: m.items, man: false }); m.k = Math.round(x.k); m.p = r1(x.p); m.c = r1(x.c); m.f = r1(x.f); } }
    else return;
    savePlans(); renderPlan();
  };

  $('v-log').onclick = e => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'prev') S.LD = addDays(S.LD, -1);
    else if (a === 'next') S.LD = addDays(S.LD, 1);
    else if (a === 'tod') S.LD = today();
    else if (a === 'a1') { S.ASG[S.LD] = +$('lps').value; ls.set('assign', S.ASG); }
    else if (a === 'aw') { S.ASG['d' + pd(S.LD).getDay()] = +$('lps').value; ls.set('assign', S.ASG); }
    else if (a === 'ac') { delete S.ASG[S.LD]; delete S.ASG['d' + pd(S.LD).getDay()]; ls.set('assign', S.ASG); }
    else if (a === 'wm' || a === 'wp') { wset(S.LD, a === 'wp' ? 1 : -1); return; }
    else if (a === 'all') {
      const pl = planFor(S.LD), m = pl.meals[b.dataset.m], o = dl(S.LD);
      const keys = m.items.map((_, i) => b.dataset.m + '-' + i), on = !keys.every(k => o.c[k]);
      keys.forEach(k => on ? o.c[k] = 1 : delete o.c[k]);
      ls.set('log', S.LOG);
    } else return;
    renderLog();
  };

  $('v-log').onchange = e => {
    const d = e.target.dataset;
    if (d.a === 'dt' && e.target.value) { S.LD = e.target.value; renderLog(); }
    else if (d.a === 'ck') { const o = dl(S.LD); e.target.checked ? o.c[d.k] = 1 : delete o.c[d.k]; ls.set('log', S.LOG); renderLog(); }
  };

  $('prm').onchange = e => { S.PM = e.target.value; renderProg(); };
  $('pradd').onclick = () => {
    const d = $('prd').value || today(), w = num($('prw').value), bf = num($('prb').value), wa = num($('prwa').value);
    if (!(w > 0 || bf > 0 || wa > 0)) { msg('prerr', t('need1'), 1); return; }
    let o = S.PROG.find(e => e.d === d); if (!o) { o = { d }; S.PROG.push(o); }
    if (w > 0) o.w = w; if (bf > 0) o.bf = bf; if (wa > 0) o.wa = wa;
    S.PROG.sort((a, b) => a.d < b.d ? -1 : 1);
    ls.set('prog', S.PROG); ['prw', 'prb', 'prwa'].forEach(i => $(i).value = ''); msg('prerr', ''); renderProg();
  };
  $('prlist').onclick = e => {
    const b = e.target.closest('[data-d]'); if (!b) return;
    S.PROG = S.PROG.filter(x => x.d !== b.dataset.d); ls.set('prog', S.PROG); renderProg();
  };

  $('gsc').onchange = renderShop;
  $('gdays').oninput = renderShop;
  $('gpr').onclick = () => window.print();
  $('gclr').onclick = () => { S.GCK = {}; ls.set('gck', S.GCK); renderShop(); };
  $('glist').onchange = e => {
    const n = e.target.dataset.n; if (n === undefined) return;
    e.target.checked ? S.GCK[n] = 1 : delete S.GCK[n];
    ls.set('gck', S.GCK);
    e.target.closest('.chk').classList.toggle('done', e.target.checked);
  };

  $('wgi').onchange = e => { S.WG = Math.max(1, Math.round(num(e.target.value)) || 8); ls.set('wg', S.WG); renderWater(); };
  $('wmli').onchange = e => { S.WML = Math.max(50, Math.round(num(e.target.value)) || 250); ls.set('wml', S.WML); };
  $('cfadd').onclick = () => {
    const n = $('cfn').value.trim(); if (!n) return;
    S.CF[n] = { cat: $('cfc').value, k: num($('cfk').value), p: num($('cfp').value), c: num($('cfcb').value), f: num($('cff').value) };
    ls.set('cf', S.CF); ['cfn', 'cfk', 'cfp', 'cfcb', 'cff'].forEach(i => $(i).value = ''); renderSet();
  };
  $('cflist').onclick = e => {
    const b = e.target.closest('[data-n]'); if (!b) return;
    delete S.CF[b.dataset.n]; ls.set('cf', S.CF); renderSet();
  };
  $('wset').onchange = e => {
    const d = e.target.dataset; if (!d.g) return;
    const v = num(e.target.value);
    if (v > 0) { S.W[d.g][d.k] = v; ls.set('dw', S.W); } else e.target.value = S.W[d.g][d.k];
  };
  $('wreset').onclick = () => { if (!confirm(t('confresetw'))) return; S.W = clone(DEF); ls.set('dw', S.W); renderSet(); };

  $('bkdl').onclick = download;
  $('bksh').onclick = shareBk;
  $('imp').onchange = e => {
    const inp = e.target, f = inp.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const o = JSON.parse(r.result);
        if (!o || o.app !== 'diet-planner' || !o.data || typeof o.data !== 'object') throw new Error('bad');
        if (!confirm(t('imp_conf'))) return;
        Object.keys(o.data).filter(k => isApp(k) && k !== 'sess').forEach(k => o.data[k] === null ? ls.del(k) : ls.set(k, o.data[k]));
        loadState(); S.L = ls.get('lang', 'ar'); setTheme(ls.get('theme', 'dc')); applyLang(); msg('bkmsg', t('imp_ok'));
      } catch (x) { msg('bkmsg', t('imp_bad'), 1); } finally { inp.value = ''; }
    };
    r.onerror = () => msg('bkmsg', t('imp_bad'), 1);
    r.readAsText(f);
  };
}

// Application Async Bootloader Sequence
(async () => {
  try { await bootStore(); } catch (e) {}
  S.L = ls.get('lang', 'ar') === 'en' ? 'en' : 'ar';
  loadState();
  setTheme(ls.get('theme', 'dc'));
  applyLang();
  bindEvents();
  if (ls.get('acc', null) && ls.get('sess', false)) enter(); else showAuth();
})();