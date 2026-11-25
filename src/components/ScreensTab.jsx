import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, RotateCcw, Check, Settings2, Home, UtensilsCrossed, ShoppingCart, ReceiptText, User, RefreshCcw } from 'lucide-react';
import { SCREENS, GLOBAL_OPTIONS, TONES, getScreen } from '../config/screens.js';
import { Section, chip, HomeOptions, NavOptions } from './HomeOptions.jsx';

const SCREEN_ICONS = { general: Settings2, home: Home, food: UtensilsCrossed, cart: ShoppingCart, orders: ReceiptText, account: User };

/** Seçenek kutuları (varsayılanı işaretli) */
function Choices({ options, value, onChange, cols = 2 }) {
  return (
    <div className={`grid gap-1.5 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={chip(value === o.id)} title={o.desc}>
          <div className="flex items-center gap-1 truncate text-[12px] font-medium text-zinc-200">
            {value === o.id && <Check size={12} className="shrink-0 text-orange-400" />}
            {o.name}
          </div>
          <div className="truncate text-[10.5px] text-zinc-500">{o.desc}</div>
        </button>
      ))}
    </div>
  );
}

/** Ton seçici: butonların hangi palet rengini kullanacağı */
function TonePicker({ value, onChange, colors }) {
  const hex = { primary: colors.primary, accent: colors.accent, secondary: colors.secondary, mono: colors.text };
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {TONES.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} className={`${chip(value === t.id)} flex flex-col items-center gap-1 px-1`}>
          <span className="h-6 w-6 rounded-full ring-1 ring-white/20" style={{ background: hex[t.id] }} />
          <span className="text-[10.5px] text-zinc-300">{t.name}</span>
        </button>
      ))}
    </div>
  );
}

/** Bölüm sırası: yukarı/aşağı taşı, göster/gizle */
function SectionOrder({ screen, state, set }) {
  const order = state.layout[screen.id];
  const hidden = state.hidden[screen.id] || [];
  const names = Object.fromEntries(screen.sections.map((x) => [x.id, x.name]));
  return (
    <div className="space-y-1">
      {order.map((id, i) => {
        const off = hidden.includes(id);
        return (
          <div key={id} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ring-1 ring-zinc-800 ${off ? 'bg-zinc-950 opacity-60' : 'bg-zinc-900'}`}>
            <span className="w-4 text-[10.5px] font-semibold text-zinc-500">{i + 1}</span>
            <span className={`min-w-0 flex-1 truncate text-[12.5px] ${off ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{names[id]}</span>
            <button onClick={() => set.moveSection(screen.id, id, -1)} disabled={i === 0} className="rounded p-1 text-zinc-400 enabled:hover:bg-zinc-800 enabled:hover:text-white disabled:opacity-25" aria-label="Yukarı taşı"><ArrowUp size={13} /></button>
            <button onClick={() => set.moveSection(screen.id, id, 1)} disabled={i === order.length - 1} className="rounded p-1 text-zinc-400 enabled:hover:bg-zinc-800 enabled:hover:text-white disabled:opacity-25" aria-label="Aşağı taşı"><ArrowDown size={13} /></button>
            <button onClick={() => set.toggleSection(screen.id, id)} className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label={off ? 'Göster' : 'Gizle'}>
              {off ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function ScreensTab({ state, set }) {
  const store = state.store;
  const [sel, setSel] = useState(store.screen);
  // Telefonda sekme değişince panel de o ekrana geçer
  useEffect(() => setSel(store.screen), [store.screen]);

  const pick = (id) => {
    setSel(id);
    if (id !== 'general') store.navigate(id);
  };
  const screen = sel === 'general' ? null : getScreen(sel);
  const opts = screen ? state.screenOpts[screen.id] : null;

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-1">
        {[{ id: 'general', label: 'Genel' }, ...SCREENS].map((x) => {
          const Icon = SCREEN_ICONS[x.id];
          const on = sel === x.id;
          return (
            <button key={x.id} onClick={() => pick(x.id)} className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11.5px] font-medium transition ${on ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 hover:text-zinc-200'}`}>
              <Icon size={13} /> {x.label}
            </button>
          );
        })}
      </div>

      {sel === 'general' && (
        <>
          <p className="mb-4 rounded-lg bg-zinc-900 p-3 text-[11.5px] leading-snug text-zinc-400 ring-1 ring-zinc-800">
            Bu ayarlar tüm ekranlarda geçerlidir. Telefondaki alt bara dokunarak ekranlar arasında gezinebilirsin; sepet, sipariş ve değerlendirmeler canlı çalışır.
          </p>
          {GLOBAL_OPTIONS.map((g) => (
            <Section key={g.key} title={g.title}>
              <Choices options={g.options} value={state.ui[g.key]} onChange={(v) => set.uiOpt(g.key, v)} />
            </Section>
          ))}
          <NavOptions state={state} set={set} />
          <button onClick={store.reset} className="mb-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 py-2 text-[12px] text-zinc-300 ring-1 ring-zinc-800 hover:text-white">
            <RefreshCcw size={13} /> Demo verisini sıfırla (sepet, siparişler)
          </button>
        </>
      )}

      {screen && (
        <>
          <div className="mb-4 flex items-center justify-between gap-2 rounded-lg bg-zinc-900 p-3 ring-1 ring-zinc-800">
            <p className="text-[11.5px] leading-snug text-zinc-400">
              <b className="font-medium text-zinc-200">{screen.title}</b> ekranının yerleşimini, şekillerini ve renklerini değiştir.
            </p>
            <button onClick={() => set.resetScreen(screen.id)} className="flex shrink-0 items-center gap-1 rounded-md bg-zinc-800 px-2 py-1.5 text-[11px] text-zinc-200 ring-1 ring-zinc-700 hover:bg-zinc-700">
              <RotateCcw size={12} /> Sıfırla
            </button>
          </div>

          <Section title="Bölüm sırası" hint={screen.id === 'home' ? 'Logo ve adres başlığı her zaman en üstte kalır.' : 'Okları kullanarak yer değiştir, göz ikonuyla gizle.'}>
            <SectionOrder screen={screen} state={state} set={set} />
          </Section>

          {screen.options.map((g) =>
            g.tone ? (
              <Section key={g.key} title={g.title}>
                <TonePicker value={opts[g.key]} onChange={(v) => set.screenOpt(screen.id, g.key, v)} colors={state.colors} />
              </Section>
            ) : (
              <Section key={g.key} title={g.title}>
                <Choices options={g.options} value={opts[g.key]} onChange={(v) => set.screenOpt(screen.id, g.key, v)} />
              </Section>
            ),
          )}

          {screen.id !== 'home' && (
            <Section title="Buton ve vurgu rengi" hint="Bu ekrandaki butonlar, seçili filtreler ve ikonlar bu rengi kullanır.">
              <TonePicker value={opts.tone} onChange={(v) => set.screenOpt(screen.id, 'tone', v)} colors={state.colors} />
            </Section>
          )}

          {screen.id === 'home' && <HomeOptions state={state} set={set} />}
        </>
      )}
    </>
  );
}
