// Renk paleti kayıt defteri.
// Yeni palet eklemek için diziye bir nesne eklemen yeterli.
// Alanlar: primary (ana), accent (vurgu), secondary (destek), bg (zemin), surface (kart), text (metin).

export const COLOR_KEYS = [
  { key: 'primary', label: 'Ana Renk', hint: 'Butonlar, aktif sekme, marka' },
  { key: 'accent', label: 'Vurgu Rengi', hint: 'Kampanya rozetleri, puan yıldızı' },
  { key: 'secondary', label: 'Destek Rengi', hint: 'İkincil etiketler, dekor' },
  { key: 'bg', label: 'Arka Plan', hint: 'Ekran zemini (%60)' },
  { key: 'surface', label: 'Kart Yüzeyi', hint: 'Kartlar, arama, banner kutuları' },
  { key: 'text', label: 'Metin', hint: 'Başlık ve gövde metni' },
];

export const PALETTES = [
  {
    id: 'pdf',
    name: 'PDF Orijinal',
    mood: 'Taslak · nötr gri',
    colors: { primary: '#1F1F23', accent: '#E5383B', secondary: '#9A9AA3', bg: '#FAFAFA', surface: '#E6E6E8', text: '#18181B' },
  },
  {
    id: 'gurme',
    name: 'Gurme Turuncu',
    mood: 'Marka · iştah açıcı',
    colors: { primary: '#E8590C', accent: '#FFB020', secondary: '#2F9E44', bg: '#FFF8F2', surface: '#FFFFFF', text: '#1C1917' },
  },
  {
    id: 'ios-mono',
    name: 'Kar Beyazı',
    mood: 'Premium · sade',
    colors: { primary: '#E4480E', accent: '#FF2D55', secondary: '#8E8E93', bg: '#F2F2F7', surface: '#FFFFFF', text: '#111113' },
  },
  {
    id: 'super',
    name: 'Kırmızı Enerji',
    mood: 'Ticari · yüksek kontrast',
    colors: { primary: '#E11D48', accent: '#FACC15', secondary: '#7C3AED', bg: '#FFFFFF', surface: '#F6F6F8', text: '#0B0B0F' },
  },
  {
    id: 'neon',
    name: 'Gece Neonu',
    mood: 'Koyu · parlak vurgu',
    colors: { primary: '#8B5CF6', accent: '#22D3EE', secondary: '#F472B6', bg: '#0B0B14', surface: '#1A1A2E', text: '#EDEDF7' },
  },
  {
    id: 'editorial',
    name: 'Terracotta Krem',
    mood: 'Sıcak · dergi',
    colors: { primary: '#B4532A', accent: '#2F5D50', secondary: '#D9A441', bg: '#F6EFE6', surface: '#FFFBF5', text: '#2A211C' },
  },
  {
    id: 'pastel',
    name: 'Pastel Bahar',
    mood: 'Yumuşak · genç',
    colors: { primary: '#F28482', accent: '#84A59D', secondary: '#F6BD60', bg: '#FFF9F5', surface: '#FFFFFF', text: '#3D3A4B' },
  },
  {
    id: 'olive',
    name: 'Zeytin & Limon',
    mood: 'Taze · sağlıklı',
    colors: { primary: '#5B7F2A', accent: '#F4B400', secondary: '#C2410C', bg: '#F7F8F1', surface: '#FFFFFF', text: '#1F2A14' },
  },
  {
    id: 'bordo',
    name: 'Bordo & Altın',
    mood: 'Lüks · akşam yemeği',
    colors: { primary: '#7F1D3A', accent: '#D4A017', secondary: '#4B5563', bg: '#141012', surface: '#221A1D', text: '#F3ECE6' },
  },
  {
    id: 'ocean',
    name: 'Okyanus Mercan',
    mood: 'Tamamlayıcı · ferah',
    colors: { primary: '#0E7490', accent: '#FF7A59', secondary: '#FBBF24', bg: '#F3FAFB', surface: '#FFFFFF', text: '#0C2A33' },
  },
];

export const getPalette = (id) => PALETTES.find((p) => p.id === id) || PALETTES[0];
