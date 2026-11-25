import { useT } from '../../../lib/theme.js';
import { useApp } from '../../../lib/store.js';
import { CAMPAIGNS, CUISINES, RESTAURANTS } from '../../../config/content.js';
import { Header, SearchBar, SectionHeader, CuisineRow, RestaurantCard } from '../parts.jsx';
import { CampaignCarousel } from '../carousel.jsx';

/** Anasayfa: başlık sabit, diğer bölümlerin sırası panelden değişir. */
export default function HomeScreen({ logoEl }) {
  const T = useT();
  const { store, layout, hidden } = useApp();
  const { c, parts } = T;
  const editorial = parts.section === 'editorial';
  const listDividers = parts.restaurant === 'list';

  const blocks = {
    search: (
      <div onClick={() => store.navigate('food')} style={{ cursor: 'pointer' }}>
        <SearchBar />
      </div>
    ),
    campaigns: <CampaignCarousel items={CAMPAIGNS} />,
    cuisines: (
      <>
        <SectionHeader title="Mutfaklar" action="Tümünü gör" eyebrow="Ne yesem?" />
        <div style={{ height: 12 }} />
        <CuisineRow
          items={CUISINES}
          onPick={(id) => {
            store.set('cuisine', id);
            store.navigate('food');
          }}
        />
      </>
    ),
    restaurants: (
      <>
        <SectionHeader title="Restoranlar" action={editorial ? 'Sırala' : null} eyebrow="Yakınındakiler" />
        <div style={{ height: 14 }} />
        <div className="flex flex-col" style={{ gap: listDividers ? 0 : editorial ? 26 : 18 }}>
          {RESTAURANTS.map((r, i) => (
            <div key={r.id} onClick={() => store.notify(`${r.name} menüsü (temsili)`)} style={{ cursor: 'pointer' }}>
              {listDividers && i > 0 && <div style={{ height: 0.5, background: c.hairline, margin: '18px 16px' }} />}
              <RestaurantCard r={r} />
            </div>
          ))}
        </div>
      </>
    ),
  };

  return (
    <>
      <Header logo={logoEl} />
      <div style={{ height: 4 }} />
      <div className="flex flex-col" style={{ gap: editorial ? 28 : 22 }}>
        {layout.home.filter((id) => !hidden.home.includes(id)).map((id) => (
          <div key={id}>{blocks[id]}</div>
        ))}
      </div>
    </>
  );
}
