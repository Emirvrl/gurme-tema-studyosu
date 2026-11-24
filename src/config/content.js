// Temsili içerik. Gerçek veri değildir; görseller Unsplash'ten gelir, yüklenemezse
// <SmartImage> renkli bir yedek görsele düşer.

const u = (id, w = 600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const IMG = {
  burger: u('photo-1568901346375-23c9450c58cd'),
  pizza: u('photo-1565299624946-b28f40a0ae38'),
  dessert: u('photo-1578985545062-69928b1d9587'),
  sushi: u('photo-1579871494447-9811cf80d66c'),
  doner: u('photo-1529006557810-274b9b2fc783'),
  breakfast: u('photo-1533089860892-a7c6f0a88666'),
  salad: u('photo-1512621776951-a57141f2eefd'),
  coffee: u('photo-1509042239860-f550ce710b93'),
  pasta: u('photo-1621996346565-e3dbc646d9a9'),
  steak: u('photo-1544025162-d76694265947'),
  interior: u('photo-1517248135467-4c7edcad34c4'),
};

export const ADDRESS = 'Zümrüt Cad. No:32 Kat 2';
export const SEARCH_PLACEHOLDER = 'Canın ne çekiyor...';

export const CAMPAIGNS = [
  {
    id: 'c1',
    eyebrow: 'Yeni üyelere',
    title: 'İlk siparişe %40 indirim',
    subtitle: '150 TL ve üzeri · Kod: GURME40',
    cta: 'Hemen kullan',
    big: '%40',
    img: IMG.pizza,
    emoji: '🍕',
  },
  {
    id: 'c2',
    eyebrow: 'Bu hafta',
    title: 'Ücretsiz teslimat haftası',
    subtitle: 'Seçili restoranlarda teslimat bizden',
    cta: 'Restoranları gör',
    big: '0₺',
    img: IMG.burger,
    emoji: '🍔',
  },
  {
    id: 'c3',
    eyebrow: 'Her akşam 18–21',
    title: 'Akşam yemeği 2 al 1 öde',
    subtitle: 'Makarna ve ızgarada geçerli',
    cta: 'Fırsatları keşfet',
    big: '2=1',
    img: IMG.pasta,
    emoji: '🍝',
  },
];

// Şeffaf (PNG/SVG) temsili görseller: Microsoft Fluent Emoji (MIT lisanslı).
const FLUENT = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets';
const fluent = (folder) => {
  const file = folder.toLowerCase().replace(/ /g, '_');
  const dir = encodeURIComponent(folder);
  return {
    png3d: `${FLUENT}/${dir}/3D/${file}_3d.png`,
    flat: `${FLUENT}/${dir}/Flat/${file}_flat.svg`,
    color: `${FLUENT}/${dir}/Color/${file}_color.svg`,
  };
};

export const CUISINES = [
  { id: 'burger', name: 'Burger', img: IMG.burger, emoji: '🍔', ...fluent('Hamburger') },
  { id: 'tatli', name: 'Tatlı', img: IMG.dessert, emoji: '🍰', ...fluent('Shortcake') },
  { id: 'pizza', name: 'Pizza', img: IMG.pizza, emoji: '🍕', ...fluent('Pizza') },
  { id: 'doner', name: 'Döner', img: IMG.doner, emoji: '🥙', ...fluent('Stuffed flatbread') },
  { id: 'sushi', name: 'Sushi', img: IMG.sushi, emoji: '🍣', ...fluent('Sushi') },
  { id: 'kahvalti', name: 'Kahvaltı', img: IMG.breakfast, emoji: '🍳', ...fluent('Cooking') },
  { id: 'salata', name: 'Salata', img: IMG.salad, emoji: '🥗', ...fluent('Green salad') },
  { id: 'kahve', name: 'Kahve', img: IMG.coffee, emoji: '☕', ...fluent('Hot beverage') },
];

export const RESTAURANTS = [
  {
    id: 'r1',
    name: 'Köşe Burger Atölyesi',
    category: 'Burger · Amerikan',
    rating: 4.4,
    reviews: '300+',
    eta: '30-40 dk',
    minOrder: 'Min. 150 TL',
    fee: 'Teslimat 19,90 TL',
    campaign: '%20 indirim',
    tag: 'Popüler',
    img: IMG.burger,
    emoji: '🍔',
  },
  {
    id: 'r2',
    name: 'Sütlaç & Co. Tatlıevi',
    category: 'Tatlı · Sütlü tatlılar',
    rating: 4.7,
    reviews: '1.2B+',
    eta: '20-30 dk',
    minOrder: 'Min. 100 TL',
    fee: 'Ücretsiz teslimat',
    campaign: 'Ücretsiz teslimat',
    tag: 'Yeni',
    img: IMG.dessert,
    emoji: '🍰',
  },
  {
    id: 'r3',
    name: 'Napoli Taş Fırın',
    category: 'Pizza · İtalyan',
    rating: 4.5,
    reviews: '850+',
    eta: '35-45 dk',
    minOrder: 'Min. 200 TL',
    fee: 'Teslimat 24,90 TL',
    campaign: '2 al 1 öde',
    tag: 'Şefin seçimi',
    img: IMG.pizza,
    emoji: '🍕',
  },
  {
    id: 'r4',
    name: 'Usta Dönerci Kadıköy',
    category: 'Döner · Türk mutfağı',
    rating: 4.3,
    reviews: '2B+',
    eta: '25-35 dk',
    minOrder: 'Min. 120 TL',
    fee: 'Teslimat 14,90 TL',
    campaign: 'Menüde %15',
    tag: 'Hızlı teslimat',
    img: IMG.doner,
    emoji: '🥙',
  },
];

export const NAV_ITEMS = [
  { id: 'home', label: 'Anasayfa' },
  { id: 'food', label: 'Yemek' },
  { id: 'cart', label: 'Sepet' },
  { id: 'orders', label: 'Sipariş' },
  { id: 'account', label: 'Hesap' },
];

export const CART_COUNT = 2;
