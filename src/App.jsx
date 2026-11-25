import { useEffect, useMemo, useState } from 'react';
import { getTemplate, effectivePlatform, PLATFORMS } from './config/templates.js';
import { getPalette } from './config/palettes.js';
import { getLogoStyle } from './config/logoStyles.js';
import { getNavMeta } from './config/components.js';
import { getScreen, defaultLayout, defaultHidden, defaultScreenOpts, defaultUi, mergeLayout } from './config/screens.js';
import { buildTheme } from './lib/theme.js';
import { evaluate, screenReview } from './lib/evaluate.js';
import { randomPalette } from './lib/random.js';
import { useAppStore } from './lib/store.js';
import { decodeShare, SNAPSHOT_KEYS } from './lib/share.js';
import LeftPanel from './components/LeftPanel.jsx';
import RightPanel from './components/RightPanel.jsx';
import PhoneFrame from './components/PhoneFrame.jsx';
import MobileScreen from './components/screen/MobileScreen.jsx';

const STORAGE_KEY = 'gurme-tema-studyosu-v3';
const SAVED_KEY = 'gurme-sablonlarim-v1';

const DEFAULT_OVERRIDES = { header: null, search: null, banner: null, anim: null, cuisine: null, restaurant: null, nav: null };

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
  overrides: DEFAULT_OVERRIDES,
  cuisineImage: 'photo',
  // Ekranlar: bölüm sırası, gizli bölümler, ekran seçenekleri, genel arayüz seçenekleri
  layout: defaultLayout(),
  hidden: defaultHidden(),
  screenOpts: defaultScreenOpts(),
  ui: defaultUi(),
  lastRandom: null,
};

/** Kayıtlı/paylaşılan durumu güncel varsayılanlarla güvenle birleştirir. */
function normalize(saved = {}) {
  const defOpts = defaultScreenOpts();
  const screenOpts = Object.fromEntries(Object.entries(defOpts).map(([k, v]) => [k, { ...v, ...((saved.screenOpts || {})[k] || {}) }]));
  return {
    ...DEFAULT_STATE,
    ...saved,
    overrides: { ...DEFAULT_OVERRIDES, ...(saved.overrides || {}) },
    layout: mergeLayout(saved.layout),
    hidden: { ...defaultHidden(), ...(saved.hidden || {}) },
    screenOpts,
    ui: { ...defaultUi(), ...(saved.ui || {}) },
  };
}

function loadState() {
  const shared = decodeShare(window.location.hash);
  if (shared) return { ...normalize(shared), fromLink: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [s, setS] = useState(loadState);
  const [saved, setSaved] = useState(loadSaved);
  const store = useAppStore();

  useEffect(() => {
    try {
      const { fromLink, ...rest } = s;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      /* depolama kapalıysa sorun değil */
    }
  }, [s]);
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    } catch {
      /* yok say */
    }
  }, [saved]);

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
  const screenNotes = useMemo(() => screenReview(store.screen, s.screenOpts, s.colors, s.ui), [store.screen, s.screenOpts, s.colors, s.ui]);

  const app = useMemo(
    () => ({ store, layout: s.layout, hidden: s.hidden, opts: s.screenOpts, ui: s.ui, logo: { styleId: s.logoStyleId, caseMode: s.logoCase, icon: s.logoIcon } }),
    [store, s.layout, s.hidden, s.screenOpts, s.ui, s.logoStyleId, s.logoCase, s.logoIcon],
  );

  const snapshot = () => Object.fromEntries(SNAPSHOT_KEYS.map((k) => [k, s[k]]));

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
    resetOverrides: () => patch({ overrides: DEFAULT_OVERRIDES }),
    cuisineImage: (v) => patch({ cuisineImage: v }),
    logoStyle: (id) => patch({ logoStyleId: id }),
    logoCase: (v) => patch({ logoCase: v }),
    logoIcon: (v) => patch({ logoIcon: v }),
    // Ekranlar
    moveSection: (screen, id, dir) =>
      setS((prev) => {
        const list = [...prev.layout[screen]];
        const i = list.indexOf(id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return prev;
        [list[i], list[j]] = [list[j], list[i]];
        return { ...prev, layout: { ...prev.layout, [screen]: list } };
      }),
    toggleSection: (screen, id) =>
      setS((prev) => {
        const h = prev.hidden[screen] || [];
        return { ...prev, hidden: { ...prev.hidden, [screen]: h.includes(id) ? h.filter((x) => x !== id) : [...h, id] } };
      }),
    screenOpt: (screen, key, value) => setS((prev) => ({ ...prev, screenOpts: { ...prev.screenOpts, [screen]: { ...prev.screenOpts[screen], [key]: value } } })),
    resetScreen: (screen) =>
      setS((prev) => ({
        ...prev,
        layout: { ...prev.layout, [screen]: defaultLayout()[screen] },
        hidden: { ...prev.hidden, [screen]: [] },
        screenOpts: { ...prev.screenOpts, [screen]: defaultScreenOpts()[screen] },
      })),
    uiOpt: (key, value) => setS((prev) => ({ ...prev, ui: { ...prev.ui, [key]: value } })),
    // Şablonlarım
    saveCurrent: (name) => setSaved((list) => [{ id: `my-${Date.now()}`, name, createdAt: Date.now(), data: snapshot() }, ...list]),
    applySaved: (id) => {
      const item = saved.find((x) => x.id === id);
      if (item) setS((prev) => ({ ...normalize({ ...prev, ...item.data }), applyTemplatePalette: prev.applyTemplatePalette }));
    },
    deleteSaved: (id) => setSaved((list) => list.filter((x) => x.id !== id)),
    renameSaved: (id, name) => setSaved((list) => list.map((x) => (x.id === id ? { ...x, name } : x))),
    snapshot,
    dismissLink: () => {
      patch({ fromLink: false });
      window.history.replaceState(null, '', window.location.pathname);
    },
  };

  const plat = effectivePlatform(template, s.platform);
  const platLabel = template.platformAware ? PLATFORMS.find((p) => p.id === plat)?.label : 'Ortak (iOS + Android)';

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LeftPanel state={{ ...s, theme, saved, store }} set={set} />

      <main className="relative flex min-w-0 flex-1 flex-col" style={{ background: 'radial-gradient(circle at 50% 35%, #1d1e23 0%, #0d0e10 70%)' }}>
        {s.fromLink && (
          <div className="mx-auto mt-3 flex items-center gap-3 rounded-full bg-orange-500/15 px-4 py-1.5 text-[12px] text-orange-200 ring-1 ring-orange-500/30">
            Paylaşılan bir tasarımı görüntülüyorsun.
            <button onClick={() => { set.saveCurrent('Paylaşılan tasarım'); set.dismissLink(); }} className="font-semibold text-orange-300 hover:text-white">Şablonlarıma kaydet</button>
            <button onClick={set.dismissLink} className="text-orange-300/70 hover:text-white">Kapat</button>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11.5px] text-zinc-500">
          <span className="rounded-full bg-zinc-900 px-2.5 py-1 ring-1 ring-zinc-800">{template.name}</span>
          <span className="rounded-full bg-zinc-900 px-2.5 py-1 ring-1 ring-zinc-800">{platLabel}</span>
          <span className="rounded-full bg-zinc-900 px-2.5 py-1 ring-1 ring-zinc-800">Ekran: {getScreen(store.screen).label}</span>
        </div>
        <div className="min-h-0 flex-1 p-4">
          <PhoneFrame platform={plat}>
            <MobileScreen theme={theme} app={app} />
          </PhoneFrame>
        </div>
      </main>

      <RightPanel
        report={report}
        templateName={template.name}
        logoName={getLogoStyle(s.logoStyleId).name}
        navName={getNavMeta(theme.parts.nav).name}
        screenNotes={screenNotes}
        onFix={set.color}
      />
    </div>
  );
}
