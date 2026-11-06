/* =============== EVENT HANDLERS & LOGIC =============== */
'use strict';
import { DEF, TR, THEMES } from './data.js';
import { ls } from './store.js';
import { t, msg, renderWater, renderEx, exCalc, renderProf, renderPlan, renderLog, renderProg, renderShop, renderSet, setAppData } from './ui.js';

let L = 'ar', W, plans, cur, CF, LOG, ASG, PROG, GCK, WG, WML, VIEW = 'ex', LD = '', PM = 'w', swap = null;
const LG = {};
const $ = i => document.getElementById(i);
const num = v => parseFloat(v) || 0;
const r1 = n => Math.round(n * 10) / 10;
const clone = o => JSON.parse(JSON.stringify(o));
const h = s => { let x = 5381; for (const c of s) x = ((x << 5) + x + c.charCodeAt(0)) | 0; return String(x); };
const iso = x => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
const pd = d => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd) };
const today = () => iso(new Date());
const addDays = (d, n) => { const x = pd(d); x.setDate(x.getDate() + n); return iso(x) };
const P = () => plans.find(p => p.id === cur) || plans[0];
const savePlans = () => { ls.set('plans', plans); ls.set('cur', cur); };
const pk = () => 'prof:' + ((ls.get('acc', null) || {}).u || '');
const dl = d => LOG[d] || (LOG[d] = { c: {}, w: 0 });

export function syncState(state) {
  L = state.L; W = state.W; plans = state.plans; cur = state.cur;
  CF = state.CF; LOG = state.LOG; ASG = state.ASG; PROG = state.PROG;
  GCK = state.GCK; WG = state.WG; WML = state.WML; VIEW = state.VIEW;
  LD = state.LD; PM = state.PM; swap = state.swap;
  setAppData(state);
}

export function applyLang() {
  const d = document.documentElement; d.lang = L; d.dir = L === 'ar' ? 'rtl' : 'ltr'; document.title = t('app');
  document.querySelectorAll('[data-i]').forEach(e => e.textContent = t(e.dataset.i));
  document.querySelectorAll('.lgb').forEach(b => b.textContent = L === 'ar' ? 'EN' : 'ع');
  document.querySelectorAll('#lgset button').forEach(b => b.classList.toggle('on', b.dataset.l === L));
  $('tout').innerHTML = '';
  if (!$('app').classList.contains('hide')) renderAll(); else showAuth();
}

export function setLang(l) { L = l; ls.set('lang', L); applyLang(); }

export function setTheme(x) {
  if (!THEMES[x]) x = 'dc'; document.documentElement.setAttribute('data-theme', x); ls.set('theme', x);
  const thsel = $('thsel'); if (thsel) thsel.value = x;
  document.querySelectorAll('#thbtn button').forEach(b => b.classList.toggle('on', b.dataset.t === x));
}

export function showAuth() {
  const acc = ls.get('acc', null); $('app').classList.add('hide'); $('login').classList.remove('hide');
  $('lt').textContent = t(acc ? 'login' : 'create'); $('lb').textContent = t(acc ? 'enter' : 'mk'); $('le').textContent = '';
}

export function enter() { $('login').classList.add('hide'); $('app').classList.remove('hide'); go(VIEW); }

export const R = { ex: renderEx, tdee: renderProf, plan: renderPlan, log: renderLog, prog: renderProg, shop: renderShop, set: renderSet };

export function go(v) {
  VIEW = v; Object.keys(R).forEach(k => $('v-' + k).classList.toggle('hide', k !== v));
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === v)); renderWater(); R[v](); window.scrollTo(0, 0);
}

export function renderAll() { renderWater(); R[VIEW](); }

export function wset(d, n) {
  const o = dl(d); o.w = Math.max(0, (o.w || 0) + n); ls.set('log', LOG); renderWater(); if (VIEW === 'log') renderLog();
}

// Bind all global DOM listeners
export function initListeners() {
  document.addEventListener('click', e => { if (e.target.classList && e.target.classList.contains('lgb')) setLang(L === 'ar' ? 'en' : 'ar') });
  const lgset = $('lgset'); if (lgset) lgset.onclick = e => { if (e.target.dataset.l) setLang(e.target.dataset.l) };
  
  const thsel = $('thsel');
  if (thsel) {
    thsel.innerHTML = Object.entries(THEMES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
    thsel.onchange = e => setTheme(e.target.value);
  }
  const thbtn = $('thbtn');
  if (thbtn) {
    thbtn.innerHTML = Object.entries(THEMES).map(([k, v]) => `<button class="t" data-t="${k}">${v}</button>`).join('');
    thbtn.onclick = e => { if (e.target.dataset.t) setTheme(e.target.dataset.t) };
  }

  $('lb').onclick = () => {
    const u = $('lu').value.trim(), p = $('lp').value, acc = ls.get('acc', null);
    if (!u || p.length < 4) { $('le').textContent = t('minc'); return; }
    if (!acc) ls.set('acc', { u, p: h(p) }); else if (acc.u !== u || acc.p !== h(p)) { $('le').textContent = t('badcred'); return; }
    ls.set('sess', true); $('lp').value = ''; enter();
  };
  $('lp').onkeydown = e => { if (e.key === 'Enter') $('lb').click() };
  $('out').onclick = () => { ls.set('sess', false); showAuth() };
  
  const sacc = $('sacc');
  if (sacc) sacc.onclick = () => {
    const u = $('nu').value.trim(), p = $('np').value;
    if (!u || p.length < 4) { msg('se', t('minc'), 1); return; }
    const old = pk(), pr = ls.get(old, null); ls.set('acc', { u, p: h(p) });
    if (pr && old !== pk()) { ls.set(pk(), pr); ls.del(old) }
    msg('se', t('saved')); $('nu').value = $('np').value = '';
  };

  const nav = $('nav');
  if (nav) nav.onclick = e => { const b = e.target.closest('[data-v]'); if (b) go(b.dataset.v) };

  const wchip = $('wchip');
  if (wchip) wchip.onclick = e => { const b = e.target.closest('[data-w]'); if (b) wset(today(), +b.dataset.w) };

  // Exchange inputs
  $('exg').onchange = () => { $('exa').value = ''; exCalc(); };
  $('exa').onchange = exCalc;
  $('exq').oninput = exCalc;

  // TDEE Calculator
  const tc = $('tc');
  if (tc) tc.onclick = () => {
    const a = num($('ta').value), w = num($('tw').value), hh = num($('th').value), bf = num($('tbf').value), lean = w * (1 - bf / 100), useBf = bf > 0 && bf < 70;
    const bmr = useBf ? 370 + 21.6 * lean : 10 * w + 6.25 * hh - 5 * a + ($('ts').value === 'm' ? 5 : -161);
    const tdee = bmr * num($('tact').value), g = num($('tg').value), tg = tdee + g;
    const p = w * (g < 0 ? 2 : 1.8), f = tg * .25 / 9, c = (tg - p * 4 - f * 9) / 4;
    $('tout').innerHTML = `<div class="bar"><div><b>${Math.round(bmr)}</b><span>BMR</span></div><div><b>${Math.round(tdee)}</b><span>TDEE</span></div><div><b>${Math.round(tg)}</b><span>${t('tcal')}</span></div><div><b>${r1(w / ((hh / 100) ** 2))}</b><span>BMI</span></div></div>`;
  };

  // Plan Handlers
  $('psel').onchange = e => { cur = +e.target.value; swap = null; savePlans(); renderPlan(); };
  $('pnew').onclick = () => { const id = Date.now(); plans.push({ id, name: t('newplan'), meals: [] }); cur = id; savePlans(); renderPlan(); };
  $('pname').oninput = e => { P().name = e.target.value; savePlans(); $('ptitle').textContent = e.target.value; $('psel').options[$('psel').selectedIndex].text = e.target.value; };
  $('padd').onclick = () => { P().meals.push({ name: t('meal') + ' ' + (P().meals.length + 1), items: [], k: 0, p: 0, c: 0, f: 0, man: false }); savePlans(); renderPlan(); };
  $('ppdf').onclick = () => window.print();

  // Progress Handlers
  const pradd = $('pradd');
  if (pradd) pradd.onclick = () => {
    const d = $('prd').value || today(), w = num($('prw').value), bf = num($('prb').value), wa = num($('prwa').value);
    if (!(w > 0 || bf > 0 || wa > 0)) { msg('prerr', t('need1'), 1); return; }
    let o = PROG.find(e => e.d === d); if (!o) { o = { d }; PROG.push(o); }
    if (w > 0) o.w = w; if (bf > 0) o.bf = bf; if (wa > 0) o.wa = wa;
    PROG.sort((a, b) => a.d < b.d ? -1 : 1); ls.set('prog', PROG); ['prw', 'prb', 'prwa'].forEach(i => $(i).value = ''); msg('prerr', ''); renderProg();
  };
}