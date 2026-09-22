/* Rad Roots — progress store (localStorage), ranks and badges */
'use strict';

const RANKS = [
  { xp: 0, name: 'Seedling' },
  { xp: 120, name: 'Sprout' },
  { xp: 300, name: 'Sapling' },
  { xp: 600, name: 'Bloomer' },
  { xp: 1000, name: 'Root Master' },
];

const BADGES = [
  { id: 'first-sprout', name: 'First Sprout', desc: 'Finished your first plot', icon: 'seed' },
  { id: 'square-builder', name: 'Square Builder', desc: 'Grew every square from 1×1 to 12×12', icon: 'grid' },
  { id: 'root-finder', name: 'Root Finder', desc: 'Used the root machine to undo a square', icon: 'root' },
  { id: 'pattern-spotter', name: 'Pattern Spotter', desc: 'Saw squares grow by odd numbers', icon: 'sparkle' },
  { id: 'sharp-eyes', name: 'Sharp Eyes', desc: '3 stars in the Square Hunt', icon: 'flower' },
  { id: 'detective', name: 'Root Detective', desc: 'Estimated 3 roots within a whisker', icon: 'search' },
  { id: 'myth-buster', name: 'Myth Buster', desc: 'Pulled every weed in Weed Patrol', icon: 'weed' },
  { id: 'real-rooter', name: 'Real-World Rooter', desc: 'Solved roots out in the Big World', icon: 'globe' },
  { id: 'on-a-roll', name: 'On a Roll', desc: '10 correct answers in a row', icon: 'fire' },
  { id: 'rush-15', name: 'Greenhouse Speedster', desc: 'Scored 15 or more in Root Rush', icon: 'timer' },
  { id: 'garden-master', name: 'Garden Master', desc: '3 stars on every plot', icon: 'trophy' },
];

const Store = (() => {
  const KEY = 'radroots.v1';

  const defaults = () => ({
    v: 1,
    xp: 0,
    levels: {},            // id → { stars, best (accuracy), plays }
    badges: [],            // badge ids
    rush: { best: 0 },
    streak: 0,
    bestStreak: 0,
    squaresBuilt: [],      // side lengths the kid has built in the builder
    closeEstimates: 0,     // estimates within 0.2 of the true root
    settings: { sound: true, motion: 'auto' },
    seen: { welcome: false },
    totals: { answered: 0, correct: 0 },
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = Object.assign(defaults(), parsed);
        merged.settings = Object.assign(defaults().settings, parsed.settings || {});
        merged.seen = Object.assign(defaults().seen, parsed.seen || {});
        merged.totals = Object.assign(defaults().totals, parsed.totals || {});
        merged.rush = Object.assign(defaults().rush, parsed.rush || {});
        return merged;
      }
    } catch (e) { /* storage unavailable: run in memory */ }
    return defaults();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function rankFor(xp) {
    let r = RANKS[0], next = null;
    for (let i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].xp) { r = RANKS[i]; next = RANKS[i + 1] || null; }
    }
    return { rank: r, next };
  }

  function levelInfo(id) { return state.levels[id] || { stars: 0, best: 0, plays: 0 }; }

  function totalStars() { return Object.values(state.levels).reduce((s, l) => s + (l.stars || 0), 0); }

  /** Record a level result. Returns { newBadges: [...] } */
  function completeLevel(id, { stars, accuracy, xp }) {
    const prev = levelInfo(id);
    state.levels[id] = { stars: Math.max(prev.stars, stars), best: Math.max(prev.best, accuracy), plays: prev.plays + 1 };
    state.xp += xp;
    save();
    return { newBadges: checkBadges({ type: 'level', id, stars, accuracy }) };
  }

  function addXp(n) { state.xp += n; save(); }

  function recordAnswer(correct) {
    state.totals.answered++;
    if (correct) { state.totals.correct++; state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak); }
    else state.streak = 0;
    save();
    return checkBadges({ type: 'answer' });
  }

  function markSquareBuilt(n) {
    if (!state.squaresBuilt.includes(n)) { state.squaresBuilt.push(n); save(); }
    return checkBadges({ type: 'build' });
  }

  function recordEvent(name, payload = {}) {
    return checkBadges({ type: name, ...payload });
  }

  function recordCloseEstimate() {
    state.closeEstimates++; save();
    return checkBadges({ type: 'estimate-close', count: state.closeEstimates });
  }

  function award(id) {
    if (state.badges.includes(id)) return null;
    state.badges.push(id); save();
    return BADGES.find((b) => b.id === id);
  }

  function checkBadges(ev) {
    const got = [];
    const push = (b) => { if (b) got.push(b); };
    const L = (id) => levelInfo(id);
    if (ev.type === 'level') {
      push(award('first-sprout'));
      if (ev.id === 3 && ev.stars === 3) push(award('sharp-eyes'));
      if (ev.id === 5 && ev.accuracy >= 0.999) push(award('myth-buster'));
      if (ev.id === 6) push(award('real-rooter'));
      if ([1, 2, 3, 4, 5, 6].every((i) => L(i).stars === 3)) push(award('garden-master'));
    }
    if (ev.type === 'answer' && state.streak >= 10) push(award('on-a-roll'));
    if (ev.type === 'build' && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].every((n) => state.squaresBuilt.includes(n))) push(award('square-builder'));
    if (ev.type === 'machine-undo') push(award('root-finder'));
    if (ev.type === 'pattern') push(award('pattern-spotter'));
    if (ev.type === 'estimate-close' && (ev.count || 0) >= 3) push(award('detective'));
    if (ev.type === 'rush' && ev.score >= 15) push(award('rush-15'));
    return got;
  }

  function setRushBest(score) {
    const isNew = score > state.rush.best;
    if (isNew) state.rush.best = score;
    save();
    return { isNew, newBadges: checkBadges({ type: 'rush', score }) };
  }

  function setSetting(k, v) { state.settings[k] = v; save(); }
  function markSeen(k) { state.seen[k] = true; save(); }
  function reset() { state = defaults(); save(); }

  /** Gate: level k unlocks after level k-1 earns a star; Rush after all six */
  function isUnlocked(id) {
    if (id === 1) return true;
    if (id === 7) return [1, 2, 3, 4, 5, 6].every((i) => levelInfo(i).stars > 0);
    return levelInfo(id - 1).stars > 0;
  }

  return {
    get state() { return state; },
    save, rankFor, levelInfo, totalStars, completeLevel, addXp, recordAnswer, markSquareBuilt, recordEvent, recordCloseEstimate,
    setRushBest, setSetting, markSeen, reset, isUnlocked,
  };
})();
