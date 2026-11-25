// Telefondaki demo uygulamanın canlı durumu: aktif ekran, sepet, siparişler, ayarlar.
// Tamamen istemci tarafında ve temsilidir.
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { INITIAL_CART, initialOrders, getDish, COURIERS } from '../config/content.js';

export const AppCtx = createContext(null);
/** Ekran bileşenleri için: { store, layout, hidden, opts, ui, logo }. Panel önizlemelerinde null olabilir. */
export const useApp = () => useContext(AppCtx);

const STAGES = [
  { at: 0, key: 'received', label: 'Sipariş alındı' },
  { at: 0.15, key: 'preparing', label: 'Hazırlanıyor' },
  { at: 0.4, key: 'onway', label: 'Yolda' },
  { at: 0.97, key: 'delivered', label: 'Teslim edildi' },
];
export const STAGE_LIST = STAGES;

/** Aktif siparişin anlık ilerlemesi (zamana bağlı, en fazla %93 → "yolda" kalır). */
export function orderProgress(o, now) {
  if (o.status !== 'active') return 1;
  return Math.min(0.93, o.p0 + (now - o.t0) / o.dur);
}
export function stageOf(p) {
  let s = STAGES[0];
  for (const st of STAGES) if (p >= st.at) s = st;
  return s;
}
export const etaOf = (p) => Math.max(2, Math.round((1 - p) * 32));

export function orderTotal(items) {
  return items.reduce((sum, it) => sum + (getDish(it.dishId)?.price || 0) * it.qty, 0);
}

export function cartTotals(cart, couponOn) {
  const sub = orderTotal(cart);
  const fee = sub === 0 || sub >= 300 ? 0 : 19.9;
  const discount = couponOn && sub >= 150 ? Math.min(100, Math.round(sub * 0.4)) : 0;
  return { sub, fee, discount, total: Math.max(0, sub + fee - discount), couponEligible: sub >= 150 };
}

function addItems(cart, items) {
  const next = cart.map((x) => ({ ...x }));
  for (const it of items) {
    const f = next.find((x) => x.dishId === it.dishId);
    if (f) f.qty += it.qty;
    else next.push({ ...it });
  }
  return next;
}

function initial() {
  return {
    screen: 'home',
    cart: INITIAL_CART,
    orders: initialOrders(),
    couponOn: true,
    note: '',
    filter: 'all',
    cuisine: 'all',
    settings: { notif: true, promo: false },
    toast: null,
    seq: 1,
  };
}

function reducer(s, a) {
  switch (a.type) {
    case 'nav':
      return { ...s, screen: a.screen };
    case 'add':
      return { ...s, cart: addItems(s.cart, [{ dishId: a.dishId, qty: 1 }]) };
    case 'qty': {
      const cart = s.cart.map((x) => (x.dishId === a.dishId ? { ...x, qty: a.qty } : x)).filter((x) => x.qty > 0);
      return { ...s, cart };
    }
    case 'reorder': {
      const o = s.orders.find((x) => x.id === a.id);
      return o ? { ...s, cart: addItems(s.cart, o.items) } : s;
    }
    case 'rate':
      return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, rating: { stars: a.stars, tags: a.tags } } : o)) };
    case 'checkout': {
      if (!s.cart.length) return s;
      const id = `G-${24818 + s.seq}`;
      const order = {
        id,
        restaurantId: getDish(s.cart[0].dishId).restaurantId,
        items: s.cart,
        placed: 'Az önce',
        status: 'active',
        p0: 0.02,
        t0: Date.now(),
        dur: 240000,
        courier: COURIERS[s.seq % COURIERS.length],
        rating: null,
      };
      // Önceki aktif sipariş teslim edilmiş sayılır
      const old = s.orders.map((o) => (o.status === 'active' ? { ...o, status: 'delivered', placed: 'Bugün' } : o));
      return { ...s, cart: [], note: '', orders: [order, ...old], seq: s.seq + 1, screen: 'orders' };
    }
    case 'set':
      return { ...s, [a.key]: a.value };
    case 'setting':
      return { ...s, settings: { ...s.settings, [a.key]: !s.settings[a.key] } };
    case 'toast':
      return { ...s, toast: { msg: a.msg, id: Date.now() } };
    case 'clearToast':
      return s.toast && s.toast.id === a.id ? { ...s, toast: null } : s;
    case 'reset':
      return { ...initial(), screen: s.screen };
    default:
      return s;
  }
}

export function useAppStore() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const api = useMemo(
    () => ({
      navigate: (screen) => dispatch({ type: 'nav', screen }),
      add: (dishId) => dispatch({ type: 'add', dishId }),
      setQty: (dishId, qty) => dispatch({ type: 'qty', dishId, qty }),
      reorder: (id) => {
        dispatch({ type: 'reorder', id });
        dispatch({ type: 'toast', msg: 'Ürünler sepete eklendi' });
      },
      rate: (id, stars, tags) => {
        dispatch({ type: 'rate', id, stars, tags });
        dispatch({ type: 'toast', msg: 'Değerlendirmen için teşekkürler!' });
      },
      checkout: () => {
        dispatch({ type: 'checkout' });
        dispatch({ type: 'toast', msg: 'Siparişin alındı, restoran hazırlıyor' });
      },
      set: (key, value) => dispatch({ type: 'set', key, value }),
      toggleSetting: (key) => dispatch({ type: 'setting', key }),
      notify: (msg) => dispatch({ type: 'toast', msg }),
      clearToast: (id) => dispatch({ type: 'clearToast', id }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );
  const cartCount = state.cart.reduce((n, x) => n + x.qty, 0);
  return useMemo(() => ({ ...state, ...api, cartCount }), [state, api, cartCount]);
}

/** Saniyelik saat; yalnızca canlı takip gösteren bileşenlerde kullanılır. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

export const useStableCallback = (fn) => useCallback(fn, []); // eslint-disable-line react-hooks/exhaustive-deps
