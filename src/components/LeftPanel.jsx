import { useEffect, useState } from 'react';
import { LayoutTemplate, Palette, Type, RotateCcw, Shuffle, Check, Smartphone, Blocks } from 'lucide-react';
import ScreensTab from './ScreensTab.jsx';
import MyTemplates from './MyTemplates.jsx';
import { TEMPLATES, PLATFORMS } from '../config/templates.js';
import { PALETTES, COLOR_KEYS } from '../config/palettes.js';
import { LOGO_STYLES, LOGO_CASES, LOGO_ICONS } from '../config/logoStyles.js';
import { normalizeHex } from '../lib/color.js';
import Wordmark, { BrandIcon } from './screen/Wordmark.jsx';

const TABS = [
  { id: 'templates', label: 'Şablonlar', Icon: LayoutTemplate },
  { id: 'colors', label: 'Renkler', Icon: Palette },
  { id: 'components', label: 'Ekranlar', Icon: Blocks },
  { id: 'logo', label: 'Logo', Icon: Type },
];

const Section = ({ title, children, right }) => (
  <div className="mb-6">
    <div className="mb-2.5 flex items-center justify-between">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{title}</h3>
      {right}
    </div>
    {children}
  </div>
);

function Segmented({ options, value, onChange, size = 'md' }) {
  return (
    <div className="flex rounded-lg bg-zinc-900 p-0.5 ring-1 ring-zinc-800">
      {options.map((o) => (
        <button
          key={o.id}
          title={o.title}
          onClick={(e) => {
            e.stopPropagation();
            onChange(o.id);
          }}
          className={`flex-1 rounded-md font-medium transition ${size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'} ${
            value === o.id ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Şablonlar ---------------- */

function TemplateThumb({ t }) {
  const p = PALETTES.find((x) => x.id === t.defaultPalette).colors;
  const r = Math.min(t.radius.card, 14) / 2;
  const glass = t.surface === 'glass';
  return (
    <div className="relative h-[68px] w-[52px] shrink-0 overflow-hidden rounded-[10px] ring-1 ring-black/20" style={{ background: glass ? `radial-gradient(circle at 20% 0%, ${p.primary}88, transparent 60%), ${p.bg}` : p.bg }}>
      <div className="mx-1.5 mt-2 h-1.5 w-5 rounded-full" style={{ background: p.text }} />
      <div className="mx-1.5 mt-1.5 h-3" style={{ borderRadius: r, background: t.id === 'superapp' ? `linear-gradient(135deg, ${p.primary}, ${p.secondary})` : glass ? `${p.surface}aa` : p.surface, border: t.surface === 'outline' ? `1px solid ${p.text}` : 'none' }} />
      <div className="mx-1.5 mt-1.5 flex gap-1">
        {[p.primary, p.accent, p.secondary].map((c, i) => (
          <span key={i} className="h-2.5 w-2.5" style={{ background: c, borderRadius: t.radius.cuisine ? 99 : 2 }} />
        ))}
      </div>
      <div className="mx-1.5 mt-1.5 h-4" style={{ borderRadius: r, background: glass ? `${p.surface}aa` : p.surface, boxShadow: t.surface === 'elevated' ? '0 2px 4px rgba(0,0,0,.2)' : 'none', border: t.surface === 'outline' ? `1px dashed ${p.text}` : 'none' }} />
    </div>
  );
}

function TemplateCard({ t, i, state, set }) {
  const active = state.templateId === t.id;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => set.template(t.id)}
      onKeyDown={(e) => e.key === 'Enter' && set.template(t.id)}
      className={`group cursor-pointer rounded-xl p-2.5 text-left transition ${active ? 'bg-zinc-800/80 ring-2 ring-orange-500/80' : 'bg-zinc-900 ring-1 ring-zinc-800 hover:ring-zinc-600'}`}
    >
      <div className="flex gap-3">
        <TemplateThumb t={t} />
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-500">0{i + 1}</span>
            <span className="truncate text-[13.5px] font-semibold text-zinc-100">{t.name}</span>
            {active && <Check size={14} className="ml-auto shrink-0 text-orange-400" />}
          </div>
          <p className="mt-1 text-[12px] leading-snug text-zinc-400">{t.tagline}</p>
          {t.platformAware && !active && (
            <span className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] text-zinc-500">
              <Smartphone size={11} /> iOS / Android farkı var
            </span>
          )}
        </div>
      </div>
      {active && t.platformAware && (
        <div className="mt-2.5 border-t border-zinc-700/60 pt-2.5">
          <div className="mb-1.5 text-[10.5px] text-zinc-400">
            Platform dili <span className="text-zinc-500">· durum çubuğu, alt menü ve arama değişir</span>
          </div>
          <Segmented size="sm" options={PLATFORMS} value={state.platform} onChange={set.platform} />
        </div>
      )}
    </div>
  );
}

function BrandCard({ t, state, set }) {
  const active = state.templateId === t.id;
  const p = PALETTES.find((x) => x.id === t.defaultPalette).colors;
  return (
    <button
      onClick={() => set.template(t.id)}
      title={t.tagline}
      className={`overflow-hidden rounded-xl text-left transition ${active ? 'ring-2 ring-orange-500' : 'ring-1 ring-zinc-800 hover:ring-zinc-600'}`}
    >
      <div className="relative flex h-12 items-end gap-1 p-2" style={{ background: t.parts.header === 'band' ? p.primary : p.bg }}>
        <span className="h-5 flex-1" style={{ background: p.surface, borderRadius: Math.min(8, t.radius.card / 2), boxShadow: t.surface === 'elevated' ? '0 2px 4px rgba(0,0,0,.15)' : 'none' }} />
        <span className="h-5 w-5" style={{ background: p.primary, borderRadius: Math.min(99, t.radius.control) }} />
        <span className="h-5 w-3" style={{ background: p.accent, borderRadius: 3 }} />
        {active && <Check size={13} className="absolute right-1.5 top-1.5" style={{ color: t.parts.header === 'band' ? '#fff' : p.primary }} />}
      </div>
      <div className="bg-zinc-900 px-2.5 py-1.5">
        <div className="truncate text-[12px] font-medium text-zinc-100">{t.name.replace(' esintili', '')}</div>
        <div className="truncate text-[10.5px] text-zinc-500">{t.tagline.split(' · ')[0]}</div>
      </div>
    </button>
  );
}

function TemplatesTab({ state, set }) {
  const base = TEMPLATES.filter((t) => t.group !== 'brand');
  const brands = TEMPLATES.filter((t) => t.group === 'brand');
  const activeBrand = brands.find((t) => t.id === state.templateId);
  return (
    <>
      <MyTemplates state={state} set={set} />
      <Section title="Temel Şablonlar">
        <div className="space-y-2.5">
          {base.map((t, i) => (
            <TemplateCard key={t.id} t={t} i={i} state={state} set={set} />
          ))}
        </div>
      </Section>
      <Section title="Popüler Uygulamalardan Esinlenen">
        <p className="-mt-1 mb-2.5 text-[11px] leading-snug text-zinc-500">
          Dünyadaki yemek uygulamalarının renk ve arayüz dilinden esinlenen hazır şablonlar. Renkler yaklaşık değerlerdir; logo ve isim her zaman Gurme kalır.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((t) => (
            <BrandCard key={t.id} t={t} state={state} set={set} />
          ))}
        </div>
        {activeBrand && <p className="mt-2.5 rounded-lg bg-zinc-900 p-2.5 text-[11.5px] leading-snug text-zinc-400 ring-1 ring-zinc-800"><b className="text-zinc-200">{activeBrand.name}:</b> {activeBrand.tagline}</p>}
      </Section>
      <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-zinc-900 p-3 ring-1 ring-zinc-800">
        <input type="checkbox" checked={state.applyTemplatePalette} onChange={(e) => set.applyTemplatePalette(e.target.checked)} className="mt-0.5 accent-orange-500" />
        <span className="text-[12px] leading-snug text-zinc-400">
          <b className="font-medium text-zinc-200">Şablonun önerdiği paleti uygula.</b> Kapatırsan şablon değişse de kendi renklerin korunur; böylece bir şablonu başka bir uygulamanın renkleriyle birleştirebilirsin.
        </span>
      </label>
    </>
  );
}

/* ---------------- Renkler ---------------- */

function ColorRow({ k, label, hint, value, onChange }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = (v) => {
    const n = normalizeHex(v);
    if (n) onChange(k, n);
    else setDraft(value);
  };
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-zinc-900">
      <input type="color" value={value} onChange={(e) => onChange(k, e.target.value.toUpperCase())} className="h-9 w-9 shrink-0 rounded-lg ring-1 ring-white/10" aria-label={label} />
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-medium text-zinc-200">{label}</div>
        <div className="truncate text-[11px] text-zinc-500">{hint}</div>
      </div>
      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = normalizeHex(e.target.value);
          if (n && e.target.value.replace('#', '').length === 6) onChange(k, n);
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && commit(e.currentTarget.value)}
        spellCheck={false}
        className="w-[78px] rounded-md bg-zinc-900 px-2 py-1 font-mono text-[11.5px] uppercase text-zinc-300 outline-none ring-1 ring-zinc-800 focus:ring-orange-500"
      />
    </div>
  );
}

function ColorsTab({ state, set }) {
  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-2">
        <button onClick={set.resetPdf} className="flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-[12px] font-medium text-zinc-200 ring-1 ring-zinc-800 hover:ring-zinc-600">
          <RotateCcw size={14} /> PDF Orijinaline Sıfırla
        </button>
        <button onClick={set.randomize} className="flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-orange-500">
          <Shuffle size={14} /> Rastgele Tema Dene
        </button>
      </div>
      {state.lastRandom && <p className="-mt-3 mb-4 text-[11px] text-zinc-500">Son rastgele: {state.lastRandom}</p>}

      {[
        ['Hazır Çoklu Paletler', PALETTES.filter((p) => p.group !== 'brand')],
        ['Popüler Uygulama Paletleri', PALETTES.filter((p) => p.group === 'brand')],
      ].map(([title, list]) => (
      <Section key={title} title={title}>
        <div className="grid grid-cols-2 gap-2">
          {list.map((p) => {
            const active = state.paletteId === p.id;
            const c = p.colors;
            return (
              <button
                key={p.id}
                onClick={() => set.palette(p.id)}
                className={`overflow-hidden rounded-xl text-left transition ${active ? 'ring-2 ring-orange-500' : 'ring-1 ring-zinc-800 hover:ring-zinc-600'}`}
              >
                <div className="flex h-11" style={{ background: c.bg }}>
                  <span className="w-[60%]" style={{ background: c.bg }} />
                  <span className="w-[22%]" style={{ background: c.surface, borderLeft: `1px solid ${c.text}14` }} />
                  <span className="flex w-[18%] flex-col">
                    <span className="flex-1" style={{ background: c.primary }} />
                    <span className="flex-1" style={{ background: c.accent }} />
                    <span className="flex-1" style={{ background: c.secondary }} />
                  </span>
                </div>
                <div className="bg-zinc-900 px-2.5 py-1.5">
                  <div className="truncate text-[12px] font-medium text-zinc-100">{p.name}</div>
                  <div className="truncate text-[10.5px] text-zinc-500">{p.mood}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Section>
      ))}

      <Section title="Canlı Renk Seçiciler" right={state.paletteId === 'custom' && <span className="text-[10.5px] text-orange-400">Özel palet</span>}>
        <div className="-mx-2 space-y-0.5">
          {COLOR_KEYS.map((k) => (
            <ColorRow key={k.key} k={k.key} label={k.label} hint={k.hint} value={state.colors[k.key]} onChange={set.color} />
          ))}
        </div>
      </Section>
    </>
  );
}

/* ---------------- Logo ---------------- */

function LogoTab({ state, set }) {
  const c = {
    ...state.colors,
    onPrimary: state.theme.c.onPrimary,
  };
  return (
    <>
      <Section title="Gurme · Yazım Şekli">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-500">Harf biçimi</span>
          <div className="w-[150px]">
            <Segmented size="sm" options={LOGO_CASES} value={state.logoCase} onChange={set.logoCase} />
          </div>
        </div>
      </Section>

      <Section title="Wordmark Stilleri">
        <div className="space-y-2">
          {LOGO_STYLES.map((s) => {
            const active = state.logoStyleId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => set.logoStyle(s.id)}
                className={`block w-full overflow-hidden rounded-xl text-left transition ${active ? 'ring-2 ring-orange-500' : 'ring-1 ring-zinc-800 hover:ring-zinc-600'}`}
              >
                <div className="flex h-[58px] items-center px-4" style={{ background: state.theme.screenBg }}>
                  <Wordmark styleId={s.id} name="Gurme" caseMode={state.logoCase} icon={state.logoIcon} c={{ ...state.theme.c, ...c }} maxWidth={250} />
                </div>
                <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5">
                  <span className="text-[12px] font-medium text-zinc-200">{s.name}</span>
                  <span className="truncate pl-2 text-[10.5px] text-zinc-500">{s.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {state.logoStyleId === 'icon' && (
        <Section title="Marka İkonu">
          <div className="grid grid-cols-5 gap-1.5">
            {LOGO_ICONS.map((ic) => (
              <button
                key={ic.id}
                title={ic.label}
                onClick={() => set.logoIcon(ic.id)}
                className={`flex h-12 items-center justify-center rounded-lg ${state.logoIcon === ic.id ? 'bg-zinc-800 ring-2 ring-orange-500' : 'bg-zinc-900 ring-1 ring-zinc-800'}`}
              >
                <BrandIcon id={ic.id} size={22} color={state.colors.primary} cut="#18181B" />
              </button>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

export default function LeftPanel({ state, set }) {
  const [tab, setTab] = useState('templates');
  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-r border-zinc-800/80 bg-[#121316]">
      <div className="px-5 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-700 text-white">
            <Palette size={15} />
          </span>
          <div>
            <h1 className="text-[14px] font-semibold text-zinc-100">Tema Stüdyosu</h1>
            <p className="text-[11px] text-zinc-500">Gurme · görsel kimlik denemeleri</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1 rounded-xl bg-zinc-900 p-1 ring-1 ring-zinc-800">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition ${tab === id ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>
      <div className="studio-scroll flex-1 overflow-y-auto px-5 pb-8 pt-2">
        {tab === 'templates' && <TemplatesTab state={state} set={set} />}
        {tab === 'colors' && <ColorsTab state={state} set={set} />}
        {tab === 'components' && <ScreensTab state={state} set={set} />}
        {tab === 'logo' && <LogoTab state={state} set={set} />}
      </div>
    </aside>
  );
}
