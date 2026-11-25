import { useState } from 'react';
import {
  MapPin, ChevronDown, Search, SlidersHorizontal, Mic, Star, Clock, Bike, Heart, Tag, ArrowRight,
  Signal, Wifi, BatteryFull, BadgePercent,
} from 'lucide-react';
import { useT } from '../../lib/theme.js';
import { rgba, mix } from '../../lib/color.js';
import { ADDRESS, SEARCH_PLACEHOLDER } from '../../config/content.js';

/* ------------------------------------------------------------------ */
/* Ortak yardımcılar                                                   */
/* ------------------------------------------------------------------ */

/** Görsel yüklenemezse paletten renkli bir yedek gösterir. */
export function SmartImage({ src, emoji, alt = '', style, className = '' }) {
  const T = useT();
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: `linear-gradient(135deg, ${T.c.primarySoft}, ${T.c.accentSoft})`, fontSize: 34, ...style }}
        aria-label={alt}
      >
        {emoji}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} style={style} draggable={false} />;
}

export const HScroll = ({ children, gap = 14, px = 16, style }) => (
  <div className="no-scrollbar flex overflow-x-auto" style={{ gap, paddingLeft: px, paddingRight: px, ...style }}>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Durum çubuğu                                                        */
/* ------------------------------------------------------------------ */

export function StatusBar({ band = false }) {
  const T = useT();
  const { c, platform, t } = T;
  const android = platform === 'android';
  const glass = t.surface === 'glass';
  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between"
      style={{
        height: 48,
        padding: android ? '0 22px' : '0 30px 0 34px',
        background: band ? c.primary : glass ? rgba(c.bg, 0.55) : c.bg,
        backdropFilter: glass ? 'blur(14px)' : undefined,
        WebkitBackdropFilter: glass ? 'blur(14px)' : undefined,
        color: band ? c.onPrimary : c.text,
        fontFamily: android ? "'Inter', sans-serif" : "-apple-system, 'SF Pro Text', 'Inter', sans-serif",
      }}
    >
      <span style={{ fontWeight: android ? 500 : 600, fontSize: android ? 13 : 15 }}>{android ? '09:41' : '9:41'}</span>
      <span className="flex items-center" style={{ gap: android ? 4 : 5 }}>
        <Signal size={android ? 14 : 15} strokeWidth={2.4} />
        <Wifi size={android ? 14 : 15} strokeWidth={2.4} />
        <BatteryFull size={android ? 18 : 22} strokeWidth={2} />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Üst başlık: logo + adres                                            */
/* ------------------------------------------------------------------ */

export function Header({ logo }) {
  const T = useT();
  const { c, t, parts } = T;
  const v = parts.header;

  const pillBase = { height: 36, borderRadius: 999, fontSize: 12.5, gap: 6, padding: '0 12px', color: c.text };
  const pillStyles = {
    rule: { ...pillBase, background: c.surface, border: `${t.stroke}px solid ${c.text}` },
    plain: { ...pillBase, background: c.fill },
    bold: { ...pillBase, background: c.primarySoft, color: c.text, fontWeight: 600 },
    glass: { ...pillBase, ...T.surf('chip') },
    editorial: { ...pillBase, background: 'transparent', padding: '0 2px', borderRadius: 0, fontStyle: 'italic', fontFamily: t.fonts.head, fontSize: 13.5 },
    band: { ...pillBase, background: rgba(c.onPrimary, 0.16), color: c.onPrimary, fontWeight: 600 },
  };
  const iconColor = v === 'rule' ? c.text : v === 'band' ? c.accent : c.primary;

  return (
    <div
      className="flex items-center"
      style={{
        gap: 12,
        padding: v === 'editorial' ? '6px 18px 10px' : v === 'band' ? '4px 16px 18px' : '4px 16px 12px',
        borderBottom: v === 'rule' ? `2px solid ${c.text}` : 'none',
        marginBottom: v === 'rule' || v === 'band' ? 14 : 0,
        background: v === 'band' ? c.primary : 'transparent',
        borderRadius: v === 'band' ? '0 0 24px 24px' : 0,
      }}
    >
      <div className="flex shrink-0 items-center" style={{ maxWidth: '40%', minHeight: 40 }}>
        {logo}
      </div>
      <div className={`flex min-w-0 flex-1 ${v === 'editorial' ? 'justify-end' : ''}`}>
        <div className="flex min-w-0 items-center" style={{ ...(pillStyles[v] || pillBase), ...(v === 'editorial' ? {} : { flex: 1 }) }}>
          <MapPin size={14} color={iconColor} strokeWidth={2.4} className="shrink-0" />
          <span className="truncate" style={v === 'editorial' ? { textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 } : undefined}>
            {ADDRESS}
          </span>
          {(v === 'bold' || v === 'plain' || v === 'glass' || v === 'band') && <ChevronDown size={14} className="shrink-0" color={v === 'band' ? c.onPrimary : c.muted} />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Arama                                                               */
/* ------------------------------------------------------------------ */

export function SearchBar() {
  const T = useT();
  const { c, t, parts } = T;
  const v = parts.search;
  const row = 'flex items-center';
  const ph = (extra) => (
    <span className="truncate" style={{ color: c.muted, fontSize: 14.5, ...extra }}>
      {SEARCH_PLACEHOLDER}
    </span>
  );

  if (v === 'bold') {
    return (
      <div className={row} style={{ gap: 10, padding: '0 16px' }}>
        <div className={`${row} flex-1`} style={{ ...T.surf('control'), height: 50, gap: 10, padding: '0 14px' }}>
          <Search size={19} color={c.text} strokeWidth={2.4} />
          {ph({ fontWeight: 500 })}
        </div>
        <div className="flex shrink-0 items-center justify-center" style={{ width: 50, height: 50, borderRadius: t.radius.control, background: c.primary, color: c.onPrimary, boxShadow: `0 10px 20px -10px ${c.primary}` }}>
          <SlidersHorizontal size={20} strokeWidth={2.4} />
        </div>
      </div>
    );
  }

  const styles = {
    outline: { height: 46, borderRadius: 999, background: c.surface, border: `${t.stroke}px solid ${c.text}`, padding: '0 16px', gap: 10 },
    ios: { height: 38, borderRadius: 11, background: c.fill, padding: '0 10px', gap: 7 },
    material: { height: 54, borderRadius: 999, background: mix(c.surface, c.primary, 0.07), padding: '0 18px', gap: 14 },
    glass: { ...T.surf('control'), height: 48, padding: '0 16px', gap: 10 },
    editorial: { height: 52, borderRadius: t.radius.control, background: c.surface, padding: '0 18px', gap: 12, boxShadow: `inset 0 0 0 1px ${c.hairline}` },
  };
  return (
    <div style={{ padding: '0 16px' }}>
      <div className={row} style={styles[v] || styles.outline}>
        <Search size={v === 'ios' ? 17 : 19} color={v === 'outline' ? c.text : c.muted} strokeWidth={v === 'ios' ? 2.2 : 2.4} />
        {v === 'outline' && <span style={{ width: 1.5, height: 20, background: c.text }} />}
        {ph(v === 'editorial' ? { fontFamily: t.fonts.head, fontStyle: 'italic', fontSize: 16 } : v === 'ios' ? { fontSize: 16 } : {})}
        {v === 'material' && <Mic size={20} color={c.text} className="ml-auto shrink-0" />}
        {v === 'glass' && <SlidersHorizontal size={18} color={c.accent} className="ml-auto shrink-0" />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kampanya karuseli                                                   */
/* ------------------------------------------------------------------ */

// Kampanya karuseli (deste + animasyonlar) carousel.jsx içindedir; burada yalnızca kart tasarımları var.

export function BannerCard({ v, it, index }) {
  const T = useT();
  const { c, t } = T;
  const R = t.radius.banner;
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight };

  if (v === 'ios') {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: R }}>
        <SmartImage src={it.img} emoji={it.emoji} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: 16, color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.85 }}>{it.eyebrow}</div>
          <div style={{ ...head, fontSize: 21, letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 2 }}>{it.title}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 3 }}>{it.subtitle}</div>
        </div>
      </div>
    );
  }

  if (v === 'bold') {
    const grad = [
      `linear-gradient(135deg, ${c.primary} 0%, ${mix(c.primary, c.secondary, 0.55)} 100%)`,
      `linear-gradient(135deg, ${c.secondary} 0%, ${mix(c.secondary, c.primary, 0.5)} 100%)`,
      `linear-gradient(135deg, ${mix(c.primary, '#000000', 0.15)} 0%, ${c.primary} 100%)`,
    ][index % 3];
    const fg = index % 3 === 1 ? c.onSecondary : c.onPrimary;
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: R, background: grad, color: fg, boxShadow: `0 16px 30px -18px ${c.primary}` }}>
        <span className="absolute" style={{ width: 180, height: 180, borderRadius: 999, right: -50, top: -60, background: 'rgba(255,255,255,.12)' }} />
        <span className="absolute" style={{ width: 90, height: 90, borderRadius: 999, left: -30, bottom: -40, background: 'rgba(255,255,255,.08)' }} />
        <div className="absolute overflow-hidden" style={{ right: -14, bottom: -18, width: 138, height: 138, borderRadius: 999, border: '5px solid rgba(255,255,255,.35)' }}>
          <SmartImage src={it.img} emoji={it.emoji} className="h-full w-full" />
        </div>
        <div
          className="absolute flex items-center justify-center"
          style={{ right: 96, top: 14, width: 52, height: 52, borderRadius: 999, background: c.accent, color: c.onAccent, fontWeight: 800, fontSize: 15, transform: 'rotate(-12deg)', boxShadow: '0 6px 14px rgba(0,0,0,.2)', fontFamily: t.fonts.head }}
        >
          {it.big}
        </div>
        <div className="relative flex h-full flex-col justify-between" style={{ padding: 16, width: '64%' }}>
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,.2)', padding: '3px 8px', borderRadius: 99 }}>{it.eyebrow}</span>
            <div style={{ ...head, fontSize: 20, lineHeight: 1.12, marginTop: 8, letterSpacing: '-0.02em' }}>{it.title}</div>
          </div>
          <span className="inline-flex w-fit items-center" style={{ gap: 6, background: fg, color: index % 3 === 1 ? c.secondary : c.primary, fontWeight: 800, fontSize: 12.5, padding: '7px 12px', borderRadius: 99 }}>
            {it.cta} <ArrowRight size={14} strokeWidth={3} />
          </span>
        </div>
      </div>
    );
  }

  if (v === 'glass') {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: R, border: `1px solid ${rgba('#FFFFFF', 0.14)}`, boxShadow: `0 0 0 1px ${rgba(c.primary, 0.15)}, 0 20px 40px -24px ${c.primary}` }}>
        <SmartImage src={it.img} emoji={it.emoji} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 20%, ${rgba(c.bg, 0.55)} 100%)` }} />
        <span className="absolute" style={{ top: 12, left: 12, fontSize: 11, fontWeight: 700, color: '#fff', padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.2)' }}>
          {it.eyebrow}
        </span>
        <div className="absolute flex items-center" style={{ left: 10, right: 10, bottom: 10, gap: 10, padding: '12px 12px 12px 14px', ...T.surf('card', { borderRadius: 18 }) }}>
          <div className="min-w-0 flex-1">
            <div className="truncate" style={{ ...head, fontSize: 16.5, color: c.text }}>{it.title}</div>
            <div className="truncate" style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{it.subtitle}</div>
          </div>
          <span className="flex shrink-0 items-center justify-center" style={{ width: 38, height: 38, borderRadius: 99, background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`, color: '#fff', boxShadow: `0 0 18px ${rgba(c.primary, 0.7)}` }}>
            <ArrowRight size={18} strokeWidth={2.6} />
          </span>
        </div>
      </div>
    );
  }

  if (v === 'editorial') {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: R }}>
        <SmartImage src={it.img} emoji={it.emoji} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(20,12,8,.78) 100%)' }} />
        <span className="absolute" style={{ top: 14, left: 14, background: c.bg, color: c.text, fontSize: 11, padding: '5px 11px', borderRadius: 99, fontFamily: t.fonts.head, fontStyle: 'italic' }}>
          No. {String(index + 1).padStart(2, '0')} · {it.eyebrow}
        </span>
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: '18px 18px 20px', color: '#fff' }}>
          <div style={{ fontFamily: t.fonts.head, fontWeight: 600, fontSize: 27, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{it.title}</div>
          <div className="flex items-center justify-between" style={{ marginTop: 10, fontSize: 12.5, opacity: 0.9 }}>
            <span className="truncate">{it.subtitle}</span>
            <ArrowRight size={16} className="shrink-0" />
          </div>
        </div>
      </div>
    );
  }

  // peek (PDF)
  return (
    <div className="flex h-full w-full overflow-hidden" style={{ ...T.surf('banner') }}>
      <div className="flex min-w-0 flex-1 flex-col justify-center" style={{ padding: '12px 10px 12px 14px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>Kampanyalar</div>
        <div style={{ ...head, fontSize: 15.5, lineHeight: 1.15, color: c.text, marginTop: 4 }}>{it.title}</div>
        <div style={{ fontSize: 11, color: c.muted, marginTop: 4, lineHeight: 1.3 }}>{it.subtitle}</div>
      </div>
      <div style={{ width: '40%', padding: 8, paddingLeft: 0 }}>
        <SmartImage src={it.img} emoji={it.emoji} className="h-full w-full" style={{ borderRadius: Math.max(6, R - 4) }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bölüm başlığı                                                       */
/* ------------------------------------------------------------------ */

export function SectionHeader({ title, action, eyebrow }) {
  const { c, t, parts } = useT();
  const v = parts.section;
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };

  const titleStyle = {
    plain: { ...head, fontSize: 18 },
    ios: { ...head, fontSize: 22, letterSpacing: '-0.025em' },
    bold: { ...head, fontSize: 20, letterSpacing: '-0.03em' },
    glass: { ...head, fontSize: 19, letterSpacing: '-0.02em' },
    editorial: { ...head, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.05 },
  }[v];

  let actionEl = null;
  if (action) {
    actionEl = {
      plain: <span style={{ fontSize: 13, fontWeight: 600, color: c.text, textDecoration: 'underline', textUnderlineOffset: 3 }}>{action}</span>,
      ios: <span style={{ fontSize: 15, color: c.primary }}>{action}</span>,
      bold: (
        <span className="inline-flex items-center" style={{ gap: 4, fontSize: 12.5, fontWeight: 800, color: c.primary, background: c.primarySoft, padding: '6px 11px', borderRadius: 99 }}>
          {action} <ArrowRight size={13} strokeWidth={3} />
        </span>
      ),
      glass: (
        <span className="inline-flex items-center" style={{ gap: 4, fontSize: 13, fontWeight: 600, color: c.accent }}>
          {action} <ArrowRight size={14} />
        </span>
      ),
      editorial: (
        <span className="inline-flex items-center" style={{ gap: 4, fontSize: 13, color: c.text, borderBottom: `1px solid ${c.text}`, paddingBottom: 1 }}>
          {action} <ArrowRight size={13} />
        </span>
      ),
    }[v];
  }

  return (
    <div className="flex items-end justify-between" style={{ padding: v === 'editorial' ? '0 18px' : '0 16px', gap: 12 }}>
      <div className="min-w-0">
        {v === 'editorial' && eyebrow && (
          <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: c.primary, fontWeight: 700, marginBottom: 4 }}>{eyebrow}</div>
        )}
        <div className="truncate" style={titleStyle}>{title}</div>
      </div>
      {actionEl && <div className="shrink-0">{actionEl}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mutfaklar                                                           */
/* ------------------------------------------------------------------ */

/** Mutfak görseli: fotoğraf (kırpılır) veya şeffaf PNG (kırpılmadan, gölgeyle). */
function CuisineImg({ it, mode, size, fill = false, round = false }) {
  const [failed, setFailed] = useState(false);
  if (mode === 'photo') {
    return (
      <SmartImage
        src={it.img}
        emoji={it.emoji}
        className={round ? 'rounded-full' : ''}
        style={fill ? { width: '100%', height: '100%' } : { width: size, height: size }}
      />
    );
  }
  if (failed || !it[mode]) return <span style={{ fontSize: size * 0.7, lineHeight: 1 }}>{it.emoji}</span>;
  return (
    <img
      src={it[mode]}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: 'contain', filter: mode === 'png3d' ? 'drop-shadow(0 6px 6px rgba(0,0,0,.22))' : 'drop-shadow(0 3px 3px rgba(0,0,0,.12))' }}
    />
  );
}

export function CuisineRow({ items, onPick }) {
  const T = useT();
  const { c, t, parts, cuisineImage: mode } = T;
  const v = parts.cuisine;
  const png = mode !== 'photo';
  // Yazı her zaman görsel kutusunun DIŞINDA, altında durur.
  const label = (txt, extra) => (
    <span className="block truncate text-center" style={{ fontSize: 12.5, fontWeight: 600, color: c.text, marginTop: 7, maxWidth: 80, ...extra }}>
      {txt}
    </span>
  );
  const softs = [c.primarySoft, c.accentSoft, c.secondarySoft];
  const center = 'flex items-center justify-center overflow-hidden';

  return (
    <HScroll gap={v === 'arch' || v === 'tile' ? 12 : 14} style={{ paddingTop: 4, paddingBottom: 4 }}>
      {items.map((it, i) => {
        let visual;
        let lbl = label(it.name);
        if (v === 'tile') {
          visual = (
            <div className={center} style={{ width: 66, height: 66, borderRadius: t.radius.cuisine, background: png ? c.fill : c.surface, boxShadow: `inset 0 0 0 0.5px ${c.hairline}` }}>
              <CuisineImg it={it} mode={mode} size={png ? 46 : 66} fill={!png} />
            </div>
          );
          lbl = label(it.name, { fontWeight: 500, fontSize: 12 });
        } else if (v === 'materialTile') {
          visual = (
            <div className={center} style={{ width: 72, height: 72, borderRadius: 22, background: i === 0 ? mix(c.primary, c.bg, 0.75) : mix(c.surface, c.primary, 0.07) }}>
              <CuisineImg it={it} mode={mode} size={png ? 48 : 50} round />
            </div>
          );
          lbl = label(it.name, { fontWeight: 500, fontSize: 12 });
        } else if (v === 'bubble') {
          visual = (
            <div className={center} style={{ width: 70, height: 70, borderRadius: 999, background: softs[i % 3], boxShadow: i === 0 ? `0 0 0 2.5px ${c.primary}` : 'none', overflow: png ? 'visible' : 'hidden' }}>
              {png ? <CuisineImg it={it} mode={mode} size={50} /> : <SmartImage src={it.img} emoji={it.emoji} className="rounded-full" style={{ width: 54, height: 54, boxShadow: '0 4px 10px rgba(0,0,0,.15)' }} />}
            </div>
          );
          lbl = label(it.name, { fontWeight: 800, fontFamily: t.fonts.head, fontSize: 12 });
        } else if (v === 'glow') {
          visual = (
            <div style={{ width: 68, height: 68, borderRadius: 999, padding: 2, background: `conic-gradient(from 200deg, ${c.primary}, ${c.accent}, ${c.secondary}, ${c.primary})`, boxShadow: i === 0 ? `0 0 18px ${rgba(c.primary, 0.6)}` : 'none' }}>
              <div className={`h-full w-full ${center}`} style={{ borderRadius: 999, border: `2px solid ${c.bg}`, background: png ? c.surface : 'transparent' }}>
                <CuisineImg it={it} mode={mode} size={png ? 40 : 64} fill={!png} />
              </div>
            </div>
          );
          lbl = label(it.name, { fontWeight: 500, color: c.muted });
        } else if (v === 'arch') {
          visual = (
            <div className={png ? 'flex items-end justify-center overflow-hidden' : 'overflow-hidden'} style={{ width: 76, height: 100, borderRadius: '999px 999px 22px 22px', background: png ? softs[i % 3] : c.surface, paddingBottom: png ? 14 : 0 }}>
              <CuisineImg it={it} mode={mode} size={png ? 56 : 76} fill={!png} />
            </div>
          );
          lbl = label(it.name, { fontFamily: t.fonts.head, fontStyle: 'italic', fontWeight: 500, fontSize: 14 });
        } else {
          // cutout (PDF): zeminsiz; fotoğraf daire kırpılır, PNG olduğu gibi durur
          visual = (
            <div className={center} style={{ width: 66, height: 66, overflow: 'visible' }}>
              <CuisineImg it={it} mode={mode} size={png ? 62 : 66} round />
            </div>
          );
          lbl = label(it.name, { fontWeight: 700 });
        }
        return (
          <div key={it.id} className="flex shrink-0 flex-col items-center" onClick={() => onPick?.(it.id)} style={{ cursor: onPick ? 'pointer' : 'default' }}>
            {visual}
            {lbl}
          </div>
        );
      })}
    </HScroll>
  );
}

/* ------------------------------------------------------------------ */
/* Restoran kartları                                                   */
/* ------------------------------------------------------------------ */

const Stars = ({ r, color, size = 13 }) => (
  <span className="inline-flex items-center" style={{ gap: 3 }}>
    <Star size={size} fill={color} color={color} />
    <b>{r.toFixed(1)}</b>
  </span>
);

export function RestaurantCard({ r }) {
  const T = useT();
  const { c, t, parts } = T;
  const v = parts.restaurant;
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };

  if (v === 'list') {
    return (
      <div style={{ padding: '0 16px' }}>
        <div className="relative overflow-hidden" style={{ height: 172, borderRadius: t.radius.image }}>
          <SmartImage src={r.img} emoji={r.emoji} className="h-full w-full" />
          <span className="absolute flex items-center justify-center" style={{ top: 10, right: 10, width: 32, height: 32, borderRadius: 99, background: 'rgba(255,255,255,.75)', backdropFilter: 'blur(10px)' }}>
            <Heart size={16} color="#111" />
          </span>
        </div>
        <div className="flex items-start justify-between" style={{ marginTop: 10, gap: 10 }}>
          <div className="min-w-0">
            <div className="truncate" style={{ ...head, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{r.name}</div>
            <div className="truncate" style={{ fontSize: 13.5, color: c.muted, marginTop: 2 }}>
              {r.eta} · {r.minOrder} · {r.fee}
            </div>
            <div className="inline-flex items-center" style={{ gap: 5, color: c.primary, fontSize: 12.5, fontWeight: 500, marginTop: 6 }}>
              <Tag size={13} /> {r.campaign}
            </div>
          </div>
          <span className="shrink-0" style={{ fontSize: 13, color: c.text, background: c.fill, padding: '4px 8px', borderRadius: 8 }}>
            <Stars r={r.rating} color={c.accent} size={12} />
          </span>
        </div>
      </div>
    );
  }

  if (v === 'promo') {
    return (
      <div style={{ padding: '0 16px' }}>
        <div className="overflow-hidden" style={T.surf('card')}>
          <div className="relative" style={{ height: 150 }}>
            <SmartImage src={r.img} emoji={r.emoji} className="h-full w-full" />
            <span className="absolute inline-flex items-center" style={{ top: 10, left: 10, gap: 4, background: c.accent, color: c.onAccent, fontWeight: 800, fontSize: 12, padding: '5px 10px', borderRadius: 99, fontFamily: t.fonts.head }}>
              <BadgePercent size={14} strokeWidth={2.6} /> {r.campaign}
            </span>
            <span className="absolute flex items-center justify-center" style={{ top: 10, right: 10, width: 34, height: 34, borderRadius: 99, background: '#fff' }}>
              <Heart size={17} color={c.primary} fill={c.primary} />
            </span>
            <span className="absolute" style={{ bottom: 10, left: 10, background: c.secondary, color: c.onSecondary, fontWeight: 700, fontSize: 11, padding: '4px 9px', borderRadius: 8 }}>{r.tag}</span>
          </div>
          <div style={{ padding: '12px 14px 14px' }}>
            <div className="flex items-center justify-between" style={{ gap: 8 }}>
              <div className="truncate" style={{ ...head, fontSize: 16.5, letterSpacing: '-0.02em' }}>{r.name}</div>
              <span className="shrink-0" style={{ fontSize: 12.5, background: c.accentSoft, color: c.text, padding: '4px 8px', borderRadius: 99 }}>
                <Stars r={r.rating} color={c.accent} size={12} /> <span style={{ color: c.muted }}>({r.reviews})</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center" style={{ gap: 6, marginTop: 9, fontSize: 12, color: c.text, fontWeight: 600 }}>
              <span className="inline-flex items-center" style={{ gap: 4, background: c.fill, padding: '4px 8px', borderRadius: 99 }}><Clock size={13} /> {r.eta}</span>
              <span className="inline-flex items-center" style={{ gap: 4, background: c.fill, padding: '4px 8px', borderRadius: 99 }}><Bike size={13} /> {r.fee}</span>
              <span style={{ color: c.muted, fontWeight: 500 }}>{r.minOrder}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (v === 'glass') {
    return (
      <div style={{ padding: '0 16px' }}>
        <div style={{ ...T.surf('card'), padding: 10 }}>
          <div className="relative overflow-hidden" style={{ height: 150, borderRadius: t.radius.image }}>
            <SmartImage src={r.img} emoji={r.emoji} className="h-full w-full" />
            <span className="absolute" style={{ top: 10, left: 10, background: c.primary, color: c.onPrimary, fontWeight: 700, fontSize: 11.5, padding: '5px 10px', borderRadius: 99, boxShadow: `0 0 16px ${rgba(c.primary, 0.8)}` }}>{r.campaign}</span>
            <span className="absolute inline-flex items-center" style={{ bottom: 10, right: 10, gap: 4, color: '#fff', fontSize: 12, padding: '4px 9px', borderRadius: 99, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.18)' }}>
              <Star size={12} fill={c.accent} color={c.accent} /> {r.rating.toFixed(1)} · {r.reviews}
            </span>
          </div>
          <div style={{ padding: '10px 6px 4px' }}>
            <div className="truncate" style={{ ...head, fontSize: 16.5 }}>{r.name}</div>
            <div className="flex items-center justify-between" style={{ marginTop: 5, fontSize: 12.5, color: c.muted, gap: 8 }}>
              <span className="truncate">{r.category}</span>
              <span className="shrink-0 inline-flex items-center" style={{ gap: 4, color: c.accent }}><Clock size={13} /> {r.eta}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (v === 'cover') {
    return (
      <div style={{ padding: '0 18px' }}>
        <div className="relative overflow-hidden" style={{ height: 224, borderRadius: t.radius.card, boxShadow: `0 20px 40px -26px ${rgba(c.text, 0.5)}` }}>
          <SmartImage src={r.img} emoji={r.emoji} className="h-full w-full" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,12,8,.8) 100%)' }} />
          <span className="absolute" style={{ top: 14, right: 14, background: c.bg, color: c.text, fontSize: 12.5, padding: '5px 10px', borderRadius: 99 }}>
            <Stars r={r.rating} color={c.primary} size={12} />
          </span>
          <div className="absolute bottom-0 left-0 right-0" style={{ padding: 18, color: '#fff' }}>
            <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.85 }}>{r.category}</div>
            <div className="truncate" style={{ fontFamily: t.fonts.head, fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', marginTop: 4 }}>{r.name}</div>
          </div>
        </div>
        <div className="flex items-center justify-between" style={{ padding: '10px 4px 0', fontSize: 13, color: c.muted, gap: 8 }}>
          <span className="truncate">{r.eta} · {r.minOrder}</span>
          <span className="shrink-0" style={{ color: c.primary, fontFamily: t.fonts.head, fontStyle: 'italic', fontSize: 14 }}>{r.campaign}</span>
        </div>
      </div>
    );
  }

  // dashed (PDF)
  return (
    <div style={{ padding: '0 16px' }}>
      <div className="relative z-10 overflow-hidden" style={{ height: 150, borderRadius: t.radius.image, border: `${t.stroke}px solid ${c.text}`, background: c.surface }}>
        <SmartImage src={r.img} emoji={r.emoji} className="h-full w-full" />
      </div>
      <div style={{ margin: '-2px 8px 0', padding: '10px 12px 12px', border: `${t.stroke}px dashed ${c.text}`, borderTop: 'none', borderRadius: `0 0 ${t.radius.card}px ${t.radius.card}px` }}>
        <div className="flex items-center justify-between" style={{ gap: 8 }}>
          <span className="truncate" style={{ ...head, fontSize: 15 }}>{r.name}</span>
          <span className="shrink-0" style={{ fontSize: 13, color: c.text }}>
            <Stars r={r.rating} color={c.accent} />
          </span>
        </div>
        <div className="flex items-center justify-between" style={{ fontSize: 12.5, color: c.muted, marginTop: 3, gap: 8 }}>
          <span className="truncate">{r.eta} – {r.minOrder}</span>
          <span className="shrink-0">({r.reviews} yorum)</span>
        </div>
        <span className="inline-block" style={{ marginTop: 8, fontSize: 11, fontWeight: 600, padding: '2px 8px', border: `1px dashed ${c.text}`, borderRadius: 6, color: c.accent }}>
          {r.campaign}
        </span>
      </div>
    </div>
  );
}
