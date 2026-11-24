import { UtensilsCrossed, ChefHat, Flame, ShoppingBag } from 'lucide-react';
import { applyCase, getLogoStyle } from '../../config/logoStyles.js';

/** Gurme işareti: konum iğnesi içinde çatal-bıçak (marka kılavuzundaki işaretin sadeleştirilmiş hâli). */
export function GurmePin({ size = 24, color = '#E8590C', cut = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5c-4.7 0-8.5 3.7-8.5 8.4 0 5.9 7.3 11.9 7.6 12.2.5.4 1.3.4 1.8 0 .3-.3 7.6-6.3 7.6-12.2 0-4.7-3.8-8.4-8.5-8.4z" fill={color} />
      <path d="M9.2 5.6v4.1M8 5.6v3.2c0 .9.5 1.4 1.2 1.4s1.2-.5 1.2-1.4V5.6M9.2 10.2v4.6" stroke={cut} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M14.6 5.4c-1.1.5-1.6 2-1.6 3.4 0 .9.4 1.3 1 1.4v4.6" stroke={cut} strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BrandIcon({ id, size, color, cut }) {
  const p = { size, color, strokeWidth: 2.4 };
  switch (id) {
    case 'utensils':
      return <UtensilsCrossed {...p} />;
    case 'chef':
      return <ChefHat {...p} />;
    case 'flame':
      return <Flame {...p} />;
    case 'bag':
      return <ShoppingBag {...p} />;
    case 'pin':
    default:
      return <GurmePin size={size + 2} color={color} cut={cut} />;
  }
}

function splitName(name) {
  const trimmed = name.trim();
  const sp = trimmed.indexOf(' ');
  if (sp > 0) return [trimmed.slice(0, sp + 1), trimmed.slice(sp + 1)];
  const cut = Math.ceil(trimmed.length / 2);
  return [trimmed.slice(0, cut), trimmed.slice(cut)];
}

/**
 * Uygulama ismi. `maxWidth` piksel cinsinden; isim uzadıkça yazı boyutu otomatik küçülür,
 * böylece hiçbir stil başlığı taşırmaz.
 */
export default function Wordmark({ styleId, name, caseMode, icon, c, maxWidth = 190, scale = 1 }) {
  const style = getLogoStyle(styleId);
  const raw = (name || '').trim() || 'Gurme';
  const effCase = style.id === 'tracked' && caseMode === 'original' ? 'upper' : caseMode;
  const text = applyCase(raw, effCase);

  const base = { 'bold-sans': 26, duo: 26, icon: 23, pill: 18, serif: 28, tracked: 15, gradient: 27, dot: 26, script: 36 }[style.id] || 26;
  const est = text.length * base * style.widthFactor + (style.extraWidth || 0);
  const fit = Math.min(1, maxWidth / Math.max(est, 1));
  const fs = Math.max(11, base * fit) * scale;

  const common = { fontSize: fs, lineHeight: 1.1, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', maxWidth: maxWidth * scale, overflow: 'hidden' };

  switch (style.id) {
    case 'duo': {
      const [a, b] = splitName(text);
      return (
        <span style={{ ...common, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
          <span style={{ color: c.text, fontWeight: 500 }}>{a}</span>
          <span style={{ color: c.primary, fontWeight: 800 }}>{b}</span>
        </span>
      );
    }
    case 'icon':
      return (
        <span style={{ ...common, gap: fs * 0.28, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: c.text, letterSpacing: '-0.02em' }}>
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>
            <BrandIcon id={icon} size={Math.round(fs * 1.05)} color={c.primary} cut={c.bg} />
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
        </span>
      );
    case 'pill':
      return (
        <span
          style={{
            ...common,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            background: c.primary,
            color: c.onPrimary,
            padding: `${fs * 0.28}px ${fs * 0.7}px`,
            borderRadius: 999,
            letterSpacing: '-0.01em',
            boxShadow: `0 6px 16px -8px ${c.primary}`,
          }}
        >
          {text}
        </span>
      );
    case 'serif':
      return <span style={{ ...common, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, color: c.text, letterSpacing: '-0.01em' }}>{text}</span>;
    case 'tracked':
      return <span style={{ ...common, fontFamily: "'Outfit', sans-serif", fontWeight: 400, color: c.text, letterSpacing: '0.38em', marginRight: '-0.38em' }}>{text}</span>;
    case 'gradient':
      return (
        <span
          style={{
            ...common,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.03em',
            backgroundImage: `linear-gradient(100deg, ${c.primary} 0%, ${c.accent} 60%, ${c.secondary} 115%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            paddingBottom: 2,
          }}
        >
          {text}
        </span>
      );
    case 'dot':
      return (
        <span style={{ ...common, fontFamily: "'Inter', sans-serif", fontWeight: 800, color: c.text, letterSpacing: '-0.045em', alignItems: 'baseline' }}>
          {text}
          <span style={{ display: 'inline-block', width: fs * 0.26, height: fs * 0.26, borderRadius: 99, background: c.accent, marginLeft: fs * 0.08, flexShrink: 0 }} />
        </span>
      );
    case 'script':
      return <span style={{ ...common, fontFamily: "'Caveat', cursive", fontWeight: 700, color: c.text, lineHeight: 1 }}>{text}</span>;
    case 'bold-sans':
    default:
      return <span style={{ ...common, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: c.text, letterSpacing: '-0.04em' }}>{text}</span>;
  }
}
