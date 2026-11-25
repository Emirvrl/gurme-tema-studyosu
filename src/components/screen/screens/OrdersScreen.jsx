import { useState } from 'react';
import { ReceiptText, ChefHat, Bike, Home, Phone, Star, RotateCcw, ChevronRight, MapPin, Check } from 'lucide-react';
import { useT } from '../../../lib/theme.js';
import { useApp, useNow, orderProgress, stageOf, etaOf, orderTotal, STAGE_LIST } from '../../../lib/store.js';
import { getDish, getRestaurant, fmtTL, RATING_TAGS } from '../../../config/content.js';
import { getScreen } from '../../../config/screens.js';
import { SmartImage, HScroll } from '../parts.jsx';
import { PageHeader, Btn, Sub, toneColors } from '../ui.jsx';
import { rgba, mix } from '../../../lib/color.js';

const STEP_ICONS = [ReceiptText, ChefHat, Bike, Home];
const itemsText = (items) => items.map((it) => `${it.qty}× ${getDish(it.dishId)?.name}`).join(', ');

/* ------------------------- Canlı takip ------------------------- */

function Pulse({ color }) {
  return (
    <span className="relative inline-flex" style={{ width: 10, height: 10 }}>
      <span className="absolute inset-0 rounded-full" style={{ background: color, animation: 'gurme-ping 1.6s ease-out infinite' }} />
      <span className="relative rounded-full" style={{ width: 10, height: 10, background: color }} />
    </span>
  );
}

function CourierRow({ o, tone }) {
  const T = useT();
  const { store } = useApp();
  const { c } = T;
  const tc = toneColors(c, tone);
  const initials = o.courier.split(' ').map((x) => x[0]).join('');
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 99, background: tc.soft, color: tc.bg, fontWeight: 800, fontSize: 13 }}>{initials}</span>
      <div className="min-w-0 flex-1">
        <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{o.courier}</div>
        <div style={{ fontSize: 11.5, color: c.muted }}>Kuryen · ⭐ 4.9</div>
      </div>
      <button onClick={() => store.notify(`${o.courier} aranıyor (temsili)`)} className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 99, background: tc.bg, color: tc.fg }} aria-label="Kuryeyi ara">
        <Phone size={16} />
      </button>
    </div>
  );
}

function Stepper4({ p, tone }) {
  const T = useT();
  const { c } = T;
  const tc = toneColors(c, tone);
  const stage = STAGE_LIST.indexOf(stageOf(p));
  return (
    <div className="relative flex justify-between" style={{ padding: '4px 4px 0' }}>
      <div className="absolute" style={{ left: 22, right: 22, top: 21, height: 3, background: c.fill, borderRadius: 3 }} />
      <div className="absolute" style={{ left: 22, top: 21, height: 3, width: `calc((100% - 44px) * ${Math.min(1, p / 0.97)})`, background: tc.bg, borderRadius: 3, transition: 'width 1s linear' }} />
      {STAGE_LIST.map((s, i) => {
        const Icon = STEP_ICONS[i];
        const done = i <= stage;
        return (
          <div key={s.key} className="relative flex flex-col items-center" style={{ width: 62, gap: 6 }}>
            <span className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 99, background: done ? tc.bg : T.c.surface, color: done ? tc.fg : c.muted, boxShadow: i === stage ? `0 0 0 5px ${rgba(tc.bg, 0.2)}` : `inset 0 0 0 1.5px ${c.hairline}` }}>
              <Icon size={16} strokeWidth={2.3} />
            </span>
            <span style={{ fontSize: 10.5, textAlign: 'center', lineHeight: 1.15, color: done ? c.text : c.muted, fontWeight: i === stage ? 700 : 500 }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Stilize harita: kurye rotada ilerler */
function MapView({ p, tone }) {
  const T = useT();
  const { c } = T;
  const tc = toneColors(c, tone);
  const pts = [[30, 140], [110, 140], [110, 70], [220, 70], [220, 30], [330, 30]];
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const t = Math.max(0, Math.min(1, (p - 0.4) / 0.57));
  let d = t * total;
  let pos = pts[0];
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const k = d / segs[i];
      pos = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      break;
    }
    d -= segs[i];
    pos = pts[i + 1];
  }
  const land = mix(c.bg, c.text, T.dark ? 0.12 : 0.05);
  const block = mix(c.bg, c.text, T.dark ? 0.2 : 0.1);
  return (
    <svg viewBox="0 0 360 170" width="100%" style={{ display: 'block', background: land, borderRadius: T.t.radius.image }}>
      {[[10, 10, 80, 50], [130, 95, 70, 60], [240, 85, 100, 70], [130, 10, 70, 40], [20, 160, 60, 10], [250, 45, 90, 20]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill={block} />
      ))}
      <path d="M0 110 Q 120 120 180 160" stroke={mix(c.secondary, c.bg, 0.6)} strokeWidth="10" fill="none" opacity=".5" />
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={rgba(tc.bg, 0.35)} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={tc.bg} strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
      <circle cx={pts[0][0]} cy={pts[0][1]} r="9" fill={c.surface} stroke={c.text} strokeWidth="2" />
      <text x={pts[0][0]} y={pts[0][1] + 4} fontSize="10" textAnchor="middle">🍔</text>
      <circle cx={pts[5][0]} cy={pts[5][1]} r="10" fill={c.text} />
      <text x={pts[5][0]} y={pts[5][1] + 4} fontSize="10" textAnchor="middle">🏠</text>
      <circle cx={pos[0]} cy={pos[1]} r="16" fill={rgba(tc.bg, 0.25)} style={{ transition: 'all 1s linear' }} />
      <circle cx={pos[0]} cy={pos[1]} r="10" fill={tc.bg} stroke="#fff" strokeWidth="2.5" style={{ transition: 'all 1s linear' }} />
    </svg>
  );
}

function ActiveOrder({ o }) {
  const T = useT();
  const { store, opts } = useApp();
  const now = useNow(1000);
  const { c, t } = T;
  const v = opts.orders.tracker;
  const tone = opts.orders.tone;
  const tc = toneColors(c, tone);
  const sc = toneColors(c, opts.orders.status);
  const p = orderProgress(o, now);
  const stage = stageOf(p);
  const eta = etaOf(p);
  const r = getRestaurant(o.restaurantId);
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };

  if (v === 'compact') {
    return (
      <div style={{ padding: '0 16px' }}>
        <button onClick={() => store.notify('Sipariş detayı (temsili)')} className="flex w-full items-center text-left" style={{ gap: 12, padding: '14px 16px', borderRadius: t.radius.card, background: tc.bg, color: tc.fg }}>
          <Pulse color={tc.fg} />
          <span className="min-w-0 flex-1">
            <span className="block" style={{ fontWeight: 800, fontSize: 15 }}>{stage.label} · {eta} dk</span>
            <span className="block truncate" style={{ fontSize: 12, opacity: 0.85 }}>{r?.name} · {o.id}</span>
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  const top = (
    <div className="flex items-start justify-between" style={{ gap: 10 }}>
      <div className="min-w-0">
        <span className="inline-flex items-center" style={{ gap: 6, fontSize: 11.5, fontWeight: 700, color: sc.bg, background: sc.soft, padding: '4px 9px', borderRadius: 99 }}>
          <Pulse color={sc.bg} /> {stage.label}
        </span>
        <div className="truncate" style={{ ...head, fontSize: 17, marginTop: 8 }}>{r?.name}</div>
        <div className="truncate" style={{ fontSize: 12, color: c.muted }}>{o.id} · {o.placed}</div>
      </div>
      <div className="shrink-0 text-right">
        <div style={{ fontSize: 11, color: c.muted }}>Tahmini varış</div>
        <div style={{ ...head, fontSize: 22 }}>{eta} dk</div>
      </div>
    </div>
  );

  if (v === 'progress') {
    return (
      <div style={{ padding: '0 16px' }}>
        <div style={{ ...T.surf('card'), padding: 18 }}>
          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span style={{ ...head, fontSize: 56, lineHeight: 1, letterSpacing: '-0.04em', color: tc.bg }}>{eta}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: c.text }}>dakika</span>
          </div>
          <div style={{ fontSize: 13.5, color: c.muted, marginTop: 4 }}>{stage.label} · {r?.name}</div>
          <div className="relative overflow-hidden" style={{ height: 10, borderRadius: 99, background: c.fill, marginTop: 16 }}>
            <div style={{ height: '100%', width: `${p * 100}%`, borderRadius: 99, background: `linear-gradient(90deg, ${tc.bg}, ${mix(tc.bg, c.accent, 0.5)})`, transition: 'width 1s linear' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)', animation: 'gurme-shimmer 1.8s linear infinite' }} />
          </div>
          <div className="truncate" style={{ fontSize: 12, color: c.muted, marginTop: 12 }}>{itemsText(o.items)}</div>
          <div style={{ marginTop: 14 }}><CourierRow o={o} tone={tone} /></div>
        </div>
      </div>
    );
  }

  if (v === 'map') {
    return (
      <div style={{ padding: '0 16px' }}>
        <div className="relative">
          <MapView p={p} tone={tone} />
          <span className="absolute inline-flex items-center" style={{ left: 10, top: 10, gap: 5, background: c.surface, color: c.text, fontSize: 11.5, fontWeight: 700, padding: '5px 9px', borderRadius: 99, boxShadow: '0 4px 10px rgba(0,0,0,.15)' }}>
            <MapPin size={12} color={tc.bg} /> Zümrüt Cad.
          </span>
        </div>
        <div style={{ ...T.surf('card'), padding: 14, marginTop: -18, position: 'relative', marginLeft: 8, marginRight: 8 }}>
          {top}
          <div style={{ height: 1, background: c.hairline, margin: '12px 0' }} />
          <CourierRow o={o} tone={tone} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ ...T.surf('card'), padding: 16 }}>
        {top}
        <div style={{ margin: '16px 0 14px' }}><Stepper4 p={p} tone={tone} /></div>
        <div style={{ height: 1, background: c.hairline, marginBottom: 12 }} />
        <CourierRow o={o} tone={tone} />
      </div>
    </div>
  );
}

/* ------------------------- Geçmiş siparişler ------------------------- */

function StarsInput({ value, onChange, size = 26, color }) {
  return (
    <span className="inline-flex" style={{ gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} onClick={() => onChange?.(i)} aria-label={`${i} yıldız`} style={{ cursor: onChange ? 'pointer' : 'default' }}>
          <Star size={size} fill={i <= value ? color : 'transparent'} color={color} strokeWidth={1.8} />
        </button>
      ))}
    </span>
  );
}

function RatingPanel({ o, onClose }) {
  const T = useT();
  const { store, opts } = useApp();
  const { c } = T;
  const tc = toneColors(c, opts.orders.tone);
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState([]);
  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: c.fill, animation: 'gurme-toast .25s ease' }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: c.text, marginBottom: 6 }}>Siparişin nasıldı?</div>
      <StarsInput value={stars} onChange={setStars} color={c.accent} />
      <div className="flex flex-wrap" style={{ gap: 6, marginTop: 10 }}>
        {RATING_TAGS.map((tg) => {
          const on = tags.includes(tg);
          return (
            <button key={tg} onClick={() => setTags(on ? tags.filter((x) => x !== tg) : [...tags, tg])} style={{ fontSize: 11.5, fontWeight: 600, padding: '5px 10px', borderRadius: 99, background: on ? tc.bg : c.surface, color: on ? tc.fg : c.text, boxShadow: on ? 'none' : `inset 0 0 0 1px ${c.hairline}` }}>
              {tg}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end" style={{ gap: 8, marginTop: 12 }}>
        <Btn size="sm" variant="alt" tone="mono" onClick={onClose}>Vazgeç</Btn>
        <Btn size="sm" tone={opts.orders.tone} disabled={!stars} onClick={() => { store.rate(o.id, stars, tags); onClose(); }}>Gönder</Btn>
      </div>
    </div>
  );
}

function StatusChip({ o }) {
  const T = useT();
  const { opts } = useApp();
  const { c } = T;
  const sc = toneColors(c, opts.orders.status);
  const cancelled = o.status === 'cancelled';
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap', background: cancelled ? rgba('#E5484D', 0.12) : sc.soft, color: cancelled ? '#E5484D' : mix(sc.bg, c.text, T.dark ? 0 : 0.2) }}>
      {cancelled ? 'İptal edildi' : 'Teslim edildi'}
    </span>
  );
}

function OrderActions({ o, onRate, iconOnly, vertical }) {
  const T = useT();
  const { store, opts } = useApp();
  const { c } = T;
  const tone = opts.orders.tone;
  const layoutMode = opts.orders.buttons;
  const canRate = o.status === 'delivered' && !o.rating;
  const [added, setAdded] = useState(false);
  const reorder = () => {
    store.reorder(o.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  const rated = o.rating && (
    <span className="inline-flex items-center" style={{ gap: 4, fontSize: 11.5, color: c.muted }}>
      <StarsInput value={o.rating.stars} size={13} color={c.accent} /> Değerlendirdin
    </span>
  );

  if (iconOnly) {
    return (
      <span className="flex shrink-0" style={{ gap: 6 }}>
        {canRate && (
          <button onClick={onRate} className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 99, background: c.fill, color: c.text }} aria-label="Değerlendir"><Star size={16} /></button>
        )}
        <button onClick={reorder} className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 99, background: toneColors(c, tone).bg, color: toneColors(c, tone).fg }} aria-label="Tekrarla">
          {added ? <Check size={16} /> : <RotateCcw size={16} />}
        </button>
      </span>
    );
  }

  const rateBtn = canRate ? (
    <Btn size="sm" variant={layoutMode === 'menu' ? 'alt' : 'alt'} tone={layoutMode === 'menu' ? 'mono' : tone} icon={Star} onClick={onRate} style={layoutMode === 'menu' ? { padding: '0 4px', border: 'none', background: 'transparent' } : undefined}>
      Değerlendir
    </Btn>
  ) : (
    rated
  );
  const reBtn = (
    <Btn size="sm" tone={tone} icon={added ? Check : RotateCcw} onClick={reorder} full={layoutMode === 'menu' && !vertical}>
      {added ? 'Sepette' : 'Tekrarla'}
    </Btn>
  );

  if (vertical || layoutMode === 'side') {
    return (
      <div className="flex shrink-0 flex-col items-stretch" style={{ gap: 6 }}>
        {reBtn}
        {canRate && rateBtn}
      </div>
    );
  }
  if (layoutMode === 'menu') {
    return (
      <div className="flex flex-col" style={{ gap: 6, marginTop: 12 }}>
        {reBtn}
        <div className="flex justify-center">{rateBtn}</div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end" style={{ gap: 8, marginTop: 12 }}>
      <div className="mr-auto">{!canRate && rated}</div>
      {canRate && rateBtn}
      {reBtn}
    </div>
  );
}

function HistoryItem({ o, last }) {
  const T = useT();
  const { opts } = useApp();
  const { c, t } = T;
  const v = opts.orders.card;
  const [rating, setRating] = useState(false);
  const r = getRestaurant(o.restaurantId);
  const total = orderTotal(o.items);
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };
  const side = opts.orders.buttons === 'side';
  const ratingPanel = rating && <RatingPanel o={o} onClose={() => setRating(false)} />;

  const info = (
    <div className="min-w-0 flex-1">
      <div className="flex items-center" style={{ gap: 8 }}>
        <span className="truncate" style={{ ...head, fontSize: 15 }}>{r?.name}</span>
        <StatusChip o={o} />
      </div>
      <div className="truncate" style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{o.placed} · {fmtTL(total)}</div>
      <div className="truncate" style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{itemsText(o.items)}</div>
    </div>
  );

  if (v === 'compact') {
    return (
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${c.hairline}` }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <SmartImage src={r?.img} emoji={r?.emoji} style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0 }} />
          {info}
          <OrderActions o={o} onRate={() => setRating(true)} iconOnly />
        </div>
        {ratingPanel}
      </div>
    );
  }

  if (v === 'timeline') {
    return (
      <div className="relative flex" style={{ gap: 14, padding: '0 16px 0 22px' }}>
        <div className="relative flex flex-col items-center" style={{ width: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 99, marginTop: 4, background: o.status === 'cancelled' ? '#E5484D' : toneColors(c, opts.orders.status).bg, boxShadow: `0 0 0 4px ${c.bg}` }} />
          {!last && <span className="flex-1" style={{ width: 2, background: c.hairline, marginTop: 4 }} />}
        </div>
        <div className="min-w-0 flex-1" style={{ paddingBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.muted, letterSpacing: '.06em', textTransform: 'uppercase' }}>{o.placed}</div>
          <div className="flex" style={{ gap: 10, marginTop: 6 }}>
            {info}
            {side && <OrderActions o={o} onRate={() => setRating(true)} vertical />}
          </div>
          {!side && <OrderActions o={o} onRate={() => setRating(true)} />}
          {ratingPanel}
        </div>
      </div>
    );
  }

  if (v === 'receipt') {
    return (
      <div style={{ padding: '0 16px' }}>
        <div className="relative" style={{ background: c.surface, borderRadius: 14, padding: '14px 16px', boxShadow: `0 1px 0 ${c.hairline}` }}>
          <span className="absolute" style={{ left: -8, top: 62, width: 16, height: 16, borderRadius: 99, background: c.bg }} />
          <span className="absolute" style={{ right: -8, top: 62, width: 16, height: 16, borderRadius: 99, background: c.bg }} />
          <div className="flex items-center justify-between" style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, color: c.muted }}>
            <span>{o.id}</span>
            <span>{o.placed}</span>
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: 6, gap: 8 }}>
            <span className="truncate" style={{ ...head, fontSize: 16 }}>{r?.name}</span>
            <StatusChip o={o} />
          </div>
          <div style={{ borderTop: `1.5px dashed ${c.hairline}`, margin: '14px 0 10px' }} />
          {o.items.map((it) => (
            <div key={it.dishId} className="flex justify-between" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, color: c.text, padding: '2px 0' }}>
              <span className="truncate">{it.qty}× {getDish(it.dishId)?.name}</span>
              <span>{fmtTL(getDish(it.dishId).price * it.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, fontWeight: 800, color: c.text, marginTop: 6 }}>
            <span>TOPLAM</span>
            <span>{fmtTL(total)}</span>
          </div>
          <OrderActions o={o} onRate={() => setRating(true)} />
          {ratingPanel}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ ...T.surf('card'), padding: 12 }}>
        <div className="flex" style={{ gap: 12 }}>
          <SmartImage src={r?.img} emoji={r?.emoji} style={{ width: 58, height: 58, borderRadius: t.radius.image / 1.4, flexShrink: 0 }} />
          {info}
          {side && <OrderActions o={o} onRate={() => setRating(true)} vertical />}
        </div>
        {!side && <OrderActions o={o} onRate={() => setRating(true)} />}
        {ratingPanel}
      </div>
    </div>
  );
}

const FILTERS = [
  { id: 'all', name: 'Tümü' },
  { id: 'delivered', name: 'Teslim edilen' },
  { id: 'unrated', name: 'Değerlendirilmemiş' },
  { id: 'cancelled', name: 'İptal' },
];

function Filters() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const tc = toneColors(c, opts.orders.tone);
  return (
    <HScroll gap={8}>
      {FILTERS.map((f) => {
        const on = store.filter === f.id;
        return (
          <button key={f.id} onClick={() => store.set('filter', f.id)} className="shrink-0" style={{ height: 34, padding: '0 14px', borderRadius: t.radius.chip, fontSize: 12.5, fontWeight: 600, background: on ? tc.bg : 'transparent', color: on ? tc.fg : c.text, boxShadow: on ? 'none' : `inset 0 0 0 1px ${c.hairline}` }}>
            {f.name}
          </button>
        );
      })}
    </HScroll>
  );
}

function Stats({ orders }) {
  const T = useT();
  const { opts } = useApp();
  const { c, t } = T;
  const tc = toneColors(c, opts.orders.tone);
  const spent = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + orderTotal(o.items), 0);
  const items = [
    { k: 'Bu ay', v: `${orders.length} sipariş` },
    { k: 'Harcama', v: fmtTL(spent) },
    { k: 'Tasarruf', v: fmtTL(Math.round(spent * 0.12)) },
  ];
  return (
    <div className="grid grid-cols-3" style={{ gap: 8, padding: '0 16px' }}>
      {items.map((x, i) => (
        <div key={x.k} style={{ ...T.surf('control'), padding: '10px 12px', background: i === 2 ? tc.soft : undefined }}>
          <div style={{ fontSize: 11, color: c.muted }}>{x.k}</div>
          <div className="truncate" style={{ fontFamily: t.fonts.head, fontWeight: t.headWeight, fontSize: 15, color: c.text, marginTop: 2 }}>{x.v}</div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersScreen() {
  const T = useT();
  const { store, opts, layout, hidden } = useApp();
  const meta = getScreen('orders');
  const active = store.orders.filter((o) => o.status === 'active');
  const past = store.orders
    .filter((o) => o.status !== 'active')
    .filter((o) => (store.filter === 'all' ? true : store.filter === 'unrated' ? o.status === 'delivered' && !o.rating : o.status === store.filter));
  const v = opts.orders.card;

  const blocks = {
    active: active.length ? (
      <div className="flex flex-col" style={{ gap: 12 }}>
        <Sub>Şu an yolda</Sub>
        {active.map((o) => <ActiveOrder key={o.id} o={o} />)}
      </div>
    ) : null,
    stats: <Stats orders={store.orders} />,
    filters: <Filters />,
    history: (
      <div>
        <Sub>Geçmiş siparişler</Sub>
        {past.length === 0 && <div style={{ padding: '10px 18px', fontSize: 13, color: T.c.muted }}>Bu filtrede sipariş yok.</div>}
        <div className="flex flex-col" style={{ gap: v === 'compact' || v === 'timeline' ? 0 : 12 }}>
          {past.map((o, i) => <HistoryItem key={o.id} o={o} last={i === past.length - 1} />)}
        </div>
      </div>
    ),
  };
  return (
    <>
      <PageHeader title={meta.title} subtitle={meta.subtitle} />
      <div className="flex flex-col" style={{ gap: 20 }}>
        {layout.orders.filter((id) => !hidden.orders.includes(id) && blocks[id]).map((id) => (
          <div key={id}>{blocks[id]}</div>
        ))}
      </div>
    </>
  );
}
