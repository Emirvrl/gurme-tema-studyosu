// Bileşen kayıt defteri: her ekran parçasının bağımsız seçilebilen varyantları.
// "Bileşenler" sekmesi bu listeyi okur; null seçimi "şablondan gelsin" demektir.
// Yeni varyant: ilgili listeye ekle + src/components/screen/parts.jsx içinde çiz.

export const HEADER_VARIANTS = [
  { id: 'rule', name: 'Taslak çizgi', desc: 'Altı kalın çizgili, çerçeveli adres' },
  { id: 'plain', name: 'Sade kapsül', desc: 'Gri dolgu, ince ikon' },
  { id: 'bold', name: 'Renkli kapsül', desc: 'Ana renk tonunda adres' },
  { id: 'glass', name: 'Cam kapsül', desc: 'Yarı saydam yüzey' },
  { id: 'editorial', name: 'Metin bağlantısı', desc: 'Kutusuz, italik ve altı noktalı' },
  { id: 'band', name: 'Renkli bant', desc: 'Ana renkli üst bant, beyaz logo' },
];

export const SEARCH_VARIANTS = [
  { id: 'outline', name: 'Çerçeveli', desc: 'Taslaktaki gibi kalın çizgi' },
  { id: 'ios', name: 'iOS dolgu', desc: 'Kısa, gri dolgulu' },
  { id: 'material', name: 'Material', desc: 'Uzun kapsül, mikrofon' },
  { id: 'bold', name: 'Filtre butonlu', desc: 'Gölgeli kutu + renkli filtre' },
  { id: 'glass', name: 'Cam', desc: 'Bulanık yüzey' },
  { id: 'editorial', name: 'Serif', desc: 'İtalik yer tutucu' },
];

export const BANNER_VARIANTS = [
  { id: 'peek', name: 'Taslak kutu', desc: 'Metin solda, görsel sağda' },
  { id: 'ios', name: 'Tam görsel', desc: 'Fotoğraf üstünde sade metin' },
  { id: 'bold', name: 'Gradyan + rozet', desc: 'Büyük indirim rakamı, CTA' },
  { id: 'glass', name: 'Cam panel', desc: 'Görsel üstünde cam bilgi kutusu' },
  { id: 'editorial', name: 'Dergi kapağı', desc: 'Uzun görsel, serif başlık' },
];

export const BANNER_ANIMATIONS = [
  { id: 'stack', name: 'Deste', desc: 'Kartlar üst üste; öndeki sola süzülüp destenin arkasına geçer' },
  { id: 'slide', name: 'Kaydır', desc: 'Klasik yatay kaydırma, kartlar ekran dışında bekler' },
  { id: 'coverflow', name: 'Coverflow 3D', desc: 'Yan kartlar perspektifle döner, öndeki büyür' },
  { id: 'fade', name: 'Solma + Zoom', desc: 'Yerinde çapraz geçiş, hafif yakınlaşma' },
  { id: 'swipe', name: 'Fırlat', desc: 'Öndeki kart eğilerek sola fırlar, arkadaki öne gelir' },
];

export const CUISINE_VARIANTS = [
  { id: 'cutout', name: 'Zeminsiz', desc: 'Sadece görsel, altında yazı' },
  { id: 'tile', name: 'Kare kutu', desc: 'Yuvarlatılmış kare zemin' },
  { id: 'materialTile', name: 'Tonlu kutu', desc: 'Material ton zemini' },
  { id: 'bubble', name: 'Renkli balon', desc: 'Dönüşümlü renkli daireler' },
  { id: 'glow', name: 'Işıklı halka', desc: 'Gradyan halka çerçeve' },
  { id: 'arch', name: 'Kemer', desc: 'Uzun kemer formu' },
];

export const CUISINE_IMAGE_MODES = [
  { id: 'photo', name: 'Fotoğraf', desc: 'Gerçek yemek fotoğrafı' },
  { id: 'png3d', name: '3D PNG', desc: 'Şeffaf zeminli 3D görsel' },
  { id: 'color', name: 'Renkli PNG', desc: 'Şeffaf, gradyanlı çizim' },
  { id: 'flat', name: 'Düz PNG', desc: 'Şeffaf, düz renkli çizim' },
];

export const RESTAURANT_VARIANTS = [
  { id: 'dashed', name: 'Taslak kart', desc: 'Görsel + kesikli bilgi kutusu' },
  { id: 'list', name: 'Liste', desc: 'Kutusuz, ayraçlı' },
  { id: 'promo', name: 'Promosyon', desc: 'Rozetli, gölgeli kart' },
  { id: 'glass', name: 'Cam kart', desc: 'Işıklı rozet' },
  { id: 'cover', name: 'Kapak', desc: 'Görsel üstünde serif isim' },
];

// floating: alt bar ekran içeriğinin üstünde süzülüyorsa (içerik altına ekstra boşluk bırakılır)
export const NAV_VARIANTS = [
  {
    id: 'arch', name: 'Taslak Kemer', desc: 'PDF’teki kavisli sepet',
    pros: ['Taslağa birebir sadık; sepet her zaman merkezde.', 'Dikey ayraçlar bölümleri net ayırır.'],
    cons: ['Çizgiler ve kemer görsel olarak ağır; modern hissi zayıf.'],
  },
  {
    id: 'ios', name: 'iOS Tab Bar', desc: 'Buzlu cam, ikon + etiket',
    pros: ['iPhone kullanıcısına tanıdık; öğrenme maliyeti sıfır.', 'Buzlu zemin içerik akışını kesmiyor.'],
    cons: ['Sepet diğer sekmelerle eşit ağırlıkta; ana eylem öne çıkmıyor.'],
  },
  {
    id: 'material', name: 'Material 3', desc: 'Aktif sekmede ton kapsülü',
    pros: ['Android standardı; aktif sekme kapsülle çok net.', 'Dokunma alanları geniş.'],
    cons: ['iOS’ta yabancı durur; yükseklik fazla.'],
  },
  {
    id: 'neutral', name: 'Ortak Yükseltilmiş', desc: 'Ortada yükselen yuvarlak sepet',
    pros: ['Her iki platformda da doğal; sepet ana eylem olarak yükseltilmiş.'],
    cons: ['Yaygın bir kalıp; markaya özgü değil.'],
  },
  {
    id: 'floating', name: 'Koyu Ada', desc: 'Süzülen koyu bar, delen sepet',
    floating: true,
    pros: ['Yüksek kontrastlı ada, ekranın en güçlü çapası.', 'Taşan sepet butonu dönüşümü artırır.'],
    cons: ['Koyu blok açık temada ağır kaçabilir.'],
  },
  {
    id: 'glass', name: 'Neon Cam', desc: 'Cam ada, parlayan sepet',
    floating: true,
    pros: ['Koyu temada çok etkileyici, modern.'],
    cons: ['Açık zeminde cam etkisi kaybolur; bulanıklık performans ister.'],
  },
  {
    id: 'editorial', name: 'Dergi Sekmeleri', desc: 'Sadece yazı, nokta gösterge',
    pros: ['Sakin ve zarif; içerik ön planda.'],
    cons: ['İkon olmadığı için hızlı tarama zorlaşır.'],
  },
  {
    id: 'notch', name: 'Oyuklu Dock', desc: 'Bar ortasında oyuk, içine oturan sepet',
    pros: ['Sepeti fiziksel bir yuvaya yerleştirir; akılda kalıcı form.', 'Bar ile buton tek bir parça gibi okunur.'],
    cons: ['Özel şekil; farklı ekran genişliklerinde dikkatli uygulanmalı.'],
  },
  {
    id: 'expand', name: 'Genişleyen Kapsül', desc: 'Aktif sekme yazıyla açılır, diğerleri ikon',
    floating: true,
    pros: ['Aktif konum çok net; boşluk verimli kullanılır.', 'Canlı ve oyuncu bir etkileşim hissi.'],
    cons: ['Pasif sekmelerde etiket yok; ilk kullanımda tahmin gerektirir.'],
  },
  {
    id: 'split', name: 'İkiz Ada', desc: 'Menü ve sepet ayrı adalarda',
    floating: true,
    pros: ['Sepet bağımsız bir ada; tutarı da gösterebilir.', 'Başparmak menzilinde büyük bir hedef.'],
    cons: ['İki ayrı ada küçük ekranda kalabalık görünebilir.'],
  },
  {
    id: 'topline', name: 'Üst Çizgi', desc: 'Aktif sekmenin üstünde çizgi, sepet etiket olarak',
    pros: ['Çok hafif ve minimal; içerikle yarışmaz.', 'Sepet sayısı metin olarak açıkça yazılı.'],
    cons: ['Sepet görsel olarak öne çıkmaz; dönüşüm için zayıf.'],
  },
  {
    id: 'brutal', name: 'Neo-Brutal', desc: 'Kalın çerçeve, sert gölge',
    floating: true,
    pros: ['Çok özgün, genç ve cesur bir marka kişiliği.', 'Taslaktaki kalın çizgi diliyle akraba.'],
    cons: ['Premium ya da sakin bir marka için fazla gürültülü.'],
  },
  {
    id: 'dock', name: 'Squircle Dock', desc: 'Kare-yuvarlak ikon kutuları, aktif büyür',
    floating: true,
    pros: ['Uygulama ikonu estetiği; dokunsal ve renkli.', 'Aktif sekme büyüyerek net vurgulanır.'],
    cons: ['Etiketsiz ikonlar ilk bakışta anlaşılmayabilir.'],
  },
  {
    id: 'segmented', name: 'Hap Sekmeler', desc: 'Segment kontrol, aktif dolu kapsül',
    floating: true,
    pros: ['Aktif sekme yüzey rengiyle çok net; modern ve derli toplu.'],
    cons: ['Sepet diğer sekmelerle eşit; ana eylem öne çıkmaz.'],
  },
  {
    id: 'fab', name: 'Sağ FAB', desc: 'Sepet sağda süzülen geniş buton',
    floating: true,
    pros: ['Sepet her ekranda başparmağın altında; dönüşüm odaklı.', 'Material dilinde tanıdık bir kalıp.'],
    cons: ['FAB içeriğin bir kısmını kapatır; ekstra alt boşluk gerekir.'],
  },
  {
    id: 'iconDot', name: 'İkon + Nokta', desc: 'Etiketsiz ikonlar, uzayan nokta',
    pros: ['Çok sade ve sakin; içerik ön planda.', 'Sepet sayısı ikonun yanında yazılı.'],
    cons: ['Etiket olmadığı için yeni kullanıcılar zorlanabilir.'],
  },
  {
    id: 'gradient', name: 'Gradyan Şerit', desc: 'Ana → vurgu gradyanlı ada',
    floating: true,
    pros: ['Markanın renklerini her ekranın altında taşır; enerjik.'],
    cons: ['Renkli blok içerikle yarışabilir; gradyan renkleri iyi seçilmeli.'],
  },
  {
    id: 'bubble', name: 'Kabarcık', desc: 'Aktif ikon yukarı taşan daireye kayar',
    pros: ['Animasyonlu ve akılda kalıcı; aktif sekme çok belirgin.'],
    cons: ['Hareket fazla oyuncu bulunabilir; kurumsal markalar için riskli.'],
  },
  {
    id: 'outlineBox', name: 'Kontur Kutu', desc: 'Çerçeveli kutular, aktif dolu',
    pros: ['Taslağın kalın çizgi diline yakın; net dokunma alanları.'],
    cons: ['Beş kutu yan yana kalabalık görünebilir.'],
  },
  {
    id: 'slider', name: 'Kayan Çizgi', desc: 'Üstte aktif sekmeye kayan çizgi',
    pros: ['Hafif ve zarif; geçişte çizgi kayarak yön hissi verir.'],
    cons: ['Sepet görsel olarak öne çıkmaz.'],
  },
  {
    id: 'folder', name: 'Klasör Sekmeleri', desc: 'Aktif sekme klasör kulağı gibi yükselir',
    pros: ['Özgün ve dokunsal; aktif sekme sayfayla birleşir.'],
    cons: ['Gömme zemin rengi koyu temada dikkat ister.'],
  },
];

export const getNavMeta = (id) => NAV_VARIANTS.find((n) => n.id === id) || NAV_VARIANTS[0];

/** Bileşenler sekmesinin bölümleri. key: parts anahtarı. */
export const COMPONENT_GROUPS = [
  { key: 'header', title: 'Üst başlık & adres', options: HEADER_VARIANTS },
  { key: 'search', title: 'Arama çubuğu', options: SEARCH_VARIANTS },
  { key: 'banner', title: 'Kampanya kart stili', options: BANNER_VARIANTS },
  { key: 'cuisine', title: 'Mutfak kutusu', options: CUISINE_VARIANTS },
  { key: 'restaurant', title: 'Restoran kartı', options: RESTAURANT_VARIANTS },
];
