import { useEffect, useRef, useState } from 'react';
import { KPIS, AFFIRMATIONS, hitAnyTarget } from '../config.js';
import { getRepDay, adjustCount, markCelebrated, todayKey } from '../lib/storage.js';
import KPICard from './KPICard.jsx';
import DailyStatus from './DailyStatus.jsx';
import CelebrationModal from './CelebrationModal.jsx';
import Leaderboard from './Leaderboard.jsx';

export default function RepPortal({ rep, onExit }) {
  const dk = todayKey();
  const [record, setRecord] = useState({ counts: {}, celebrated: {} });
  const [celebration, setCelebration] = useState(null); // { kpiLabel, message }
  const [refreshSignal, setRefreshSignal] = useState(0);
  const loaded = useRef(false);

  // Load today's saved progress on mount (auto "daily reset": each date
  // is its own bucket, so a new day simply starts at zero — history stays).
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

    // Celebration fires the FIRST time a KPI crosses its target each day
    const kpi = KPIS.find((k) => k.key === kpiKey);
    if (
      delta > 0 &&
      rec.counts[kpiKey] >= kpi.target &&
      !rec.celebrated[kpiKey]
    ) {
      const updated = await markCelebrated(dk, rep.id, kpiKey);
      setRecord({ ...updated });
      const line = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
      setCelebration({ kpiLabel: kpi.label, message: line(kpi.label) });
      if (navigator.vibrate) navigator.vibrate([60, 40, 120]); // little buzz on Android
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="flex-1 animate-slideup space-y-4">
      {/* Rep identity bar */}
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

      {/* KPI cards */}
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
