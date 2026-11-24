import { createContext, useContext } from 'react';
import { isDark, mix, onColor, rgba } from './color.js';
import { resolveParts, effectivePlatform } from '../config/templates.js';

export const ThemeCtx = createContext(null);
export const useT = () => useContext(ThemeCtx);

/** Seçili renkler + şablon + platformdan ekranın kullandığı tema nesnesini üretir. */
export function buildTheme(colors, template, platform, overrides = {}, extras = {}) {
  const { primary, accent, secondary, bg, surface, text } = colors;
  const dark = isDark(bg);
  const c = {
    primary,
    accent,
    secondary,
    bg,
    surface,
    text,
    muted: mix(text, bg, 0.42),
    hairline: rgba(text, dark ? 0.14 : 0.1),
    fill: rgba(text, dark ? 0.1 : 0.06),
    primarySoft: mix(primary, bg, dark ? 0.78 : 0.87),
    accentSoft: mix(accent, bg, dark ? 0.78 : 0.82),
    secondarySoft: mix(secondary, bg, dark ? 0.78 : 0.85),
    onPrimary: onColor(primary),
    onAccent: onColor(accent),
    onSecondary: onColor(secondary),
    inverseBg: text,
    inverseFg: bg,
    shadowColor: dark ? 'rgba(0,0,0,0.55)' : rgba(text, 0.16),
  };

  const t = template;
  const parts = resolveParts(t, platform, overrides);
  const plat = effectivePlatform(t, platform);

  /** Kart benzeri yüzeyler için şablona göre stil. */
  const surf = (radiusKey = 'card', extra = {}) => {
    const r = t.radius[radiusKey] ?? t.radius.card;
    const base = { borderRadius: r };
    switch (t.surface) {
      case 'outline':
        return { ...base, background: c.surface, border: `${t.stroke}px solid ${c.text}`, ...extra };
      case 'flat':
        return { ...base, background: c.surface, ...extra };
      case 'elevated':
        return { ...base, background: c.surface, boxShadow: `0 10px 28px -12px ${c.shadowColor}, 0 2px 6px -2px ${rgba(text, 0.06)}`, ...extra };
      case 'glass':
        return {
          ...base,
          background: rgba(surface, dark ? 0.42 : 0.55),
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : rgba(text, 0.08)}`,
          ...extra,
        };
      case 'soft':
      default:
        return { ...base, background: c.surface, boxShadow: `0 14px 34px -20px ${rgba(primary, 0.35)}, 0 1px 0 ${rgba(text, 0.04)}`, ...extra };
    }
  };

  const screenBg =
    t.bgDecor === 'blobs'
      ? `radial-gradient(circle at 12% -4%, ${rgba(primary, dark ? 0.45 : 0.25)} 0, transparent 42%),
         radial-gradient(circle at 105% 30%, ${rgba(accent, dark ? 0.32 : 0.2)} 0, transparent 38%),
         radial-gradient(circle at -10% 78%, ${rgba(secondary, dark ? 0.28 : 0.16)} 0, transparent 40%), ${bg}`
      : bg;

  return { c, t, parts, platform: plat, dark, surf, screenBg, fonts: t.fonts, cuisineImage: extras.cuisineImage || 'photo' };
}
