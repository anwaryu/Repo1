/* Rad Roots — screens, level runner, modals, boot */
'use strict';

const App = (() => {
  const root = document.getElementById('app');
  let cleanup = null;

  /* ---------- Screen switching ---------- */
  function setScreen(narrow, render) {
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    Feedback.hide(); closeModal();
    root.innerHTML = '';
    root.className = `app ${narrow ? 'app--narrow' : ''}`;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    cleanup = render() || null;
  }

  /* ---------- Top bar ---------- */
  function topbar() {
    const st = Store.state;
    const bar = h('header', { class: 'topbar' },
      h('a', { class: 'brand', href: '#', 'aria-label': 'Rad Roots home', onclick: (e) => { e.preventDefault(); home(); } }, frag(mascot('happy')), h('span', { class: 'brand-name', html: 'Rad<span>Roots</span>' })),
      h('span', { class: 'chip chip--xp', title: 'experience points', 'aria-label': `${st.xp} experience points`, html: `${icon('bolt')}<span class="tnum">${st.xp}</span><span class="chip-suffix">&nbsp;XP</span>` }),
      h('span', { class: 'chip chip--star', title: 'stars earned', 'aria-label': `${Store.totalStars()} of ${MAX_STARS} stars`, html: `${icon('star')}<span class="tnum">${Store.totalStars()}</span><span class="chip-suffix">/${MAX_STARS}</span>` }),
      soundButton(),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'settings', html: icon('gear'), onclick: () => { SFX.tap(); openSettings(); } }));
    return bar;
  }
  function soundButton() {
    const b = h('button', { type: 'button', class: 'icon-btn', 'aria-label': SFX.enabled ? 'mute sounds' : 'unmute sounds', 'aria-pressed': String(SFX.enabled), html: icon(SFX.enabled ? 'soundOn' : 'soundOff') });
    b.addEventListener('click', () => {
      SFX.setEnabled(!SFX.enabled); Store.setSetting('sound', SFX.enabled);
      b.innerHTML = icon(SFX.enabled ? 'soundOn' : 'soundOff'); b.setAttribute('aria-pressed', String(SFX.enabled)); b.setAttribute('aria-label', SFX.enabled ? 'mute sounds' : 'unmute sounds');
      if (SFX.enabled) SFX.pop();
    });
    return b;
  }

  /* ---------- Home ---------- */
  function home() {
    setScreen(false, () => {
      const st = Store.state;
      const { rank, next } = Store.rankFor(st.xp);
      const nextLevel = LEVELS.find((l) => Store.isUnlocked(l.id) && Store.levelInfo(l.id).stars === 0) || null;
      const played = Object.keys(st.levels).length > 0;

      root.append(topbar());

      const heroTitle = played ? 'Welcome back, <em>gardener</em>.' : 'Grow squares.<br>Find <em>roots</em>.';
      const heroSub = played
        ? (nextLevel ? `Next up: <b>${nextLevel.name}</b> in the ${nextLevel.place}.` : 'Every plot is grown. Replay for 3 stars, or race the clock in the Greenhouse.')
        : 'Every square number hides a root. Dig it up with Rad the Radish, one garden plot at a time.';
      const pct = next ? Math.round(((st.xp - rank.xp) / (next.xp - rank.xp)) * 100) : 100;
      const hero = h('section', { class: 'hero' },
        frag(mascot(played ? 'happy' : 'wink')),
        h('div', {},
          h('h1', { class: 'hero-title', html: heroTitle }),
          h('p', { class: 'hero-sub', html: heroSub }),
          h('div', { class: 'hero-rank' },
            h('span', { class: 'rank-pill', html: `${icon('ribbon')}${rank.name}` }),
            h('div', { class: 'xp-bar', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': 'progress to next rank' }, h('i', { style: { width: `${pct}%` } })),
            h('span', { class: 'xp-note tnum' }, next ? `${next.xp - st.xp} XP to ${next.name}` : 'Top rank!'))));
      root.append(hero);

      if (nextLevel) {
        root.append(h('div', { class: 'actions', style: { marginTop: '14px' } },
          h('button', { type: 'button', class: 'btn btn--big', onclick: () => { SFX.tap(); level(nextLevel.id); } }, frag(icon('play')), played ? `Continue: ${nextLevel.name}` : 'Start growing')));
      }

      root.append(h('div', { class: 'section-head' }, h('h2', {}, 'The garden path'), h('span', { class: 'xp-note tnum' }, `${Store.totalStars()} of ${MAX_STARS} stars`)));

      const map = h('section', { class: 'map', 'aria-label': 'garden plots' });
      map.append(frag('<svg class="map-path" aria-hidden="true"><path d=""/></svg>'));
      for (const lv of LEVELS) {
        const info = Store.levelInfo(lv.id), unlocked = Store.isUnlocked(lv.id);
        const isCurrent = nextLevel && nextLevel.id === lv.id;
        const card = h('button', { type: 'button', class: `plot plot--${lv.color} ${unlocked ? '' : 'plot--locked'} ${isCurrent ? 'plot--current' : ''}`, 'aria-label': `${lv.name}, ${lv.place}${unlocked ? '' : ', locked'}`, disabled: !unlocked,
          onclick: () => { SFX.tap(); level(lv.id); } });
        card.append(h('div', { class: 'plot-band' }, h('span', { class: 'plot-place' }, lv.place), h('span', { class: 'plot-no' }, lv.kind === 'rush' ? 'Bonus' : `Plot ${lv.id}`)));
        const side = h('div', { class: 'plot-side' });
        if (!unlocked) side.append(h('span', { class: 'plot-lock', html: icon('lock') }), h('span', { class: 'plot-lockmsg' }, lv.id === 7 ? 'Finish all 6 plots' : `Finish plot ${lv.id - 1}`));
        else if (lv.kind === 'rush') side.append(h('span', { class: 'plot-cta', html: `${icon('trophy')} Best ${st.rush.best}` }));
        else { side.append(frag(starsHTML(info.stars))); if (isCurrent) side.append(h('span', { class: 'plot-cta', html: `${icon('play')} ${played ? 'Next' : 'Start here'}` })); }
        card.append(h('div', { class: 'plot-main' },
          h('div', { class: 'plot-icon', html: icon(lv.icon) }),
          h('div', { class: 'plot-text' }, h('div', { class: 'plot-name' }, lv.name), h('div', { class: 'plot-skill' }, lv.skill)),
          side));
        map.append(card);
      }
      root.append(map);

      const foot = h('section', { class: 'home-foot' },
        h('div', { class: 'mini-cards' },
          h('button', { type: 'button', class: 'mini-card', onclick: () => { SFX.tap(); badges(); } }, h('span', { class: 'mini-card-icon', html: icon('ribbon') }), h('span', {}, h('b', {}, 'Badges'), h('span', {}, `${st.badges.length} of ${BADGES.length} earned`))),
          h('button', { type: 'button', class: 'mini-card', onclick: () => { SFX.tap(); parents(); } }, h('span', { class: 'mini-card-icon', style: { background: 'var(--sky-soft)', color: 'var(--sky-ink)' }, html: icon('book') }), h('span', {}, h('b', {}, 'Parents & teachers'), h('span', {}, 'How Rad Roots teaches')))));
      const tip = installTip();
      if (tip) foot.append(tip);
      root.append(foot);

      const draw = () => drawMapPath(map);
      requestAnimationFrame(draw);
      const ro = 'ResizeObserver' in window ? new ResizeObserver(draw) : null;
      if (ro) ro.observe(map);
      window.addEventListener('resize', draw);
      document.fonts && document.fonts.ready.then(draw).catch(() => {});
      return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', draw); };
    });
  }

  function drawMapPath(map) {
    const svg = $('.map-path', map), plots = $$('.plot', map);
    if (!svg || plots.length < 2) return;
    const r = map.getBoundingClientRect();
    const pts = plots.map((p) => { const b = p.getBoundingClientRect(); return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 }; });
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2; d += ` C${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`; }
    svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    $('path', svg).setAttribute('d', d);
  }

  /* ---------- Level runner ---------- */
  function level(id) {
    const lv = levelById(id);
    if (!lv || !Store.isUnlocked(lv.id)) return home();
    const steps = lv.steps();
    const stats = { scored: 0, correct: 0, xp: 0, badges: [], rushScore: null };
    let i = 0, stepCleanup = null;

    setScreen(true, () => {
      const head = h('div', { class: 'level-head' },
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'back to garden', html: icon('back'), onclick: () => { SFX.tap(); confirmLeave(); } }),
        h('div', { class: 'level-title' }, h('div', { class: 'level-place' }, lv.place), h('div', { class: 'level-name' }, lv.name)),
        soundButton());
      const progress = h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'lesson progress', 'aria-valuemin': 0, 'aria-valuemax': steps.length, 'aria-valuenow': 0 }, steps.map(() => h('i')));
      const stage = h('main', { id: 'stage' });
      root.append(head, progress, stage);
      showStep();

      function showStep() {
        if (stepCleanup) { try { stepCleanup(); } catch (e) { /* ignore */ } stepCleanup = null; }
        Feedback.hide();
        stage.innerHTML = '';
        $$('i', progress).forEach((el, k) => { el.className = k < i ? 'done' : k === i ? 'now' : ''; });
        progress.setAttribute('aria-valuenow', i);
        window.scrollTo({ top: 0 });
        const step = steps[i];
        const ctx = {
          level: lv, stats,
          done(result) {
            if (result && result.scored) {
              if (result.batch) { stats.scored += result.batch.total; stats.correct += result.batch.correct; }
              else { stats.scored++; if (result.correct) stats.correct++; }
            }
            if (result && result.rushScore != null) stats.rushScore = result.rushScore;
            i++;
            if (i >= steps.length) finish(); else showStep();
          },
          award(xp, anchor) {
            Store.addXp(xp); stats.xp += xp;
            const r = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
            floatXp(xp, r ? r.left + r.width / 2 : window.innerWidth / 2, r ? r.top : window.innerHeight / 2);
          },
          gotBadges(list) {
            for (const b of list || []) {
              if (!stats.badges.find((x) => x.id === b.id)) { stats.badges.push(b); SFX.badge(); toast(`Badge unlocked: ${b.name}`, 2200); }
            }
          },
          closeEstimate() { ctx.gotBadges(Store.recordCloseEstimate()); },
          restart() { showStep(); },
        };
        const fn = STEPS[step.type];
        if (!fn) { console.error('Unknown step type', step.type); return ctx.done({ scored: false }); }
        stepCleanup = fn(stage, step, ctx) || null;
      }

      function finish() {
        if (stepCleanup) { try { stepCleanup(); } catch (e) { /* ignore */ } stepCleanup = null; }
        if (lv.kind === 'rush') return home();
        const acc = stats.scored ? stats.correct / stats.scored : 1;
        const stars = acc >= 0.9 ? 3 : acc >= 0.65 ? 2 : 1;
        const bonus = 20 * stars;
        const { newBadges } = Store.completeLevel(lv.id, { stars, accuracy: acc, xp: bonus });
        stats.xp += bonus;
        for (const b of newBadges) if (!stats.badges.find((x) => x.id === b.id)) stats.badges.push(b);
        showComplete(lv, { stars, acc, xp: stats.xp, badges: stats.badges });
      }

      function confirmLeave() {
        if (i === 0 || i >= steps.length) return home();
        openModal(h('div', { class: 'complete' },
          frag(mascot('think')),
          h('h2', { class: 'modal-title' }, 'Leave this plot?'),
          h('p', { class: 'modal-sub' }, 'Your progress in this plot won\'t be saved. XP you earned stays with you.'),
          h('div', { class: 'actions' },
            h('button', { type: 'button', class: 'btn', onclick: () => { SFX.tap(); closeModal(); } }, 'Keep playing'),
            h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => { SFX.tap(); home(); } }, 'Leave'))));
      }

      return () => { if (stepCleanup) stepCleanup(); };
    });
  }

  /* ---------- Completion ---------- */
  function showComplete(lv, { stars, acc, xp, badges: got }) {
    const next = LEVELS.find((l) => l.id === lv.id + 1);
    const body = h('div', { class: 'complete' },
      frag(mascot(stars === 3 ? 'cheer' : 'happy')),
      h('h2', { class: 'modal-title' }, stars === 3 ? 'Perfect plot!' : 'Plot complete!'),
      h('p', { class: 'modal-sub' }, `${lv.name} · ${lv.place}`),
      frag(starsHTML(stars, true)),
      h('div', { class: 'complete-stats' },
        h('div', { class: 'stat' }, h('b', {}, `${Math.round(acc * 100)}%`), h('span', {}, 'accuracy')),
        h('div', { class: 'stat stat--xp' }, h('b', {}, `+${xp}`), h('span', {}, 'XP')),
        h('div', { class: 'stat' }, h('b', {}, String(Store.state.bestStreak)), h('span', {}, 'best streak'))),
      got.length ? h('div', { class: 'new-badges' }, got.map((b, k) => h('div', { class: 'new-badge', style: { animationDelay: `${k * 120}ms` } }, h('span', { class: 'badge-icon', html: icon(b.icon) }), h('span', {}, h('b', {}, b.name), h('span', {}, b.desc))))) : null,
      stars < 3 ? h('p', { class: 'modal-sub', style: { fontSize: '14px' } }, 'Replay any time to grow all three stars.') : null,
      h('div', { class: 'actions' },
        next && Store.isUnlocked(next.id) ? h('button', { type: 'button', class: 'btn', onclick: () => { SFX.tap(); level(next.id); } }, next.kind === 'rush' ? 'Try Root Rush' : `Next: ${next.name}`, frag(icon('next'))) : null,
        h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => { SFX.tap(); level(lv.id); } }, frag(icon('refresh')), 'Replay'),
        h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => { SFX.tap(); home(); } }, frag(icon('home')), 'Garden')));
    openModal(body);
    SFX.win();
    for (let k = 0; k < stars; k++) setTimeout(() => SFX.star(), 300 + k * 220);
    setTimeout(() => Confetti.burst({ count: 70 + stars * 30 }), 250);
    if (stars === 3) setTimeout(() => Confetti.burst({ x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, count: 50 }), 700);
    if (got.length) setTimeout(() => SFX.badge(), 900);
  }

  /* ---------- Badges ---------- */
  function badges() {
    setScreen(true, () => {
      root.append(topbar());
      root.append(h('div', { class: 'section-head' }, h('h2', {}, 'Badges'), h('button', { type: 'button', class: 'link', onclick: () => { SFX.tap(); home(); } }, 'Back to garden')));
      const st = Store.state;
      const grid = h('div', { class: 'badge-grid' }, BADGES.map((b) => {
        const has = st.badges.includes(b.id);
        return h('div', { class: `badge ${has ? '' : 'badge--locked'}`, 'aria-label': `${b.name}${has ? '' : ', not yet earned'}` }, h('span', { class: 'badge-icon', html: icon(has ? b.icon : 'lock') }), h('b', {}, b.name), h('span', {}, b.desc));
      }));
      root.append(h('div', { class: 'stage' }, h('p', { class: 'stage-text', style: { marginBottom: '14px' } }, `${st.badges.length} of ${BADGES.length} earned. Each badge marks a real skill, not just time spent.`), grid));
    });
  }

  /* ---------- Parents & teachers ---------- */
  function parents() {
    setScreen(true, () => {
      root.append(topbar());
      root.append(h('div', { class: 'section-head' }, h('h2', {}, 'Parents & teachers'), h('button', { type: 'button', class: 'link', onclick: () => { SFX.tap(); home(); } }, 'Back to garden')));
      const s = h('div', { class: 'stage prose' });
      s.innerHTML = `
        <p><b>Rad Roots</b> teaches square roots for ages 8 to 12 the way mathematicians first met them: as the side of a square. Before any symbol appears, kids build squares out of tiles, feel which counts work and which leave tiles over, and only then meet the ${radical('&nbsp;')} sign as a question: <i>what number, times itself, makes this?</i></p>
        <h2>How the garden is organised</h2>
        <p>Each plot targets one idea and ends with a short mastery check. Stars reflect accuracy (3 stars at 90%), never speed, except in the optional Greenhouse rush.</p>
        <div class="table-wrap"><table class="skill-table">
          <thead><tr><th>Plot</th><th>Idea</th><th>How kids work with it</th></tr></thead>
          <tbody>
            <tr><td>1 · Seed Patch</td><td>Square numbers</td><td>Grow squares with a slider; sort counts into square / not square and watch leftover tiles fall off.</td></tr>
            <tr><td>2 · Root Cellar</td><td>The radical sign, root as inverse</td><td>See the root drawn under the square; run a machine where SQUARE and ROOT undo each other.</td></tr>
            <tr><td>3 · Bloom Field</td><td>Odd-number growth, recognition</td><td>Add layers and see 1 + 3 + 5 + 7 = 16; catch square numbers as they pop up.</td></tr>
            <tr><td>4 · Wild Meadow</td><td>Estimating √ of non-squares</td><td>Trap a root between two whole numbers; drag a pin on a number line and get feedback on closeness.</td></tr>
            <tr><td>5 · Weed Patrol</td><td>Misconceptions</td><td>Pull the weeds: √16 = 8 (root is not half), 5² = 10 (squaring is not doubling), and friends.</td></tr>
            <tr><td>6 · Big World</td><td>Application</td><td>Gardens, pixel pictures, marching bands and floors with a known area.</td></tr>
            <tr><td>7 · Greenhouse</td><td>Fluency (optional)</td><td>A 60-second rush, unlocked only after the concepts are secure.</td></tr>
          </tbody>
        </table></div>
        <h2>Design choices that matter</h2>
        <ul>
          <li><b>Concrete before abstract.</b> Tiles first, numbers second, the ${radical('&nbsp;')} symbol last.</li>
          <li><b>Errors are lessons.</b> A wrong answer opens a hint and a second try. On a second miss, the answer is shown with its reason. Nothing is lost, nobody gets a red X wall.</li>
          <li><b>Direct manipulation over multiple choice.</b> Sliders, levers, draggable pins and taps carry the thinking whenever possible.</li>
          <li><b>Misconceptions get their own plot.</b> "Root means half" and "square means double" are the two big ones, and they are named and busted, not avoided.</li>
          <li><b>Gentle gamification.</b> Stars, XP and badges reward skills. There are no lives, no leaderboards and no timers until the concept is secure.</li>
          <li><b>Accessible.</b> Keyboard works everywhere (digits and Enter for answers, arrows on the number line). Motion can be reduced in settings. Colour is never the only signal.</li>
        </ul>
        <h2>Try this away from the screen</h2>
        <ul>
          <li>Arrange 12 coins into a square. Then 16. Ask: how many does a square with 5 on each side need?</li>
          <li>Ask for a "root estimate" at the table: is √40 closer to 6 or 7? Why?</li>
          <li>Find squares in the house: window panes, floor tiles, a chessboard. Count one side, predict the total.</li>
        </ul>
        <p>Progress is saved on this device only. Use the settings gear to reset it for a new learner.</p>`;
      root.append(s);
    });
  }

  /* ---------- Modals ---------- */
  const overlay = document.getElementById('overlay');
  function openModal(content) {
    overlay.innerHTML = '';
    const m = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }, content);
    overlay.append(m); overlay.hidden = false;
    requestAnimationFrame(() => { const f = $('.btn', m); if (f) f.focus({ preventScroll: true }); });
  }
  function closeModal() { overlay.hidden = true; overlay.innerHTML = ''; }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) { /* stay open: modals here need an explicit choice */ } });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden && !$('.complete', overlay)) closeModal(); });

  function openSettings() {
    const st = Store.state;
    const sw = (checked, label, sub, onToggle) => {
      const b = h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(checked), 'aria-label': label });
      b.addEventListener('click', () => { const v = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', String(v)); onToggle(v); SFX.tap(); });
      return h('div', { class: 'setting' }, h('div', {}, h('b', {}, label), h('span', {}, sub)), b);
    };
    const resetRow = h('div', { class: 'setting' }, h('div', {}, h('b', {}, 'Start over'), h('span', {}, 'Clears stars, XP and badges on this device.')), h('button', { type: 'button', class: 'btn btn--ghost btn--small', onclick: (e) => {
      const btn = e.currentTarget;
      btn.replaceWith(h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn--berry btn--small', onclick: () => { Store.reset(); SFX.setEnabled(Store.state.settings.sound); applyMotion(); closeModal(); toast('Garden reset. Fresh soil!'); home(); } }, 'Yes, reset'), h('button', { type: 'button', class: 'btn btn--ghost btn--small', onclick: () => { closeModal(); openSettings(); } }, 'Keep')));
    } }, 'Reset'));
    openModal(h('div', {},
      h('h2', { class: 'modal-title' }, 'Settings'),
      h('div', { style: { marginTop: '12px' } },
        sw(st.settings.sound, 'Sounds', 'Pops, chimes and fanfares', (v) => { SFX.setEnabled(v); Store.setSetting('sound', v); refreshSoundButtons(); }),
        sw(st.settings.motion === 'reduce', 'Reduce motion', 'Calmer animations, no confetti', (v) => { Store.setSetting('motion', v ? 'reduce' : 'auto'); applyMotion(); }),
        resetRow),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => { SFX.tap(); closeModal(); parents(); } }, frag(icon('book')), 'Parents & teachers'),
        h('button', { type: 'button', class: 'btn', onclick: () => { SFX.tap(); closeModal(); } }, 'Done')),
      h('p', { class: 'card-hint', style: { marginTop: '14px' } }, 'Rad Roots · a square-root garden · progress is saved on this device')));
  }
  function refreshSoundButtons() { $$('.icon-btn[aria-pressed]').forEach((b) => { b.innerHTML = icon(SFX.enabled ? 'soundOn' : 'soundOff'); b.setAttribute('aria-pressed', String(SFX.enabled)); }); }
  function applyMotion() { document.documentElement.dataset.motion = Store.state.settings.motion === 'reduce' ? 'reduce' : ''; }

  function welcome() {
    openModal(h('div', { class: 'complete' },
      frag(mascot('wink')),
      h('h2', { class: 'modal-title' }, 'Hi! I\'m Rad the Radish.'),
      h('p', { class: 'modal-sub', html: `Did you know the ${radical('&nbsp;')} sign is called a <b>radical</b>? It means <b>root</b>, just like a radish. Let's grow some squares and dig up their roots!` }),
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn--big btn--wide', onclick: () => { SFX.unlock(); SFX.pop(); Store.markSeen('welcome'); closeModal(); } }, 'Let\'s grow!', frag(icon('next'))))));
  }

  /* ---------- Boot ---------- */
  function boot() {
    SFX.setEnabled(Store.state.settings.sound);
    applyMotion();
    onFirstInteraction(() => SFX.unlock());
    const sky = h('div', { class: 'sky', 'aria-hidden': 'true', html: `<svg viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="var(--hill-1)" d="M0 200 C 240 120, 480 120, 720 190 S 1200 260, 1440 180 L1440 320 L0 320 Z"/><path fill="var(--hill-2)" d="M0 260 C 300 200, 600 220, 900 250 S 1300 300, 1440 240 L1440 320 L0 320 Z"/></svg>` });
    document.body.prepend(sky);
    home();
    if (!Store.state.seen.welcome) welcome();
    registerServiceWorker();
  }

  /* ---------- Installable app (add to home screen, offline) ---------- */
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; refreshInstallTip(); });
  window.addEventListener('appinstalled', () => { deferredInstall = null; Store.markSeen('install'); const t = $('.install-tip'); if (t) t.remove(); toast('Rad Roots is on your home screen'); });
  function isStandalone() { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  function installTip() {
    const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!touch || isStandalone() || Store.state.seen.install) return null;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const how = isIOS
      ? 'In Safari, tap Share (the square with an arrow), then "Add to Home Screen".'
      : deferredInstall ? 'Full screen, no browser bar, and it works offline.' : 'Open the browser menu and choose "Add to Home screen".';
    const tip = h('div', { class: 'install-tip', role: 'note' },
      h('span', { class: 'mini-card-icon', html: icon('seed') }),
      h('span', { class: 'install-text' }, h('b', {}, 'Put Rad Roots on your home screen'), h('span', {}, how)),
      h('span', { class: 'row' },
        deferredInstall ? h('button', { type: 'button', class: 'btn btn--sun btn--small', onclick: async () => {
          SFX.tap(); const p = deferredInstall; if (!p) return;
          p.prompt(); try { await p.userChoice; } catch (e) { /* dismissed */ }
          deferredInstall = null;
        } }, 'Install') : null,
        h('button', { type: 'button', class: 'btn btn--ghost btn--small', onclick: () => { SFX.tap(); Store.markSeen('install'); tip.remove(); } }, 'Not now')));
    return tip;
  }
  function refreshInstallTip() {
    const old = $('.install-tip');
    if (!old) return;
    const fresh = installTip();
    if (fresh) old.replaceWith(fresh); else old.remove();
  }
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
    const register = () => navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is a bonus, never a blocker */ });
    if (document.readyState === 'complete') register(); else window.addEventListener('load', register);
  }

  return { boot, home, level, badges, parents };
})();

// Artifacts hot-reload hook is optional; plain pages boot directly.
if (window.claude && window.claude.hot && typeof window.claude.hot.ready === 'function') window.claude.hot.ready(() => App.boot());
else App.boot();
