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

/* ------------------------------------------------------------------ */
/* Yemekler, siparişler ve hesap (temsili demo verisi)                 */
/* ------------------------------------------------------------------ */

export const DISHES = [
  { id: 'd1', name: 'Double Cheese Burger', desc: 'Çift köfte, cheddar, karamelize soğan', price: 245, restaurantId: 'r1', cuisine: 'burger', img: IMG.burger, emoji: '🍔' },
  { id: 'd2', name: 'Trüf Mantarlı Burger', desc: 'Trüf mayonez, közlenmiş mantar', price: 285, restaurantId: 'r1', cuisine: 'burger', img: u('photo-1550547660-d9450f859349'), emoji: '🍔' },
  { id: 'd3', name: 'Çıtır Patates', desc: 'Baharatlı, büyük boy', price: 65, restaurantId: 'r1', cuisine: 'burger', img: u('photo-1573080496219-bb080dd4f877'), emoji: '🍟', side: true },
  { id: 'd4', name: 'Fıstıklı Sufle', desc: 'Sıcak servis, dondurmalı', price: 135, restaurantId: 'r2', cuisine: 'tatli', img: IMG.dessert, emoji: '🍫', side: true },
  { id: 'd5', name: 'Fırın Sütlaç', desc: 'Geleneksel tarif, tarçınlı', price: 95, restaurantId: 'r2', cuisine: 'tatli', img: u('photo-1488477181946-6428a0291777'), emoji: '🍮', side: true },
  { id: 'd6', name: 'Margherita Pizza', desc: 'Taş fırın, manda mozzarella', price: 260, restaurantId: 'r3', cuisine: 'pizza', img: IMG.pizza, emoji: '🍕' },
  { id: 'd7', name: 'Karışık Pizza', desc: 'Sucuk, mantar, biber, zeytin', price: 310, restaurantId: 'r3', cuisine: 'pizza', img: u('photo-1513104890138-7c749659a591'), emoji: '🍕' },
  { id: 'd8', name: 'Et Döner Dürüm', desc: 'Lavaş, közlenmiş domates', price: 190, restaurantId: 'r4', cuisine: 'doner', img: IMG.doner, emoji: '🌯' },
  { id: 'd9', name: 'İskender', desc: 'Tereyağlı, yoğurtlu', price: 280, restaurantId: 'r4', cuisine: 'doner', img: IMG.steak, emoji: '🥩' },
  { id: 'd10', name: 'Ayran', desc: 'Köpüklü, 300 ml', price: 30, restaurantId: 'r4', cuisine: 'kahve', img: u('photo-1563636619-e9143da7973b'), emoji: '🥛', side: true },
  { id: 'd11', name: 'Somon Sushi Seti', desc: '12 parça, wasabi ve zencefil', price: 340, restaurantId: 'r3', cuisine: 'sushi', img: IMG.sushi, emoji: '🍣' },
  { id: 'd12', name: 'Sezar Salata', desc: 'Izgara tavuk, parmesan', price: 175, restaurantId: 'r2', cuisine: 'salata', img: IMG.salad, emoji: '🥗' },
];

export const getDish = (id) => DISHES.find((d) => d.id === id);
export const getRestaurant = (id) => RESTAURANTS.find((r) => r.id === id);

export const INITIAL_CART = [
  { dishId: 'd1', qty: 1 },
  { dishId: 'd4', qty: 1 },
];

export const COURIERS = ['Murat K.', 'Elif S.', 'Burak T.', 'Zeynep A.'];

export function initialOrders(now = Date.now()) {
  return [
    { id: 'G-24817', restaurantId: 'r1', items: [{ dishId: 'd1', qty: 1 }, { dishId: 'd3', qty: 1 }, { dishId: 'd10', qty: 2 }], placed: 'Bugün 19:42', status: 'active', p0: 0.5, t0: now, dur: 1200000, courier: 'Murat K.', rating: null },
    { id: 'G-24703', restaurantId: 'r3', items: [{ dishId: 'd6', qty: 1 }, { dishId: 'd7', qty: 1 }], placed: 'Dün 20:15', status: 'delivered', rating: null },
    { id: 'G-24521', restaurantId: 'r2', items: [{ dishId: 'd4', qty: 1 }, { dishId: 'd5', qty: 1 }], placed: '21 Kasım', status: 'delivered', rating: { stars: 5, tags: ['Lezzetli', 'Sıcak geldi'] } },
    { id: 'G-24390', restaurantId: 'r4', items: [{ dishId: 'd9', qty: 1 }, { dishId: 'd10', qty: 1 }], placed: '18 Kasım', status: 'delivered', rating: null },
    { id: 'G-24112', restaurantId: 'r3', items: [{ dishId: 'd11', qty: 1 }], placed: '12 Kasım', status: 'cancelled', rating: null },
  ];
}

export const RATING_TAGS = ['Lezzetli', 'Hızlı teslimat', 'Sıcak geldi', 'Bol porsiyon', 'Özenli paket'];

export const ACCOUNT = {
  name: 'Deniz Kaya',
  email: 'deniz@ornek.com',
  initials: 'DK',
  stats: [
    { label: 'Sipariş', value: '24' },
    { label: 'Favori', value: '7' },
    { label: 'Puan', value: '1.280' },
  ],
  wallet: '₺125,40',
  coupons: 3,
  plus: { title: 'Gurme Plus', desc: 'Ücretsiz teslimat + her siparişte %10', renew: 'Yenileme: 12 Aralık' },
  groups: [
    {
      title: 'Hesabım',
      items: [
        { id: 'addresses', label: 'Adreslerim', value: '3 adres', icon: 'MapPin' },
        { id: 'payments', label: 'Ödeme yöntemleri', value: '•••• 4242', icon: 'CreditCard' },
        { id: 'favorites', label: 'Favori restoranlar', value: '7', icon: 'Heart' },
        { id: 'coupons', label: 'Kuponlarım', value: '3 aktif', icon: 'Ticket' },
      ],
    },
    {
      title: 'Tercihler',
      items: [
        { id: 'notif', label: 'Bildirimler', toggle: true, icon: 'Bell' },
        { id: 'promo', label: 'Kampanya e-postaları', toggle: true, icon: 'Mail' },
        { id: 'lang', label: 'Dil', value: 'Türkçe', icon: 'Globe' },
      ],
    },
    {
      title: 'Destek',
      items: [
        { id: 'help', label: 'Yardım merkezi', icon: 'LifeBuoy' },
        { id: 'privacy', label: 'Gizlilik ve güvenlik', icon: 'ShieldCheck' },
      ],
    },
  ],
};

export const fmtTL = (n) => '₺' + n.toLocaleString('tr-TR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
