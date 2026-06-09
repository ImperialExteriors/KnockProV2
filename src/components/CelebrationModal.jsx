// Fires once per KPI per day when a target is first reached.
export default function CelebrationModal({ kpiLabel, message, onKeepGoing, onDashboard }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${kpiLabel} target reached`}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-imperial-slate border border-imperial-greenglow/60
                   p-6 text-center animate-slideup shadow-2xl shadow-imperial-green/20"
      >
        <div className="text-6xl mb-3">🏆</div>
        <h3 className="font-display font-extrabold text-2xl uppercase tracking-wide text-imperial-greenglow">
          Target hit!
        </h3>
        <p className="mt-3 text-white/85 leading-relaxed">{message}</p>

        <div className="mt-6 grid gap-2">
          <button
            onClick={onKeepGoing}
            className="rounded-xl py-3.5 font-display font-extrabold text-lg uppercase tracking-wider
                       bg-gradient-to-r from-imperial-green to-emerald-600
                       active:scale-[0.98] transition-transform animate-glowpulse"
          >
            Keep going 🔥
          </button>
          <button
            onClick={onDashboard}
            className="rounded-xl py-3 font-semibold text-white/70 bg-imperial-slate2
                       border border-imperial-line active:scale-[0.98] transition-transform"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
