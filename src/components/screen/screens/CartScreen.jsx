import { useRef, useState } from 'react';
import { ShoppingBasket, Tag, Plus, ChevronsRight, StickyNote, Trash2 } from 'lucide-react';
import { useT } from '../../../lib/theme.js';
import { useApp, cartTotals } from '../../../lib/store.js';
import { DISHES, getDish, getRestaurant, fmtTL } from '../../../config/content.js';
import { getScreen } from '../../../config/screens.js';
import { SmartImage, HScroll } from '../parts.jsx';
import { PageHeader, Btn, Stepper, Sub, toneColors, btnRadius } from '../ui.jsx';
import { rgba } from '../../../lib/color.js';

const MONO = "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace";

/** Fiş kenarı (tırtıklı) */
const Zigzag = ({ color, flip }) => (
  <svg width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" style={{ display: 'block', transform: flip ? 'scaleY(-1)' : 'none' }}>
    <path d={`M0 8 ${Array.from({ length: 20 }).map((_, i) => `L${i * 5 + 2.5} 0 L${i * 5 + 5} 8`).join(' ')} Z`} fill={color} />
  </svg>
);

function Items() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const v = opts.cart.items;
  const tone = opts.cart.tone;
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };

  if (v === 'receipt') {
    return (
      <div style={{ padding: '0 16px' }}>
        <Zigzag color={c.surface} />
        <div style={{ background: c.surface, padding: '12px 16px', fontFamily: MONO, fontSize: 12.5, color: c.text }}>
          <div style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '.1em', marginBottom: 8 }}>GURME · SEPET</div>
          {store.cart.map((it) => {
            const d = getDish(it.dishId);
            return (
              <div key={it.dishId} className="flex items-center" style={{ gap: 8, padding: '7px 0', borderTop: `1px dashed ${c.hairline}` }}>
                <span className="min-w-0 flex-1 truncate">{it.qty} × {d.name}</span>
                <span>{fmtTL(d.price * it.qty)}</span>
                <Stepper qty={it.qty} onChange={(q) => store.setQty(it.dishId, q)} tone={tone} compact />
              </div>
            );
          })}
        </div>
        <Zigzag color={c.surface} flip />
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: v === 'cards' ? 10 : 0, padding: '0 16px' }}>
      {store.cart.map((it, i) => {
        const d = getDish(it.dishId);
        const r = getRestaurant(d.restaurantId);
        const row = (
          <div className="flex items-center" style={{ gap: 12 }}>
            <SmartImage src={d.img} emoji={d.emoji} style={{ width: v === 'cards' ? 64 : 54, height: v === 'cards' ? 64 : 54, borderRadius: t.radius.image / 1.4, flexShrink: 0 }} />
            <div className="min-w-0 flex-1">
              <div className="truncate" style={{ ...head, fontSize: 14.5 }}>{d.name}</div>
              <div className="truncate" style={{ fontSize: 11.5, color: c.muted }}>{r?.name}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 3, color: c.text }}>{fmtTL(d.price * it.qty)}</div>
            </div>
            <Stepper qty={it.qty} onChange={(q) => store.setQty(it.dishId, q)} tone={tone} compact />
          </div>
        );
        return v === 'cards' ? (
          <div key={it.dishId} style={{ ...T.surf('card'), padding: 10 }}>{row}</div>
        ) : (
          <div key={it.dishId} style={{ padding: '12px 0', borderTop: i ? `1px solid ${c.hairline}` : 'none' }}>{row}</div>
        );
      })}
    </div>
  );
}

function Upsell() {
  const T = useT();
  const { store, opts } = useApp();
  const { c } = T;
  const tc = toneColors(c, opts.cart.tone);
  const list = DISHES.filter((d) => d.side && !store.cart.find((x) => x.dishId === d.id));
  if (!list.length) return null;
  return (
    <>
      <Sub>Yanına iyi gider</Sub>
      <HScroll gap={10}>
        {list.map((d) => (
          <div key={d.id} className="flex shrink-0 items-center" style={{ gap: 9, padding: 7, paddingRight: 9, ...T.surf('control') }}>
            <SmartImage src={d.img} emoji={d.emoji} style={{ width: 40, height: 40, borderRadius: 10 }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: c.text }}>{d.name}</div>
              <div style={{ fontSize: 11.5, color: c.muted }}>{fmtTL(d.price)}</div>
            </div>
            <button onClick={() => store.add(d.id)} className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 99, background: tc.bg, color: tc.fg }} aria-label="Ekle">
              <Plus size={15} strokeWidth={2.8} />
            </button>
          </div>
        ))}
      </HScroll>
    </>
  );
}

function Coupon({ totals }) {
  const T = useT();
  const { store, opts } = useApp();
  const { c } = T;
  const tc = toneColors(c, opts.cart.tone);
  const on = store.couponOn && totals.couponEligible;
  return (
    <div style={{ padding: '0 16px' }}>
      <button
        onClick={() => store.set('couponOn', !store.couponOn)}
        className="flex w-full items-center text-left"
        style={{ gap: 12, padding: '12px 14px', borderRadius: T.t.radius.card, border: `1.5px dashed ${on ? tc.bg : c.hairline}`, background: on ? tc.soft : 'transparent' }}
      >
        <Tag size={18} color={on ? tc.bg : c.muted} />
        <span className="min-w-0 flex-1">
          <span className="block" style={{ fontSize: 13.5, fontWeight: 700, color: c.text }}>GURME40</span>
          <span className="block" style={{ fontSize: 11.5, color: c.muted }}>
            {totals.couponEligible ? (on ? `Uygulandı · −${fmtTL(totals.discount)}` : 'İlk siparişe %40 · dokun ve uygula') : '150 TL ve üzeri sepetlerde geçerli'}
          </span>
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: on ? tc.bg : c.muted }}>{on ? 'Kaldır' : 'Uygula'}</span>
      </button>
    </div>
  );
}

function Note() {
  const T = useT();
  const { store } = useApp();
  const { c } = T;
  return (
    <div style={{ padding: '0 16px' }}>
      <label className="flex items-center" style={{ gap: 10, padding: '0 14px', height: 46, ...T.surf('control') }}>
        <StickyNote size={17} color={c.muted} />
        <input
          value={store.note}
          onChange={(e) => store.set('note', e.target.value)}
          placeholder="Kuryeye not (ör. zili çalmayın)"
          className="min-w-0 flex-1 bg-transparent outline-none"
          style={{ fontSize: 13.5, color: c.text }}
        />
      </label>
    </div>
  );
}

function Summary({ totals }) {
  const T = useT();
  const { opts } = useApp();
  const { c } = T;
  const v = opts.cart.summary;
  const rows = [
    ['Ara toplam', fmtTL(totals.sub)],
    ['Teslimat', totals.fee ? fmtTL(totals.fee) : 'Ücretsiz'],
    ...(totals.discount ? [['Kupon indirimi', `−${fmtTL(totals.discount)}`]] : []),
  ];
  const inner = (
    <div style={{ fontFamily: v === 'receipt' ? MONO : undefined }}>
      {rows.map(([k, val]) => (
        <div key={k} className="flex justify-between" style={{ fontSize: 13.5, color: c.muted, padding: '4px 0' }}>
          <span>{k}</span>
          <span style={{ color: k === 'Kupon indirimi' ? c.accent : c.text }}>{val}</span>
        </div>
      ))}
      <div className="flex justify-between" style={{ fontSize: 16, fontWeight: 800, color: c.text, paddingTop: 8, marginTop: 6, borderTop: `1px ${v === 'receipt' ? 'dashed' : 'solid'} ${c.hairline}` }}>
        <span>Toplam</span>
        <span>{fmtTL(totals.total)}</span>
      </div>
      {totals.fee > 0 && <div style={{ fontSize: 11.5, color: c.muted, marginTop: 6 }}>{fmtTL(300 - totals.sub)} daha ekle, teslimat ücretsiz olsun.</div>}
    </div>
  );
  if (v === 'plain') return <div style={{ padding: '0 20px' }}>{inner}</div>;
  if (v === 'receipt') {
    return (
      <div style={{ padding: '0 16px' }}>
        <Zigzag color={c.surface} />
        <div style={{ background: c.surface, padding: '10px 16px 14px' }}>{inner}</div>
        <Zigzag color={c.surface} flip />
      </div>
    );
  }
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ ...T.surf('card'), padding: '12px 16px' }}>{inner}</div>
    </div>
  );
}

/** Sürükleyerek onaylanan sipariş butonu */
function SlideToOrder({ label, tone, onDone }) {
  const T = useT();
  const { ui } = useApp();
  const tc = toneColors(T.c, tone);
  const track = useRef(null);
  const [x, setX] = useState(0);
  const [drag, setDrag] = useState(null);
  const K = 48;
  const max = () => (track.current ? track.current.clientWidth - K - 8 : 260);
  const r = btnRadius(T, ui);

  const finish = (val) => {
    if (val >= max() * 0.9) {
      setX(max());
      setTimeout(onDone, 180);
    } else setX(0);
    setDrag(null);
  };

  return (
    <div
      ref={track}
      className="relative select-none overflow-hidden"
      style={{ height: K + 8, borderRadius: r, background: tc.soft, touchAction: 'none' }}
      onPointerMove={(e) => drag && setX(Math.max(0, Math.min(max(), drag.x0 + e.clientX - drag.start)))}
      onPointerUp={() => drag && finish(x)}
      onPointerLeave={() => drag && finish(x)}
    >
      <div className="absolute inset-y-0 left-0" style={{ width: x + K + 8, background: tc.bg, opacity: 0.25, borderRadius: r }} />
      <div className="absolute inset-0 flex items-center justify-center" style={{ fontWeight: 700, fontSize: 14, color: T.c.text, opacity: 1 - x / (max() || 1) }}>
        {label}
      </div>
      <button
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setDrag({ start: e.clientX, x0: x });
        }}
        onDoubleClick={() => finish(max())}
        className="absolute flex items-center justify-center"
        style={{ top: 4, left: 4 + x, width: K, height: K, borderRadius: r, background: tc.bg, color: tc.fg, transition: drag ? 'none' : 'left .25s', cursor: 'grab' }}
        aria-label="Kaydırarak sipariş ver"
      >
        <ChevronsRight size={22} />
      </button>
    </div>
  );
}

function Checkout({ totals }) {
  const T = useT();
  const { store, opts } = useApp();
  const { c } = T;
  const v = opts.cart.checkout;
  const tone = opts.cart.tone;
  if (v === 'slide') {
    return (
      <div style={{ padding: '0 16px' }}>
        <SlideToOrder label={`Kaydır ve sipariş ver · ${fmtTL(totals.total)}`} tone={tone} onDone={store.checkout} />
        <div style={{ textAlign: 'center', fontSize: 11, color: c.muted, marginTop: 6 }}>Sürükle veya düğmeye çift dokun</div>
      </div>
    );
  }
  if (v === 'full') {
    return (
      <div style={{ padding: '0 16px' }}>
        <Btn full size="lg" tone={tone} onClick={store.checkout}>
          Siparişi ver · {fmtTL(totals.total)}
        </Btn>
      </div>
    );
  }
  return (
    <div className="flex items-center" style={{ padding: '12px 16px', gap: 12, margin: '0 16px', ...T.surf('card') }}>
      <div className="min-w-0 flex-1">
        <div style={{ fontSize: 11.5, color: c.muted }}>Ödenecek tutar</div>
        <div style={{ fontSize: 19, fontWeight: 800, color: c.text }}>{fmtTL(totals.total)}</div>
      </div>
      <Btn tone={tone} onClick={store.checkout} size="lg">Siparişi ver</Btn>
    </div>
  );
}

export default function CartScreen() {
  const T = useT();
  const { store, opts, layout, hidden } = useApp();
  const meta = getScreen('cart');
  const totals = cartTotals(store.cart, store.couponOn);
  const { c } = T;

  if (!store.cart.length) {
    return (
      <>
        <PageHeader title={meta.title} subtitle="Sepetin şu an boş" />
        <div className="flex flex-col items-center text-center" style={{ padding: '40px 32px', gap: 12 }}>
          <span className="flex items-center justify-center" style={{ width: 96, height: 96, borderRadius: 999, background: toneColors(c, opts.cart.tone).soft, color: toneColors(c, opts.cart.tone).bg }}>
            <ShoppingBasket size={44} />
          </span>
          <div style={{ fontFamily: T.t.fonts.head, fontWeight: T.t.headWeight, fontSize: 19, color: c.text }}>Canın bir şey çekmiyor mu?</div>
          <div style={{ fontSize: 13.5, color: c.muted }}>Yakınındaki restoranlardan dakikalar içinde sipariş ver.</div>
          <Btn tone={opts.cart.tone} onClick={() => store.navigate('food')}>Yemek keşfet</Btn>
        </div>
      </>
    );
  }

  const blocks = {
    items: (
      <>
        <Sub right={<button onClick={() => store.cart.forEach((x) => store.setQty(x.dishId, 0))} className="inline-flex items-center" style={{ gap: 4, fontSize: 12, color: c.muted }}><Trash2 size={13} /> Temizle</button>}>
          {store.cartCount} ürün
        </Sub>
        <Items />
      </>
    ),
    upsell: <Upsell />,
    coupon: <Coupon totals={totals} />,
    note: <Note />,
    summary: <Summary totals={totals} />,
    checkout: <Checkout totals={totals} />,
  };
  return (
    <>
      <PageHeader title={meta.title} subtitle={meta.subtitle} />
      <div className="flex flex-col" style={{ gap: 18 }}>
        {layout.cart.filter((id) => !hidden.cart.includes(id)).map((id) => (
          <div key={id}>{blocks[id]}</div>
        ))}
      </div>
      <div style={{ height: 8, background: rgba(c.bg, 0) }} />
    </>
  );
}
