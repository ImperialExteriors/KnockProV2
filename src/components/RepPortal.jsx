import { useEffect, useRef, useState } from 'react';
import { KPIS, AFFIRMATIONS, hitAnyTarget } from '../config.js';
import { getRepDay, adjustCount, markCelebrated, clearRepDay, todayKey } from '../lib/storage.js';
import KPICard from './KPICard.jsx';
import DailyStatus from './DailyStatus.jsx';
import CelebrationModal from './CelebrationModal.jsx';
import Leaderboard from './Leaderboard.jsx';

export default function RepPortal({ rep, onExit }) {
  const dk = todayKey();
  const [record, setRecord] = useState({ counts: {}, celebrated: {} });
  const [celebration, setCelebration] = useState(null);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    getRepDay(dk, rep.id).then((rec) => {
      setRecord(rec);
      loaded.current = true;
    });
  }, [dk, rep.id]);

  const handleAdjust = async (kpiKey, delta) => {
    const rec = await adjustCount(dk, rep.id, kpiKey, delta);
    setRecord({ ...rec });
    setRefreshSignal((s) => s + 1);

    const kpi = KPIS.find((k) => k.key === kpiKey);
    if (delta > 0 && rec.counts[kpiKey] >= kpi.target && !rec.celebrated[kpiKey]) {
      const updated = await markCelebrated(dk, rep.id, kpiKey);
      setRecord({ ...updated });
      const line = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
      setCelebration({ kpiLabel: kpi.label, message: line(kpi.label) });
      if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
    }
  };

  // Reset today's numbers for THIS rep on THIS phone. Asks twice so
  // nobody nukes a real day by accident. History is not affected.
  const handleReset = async () => {
    const sure = window.confirm(
      `Reset ALL of today's numbers for ${rep.name}? This cannot be undone.`
    );
    if (!sure) return;
    const rec = await clearRepDay(dk, rep.id);
    setRecord(rec);
    setRefreshSignal((s) => s + 1);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="flex-1 animate-slideup space-y-4">
      <div className="flex items-center gap-3">
        <span
          className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `${rep.color}33`, border: `2px solid ${rep.color}` }}
        >
          {rep.emoji}
        </span>
        <div>
          <div className="font-display font-extrabold text-2xl uppercase tracking-wide">
            {rep.name}
          </div>
          <div className="text-sm text-white/55">{today}</div>
        </div>
      </div>

      <DailyStatus won={hitAnyTarget(record.counts)} />

      <div className="space-y-3">
        {KPIS.map((kpi) => (
          <KPICard
            key={kpi.key}
            kpi={kpi}
            count={record.counts[kpi.key] || 0}
            onAdjust={handleAdjust}
          />
        ))}
      </div>

      <Leaderboard refreshSignal={refreshSignal} />

      <button
        onClick={handleReset}
        className="w-full rounded-xl py-3 text-sm font-semibold text-red-400/80
                   bg-imperial-slate border border-red-400/30
                   active:scale-[0.98] transition-transform"
      >
        Reset my day
      </button>

      {celebration && (
        <CelebrationModal
          kpiLabel={celebration.kpiLabel}
          message={celebration.message}
          onKeepGoing={() => setCelebration(null)}
          onDashboard={() => { setCelebration(null); onExit(); }}
        />
      )}
    </main>
  );
}
