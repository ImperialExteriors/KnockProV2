// ============================================================
// IMPERIAL EXTERIORS — APP CONFIG
// This is the ONLY file you need to touch for everyday changes:
// add/remove reps, change targets, change scoring, change the PIN.
// ============================================================

// ----- REPS -----
// To add a rep: copy a line, give it a unique id (no spaces), a name,
// an emoji avatar, and a color. To remove a rep: delete their line.
// Historical data is stored by id, so don't reuse old ids for new people.
export const REPS = [
  { id: 'noah', name: 'Noah', emoji: '👑', color: '#F59E0B' },
  { id: 'rep1', name: 'Rep 1', emoji: '🔨', color: '#7C3AED' },
  { id: 'rep2', name: 'Rep 2', emoji: '⚡', color: '#22C55E' },
  { id: 'rep3', name: 'Rep 3', emoji: '🏠', color: '#3B82F6' },
  { id: 'rep4', name: 'Rep 4', emoji: '🚀', color: '#EF4444' },
];

// ----- KPIs -----
// key:        internal storage key (don't change once in use, or history splits)
// label:      what reps see
// target:     daily goal
// points:     leaderboard score per unit
// bubbleValue: how many units one progress bubble represents
//              (doors = 5 per bubble so 60 doors = 12 bubbles, etc.)
export const KPIS = [
  { key: 'doors',       label: 'Doors Knocked',      short: 'Doors',  target: 60, points: 1,  bubbleValue: 5, emoji: '🚪' },
  { key: 'convos',      label: 'Conversations Had',  short: 'Convos', target: 20, points: 3,  bubbleValue: 2, emoji: '💬' },
  { key: 'inspections', label: 'Inspections Set',    short: 'Insp',   target: 4,  points: 10, bubbleValue: 1, emoji: '🪜' },
  { key: 'claims',      label: 'Claims Filed',       short: 'Claims', target: 1,  points: 25, bubbleValue: 1, emoji: '📋' },
];

// ----- MANAGER PIN -----
export const MANAGER_PIN = '4449';

// ----- AFFIRMATION LINES (one is picked at random per celebration) -----
export const AFFIRMATIONS = [
  (kpi) => `Good work. You hit your ${kpi} target for today. That's a winning day. Keep going?`,
  (kpi) => `${kpi} target: SMASHED. Days like this build the year. Keep stacking?`,
  (kpi) => `That's the standard. ${kpi} goal hit. Champions don't coast — keep going?`,
  (kpi) => `Boom. ${kpi} target down. The board sees everything. Run it up?`,
];

// ----- SCORE HELPER -----
export function scoreFor(counts = {}) {
  return KPIS.reduce((sum, k) => sum + (counts[k.key] || 0) * k.points, 0);
}

export function hitAnyTarget(counts = {}) {
  return KPIS.some((k) => (counts[k.key] || 0) >= k.target);
}
