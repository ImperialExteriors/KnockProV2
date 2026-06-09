// ============================================================
// STORAGE LAYER — the ONLY file that touches persistence.
//
// Current backend: localStorage (per-device prototype).
//
// ⚠️ IMPORTANT LIMITATION: localStorage lives on each phone.
// Reps will see their own numbers, but the leaderboard and the
// manager portal only see data entered ON THAT DEVICE. For a true
// live team leaderboard you must swap this file for a real backend
// (Supabase is the easiest free option — notes at the bottom).
//
// Every function here is async on purpose: when you swap in
// Supabase/Firebase, the rest of the app won't need to change.
//
// Data shape in storage:
// {
//   "2026-06-09": {
//     "noah": {
//       counts: { doors: 12, convos: 4, inspections: 1, claims: 0 },
//       celebrated: { doors: true }   // which KPI modals already fired today
//     },
//     ...
//   },
//   ...
// }
// ============================================================

const STORAGE_KEY = 'imperial-kpi-data-v1';

// ---------- date helpers ----------
export function todayKey() {
  // Local date, not UTC — reps work in Indiana, not Greenwich.
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

// Monday-start week containing the given YYYY-MM-DD
export function weekDates(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay(); // 0 Sun ... 6 Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return [
      dt.getFullYear(),
      String(dt.getMonth() + 1).padStart(2, '0'),
      String(dt.getDate()).padStart(2, '0'),
    ].join('-');
  });
}

// ---------- raw read/write (localStorage implementation) ----------
function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ---------- public API ----------

// All data for one date: { repId: { counts, celebrated } }
export async function getDay(dateKey) {
  const all = readAll();
  return all[dateKey] || {};
}

// One rep's record for one date
export async function getRepDay(dateKey, repId) {
  const day = await getDay(dateKey);
  return day[repId] || { counts: {}, celebrated: {} };
}

// Adjust a KPI count by +1 / -1. Never goes below 0. Never deletes history —
// each date is its own bucket, so "daily reset" is automatic.
export async function adjustCount(dateKey, repId, kpiKey, delta) {
  const all = readAll();
  const day = all[dateKey] || {};
  const rep = day[repId] || { counts: {}, celebrated: {} };
  rep.counts[kpiKey] = Math.max(0, (rep.counts[kpiKey] || 0) + delta);
  day[repId] = rep;
  all[dateKey] = day;
  writeAll(all);
  return rep;
}

// Mark a KPI's celebration modal as shown for the day (fires once per KPI/day)
export async function markCelebrated(dateKey, repId, kpiKey) {
  const all = readAll();
  const day = all[dateKey] || {};
  const rep = day[repId] || { counts: {}, celebrated: {} };
  rep.celebrated[kpiKey] = true;
  day[repId] = rep;
  all[dateKey] = day;
  writeAll(all);
  return rep;
}

// Every date that has any data (sorted newest first) — for manager history
export async function allDates() {
  return Object.keys(readAll()).sort().reverse();
}

// Full dataset for a list of dates: { dateKey: { repId: record } }
export async function getRange(dateKeys) {
  const all = readAll();
  const out = {};
  for (const dk of dateKeys) if (all[dk]) out[dk] = all[dk];
  return out;
}

// ============================================================
// 🔌 CONNECTING A REAL BACKEND LATER (Supabase example)
// ============================================================
// 1. Create a free project at supabase.com
// 2. Make one table:
//      create table kpi_entries (
//        id bigint generated always as identity primary key,
//        date text not null,
//        rep_id text not null,
//        kpi_key text not null,
//        count int not null default 0,
//        celebrated bool not null default false,
//        unique (date, rep_id, kpi_key)
//      );
// 3. npm install @supabase/supabase-js
// 4. Replace readAll/writeAll usage above with supabase queries, e.g.:
//      const { data } = await supabase.from('kpi_entries')
//        .select('*').eq('date', dateKey);
//    and adjustCount becomes an upsert:
//      await supabase.from('kpi_entries').upsert({...});
// 5. Because every function in this file is already async,
//    NOTHING else in the app changes.
//
// Firebase works the same way — swap readAll/writeAll for Firestore
// reads/writes keyed by date + repId.
// ============================================================
