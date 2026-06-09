// "Winning Day" status: a day counts as a win once ANY one KPI target is hit.
export default function DailyStatus({ won }) {
  return (
    <div
      className={`rounded-2xl p-4 border flex items-center gap-3
        ${won
          ? 'bg-gradient-to-r from-imperial-green/25 to-imperial-purple/20 border-imperial-greenglow/70'
          : 'bg-imperial-slate border-imperial-line'}`}
    >
      <div className="text-3xl">{won ? '🔒' : '🎯'}</div>
      <div>
        <div
          className={`font-display font-extrabold uppercase tracking-wide text-lg
            ${won ? 'text-imperial-greenglow' : 'text-white'}`}
        >
          {won ? 'Winning Day Locked In' : 'Daily Status'}
        </div>
        <div className="text-sm text-white/65">
          {won
            ? 'You hit a KPI target today. Everything else is gravy.'
            : 'Keep pushing — hit one KPI target today.'}
        </div>
      </div>
    </div>
  );
}
