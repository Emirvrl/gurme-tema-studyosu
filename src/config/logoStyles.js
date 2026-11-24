// Sol üst uygulama ismi (wordmark) stil kayıt defteri.
// Görsel çizim src/components/screen/Wordmark.jsx içinde `id` ile eşleşir.
// widthFactor: harf başına yaklaşık genişlik çarpanı (uzun isimlerde otomatik küçültme için).

export const LOGO_STYLES = [
  {
    id: 'bold-sans',
    name: 'Kalın Modern Sans',
    desc: 'Sıkı harf aralıklı, ekstra kalın',
    widthFactor: 0.62,
    pros: ['Küçük boyutta bile çok net okunur.', 'Modern, güven veren ve teknoloji odaklı bir marka algısı.'],
    cons: ['Ayırt edici değil; rakip uygulamalarla karışma riski.'],
  },
  {
    id: 'duo',
    name: 'İki Renkli Vurgu',
    desc: 'İsmin ikinci kısmı ana renkte',
    widthFactor: 0.6,
    pros: ['İsmin bir kısmını vurgulayarak akılda kalıcılığı artırır.', 'Ana rengi markaya bağlar; renk = marka eşleşmesi kurar.'],
    cons: ['Bölme noktası anlamsız olursa isim iki kelime gibi okunabilir.'],
  },
  {
    id: 'icon',
    name: 'İkon + Metin',
    desc: 'Minimal marka işaretiyle',
    widthFactor: 0.6,
    extraWidth: 34,
    pros: ['İkon tek başına uygulama ikonu ve bildirim için de kullanılabilir.', 'Ne iş yaptığını (yemek/teslimat) anında anlatır.'],
    cons: ['Dar başlıkta en çok yer kaplayan stil; adres alanını daraltır.'],
  },
  {
    id: 'pill',
    name: 'Kapsül (Pill) Rozet',
    desc: 'Ana renkli kapsül içinde isim',
    widthFactor: 0.6,
    extraWidth: 28,
    pros: ['Üst alanda en yüksek görsel ağırlık; marka asla kaybolmaz.', 'Buton/rozet diliyle tutarlı, ticari ve enerjik.'],
    cons: ['Tıklanabilir bir buton sanılabilir.', 'Ana renk ile metin kontrastı zayıfsa okunurluk düşer.'],
  },
  {
    id: 'serif',
    name: 'Zarif Serif',
    desc: 'İtalik, gurme restoran havası',
    widthFactor: 0.56,
    pros: ['"Gurme" kelimesinin çağrıştırdığı kalite ve zanaati güçlendirir.', 'Editoryal ve premium şablonlarla mükemmel uyum.'],
    cons: ['Hızlı teslimat/indirim iletişimiyle tonal çatışma yaratabilir.', 'Çok küçük boyutta ince serifler kaybolur.'],
  },
  {
    id: 'tracked',
    name: 'Geniş Aralıklı',
    desc: 'Tracked-out minimalist büyük harf',
    widthFactor: 0.95,
    pros: ['Moda ve lüks markaları çağrıştıran sakin, minimalist duruş.', 'Yatay ritmi ile başlığı düzenli gösterir.'],
    cons: ['Uzun isimlerde çok yer kaplar ve otomatik küçülür.', 'İnce ağırlık açık zeminde silik kalabilir.'],
  },
  {
    id: 'gradient',
    name: 'Gradyan Wordmark',
    desc: 'Ana → vurgu renk geçişli',
    widthFactor: 0.62,
    pros: ['Paletin tamamını tek bir logoda taşır; dinamik ve genç.', 'Koyu temalarda neon etkisiyle çok dikkat çeker.'],
    cons: ['Renkler zeminle yakınsa harflerin bir kısmı kaybolur.', 'Tek renkli baskı ve bildirimlerde karşılığı zayıftır.'],
  },
  {
    id: 'dot',
    name: 'Noktalı İmza',
    desc: 'Taslaktaki "Gurme ." vurgusu',
    widthFactor: 0.6,
    extraWidth: 10,
    pros: ['Taslaktaki noktayı marka imzasına dönüştürür; vurgu rengiyle akılda kalır.', 'Sade ama karakterli; her şablona uyar.'],
    cons: ['Nokta çok küçük kalırsa noktalama hatası gibi algılanabilir.'],
  },
  {
    id: 'script',
    name: 'El Yazısı',
    desc: 'Taslaktaki el çizimine selam',
    widthFactor: 0.48,
    pros: ['Samimi, ev yemeği sıcaklığı; insani bir dokunuş.', 'Taslaktaki el yazısı logonun ruhunu korur.'],
    cons: ['Büyük harf kullanımında okunurluk ciddi düşer.', 'Kurumsal güven algısı diğer stillere göre zayıf.'],
  },
];

export const LOGO_CASES = [
  { id: 'original', label: 'Aa', title: 'Yazıldığı gibi' },
  { id: 'upper', label: 'AA', title: 'BÜYÜK HARF' },
  { id: 'lower', label: 'aa', title: 'küçük harf' },
];

export const LOGO_ICONS = [
  { id: 'pin', label: 'Gurme işareti' },
  { id: 'utensils', label: 'Çatal-bıçak' },
  { id: 'chef', label: 'Şef şapkası' },
  { id: 'flame', label: 'Alev' },
  { id: 'bag', label: 'Paket' },
];

export const DEFAULT_APP_NAME = 'Gurme';

export const getLogoStyle = (id) => LOGO_STYLES.find((s) => s.id === id) || LOGO_STYLES[0];

export function applyCase(name, mode) {
  if (mode === 'upper') return name.toLocaleUpperCase('tr-TR');
  if (mode === 'lower') return name.toLocaleLowerCase('tr-TR');
  return name;
}
