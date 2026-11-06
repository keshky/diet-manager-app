/* =============== STORAGE ENGINE MODULE =============== */
'use strict';

export const KEYS = ['theme', 'lang', 'acc', 'sess', 'dw', 'plans', 'cur', 'cf', 'log', 'assign', 'prog', 'gck', 'wg', 'wml'];

const DB = {
  db: null,
  open() {
    return Promise.race([
      new Promise(r => {
        try {
          const q = indexedDB.open('dietapp', 1);
          q.onupgradeneeded = () => q.result.createObjectStore('kv');
          q.onsuccess = () => { DB.db = q.result; r(); };
          q.onerror = () => r();
        } catch (e) { r(); }
      }),
      new Promise(r => setTimeout(r, 1500))
    ]);
  },
  put(k, v) {
    try { DB.db && DB.db.transaction('kv', 'readwrite').objectStore('kv').put(v, k); } catch (e) {}
  },
  del(k) {
    try { DB.db && DB.db.transaction('kv', 'readwrite').objectStore('kv').delete(k); } catch (e) {}
  },
  all() {
    return new Promise(r => {
      try {
        if (!DB.db) return r({});
        const o = {}, c = DB.db.transaction('kv').objectStore('kv').openCursor();
        c.onsuccess = e => {
          const x = e.target.result;
          if (x) { o[x.key] = x.value; x.continue(); } else r(o);
        };
        c.onerror = () => r({});
      } catch (e) { r({}); }
    });
  }
};

export const isApp = k => KEYS.includes(k) || k.startsWith('prof:');

export const ls = {
  mem: {},
  get(k, d) {
    const v = this.mem[k];
    if (v == null) return d;
    try { return JSON.parse(v); } catch (e) { return d; }
  },
  set(k, v) {
    const s = JSON.stringify(v);
    this.mem[k] = s;
    try { localStorage.setItem(k, s); } catch (e) {}
    DB.put(k, s);
  },
  del(k) {
    delete this.mem[k];
    try { localStorage.removeItem(k); } catch (e) {}
    DB.del(k);
  },
  keys() { return Object.keys(this.mem); }
};

export async function bootStore() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isApp(k)) ls.mem[k] = localStorage.getItem(k);
    }
  } catch (e) {}
  await DB.open();
  const all = await DB.all();
  for (const k in all) {
    if (isApp(k) && ls.mem[k] == null) {
      ls.mem[k] = all[k];
      try { localStorage.setItem(k, all[k]); } catch (e) {}
    }
  }
  for (const k in ls.mem) DB.put(k, ls.mem[k]);
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
}