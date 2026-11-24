import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '../../lib/theme.js';
import { rgba } from '../../lib/color.js';
import { BannerCard } from './parts.jsx';

export const ROTATE_MS = 5000;

// Kart stiline göre genişlik (ekran oranı) ve yükseklik
const GEOMETRY = {
  peek: { width: 0.8, height: 140 },
  ios: { width: 0.86, height: 176 },
  bold: { width: 0.86, height: 168 },
  glass: { width: 0.86, height: 184 },
  editorial: { width: 0.82, height: 248 },
};

/*
 * Geçiş animasyonları. Her kartın anlık bir rolü vardır:
 *   center  → öndeki büyük kampanya
 *   next    → sıradaki (sağda / arkada bekler)
 *   prev    → bir önceki (solda / arkada gizlenir)
 *   leaving → öndeyken sola çıkış anı (isteğe bağlı ara aşama)
 * snap: bu rol geçişlerinde animasyon yapılmaz (kart görünmeden yer değiştirir).
 */
export const ANIMATIONS = {
  stack: {
    dur: 700,
    ease: 'cubic-bezier(.22,.8,.24,1)',
    leaveMs: 360,
    roles: {
      center: { transform: 'translate3d(0,0,0) scale(1)', opacity: 1, z: 3 },
      next: { transform: 'translate3d(38px,0,0) scale(.9)', opacity: 1, z: 2, dim: 0.18 },
      prev: { transform: 'translate3d(-38px,0,0) scale(.9)', opacity: 1, z: 1, dim: 0.18 },
      leaving: { transform: 'translate3d(-62%,0,0) scale(.94) rotate(-2deg)', opacity: 1, z: 4 },
    },
    snap: [],
  },
  slide: {
    dur: 650,
    ease: 'cubic-bezier(.65,0,.35,1)',
    roles: {
      center: { transform: 'translate3d(0,0,0)', opacity: 1, z: 3 },
      next: { transform: 'translate3d(calc(100% + 28px),0,0)', opacity: 1, z: 2 },
      prev: { transform: 'translate3d(calc(-100% - 28px),0,0)', opacity: 1, z: 1 },
    },
    snap: ['prev>next'],
  },
  coverflow: {
    dur: 800,
    ease: 'cubic-bezier(.2,.8,.2,1)',
    perspective: 900,
    roles: {
      center: { transform: 'translate3d(0,0,0) rotateY(0deg) scale(1)', opacity: 1, z: 3 },
      next: { transform: 'translate3d(34%,0,-60px) rotateY(-40deg) scale(.78)', opacity: 0.85, z: 2, dim: 0.3 },
      prev: { transform: 'translate3d(-34%,0,-60px) rotateY(40deg) scale(.78)', opacity: 0.85, z: 1, dim: 0.3 },
    },
    snap: [],
  },
  fade: {
    dur: 900,
    ease: 'ease',
    roles: {
      center: { transform: 'scale(1)', opacity: 1, z: 3 },
      next: { transform: 'scale(1.08)', opacity: 0, z: 2 },
      prev: { transform: 'scale(.94)', opacity: 0, z: 1 },
    },
    snap: ['prev>next'],
  },
  swipe: {
    dur: 600,
    ease: 'cubic-bezier(.3,.7,.3,1)',
    leaveMs: 420,
    roles: {
      center: { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', opacity: 1, z: 3 },
      next: { transform: 'translate3d(0,11px,0) scale(.92)', opacity: 1, z: 2, dim: 0.2 },
      prev: { transform: 'translate3d(0,18px,0) scale(.84)', opacity: 0, z: 1 },
      leaving: { transform: 'translate3d(-125%,-14px,0) rotate(-16deg)', opacity: 1, z: 4 },
    },
    snap: ['leaving>prev'],
  },
};

function roleOf(i, active, leaving, n) {
  if (i === leaving) return 'leaving';
  const off = (i - active + n) % n;
  return off === 0 ? 'center' : off === 1 ? 'next' : 'prev';
}

/**
 * Kampanya destesi: anlık olarak bir kampanya büyük, diğerleri arkasında gizli.
 * Her 5 saniyede öndeki sola kayar, sağdaki öne gelir.
 */
export function CampaignCarousel({ items }) {
  const T = useT();
  const { parts } = T;
  const v = parts.banner;
  const animId = ANIMATIONS[parts.anim] ? parts.anim : 'stack';
  const anim = ANIMATIONS[animId];
  const g = GEOMETRY[v] || GEOMETRY.peek;
  const n = items.length;
  const W = 390;
  const cardW = Math.round(W * g.width);

  const [state, setState] = useState({ active: 0, leaving: null });
  const [cycle, setCycle] = useState(0); // zamanlayıcıyı sıfırlamak için
  const rolesRef = useRef({});

  const advance = useCallback(() => {
    setState((s) => ({ active: (s.active + 1) % n, leaving: anim.roles.leaving ? s.active : null }));
  }, [n, anim]);

  // Otomatik geçiş
  useEffect(() => {
    const id = setInterval(advance, ROTATE_MS);
    return () => clearInterval(id);
  }, [advance, cycle]);

  // Çıkış aşaması bitince kart destenin arkasına geçer
  useEffect(() => {
    if (state.leaving === null) return undefined;
    const id = setTimeout(() => setState((s) => ({ ...s, leaving: null })), anim.leaveMs || 300);
    return () => clearTimeout(id);
  }, [state.leaving, anim]);

  // Animasyon değişince hemen bir geçiş göster (önizleme için)
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    const id = setTimeout(advance, 250);
    setCycle((c) => c + 1);
    return () => clearTimeout(id);
  }, [animId]); // eslint-disable-line react-hooks/exhaustive-deps

  const roles = items.map((_, i) => roleOf(i, state.active, state.leaving, n));
  useEffect(() => {
    roles.forEach((r, i) => (rolesRef.current[i] = r));
  });

  const goTo = (i) => {
    setState({ active: i, leaving: null });
    setCycle((c) => c + 1);
  };

  const extraBottom = animId === 'swipe' ? 16 : 0;

  return (
    <div>
      <div
        className="relative"
        style={{
          height: g.height + extraBottom,
          overflow: animId === 'slide' || animId === 'fade' ? 'hidden' : 'visible',
          perspective: anim.perspective ? `${anim.perspective}px` : undefined,
        }}
      >
        {items.map((it, i) => {
          const role = roles[i];
          const prevRole = rolesRef.current[i];
          const snap = prevRole && anim.snap.includes(`${prevRole}>${role}`);
          const r = anim.roles[role] || anim.roles.prev;
          const isLeave = role === 'leaving' || prevRole === 'leaving';
          const dur = isLeave && anim.leaveMs ? anim.leaveMs : anim.dur;
          return (
            <div
              key={it.id}
              onClick={() => (role === 'next' ? goTo((state.active + 1) % n) : role === 'prev' ? goTo(i) : null)}
              className="absolute top-0"
              style={{
                left: (W - cardW) / 2,
                width: cardW,
                height: g.height,
                transform: r.transform,
                opacity: r.opacity,
                zIndex: r.z,
                transition: snap ? 'none' : `transform ${dur}ms ${anim.ease}, opacity ${dur}ms ease, filter ${dur}ms ease`,
                filter: r.dim ? `brightness(${1 - r.dim})` : 'none',
                transformOrigin: 'center center',
                cursor: role === 'center' ? 'default' : 'pointer',
                willChange: 'transform, opacity',
              }}
            >
              <BannerCard v={v} it={it} index={i} total={n} />
            </div>
          );
        })}
      </div>
      <CarouselDots v={v} active={state.active} total={n} onPick={goTo} cycle={`${cycle}-${state.active}`} />
    </div>
  );
}

function CarouselDots({ v, active, total, onPick, cycle }) {
  const { c, t } = useT();
  if (v === 'editorial') {
    return (
      <div className="flex items-center justify-between" style={{ padding: '10px 20px 0', fontFamily: t.fonts.head, color: c.muted, fontSize: 13 }}>
        <span style={{ fontStyle: 'italic' }}>Haftanın fırsatları</span>
        <span>
          <b style={{ color: c.text }}>{String(active + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center" style={{ gap: 6, paddingTop: 12 }}>
      {Array.from({ length: total }).map((_, i) => {
        const on = i === active;
        const base = {
          peek: { w: 6, on: c.text, off: c.hairline },
          ios: { w: 7, on: c.text, off: rgba(c.text, 0.22) },
          bold: { w: 7, on: c.primary, off: rgba(c.text, 0.15) },
          glass: { w: 6, on: c.accent, off: rgba(c.text, 0.22) },
        }[v] || { w: 6, on: c.text, off: c.hairline };
        // Aktif nokta 5 saniyelik ilerleme çubuğuna dönüşür
        return (
          <button
            key={i}
            onClick={() => onPick(i)}
            className="relative overflow-hidden"
            style={{ width: on ? 26 : base.w, height: base.w, borderRadius: 99, background: on ? rgba(base.on, 0.25) : base.off, transition: 'width .3s', boxShadow: on && v === 'glass' ? `0 0 10px ${c.accent}` : 'none' }}
            aria-label={`Kampanya ${i + 1}`}
          >
            {on && <span key={cycle} className="absolute inset-y-0 left-0" style={{ background: base.on, borderRadius: 99, animation: `gurme-progress ${ROTATE_MS}ms linear forwards` }} />}
          </button>
        );
      })}
    </div>
  );
}
