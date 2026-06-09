import { useEffect, useState } from 'react';
import { REPS, KPIS, scoreFor, hitAnyTarget } from '../config.js';
import { getDay, getRange, allDates, todayKey, weekDates } from '../lib/storage.js';
import Leaderboard from './Leaderboard.jsx';

// Manager dashboard: live board, per-rep detail, daily history,
// weekly rollups, and CSV export. PIN check happens on HomeScreen
// before this component ever mounts.
export default function ManagerPortal() {
  const [tab, setTab] = useState('today'); // today | week | history
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [weekAnchor, setWeekAnchor] = useState(todayKey());
  const [dayData, setDayData] = useState({});
  const [weekData, setWeekData] = useState({});
  const [dates, setDates] = useState([]);

  // load data for the selected day
  useEffect(() => {
    getDay(selectedDate).then(setDayData);
  }, [selectedDate, tab]);

  // load data for the week containing weekAnchor
  useEffect(() => {
    getRange(weekDates(weekAnchor)).then(setWeekData);
  }, [weekAnchor, tab]);

  useEffect(() => {
    allDates().then(setDates);
  }, [tab]);

  // ---------- weekly rollups ----------
  const weekTotals = REPS.map((rep) => {
    const totals = {};
    let winDays = 0;
    for (const dk of Object.keys(weekData)) {
      const rec = weekData[dk][rep.id];
      if (!rec) continue;
      for (const k of KPIS) totals[k.key] = (totals[k.key] || 0) + (rec.counts[k.key] || 0);
      if (hitAnyTarget(rec.counts)) winDays++;
    }
    return { ...rep, totals, winDays, score: scoreFor(totals) };
  }).sort((a, b) => b.score - a.score);

  const teamTotals = KPIS.map((k) => ({
    ...k,
    total: weekTotals.reduce((s, r) => s + (r.totals[k.key] || 0), 0),
  }));
  const teamScore = weekTotals.reduce((s, r) => s + r.score, 0);

  // ---------- CSV export ----------
  // Exports every stored day (full history) in the requested format.
  const exportCSV = async () => {
    const all = await getRange(dates.length ? dates : [todayKey()]);
    const header = [
      'Date', 'Rep', 'Doors Knocked', 'Conversations Had', 'Inspections',
      'Claims Filed', 'Hit Daily Target', 'Total Score',
    ];
    const lines = [header.join(',')];
    const sortedDates = Object.keys(all).sort();
    for (const dk of sortedDates) {
      for (const rep of REPS) {
        const rec = all[dk][rep.id];
        if (!rec) continue;
        const c = rec.counts || {};
        lines.push([
          dk,
          rep.name,
          c.doors || 0,
          c.convos || 0,
          c.inspections || 0,
          c.claims || 0,
          hitAnyTarget(c) ? 'YES' : 'NO',
          scoreFor(c),
        ].join(','));
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imperial-kpi-export-${todayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shiftWeek = (dir) => {
    const [y, m, d] = weekAnchor.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + dir * 7);
    setWeekAnchor(
      [dt.getFullYear(), String(dt.getMonth() + 1).padStart(2, '0'), String(dt.getDate()).padStart(2, '0')].join('-')
    );
  };

  const wd = weekDates(weekAnchor);

  const tabBtn = (key, label) => (
    <button
      onClick={() => setTab(key)}
      className={`flex-1 rounded-xl py-2.5 text-sm font-bold uppercase tracking-wide transition-colors
        ${tab === key
          ? 'bg-imperial-purple text-white'
          : 'bg-imperial-slate2 text-white/60'}`}
    >
      {label}
    </button>
  );

  return (
    <main className="flex-1 animate-slideup space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-extrabold text-2xl uppercase tracking-wide">
          Manager <span className="text-imperial-greenglow">Portal</span>
        </h2>
        <button
          onClick={exportCSV}
          className="rounded-xl px-4 py-2.5 text-sm font-bold bg-imperial-green
                     active:scale-95 transition-transform"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="flex gap-2">
        {tabBtn('today', 'Daily')}
        {tabBtn('week', 'Weekly')}
        {tabBtn('history', 'History')}
      </div>

      {/* ---------- DAILY TAB ---------- */}
      {tab === 'today' && (
        <>
          <input
            type="date"
            value={selectedDate}
            max={todayKey()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-xl bg-imperial-slate2 border border-imperial-line
                       px-4 py-3 font-semibold focus:outline-none focus:ring-2
                       focus:ring-imperial-purple [color-scheme:dark]"
          />

          <Leaderboard dateKey={selectedDate} />

          {/* Per-rep detail */}
          <div className="space-y-3">
            {REPS.map((rep) => {
              const rec = dayData[rep.id] || { counts: {} };
              const won = hitAnyTarget(rec.counts);
              return (
                <div
                  key={rep.id}
                  className="rounded-2xl bg-imperial-slate border border-imperial-line p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="h-8 w-8 rounded-full flex items-center justify-center text-base"
                      style={{ background: `${rep.color}33`, border: `1.5px solid ${rep.color}` }}
                    >
                      {rep.emoji}
                    </span>
                    <span className="font-bold">{rep.name}</span>
                    <span
                      className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full
                        ${won
                          ? 'bg-imperial-green/20 text-imperial-greenglow'
                          : 'bg-imperial-slate2 text-white/50'}`}
                    >
                      {won ? '✅ Target hit' : 'No target yet'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {KPIS.map((k) => {
                      const v = rec.counts[k.key] || 0;
                      return (
                        <div key={k.key} className="rounded-xl bg-imperial-slate2 py-2">
                          <div
                            className={`font-display font-extrabold text-2xl tabular-nums
                              ${v >= k.target ? 'text-imperial-greenglow' : 'text-white'}`}
                          >
                            {v}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-white/50">
                            {k.short} /{k.target}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ---------- WEEKLY TAB ---------- */}
      {tab === 'week' && (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => shiftWeek(-1)} className="h-11 w-11 rounded-xl bg-imperial-slate2 border border-imperial-line font-bold">‹</button>
            <div className="flex-1 text-center rounded-xl bg-imperial-slate border border-imperial-line py-2.5">
              <div className="text-xs uppercase tracking-widest text-white/50">Week of</div>
              <div className="font-bold text-sm">{wd[0]} → {wd[6]}</div>
            </div>
            <button
              onClick={() => shiftWeek(1)}
              disabled={wd[6] >= todayKey() && wd[0] <= todayKey()}
              className="h-11 w-11 rounded-xl bg-imperial-slate2 border border-imperial-line font-bold disabled:opacity-30"
            >
              ›
            </button>
          </div>

          {/* Team totals */}
          <div className="rounded-2xl bg-gradient-to-r from-imperial-purpledark to-imperial-purple/60 border border-imperial-purpleglow/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold uppercase tracking-wide">Team Week</span>
              <span className="font-display font-extrabold text-3xl text-imperial-greenglow tabular-nums">
                {teamScore} pts
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {teamTotals.map((k) => (
                <div key={k.key} className="rounded-xl bg-black/25 py-2">
                  <div className="font-display font-extrabold text-2xl tabular-nums">{k.total}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/60">{k.short}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-rep weekly */}
          <div className="space-y-2">
            {weekTotals.map((r, i) => (
              <div
                key={r.id}
                className="rounded-2xl bg-imperial-slate border border-imperial-line p-3.5 flex items-center gap-3"
              >
                <span className="w-5 text-center font-display font-bold">{i + 1}</span>
                <span
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{ background: `${r.color}33`, border: `1.5px solid ${r.color}` }}
                >
                  {r.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm">{r.name}</div>
                  <div className="text-[11px] text-white/50 tabular-nums">
                    {KPIS.map((k) => `${k.short} ${r.totals[k.key] || 0}`).join(' · ')}
                    {' · '}🏆 {r.winDays} win day{r.winDays === 1 ? '' : 's'}
                  </div>
                </div>
                <span className="font-display font-extrabold text-2xl text-imperial-greenglow tabular-nums">
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------- HISTORY TAB ---------- */}
      {tab === 'history' && (
        <div className="space-y-2">
          {dates.length === 0 && (
            <div className="rounded-2xl bg-imperial-slate border border-imperial-line p-6 text-center text-white/55">
              No days recorded yet. Data appears here as soon as a rep logs their first knock.
            </div>
          )}
          {dates.map((dk) => (
            <button
              key={dk}
              onClick={() => { setSelectedDate(dk); setTab('today'); }}
              className="w-full rounded-2xl bg-imperial-slate border border-imperial-line p-4
                         flex items-center justify-between active:scale-[0.99] transition-transform"
            >
              <span className="font-bold">{dk}</span>
              <span className="text-sm text-imperial-purpleglow font-semibold">View day ›</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
