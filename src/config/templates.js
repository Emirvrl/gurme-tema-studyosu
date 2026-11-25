import { BRAND_TEMPLATES } from './brands.js';

// Şablon kayıt defteri.
// Bir şablon; tipografi, köşe yuvarlaklıkları, yüzey stili ve her ekran parçası için
// hangi görsel varyantın kullanılacağını tanımlar. Yerleşim (layout) her şablonda aynıdır.
//
// parts: header | search | banner | section | cuisine | restaurant | nav
//   Varyant adları src/components/screen/parts.jsx içindeki kayıtlarla eşleşir.
//   Yeni bir şablon mevcut varyantları karıştırarak da oluşturulabilir.
// platformParts: Yalnızca platforma göre belirgin fark varsa doldurulur (iOS HIG vs Material 3).
// surface: 'outline' | 'flat' | 'elevated' | 'glass' | 'soft'

const BASE_TEMPLATES = [
  {
    id: 'pdf',
    name: 'PDF Referans',
    tagline: 'Ekteki taslağa en sadık temel görünüm',
    defaultPalette: 'pdf',
    platformAware: false,
    fonts: { body: "'Inter', system-ui, sans-serif", head: "'Inter', system-ui, sans-serif" },
    headWeight: 700,
    radius: { card: 18, banner: 12, control: 999, chip: 999, image: 14, cuisine: 0 },
    surface: 'outline',
    stroke: 1.5,
    parts: { header: 'rule', search: 'outline', banner: 'peek', section: 'plain', cuisine: 'cutout', restaurant: 'dashed', nav: 'arch', anim: 'stack' },
    pros: [
      'Taslaktaki bilgi hiyerarşisi birebir korunuyor; ekip için ortak referans noktası.',
      'Kalın çizgiler ve kutular bileşen sınırlarını çok net gösteriyor.',
      'Ortadaki kavisli Sepet butonu ana eylemi (sipariş) öne çıkarıyor.',
    ],
    cons: [
      'Wireframe estetiği ürünleşmiş bir marka hissi vermiyor; "taslak" gibi algılanabilir.',
      'Her şeyin aynı kalınlıkta çerçevelenmesi kampanya alanının dikkat çekiciliğini azaltıyor.',
      'Kesikli bilgi kutusu küçük ekranda görsel gürültü yaratabilir.',
    ],
  },
  {
    id: 'ios',
    name: 'Apple / iOS Minimal',
    tagline: 'Geniş boşluk, ince çizgi, premium sadelik',
    defaultPalette: 'ios-mono',
    platformAware: true,
    fonts: {
      body: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif",
      head: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif",
    },
    headWeight: 700,
    radius: { card: 14, banner: 16, control: 12, chip: 8, image: 12, cuisine: 16 },
    surface: 'flat',
    stroke: 0.5,
    parts: { header: 'plain', search: 'ios', banner: 'ios', section: 'ios', cuisine: 'tile', restaurant: 'list', nav: 'ios', anim: 'slide' },
    platformParts: {
      android: { search: 'material', nav: 'material', cuisine: 'materialTile' },
      ortak: { nav: 'neutral' },
    },
    pros: [
      'Bol beyaz alan sayesinde içerik ve yemek görselleri nefes alıyor; premium algı yüksek.',
      'Saç teli ayraçlar ve sistem fontu tanıdık, güven veren bir his yaratıyor.',
      'Az renk kullanımı, ana rengi gerçekten önemli eylemlere ayırıyor.',
    ],
    cons: [
      'Kampanyalar sakin kaldığı için agresif indirim iletişiminde etkisi düşük.',
      'Düşük kontrastlı gri metinler güneş altında okunurluğu zorlaştırabilir.',
      'Android kullanıcılarında "iPhone uygulaması" hissi yaratabilir; Material geçişi bunu çözer.',
    ],
  },
  {
    id: 'superapp',
    name: 'Modern Süper Uygulama',
    tagline: 'Dikkat çekici banner, rozet ve yüksek kontrast',
    defaultPalette: 'super',
    platformAware: true,
    fonts: { body: "'DM Sans', 'Inter', sans-serif", head: "'Plus Jakarta Sans', 'Inter', sans-serif" },
    headWeight: 800,
    radius: { card: 20, banner: 22, control: 16, chip: 999, image: 16, cuisine: 999 },
    surface: 'elevated',
    stroke: 0,
    parts: { header: 'bold', search: 'bold', banner: 'bold', section: 'bold', cuisine: 'bubble', restaurant: 'promo', nav: 'floating', anim: 'swipe' },
    platformParts: {
      android: { nav: 'material', search: 'material' },
    },
    pros: [
      'Gradyan banner ve büyük indirim rakamları kampanyaları saniyeler içinde fark ettiriyor.',
      'Görsel üstü rozetler (indirim, ücretsiz teslimat) karar süresini kısaltıyor.',
      'Kalın başlıklar ve gölgeli kartlar güçlü bir ticari hiyerarşi kuruyor.',
    ],
    cons: [
      'Çok sayıda rozet ve renk aynı anda kullanılınca görsel karmaşa ve "indirim yorgunluğu" oluşabilir.',
      'Gölgeler ve gradyanlar düşük donanımlı cihazlarda ağır hissettirebilir.',
      'Marka ismi kalabalık üst alanda kampanyalarla yarışıp kaybolabilir.',
    ],
  },
  {
    id: 'glass',
    name: 'Glassmorphism / Koyu Modern',
    tagline: 'Koyu zemin, cam yüzeyler, parlak vurgular',
    defaultPalette: 'neon',
    platformAware: false,
    fonts: { body: "'Inter', sans-serif", head: "'Space Grotesk', 'Inter', sans-serif" },
    headWeight: 700,
    radius: { card: 24, banner: 26, control: 18, chip: 999, image: 18, cuisine: 999 },
    surface: 'glass',
    stroke: 1,
    bgDecor: 'blobs',
    parts: { header: 'glass', search: 'glass', banner: 'glass', section: 'glass', cuisine: 'glow', restaurant: 'glass', nav: 'glass', anim: 'coverflow' },
    pros: [
      'Koyu zemin akşam siparişlerinde göz yormuyor, yemek fotoğraflarını parlatıyor.',
      'Cam katmanlar derinlik hissi veriyor; modern ve teknolojik bir marka algısı.',
      'Neon vurgular sepet ve kampanya gibi kritik noktaları karanlıkta öne çıkarıyor.',
    ],
    cons: [
      'Yarı saydam yüzeylerde metin kontrastı arka plana göre değişir; okunurluk riski.',
      'Bulanıklık efektleri performans ve pil tüketimi açısından maliyetli.',
      'Açık renkli bir paletle kullanılırsa cam efekti tamamen kaybolur.',
    ],
  },
  {
    id: 'editorial',
    name: 'Editorial / Yumuşak Modern',
    tagline: 'Büyük görsel, sıcak köşeler, dergi estetiği',
    defaultPalette: 'editorial',
    platformAware: false,
    fonts: { body: "'DM Sans', 'Inter', sans-serif", head: "'Fraunces', Georgia, serif" },
    headWeight: 600,
    radius: { card: 28, banner: 30, control: 22, chip: 999, image: 24, cuisine: 999 },
    surface: 'soft',
    stroke: 0,
    parts: { header: 'editorial', search: 'editorial', banner: 'editorial', section: 'editorial', cuisine: 'arch', restaurant: 'cover', nav: 'editorial', anim: 'fade' },
    pros: [
      'Büyük yemek görselleri iştah uyandırıyor; marka "lezzet rehberi" gibi konumlanıyor.',
      'Serif başlıklar sıcak, zanaatkâr ve güvenilir bir ton veriyor.',
      'Yumuşak köşeler ve krem tonlar uzun gezinmede rahat bir deneyim sunuyor.',
    ],
    cons: [
      'Büyük görseller ekrana daha az restoran sığdırıyor; hızlı karşılaştırma zorlaşıyor.',
      'Serif yazı küçük punto ve düşük çözünürlükte okunurluğunu kaybedebilir.',
      'Görsel kalitesi düşük restoranlarda tasarım hemen "ucuz" görünür.',
    ],
  },
];

export const TEMPLATES = [...BASE_TEMPLATES, ...BRAND_TEMPLATES];

export const PLATFORMS = [
  { id: 'ortak', label: 'Ortak' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
];

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

/**
 * Şablonun parçalarını platforma ve kullanıcının bileşen seçimlerine göre çözer.
 * Öncelik: kullanıcı seçimi > platform farkı > şablon varsayılanı.
 */
export function resolveParts(template, platform, overrides = {}) {
  const p = template.platformAware ? platform : 'ortak';
  const base = { ...template.parts, ...((template.platformParts && template.platformParts[p]) || {}) };
  for (const [k, v] of Object.entries(overrides || {})) if (v) base[k] = v;
  return base;
}

/** Durum çubuğu ve cihaz çerçevesi için etkin platform. */
export function effectivePlatform(template, platform) {
  return template.platformAware ? platform : 'ortak';
}
