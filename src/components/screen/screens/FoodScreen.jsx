import { Plus, Star, Clock } from 'lucide-react';
import { useT } from '../../../lib/theme.js';
import { useApp } from '../../../lib/store.js';
import { CUISINES, DISHES, RESTAURANTS, fmtTL } from '../../../config/content.js';
import { SmartImage, SearchBar, HScroll } from '../parts.jsx';
import { PageHeader, Btn, Stepper, Sub, toneColors, btnRadius } from '../ui.jsx';
import { getScreen } from '../../../config/screens.js';

function AddControl({ dish, overlay }) {
  const T = useT();
  const { store, opts, ui } = useApp();
  const o = opts.food;
  const qty = store.cart.find((x) => x.dishId === dish.id)?.qty || 0;
  const tc = toneColors(T.c, o.tone);
  const set = (q) => store.setQty(dish.id, q);

  if (qty > 0) {
    return (
      <span onClick={(e) => e.stopPropagation()}>
        <Stepper qty={qty} onChange={set} tone={o.tone} compact />
      </span>
    );
  }
  if (o.add === 'stepper') return <Stepper qty={0} onChange={(q) => q > 0 && store.add(dish.id)} tone={o.tone} compact />;
  if (o.add === 'text') {
    return <Btn size="sm" tone={o.tone} onClick={() => store.add(dish.id)} icon={Plus}>Sepete ekle</Btn>;
  }
  return (
    <button
      onClick={() => store.add(dish.id)}
      className="flex items-center justify-center"
      style={{ width: 34, height: 34, borderRadius: btnRadius(T, ui) === 4 ? 6 : 999, background: overlay ? T.c.surface : tc.bg, color: overlay ? T.c.text : tc.fg, boxShadow: '0 4px 12px rgba(0,0,0,.18)' }}
      aria-label="Sepete ekle"
    >
      <Plus size={18} strokeWidth={2.8} />
    </button>
  );
}

function Chips() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const v = opts.food.chips;
  const tc = toneColors(c, opts.food.tone);
  const all = [{ id: 'all', name: 'Tümü', emoji: '🍽️' }, ...CUISINES];
  const sel = store.cuisine;

  if (v === 'underline') {
    return (
      <HScroll gap={20} style={{ borderBottom: `1px solid ${c.hairline}` }}>
        {all.map((x) => (
          <button key={x.id} onClick={() => store.set('cuisine', x.id)} className="shrink-0" style={{ padding: '6px 0 10px', fontSize: 14, fontWeight: sel === x.id ? 700 : 500, color: sel === x.id ? c.text : c.muted, borderBottom: `2.5px solid ${sel === x.id ? tc.bg : 'transparent'}`, marginBottom: -1 }}>
            {x.name}
          </button>
        ))}
      </HScroll>
    );
  }
  return (
    <HScroll gap={8}>
      {all.map((x) => {
        const on = sel === x.id;
        return (
          <button
            key={x.id}
            onClick={() => store.set('cuisine', x.id)}
            className="flex shrink-0 items-center"
            style={{ gap: 6, height: 38, padding: v === 'icon' ? '0 14px 0 6px' : '0 15px', borderRadius: t.radius.chip, background: on ? tc.bg : c.surface, color: on ? tc.fg : c.text, fontSize: 13, fontWeight: 600, boxShadow: on ? 'none' : `inset 0 0 0 1px ${c.hairline}` }}
          >
            {v === 'icon' && (x.png3d ? <img src={x.png3d} alt="" style={{ width: 26, height: 26 }} /> : <span style={{ fontSize: 18 }}>{x.emoji}</span>)}
            {x.name}
          </button>
        );
      })}
    </HScroll>
  );
}

function Dishes() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const v = opts.food.dish;
  const list = DISHES.filter((d) => store.cuisine === 'all' || d.cuisine === store.cuisine);
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };

  if (!list.length) {
    return <div style={{ padding: '24px 18px', textAlign: 'center', color: c.muted, fontSize: 13.5 }}>Bu kategoride şimdilik ürün yok. Başka bir kategori dene.</div>;
  }

  if (v === 'list') {
    return (
      <div style={{ padding: '0 16px' }}>
        {list.map((d, i) => (
          <div key={d.id} className="flex items-center" style={{ gap: 12, padding: '14px 0 20px', borderTop: i ? `1px solid ${c.hairline}` : 'none' }}>
            <div className="min-w-0 flex-1">
              <div className="truncate" style={{ ...head, fontSize: 15.5 }}>{d.name}</div>
              <div style={{ fontSize: 12.5, color: c.muted, marginTop: 3, lineHeight: 1.35 }}>{d.desc}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6, color: c.text }}>{fmtTL(d.price)}</div>
            </div>
            <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
              <SmartImage src={d.img} emoji={d.emoji} className="h-full w-full" style={{ borderRadius: t.radius.image }} />
              <span className="absolute flex justify-center" style={{ left: -20, right: -20, bottom: -12 }}><AddControl dish={d} overlay /></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (v === 'big') {
    return (
      <div className="flex flex-col" style={{ gap: 16, padding: '0 16px' }}>
        {list.map((d) => (
          <div key={d.id} className="overflow-hidden" style={T.surf('card')}>
            <div className="relative" style={{ height: 170 }}>
              <SmartImage src={d.img} emoji={d.emoji} className="h-full w-full" />
              <span className="absolute" style={{ left: 12, top: 12, background: c.bg, color: c.text, fontWeight: 800, fontSize: 13, padding: '5px 10px', borderRadius: 99 }}>{fmtTL(d.price)}</span>
            </div>
            <div className="flex items-center justify-between" style={{ padding: '12px 14px', gap: 10 }}>
              <div className="min-w-0">
                <div className="truncate" style={{ ...head, fontSize: 16.5 }}>{d.name}</div>
                <div className="truncate" style={{ fontSize: 12.5, color: c.muted }}>{d.desc}</div>
              </div>
              <AddControl dish={d} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2" style={{ gap: 12, padding: '0 16px' }}>
      {list.map((d) => (
        <div key={d.id} className="flex flex-col overflow-hidden" style={T.surf('card')}>
          <div className="relative" style={{ height: 110 }}>
            <SmartImage src={d.img} emoji={d.emoji} className="h-full w-full" />
            {opts.food.add === 'round' && <span className="absolute" style={{ right: 8, bottom: 8 }}><AddControl dish={d} overlay /></span>}
          </div>
          <div className="flex flex-1 flex-col" style={{ padding: '10px 11px 12px' }}>
            <div style={{ ...head, fontSize: 13.5, lineHeight: 1.2 }}>{d.name}</div>
            <div className="mt-auto flex items-center justify-between" style={{ paddingTop: 8, gap: 6 }}>
              <b style={{ fontSize: 13.5, color: c.text }}>{fmtTL(d.price)}</b>
              {opts.food.add !== 'round' && <AddControl dish={d} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NearRestaurants() {
  const T = useT();
  const { store } = useApp();
  const { c, t } = T;
  return (
    <HScroll gap={12}>
      {RESTAURANTS.map((r) => (
        <button key={r.id} onClick={() => store.notify(`${r.name} menüsü (temsili)`)} className="shrink-0 overflow-hidden text-left" style={{ width: 200, ...T.surf('card') }}>
          <SmartImage src={r.img} emoji={r.emoji} className="w-full" style={{ height: 92 }} />
          <div style={{ padding: '9px 11px 11px' }}>
            <div className="truncate" style={{ fontFamily: t.fonts.head, fontWeight: t.headWeight, fontSize: 13.5, color: c.text }}>{r.name}</div>
            <div className="flex items-center" style={{ gap: 8, fontSize: 11.5, color: c.muted, marginTop: 3 }}>
              <span className="inline-flex items-center" style={{ gap: 3 }}><Star size={11} fill={c.accent} color={c.accent} /> {r.rating}</span>
              <span className="inline-flex items-center" style={{ gap: 3 }}><Clock size={11} /> {r.eta}</span>
            </div>
          </div>
        </button>
      ))}
    </HScroll>
  );
}

export default function FoodScreen() {
  const { layout, hidden } = useApp();
  const meta = getScreen('food');
  const blocks = {
    search: <SearchBar />,
    chips: <Chips />,
    dishes: (
      <>
        <Sub>Popüler yemekler</Sub>
        <Dishes />
      </>
    ),
    restaurants: (
      <>
        <Sub>Yakındaki restoranlar</Sub>
        <NearRestaurants />
      </>
    ),
  };
  return (
    <>
      <PageHeader title={meta.title} subtitle={meta.subtitle} />
      <div className="flex flex-col" style={{ gap: 20 }}>
        {layout.food.filter((id) => !hidden.food.includes(id)).map((id) => (
          <div key={id}>{blocks[id]}</div>
        ))}
      </div>
    </>
  );
}
