import { hslToHex, mix } from './color.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Renk teorisine dayalı rastgele ama dengeli bir palet üretir. */
export function randomPalette() {
  const scheme = pick(['tamamlayıcı', 'triadik', 'analog', 'bölünmüş']);
  const dark = Math.random() < 0.3;
  // Yemek uygulamalarında sıcak tonlar ağırlıklı: ana rengin %70 ihtimalle sıcak olması
  const h = Math.random() < 0.7 ? rnd(-10, 45) : rnd(90, 330);
  const offsets = { tamamlayıcı: [180, 30], triadik: [120, 240], analog: [35, -35], bölünmüş: [150, 210] }[scheme];

  const primary = hslToHex(h, rnd(65, 85), dark ? rnd(55, 65) : rnd(42, 52));
  const accent = hslToHex(h + offsets[0], rnd(60, 90), dark ? rnd(55, 68) : rnd(45, 58));
  const secondary = hslToHex(h + offsets[1], rnd(35, 60), dark ? rnd(50, 62) : rnd(38, 50));
  const bg = dark ? hslToHex(h + 200, rnd(10, 25), rnd(4, 8)) : hslToHex(h, rnd(20, 60), rnd(96, 98.5));
  const surface = dark ? mix(bg, '#FFFFFF', rnd(0.06, 0.1)) : Math.random() < 0.6 ? '#FFFFFF' : mix(bg, '#FFFFFF', 0.6);
  const text = dark ? hslToHex(h, 15, 93) : hslToHex(h, rnd(10, 25), rnd(8, 12));
  return { colors: { primary, accent, secondary, bg, surface, text }, scheme, dark };
}
