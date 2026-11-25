import { CheckCircle2, AlertTriangle, XCircle, ThumbsUp, ThumbsDown, Sparkles, Wand2, Moon, Sun, Contrast } from 'lucide-react';

const TONE = {
  good: { Icon: CheckCircle2, cls: 'text-emerald-400', bg: 'bg-emerald-500/5 ring-emerald-500/20' },
  warn: { Icon: AlertTriangle, cls: 'text-amber-400', bg: 'bg-amber-500/5 ring-amber-500/20' },
  bad: { Icon: XCircle, cls: 'text-rose-400', bg: 'bg-rose-500/5 ring-rose-500/25' },
};

const Card = ({ title, icon, children, right }) => (
  <section className="mb-4 rounded-2xl bg-zinc-900/70 p-4 ring-1 ring-zinc-800">
    <div className="mb-3 flex items-center justify-between gap-2">
      <h3 className="flex items-center gap-2 text-[12.5px] font-semibold text-zinc-100">
        {icon}
        {title}
      </h3>
      {right}
    </div>
    {children}
  </section>
);

function ScoreRing({ score }) {
  const R = 26;
  const C = 2 * Math.PI * R;
  const color = score >= 80 ? '#34D399' : score >= 60 ? '#FBBF24' : '#FB7185';
  return (
    <div className="relative h-[68px] w-[68px] shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={R} stroke="#27272A" strokeWidth="6" fill="none" />
        <circle cx="32" cy="32" r={R} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} style={{ transition: 'stroke-dashoffset .5s ease, stroke .3s' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[19px] font-bold leading-none text-zinc-50">{score}</span>
        <span className="text-[9px] text-zinc-500">/100</span>
      </div>
    </div>
  );
}

function ProsCons({ pros, cons }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-400">
          <ThumbsUp size={13} /> Neden İyi?
        </div>
        <ul className="space-y-1.5">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2 text-[12px] leading-snug text-zinc-300">
              <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-rose-400">
          <ThumbsDown size={13} /> Neden Kötü / Riskleri?
        </div>
        <ul className="space-y-1.5">
          {cons.map((p, i) => (
            <li key={i} className="flex gap-2 text-[12px] leading-snug text-zinc-300">
              <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-rose-400" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function RightPanel({ report, templateName, logoName, navName, screenNotes, onFix }) {
  const { score, contrasts, notes, harmony, mood, ratio, dark } = report;
  const verdict = score >= 85 ? 'Yayına yakın, dengeli bir kombinasyon' : score >= 70 ? 'İyi, birkaç ince ayarla güçlenir' : score >= 50 ? 'Dikkat gerektiren sorunlar var' : 'Okunabilirlik ciddi risk altında';

  return (
    <aside className="studio-scroll h-full w-[372px] shrink-0 overflow-y-auto border-l border-zinc-800/80 bg-[#121316] px-4 pb-8 pt-5">
      <div className="mb-4 flex items-center gap-2 px-1">
        <Sparkles size={15} className="text-orange-400" />
        <h2 className="text-[14px] font-semibold text-zinc-100">Canlı UX/UI Değerlendirmesi</h2>
      </div>

      {/* Özet */}
      <section className="mb-4 rounded-2xl bg-gradient-to-br from-zinc-800/70 to-zinc-900 p-4 ring-1 ring-zinc-700/60">
        <div className="flex items-center gap-4">
          <ScoreRing score={score} />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">Görsel uyum skoru</div>
            <div className="mt-0.5 text-[13.5px] font-semibold leading-snug text-zinc-100">{verdict}</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300">
            {dark ? <Moon size={11} /> : <Sun size={11} />} {dark ? 'Koyu tema' : 'Açık tema'}
          </span>
          <span className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300">{harmony}</span>
          <span className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300">Ana renk: {mood.name}</span>
        </div>
        <p className="mt-3 text-[12px] leading-snug text-zinc-400">
          <b className="font-medium text-zinc-200">Uyandırdığı his: {mood.feel}.</b> {mood.note}
        </p>
      </section>

      {/* Kontrast */}
      <Card title="Renk & Kontrast Analizi" icon={<Contrast size={14} className="text-zinc-400" />}>
        <div className="divide-y divide-zinc-800">
          {contrasts.map((r) => (
            <div key={r.id} className="flex items-center gap-3 py-2">
              <span className="flex h-8 w-11 shrink-0 items-center justify-center rounded-md text-[13px] font-bold ring-1 ring-white/10" style={{ background: r.bg, color: r.fg }}>
                Aa
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] text-zinc-300">{r.label}</div>
                <div className="text-[10.5px] text-zinc-500">hedef ≥ {String(r.target).replace('.', ',')}:1</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[12.5px] text-zinc-100">{r.ratio.toFixed(2).replace('.', ',')}:1</div>
                <span className={`text-[10.5px] font-semibold ${r.pass ? 'text-emerald-400' : r.ratio >= 3 ? 'text-amber-400' : 'text-rose-400'}`}>{r.level}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>60-30-10 dağılımı</span>
          </div>
          <div className="flex h-6 overflow-hidden rounded-md ring-1 ring-white/10">
            {ratio.map((r) => (
              <span key={r.label} style={{ width: `${r.pct}%`, background: r.color }} />
            ))}
          </div>
          <div className="mt-1 flex text-[10.5px] text-zinc-500">
            {ratio.map((r) => (
              <span key={r.label} style={{ width: `${r.pct}%` }} className="truncate">
                {r.pct}% {r.label}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Notlar */}
      <Card title="Renk Önerileri" icon={<Wand2 size={14} className="text-zinc-400" />} right={<span className="text-[10.5px] text-zinc-500">{notes.length} not</span>}>
        <div className="space-y-2">
          {notes.map((n, i) => {
            const { Icon, cls, bg } = TONE[n.tone];
            return (
              <div key={i} className={`rounded-xl p-3 ring-1 ${bg}`}>
                <div className="flex gap-2.5">
                  <Icon size={15} className={`mt-0.5 shrink-0 ${cls}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-zinc-100">{n.title}</div>
                    <p className="mt-0.5 text-[12px] leading-snug text-zinc-400">{n.body}</p>
                    {n.fix && (
                      <button onClick={() => onFix(n.fix.key, n.fix.value)} className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-200 ring-1 ring-zinc-700 hover:bg-zinc-700">
                        <span className="h-3 w-3 rounded-sm ring-1 ring-white/20" style={{ background: n.fix.value }} />
                        {n.fix.label} · <span className="font-mono">{n.fix.value}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title={`Şablon: ${templateName}`} icon={<span className="h-2 w-2 rounded-full bg-orange-400" />}>
        <ProsCons {...report.template} />
      </Card>

      <Card title={`Logo: ${logoName}`} icon={<span className="h-2 w-2 rounded-full bg-sky-400" />}>
        <ProsCons {...report.logo} />
      </Card>

      {screenNotes && (screenNotes.pros.length > 0 || screenNotes.cons.length > 0) && (
        <Card title={`Ekran: ${screenNotes.name}`} icon={<span className="h-2 w-2 rounded-full bg-emerald-400" />}>
          <ProsCons pros={screenNotes.pros} cons={screenNotes.cons} />
        </Card>
      )}

      <Card title={`Alt Bar: ${navName}`} icon={<span className="h-2 w-2 rounded-full bg-violet-400" />}>
        <ProsCons {...report.nav} />
      </Card>
    </aside>
  );
}
