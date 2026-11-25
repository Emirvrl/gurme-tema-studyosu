import { useState } from 'react';
import { Save, Link2, Trash2, Check, Play } from 'lucide-react';
import { getTemplate } from '../config/templates.js';
import { encodeShare } from '../lib/share.js';

/** "Şablonlarım": mevcut tasarımı kaydet, kayıtlıları uygula, linkle paylaş. */
export default function MyTemplates({ state, set }) {
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(null);

  const copy = async (key, snapshot) => {
    const url = encodeShare(snapshot);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Linki kopyala:', url);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const save = () => {
    const n = name.trim() || `Tasarımım ${state.saved.length + 1}`;
    set.saveCurrent(n);
    setName('');
  };

  return (
    <div className="mb-6 rounded-xl bg-zinc-900/70 p-3 ring-1 ring-zinc-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Şablonlarım</h3>
        <button onClick={() => copy('current', set.snapshot())} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-orange-300 hover:bg-zinc-800">
          {copied === 'current' ? <Check size={12} /> : <Link2 size={12} />} {copied === 'current' ? 'Link kopyalandı' : 'Bu tasarımı paylaş'}
        </button>
      </div>
      <p className="mb-2 text-[11px] leading-snug text-zinc-500">
        Şablon, renkler, logo, alt bar ve tüm ekran düzenleri birlikte kaydedilir. Kayıtlar bu tarayıcıda saklanır; linkle arkadaşlarına gönderebilirsin.
      </p>
      <div className="flex gap-1.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          maxLength={32}
          placeholder="Tasarıma bir ad ver"
          className="min-w-0 flex-1 rounded-lg bg-zinc-950 px-2.5 py-2 text-[12.5px] text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-orange-500"
        />
        <button onClick={save} className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-3 text-[12px] font-semibold text-white hover:bg-orange-500">
          <Save size={13} /> Kaydet
        </button>
      </div>

      {state.saved.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {state.saved.map((item) => {
            const c = item.data.colors;
            return (
              <div key={item.id} className="flex items-center gap-2 rounded-lg bg-zinc-950/60 p-2 ring-1 ring-zinc-800">
                <span className="flex h-8 w-8 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                  <span className="flex-1" style={{ background: c.bg }} />
                  <span className="flex w-3 flex-col">
                    <span className="flex-1" style={{ background: c.primary }} />
                    <span className="flex-1" style={{ background: c.accent }} />
                    <span className="flex-1" style={{ background: c.secondary }} />
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-zinc-100">{item.name}</div>
                  <div className="truncate text-[10.5px] text-zinc-500">{getTemplate(item.data.templateId).name}</div>
                </div>
                <button title="Uygula" onClick={() => set.applySaved(item.id)} className="rounded-md p-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white"><Play size={14} /></button>
                <button title="Linkini kopyala" onClick={() => copy(item.id, item.data)} className="rounded-md p-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  {copied === item.id ? <Check size={14} className="text-emerald-400" /> : <Link2 size={14} />}
                </button>
                <button title="Sil" onClick={() => set.deleteSaved(item.id)} className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400"><Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
