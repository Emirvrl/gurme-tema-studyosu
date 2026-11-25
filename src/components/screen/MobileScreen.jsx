import { useEffect, useRef } from 'react';
import { ThemeCtx } from '../../lib/theme.js';
import { AppCtx } from '../../lib/store.js';
import Wordmark from './Wordmark.jsx';
import { StatusBar } from './parts.jsx';
import { BottomNav } from './navs.jsx';
import { Toast } from './ui.jsx';
import { getNavMeta } from '../../config/components.js';
import HomeScreen from './screens/HomeScreen.jsx';
import FoodScreen from './screens/FoodScreen.jsx';
import CartScreen from './screens/CartScreen.jsx';
import OrdersScreen from './screens/OrdersScreen.jsx';
import AccountScreen from './screens/AccountScreen.jsx';

const SCREENS = { home: HomeScreen, food: FoodScreen, cart: CartScreen, orders: OrdersScreen, account: AccountScreen };

/**
 * 390×844 mobil ekran. Alt bardaki her sekme kendi ekranını açar.
 * app: { store, layout, hidden, opts, ui, logo }
 */
export default function MobileScreen({ theme, app }) {
  const { c, t, parts } = theme;
  const screen = app.store.screen;
  const Screen = SCREENS[screen] || HomeScreen;
  const floatingNav = !!getNavMeta(parts.nav).floating;
  const scrollRef = useRef(null);
  const band = screen === 'home' && parts.header === 'band';

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [screen]);

  const logoColors = band ? { ...c, text: c.onPrimary, primary: c.accent, bg: c.primary } : c;
  const logoEl = <Wordmark styleId={app.logo.styleId} name="Gurme" caseMode={app.logo.caseMode} icon={app.logo.icon} c={logoColors} maxWidth={150} />;
  const anim = { slide: 'gurme-screen-slide', fade: 'gurme-screen-fade', rise: 'gurme-screen-rise' }[app.ui.transition];
  const pageBand = screen !== 'home' && app.ui.pageHeader === 'band';

  return (
    <ThemeCtx.Provider value={theme}>
      <AppCtx.Provider value={app}>
        <div className="relative overflow-hidden" style={{ width: 390, height: 844, background: theme.screenBg, color: c.text, fontFamily: t.fonts.body }}>
          <div ref={scrollRef} className="no-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: floatingNav ? 136 : 120 }}>
            <StatusBar band={band || pageBand} />
            <div key={screen} style={anim ? { animation: `${anim} .38s cubic-bezier(.2,.8,.2,1)` } : undefined}>
              <Screen logoEl={logoEl} />
            </div>
          </div>
          <Toast />
          <BottomNav />
        </div>
      </AppCtx.Provider>
    </ThemeCtx.Provider>
  );
}
