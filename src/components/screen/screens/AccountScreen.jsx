import { ChevronRight, Crown, Wallet, Ticket, LogOut, Pencil, MapPin, CreditCard, Heart, Bell, Mail, Globe, LifeBuoy, ShieldCheck, Circle } from 'lucide-react';

const Icons = { MapPin, CreditCard, Heart, Ticket, Bell, Mail, Globe, LifeBuoy, ShieldCheck, Circle };
import { useT } from '../../../lib/theme.js';
import { useApp } from '../../../lib/store.js';
import { ACCOUNT } from '../../../config/content.js';
import { getScreen } from '../../../config/screens.js';
import { PageHeader, Btn, toneColors } from '../ui.jsx';
import { rgba, mix, onColor } from '../../../lib/color.js';

function Avatar({ size = 64, ring }) {
  const T = useT();
  const { opts } = useApp();
  const tc = toneColors(T.c, opts.account.tone);
  return (
    <span className="flex shrink-0 items-center justify-center" style={{ width: size, height: size, borderRadius: 999, background: `linear-gradient(135deg, ${tc.bg}, ${mix(tc.bg, T.c.accent, 0.6)})`, color: tc.fg, fontWeight: 800, fontSize: size * 0.34, border: ring ? `4px solid ${T.c.bg}` : 'none' }}>
      {ACCOUNT.initials}
    </span>
  );
}

function StatsRow({ invert }) {
  const T = useT();
  const { c, t } = T;
  return (
    <div className="grid grid-cols-3" style={{ gap: 8 }}>
      {ACCOUNT.stats.map((s) => (
        <div key={s.label} className="text-center" style={{ padding: '8px 4px', borderRadius: 12, background: invert ? rgba('#FFFFFF', 0.14) : c.fill }}>
          <div style={{ fontFamily: t.fonts.head, fontWeight: t.headWeight, fontSize: 17, color: invert ? '#fff' : c.text }}>{s.value}</div>
          <div style={{ fontSize: 11, color: invert ? 'rgba(255,255,255,.8)' : c.muted }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Profile() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const v = opts.account.profile;
  const tc = toneColors(c, opts.account.tone);
  const head = { fontFamily: t.fonts.head, fontWeight: t.headWeight, color: c.text };
  const edit = <Btn size="sm" variant="alt" tone={opts.account.tone} icon={Pencil} onClick={() => store.notify('Profil düzenleme (temsili)')}>Düzenle</Btn>;

  if (v === 'cover') {
    return (
      <div style={{ padding: '0 16px' }}>
        <div className="relative overflow-hidden" style={{ borderRadius: t.radius.card, background: `linear-gradient(135deg, ${tc.bg}, ${mix(tc.bg, c.accent, 0.55)})`, padding: '18px 16px 16px', color: tc.fg }}>
          <span className="absolute" style={{ right: -40, top: -40, width: 150, height: 150, borderRadius: 999, background: 'rgba(255,255,255,.12)' }} />
          <div className="relative flex items-center" style={{ gap: 14 }}>
            <span className="flex shrink-0 items-center justify-center" style={{ width: 62, height: 62, borderRadius: 999, background: 'rgba(255,255,255,.22)', fontWeight: 800, fontSize: 21, border: '2px solid rgba(255,255,255,.5)' }}>{ACCOUNT.initials}</span>
            <div className="min-w-0">
              <div className="truncate" style={{ fontFamily: t.fonts.head, fontWeight: t.headWeight, fontSize: 20 }}>{ACCOUNT.name}</div>
              <div className="truncate" style={{ fontSize: 12.5, opacity: 0.85 }}>{ACCOUNT.email}</div>
            </div>
          </div>
          <div className="relative" style={{ marginTop: 16 }}>
            <StatsRow invert />
          </div>
        </div>
      </div>
    );
  }
  if (v === 'centered') {
    return (
      <div className="flex flex-col items-center text-center" style={{ padding: '0 16px', gap: 8 }}>
        <Avatar size={88} />
        <div style={{ ...head, fontSize: 21 }}>{ACCOUNT.name}</div>
        <div style={{ fontSize: 12.5, color: c.muted, marginTop: -6 }}>{ACCOUNT.email}</div>
        {edit}
        <div className="w-full" style={{ marginTop: 6 }}><StatsRow /></div>
      </div>
    );
  }
  if (v === 'minimal') {
    return (
      <div className="flex items-end justify-between" style={{ padding: '0 18px', gap: 10 }}>
        <div className="min-w-0">
          <div className="truncate" style={{ ...head, fontSize: 24, letterSpacing: '-0.02em' }}>Merhaba, {ACCOUNT.name.split(' ')[0]}</div>
          <div className="truncate" style={{ fontSize: 12.5, color: c.muted }}>{ACCOUNT.email}</div>
        </div>
        {edit}
      </div>
    );
  }
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ ...T.surf('card'), padding: 14 }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <Avatar size={56} />
          <div className="min-w-0 flex-1">
            <div className="truncate" style={{ ...head, fontSize: 17 }}>{ACCOUNT.name}</div>
            <div className="truncate" style={{ fontSize: 12, color: c.muted }}>{ACCOUNT.email}</div>
          </div>
          {edit}
        </div>
        <div style={{ marginTop: 12 }}><StatsRow /></div>
      </div>
    </div>
  );
}

function Membership() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const dark = mix(c.text, '#000000', 0.3);
  return (
    <div style={{ padding: '0 16px' }}>
      <div className="relative flex items-center overflow-hidden" style={{ gap: 12, padding: 16, borderRadius: t.radius.card, background: `linear-gradient(120deg, ${T.dark ? mix(c.surface, '#000000', 0.2) : dark}, ${mix(T.dark ? c.surface : dark, c.accent, 0.35)})`, color: '#fff' }}>
        <span className="flex shrink-0 items-center justify-center" style={{ width: 42, height: 42, borderRadius: 14, background: c.accent, color: toneColors(c, 'accent').fg }}>
          <Crown size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div style={{ fontFamily: t.fonts.head, fontWeight: t.headWeight, fontSize: 15.5 }}>{ACCOUNT.plus.title}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{ACCOUNT.plus.desc}</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{ACCOUNT.plus.renew}</div>
        </div>
        <Btn size="sm" tone="accent" onClick={() => store.notify('Üyelik yönetimi (temsili)')}>Yönet</Btn>
      </div>
    </div>
  );
}

function WalletRow() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const tc = toneColors(c, opts.account.tone);
  const tiles = [
    { Icon: Wallet, k: 'Gurme Cüzdan', v: ACCOUNT.wallet, a: 'Para yükle' },
    { Icon: Ticket, k: 'Kuponlarım', v: `${ACCOUNT.coupons} aktif`, a: 'Gör' },
  ];
  return (
    <div className="grid grid-cols-2" style={{ gap: 10, padding: '0 16px' }}>
      {tiles.map(({ Icon, k, v, a }) => (
        <button key={k} onClick={() => store.notify(`${k} (temsili)`)} className="text-left" style={{ ...T.surf('card'), padding: 14 }}>
          <Icon size={20} color={tc.bg} />
          <div style={{ fontSize: 12, color: c.muted, marginTop: 8 }}>{k}</div>
          <div style={{ fontFamily: t.fonts.head, fontWeight: t.headWeight, fontSize: 18, color: c.text }}>{v}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.dark ? tc.bg : mix(tc.bg, c.text, 0.2), marginTop: 4 }}>{a} →</div>
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, tone }) {
  const T = useT();
  const tc = toneColors(T.c, tone);
  return (
    <span className="relative inline-block shrink-0" style={{ width: 44, height: 26, borderRadius: 99, background: on ? tc.bg : T.c.fill, transition: 'background .2s', boxShadow: on ? 'none' : `inset 0 0 0 1px ${T.c.hairline}` }}>
      <span className="absolute" style={{ top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 99, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'left .2s' }} />
    </span>
  );
}

function MenuIcon({ name, idx }) {
  const T = useT();
  const { opts } = useApp();
  const { c } = T;
  const Icon = Icons[name] || Icons.Circle;
  const v = opts.account.icons;
  const palette = [c.primary, c.accent, c.secondary];
  const base = opts.account.tone === 'mono' ? c.text : palette[idx % 3];
  if (v === 'mono') return <Icon size={19} color={c.text} strokeWidth={1.9} />;
  const filled = v === 'filled';
  return (
    <span className="flex shrink-0 items-center justify-center" style={{ width: 32, height: 32, borderRadius: 10, background: filled ? base : mix(base, c.bg, 0.85), color: filled ? onColor(base) : mix(base, c.text, T.dark ? 0 : 0.15) }}>
      <Icon size={16} strokeWidth={2.2} />
    </span>
  );
}

function Menu() {
  const T = useT();
  const { store, opts } = useApp();
  const { c, t } = T;
  const v = opts.account.menu;
  let n = 0;

  const rowContent = (it, idx) => (
    <>
      <MenuIcon name={it.icon} idx={idx} />
      <span className="min-w-0 flex-1 truncate" style={{ fontSize: 14, color: c.text }}>{it.label}</span>
      {it.toggle ? <Toggle on={store.settings[it.id]} tone={opts.account.tone} /> : (
        <>
          {it.value && <span style={{ fontSize: 12.5, color: c.muted }}>{it.value}</span>}
          <ChevronRight size={17} color={c.muted} />
        </>
      )}
    </>
  );
  const act = (it) => (it.toggle ? store.toggleSetting(it.id) : store.notify(`${it.label} (temsili)`));

  if (v === 'tiles') {
    const all = ACCOUNT.groups.flatMap((g) => g.items);
    return (
      <div className="grid grid-cols-2" style={{ gap: 10, padding: '0 16px' }}>
        {all.map((it, i) => (
          <button key={it.id} onClick={() => act(it)} className="flex flex-col items-start text-left" style={{ ...T.surf('card'), padding: 14, gap: 10 }}>
            <div className="flex w-full items-center justify-between">
              <MenuIcon name={it.icon} idx={i} />
              {it.toggle && <Toggle on={store.settings[it.id]} tone={opts.account.tone} />}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: c.text }}>{it.label}</div>
              {it.value && <div style={{ fontSize: 11.5, color: c.muted }}>{it.value}</div>}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: 18 }}>
      {ACCOUNT.groups.map((g) => (
        <div key={g.title}>
          <div style={{ padding: '0 20px 8px', fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.muted }}>{g.title}</div>
          {v === 'cards' ? (
            <div className="flex flex-col" style={{ gap: 8, padding: '0 16px' }}>
              {g.items.map((it) => (
                <button key={it.id} onClick={() => act(it)} className="flex items-center text-left" style={{ ...T.surf('control'), gap: 12, padding: '12px 14px' }}>
                  {rowContent(it, n++)}
                </button>
              ))}
            </div>
          ) : (
            <div style={v === 'grouped' ? { margin: '0 16px', ...T.surf('card'), overflow: 'hidden' } : { borderTop: `1px solid ${c.hairline}`, borderBottom: `1px solid ${c.hairline}` }}>
              {g.items.map((it, i) => (
                <button key={it.id} onClick={() => act(it)} className="flex w-full items-center text-left" style={{ gap: 12, padding: v === 'grouped' ? '11px 14px' : '13px 20px', borderTop: i ? `1px solid ${c.hairline}` : 'none' }}>
                  {rowContent(it, n++)}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AccountScreen() {
  const T = useT();
  const { store, layout, hidden } = useApp();
  const meta = getScreen('account');
  const blocks = {
    profile: <Profile />,
    membership: <Membership />,
    wallet: <WalletRow />,
    menu: <Menu />,
    logout: (
      <div className="flex justify-center">
        <button onClick={() => store.notify('Çıkış yapıldı (temsili)')} className="inline-flex items-center" style={{ gap: 6, fontSize: 14, fontWeight: 700, color: '#E5484D' }}>
          <LogOut size={16} /> Çıkış yap
        </button>
      </div>
    ),
  };
  return (
    <>
      <PageHeader title={meta.title} subtitle={meta.subtitle} />
      <div className="flex flex-col" style={{ gap: 20 }}>
        {layout.account.filter((id) => !hidden.account.includes(id)).map((id) => (
          <div key={id}>{blocks[id]}</div>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: T.c.muted, marginTop: 18 }}>Gurme · sürüm 1.0 (temsili)</div>
    </>
  );
}
