/* Rad Roots — tiny synthesized sound effects (Web Audio, no files) */
'use strict';

const SFX = (() => {
  let ctx = null;
  let enabled = true;

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  /** One enveloped oscillator note */
  function tone(freq, { type = 'sine', dur = 0.12, vol = 0.18, at = 0, slide = null } = {}) {
    if (!enabled) return;
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + at;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  return {
    get enabled() { return enabled; },
    setEnabled(v) { enabled = !!v; },
    unlock() { ensure(); },
    tap() { tone(420, { type: 'triangle', dur: 0.06, vol: 0.08 }); },
    pop() { tone(560, { type: 'triangle', dur: 0.09, vol: 0.11, slide: 760 }); },
    grow() { tone(300, { type: 'triangle', dur: 0.16, vol: 0.1, slide: 620 }); },
    shrink() { tone(520, { type: 'triangle', dur: 0.14, vol: 0.09, slide: 280 }); },
    correct() { [523.25, 659.25, 783.99].forEach((f, i) => tone(f, { at: i * 0.07, dur: 0.2, vol: 0.14 })); },
    wrong() { tone(230, { type: 'square', dur: 0.2, vol: 0.07, slide: 160 }); },
    star() { tone(1046, { dur: 0.12, vol: 0.1 }); tone(1568, { at: 0.08, dur: 0.18, vol: 0.09 }); },
    win() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, { at: i * 0.1, dur: 0.32, vol: 0.14 })); },
    badge() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, { type: 'triangle', at: i * 0.09, dur: 0.25, vol: 0.12 })); },
    tick() { tone(1200, { type: 'square', dur: 0.03, vol: 0.04 }); },
    whoosh() { tone(180, { type: 'sawtooth', dur: 0.18, vol: 0.05, slide: 60 }); },
  };
})();
