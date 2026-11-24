// Renk yardımcıları: dönüşüm, karıştırma, WCAG kontrastı.

export function normalizeHex(input) {
  if (typeof input !== 'string') return null;
  let x = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(x)) x = x.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(x)) return null;
  return '#' + x.toUpperCase();
}

export function hexToRgb(hex) {
  const h = normalizeHex(hex) || '#000000';
  const n = parseInt(h.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }) {
  const c = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return ('#' + c(r) + c(g) + c(b)).toUpperCase();
}

export function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** a ile b arasında karıştırır; t=0 → a, t=1 → b */
export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex({ r: A.r + (B.r - A.r) * t, g: A.g + (B.g - A.g) * t, b: A.b + (B.b - A.b) * t });
}

export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a, b) {
  const L1 = luminance(a);
  const L2 = luminance(b);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

export function isDark(hex) {
  return luminance(hex) < 0.2;
}

export function onColor(hex) {
  return contrast(hex, '#FFFFFF') >= contrast(hex, '#111113') ? '#FFFFFF' : '#111113';
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hexToHsl(hex) {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex({ r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 });
}

export function hueDistance(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** fg rengini bg üzerinde hedef kontrasta ulaşana kadar açar/koyulaştırır. */
export function fixContrast(fg, bg, target = 4.5) {
  if (contrast(fg, bg) >= target) return normalizeHex(fg);
  const { h, s, l } = hexToHsl(fg);
  const goDark = luminance(bg) > 0.35;
  for (let i = 1; i <= 100; i++) {
    const nl = goDark ? l - i : l + i;
    if (nl < 0 || nl > 100) break;
    const c = hslToHex(h, s, nl);
    if (contrast(c, bg) >= target) return c;
  }
  return goDark ? '#111113' : '#FAFAFA';
}

/** Yüzeyin zeminden ayrışması için öneri (açık temada açar/beyaza, koyu temada açar). */
export function suggestSurface(bg) {
  const dark = isDark(bg);
  return dark ? mix(bg, '#FFFFFF', 0.08) : luminance(bg) > 0.9 ? mix(bg, '#000000', 0.05) : mix(bg, '#FFFFFF', 0.7);
}
