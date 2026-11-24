// İstemci tarafı UX/UI danışmanı: renk, şablon ve logo seçimlerini değerlendirir.
import { contrast, hexToHsl, hueDistance, isDark, luminance, onColor, fixContrast, suggestSurface, mix } from './color.js';
import { getLogoStyle } from '../config/logoStyles.js';
import { getNavMeta } from '../config/components.js';

const fmt = (n) => n.toFixed(2).replace('.', ',');

export function wcagLevel(ratio, large = false) {
  if (large) return ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'Yetersiz';
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Büyük';
  return 'Yetersiz';
}

function hueName(h, s, l) {
  if (s < 12 || l < 8 || l > 95) return 'nötr';
  if (h < 15 || h >= 345) return 'kırmızı';
  if (h < 40) return 'turuncu';
  if (h < 65) return 'sarı';
  if (h < 160) return 'yeşil';
  if (h < 200) return 'turkuaz';
  if (h < 250) return 'mavi';
  if (h < 290) return 'mor';
  return 'pembe';
}

const MOODS = {
  kırmızı: { feel: 'Enerji, aciliyet ve iştah', note: 'Yemek uygulamaları için en güçlü iştah tetikleyicilerinden biri; indirim aciliyetini de iyi taşır.', good: true },
  turuncu: { feel: 'Sıcaklık, samimiyet ve iştah', note: 'Yemek siparişi kategorisinin doğal rengi; dost canlısı ve davetkâr.', good: true },
  sarı: { feel: 'Neşe, hız ve dikkat', note: 'Dikkat çeker ama açık zeminde metin rengi olarak kullanılırsa okunmaz; vurgu olarak ideal.', good: true },
  yeşil: { feel: 'Tazelik, sağlık ve güven', note: 'Sağlıklı/organik konumlanmayı destekler; fast-food enerjisini biraz düşürür.', good: true },
  turkuaz: { feel: 'Ferahlık ve modernlik', note: 'Temiz ve teknolojik bir his verir; sıcak bir vurgu rengiyle iştah tarafını dengelemek gerekir.', good: null },
  mavi: { feel: 'Güven, sakinlik ve kurumsallık', note: 'Mavi iştahı bastıran bir renk olarak bilinir; yemek görsellerinin yanında sıcak bir vurgu rengi şart.', good: false },
  mor: { feel: 'Premium, yaratıcı ve gece', note: 'Lüks ve gece siparişi algısı yaratır; koyu temalarda çok etkili, açık temada ağır kaçabilir.', good: null },
  pembe: { feel: 'Genç, eğlenceli ve tatlı', note: 'Tatlı/kafe odaklı konumlanmaya çok uygun; geniş menülü bir platformda tek düze kalabilir.', good: null },
  nötr: { feel: 'Sade, ciddi ve minimal', note: 'Fotoğrafları öne çıkarır ama marka rengi olmadığı için kampanyalar sönük kalabilir.', good: null },
};

export function evaluate({ colors, template, logo, navId }) {
  const { primary, accent, secondary, bg, surface, text } = colors;
  const dark = isDark(bg);
  let score = 100;
  const notes = []; // { tone: 'good'|'warn'|'bad', title, body, fix?: { key, value, label } }

  /* ---------- Kontrast tablosu ---------- */
  const onP = onColor(primary);
  const contrasts = [
    { id: 'text-bg', label: 'Metin / Zemin', fg: text, bg, ratio: contrast(text, bg), target: 4.5 },
    { id: 'text-surface', label: 'Metin / Kart', fg: text, bg: surface, ratio: contrast(text, surface), target: 4.5 },
    { id: 'btn', label: 'Buton yazısı / Ana renk', fg: onP, bg: primary, ratio: contrast(onP, primary), target: 4.5 },
    { id: 'primary-bg', label: 'Ana renk / Zemin', fg: primary, bg, ratio: contrast(primary, bg), target: 3 },
    { id: 'accent-surface', label: 'Vurgu / Kart', fg: accent, bg: surface, ratio: contrast(accent, surface), target: 3 },
    { id: 'muted', label: 'İkincil metin / Kart', fg: mix(text, bg, 0.42), bg: surface, ratio: contrast(mix(text, bg, 0.42), surface), target: 4.5 },
  ].map((r) => ({ ...r, level: wcagLevel(r.ratio, r.target === 3), pass: r.ratio >= r.target }));

  const tb = contrasts[0].ratio;
  if (tb < 3) {
    score -= 35;
    notes.push({ tone: 'bad', title: 'Metin zeminde kayboluyor', body: `Metin/zemin kontrastı ${fmt(tb)}:1; okunabilirlik için en az 4,5:1 gerekir.`, fix: { key: 'text', value: fixContrast(text, bg, 7), label: 'Metni düzelt' } });
  } else if (tb < 4.5) {
    score -= 20;
    notes.push({ tone: 'warn', title: 'Metin kontrastı sınırda', body: `Metin/zemin ${fmt(tb)}:1. Başlıklar okunur ama küçük gövde metni ve fiyatlar zorlanır.`, fix: { key: 'text', value: fixContrast(text, bg, 7), label: 'Metni koyulaştır' } });
  } else {
    notes.push({ tone: 'good', title: 'Metin okunabilirliği güçlü', body: `Metin/zemin ${fmt(tb)}:1 (${wcagLevel(tb)}). Menü ve fiyatlar rahat okunur.` });
  }

  const ts = contrasts[1].ratio;
  if (ts < 4.5) {
    score -= 12;
    notes.push({ tone: 'warn', title: 'Kart üzerindeki metin zayıf', body: `Kart yüzeyi ile metin arasında ${fmt(ts)}:1 kontrast var. Restoran adları kartta silik görünebilir.`, fix: { key: 'surface', value: suggestSurface(bg), label: 'Kartı ayarla' } });
  }

  const mt = contrasts[5].ratio;
  if (mt < 4.5) {
    score -= mt < 3 ? 8 : 4;
    notes.push({ tone: 'warn', title: 'İkincil metinler (süre, min. sepet) silik', body: `Gri bilgi satırları kartta ${fmt(mt)}:1 kontrastta. Teslimat süresi ve minimum sepet gibi karar verdiren bilgiler için metin rengini koyulaştırmak (açık temada) ya da açmak (koyu temada) gerekir.`, fix: contrast(text, surface) < 12 ? { key: 'text', value: fixContrast(text, surface, 12), label: 'Metni güçlendir' } : undefined });
  }

  // Zemin ve kart ayrışması
  const bsDelta = Math.abs(luminance(bg) - luminance(surface));
  const bsRatio = contrast(bg, surface);
  if (bsRatio < 1.04 && template.surface !== 'outline' && template.surface !== 'elevated') {
    score -= 8;
    notes.push({
      tone: 'warn',
      title: 'Kartlar zeminle birleşiyor',
      body: `Arka plan ile kart yüzeyi neredeyse aynı (${fmt(bsRatio)}:1). Kart sınırları kayboluyor; kart yüzeyini biraz ${dark ? 'açabilirsin' : 'açabilir ya da zemini hafif koyulaştırabilirsin'}.`,
      fix: { key: 'surface', value: suggestSurface(bg), label: 'Kartı aç' },
    });
  } else if (bsDelta > 0.5) {
    score -= 4;
    notes.push({ tone: 'warn', title: 'Kart ve zemin arasında sert geçiş', body: 'Kart yüzeyi zeminden çok farklı; ekran parçalı ve ağır görünebilir. Daha yakın tonlar daha sakin bir hiyerarşi kurar.' });
  } else {
    notes.push({ tone: 'good', title: 'Katman hiyerarşisi dengeli', body: 'Kart yüzeyi zeminden yeterince ayrışıyor; içerik grupları net okunuyor.' });
  }

  // Buton
  const bt = contrasts[2].ratio;
  if (bt < 3) {
    score -= 15;
    notes.push({ tone: 'bad', title: 'Ana renkli butonlar okunmuyor', body: `Ana renk üzerindeki yazı ${fmt(bt)}:1. Ana rengi koyulaştırmak Sepet ve CTA butonlarını kurtarır.`, fix: { key: 'primary', value: fixContrast(primary, onP === '#FFFFFF' ? '#FFFFFF' : '#111113', 4.5), label: 'Ana rengi ayarla' } });
  } else if (bt < 4.5) {
    score -= 6;
    notes.push({ tone: 'warn', title: 'Buton yazısı büyük puntoda okunur', body: `Ana renk / buton yazısı ${fmt(bt)}:1. Kalın ve 16px üstü yazılarda yeterli, küçük etiketlerde zayıf.` });
  }

  const pb = contrasts[3].ratio;
  if (pb < 2) {
    score -= 10;
    notes.push({ tone: 'bad', title: 'Ana renk zeminde eriyor', body: `Ana renk ile zemin arasında yalnızca ${fmt(pb)}:1 fark var; aktif sekme ve ikonlar ayırt edilemez.`, fix: { key: 'primary', value: fixContrast(primary, bg, 3), label: 'Ana rengi güçlendir' } });
  } else if (pb < 3) {
    score -= 5;
    notes.push({ tone: 'warn', title: 'Ana renk zeminde yumuşak kalıyor', body: `Ana renk/zemin ${fmt(pb)}:1. İkon ve ince çizgiler için 3:1 önerilir.`, fix: { key: 'primary', value: fixContrast(primary, bg, 3), label: 'Güçlendir' } });
  }

  /* ---------- Renk ilişkileri ---------- */
  const P = hexToHsl(primary);
  const A = hexToHsl(accent);
  const S = hexToHsl(secondary);
  const B = hexToHsl(bg);
  const pa = hueDistance(P.h, A.h);
  const ps = hueDistance(P.h, S.h);
  const neutralP = P.s < 12;

  let harmony = 'Serbest';
  if (neutralP) harmony = 'Nötr + vurgu';
  else if (pa < 35 && ps < 35) harmony = 'Analog (komşu tonlar)';
  else if (pa > 150) harmony = 'Tamamlayıcı (zıt)';
  else if (Math.abs(pa - 120) < 25 && Math.abs(ps - 120) < 30) harmony = 'Triadik (üçlü)';
  else if (pa > 150 || ps > 150) harmony = 'Bölünmüş tamamlayıcı';
  else if (pa < 35) harmony = 'Analog + destek';

  if (!neutralP && pa > 150 && P.s > 70 && A.s > 70 && Math.abs(P.l - A.l) < 15) {
    score -= 8;
    notes.push({ tone: 'warn', title: 'Ana ve vurgu rengi titreşiyor', body: 'İki doygun zıt renk aynı parlaklıkta; yan yana geldiklerinde göz yorulur ve renkler birbirini boğar. Birinin doygunluğunu veya açıklığını düşür.' });
  } else if (!neutralP && pa < 18 && Math.abs(P.l - A.l) < 12) {
    score -= 6;
    notes.push({ tone: 'warn', title: 'Vurgu rengi ana renkten ayrışmıyor', body: 'Vurgu, ana renge çok yakın; kampanya rozetleri butonlarla karışır. Zıt veya daha açık/koyu bir vurgu dene.' });
  } else {
    notes.push({ tone: 'good', title: `${harmony} renk ilişkisi`, body: pa > 150 ? 'Vurgu rengi ana rengin karşısında; kampanya rozetleri ve puan yıldızları net biçimde öne çıkıyor.' : 'Ana ve vurgu rengi uyumlu bir aile oluşturuyor; ekran bütünlüklü görünüyor.' });
  }

  if (S.s > 75 && S.l > 35 && S.l < 65 && ps > 60) {
    score -= 5;
    notes.push({ tone: 'warn', title: 'Destek rengi ekranı yorabilir', body: 'Destek (ikincil) renk çok doygun ve ana renkten bağımsız; etiket ve rozetlerde sık kullanılırsa ekran kalabalık görünür. Daha soluk bir ton dene.', fix: { key: 'secondary', value: mix(secondary, '#808080', 0.35), label: 'Soldur' } });
  }

  if (contrast(accent, surface) < 2) {
    score -= 5;
    notes.push({ tone: 'warn', title: 'Vurgu rengi kartta görünmüyor', body: 'Puan yıldızı ve kampanya etiketleri kart yüzeyinde kayboluyor. Vurguyu koyulaştırmak işe yarar.', fix: { key: 'accent', value: fixContrast(accent, surface, 3), label: 'Vurguyu ayarla' } });
  }

  // Koyu tema ayrıntıları
  if (dark) {
    if (luminance(bg) < 0.002) {
      score -= 3;
      notes.push({ tone: 'warn', title: 'Saf siyah zemin', body: 'Tam siyah zemin OLED ekranda kaydırırken "smearing" (iz bırakma) yaratır. #0B0B10 gibi hafif açık bir ton daha yumuşak.', fix: { key: 'bg', value: '#0B0B10', label: 'Zemini yumuşat' } });
    }
    if (luminance(text) > 0.95) {
      score -= 3;
      notes.push({ tone: 'warn', title: 'Saf beyaz metin parlıyor', body: 'Koyu zeminde saf beyaz metin hale (halation) etkisi yapar; #EDEDF2 gibi hafif kırık beyaz daha rahat okunur.', fix: { key: 'text', value: '#EDEDF2', label: 'Kırık beyaz' } });
    }
  } else if (B.s > 40 && B.l < 85) {
    score -= 6;
    notes.push({ tone: 'warn', title: 'Zemin rengi çok baskın', body: 'Doygun bir arka plan %60 alanı kaplıyor; yemek fotoğraflarının renklerini bozar. Daha açık/nötr bir zemin önerilir.', fix: { key: 'bg', value: mix(bg, '#FFFFFF', 0.82), label: 'Zemini aç' } });
  }

  /* ---------- Hissiyat ---------- */
  const pName = hueName(P.h, P.s, P.l);
  const mood = { name: pName, ...MOODS[pName] };
  if (mood.good === false) score -= 3;

  /* ---------- 60-30-10 ---------- */
  const ratio = [
    { label: 'Zemin', color: bg, pct: 60 },
    { label: 'Kart / Destek', color: surface, pct: 30 },
    { label: 'Ana + Vurgu', color: primary, pct: 10 },
  ];

  /* ---------- Şablon değerlendirmesi ---------- */
  const tPros = [...template.pros];
  const tCons = [...template.cons];
  if (template.id === 'glass') {
    if (!dark) tCons.unshift('Şu an açık bir zemin kullanılıyor: cam efekti neredeyse görünmüyor. "Gece Neonu" veya "Bordo & Altın" gibi koyu bir palet seç.');
    else tPros.unshift('Koyu palet seçili; cam yüzeyler ve parlak vurgular tam etkisini gösteriyor.');
  }
  if (template.id === 'ios' && P.s > 85 && P.l > 40 && P.l < 60) tCons.unshift('Ana renk iOS minimal dili için fazla doygun; yalnızca aktif durum ve birincil eylemde kullan.');
  if (template.id === 'superapp' && P.s < 35) tCons.unshift('Ana renk solgun; gradyan kampanya bannerları enerjisini kaybediyor. Daha canlı bir ana renk dene.');
  if (template.id === 'superapp' && P.s >= 60) tPros.unshift('Canlı ana renk gradyan bannerlarla birleşince kampanyalar ekranın odak noktası oluyor.');
  if (template.id === 'editorial' && dark) tCons.unshift('Koyu palette krem sıcaklığı kayboluyor; dergi estetiği yerine gece modu havası oluşuyor.');
  if (template.id === 'pdf' && P.s > 40) tPros.unshift('Wireframe yapısı renkli bir ana renkle birleşince taslak, ürüne dönüşmeye başlıyor.');

  /* ---------- Logo değerlendirmesi ---------- */
  const ls = getLogoStyle(logo.styleId);
  const lPros = [...ls.pros];
  const lCons = [...ls.cons];
  if (ls.id === 'gradient' && (contrast(primary, bg) < 2.5 || contrast(accent, bg) < 2)) lCons.unshift('Gradyan renklerinden biri zemine çok yakın; harflerin bir kısmı kayboluyor.');
  if (ls.id === 'pill' && bt < 4.5) lCons.unshift(`Kapsül içindeki yazı ${fmt(bt)}:1 kontrastta; ana rengi koyulaştır.`);
  if (ls.id === 'duo' && contrast(primary, text) < 1.6) lCons.unshift('İki renk birbirine çok yakın; vurgu etkisi oluşmuyor.');
  if (ls.id === 'dot' && contrast(accent, bg) < 2) lCons.unshift('Nokta vurgusu zeminde kayboluyor; daha belirgin bir vurgu rengi seç.');
  if (ls.id === 'script' && logo.caseMode === 'upper') lCons.unshift('El yazısında BÜYÜK HARF okunurluğu ciddi düşürür; "Aa" kullan.');
  if (ls.id === 'tracked' && dark) lPros.unshift('Koyu zeminde ince ve aralıklı harfler zarif bir lüks hissi veriyor.');

  const pair = `${template.id}:${ls.id}`;
  const goodPairs = {
    'editorial:serif': 'Serif wordmark editorial şablonun dergi diliyle birebir örtüşüyor.',
    'pdf:script': 'Taslaktaki el yazısı "Gurme" ruhunu koruyor; PDF referansıyla en tutarlı eşleşme.',
    'pdf:dot': 'Taslaktaki "Gurme ." noktasını marka imzasına dönüştürüyor.',
    'superapp:bold-sans': 'Kalın sans, süper uygulamanın ticari enerjisini taşıyor.',
    'superapp:pill': 'Kapsül logo kampanya rozetleriyle aynı dili konuşuyor.',
    'ios:tracked': 'Geniş aralıklı yazım iOS minimal sadeliğini tamamlıyor.',
    'ios:icon': 'İkon + metin, iOS uygulama ikonu ile başlık arasında güçlü bir bağ kuruyor.',
    'glass:gradient': 'Gradyan wordmark koyu cam zeminde neon gibi parlıyor.',
  };
  const badPairs = {
    'superapp:serif': 'İtalik serif, süper uygulamanın yüksek tempolu ticari diliyle çelişiyor.',
    'superapp:tracked': 'İnce ve aralıklı yazım kalabalık banner ve rozetler arasında kayboluyor.',
    'glass:script': 'El yazısı cam/teknoloji estetiğiyle tonal olarak uyumsuz.',
    'ios:gradient': 'Gradyan logo iOS minimal dilinin sadeliğini bozuyor.',
    'editorial:pill': 'Kapsül rozet editorial şablonun sakin dergi tonuna fazla ticari kaçıyor.',
  };
  if (goodPairs[pair]) lPros.unshift(goodPairs[pair]);
  if (badPairs[pair]) lCons.unshift(badPairs[pair]);

  /* ---------- Alt bar değerlendirmesi ---------- */
  const nm = getNavMeta(navId);
  const nPros = [...(nm.pros || [])];
  const nCons = [...(nm.cons || [])];
  if ((navId === 'glass' || navId === 'dock') && !dark) nCons.unshift('Açık zeminde yarı saydam bar ayrışmıyor; koyu bir palet ya da opak bir bar dene.');
  if (navId === 'glass' && dark) nPros.unshift('Koyu palet seçili; neon cam bar tam etkisini gösteriyor.');
  if (navId === 'floating' && dark) nCons.unshift('Koyu temada "ters renk" ada açık bir blok olarak parlıyor; dikkat dağıtabilir.');
  if (navId === 'brutal' && (template.id === 'ios' || template.id === 'editorial')) nCons.unshift(`${template.name} şablonunun sakin diliyle sert neo-brutal bar çatışıyor.`);
  if (navId === 'brutal' && template.id === 'pdf') nPros.unshift('Taslağın kalın çizgi diliyle aynı ailede; PDF referansına yakışıyor.');
  if (['ios', 'material'].includes(navId) && template.id === 'superapp') nCons.unshift('Süper uygulamanın enerjisine göre standart bar sönük; sepeti öne çıkaran bir tasarım dönüşümü artırır.');
  if (['notch', 'split', 'expand'].includes(navId)) nPros.push('Sepet (ana gelir eylemi) görsel olarak diğer sekmelerden ayrışıyor.');
  if (contrast(primary, bg) < 2.5) nCons.unshift('Ana renk zeminde zayıf; aktif sekme göstergesi zor seçiliyor.');

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    dark,
    contrasts,
    notes,
    harmony,
    mood,
    ratio,
    template: { pros: tPros.slice(0, 4), cons: tCons.slice(0, 4) },
    logo: { pros: lPros.slice(0, 4), cons: lCons.slice(0, 4) },
    nav: { pros: nPros.slice(0, 4), cons: nCons.slice(0, 4) },
  };
}
