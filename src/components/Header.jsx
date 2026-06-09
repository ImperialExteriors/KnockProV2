// Header: brand bar with logo placeholder. Swap the .logo-box contents
// for an <img src="/logo.png" /> once you drop your logo into /public.
export default function Header({ showBack, onBack }) {
  return (
    <header className="pt-5 pb-4 flex items-center gap-3">
      {showBack && (
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="shrink-0 h-10 w-10 rounded-xl bg-imperial-slate2 border border-imperial-line
                     flex items-center justify-center text-imperial-purpleglow text-xl font-bold
                     active:scale-95 transition-transform"
        >
          ‹
        </button>
      )}

      {/* ===== LOGO PLACEHOLDER =====
          Replace this block with:
          <img src="./logo.png" alt="Imperial Exteriors" className="h-12" />
          after adding logo.png to the /public folder. */}
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-xl bg-gradient-to-br from-imperial-purple to-imperial-purpledark
                     border border-imperial-purpleglow/40 flex items-center justify-center
                     font-display font-extrabold text-xl tracking-tight"
        >
          IE
        </div>
        <div className="leading-tight">
          <div className="font-display font-extrabold text-2xl tracking-wide uppercase">
            Imperial <span className="text-imperial-greenglow">Exteriors</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-imperial-purpleglow">
            Door Wars · KPI Tracker
          </div>
        </div>
      </div>
    </header>
  );
}
