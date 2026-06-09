import { useEffect, useState } from 'react';
import { REPS, KPIS, scoreFor, hitAnyTarget } from '../config.js';
import { getDay, todayKey } from '../lib/storage.js';

// Live daily leaderboard. Polls storage every few seconds so the board
// stays fresh while reps tap (and updates instantly via refreshSignal).
// When you connect Supabase/Firebase, swap polling for a realtime
// subscription inside this same effect.
export default function Leaderboard({ compact = false, dateKey = null, refreshSignal = 0 }) {
  const [rows, setRows] = useState([]);
  const dk = dateKey || todayKey();

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const day = await getDay(dk);
      const built = REPS.map((rep) => {
        const rec = day[rep.id] || { counts: {} };
        return {
          ...rep,
          counts: rec.counts,
          score: scoreFor(rec.counts),
          won: hitAnyTarget(rec.counts),
        };
      }).sort((a, b) => b.score - a.score);
      if (alive) setRows(built);
    };
    load();
    const t = setInterval(load, 5000);
    return () => { alive = false; clearInterval(t); };
  }, [dk, refreshSignal]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <section className="rounded-2xl bg-imperial-slate border border-imperial-line p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg uppercase tracking-wide">
          {compact ? "Today's Board" : 'Live Leaderboard'}
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-imperial-purpleglow font-bold">
          1pt · 3pt · 10pt · 25pt
        </span>
      </div>

      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5
              ${i === 0 && r.score > 0
                ? 'bg-gradient-to-r from-imperial-purple/30 to-transparent border border-imperial-purpleglow/50'
                : 'bg-imperial-slate2'}`}
          >
            <span className="w-6 text-center font-display font-bold text-lg">
              {r.score > 0 && medals[i] ? medals[i] : i + 1}
            </span>
            <span
              className="h-9 w-9 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: `${r.color}33`, border: `1.5px solid ${r.color}` }}
            >
              {r.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm flex items-center gap-1.5">
                {r.name}
                {r.won && <span title="Hit a daily target">✅</span>}
              </div>
              {!compact && (
                <div className="text-[11px] text-white/50 tabular-nums">
                  {KPIS.map((k) => `${k.short} ${r.counts[k.key] || 0}`).join(' · ')}
                </div>
              )}
            </div>
            <span className="font-display font-extrabold text-2xl tabular-nums text-imperial-greenglow">
              {r.score}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
