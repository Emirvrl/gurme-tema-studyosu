import { useEffect, useRef, useState } from 'react';

const SCREEN_W = 390;
const SCREEN_H = 844;
const BEZEL = 13;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;

/** Gerçekçi cihaz çerçevesi. Ekran her zaman 390×844 çizilir, alan dar ise orantılı küçültülür. */
export default function PhoneFrame({ platform = 'ortak', children }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(1, (height - 24) / FRAME_H, (width - 24) / FRAME_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const android = platform === 'android';
  const outerR = android ? 46 : 62;
  const innerR = outerR - BEZEL + 2;

  return (
    <div ref={wrapRef} className="flex h-full w-full items-center justify-center">
      <div style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
        <div
          className="relative"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            borderRadius: outerR,
            background: 'linear-gradient(145deg, #2c2d33, #141519)',
            padding: BEZEL,
            boxShadow: '0 0 0 1.5px #3a3b42, 0 40px 80px -30px rgba(0,0,0,.8), inset 0 0 2px rgba(255,255,255,.2)',
          }}
        >
          {/* yan tuşlar */}
          <span className="absolute" style={{ left: -3, top: 170, width: 3, height: 34, borderRadius: 2, background: '#2a2b31' }} />
          <span className="absolute" style={{ left: -3, top: 224, width: 3, height: 62, borderRadius: 2, background: '#2a2b31' }} />
          <span className="absolute" style={{ right: -3, top: 250, width: 3, height: 96, borderRadius: 2, background: '#2a2b31' }} />

          <div className="relative overflow-hidden" style={{ width: SCREEN_W, height: SCREEN_H, borderRadius: innerR, background: '#000' }}>
            {children}
            {/* kamera: iOS Dynamic Island / Android delik kamera */}
            {android ? (
              <span className="pointer-events-none absolute left-1/2 z-50" style={{ top: 14, width: 13, height: 13, borderRadius: 99, background: '#050506', transform: 'translateX(-50%)', boxShadow: '0 0 0 2px rgba(255,255,255,.04)' }} />
            ) : (
              <span className="pointer-events-none absolute left-1/2 z-50" style={{ top: 11, width: 122, height: 35, borderRadius: 99, background: '#050506', transform: 'translateX(-50%)' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
