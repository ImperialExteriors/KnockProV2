import ProgressBubbles from './ProgressBubbles.jsx';

export default function KPICard({ kpi, count, onAdjust }) {
  const pct = Math.round((count / kpi.target) * 100);
  const hit = count >= kpi.target;

  return (
    <div
      className={`rounded-2xl p-4 border transition-colors
        ${hit
          ? 'bg-imperial-slate border-imperial-greenglow/60'
          : 'bg-imperial-slate border-imperial-line'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/70 flex items-center gap-1.5">
            <span>{kpi.emoji}</span> {kpi.label}
          </div>

          {/* Scoreboard number */}
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`font-display font-extrabold text-5xl leading-none tabular-nums
                ${hit ? 'text-imperial-greenglow' : 'text-white'}`}
            >
              {count}
            </span>
            <span className="font-display font-bold text-xl text-white/40">
              / {kpi.target}
            </span>
            <span
              className={`ml-auto text-xs font-bold px-2 py-1 rounded-full
                ${hit
                  ? 'bg-imperial-green/20 text-imperial-greenglow'
                  : 'bg-imperial-slate2 text-white/60'}`}
            >
              {pct}%{hit ? ' ✓' : ''}
            </span>
          </div>

          <ProgressBubbles
            count={count}
            target={kpi.target}
            bubbleValue={kpi.bubbleValue}
          />
        </div>
      </div>

      {/* Big thumb-friendly buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onAdjust(kpi.key, -1)}
          disabled={count === 0}
          aria-label={`Remove one ${kpi.label}`}
          className="h-14 w-14 shrink-0 rounded-xl bg-imperial-slate2 border border-imperial-line
                     font-display font-bold text-xl text-white/60
                     disabled:opacity-30 active:scale-95 transition-transform"
        >
          −1
        </button>
        <button
          onClick={() => onAdjust(kpi.key, 1)}
          aria-label={`Add one ${kpi.label}`}
          className={`h-14 flex-1 rounded-xl font-display font-extrabold text-2xl uppercase
                      tracking-wider active:scale-[0.97] transition-transform
                      ${hit
                        ? 'bg-gradient-to-r from-imperial-green to-emerald-600 shadow-lg shadow-imperial-green/25'
                        : 'bg-gradient-to-r from-imperial-purple to-imperial-purpledark shadow-lg shadow-imperial-purple/25'}`}
        >
          +1
        </button>
      </div>
    </div>
  );
}
