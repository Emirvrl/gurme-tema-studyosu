// Ekran kayıt defteri: her alt bar sekmesi bir ekran açar.
// sections: sırası değiştirilebilen / gizlenebilen bölümler (varsayılan sıra = listedeki sıra)
// options:  ekrana özel tasarım seçenekleri (şekil / yerleşim)
// tone:     ekrandaki butonların ve vurguların hangi palet rengini kullanacağı
//
// Yeni bir bölüm/varyant eklemek için buraya ekle, ilgili ekran bileşeninde çiz.

export const TONES = [
  { id: 'primary', name: 'Ana renk' },
  { id: 'accent', name: 'Vurgu' },
  { id: 'secondary', name: 'Destek' },
  { id: 'mono', name: 'Metin (mono)' },
];

export const SCREENS = [
  {
    id: 'home',
    label: 'Anasayfa',
    title: 'Anasayfa',
    sections: [
      { id: 'search', name: 'Arama çubuğu' },
      { id: 'campaigns', name: 'Kampanyalar' },
      { id: 'cuisines', name: 'Mutfaklar' },
      { id: 'restaurants', name: 'Restoranlar' },
    ],
    options: [],
  },
  {
    id: 'food',
    label: 'Yemek',
    title: 'Yemek keşfet',
    subtitle: 'Bugün ne yesek?',
    sections: [
      { id: 'search', name: 'Arama çubuğu' },
      { id: 'chips', name: 'Kategori filtresi' },
      { id: 'dishes', name: 'Yemekler' },
      { id: 'restaurants', name: 'Yakındaki restoranlar' },
    ],
    options: [
      {
        key: 'chips', title: 'Kategori filtresi', default: 'pill',
        options: [
          { id: 'pill', name: 'Dolgu kapsül', desc: 'Aktif kategori renkli' },
          { id: 'underline', name: 'Alt çizgili sekme', desc: 'Sade sekme çubuğu' },
          { id: 'icon', name: 'İkonlu çip', desc: 'PNG ikon + yazı' },
        ],
      },
      {
        key: 'dish', title: 'Yemek kartı', default: 'grid',
        options: [
          { id: 'grid', name: 'İkili ızgara', desc: 'Görsel üstte, 2 sütun', pro: 'Bir bakışta çok ürün gösterir.', con: 'Uzun ürün adları kısalır.' },
          { id: 'list', name: 'Liste satırı', desc: 'Metin solda, görsel sağda', pro: 'Açıklama ve fiyat rahat okunur; menü hissi verir.', con: 'Görseller küçük kalır, iştah etkisi azalır.' },
          { id: 'big', name: 'Büyük kart', desc: 'Tam genişlik görsel', pro: 'Fotoğraf odaklı, iştah açıcı.', con: 'Ekrana az ürün sığar.' },
        ],
      },
      {
        key: 'add', title: 'Sepete ekle butonu', default: 'round',
        options: [
          { id: 'round', name: 'Yuvarlak +', desc: 'Görselin köşesinde' },
          { id: 'text', name: 'Yazılı buton', desc: '"Sepete ekle"' },
          { id: 'stepper', name: 'Hep adet seçici', desc: '− 0 + her zaman görünür' },
        ],
      },
    ],
  },
  {
    id: 'cart',
    label: 'Sepet',
    title: 'Sepetim',
    subtitle: 'Siparişini gözden geçir',
    sections: [
      { id: 'items', name: 'Ürünler' },
      { id: 'upsell', name: 'Yanına iyi gider' },
      { id: 'coupon', name: 'Kupon' },
      { id: 'note', name: 'Teslimat notu' },
      { id: 'summary', name: 'Ödeme özeti' },
      { id: 'checkout', name: 'Sipariş butonu' },
    ],
    options: [
      {
        key: 'items', title: 'Ürün listesi', default: 'rows',
        options: [
          { id: 'rows', name: 'Satırlar', desc: 'Küçük görsel + adet seçici', pro: 'Kompakt ve tanıdık.', con: 'Görsel etki zayıf.' },
          { id: 'cards', name: 'Kartlar', desc: 'Her ürün ayrı kart', pro: 'Dokunma alanları büyük, ferah.', con: 'Uzun sepetlerde çok kaydırma gerekir.' },
          { id: 'receipt', name: 'Fiş', desc: 'Kesikli fiş görünümü', pro: 'Özgün ve eğlenceli; toplamı fiş gibi anlatır.', con: 'Görsel yok; ürünleri tanımak zorlaşır.' },
        ],
      },
      {
        key: 'summary', title: 'Ödeme özeti', default: 'card',
        options: [
          { id: 'card', name: 'Kart', desc: 'Yüzey kartı içinde' },
          { id: 'receipt', name: 'Fiş', desc: 'Tırtıklı kenar, mono rakamlar' },
          { id: 'plain', name: 'Sade', desc: 'Kutusuz satırlar' },
        ],
      },
      {
        key: 'checkout', title: 'Sipariş butonu', default: 'split',
        options: [
          { id: 'full', name: 'Tam genişlik', desc: '"Siparişi ver · ₺"', pro: 'En net çağrı; kaçırılmaz.', con: 'Toplam tutar butona sıkışır.' },
          { id: 'split', name: 'Toplam + buton', desc: 'Solda tutar, sağda buton', pro: 'Tutar ve eylem birlikte okunur.', con: 'Buton daha dar.' },
          { id: 'slide', name: 'Kaydırarak onayla', desc: 'Sürükle ve bırak', pro: 'Yanlışlıkla sipariş vermeyi önler, eğlenceli.', con: 'Ek bir hareket gerektirir; erişilebilirlik için dokunma alternatifi şart.' },
        ],
      },
    ],
  },
  {
    id: 'orders',
    label: 'Sipariş',
    title: 'Siparişlerim',
    subtitle: 'Aktif ve geçmiş siparişler',
    sections: [
      { id: 'active', name: 'Yoldaki sipariş' },
      { id: 'stats', name: 'Özet istatistik' },
      { id: 'filters', name: 'Filtreler' },
      { id: 'history', name: 'Geçmiş siparişler' },
    ],
    options: [
      {
        key: 'tracker', title: 'Canlı takip kartı', default: 'stepper',
        options: [
          { id: 'stepper', name: 'Adım adım', desc: 'Alındı → Hazırlanıyor → Yolda → Teslim', pro: 'Sürecin neresinde olduğunu çok net anlatır.', con: 'Dikey alan kaplar.' },
          { id: 'progress', name: 'Büyük süre', desc: 'Dev dakika + ilerleme çubuğu', pro: 'Kullanıcının asıl sorusuna ("ne zaman?") odaklanır.', con: 'Aşama bilgisi geri planda kalır.' },
          { id: 'map', name: 'Harita', desc: 'Kuryenin rotada hareketi', pro: 'En güven verici ve canlı takip deneyimi.', con: 'En çok alan kaplayan seçenek; gerçek haritada veri maliyeti var.' },
          { id: 'compact', name: 'Şerit', desc: 'Tek satırlık canlı bant', pro: 'Geçmiş siparişlere yer bırakır.', con: 'Takip detayı için ek dokunuş gerekir.' },
        ],
      },
      {
        key: 'card', title: 'Geçmiş sipariş kartı', default: 'card',
        options: [
          { id: 'card', name: 'Kart', desc: 'Görsel, durum, butonlar', pro: 'Değerlendir/Tekrarla eylemleri çok görünür.', con: 'Liste uzun görünür.' },
          { id: 'timeline', name: 'Zaman çizelgesi', desc: 'Dikey çizgi ve tarih noktaları', pro: 'Sipariş geçmişini bir hikâye gibi anlatır.', con: 'Butonlar daha küçük.' },
          { id: 'compact', name: 'Kompakt satır', desc: 'İkon butonlu satır', pro: 'Bir ekranda çok sipariş gösterir.', con: 'İkon butonlar etiketsiz; anlaşılırlık düşer.' },
          { id: 'receipt', name: 'Fiş', desc: 'Tırtıklı bilet görünümü', pro: 'Özgün ve markaya karakter katar.', con: 'Süslü görünüm hızlı taramayı yavaşlatır.' },
        ],
      },
      {
        key: 'buttons', title: 'Butonların yeri', default: 'bottom',
        options: [
          { id: 'bottom', name: 'Altta yan yana', desc: 'Değerlendir · Tekrarla' },
          { id: 'side', name: 'Sağda dikey', desc: 'Kartın sağ kenarında' },
          { id: 'menu', name: 'Tek ana buton', desc: 'Tekrarla belirgin, değerlendir yazı' },
        ],
      },
      {
        key: 'status', title: 'Durum rozeti rengi', default: 'accent', tone: true,
        options: [],
      },
    ],
  },
  {
    id: 'account',
    label: 'Hesap',
    title: 'Hesabım',
    subtitle: 'Profil ve tercihler',
    sections: [
      { id: 'profile', name: 'Profil' },
      { id: 'membership', name: 'Gurme Plus üyelik' },
      { id: 'wallet', name: 'Cüzdan & kuponlar' },
      { id: 'menu', name: 'Ayarlar menüsü' },
      { id: 'logout', name: 'Çıkış' },
    ],
    options: [
      {
        key: 'profile', title: 'Profil başlığı', default: 'cover',
        options: [
          { id: 'cover', name: 'Kapak', desc: 'Gradyan kapak, taşan avatar', pro: 'Kişisel ve sıcak bir giriş; marka rengini taşır.', con: 'Ekranın üst kısmını çok kaplar.' },
          { id: 'card', name: 'Kart', desc: 'Avatar solda, kart içinde', pro: 'Kompakt ve düzenli.', con: 'Daha az kişisel.' },
          { id: 'centered', name: 'Ortalı', desc: 'Büyük avatar + istatistik', pro: 'Sosyal profil hissi; istatistikler öne çıkar.', con: 'Ayarlara ulaşmak için daha çok kaydırma.' },
          { id: 'minimal', name: 'Minimal', desc: 'Sadece isim ve e-posta', pro: 'En sade; doğrudan ayarlara geçer.', con: 'Kişiselleştirme hissi yok.' },
        ],
      },
      {
        key: 'menu', title: 'Ayar menüsü', default: 'grouped',
        options: [
          { id: 'grouped', name: 'Gruplu liste', desc: 'iOS tarzı içeri girintili gruplar', pro: 'Tanıdık ve düzenli.', con: 'Sıradan görünebilir.' },
          { id: 'tiles', name: 'Kutucuklar', desc: '2 sütun ikon kutuları', pro: 'Dokunması kolay, görsel ve hızlı.', con: 'Değer/anahtar bilgisi sığmaz.' },
          { id: 'plain', name: 'Düz liste', desc: 'Tam genişlik, ayraçlı', pro: 'Maksimum okunurluk.', con: 'Gruplar arası ayrım zayıf.' },
          { id: 'cards', name: 'Ayrı kartlar', desc: 'Her satır ayrı kart', pro: 'Ferah ve modern.', con: 'Uzun menülerde çok yer kaplar.' },
        ],
      },
      {
        key: 'icons', title: 'İkon stili', default: 'tinted',
        options: [
          { id: 'tinted', name: 'Tonlu zemin', desc: 'Yumuşak renkli kare' },
          { id: 'filled', name: 'Dolgu', desc: 'Tam renkli kare, beyaz ikon' },
          { id: 'mono', name: 'Sade', desc: 'Zeminsiz tek renk' },
        ],
      },
    ],
  },
];

// Tüm ekranlarda ortak olan genel seçenekler
export const GLOBAL_OPTIONS = [
  {
    key: 'pageHeader', title: 'Sayfa başlığı (Anasayfa dışı)', default: 'large',
    options: [
      { id: 'large', name: 'Büyük başlık', desc: 'iOS tarzı sola dayalı' },
      { id: 'center', name: 'Ortalı', desc: 'Geri oku ve ince çizgi' },
      { id: 'band', name: 'Renkli bant', desc: 'Ana renkli, yuvarlak alt' },
      { id: 'logo', name: 'Logolu', desc: 'Gurme logosu + başlık' },
    ],
  },
  {
    key: 'transition', title: 'Sayfa geçişi', default: 'slide',
    options: [
      { id: 'slide', name: 'Kaydır', desc: 'Sağdan gelir' },
      { id: 'fade', name: 'Solma', desc: 'Yumuşak geçiş' },
      { id: 'rise', name: 'Yüksel', desc: 'Aşağıdan yukarı' },
      { id: 'none', name: 'Yok', desc: 'Anında' },
    ],
  },
  {
    key: 'btnStyle', title: 'Buton dolgusu', default: 'filled',
    options: [
      { id: 'filled', name: 'Dolgu', desc: 'Tam renkli' },
      { id: 'soft', name: 'Yumuşak', desc: 'Açık tonlu zemin' },
      { id: 'outline', name: 'Kontur', desc: 'Çerçeveli' },
      { id: 'text', name: 'Yazı', desc: 'Sadece metin' },
    ],
  },
  {
    key: 'btnShape', title: 'Buton köşesi', default: 'template',
    options: [
      { id: 'template', name: 'Şablondan', desc: 'Şablonun köşe değeri' },
      { id: 'pill', name: 'Kapsül', desc: 'Tam yuvarlak' },
      { id: 'soft', name: 'Yumuşak', desc: '12 px' },
      { id: 'sharp', name: 'Keskin', desc: '4 px' },
    ],
  },
];

export const getScreen = (id) => SCREENS.find((s) => s.id === id) || SCREENS[0];

export function defaultLayout() {
  return Object.fromEntries(SCREENS.map((s) => [s.id, s.sections.map((x) => x.id)]));
}
export function defaultHidden() {
  return Object.fromEntries(SCREENS.map((s) => [s.id, []]));
}
export function defaultScreenOpts() {
  return Object.fromEntries(
    SCREENS.map((s) => [s.id, { tone: 'primary', ...Object.fromEntries(s.options.map((o) => [o.key, o.default])) }]),
  );
}
export function defaultUi() {
  return Object.fromEntries(GLOBAL_OPTIONS.map((o) => [o.key, o.default]));
}

/** Kayıtlı düzeni güncel bölüm listesiyle birleştirir (yeni bölümler sona eklenir). */
export function mergeLayout(saved = {}) {
  const def = defaultLayout();
  return Object.fromEntries(
    Object.entries(def).map(([k, ids]) => {
      const s = (saved[k] || []).filter((x) => ids.includes(x));
      return [k, [...s, ...ids.filter((x) => !s.includes(x))]];
    }),
  );
}
