// Ekranlarda ortak kullanılan küçük bileşenler: buton, sayfa başlığı, adet seçici, bildirim.
import { useEffect } from 'react';
import { ChevronLeft, Minus, Plus, Bell } from 'lucide-react';
import { useT } from '../../lib/theme.js';
import { useApp } from '../../lib/store.js';
import { rgba, mix, onColor } from '../../lib/color.js';
import Wordmark from './Wordmark.jsx';

/** Ton (primary/accent/secondary/mono) → renk çifti */
export function toneColors(c, tone) {
  const bg = tone === 'accent' ? c.accent : tone === 'secondary' ? c.secondary : tone === 'mono' ? c.text : c.primary;
  return { bg, fg: onColor(bg), soft: mix(bg, c.bg, 0.85) };
}

export function btnRadius(T, ui) {
  const shape = ui?.btnShape || 'template';
  if (shape === 'pill') return 999;
  if (shape === 'soft') return 12;
  if (shape === 'sharp') return 4;
  return Math.min(T.t.radius.control, 999);
}

const WEAKER = { filled: 'outline', soft: 'text', outline: 'text', text: 'text' };

/**
 * Global buton. variant="main" seçili dolgu stilini, variant="alt" bir kademe zayıfını kullanır.
 */
export function Btn({ children, onClick, tone, variant = 'main', icon: Icon, full, size = 'md', style, disabled }) {
  const T = useT();
  const app = useApp();
  const ui = app?.ui || {};
  const tc = toneColors(T.c, tone || 'primary');
  const kind = variant === 'alt' ? WEAKER[ui.btnStyle || 'filled'] : ui.btnStyle || 'filled';
  const h = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;
  const looks = {
    filled: { background: tc.bg, color: tc.fg, border: '1.5px solid transparent' },
    soft: { background: tc.soft, color: mix(tc.bg, T.c.text, T.dark ? 0 : 0.25), border: '1.5px solid transparent' },
    outline: { background: 'transparent', color: T.dark ? tc.bg : mix(tc.bg, T.c.text, 0.2), border: `1.5px solid ${tc.bg}` },
    text: { background: 'transparent', color: T.dark ? tc.bg : mix(tc.bg, T.c.text, 0.2), border: '1.5px solid transparent', padding: '0 6px' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center whitespace-nowrap transition active:scale-[.97] disabled:opacity-40"
      style={{
        height: h,
        padding: size === 'sm' ? '0 12px' : '0 16px',
        gap: 6,
        borderRadius: btnRadius(T, ui),
        fontWeight: 700,
        fontSize: size === 'sm' ? 12.5 : size === 'lg' ? 15.5 : 13.5,
        width: full ? '100%' : undefined,
        fontFamily: T.t.fonts.body,
        ...looks[kind],
        ...style,
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 17} strokeWidth={2.4} />}
      {children}
    </button>
  );
}

/** − adet + seçici */
export function Stepper({ qty, onChange, tone = 'primary', compact }) {
  const T = useT();
  const app = useApp();
  const tc = toneColors(T.c, tone);
  const s = compact ? 26 : 30;
  return (
    <span className="inline-flex items-center" style={{ gap: compact ? 6 : 8, background: T.c.fill, borderRadius: btnRadius(T, app?.ui), padding: 3 }}>
      <button onClick={() => onChange(qty - 1)} className="flex items-center justify-center" style={{ width: s, height: s, borderRadius: btnRadius(T, app?.ui), background: T.c.surface, color: T.c.text }} aria-label="Azalt">
        <Minus size={14} strokeWidth={2.6} />
      </button>
      <b style={{ minWidth: 14, textAlign: 'center', fontSize: 13.5, color: T.c.text }}>{qty}</b>
      <button onClick={() => onChange(qty + 1)} className="flex items-center justify-center" style={{ width: s, height: s, borderRadius: btnRadius(T, app?.ui), background: tc.bg, color: tc.fg }} aria-label="Arttır">
        <Plus size={14} strokeWidth={2.6} />
      </button>
    </span>
  );
}

/** Anasayfa dışındaki ekranların başlığı */
export function PageHeader({ title, subtitle, right }) {
  const T = useT();
  const app = useApp();
  const { c, t } = T;
  const v = app?.ui?.pageHeader || 'large';
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };
  const back = (
    <button onClick={() => app?.store.navigate('home')} className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 99, background: v === 'band' ? rgba(c.onPrimary, 0.16) : c.fill, color: v === 'band' ? c.onPrimary : c.text }} aria-label="Geri">
      <ChevronLeft size={20} />
    </button>
  );
  const rightEl = right || (
    <span className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 99, background: v === 'band' ? rgba(c.onPrimary, 0.16) : c.fill, color: v === 'band' ? c.onPrimary : c.text }}>
      <Bell size={18} />
    </span>
  );

  if (v === 'center') {
    return (
      <div className="flex items-center justify-between" style={{ padding: '2px 14px 12px', borderBottom: `1px solid ${c.hairline}`, marginBottom: 14 }}>
        {back}
        <div className="min-w-0 text-center">
          <div className="truncate" style={{ ...head, fontSize: 17 }}>{title}</div>
          {subtitle && <div className="truncate" style={{ fontSize: 11.5, color: c.muted }}>{subtitle}</div>}
        </div>
        {rightEl}
      </div>
    );
  }
  if (v === 'band') {
    return (
      <div style={{ background: c.primary, color: c.onPrimary, padding: '4px 18px 22px', borderRadius: '0 0 26px 26px', marginBottom: 16 }}>
        <div className="flex items-center justify-between">
          {back}
          {rightEl}
        </div>
        <div style={{ ...head, color: c.onPrimary, fontSize: 26, marginTop: 10, letterSpacing: '-0.02em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{subtitle}</div>}
      </div>
    );
  }
  if (v === 'logo') {
    const l = app?.logo || {};
    return (
      <div style={{ padding: '2px 16px 14px' }}>
        <div className="flex items-center justify-between">
          <Wordmark styleId={l.styleId} name="Gurme" caseMode={l.caseMode} icon={l.icon} c={c} maxWidth={120} />
          {rightEl}
        </div>
        <div style={{ ...head, fontSize: 22, marginTop: 12, letterSpacing: '-0.02em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: c.muted }}>{subtitle}</div>}
      </div>
    );
  }
  return (
    <div style={{ padding: '4px 18px 16px' }}>
      <div className="flex items-end justify-between" style={{ gap: 10 }}>
        <div className="min-w-0">
          {subtitle && <div style={{ fontSize: 13, color: c.muted, marginBottom: 2 }}>{subtitle}</div>}
          <div className="truncate" style={{ ...head, fontSize: 31, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{title}</div>
        </div>
        {rightEl}
      </div>
    </div>
  );
}

/** Ekranın altında beliren kısa bildirim */
export function Toast() {
  const T = useT();
  const app = useApp();
  const toast = app?.store.toast;
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => app.store.clearToast(toast.id), 2200);
    return () => clearTimeout(id);
  }, [toast]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!toast) return null;
  return (
    <div className="pointer-events-none absolute left-0 right-0 z-40 flex justify-center" style={{ bottom: 118 }}>
      <div key={toast.id} style={{ background: T.c.inverseBg, color: T.c.inverseFg, padding: '10px 16px', borderRadius: 14, fontSize: 13, fontWeight: 600, boxShadow: '0 12px 24px -12px rgba(0,0,0,.5)', animation: 'gurme-toast .3s ease' }}>
        {toast.msg}
      </div>
    </div>
  );
}

/** Bölüm başlığı (ekranlar için hafif sürüm) */
export function Sub({ children, right }) {
  const { c, t } = useT();
  return (
    <div className="flex items-center justify-between" style={{ padding: '0 18px', marginBottom: 10 }}>
      <span style={{ fontFamily: t.fonts.head, fontWeight: t.headWeight, fontSize: 17, color: c.text, letterSpacing: '-0.01em' }}>{children}</span>
      {right}
    </div>
  );
}
