import { useEffect, useMemo, useState } from 'react';
import { getTemplate, effectivePlatform, PLATFORMS } from './config/templates.js';
import { getPalette } from './config/palettes.js';
import { getLogoStyle } from './config/logoStyles.js';
import { getNavMeta } from './config/components.js';
import { buildTheme } from './lib/theme.js';
import { evaluate } from './lib/evaluate.js';
import { randomPalette } from './lib/random.js';
import LeftPanel from './components/LeftPanel.jsx';
import RightPanel from './components/RightPanel.jsx';
import PhoneFrame from './components/PhoneFrame.jsx';
import MobileScreen from './components/screen/MobileScreen.jsx';

const STORAGE_KEY = 'gurme-tema-studyosu-v2';

const DEFAULT_STATE = {
  templateId: 'pdf',
  platform: 'ios',
  paletteId: 'pdf',
  colors: getPalette('pdf').colors,
  applyTemplatePalette: true,
  logoStyleId: 'script',
  logoCase: 'original',
  logoIcon: 'pin',
  // Bileşen seçimleri: null → şablondan gelir
  overrides: { header: null, search: null, banner: null, anim: null, cuisine: null, restaurant: null, nav: null },
  cuisineImage: 'photo',
  lastRandom: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const saved = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...saved, overrides: { ...DEFAULT_STATE.overrides, ...(saved.overrides || {}) } };
  } catch {
    return DEFAULT_STATE;
  }
}

export default function App() {
  const [s, setS] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      /* depolama kapalıysa sorun değil */
    }
  }, [s]);

  const patch = (p) => setS((prev) => ({ ...prev, ...p }));
  const template = getTemplate(s.templateId);
  const theme = useMemo(
    () => buildTheme(s.colors, template, s.platform, s.overrides, { cuisineImage: s.cuisineImage }),
    [s.colors, template, s.platform, s.overrides, s.cuisineImage],
  );
  const report = useMemo(
    () => evaluate({ colors: s.colors, template, logo: { styleId: s.logoStyleId, name: 'Gurme', caseMode: s.logoCase }, navId: theme.parts.nav }),
    [s.colors, template, s.logoStyleId, s.logoCase, theme.parts.nav],
  );

  const set = {
    template: (id) =>
      setS((prev) => {
        const t = getTemplate(id);
        const next = { ...prev, templateId: id };
        if (prev.applyTemplatePalette) {
          next.paletteId = t.defaultPalette;
          next.colors = getPalette(t.defaultPalette).colors;
        }
        return next;
      }),
    platform: (p) => patch({ platform: p }),
    applyTemplatePalette: (v) => patch({ applyTemplatePalette: v }),
    palette: (id) => patch({ paletteId: id, colors: getPalette(id).colors, lastRandom: null }),
    color: (key, value) => setS((prev) => ({ ...prev, paletteId: 'custom', colors: { ...prev.colors, [key]: value } })),
    resetPdf: () => patch({ paletteId: 'pdf', colors: getPalette('pdf').colors, lastRandom: null }),
    randomize: () => {
      const r = randomPalette();
      patch({ paletteId: 'custom', colors: r.colors, lastRandom: `${r.scheme} şema · ${r.dark ? 'koyu' : 'açık'} zemin` });
    },
    override: (key, value) => setS((prev) => ({ ...prev, overrides: { ...prev.overrides, [key]: value } })),
    resetOverrides: () => patch({ overrides: DEFAULT_STATE.overrides }),
    cuisineImage: (v) => patch({ cuisineImage: v }),
    logoStyle: (id) => patch({ logoStyleId: id }),
    logoCase: (v) => patch({ logoCase: v }),
    logoIcon: (v) => patch({ logoIcon: v }),
  };

  const plat = effectivePlatform(template, s.platform);
  const platLabel = template.platformAware ? PLATFORMS.find((p) => p.id === plat)?.label : 'Ortak (iOS + Android)';

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LeftPanel state={{ ...s, theme }} set={set} />

      <main className="relative flex min-w-0 flex-1 flex-col" style={{ background: 'radial-gradient(circle at 50% 35%, #1d1e23 0%, #0d0e10 70%)' }}>
        <div className="flex items-center justify-center gap-2 pt-4 text-[11.5px] text-zinc-500">
          <span className="rounded-full bg-zinc-900 px-2.5 py-1 ring-1 ring-zinc-800">{template.name}</span>
          <span className="rounded-full bg-zinc-900 px-2.5 py-1 ring-1 ring-zinc-800">{platLabel}</span>
          <span className="rounded-full bg-zinc-900 px-2.5 py-1 ring-1 ring-zinc-800">390 × 844</span>
        </div>
        <div className="min-h-0 flex-1 p-4">
          <PhoneFrame platform={plat}>
            <MobileScreen theme={theme} logo={{ styleId: s.logoStyleId, caseMode: s.logoCase, icon: s.logoIcon }} />
          </PhoneFrame>
        </div>
      </main>

      <RightPanel report={report} templateName={template.name} logoName={getLogoStyle(s.logoStyleId).name} navName={getNavMeta(theme.parts.nav).name} onFix={set.color} />
    </div>
  );
}
