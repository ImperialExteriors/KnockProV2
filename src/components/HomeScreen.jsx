import { useState } from 'react';
import { REPS, MANAGER_PIN } from '../config.js';
import Leaderboard from './Leaderboard.jsx';

export default function HomeScreen({ onSelectRep, onManager }) {
  const [selected, setSelected] = useState('');
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const submitPin = () => {
    if (pin === MANAGER_PIN) {
      setPin('');
      setPinOpen(false);
      onManager();
    } else {
      setPinError(true);
      setPin('');
    }
  };

  return (
    <main className="flex-1 animate-slideup">
      {/* Rep login card */}
      <section className="rounded-2xl bg-imperial-slate border border-imperial-line p-5 mb-4">
        <h2 className="font-display font-bold text-xl uppercase tracking-wide mb-1">
          Who's knocking today?
        </h2>
        <p className="text-sm text-white/60 mb-4">
          Pick your name to open your tracking portal.
        </p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-xl bg-imperial-slate2 border border-imperial-line
                     px-4 py-3.5 text-base font-semibold focus:outline-none
                     focus:ring-2 focus:ring-imperial-purple"
        >
          <option value="">Select your name…</option>
          {REPS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.emoji} {r.name}
            </option>
          ))}
        </select>

        <button
          disabled={!selected}
          onClick={() => onSelectRep(selected)}
          className="mt-3 w-full rounded-xl py-3.5 font-display font-extrabold text-lg uppercase
                     tracking-wider transition-all active:scale-[0.98]
                     bg-gradient-to-r from-imperial-purple to-imperial-purpledark
                     disabled:opacity-40 disabled:cursor-not-allowed
                     enabled:shadow-lg enabled:shadow-imperial-purple/30"
        >
          Enter my portal →
        </button>
      </section>

      {/* Today's leaderboard preview */}
      <Leaderboard compact />

      {/* Manager access */}
      <section className="mt-4">
        {!pinOpen ? (
          <button
            onClick={() => { setPinOpen(true); setPinError(false); }}
            className="w-full rounded-xl py-3 border border-imperial-line bg-imperial-slate
                       text-sm font-semibold text-white/70 active:scale-[0.98] transition-transform"
          >
            🔒 Manager Portal
          </button>
        ) : (
          <div className="rounded-2xl bg-imperial-slate border border-imperial-line p-4 animate-slideup">
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Enter manager PIN
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && submitPin()}
                placeholder="••••"
                className="flex-1 rounded-xl bg-imperial-slate2 border border-imperial-line
                           px-4 py-3 text-lg tracking-[0.5em] focus:outline-none
                           focus:ring-2 focus:ring-imperial-purple"
              />
              <button
                onClick={submitPin}
                className="rounded-xl px-5 font-display font-bold uppercase
                           bg-imperial-purple active:scale-95 transition-transform"
              >
                Go
              </button>
            </div>
            {pinError && (
              <p className="mt-2 text-sm text-red-400 font-semibold">
                Wrong PIN. Try again.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
