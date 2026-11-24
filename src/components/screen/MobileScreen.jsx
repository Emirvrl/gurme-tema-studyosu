import { ThemeCtx } from '../../lib/theme.js';
import { CAMPAIGNS, CUISINES, RESTAURANTS } from '../../config/content.js';
import Wordmark from './Wordmark.jsx';
import { StatusBar, Header, SearchBar, SectionHeader, CuisineRow, RestaurantCard } from './parts.jsx';
import { CampaignCarousel } from './carousel.jsx';
import { BottomNav } from './navs.jsx';
import { getNavMeta } from '../../config/components.js';

/**
 * 390×844 mobil ekran. Yerleşim sabittir:
 * durum çubuğu → logo + adres → arama → kampanyalar → mutfaklar → restoranlar → alt menü
 */
export default function MobileScreen({ theme, logo }) {
  const { c, t, parts } = theme;
  const editorial = parts.section === 'editorial';
  const listDividers = parts.restaurant === 'list';
  const floatingNav = !!getNavMeta(parts.nav).floating;

  return (
    <ThemeCtx.Provider value={theme}>
      <div className="relative overflow-hidden" style={{ width: 390, height: 844, background: theme.screenBg, color: c.text, fontFamily: t.fonts.body }}>
        <div className="no-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: floatingNav ? 130 : 116 }}>
          <StatusBar />
          <Header logo={<Wordmark styleId={logo.styleId} name="Gurme" caseMode={logo.caseMode} icon={logo.icon} c={c} maxWidth={150} />} />
          <div style={{ height: editorial ? 6 : 4 }} />
          <SearchBar />
          <div style={{ height: editorial ? 22 : 18 }} />
          <CampaignCarousel items={CAMPAIGNS} />
          <div style={{ height: editorial ? 30 : 22 }} />
          <SectionHeader title="Mutfaklar" action="Tümünü gör" eyebrow="Ne yesem?" />
          <div style={{ height: 12 }} />
          <CuisineRow items={CUISINES} />
          <div style={{ height: editorial ? 34 : 26 }} />
          <SectionHeader title="Restoranlar" action={editorial ? 'Sırala' : null} eyebrow="Yakınındakiler" />
          <div style={{ height: 14 }} />
          <div className="flex flex-col" style={{ gap: listDividers ? 0 : editorial ? 26 : 18 }}>
            {RESTAURANTS.map((r, i) => (
              <div key={r.id}>
                {listDividers && i > 0 && <div style={{ height: 0.5, background: c.hairline, margin: '18px 16px' }} />}
                <RestaurantCard r={r} />
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    </ThemeCtx.Provider>
  );
}
