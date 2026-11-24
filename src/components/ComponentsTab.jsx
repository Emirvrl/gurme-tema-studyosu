import { RotateCcw, Check, Layers, ArrowLeftRight, Box, Sparkle, Wind } from 'lucide-react';
import { ThemeCtx } from '../lib/theme.js';
import { getTemplate, resolveParts } from '../config/templates.js';
import { BANNER_ANIMATIONS, CUISINE_IMAGE_MODES, COMPONENT_GROUPS, NAV_VARIANTS } from '../config/components.js';
import { CUISINES } from '../config/content.js';
import { BottomNav } from './screen/navs.jsx';

const ANIM_ICONS = { stack: Layers, slide: ArrowLeftRight, coverflow: Box, fade: Sparkle, swipe: Wind };

const Section = ({ title, hint, children }) => (
  <div className="mb-6">
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{title}</h3>
    {hint && <p className="mt-1 text-[11px] leading-snug text-zinc-500">{hint}</p>}
    <div className="mt-2.5">{children}</div>
  </div>
);

const chip = (active) =>
  `rounded-lg px-2.5 py-2 text-left transition ${active ? 'bg-zinc-800 ring-2 ring-orange-500' : 'bg-zinc-900 ring-1 ring-zinc-800 hover:ring-zinc-600'}`;

/** "Şablondan" seçeneği + varyant listesi. */
function OptionGrid({ options, value, baseId, onChange }) {
  const baseName = options.find((o) => o.id === baseId)?.name || '—';
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <button onClick={() => onChange(null)} className={`${chip(value === null)} col-span-2`}>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-200">
          {value === null && <Check size={13} className="text-orange-400" />} Şablondan
          <span className="font-normal text-zinc-500">· {baseName}</span>
        </div>
      </button>
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={chip(value === o.id)} title={o.desc}>
          <div className="truncate text-[12px] font-medium text-zinc-200">{o.name}</div>
          <div className="truncate text-[10.5px] text-zinc-500">{o.desc}</div>
        </button>
      ))}
    </div>
  );
}

function NavPreview({ theme, id }) {
  const W = 296;
  const s = W / 390;
  return (
    <div className="overflow-hidden rounded-t-xl" style={{ width: W, height: 140 * s }}>
      <div className="relative" style={{ width: 390, height: 140, transform: `scale(${s})`, transformOrigin: 'top left', background: theme.screenBg }}>
        <ThemeCtx.Provider value={{ ...theme, parts: { ...theme.parts, nav: id } }}>
          <BottomNav />
        </ThemeCtx.Provider>
      </div>
    </div>
  );
}

export default function ComponentsTab({ state, set }) {
  const o = state.overrides;
  const base = resolveParts(getTemplate(state.templateId), state.platform);
  const custom = Object.values(o).filter(Boolean).length;
  const burger = CUISINES[0];

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-2 rounded-xl bg-zinc-900 p-3 ring-1 ring-zinc-800">
        <p className="text-[11.5px] leading-snug text-zinc-400">
          Her parçayı bağımsız seç, şablonla karıştır. <b className="font-medium text-zinc-200">{custom}</b> parça özelleştirildi.
        </p>
        <button onClick={set.resetOverrides} disabled={!custom} className="flex shrink-0 items-center gap-1 rounded-md bg-zinc-800 px-2 py-1.5 text-[11px] text-zinc-200 ring-1 ring-zinc-700 enabled:hover:bg-zinc-700 disabled:opacity-40">
          <RotateCcw size={12} /> Sıfırla
        </button>
      </div>

      <Section title="Kampanya geçiş animasyonu" hint="3 kampanya: biri önde büyük, diğerleri arkasında. Her 5 sn'de öndeki sola kayar, sağdaki öne gelir. Seçince hemen önizlenir.">
        <div className="space-y-1.5">
          <button onClick={() => set.override('anim', null)} className={`${chip(o.anim === null)} w-full`}>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-200">
              {o.anim === null && <Check size={13} className="text-orange-400" />} Şablondan
              <span className="font-normal text-zinc-500">· {BANNER_ANIMATIONS.find((a) => a.id === base.anim)?.name}</span>
            </div>
          </button>
          {BANNER_ANIMATIONS.map((a) => {
            const Icon = ANIM_ICONS[a.id];
            const on = o.anim === a.id;
            return (
              <button key={a.id} onClick={() => set.override('anim', a.id)} className={`${chip(on)} flex w-full items-center gap-3`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${on ? 'bg-orange-500/20 text-orange-300' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-medium text-zinc-200">{a.name}</span>
                  <span className="block text-[10.5px] leading-snug text-zinc-500">{a.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Mutfak görsel tipi" hint="Yalnızca üstteki görsel değişir; yazı her zaman görselin dışında, altında kalır.">
        <div className="grid grid-cols-4 gap-1.5">
          {CUISINE_IMAGE_MODES.map((m) => {
            const on = state.cuisineImage === m.id;
            return (
              <button key={m.id} onClick={() => set.cuisineImage(m.id)} className={`${chip(on)} flex flex-col items-center px-1`} title={m.desc}>
                <span className="flex h-11 w-11 items-center justify-center">
                  {m.id === 'photo' ? <img src={burger.img} alt="" className="h-10 w-10 rounded-full object-cover" /> : <img src={burger[m.id]} alt="" className="h-10 w-10 object-contain" />}
                </span>
                <span className="mt-1 text-[10.5px] font-medium text-zinc-300">{m.name}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Alt bar tasarımı" hint="Sekmelere tıklayınca aktif sekme değişir; önizlemeler mevcut renklerle çizilir.">
        <div className="space-y-2">
          <button onClick={() => set.override('nav', null)} className={`${chip(o.nav === null)} w-full`}>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-200">
              {o.nav === null && <Check size={13} className="text-orange-400" />} Şablondan
              <span className="font-normal text-zinc-500">· {NAV_VARIANTS.find((n) => n.id === base.nav)?.name}</span>
            </div>
          </button>
          {NAV_VARIANTS.map((n) => {
            const on = o.nav === n.id;
            return (
              <div key={n.id} role="button" tabIndex={0} onClick={() => set.override('nav', n.id)} onKeyDown={(e) => e.key === 'Enter' && set.override('nav', n.id)} className={`block w-full cursor-pointer overflow-hidden rounded-xl transition ${on ? 'ring-2 ring-orange-500' : 'ring-1 ring-zinc-800 hover:ring-zinc-600'}`}>
                <NavPreview theme={state.theme} id={n.id} />
                <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5">
                  <span className="shrink-0 whitespace-nowrap text-[12px] font-medium text-zinc-200">{n.name}</span>
                  <span className="truncate pl-2 text-[10.5px] text-zinc-500">{n.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {COMPONENT_GROUPS.map((g) => (
        <Section key={g.key} title={g.title}>
          <OptionGrid options={g.options} value={o[g.key]} baseId={base[g.key]} onChange={(v) => set.override(g.key, v)} />
        </Section>
      ))}
    </>
  );
}
