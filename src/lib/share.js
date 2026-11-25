// Tasarımı URL ile paylaşma: durum JSON → base64 → #d=...
// Arkadaşın linki açtığında aynı şablon, renk, logo ve ekran düzenini görür.
import { normalizeHex } from './color.js';

export const SNAPSHOT_KEYS = [
  'templateId', 'platform', 'paletteId', 'colors', 'logoStyleId', 'logoCase', 'logoIcon',
  'overrides', 'cuisineImage', 'layout', 'hidden', 'screenOpts', 'ui',
];

const toB64 = (str) => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = (b64) => decodeURIComponent(escape(atob(b64.replace(/-/g, '+').replace(/_/g, '/'))));

export function encodeShare(snapshot) {
  const base = window.location.href.split('#')[0];
  return `${base}#d=${toB64(JSON.stringify(snapshot))}`;
}

export function decodeShare(hash) {
  try {
    const m = /#d=([A-Za-z0-9_-]+)/.exec(hash || '');
    if (!m) return null;
    const data = JSON.parse(fromB64(m[1]));
    if (!data || typeof data !== 'object' || !data.colors) return null;
    // Renkleri doğrula: yalnızca geçerli hex değerleri kabul edilir
    const keys = ['primary', 'accent', 'secondary', 'bg', 'surface', 'text'];
    if (!keys.every((k) => normalizeHex(data.colors[k]))) return null;
    data.colors = Object.fromEntries(keys.map((k) => [k, normalizeHex(data.colors[k])]));
    return Object.fromEntries(SNAPSHOT_KEYS.filter((k) => k in data).map((k) => [k, data[k]]));
  } catch {
    return null;
  }
}
