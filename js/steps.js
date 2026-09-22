/* Rad Roots — step components. Each step renders into `host` and calls ctx.done(result).
   result: { scored:false } | { scored:true, correct, firstTry } | { scored:true, batch:{ correct, total } }
   A step may return a cleanup function (timers, listeners). */
'use strict';

const XP_FIRST = 10, XP_SECOND = 5, XP_GOAL = 5;

function stageEl(cls = '') { return h('div', { class: `stage ${cls}` }); }
function continueBtn(label, onclick, cls = '') {
  return h('div', { class: 'actions' }, h('button', { type: 'button', class: `btn btn--wide ${cls}`, onclick: () => { SFX.tap(); onclick(); } }, label, frag(icon('next'))));
}

const STEPS = {

  /* ---------- Intro: Rad talks, optional visual ---------- */
  intro(host, step, ctx) {
    const s = stageEl();
    s.append(speech(step.mood || 'happy', step.text, true));
    if (step.visual) { const v = step.visual(); v.classList.add('spacer-top'); s.append(h('div', { class: 'spacer' }), v); }
    s.append(continueBtn(step.button || "Let's go", () => ctx.done({ scored: false })));
    host.append(s);
  },

  /* ---------- Card: explanatory content ---------- */
  card(host, step, ctx) {
    const s = stageEl();
    if (step.title) s.append(h('h2', { class: 'stage-title' }, step.title));
    if (step.text) s.append(h('p', { class: 'stage-text', html: step.text }));
    if (step.build) { s.append(h('div', { class: 'spacer' }), step.build(ctx)); }
    if (step.after) s.append(h('div', { class: 'spacer' }), h('p', { class: 'stage-text', html: step.after }));
    s.append(continueBtn(step.button || 'Got it', () => { if (step.event) ctx.gotBadges(Store.recordEvent(step.event)); ctx.done({ scored: false }); }));
    host.append(s);
  },

  /* ---------- Build: grow a square with the slider to meet goals ---------- */
  build(host, step, ctx) {
    const s = stageEl();
    let n = step.start || 1, gi = 0;
    const goals = step.goals;
    const bubble = speech('happy', goals[0].text);
    const eq = h('div', { class: 'eq', html: '' });
    const gridWrap = h('div', { class: 'grid-wrap' });
    const plant = step.showRoot ? plantView(n, { showRoot: true, scale: true }) : h('div', { class: 'plant' }, tileGrid(n, { scale: true }));
    gridWrap.append(plant);
    const goalList = h('div', { class: 'goals' }, goals.map((g, i) => h('div', { class: `goal ${i === 0 ? 'is-active' : ''}` }, h('span', { class: 'goal-check', html: icon('check') }), h('span', { html: g.short || g.text }))));
    const updateEq = () => { eq.innerHTML = `<span class="hl">${n}</span> × <span class="hl">${n}</span> = <span class="hl2">${n * n}</span> <span style="color:var(--ink-3);font-size:.7em">&nbsp;(${sq(n)})</span>`; };
    updateEq();
    const slider = sideSlider({ value: n, onChange: (v) => {
      const up = v > n; n = v;
      morphGrid($('.grid', plant), n, { markNew: false, scale: true });
      if (step.showRoot) { const root = $('.root-bar', plant); if (root) { root.innerHTML = ''; for (let i = 0; i < n; i++) root.append(h('div', { class: 'root-seg', style: { '--d': `${i * 30}ms` } })); $('.root-label', plant).innerHTML = `root = <b>${n}</b> &nbsp;·&nbsp; one side of the square`; syncRootWidth(plant, n, true); } }
      updateEq(); up ? SFX.grow() : SFX.shrink();
      ctx.gotBadges(Store.markSquareBuilt(n));
      check();
    } });
    function check() {
      if (gi >= goals.length) return;
      if (goals[gi].check(n)) {
        const g = $$('.goal', goalList)[gi];
        g.classList.remove('is-active'); g.classList.add('is-done');
        SFX.star(); ctx.award(XP_GOAL, g);
        gi++;
        if (gi < goals.length) {
          $$('.goal', goalList)[gi].classList.add('is-active');
          $('.bubble', bubble).innerHTML = goals[gi].text;
          $('.rad', bubble).outerHTML = mascot('happy');
        } else {
          $('.bubble', bubble).innerHTML = step.doneText || 'You grew them all! Squares are just numbers that make a square.';
          $('.rad', bubble).outerHTML = mascot('cheer');
          slider.el.style.opacity = '.6';
          Feedback.show({ kind: 'good', title: step.doneTitle || 'All goals grown!', body: step.doneBody || '', onButton: () => ctx.done({ scored: false }) });
        }
      }
    }
    s.append(bubble, h('div', { class: 'spacer' }), eq, gridWrap, slider.el, h('div', { class: 'spacer' }), goalList);
    host.append(s);
    if (step.showRoot) syncRootWidth(plant, n, true);
    return () => Feedback.hide();
  },

  /* ---------- Gallery: the twelve square numbers ---------- */
  gallery(host, step, ctx) {
    const s = stageEl();
    s.append(h('h2', { class: 'stage-title' }, step.title || 'The square numbers'), h('p', { class: 'stage-text', html: step.text }));
    const g = h('div', { class: 'gallery' });
    for (let n = 1; n <= 12; n++) {
      g.append(h('div', { class: 'gallery-item' }, tileGrid(n, { size: 'xs', stagger: false }), h('b', {}, String(n * n)), h('span', { html: `${n} × ${n}` })));
    }
    s.append(h('div', { class: 'spacer' }), g);
    if (step.after) s.append(h('div', { class: 'spacer' }), h('p', { class: 'stage-text', html: step.after }));
    s.append(continueBtn('Got it', () => ctx.done({ scored: false })));
    host.append(s);
  },

  /* ---------- Decide: two-button classification with a reveal (square sort, myths) ---------- */
  decide(host, step, ctx) {
    let i = 0, correct = 0;
    const s = stageEl();
    const head = speech('happy', step.text);
    const counter = h('div', { class: 'decide-count' });
    const body = h('div', { class: 'decide' });
    s.append(head, h('div', { class: 'spacer' }), body, counter);
    host.append(s);
    function show() {
      const item = step.items[i];
      counter.textContent = `${i + 1} of ${step.items.length}`;
      body.innerHTML = '';
      const card = h('div', { class: 'decide-card' });
      card.append(h('div', { class: 'eq', html: item.prompt }));
      if (item.sub) card.append(h('div', { class: 'card-hint', html: item.sub }));
      const btns = h('div', { class: 'decide-btns' });
      const mk = (opt, val) => h('button', { type: 'button', class: `btn ${opt.cls || ''}`, onclick: () => choose(val) }, frag(icon(opt.icon)), h('span', {}, opt.label), opt.sub ? h('small', {}, opt.sub) : null);
      btns.append(mk(step.yes, true), mk(step.no, false));
      body.append(card, btns);
      function choose(val) {
        const ok = val === item.truth;
        btns.remove();
        card.classList.add(ok ? 'is-good' : 'is-bad');
        if (ok) { correct++; SFX.correct(); ctx.award(XP_FIRST, card); } else SFX.wrong();
        ctx.gotBadges(Store.recordAnswer(ok));
        const reveal = h('div', { class: 'reveal' });
        if (item.visual) reveal.append(item.visual());
        reveal.append(h('div', { class: 'reveal-text', html: `<b>${ok ? (item.truth ? step.yes.good : step.no.good) : (item.truth ? step.yes.fix : step.no.fix)}</b> ${item.explain}` }));
        card.append(reveal);
        $('.rad', head).outerHTML = mascot(ok ? 'cheer' : 'think');
        $('.bubble', head).innerHTML = ok ? pick(['Nice one!', 'You got it!', 'Sharp eyes!', 'Exactly right!']) : pick(['Hmm, let\'s look closer.', 'Tricky one! Here\'s why.', 'Not quite. See what happens:']);
        const last = i === step.items.length - 1;
        body.append(h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn--wide', onclick: () => { SFX.tap(); i++; if (last) ctx.done({ scored: true, batch: { correct, total: step.items.length } }); else { $('.rad', head).outerHTML = mascot('happy'); $('.bubble', head).innerHTML = step.text; show(); } } }, last ? 'Finish' : 'Next', frag(icon('next')))));
      }
    }
    show();
  },

  /* ---------- Answer: number-pad question with hint and two tries ---------- */
  answer(host, step, ctx) {
    let tries = 0;
    const s = stageEl('stage-pad');
    s.append(h('p', { class: 'stage-text center', style: { margin: '0 auto 8px' }, html: step.prompt }));
    if (step.eq) s.append(h('div', { class: 'eq eq--huge', html: step.eq }));
    if (step.visual) s.append(h('div', { class: 'spacer' }), step.visual());
    const pad = numpad({ onSubmit: submit, maxLen: 4 });
    const hintArea = h('div', { class: 'hint-area' });
    let hintShown = false;
    const showHint = () => {
      if (hintShown || !step.hint) return; hintShown = true;
      hintArea.innerHTML = '';
      if (step.hint.visual) hintArea.append(step.hint.visual());
      if (step.hint.text) hintArea.append(h('div', { class: 'card-hint', html: step.hint.text }));
      hintBtn.remove();
    };
    const hintBtn = h('button', { type: 'button', class: 'hint-btn', onclick: () => { SFX.tap(); showHint(); } }, frag(icon('bulb')), 'Show me a hint');
    s.append(h('div', { class: 'spacer' }), pad.el);
    if (step.hint) s.append(h('div', { class: 'hint-row' }, hintBtn), hintArea);
    host.append(s);
    function submit(v) {
      if (v === step.answer) {
        pad.mark('good'); pad.lock(); SFX.correct();
        const first = tries === 0;
        ctx.award(first ? XP_FIRST : XP_SECOND, $('.answer-display', s));
        ctx.gotBadges(Store.recordAnswer(true));
        Feedback.show({ kind: 'good', title: first ? pick(['Yes!', 'Correct!', 'You got it!', 'Rad!']) : 'That\'s it!', body: step.explain || '', onButton: () => ctx.done({ scored: true, correct: true, firstTry: first }) });
      } else {
        tries++;
        pad.mark('bad'); SFX.wrong();
        if (tries === 1) {
          showHint();
          Feedback.show({ kind: 'bad', title: 'Not quite', body: step.wrongHint || (step.hint && step.hint.text) || 'Take another look and try again.', button: 'Try again', onButton: () => pad.clear() });
        } else {
          pad.lock();
          ctx.gotBadges(Store.recordAnswer(false));
          Feedback.show({ kind: 'reveal', title: `The answer is ${step.answer}`, body: step.explain || '', onButton: () => ctx.done({ scored: true, correct: false, firstTry: false }) });
        }
      }
    }
    return () => { pad.destroy(); Feedback.hide(); };
  },

  /* ---------- Choice: tap one of several chips, two tries ---------- */
  choice(host, step, ctx) {
    let tries = 0;
    const s = stageEl('stage-pad');
    s.append(h('p', { class: 'stage-text center', style: { margin: '0 auto 8px' }, html: step.prompt }));
    if (step.eq) s.append(h('div', { class: 'eq eq--huge', html: step.eq }));
    if (step.visual) s.append(h('div', { class: 'spacer' }), step.visual());
    const choices = h('div', { class: 'choices' });
    const after = h('div', { class: 'reveal' });
    const opts = step.shuffle === false ? step.choices : shuffle(step.choices);
    opts.forEach((c) => choices.append(h('button', { type: 'button', class: 'choice', html: c.html, onclick: (e) => choose(c, e.currentTarget) })));
    s.append(h('div', { class: 'spacer' }), choices, after);
    host.append(s);
    function choose(c, el) {
      if (c.correct) {
        el.classList.add('is-good'); choices.classList.add('is-locked'); SFX.correct();
        const first = tries === 0;
        ctx.award(first ? XP_FIRST : XP_SECOND, el);
        ctx.gotBadges(Store.recordAnswer(true));
        if (step.after) after.append(step.after());
        Feedback.show({ kind: 'good', title: first ? pick(['Yes!', 'Correct!', 'Exactly!']) : 'That\'s it!', body: step.explain || '', onButton: () => ctx.done({ scored: true, correct: true, firstTry: first }) });
      } else {
        tries++; el.classList.add('is-bad'); SFX.wrong();
        if (tries === 1) {
          Feedback.show({ kind: 'bad', title: 'Not quite', body: step.wrongHint || 'Think it through and try once more.', button: 'Try again', onButton: () => { el.classList.remove('is-bad'); el.disabled = true; el.style.opacity = '.4'; } });
        } else {
          choices.classList.add('is-locked');
          $$('.choice', choices).forEach((b, i) => { if (opts[i].correct) b.classList.add('is-good'); });
          ctx.gotBadges(Store.recordAnswer(false));
          if (step.after) after.append(step.after());
          Feedback.show({ kind: 'reveal', title: 'Here\'s the answer', body: step.explain || '', onButton: () => ctx.done({ scored: true, correct: false, firstTry: false }) });
        }
      }
    }
    return () => Feedback.hide();
  },

  /* ---------- Root machine: square and root undo each other ---------- */
  machine(host, step, ctx) {
    const s = stageEl();
    let cur = null, gi = 0, typed = '';
    const goals = step.goals;
    const bubble = speech('happy', goals[0].text);
    const trail = h('div', { class: 'pill-list', 'aria-label': 'machine history' });
    const num = h('div', { class: 'machine-num is-empty', role: 'status', 'aria-live': 'polite' }, '?');
    const note = h('div', { class: 'machine-note' }, 'Type a number, then press a lever.');
    const bSquare = h('button', { type: 'button', class: 'btn btn--sky', html: `<span>SQUARE</span> <span style="font-family:var(--font-ui);opacity:.85">n<sup>2</sup></span>`, onclick: () => go('square') });
    const bRoot = h('button', { type: 'button', class: 'btn btn--berry', html: `<span>ROOT</span> ${radical('n')}`, onclick: () => go('root') });
    const body = h('div', { class: 'machine-body' },
      h('div', { class: 'machine-slot' }, h('label', {}, 'In the machine'), num),
      h('div', { class: 'machine-btns' }, bSquare, bRoot),
      note);
    const mini = h('div', { class: 'numpad', role: 'group', 'aria-label': 'number keys' });
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'clr'].forEach((k) => {
      const b = h('button', { type: 'button', class: `key ${k === 'del' || k === 'clr' ? 'key--del' : ''}`, 'aria-label': k === 'del' ? 'delete' : k === 'clr' ? 'clear' : k, onclick: () => type(k) });
      b.innerHTML = k === 'del' ? icon('del') : k === 'clr' ? icon('refresh') : k;
      mini.append(b);
    });
    const goalList = h('div', { class: 'goals' }, goals.map((g, i) => h('div', { class: `goal ${i === 0 ? 'is-active' : ''}` }, h('span', { class: 'goal-check', html: icon('check') }), h('span', { html: g.short || g.text }))));
    s.append(bubble, h('div', { class: 'spacer' }), h('div', { class: 'machine' }, body, trail), h('div', { class: 'spacer' }), mini, h('div', { class: 'spacer' }), goalList);
    host.append(s);

    function setCur(v, kind) {
      cur = v; typed = '';
      num.textContent = v == null ? '?' : String(v);
      num.classList.remove('is-in', 'is-out'); void num.offsetWidth;
      if (kind) num.classList.add(kind === 'in' ? 'is-in' : 'is-out');
    }
    function type(k) {
      SFX.tap();
      if (k === 'clr') { typed = ''; trail.innerHTML = ''; setCur(null); note.textContent = 'Machine cleared. Type a number.'; return; }
      if (k === 'del') typed = typed.slice(0, -1);
      else if (typed.length < 3) typed = typed === '0' ? k : typed + k;
      if (typed === '') { setCur(null); return; }
      cur = Number(typed); num.textContent = typed; num.classList.remove('is-out'); num.classList.add('is-in');
      trail.innerHTML = ''; addTrail(cur, 'in');
      note.textContent = 'Now press SQUARE or ROOT.';
    }
    function addTrail(v, kind) {
      const p = h('span', { class: `pill ${kind === 'out' ? 'pill--on' : ''}` }, String(v));
      if (trail.children.length) trail.append(h('span', { class: 'pill', style: { border: 0, background: 'none', padding: 0 }, html: icon('arrow') }));
      trail.append(p);
    }
    function go(op) {
      if (cur == null) { note.textContent = 'Type a number first!'; SFX.wrong(); return; }
      if (op === 'square') {
        if (cur > 12) { note.textContent = `${cur} is too big for this little machine. Try 12 or less.`; SFX.wrong(); num.classList.add('is-bad'); setTimeout(() => num.classList.remove('is-bad'), 400); return; }
        const out = cur * cur; note.innerHTML = `${cur} × ${cur} = <b>${out}</b>. ${cur} squared!`;
        SFX.grow(); setCur(out, 'out'); addTrail(out, 'out'); check('square', out);
      } else {
        if (!isSquare(cur) || cur > 144) { note.textContent = `${cur} isn't a square number, so the root lever won't budge. Try 36, 49, 64…`; SFX.wrong(); return; }
        const out = Math.sqrt(cur); note.innerHTML = `${radical(cur)} = <b>${out}</b>, because ${out} × ${out} = ${cur}.`;
        SFX.pop(); setCur(out, 'out'); addTrail(out, 'out'); check('root', out);
      }
    }
    function check(op, out) {
      if (gi >= goals.length) return;
      const g = goals[gi];
      if (g.check(op, out, trail)) {
        const el = $$('.goal', goalList)[gi];
        el.classList.remove('is-active'); el.classList.add('is-done');
        SFX.star(); ctx.award(XP_GOAL, el);
        if (g.event) ctx.gotBadges(Store.recordEvent(g.event));
        gi++;
        if (gi < goals.length) { $$('.goal', goalList)[gi].classList.add('is-active'); $('.bubble', bubble).innerHTML = goals[gi].text; }
        else {
          $('.bubble', bubble).innerHTML = step.doneText; $('.rad', bubble).outerHTML = mascot('cheer');
          Feedback.show({ kind: 'good', title: 'Machine mastered!', body: 'Squaring and rooting undo each other.', onButton: () => ctx.done({ scored: false }) });
        }
      }
    }
    return () => Feedback.hide();
  },

  /* ---------- Grow: squares grow by odd numbers ---------- */
  grow(host, step, ctx) {
    const s = stageEl();
    let n = 1;
    const max = step.max || 7;
    const bubble = speech('happy', step.text);
    const grid = tileGrid(1, { scale: true });
    const sum = h('div', { class: 'pattern-sum', html: '<b>1</b> = 1 = 1<sup>2</sup>' });
    const btn = h('button', { type: 'button', class: 'btn btn--sun btn--wide', onclick: growOnce }, frag(icon('sparkle')), 'Grow one layer');
    s.append(bubble, h('div', { class: 'spacer' }), h('div', { class: 'grid-wrap' }, grid), sum, h('div', { class: 'actions' }, btn));
    host.append(s);
    function growOnce() {
      if (n >= max) return;
      n++;
      morphGrid(grid, n, { markNew: true, hue: n, scale: true });
      SFX.grow();
      const odds = Array.from({ length: n }, (_, i) => 2 * i + 1);
      sum.innerHTML = odds.map((o, i) => (i === n - 1 ? `<b>${o}</b>` : o)).join(' + ') + ` = ${n * n} = ${n}<sup>2</sup>`;
      $('.bubble', bubble).innerHTML = `We added <b>${2 * n - 1}</b> tiles: a new row, a new column, and the corner.`;
      setTimeout(() => $$('.tile--new', grid).forEach((t) => t.classList.remove('tile--new')), 900);
      if (n >= max) {
        btn.disabled = true;
        $('.rad', bubble).outerHTML = mascot('cheer');
        $('.bubble', bubble).innerHTML = 'Look at the pattern: <b>1, 3, 5, 7, 9, 11, 13…</b> Every square grows by the next odd number!';
        ctx.gotBadges(Store.recordEvent('pattern'));
        setTimeout(() => Feedback.show({ kind: 'reveal', title: 'Pattern spotted!', body: 'A square number is a sum of odd numbers, starting from 1.', onButton: () => ctx.done({ scored: false }) }), 600);
      }
    }
    return () => Feedback.hide();
  },

  /* ---------- Hunt: tap the square numbers as they pop up ---------- */
  hunt(host, step, ctx) {
    const s = stageEl();
    const total = step.pops || 24;
    let pops = 0, hits = 0, squaresShown = 0, wrongTaps = 0, missed = 0, timers = [], running = false;
    const hud = h('div', { class: 'hunt-hud' }, h('span', { html: `Squares caught: <b class="tnum" id="hunt-hits">0</b>` }), h('span', { html: `Pop <b class="tnum" id="hunt-pop">0</b>/${total}` }));
    const board = h('div', { class: 'hunt', role: 'group', 'aria-label': 'garden plots' });
    const mounds = [];
    for (let i = 0; i < 9; i++) {
      const m = h('button', { type: 'button', class: 'mound', 'aria-label': 'plot' }, h('span', { class: 'mound-num' }));
      m.addEventListener('pointerdown', () => tap(i));
      mounds.push(m); board.append(m);
    }
    const msg = h('div', { class: 'hunt-msg' }, 'Tap a square number when it pops up. Leave the others alone!');
    const legend = h('div', { class: 'hunt-legend', html: `<span>1 · 4 · 9 · 16 · 25 · 36 · 49 · 64 · 81 · 100 · 121 · 144</span>` });
    const startBtn = h('button', { type: 'button', class: 'btn btn--sun btn--wide', onclick: start }, frag(icon('play')), 'Start the hunt');
    s.append(speech('happy', step.text), h('div', { class: 'spacer' }), hud, board, msg, legend, h('div', { class: 'actions' }, startBtn));
    host.append(s);
    const state = mounds.map(() => ({ up: false, value: 0, done: false }));
    function start() { if (running) return; running = true; startBtn.remove(); SFX.pop(); schedule(600); }
    function schedule(ms) { timers.push(setTimeout(popOne, ms)); }
    function popOne() {
      if (pops >= total) { return finish(); }
      const free = state.map((st, i) => (st.up ? -1 : i)).filter((i) => i >= 0);
      if (!free.length) return schedule(200);
      const i = pick(free);
      const wantSquare = Math.random() < 0.5;
      let value;
      if (wantSquare) value = pick(SQUARES);
      else { do { value = randInt(2, 150); } while (isSquare(value)); }
      if (wantSquare) squaresShown++;
      pops++; $('#hunt-pop', hud).textContent = pops;
      const st = state[i]; st.up = true; st.value = value; st.done = false;
      const m = mounds[i]; m.classList.remove('is-hit', 'is-miss', 'is-late'); $('.mound-num', m).textContent = value; m.setAttribute('aria-label', `plot showing ${value}`); m.classList.add('is-up');
      SFX.tick();
      const upTime = Math.max(1150, 1800 - pops * 28);
      timers.push(setTimeout(() => {
        if (st.up && !st.done) {
          if (isSquare(st.value)) { missed++; m.classList.add('is-late'); msg.innerHTML = `${st.value} was a square! (${Math.sqrt(st.value)} × ${Math.sqrt(st.value)})`; }
          st.done = true;
        }
        timers.push(setTimeout(() => { m.classList.remove('is-up'); st.up = false; }, 160));
      }, upTime));
      schedule(Math.max(520, 820 - pops * 12));
    }
    function tap(i) {
      const st = state[i], m = mounds[i];
      if (!running || !st.up || st.done) return;
      st.done = true;
      if (isSquare(st.value)) { hits++; m.classList.add('is-hit'); SFX.pop(); msg.innerHTML = `${st.value} = ${Math.sqrt(st.value)} × ${Math.sqrt(st.value)} ✓`; $('#hunt-hits', hud).textContent = hits; }
      else { wrongTaps++; m.classList.add('is-miss'); SFX.wrong(); const f = squareFit(st.value); msg.innerHTML = `${st.value} isn't a square: ${f.side} × ${f.side} = ${f.side * f.side}, with ${f.leftover} left over.`; }
      timers.push(setTimeout(() => { m.classList.remove('is-up'); st.up = false; }, 420));
    }
    function finish() {
      running = false;
      timers.forEach(clearTimeout);
      const totalDecisions = squaresShown + wrongTaps;
      const correct = hits;
      const acc = totalDecisions ? correct / totalDecisions : 1;
      $$('.mound', board).forEach((m) => m.classList.remove('is-up'));
      Feedback.show({ kind: acc >= 0.8 ? 'good' : 'reveal', title: `Hunt over: ${hits} squares caught`, body: `${missed ? `${missed} slipped past. ` : ''}${wrongTaps ? `${wrongTaps} weren't squares. ` : ''}${acc >= 0.8 ? 'Sharp eyes!' : 'Keep the list of square numbers in your head and try again later.'}`, onButton: () => ctx.done({ scored: true, batch: { correct, total: Math.max(1, totalDecisions) } }) });
    }
    return () => { timers.forEach(clearTimeout); Feedback.hide(); };
  },

  /* ---------- Estimate: drag a pin to where √n lives ---------- */
  estimate(host, step, ctx) {
    const n = step.n, truth = Math.sqrt(n), lo = Math.floor(truth), hi = lo + 1;
    const start = clamp(lo - 2, 0, 7);
    let tries = 0;
    const s = stageEl('stage-pad');
    s.append(speech('think', step.text || `Where does ${radical(n)} live on the number line? Drag the pin, then check.`));
    s.append(h('div', { class: 'spacer' }), h('div', { class: 'eq eq--huge', html: `${radical(n)} ≈ <span class="hl2" id="est-val">${fmt(start + 2.5, 1)}</span>` }));
    const lineWrap = h('div', {});
    const line = numberLine({ start, value: start + 2.5, interactive: true, onChange: (v) => { $('#est-val', s).textContent = fmt(v, 1); } });
    lineWrap.append(line.el);
    const help = h('div', { class: 'nline-help' }, 'The boxes show square numbers. Which two is ' + n + ' between?');
    const checkBtn = h('button', { type: 'button', class: 'btn btn--wide', onclick: check }, frag(icon('search')), 'Check my estimate');
    s.append(lineWrap, help, h('div', { class: 'actions' }, checkBtn));
    host.append(s);
    function explain() {
      const closer = n - lo * lo < hi * hi - n ? lo : hi;
      return `${n} is between <b>${lo * lo}</b> (${lo}<sup>2</sup>) and <b>${hi * hi}</b> (${hi}<sup>2</sup>), closer to ${closer * closer}. So ${radical(n)} is ${closer === lo ? 'a bit more than' : 'a bit less than'} ${closer}: about <b>${fmt(truth)}</b>.`;
    }
    function check() {
      const guess = line.value, diff = Math.abs(guess - truth);
      const ok = diff <= (step.tolerance || 0.3);
      if (ok || tries >= 1) {
        line.lock(); checkBtn.disabled = true; help.remove();
        lineWrap.innerHTML = ''; lineWrap.append(numberLine({ start, value: guess, truth, highlight: [lo, hi] }).el);
        if (ok) {
          SFX.correct(); const first = tries === 0; ctx.award(first ? XP_FIRST : XP_SECOND, checkBtn);
          ctx.gotBadges(Store.recordAnswer(true));
          if (diff <= 0.2) ctx.closeEstimate();
          Feedback.show({ kind: 'good', title: diff <= 0.1 ? 'Bullseye!' : 'Great estimate!', body: explain(), onButton: () => ctx.done({ scored: true, correct: true, firstTry: first }) });
        } else {
          SFX.wrong(); ctx.gotBadges(Store.recordAnswer(false));
          Feedback.show({ kind: 'reveal', title: `${radical(n)} ≈ ${fmt(truth)}`, body: explain(), onButton: () => ctx.done({ scored: true, correct: false, firstTry: false }) });
        }
      } else {
        tries++; SFX.wrong();
        lineWrap.innerHTML = ''; const l2 = numberLine({ start, value: guess, interactive: true, highlight: [lo, hi], onChange: (v) => { $('#est-val', s).textContent = fmt(v, 1); } });
        lineWrap.append(l2.el); Object.assign(line, { get value() { return l2.value; }, lock: () => l2.lock() });
        Feedback.show({ kind: 'bad', title: 'Not there yet', body: `${n} sits between <b>${lo * lo}</b> and <b>${hi * hi}</b>, so the root is between ${lo} and ${hi}. Which one is it closer to?`, button: 'Try again' });
      }
    }
    return () => Feedback.hide();
  },

  /* ---------- Rush: 60-second fluency challenge ---------- */
  rush(host, step, ctx) {
    const s = stageEl();
    const DUR = step.seconds || 60;
    let left = DUR, score = 0, streak = 0, answered = 0, q = null, timer = null, running = false;
    const hud = h('div', { class: 'rush-hud' }, h('span', { html: `Score <span class="big tnum" id="rush-score">0</span>` }), h('span', { class: 'big tnum', id: 'rush-time' }, `${DUR}`), h('span', { class: 'streak', id: 'rush-streak', html: `${icon('fire')} 0` }));
    const bar = h('div', { class: 'timer' }, h('i', { style: { width: '100%' } }));
    const qEl = h('div', { class: 'rush-q' });
    const pad = numpad({ onSubmit: submit, maxLen: 3 });
    const startBtn = h('button', { type: 'button', class: 'btn btn--grape btn--big btn--wide', onclick: start }, frag(icon('timer')), 'Start the rush');
    const intro = h('div', { class: 'stack' }, speech('cheer', step.text), h('div', { class: 'actions' }, startBtn));
    s.append(intro);
    host.append(s);
    function next() {
      const kind = Math.random() < 0.5 ? 'sq' : 'root';
      const n = randInt(1, 12);
      q = kind === 'sq' ? { html: `${n}<sup>2</sup> = ?`, answer: n * n } : { html: `${radical(n * n)} = ?`, answer: n };
      qEl.innerHTML = `<div class="eq">${q.html}</div>`;
      pad.clear(); pad.unlock();
    }
    function start() {
      running = true; intro.remove();
      s.append(hud, bar, qEl, pad.el, h('div', { class: 'kbd-note', style: { marginTop: '10px' } }, 'Keyboard works too: type and press Enter.'));
      next();
      timer = setInterval(() => {
        left--; $('#rush-time', hud).textContent = left; $('i', bar).style.width = `${(left / DUR) * 100}%`;
        if (left <= 10) { bar.classList.add('is-low'); SFX.tick(); }
        if (left <= 0) finish();
      }, 1000);
    }
    function submit(v) {
      if (!running) return;
      answered++;
      if (v === q.answer) {
        streak++; score += 1 + (streak % 5 === 0 ? 2 : 0); SFX.pop(); pad.mark('good');
        if (streak % 5 === 0) { toast(`Streak ${streak}! +2 bonus`); SFX.star(); }
        Store.recordAnswer(true);
      } else {
        streak = 0; SFX.wrong(); pad.mark('bad'); toast(`${q.html.replace(' = ?', '')} = ${q.answer}`.replace(/<[^>]+>/g, (m) => m), 1200);
        Store.recordAnswer(false);
      }
      $('#rush-score', hud).textContent = score;
      const st = $('#rush-streak', hud); st.innerHTML = `${icon('fire')} ${streak}`; st.classList.toggle('is-hot', streak >= 5);
      setTimeout(next, 260);
    }
    function finish() {
      running = false; clearInterval(timer); pad.lock();
      const { isNew, newBadges } = Store.setRushBest(score);
      ctx.gotBadges(newBadges);
      s.innerHTML = '';
      s.append(h('div', { class: 'rush-results' },
        frag(mascot(score >= 10 ? 'cheer' : 'happy')),
        h('div', { class: 'rush-score tnum' }, String(score)),
        h('div', { class: 'rush-best', html: isNew && score > 0 ? `${icon('trophy')} New best score!` : `Best: ${Store.state.rush.best}` }),
        h('p', { class: 'stage-text center' }, `${answered} answered in ${DUR} seconds.`),
        h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'btn btn--grape', onclick: () => { SFX.tap(); ctx.restart(); } }, frag(icon('refresh')), 'Again'),
          h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => { SFX.tap(); ctx.done({ scored: false, rushScore: score }); } }, frag(icon('home')), 'Garden'))));
      if (score >= 10) Confetti.burst({ count: 120 });
      SFX.win();
    }
    return () => { clearInterval(timer); pad.destroy(); Feedback.hide(); };
  },
};
