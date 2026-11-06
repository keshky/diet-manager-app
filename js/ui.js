/* =============== UI & RENDERING =============== */
'use strict';
import { DEF, GN, FN, TR } from './data.js';
import { ls } from './store.js';

let L = 'ar', W, plans, cur, CF, LOG, ASG, PROG, GCK, WG, WML, VIEW = 'ex', LD = '', PM = 'w', swap = null;
const LG = {};

export const t = k => TR[L][k] || TR.en[k] || k;
export const loc = () => L === 'ar' ? 'ar-EG' : 'en-GB';
export const fmt = n => (isFinite(n) ? +n : 0).toLocaleString(L === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 1 });
export const gname = g => g === 'cf' ? t('cfg') : (L === 'en' && GN[g]) || g;
export const fname = n => (L === 'en' && FN[n]) || n;

export function setAppData(state) {
  L = state.L; W = state.W; plans = state.plans; cur = state.cur;
  CF = state.CF; LOG = state.LOG; ASG = state.ASG; PROG = state.PROG;
  GCK = state.GCK; WG = state.WG; WML = state.WML; VIEW = state.VIEW;
  LD = state.LD; PM = state.PM; swap = state.swap;
}

const $ = i => document.getElementById(i);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => parseFloat(v) || 0;
const r1 = n => Math.round(n * 10) / 10;
const add = (T, x) => { T.k += x.k; T.p += x.p; T.c += x.c; T.f += x.f; return T; };
const itemM = it => { const n = CF[it.n] || NUT_GET(it.n); if (!n) return null; const f = num(it.q) / 100; return { k: n.k * f, p: n.p * f, c: n.c * f, f: n.f * f }; };
const mealM = m => m.man ? { k: num(m.k), p: num(m.p), c: num(m.c), f: num(m.f) } : m.items.reduce((T, it) => { const x = itemM(it); return x ? add(T, x) : T }, { k: 0, p: 0, c: 0, f: 0 });
const bar = a => `<div class="bar">${a.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
const macBar = T => bar([[fmt(Math.round(T.k)), t('kcal')], [fmt(r1(T.p)), t('prot')], [fmt(r1(T.c)), t('carb')], [fmt(r1(T.f)), t('fat')]]);
export const msg = (id, s, bad) => { const e = $(id); if (e) { e.textContent = s || ''; e.className = s ? (bad ? 'err' : 'okm') : '' } };
const iso = x => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
const pd = d => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd) };
const today = () => iso(new Date());
const addDays = (d, n) => { const x = pd(d); x.setDate(x.getDate() + n); return iso(x) };
const wkday = d => pd(d).toLocaleDateString(loc(), { weekday: 'long' });
const fdate = d => pd(d).toLocaleDateString(loc(), { day: 'numeric', month: 'short', year: 'numeric' });
const opts = g => (g === 'cf' ? Object.keys(CF) : Object.keys(W[g] || {})).map(k => `<option value="${esc(k)}">${esc(fname(k))}</option>`).join('');
const gopts = (cf, sel) => Object.keys(W).concat(cf && Object.keys(CF).length ? ['cf'] : []).map(k => `<option value="${esc(k)}"${k === sel ? ' selected' : ''}>${esc(gname(k))}</option>`).join('');
const P = () => plans.find(p => p.id === cur) || plans[0];
const pk = () => 'prof:' + ((ls.get('acc', null) || {}).u || '');
const dl = d => LOG[d] || (LOG[d] = { c: {}, w: 0 });

import { NUT } from './data.js';
function NUT_GET(n) { return NUT[n] || null; }

export function renderWater() {
  const n = (LOG[today()] || {}).w || 0;
  const wchip = $('wchip');
  if (wchip) {
    wchip.innerHTML = `<button data-w="-1" aria-label="-">−</button><span class="${n >= WG ? 'ok' : ''}">💧 ${fmt(n)}/${fmt(WG)}</span><button data-w="1" aria-label="+">+</button>`;
  }
}

export function renderEx() {
  const g0 = $('exg').value, a0 = $('exa').value;
  $('exg').innerHTML = gopts(false); if (g0 && W[g0]) $('exg').value = g0;
  $('exa').innerHTML = opts($('exg').value); if (a0 && W[$('exg').value][a0] !== undefined) $('exa').value = a0;
  exCalc();
}

export function exCalc() {
  const g = $('exg').value, a = $('exa').value, q = num($('exq').value), base = (W[g] || {})[a]; if (!base) { $('ext').innerHTML = ''; return; }
  $('ext').innerHTML = `<tr><th>${t('subst')}</th><th>${t('amt')}</th></tr>` + Object.entries(W[g]).filter(([k]) => k !== a).map(([k, w]) => `<tr><td>${esc(fname(k))}</td><td><b>${fmt(r1(q * w / base))}</b></td></tr>`).join('');
}

export function renderProf() {
  const o = ls.get(pk(), null);
  const pfout = $('pfout');
  if (!o) { pfout.innerHTML = `<p class="mut">${t('pf_none')}</p>`; return; }
  ['age', 'h', 'w', 'bf', 'bmr', 'tdee', 'tk', 'p', 'f', 'c'].forEach(k => { if (o[k] !== undefined && $('pf_' + k)) $('pf_' + k).value = o[k] });
  const bmi = o.w / ((o.h / 100) ** 2), cat = t(bmi < 18.5 ? 'bmi_u' : bmi < 25 ? 'bmi_n' : bmi < 30 ? 'bmi_o' : 'bmi_b');
  const lo = 18.5 * (o.h / 100) ** 2, hi = 24.9 * (o.h / 100) ** 2, pc = g => Math.round(g / o.tk * 100);
  pfout.innerHTML = `<h3>${t('pf_sum')}</h3>` +
    bar([[o.age ? fmt(o.age) : '-', t('yrs')], [fmt(o.h), t('height')], [fmt(o.w), t('weight')], [o.bf ? '~' + fmt(o.bf) + '%' : '-', t('bfl')]]) +
    bar([[fmt(r1(bmi)), 'BMI (' + cat + ')'], [fmt(Math.round(lo)) + '–' + fmt(Math.round(hi)), t('healthy')], [o.bmr ? fmt(o.bmr) : '-', 'BMR'], [o.tdee ? fmt(o.tdee) : '-', 'TDEE']]) +
    bar([[fmt(o.tk), t('tcal')], [fmt(o.p) + ' g (' + fmt(pc(o.p * 4)) + '%)', t('prot')], [fmt(o.f) + ' g (' + fmt(pc(o.f * 9)) + '%)', t('fat')], [fmt(o.c) + ' g (' + fmt(pc(o.c * 4)) + '%)', t('carb')]]) +
    (o.tdee ? `<p class="mut">${t('gap')}: ${o.tk - o.tdee > 0 ? '+' : ''}${fmt(o.tk - o.tdee)} kcal</p>` : '');
}

export function renderPlan() {
  const pl = P();
  $('psel').innerHTML = plans.map(p => `<option value="${p.id}"${p.id === cur ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  $('pname').value = pl.name; $('ptitle').textContent = pl.name;
  const T = { k: 0, p: 0, c: 0, f: 0 }; pl.meals.forEach(m => add(T, mealM(m))); $('pbar').innerHTML = macBar(T);
  $('pmeals').innerHTML = pl.meals.length ? pl.meals.map((m, mi) => {
    const lg = LG[mi] && (W[LG[mi]] || (LG[mi] === 'cf' && Object.keys(CF).length)) ? LG[mi] : Object.keys(W)[0];
    return `<div class="meal">
  <div class="row"><label style="flex:2"><span>${t('mname')}</span><input data-a="mn" data-m="${mi}" value="${esc(m.name)}"></label>
  <button class="x noprint" data-a="dm" data-m="${mi}">${t('delmeal')}</button></div>
  ${m.items.map((it, ii) => {
      const x = itemM(it), sk = swap && swap.m === mi && swap.i === ii, ws = W[it.g]; return `<div class="it"><span class="n">${esc(fname(it.n))} <small class="mut">(${esc(gname(it.g))})</small></span>
   <span class="ik" ${x ? '' : `title="${esc(t('nodata'))}"`}>${x ? fmt(Math.round(x.k)) + ' kcal' : '—'}</span>
   <input type="number" inputmode="decimal" min="0" step="any" data-a="q" data-m="${mi}" data-i="${ii}" value="${it.q}"><small>${t('g')}</small>
   ${ws && ws[it.n] ? `<button class="noprint" data-a="sw" data-m="${mi}" data-i="${ii}">${t('swap')}</button>` : ''}
   <button class="x noprint" data-a="di" data-m="${mi}" data-i="${ii}" aria-label="x">✕</button>
   ${sk && ws && ws[it.n] ? `<div class="sw">${Object.entries(ws).filter(([k]) => k !== it.n).map(([k, w]) => `<button data-a="do" data-m="${mi}" data-i="${ii}" data-k="${esc(k)}">${esc(fname(k))}: ${fmt(r1(it.q * w / ws[it.n]))} ${t('g')}</button>`).join('')}</div>` : ''}
  </div>`}).join('')}
  <div class="row noprint" style="margin-top:8px">
   <label><span>${t('group')}</span><select data-a="ag" data-m="${mi}">${gopts(true, lg)}</select></label>
   <label><span>${t('food')}</span><select id="ai${mi}">${opts(lg)}</select></label>
   <label><span>${t('grams')}</span><input id="aq${mi}" type="number" inputmode="decimal" step="any" value="100"></label>
   <button class="p" data-a="ai" data-m="${mi}">${t('add')}</button></div>
  <label class="inl noprint"><input type="checkbox" data-a="man" data-m="${mi}" ${m.man ? 'checked' : ''}>${t('manual')}</label>
  ${m.man ? `<div class="mac">${[['k', 'kcal'], ['p', 'prot'], ['c', 'carb'], ['f', 'fat']].map(([f, l]) => `<label>${t(l)}<input type="number" inputmode="decimal" step="any" data-a="mac" data-f="${f}" data-m="${mi}" value="${num(m[f])}"></label>`).join('')}</div>` : macBar(mealM(m))}
  </div>`}).join('') : `<p class="mut">${t('nomeals')}</p>`;
}

const planFor = d => { const id = ASG[d] || ASG['d' + pd(d).getDay()]; return plans.find(p => p.id === id) || null; };
const dayTot = (pl, c) => {
  const T = { k: 0, p: 0, c: 0, f: 0 };
  pl.meals.forEach((m, mi) => { if (m.man) { if (c['m' + mi]) add(T, mealM(m)) } else m.items.forEach((it, ii) => { if (c[mi + '-' + ii]) { const x = itemM(it); if (x) add(T, x) } }) }); return T;
};
const gauge = (v, tg, lab, u, i) => {
  const R0 = 34, C = 2 * Math.PI * R0, p = tg > 0 ? Math.min(v / tg, 1) : 0;
  return `<div class="g"><svg viewBox="0 0 90 90" role="img" aria-label="${lab}"><circle cx="45" cy="45" r="${R0}" class="gb"/><circle cx="45" cy="45" r="${R0}" class="gf c${i}${tg > 0 && v > tg * 1.05 ? ' ov' : ''}" stroke-dasharray="${C * p} ${C}" transform="rotate(-90 45 45)"/><text x="45" y="51" text-anchor="middle" class="gt">${tg > 0 ? fmt(Math.round(v / tg * 100)) + '%' : fmt(Math.round(v))}</text></svg><b>${fmt(Math.round(v))}${tg > 0 ? ' / ' + fmt(Math.round(tg)) : ''} ${u}</b><span>${lab}</span></div>`;
};

export function renderLog() {
  const d = LD, pl = planFor(d), lg = LOG[d] || { c: {}, w: 0 }, c = lg.c || {}, pf = ls.get(pk(), null);
  let h0 = `<div class="card noprint"><h2>${t('log_h')}</h2>
 <div class="dn"><button data-a="prev" aria-label="-">‹</button><label><span>${t('date')}</span><input type="date" data-a="dt" value="${d}"></label><button data-a="next" aria-label="+">›</button><button data-a="tod">${t('today')}</button></div>
 <p><b>${esc(wkday(d))}</b> — ${fdate(d)}</p>
 <div class="row"><label><span>${t('assign')}</span><select id="lps">${plans.map(p => `<option value="${p.id}"${pl && pl.id === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label></div>
 <div class="row"><button data-a="a1">${t('thisdate')}</button><button data-a="aw">${t('every').replace('%s', esc(wkday(d)))}</button><button class="x" data-a="ac">${t('clear')}</button></div>
 <p class="mut">${pl ? esc(pl.name) : t('noplan')}</p></div>`;
  const T = pl ? dayTot(pl, c) : { k: 0, p: 0, c: 0, f: 0 }, tg = pf ? { k: pf.tk, p: pf.p, c: pf.c, f: pf.f } : { k: 0, p: 0, c: 0, f: 0 };
  h0 += `<div class="card"><h2>${t('consumed')}</h2><div class="gs">${gauge(T.k, tg.k, t('kcal'), 'kcal', 0)}${gauge(T.p, tg.p, t('prot'), 'g', 1)}${gauge(T.c, tg.c, t('carb'), 'g', 2)}${gauge(T.f, tg.f, t('fat'), 'g', 3)}</div>${pf ? '' : `<p class="mut">${t('notarget')}</p>`}
 <h3>💧 ${t('water')}</h3><div class="wrow noprint"><button data-a="wm" aria-label="-">−</button><b>${fmt(lg.w || 0)} / ${fmt(WG)} ${t('glasses')} · ${fmt(r1((lg.w || 0) * WML / 1000))} L</b><button data-a="wp" aria-label="+">+</button></div></div>`;
  if (pl) h0 += pl.meals.map((m, mi) => {
    const mm = mealM(m); return `<div class="card"><div class="row" style="margin:0"><h2 style="flex:1;margin:0">${esc(m.name)} <small class="mut">${fmt(Math.round(mm.k))} kcal</small></h2>${m.man ? '' : `<button class="noprint" data-a="all" data-m="${mi}">${t('checkall')}</button>`}</div>
  ${m.man ? `<label class="chk ${c['m' + mi] ? 'done' : ''}"><input type="checkbox" data-a="ck" data-k="m${mi}" ${c['m' + mi] ? 'checked' : ''}><span class="nm">${esc(m.name)}</span><span class="qty">${fmt(Math.round(mm.k))} kcal</span></label>` :
        m.items.map((it, ii) => { const k = mi + '-' + ii, x = itemM(it); return `<label class="chk ${c[k] ? 'done' : ''}"><input type="checkbox" data-a="ck" data-k="${k}" ${c[k] ? 'checked' : ''}><span class="nm">${esc(fname(it.n))}</span><span class="qty">${fmt(num(it.q))} ${t('g')}${x ? ' · ' + fmt(Math.round(x.k)) : ''}</span></label>` }).join('')}</div>`
  }).join('');
  $('v-log').innerHTML = h0;
}

export function chart(key) {
  const pts = PROG.filter(e => e[key] > 0).sort((a, b) => a.d < b.d ? -1 : 1);
  if (pts.length < 2) return `<p class="mut">${t('nochart')}</p>`;
  const WD = 600, H = 260, pl = 48, pr = 18, pt = 22, pb = 36, xs = pts.map(e => pd(e.d).getTime()), ys = pts.map(e => e[key]);
  const x0 = xs[0], x1 = xs[xs.length - 1]; let lo = Math.min(...ys), hi = Math.max(...ys); const pad = (hi - lo) || 1; lo -= pad * .2; hi += pad * .2;
  const X = v => pl + (v - x0) / (x1 - x0 || 1) * (WD - pl - pr), Y = v => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  const line = pts.map((e, i) => (i ? 'L' : 'M') + X(xs[i]).toFixed(1) + ' ' + Y(e[key]).toFixed(1)).join('');
  let g = ''; for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4, y = Y(v); g += `<line class="gl" x1="${pl}" x2="${WD - pr}" y1="${y}" y2="${y}"/><text class="ax" x="${pl - 6}" y="${y + 5}" text-anchor="end">${fmt(r1(v))}</text>` }
  const lastI = pts.length - 1;
  return `<div class="ch" dir="ltr"><svg viewBox="0 0 ${WD} ${H}" role="img">${g}<path class="ar" d="${line}L${X(xs[lastI])} ${H - pb}L${X(xs[0])} ${H - pb}Z"/><path class="ln" d="${line}"/>${pts.map((e, i) => `<circle class="pt" cx="${X(xs[i]).toFixed(1)}" cy="${Y(e[key]).toFixed(1)}" r="4"/>`).join('')}
 <text class="ax" x="${pl}" y="${H - 8}">${fdate(pts[0].d)}</text><text class="ax" x="${WD - pr}" y="${H - 8}" text-anchor="end">${fdate(pts[lastI].d)}</text></svg></div>` +
    bar([[fmt(ys[0]), t('start')], [fmt(ys[lastI]), t('latest')], [(ys[lastI] - ys[0] > 0 ? '+' : '') + fmt(r1(ys[lastI] - ys[0])), t('change')]]);
}

export function renderProg() {
  if (!$('prd').value) $('prd').value = today();
  $('prm').value = PM; $('prchart').innerHTML = chart(PM);
  const rows = PROG.slice().sort((a, b) => a.d < b.d ? 1 : -1);
  $('prlist').innerHTML = rows.length ? `<table><tr><th>${t('date')}</th><th>${t('weight')}</th><th>${t('bfshort')}</th><th>${t('waist')}</th><th class="noprint"></th></tr>${rows.map(e => `<tr><td>${fdate(e.d)}</td><td>${e.w ? fmt(e.w) : '-'}</td><td>${e.bf ? fmt(e.bf) : '-'}</td><td>${e.wa ? fmt(e.wa) : '-'}</td><td class="noprint"><button class="x" data-d="${e.d}" aria-label="x">✕</button></td></tr>`).join('')}</table>` : '';
}

const CATM = { 'بروتين': 'proteins', 'كربوهيدرات': 'pantry', 'دهون صحية': 'pantry', 'فواكه': 'produce', 'خضروات': 'produce', 'ألبان': 'dairy', 'بقوليات': 'pantry' };
const catOf = (g, n) => g === 'cf' ? ((CF[n] && CF[n].cat) || 'pantry') : ['جبن قريش', 'فيتا لايت'].includes(n) ? 'dairy' : CATM[g] || 'pantry';

export function renderShop() {
  const sc0 = $('gsc').value || String(cur);
  $('gsc').innerHTML = plans.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('') + `<option value="wk">${t('wk')}</option>`;
  $('gsc').value = [...$('gsc').options].some(o => o.value === sc0) ? sc0 : String(cur);
  const sc = $('gsc').value, days = Math.max(1, num($('gdays').value) || 1), M = {};
  $('gdl').classList.toggle('hide', sc === 'wk');
  const addp = (pl, mult) => pl && pl.meals.forEach(m => m.items.forEach(it => { const k = it.g + '|' + it.n; (M[k] = M[k] || { g: it.g, n: it.n, q: 0 }).q += num(it.q) * mult }));
  if (sc === 'wk') { for (let i = 0; i < 7; i++) addp(planFor(addDays(today(), i)), 1) } else addp(plans.find(p => String(p.id) === sc), days);
  const by = { produce: [], proteins: [], dairy: [], pantry: [] }; Object.values(M).forEach(x => by[catOf(x.g, x.n)].push(x));
  const qty = q => q >= 1000 ? fmt(r1(q / 1000)) + ' kg' : fmt(Math.round(q)) + ' ' + t('g');
  const out = ['produce', 'proteins', 'dairy', 'pantry'].filter(c => by[c].length).map(c => `<h3>${{ produce: '🥬', proteins: '🍗', dairy: '🥛', pantry: '🌾' }[c]} ${t(c)}</h3>` + by[c].sort((a, b) => a.n < b.n ? -1 : 1).map(x => `<label class="chk ${GCK[x.n] ? 'done' : ''}"><input type="checkbox" data-n="${esc(x.n)}" ${GCK[x.n] ? 'checked' : ''}><span class="nm">${esc(fname(x.n))}</span><span class="qty">${qty(x.q)}</span></label>`).join('')).join('');
  $('glist').innerHTML = out || `<p class="mut">${t('emptyshop')}</p>`;
}

export function renderSet() {
  document.documentElement.setAttribute('data-theme', ls.get('theme', 'dc'));
  $('wgi').value = WG; $('wmli').value = WML;
  $('cfc').innerHTML = ['produce', 'proteins', 'dairy', 'pantry'].map(c => `<option value="${c}">${t(c)}</option>`).join('');
  const ks = Object.keys(CF);
  $('cflist').innerHTML = ks.length ? `<div class="tw"><table>${ks.map(n => { const x = CF[n]; return `<tr><td>${esc(n)}<br><small class="mut">${t(x.cat)}</small></td><td><small>${fmt(x.k)} kcal · P ${fmt(x.p)} · C ${fmt(x.c)} · F ${fmt(x.f)}</small></td><td><button class="x" data-n="${esc(n)}" aria-label="x">✕</button></td></tr>` }).join('')}</table></div>` : '';
  $('wset').innerHTML = Object.entries(W).map(([g, items]) => `<h3>${esc(gname(g))}</h3><div class="wg">${Object.entries(items).map(([k, v]) => `<label>${esc(fname(k))}<input type="number" inputmode="decimal" data-g="${esc(g)}" data-k="${esc(k)}" value="${v}" min="1"></label>`).join('')}</div>`).join('');
}