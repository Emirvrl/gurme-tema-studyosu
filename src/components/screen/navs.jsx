import { useState } from 'react';
import { Home, UtensilsCrossed, ShoppingCart, ShoppingBasket, ReceiptText, User } from 'lucide-react';
import { useT } from '../../lib/theme.js';
import { rgba, mix, contrast } from '../../lib/color.js';
import { CART_COUNT, NAV_ITEMS, fmtTL } from '../../config/content.js';
import { useApp, cartTotals } from '../../lib/store.js';

/** Zemin üzerinde okunur ilk rengi seçer (ör. koyu adada siyah ana renk görünmez). */
const readable = (bg, ...cands) => cands.find((x) => contrast(x, bg) >= 3) || cands[cands.length - 1];
/** Sepetteki ürün sayısı (panel önizlemelerinde sabit demo değeri) */
const useCartCount = () => useApp()?.store.cartCount ?? CART_COUNT;

// Alt bar varyantları. Kayıt/metadata: src/config/components.js → NAV_VARIANTS
// Her varyant { c, t, T, active, setActive } alır; sekmelere tıklanınca aktif sekme değişir.

const ICONS = { home: Home, food: UtensilsCrossed, cart: ShoppingCart, orders: ReceiptText, account: User };
const SIDE_ITEMS = NAV_ITEMS.filter((n) => n.id !== 'cart');

function Badge({ c, style }) {
  const count = useCartCount();
  if (!count) return null;
  return (
    <span key={count} className="absolute flex items-center justify-center" style={{ top: -4, right: -6, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 99, background: c.accent, color: c.onAccent, fontSize: 10.5, fontWeight: 800, borderWidth: 2, borderStyle: 'solid', borderColor: c.bg, animation: 'gurme-pop .35s ease', ...style }}>
      {count}
    </span>
  );
}

const HomeIndicator = ({ color, android }) => (
  <div className="flex justify-center" style={{ paddingTop: android ? 6 : 8, paddingBottom: android ? 6 : 8 }}>
    <span style={{ width: android ? 108 : 134, height: android ? 4 : 5, borderRadius: 99, background: color, opacity: android ? 0.5 : 0.9 }} />
  </div>
);

const Wrap = ({ children, style }) => (
  <div className="absolute bottom-0 left-0 right-0 z-30" style={style}>
    {children}
  </div>
);

const tap = (setActive, id) => ({ onClick: () => setActive(id), role: 'button', style: { cursor: 'pointer' } });

/* ------------------------------ mevcut tasarımlar ------------------------------ */

function NavArch({ c, active, setActive }) {
  return (
    <Wrap style={{ background: c.bg }}>
      <div className="relative" style={{ borderTop: `2px solid ${c.text}` }}>
        <div {...tap(setActive, 'cart')} className="absolute left-1/2 flex items-center justify-center" style={{ width: 84, height: 42, top: -42, transform: 'translateX(-50%)', borderRadius: '84px 84px 0 0', border: `2px solid ${c.text}`, borderBottom: 'none', background: active === 'cart' ? c.surface : c.bg, cursor: 'pointer' }}>
          <span className="relative" style={{ marginTop: 10 }}>
            <ShoppingCart size={28} color={active === 'cart' ? c.primary : c.text} strokeWidth={2.2} />
            <Badge c={c} />
          </span>
        </div>
        <div className="grid grid-cols-5" style={{ height: 54 }}>
          {NAV_ITEMS.map((n, i) => {
            const Icon = ICONS[n.id];
            const on = active === n.id;
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex items-center justify-center" style={{ cursor: 'pointer', borderLeft: i > 0 && i !== 3 ? `1.5px solid ${c.text}` : 'none', color: on ? c.primary : c.text, fontWeight: 700, fontSize: 13, textDecoration: on && n.id !== 'home' && n.id !== 'cart' ? 'underline' : 'none', textUnderlineOffset: 4 }}>
                {n.id === 'cart' ? <span style={{ fontSize: 11, color: c.muted, marginTop: 14 }}>Sepet</span> : n.id === 'home' ? <Icon size={22} color={on ? c.primary : c.text} strokeWidth={2.4} /> : n.label}
              </div>
            );
          })}
        </div>
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

function NavIos({ c, active, setActive, neutral }) {
  return (
    <Wrap
      style={{
        background: neutral ? c.surface : rgba(c.bg, 0.86),
        backdropFilter: neutral ? undefined : 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: neutral ? undefined : 'blur(20px) saturate(180%)',
        borderTop: `${neutral ? 1 : 0.5}px solid ${c.hairline}`,
      }}
    >
      <div className="grid grid-cols-5" style={{ height: 54, paddingTop: 7 }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          if (neutral && n.id === 'cart') {
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex justify-center">
                <span className="relative flex items-center justify-center" style={{ width: 52, height: 52, marginTop: -20, borderRadius: 999, background: c.primary, color: c.onPrimary, boxShadow: `0 8px 18px -8px ${c.primary}`, outline: on ? `3px solid ${rgba(c.primary, 0.3)}` : 'none' }}>
                  <ShoppingCart size={22} />
                  <Badge c={c} />
                </span>
              </div>
            );
          }
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 3, color: on ? c.primary : c.muted, fontSize: 10, fontWeight: 500 }}>
              <span className="relative">
                <Icon size={23} strokeWidth={on ? 2.4 : 1.8} fill={on && !neutral ? rgba(c.primary, 0.15) : 'none'} />
                {n.id === 'cart' && <Badge c={c} />}
              </span>
              {n.label}
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

function NavMaterial({ c, active, setActive }) {
  return (
    <Wrap style={{ background: mix(c.surface, c.primary, 0.06) }}>
      <div className="grid grid-cols-5" style={{ height: 72, paddingTop: 12 }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 4, color: on ? c.text : c.muted, fontSize: 12, fontWeight: on ? 700 : 500 }}>
              <span className="relative flex items-center justify-center" style={{ width: on ? 60 : 32, height: 32, borderRadius: 99, background: on ? mix(c.primary, c.bg, 0.75) : 'transparent', transition: 'all .25s' }}>
                <Icon size={22} strokeWidth={on ? 2.5 : 2} />
                {n.id === 'cart' && <Badge c={c} style={{ top: -2, right: on ? 8 : -6 }} />}
              </span>
              {n.label}
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} android />
    </Wrap>
  );
}

function NavFloating({ c, active, setActive }) {
  return (
    <Wrap style={{ padding: '0 14px', background: `linear-gradient(180deg, ${rgba(c.bg, 0)}, ${c.bg} 45%)` }}>
      <div className="relative grid grid-cols-5 items-center" style={{ height: 64, borderRadius: 24, background: c.inverseBg, boxShadow: `0 16px 30px -14px ${c.shadowColor}` }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          if (n.id === 'cart') {
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex justify-center">
                <span className="relative flex items-center justify-center" style={{ width: 58, height: 58, marginTop: -30, borderRadius: 999, background: c.primary, color: c.onPrimary, border: `5px solid ${c.bg}`, boxShadow: `0 10px 20px -8px ${c.primary}` }}>
                  <ShoppingBasket size={24} strokeWidth={2.4} />
                  <Badge c={c} style={{ top: -2, right: -2, borderColor: c.primary }} />
                </span>
              </div>
            );
          }
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 3, color: on ? readable(c.inverseBg, c.primary, c.accent, c.inverseFg) : rgba(c.inverseFg, 0.6), fontSize: 10.5, fontWeight: 700 }}>
              <Icon size={21} strokeWidth={on ? 2.6 : 2} />
              {n.label}
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

function NavGlass({ c, T, active, setActive }) {
  return (
    <Wrap style={{ padding: '0 14px' }}>
      <div
        className="grid grid-cols-5 items-center"
        style={{ height: 66, borderRadius: 28, background: rgba(c.surface, T.dark ? 0.6 : 0.72), backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)', border: `1px solid ${T.dark ? 'rgba(255,255,255,0.12)' : rgba(c.text, 0.08)}` }}
      >
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          if (n.id === 'cart') {
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex justify-center">
                <span className="relative flex items-center justify-center" style={{ width: 50, height: 50, borderRadius: 18, background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`, color: '#fff', boxShadow: `0 0 22px ${rgba(c.primary, 0.75)}` }}>
                  <ShoppingCart size={22} strokeWidth={2.4} />
                  <Badge c={c} style={{ background: c.secondary, color: c.onSecondary, borderColor: 'transparent' }} />
                </span>
              </div>
            );
          }
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 3, color: on ? c.text : c.muted, fontSize: 10.5, fontWeight: on ? 700 : 500 }}>
              <Icon size={21} strokeWidth={on ? 2.5 : 2} style={on ? { filter: `drop-shadow(0 0 6px ${c.accent})`, color: c.accent } : undefined} />
              {n.label}
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

function NavEditorial({ c, t, active, setActive }) {
  return (
    <Wrap style={{ background: c.surface, borderRadius: '28px 28px 0 0', boxShadow: `0 -10px 30px -20px ${rgba(c.text, 0.4)}` }}>
      <div className="grid grid-cols-5 items-center" style={{ height: 64, padding: '0 6px' }}>
        {NAV_ITEMS.map((n) => {
          if (n.id === 'cart') {
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex justify-center">
                <span className="relative flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 16, background: c.primary, color: c.onPrimary }}>
                  <ShoppingBasket size={22} />
                  <Badge c={c} style={{ borderColor: c.surface }} />
                </span>
              </div>
            );
          }
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 5, color: on ? c.text : c.muted, fontSize: 12.5, fontFamily: t.fonts.head, fontStyle: on ? 'normal' : 'italic', fontWeight: on ? 600 : 400 }}>
              {n.label}
              <span style={{ width: 5, height: 5, borderRadius: 9, background: on ? c.primary : 'transparent' }} />
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/* ------------------------------ yeni özgün tasarımlar ------------------------------ */

/** Oyuklu Dock: barın ortasında içbükey oyuk, sepet oyuğa oturur. */
function NavNotch({ c, T, active, setActive }) {
  const H = 66;
  const path = `M0 20 Q0 0 20 0 H136 C152 0 156 6 161 16 C169 32 180 40 195 40 C210 40 221 32 229 16 C234 6 238 0 254 0 H370 Q390 0 390 20 V${H} H0 Z`;
  return (
    <Wrap>
      <div className="relative" style={{ height: H }}>
        <svg className="absolute inset-0" width="390" height={H} viewBox={`0 0 390 ${H}`} preserveAspectRatio="none" style={{ filter: `drop-shadow(0 -6px 14px ${rgba(c.text, T.dark ? 0.5 : 0.1)})` }}>
          <path d={path} fill={c.surface} />
        </svg>
        <span {...tap(setActive, 'cart')} className="absolute left-1/2 flex items-center justify-center" style={{ cursor: 'pointer', top: -22, width: 58, height: 58, transform: 'translateX(-50%)', borderRadius: 999, background: `linear-gradient(145deg, ${c.primary}, ${mix(c.primary, '#000000', 0.2)})`, color: c.onPrimary, boxShadow: `0 10px 22px -8px ${c.primary}` }}>
          <ShoppingCart size={24} strokeWidth={2.4} />
          <Badge c={c} style={{ top: -2, right: -2, borderColor: c.surface }} />
        </span>
        <div className="relative grid grid-cols-5" style={{ height: H, paddingTop: 14 }}>
          {NAV_ITEMS.map((n) => {
            if (n.id === 'cart') return <div key={n.id} className="flex items-end justify-center" style={{ fontSize: 10.5, fontWeight: 600, color: active === 'cart' ? c.primary : c.muted, paddingBottom: 8 }}>Sepet</div>;
            const Icon = ICONS[n.id];
            const on = active === n.id;
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 4, color: on ? c.primary : c.muted, fontSize: 10.5, fontWeight: on ? 700 : 500 }}>
                <Icon size={22} strokeWidth={on ? 2.5 : 1.9} />
                {n.label}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: c.surface }}>
        <HomeIndicator color={c.text} />
      </div>
    </Wrap>
  );
}

/** Genişleyen Kapsül: aktif sekme ikon + yazıyla açılır, diğerleri sadece ikon. */
function NavExpand({ c, active, setActive }) {
  const count = useCartCount();
  return (
    <Wrap style={{ padding: '0 14px', background: `linear-gradient(180deg, ${rgba(c.bg, 0)}, ${c.bg} 50%)` }}>
      <div className="flex items-center justify-between" style={{ height: 62, padding: '0 8px', borderRadius: 999, background: c.surface, boxShadow: `0 14px 30px -14px ${c.shadowColor}, inset 0 0 0 1px ${c.hairline}` }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div
              key={n.id}
              {...tap(setActive, n.id)}
              className="relative flex items-center overflow-hidden"
              style={{ cursor: 'pointer', height: 46, gap: 7, padding: on ? '0 16px 0 13px' : '0 12px', borderRadius: 999, background: on ? c.primary : 'transparent', color: on ? c.onPrimary : c.muted, fontWeight: 700, fontSize: 13, transition: 'all .3s cubic-bezier(.2,.8,.2,1)' }}
            >
              <span className="relative flex">
                <Icon size={21} strokeWidth={on ? 2.5 : 2} />
                {n.id === 'cart' && !on && <Badge c={c} style={{ borderColor: c.surface }} />}
              </span>
              {on && <span className="whitespace-nowrap">{n.id === 'cart' ? `Sepet · ${count}` : n.label}</span>}
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** İkiz Ada: dört sekme bir adada, sepet tutarıyla ayrı bir adada. */
function NavSplit({ c, active, setActive }) {
  const app = useApp();
  const total = app ? fmtTL(cartTotals(app.store.cart, app.store.couponOn).total) : '₺348';
  return (
    <Wrap style={{ padding: '0 14px', background: `linear-gradient(180deg, ${rgba(c.bg, 0)}, ${c.bg} 50%)` }}>
      <div className="flex items-stretch" style={{ gap: 10, height: 62 }}>
        <div className="grid flex-1 grid-cols-4 items-center" style={{ borderRadius: 22, background: c.surface, boxShadow: `0 14px 30px -16px ${c.shadowColor}, inset 0 0 0 1px ${c.hairline}` }}>
          {SIDE_ITEMS.map((n) => {
            const Icon = ICONS[n.id];
            const on = active === n.id;
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 3, color: on ? c.text : c.muted, fontSize: 10, fontWeight: on ? 700 : 500 }}>
                <Icon size={20} strokeWidth={on ? 2.5 : 1.9} color={on ? c.primary : undefined} />
                {n.label}
              </div>
            );
          })}
        </div>
        <div {...tap(setActive, 'cart')} className="flex items-center" style={{ cursor: 'pointer', gap: 10, padding: '0 14px 0 12px', borderRadius: 22, background: c.primary, color: c.onPrimary, boxShadow: `0 14px 26px -12px ${c.primary}` }}>
          <span className="relative flex">
            <ShoppingBasket size={22} strokeWidth={2.4} />
            <Badge c={c} style={{ borderColor: c.primary }} />
          </span>
          <span className="flex flex-col leading-tight">
            <span style={{ fontSize: 10.5, opacity: 0.85 }}>Sepet</span>
            <b style={{ fontSize: 14 }}>{total}</b>
          </span>
        </div>
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Üst Çizgi: düz bar, aktif sekmenin üstünde çizgi, sepet metin etiketi. */
function NavTopline({ c, active, setActive }) {
  const count = useCartCount();
  return (
    <Wrap style={{ background: c.bg, borderTop: `1px solid ${c.hairline}` }}>
      <div className="grid grid-cols-5" style={{ height: 58 }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          if (n.id === 'cart') {
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex items-center justify-center" style={{ cursor: 'pointer' }}>
                <span style={{ whiteSpace: 'nowrap', fontSize: 11, fontWeight: 800, letterSpacing: '.03em', padding: '6px 9px', borderRadius: 99, border: `1.5px solid ${c.primary}`, color: on ? c.onPrimary : c.primary, background: on ? c.primary : 'transparent' }}>
                  SEPET · {count}
                </span>
              </div>
            );
          }
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="relative flex flex-col items-center justify-center" style={{ cursor: 'pointer', gap: 4, color: on ? c.text : c.muted }}>
              <span className="absolute top-0" style={{ width: on ? 30 : 0, height: 3, borderRadius: '0 0 3px 3px', background: c.primary, transition: 'width .25s' }} />
              <Icon size={20} strokeWidth={on ? 2.3 : 1.7} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>{n.label}</span>
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Neo-Brutal: kalın çerçeve, sert ofset gölge, eğik sepet. */
function NavBrutal({ c, active, setActive }) {
  const ink = c.text;
  return (
    <Wrap style={{ padding: '0 16px' }}>
      <div className="grid grid-cols-5 items-center" style={{ height: 64, borderRadius: 18, background: c.surface, border: `2.5px solid ${ink}`, boxShadow: `5px 5px 0 ${ink}` }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          if (n.id === 'cart') {
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex justify-center">
                <span className="relative flex items-center justify-center" style={{ cursor: 'pointer', width: 54, height: 54, marginTop: -26, borderRadius: 14, background: c.primary, color: c.onPrimary, border: `2.5px solid ${ink}`, boxShadow: `4px 4px 0 ${ink}`, transform: 'rotate(-6deg)' }}>
                  <ShoppingCart size={24} strokeWidth={2.6} />
                  <Badge c={c} style={{ borderColor: ink, transform: 'rotate(6deg)' }} />
                </span>
              </div>
            );
          }
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex justify-center">
              <span className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 2, padding: '5px 8px', borderRadius: 10, background: on ? c.accent : 'transparent', color: on ? c.onAccent : ink, border: on ? `2px solid ${ink}` : '2px solid transparent', fontSize: 10, fontWeight: 800 }}>
                <Icon size={19} strokeWidth={2.5} />
                {n.label}
              </span>
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Squircle Dock: kare-yuvarlak ikon kutuları, aktif kutu büyür ve yükselir. */
function NavDock({ c, T, active, setActive }) {
  const tones = { home: c.primarySoft, food: c.accentSoft, orders: c.secondarySoft, account: c.fill };
  return (
    <Wrap style={{ padding: '0 22px' }}>
      <div
        className="flex items-end justify-between"
        style={{ height: 70, padding: '0 12px 10px', borderRadius: 26, background: rgba(c.surface, 0.82), backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${T.dark ? 'rgba(255,255,255,.1)' : rgba(c.text, 0.07)}`, boxShadow: `0 16px 32px -18px ${c.shadowColor}` }}
      >
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          const isCart = n.id === 'cart';
          const bg = on ? c.primary : isCart ? c.accent : tones[n.id];
          const fg = on ? c.onPrimary : isCart ? c.onAccent : c.text;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 5 }}>
              <span className="relative flex items-center justify-center" style={{ width: 46, height: 46, borderRadius: 15, background: bg, color: fg, transform: on ? 'translateY(-8px) scale(1.14)' : 'none', transition: 'transform .3s cubic-bezier(.3,1.4,.5,1)', boxShadow: on ? `0 10px 18px -8px ${c.primary}` : 'none' }}>
                <Icon size={21} strokeWidth={2.3} />
                {isCart && <Badge c={c} style={{ background: c.primary, color: c.onPrimary, borderColor: c.surface }} />}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: 9, background: on ? c.text : 'transparent', marginTop: on ? -6 : 0 }} />
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/* ------------------------------ ek tasarımlar (v3) ------------------------------ */

/** Hap Sekmeler: segment kontrolü gibi, aktif sekme dolu kapsül. */
function NavSegmented({ c, active, setActive }) {
  return (
    <Wrap style={{ padding: '0 14px', background: `linear-gradient(180deg, ${rgba(c.bg, 0)}, ${c.bg} 50%)` }}>
      <div className="grid grid-cols-5" style={{ padding: 5, borderRadius: 999, background: c.fill, boxShadow: `inset 0 0 0 1px ${c.hairline}`, backdropFilter: 'blur(12px)' }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="relative flex flex-col items-center justify-center" style={{ cursor: 'pointer', height: 52, gap: 2, borderRadius: 999, background: on ? c.surface : 'transparent', boxShadow: on ? `0 4px 12px -4px ${c.shadowColor}` : 'none', color: on ? c.primary : c.muted, fontSize: 10, fontWeight: 700, transition: 'all .25s' }}>
              <span className="relative flex">
                <Icon size={19} strokeWidth={on ? 2.5 : 2} />
                {n.id === 'cart' && <Badge c={c} style={{ top: -6, right: -10 }} />}
              </span>
              {n.label}
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Sağ FAB: dört sekme düz barda, sepet sağ üstte süzülen Material FAB. */
function NavFab({ c, active, setActive }) {
  return (
    <Wrap>
      <div className="flex justify-end" style={{ padding: '0 18px 12px' }}>
        <span {...tap(setActive, 'cart')} className="relative flex items-center" style={{ cursor: 'pointer', gap: 8, height: 56, padding: '0 20px 0 16px', borderRadius: 18, background: c.primary, color: c.onPrimary, fontWeight: 800, fontSize: 14, boxShadow: `0 12px 24px -10px ${c.primary}` }}>
          <ShoppingBasket size={21} strokeWidth={2.4} /> Sepet
          <Badge c={c} style={{ top: -6, right: -6 }} />
        </span>
      </div>
      <div style={{ background: c.surface, borderTop: `1px solid ${c.hairline}` }}>
        <div className="grid grid-cols-4" style={{ height: 58 }}>
          {SIDE_ITEMS.map((n) => {
            const Icon = ICONS[n.id];
            const on = active === n.id;
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center justify-center" style={{ cursor: 'pointer', gap: 3, color: on ? c.primary : c.muted, fontSize: 11, fontWeight: on ? 700 : 500 }}>
                <Icon size={21} strokeWidth={on ? 2.5 : 1.9} />
                {n.label}
              </div>
            );
          })}
        </div>
        <HomeIndicator color={c.text} />
      </div>
    </Wrap>
  );
}

/** İkon + Nokta: etiketsiz ikonlar, aktif altında uzayan nokta; sepet sayısı yanında yazılı. */
function NavIconDot({ c, active, setActive }) {
  const count = useCartCount();
  return (
    <Wrap style={{ background: c.surface, boxShadow: `0 -1px 0 ${c.hairline}` }}>
      <div className="flex items-center justify-around" style={{ height: 60 }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center" style={{ cursor: 'pointer', gap: 5, color: on ? c.primary : c.muted }}>
              <span className="flex items-center" style={{ gap: 4 }}>
                <Icon size={24} strokeWidth={on ? 2.5 : 1.8} />
                {n.id === 'cart' && count > 0 && <b style={{ fontSize: 12, color: c.text }}>{count}</b>}
              </span>
              <span style={{ width: on ? 18 : 4, height: 4, borderRadius: 9, background: on ? c.primary : 'transparent', transition: 'width .25s' }} />
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Gradyan Şerit: ana → vurgu gradyanlı ada, aktif sekme beyaz kapsül. */
function NavGradient({ c, active, setActive }) {
  const fg = readable(c.primary, '#FFFFFF', '#111113');
  return (
    <Wrap style={{ padding: '0 14px' }}>
      <div className="grid grid-cols-5 items-center" style={{ height: 64, padding: '0 6px', borderRadius: 24, background: `linear-gradient(100deg, ${c.primary}, ${mix(c.primary, c.accent, 0.7)})`, boxShadow: `0 14px 28px -14px ${c.primary}` }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex justify-center">
              <span className="relative flex flex-col items-center justify-center" style={{ cursor: 'pointer', width: 58, height: 50, gap: 2, borderRadius: 16, background: on ? '#FFFFFF' : 'transparent', color: on ? c.primary : rgba(fg, 0.85), fontSize: 10, fontWeight: 700, transition: 'all .25s' }}>
                <Icon size={20} strokeWidth={2.3} />
                {n.label}
                {n.id === 'cart' && <Badge c={c} style={{ top: 0, right: 6, borderColor: 'transparent', background: c.secondary, color: c.onSecondary }} />}
              </span>
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Kabarcık: aktif sekmenin ikonu bardan yukarı taşan bir daireye kayar. */
function NavBubble({ c, T, active, setActive }) {
  const idx = Math.max(0, NAV_ITEMS.findIndex((n) => n.id === active));
  const W = 390 / 5;
  const ActiveIcon = ICONS[NAV_ITEMS[idx].id];
  return (
    <Wrap>
      <div className="relative" style={{ height: 64, background: c.surface, boxShadow: `0 -8px 20px -14px ${rgba(c.text, T.dark ? 0.6 : 0.3)}` }}>
        <span className="absolute flex items-center justify-center" style={{ left: idx * W + W / 2 - 27, top: -24, width: 54, height: 54, borderRadius: 999, background: c.primary, color: c.onPrimary, border: `5px solid ${c.bg}`, boxShadow: `0 8px 16px -6px ${c.primary}`, transition: 'left .4s cubic-bezier(.3,1.3,.5,1)' }}>
          <ActiveIcon size={21} strokeWidth={2.4} />
        </span>
        <div className="grid grid-cols-5" style={{ height: 64 }}>
          {NAV_ITEMS.map((n) => {
            const Icon = ICONS[n.id];
            const on = active === n.id;
            return (
              <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center justify-end" style={{ cursor: 'pointer', paddingBottom: 9, gap: 4, color: on ? c.primary : c.muted, fontSize: 10.5, fontWeight: on ? 700 : 500 }}>
                <span className="relative flex" style={{ opacity: on ? 0 : 1, transition: 'opacity .2s' }}>
                  <Icon size={20} strokeWidth={1.9} />
                  {n.id === 'cart' && <Badge c={c} style={{ borderColor: c.surface }} />}
                </span>
                {n.label}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: c.surface }}>
        <HomeIndicator color={c.text} />
      </div>
    </Wrap>
  );
}

/** Kontur Kutu: her sekme çerçeveli kutu, aktif kutu dolu (taslak diline yakın). */
function NavOutlineBox({ c, t, active, setActive }) {
  return (
    <Wrap style={{ background: c.bg, borderTop: `1px solid ${c.hairline}` }}>
      <div className="grid grid-cols-5" style={{ gap: 6, padding: '8px 10px 2px' }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="relative flex flex-col items-center justify-center" style={{ cursor: 'pointer', height: 52, gap: 2, borderRadius: Math.min(12, t.radius.control), border: `1.5px solid ${on ? c.text : c.hairline}`, background: on ? c.text : 'transparent', color: on ? c.bg : c.text, fontSize: 10, fontWeight: 700 }}>
              <Icon size={18} strokeWidth={2.2} />
              {n.label}
              {n.id === 'cart' && <Badge c={c} style={{ top: -7, right: -5 }} />}
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Kayan Çizgi: üstte aktif sekmeye kayan çizgi. */
function NavSlider({ c, t, active, setActive }) {
  const count = useCartCount();
  const idx = Math.max(0, NAV_ITEMS.findIndex((n) => n.id === active));
  return (
    <Wrap style={{ background: c.bg, borderTop: `1px solid ${c.hairline}` }}>
      <div className="relative grid grid-cols-5" style={{ height: 56 }}>
        <span className="absolute top-0" style={{ left: `calc(${idx * 20 + 10}% - 16px)`, width: 32, height: 3, borderRadius: '0 0 4px 4px', background: c.primary, transition: 'left .35s cubic-bezier(.3,1.2,.5,1)' }} />
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="flex flex-col items-center justify-center" style={{ cursor: 'pointer', gap: 4, color: on ? c.text : c.muted, fontFamily: t.fonts.head }}>
              <Icon size={21} strokeWidth={on ? 2.5 : 1.7} />
              <span style={{ fontSize: 11, fontWeight: on ? 800 : 500 }}>{n.id === 'cart' && count ? `${n.label} (${count})` : n.label}</span>
            </div>
          );
        })}
      </div>
      <HomeIndicator color={c.text} />
    </Wrap>
  );
}

/** Klasör Sekmeleri: aktif sekme yükselmiş bir klasör kulağı gibi. */
function NavFolder({ c, T, active, setActive }) {
  const recess = mix(c.surface, c.text, T.dark ? 0.12 : 0.06);
  return (
    <Wrap style={{ background: recess }}>
      <div className="grid grid-cols-5 items-end" style={{ height: 62, padding: '0 6px' }}>
        {NAV_ITEMS.map((n) => {
          const Icon = ICONS[n.id];
          const on = active === n.id;
          return (
            <div key={n.id} {...tap(setActive, n.id)} className="relative flex flex-col items-center justify-center" style={{ cursor: 'pointer', height: on ? 60 : 50, gap: 3, borderRadius: '16px 16px 0 0', background: on ? c.bg : 'transparent', color: on ? c.primary : c.muted, fontSize: 10.5, fontWeight: on ? 800 : 500, boxShadow: on ? `0 -6px 14px -10px ${c.shadowColor}` : 'none', transition: 'all .25s' }}>
              <span className="relative flex">
                <Icon size={20} strokeWidth={on ? 2.5 : 1.9} />
                {n.id === 'cart' && <Badge c={c} style={{ borderColor: on ? c.bg : recess }} />}
              </span>
              {n.label}
            </div>
          );
        })}
      </div>
      <div style={{ background: c.bg }}>
        <HomeIndicator color={c.text} />
      </div>
    </Wrap>
  );
}

const REGISTRY = {
  arch: NavArch,
  ios: NavIos,
  neutral: (p) => <NavIos {...p} neutral />,
  material: NavMaterial,
  floating: NavFloating,
  glass: NavGlass,
  editorial: NavEditorial,
  notch: NavNotch,
  expand: NavExpand,
  split: NavSplit,
  topline: NavTopline,
  brutal: NavBrutal,
  dock: NavDock,
  segmented: NavSegmented,
  fab: NavFab,
  iconDot: NavIconDot,
  gradient: NavGradient,
  bubble: NavBubble,
  outlineBox: NavOutlineBox,
  slider: NavSlider,
  folder: NavFolder,
};

export function BottomNav() {
  const T = useT();
  const app = useApp();
  const [local, setLocal] = useState('home');
  const active = app ? app.store.screen : local;
  const setActive = app ? app.store.navigate : setLocal;
  const Comp = REGISTRY[T.parts.nav] || NavArch;
  return <Comp c={T.c} t={T.t} T={T} active={active} setActive={setActive} />;
}
