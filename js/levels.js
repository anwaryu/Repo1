/* Rad Roots — the seven plots: learning content in Rad's voice */
'use strict';

const yesNoSquare = {
  yes: { label: 'Square!', sub: 'no tiles left over', icon: 'grid', good: 'It\'s a square!', fix: 'It is a square.' },
  no: { label: 'Not a square', sub: 'some left over', icon: 'x', cls: 'btn--berry', good: 'Not a square!', fix: 'Not a square.' },
};
const flowerWeed = {
  yes: { label: 'True', sub: 'keep the flower', icon: 'flower', good: 'It\'s true!', fix: 'Actually, it\'s true.' },
  no: { label: 'False', sub: 'pull the weed', icon: 'weed', cls: 'btn--berry', good: 'Weed pulled!', fix: 'That was a weed.' },
};

const gridHint = (n, text) => ({ visual: () => tileGrid(n, { size: 'sm' }), text: text || `Count the tiles along one side.` });
const gnomonVisual = (from) => () => { const g = tileGrid(from, { size: 'sm' }); requestAnimationFrame(() => setTimeout(() => morphGrid(g, from + 1, { markNew: true, hue: from + 1 }), 500)); return g; };

const LEVELS = [
  {
    id: 1, place: 'Seed Patch', name: 'Grow a Square', skill: 'What makes a number square', color: 'leaf', icon: 'seed',
    steps: () => [
      { type: 'intro', mood: 'wink', text: 'Welcome to the Seed Patch! I\'m <b>Rad</b>. Plant a number here and it grows into a <b>square</b> of tiles. Let\'s try it!', visual: () => h('div', { class: 'grid-wrap' }, tileGrid(3), h('div', { class: 'grid-caption' }, '3 rows of 3 tiles = 9 tiles')) },
      {
        type: 'build', start: 1,
        goals: [
          { text: 'Slide to grow a square with <b>4 tiles on each side</b>.', short: '4 tiles on each side', check: (n) => n === 4 },
          { text: 'Now make a square with <b>exactly 25 tiles</b>.', short: 'Exactly 25 tiles', check: (n) => n * n === 25 },
          { text: 'Grow a big one: a square with <b>100 tiles</b>.', short: '100 tiles', check: (n) => n * n === 100 },
          { text: 'Shrink it down to the tiniest square: <b>1 tile</b>.', short: 'Just 1 tile', check: (n) => n === 1 },
        ],
        doneTitle: 'Square numbers!', doneBody: '16, 25, 100 and 1 are <b>square numbers</b>: they make a full square with no tiles left over.',
      },
      { type: 'gallery', title: 'The square numbers', text: 'A <b>square number</b> is how many tiles you need for a full square. Here are the first twelve. Say them out loud: 1, 4, 9, 16…', after: 'We write 3 × 3 as <b>3<sup>2</sup></b> and say "three squared". So 3<sup>2</sup> = 9.' },
      {
        type: 'decide', text: 'Can this many tiles make a full square? Decide, then watch what happens.', ...yesNoSquare,
        items: [
          { prompt: '9 tiles', truth: true, explain: '9 = 3 × 3. Every tile has a place.', visual: () => fitVisual(9) },
          { prompt: '12 tiles', truth: false, explain: '12 makes a 3 × 3 square with 3 tiles left over. Not enough for 4 × 4.', visual: () => fitVisual(12) },
          { prompt: '25 tiles', truth: true, explain: '25 = 5 × 5.', visual: () => fitVisual(25) },
          { prompt: '20 tiles', truth: false, explain: '20 makes 4 × 4 with 4 left over. 5 × 5 would need 25.', visual: () => fitVisual(20) },
          { prompt: '36 tiles', truth: true, explain: '36 = 6 × 6.', visual: () => fitVisual(36) },
          { prompt: '15 tiles', truth: false, explain: '15 makes 3 × 3 with 6 left over. Between 9 and 16.', visual: () => fitVisual(15) },
        ],
      },
      { type: 'answer', prompt: 'What is three squared?', eq: `3<sup>2</sup> = ?`, answer: 9, hint: gridHint(3, '3 rows of 3 tiles.'), explain: '3 × 3 = 9.', wrongHint: 'Squared means times itself: 3 × 3.' },
      { type: 'answer', prompt: 'How many tiles are in a 7 × 7 square?', eq: `7 × 7 = ?`, answer: 49, hint: gridHint(7, 'Seven rows of seven.'), explain: '7 × 7 = 49, so 49 is a square number.' },
      { type: 'answer', prompt: 'What is six squared?', eq: `6<sup>2</sup> = ?`, answer: 36, hint: gridHint(6, 'Six rows of six.'), explain: '6 × 6 = 36.', wrongHint: 'Careful: squaring is not doubling. 6 × 6, not 6 + 6.' },
      { type: 'choice', prompt: 'Which square number comes right after 81?', choices: [{ html: '90' }, { html: '100', correct: true }, { html: '121' }, { html: '88' }], explain: '81 = 9 × 9. The next one is 10 × 10 = 100.', wrongHint: '81 is 9 × 9. What is 10 × 10?' },
      { type: 'answer', prompt: 'What is eleven squared?', eq: `11<sup>2</sup> = ?`, answer: 121, hint: gridHint(11, '11 × 11 = 11 tens + 11 ones = 110 + 11.'), explain: '11 × 11 = 121.' },
    ],
  },
  {
    id: 2, place: 'Root Cellar', name: 'Meet the Root', skill: 'The √ sign and what it undoes', color: 'soil', icon: 'root',
    steps: () => [
      { type: 'intro', mood: 'happy', text: 'Every square grew from a <b>root</b>. Dig down and you\'ll find it: the root is the number of tiles along one side.', visual: () => h('div', { class: 'grid-wrap' }, plantView(5, { showRoot: true }), h('div', { class: 'grid-caption', html: `25 tiles, 5 on each side, so ${radical(25)} = 5` })) },
      {
        type: 'card', title: 'The radical sign',
        build: () => h('div', {},
          h('div', { class: 'notation' },
            h('div', { class: 'eq', html: `${radical(25)} = 5` }),
            h('div', { class: 'notation-notes' },
              h('div', { class: 'note', html: `<i>1</i><span>This is the <b>radical sign</b>. It asks: <b>what number, times itself, makes this?</b></span>` }),
              h('div', { class: 'note', html: `<i>2</i><span>The number under its roof is where we start: <b>25</b>.</span>` }),
              h('div', { class: 'note', html: `<i>3</i><span>The answer is the <b>square root</b>: 5, because 5 × 5 = 25.</span>` }))),
          h('div', { class: 'fact', html: `${icon('sparkle')}<span><b>Rad fact:</b> "radical" comes from the Latin word <b>radix</b>, meaning root. So does the word <b>radish</b>. That\'s why I\'m your guide!</span>` })),
      },
      {
        type: 'build', start: 3, showRoot: true,
        goals: [
          { text: 'Grow a square with <b>36 tiles</b>. Watch the root grow with it.', short: '36 tiles', check: (n) => n * n === 36 },
          { text: 'Now grow a square whose <b>root is 8</b>.', short: 'Root of 8', check: (n) => n === 8 },
          { text: 'Make the root <b>12</b>: the biggest square in this garden.', short: 'Root of 12', check: (n) => n === 12 },
        ],
        doneTitle: 'Root found!', doneBody: `The root is always one side of the square: ${radical(36)} = 6, ${radical(64)} = 8, ${radical(144)} = 12.`,
      },
      {
        type: 'machine',
        goals: [
          { text: 'Type <b>6</b> and pull the <b>SQUARE</b> lever.', short: 'Square 6', check: (op, out) => op === 'square' && out === 36 },
          { text: 'Now pull the <b>ROOT</b> lever to undo it.', short: 'Root it back to 6', check: (op, out) => op === 'root' && out === 6, event: 'machine-undo' },
          { text: `Use the machine to find ${radical(81)}. Type 81, then pull ROOT.`, short: 'Find √81', check: (op, out) => op === 'root' && out === 9 },
        ],
        doneText: 'Square, then root, and you\'re back where you started. They <b>undo each other</b>, like tying and untying a shoe.',
      },
      { type: 'answer', prompt: 'What is the square root of 36?', eq: `${radical(36)} = ?`, answer: 6, hint: gridHint(6), explain: '6 × 6 = 36, so the root is 6.', wrongHint: 'Which number times itself makes 36?' },
      { type: 'answer', prompt: 'What is the square root of 4?', eq: `${radical(4)} = ?`, answer: 2, hint: gridHint(2), explain: '2 × 2 = 4.', wrongHint: 'Which number times itself makes 4?' },
      { type: 'answer', prompt: 'What is the square root of 100?', eq: `${radical(100)} = ?`, answer: 10, hint: gridHint(10), explain: '10 × 10 = 100.', wrongHint: 'Which number times itself makes 100?' },
      { type: 'answer', prompt: 'What is the square root of 64?', eq: `${radical(64)} = ?`, answer: 8, hint: gridHint(8), explain: '8 × 8 = 64.', wrongHint: 'Not half of 64! Which number times itself makes 64?' },
      { type: 'choice', prompt: 'Which square number has a root of 8?', choices: [{ html: '16' }, { html: '64', correct: true }, { html: '80' }, { html: '88' }], explain: 'A root of 8 means the square is 8 × 8 = 64.', wrongHint: 'Root 8 means 8 tiles on each side. How many tiles in all?' },
      { type: 'answer', prompt: 'What is the square root of 144?', eq: `${radical(144)} = ?`, answer: 12, hint: gridHint(12), explain: '12 × 12 = 144.' },
      { type: 'choice', prompt: 'Which of these is NOT a square number?', choices: [{ html: '25' }, { html: '36' }, { html: '48', correct: true }, { html: '49' }], explain: '48 sits between 36 (6 × 6) and 49 (7 × 7). It can\'t make a full square.', wrongHint: 'Try to find a number that times itself gives each one.' },
    ],
  },
  {
    id: 3, place: 'Bloom Field', name: 'Square Hunt', skill: 'Spot squares fast and see the hidden pattern', color: 'sun', icon: 'flower',
    steps: () => [
      { type: 'intro', mood: 'think', text: 'Squares grow in a secret pattern. Nobody told you this yet: it\'s all about <b>odd numbers</b>. Watch closely…' },
      { type: 'grow', text: 'Press <b>Grow</b> to add the next layer. Count the new golden tiles each time.', max: 7 },
      { type: 'answer', prompt: 'A 5 × 5 square has 25 tiles. How many tiles do we add to grow it into 6 × 6?', eq: `36 − 25 = ?`, answer: 11, hint: { visual: gnomonVisual(5), text: 'A new row, a new column, and one corner: 5 + 5 + 1.' }, explain: '5 + 5 + 1 = 11. Each layer adds the next odd number.' },
      { type: 'answer', prompt: 'Which odd number do we add to grow 9 × 9 into 10 × 10?', eq: `100 − 81 = ?`, answer: 19, hint: { visual: gnomonVisual(9), text: '9 + 9 + 1.' }, explain: '9 + 9 + 1 = 19. The 10th odd number!' },
      { type: 'hunt', text: 'Square numbers are popping up all over the Bloom Field. <b>Tap only the squares!</b>', pops: 24 },
    ],
  },
  {
    id: 4, place: 'Wild Meadow', name: 'Root Detective', skill: 'Estimate the root of any number', color: 'sky', icon: 'search',
    steps: () => [
      { type: 'intro', mood: 'think', text: `What about ${radical(20)}? 20 isn't a square number… but a good detective can still get close. Let's investigate!`, visual: () => h('div', { class: 'grid-wrap' }, fitVisual(20), h('div', { class: 'grid-caption' }, '20 tiles: a 4 × 4 square plus 4 spares')) },
      {
        type: 'card', title: 'Sandwich the root', text: '20 tiles make a 4 × 4 square with 4 left over. That\'s not enough for 5 × 5, which needs 25.',
        build: () => h('div', {}, numberLine({ start: 2, truth: Math.sqrt(20), highlight: [4, 5] }).el),
        after: `So ${radical(20)} is trapped between <b>4</b> and <b>5</b>. And 20 is closer to 16 than to 25, so ${radical(20)} is a bit more than 4: about <b>4.5</b>.`,
      },
      { type: 'choice', prompt: `${radical(50)} is between which two whole numbers?`, choices: [{ html: '5 and 6' }, { html: '6 and 7' }, { html: '7 and 8', correct: true }, { html: '8 and 9' }], explain: '49 < 50 < 64, so the root is between 7 and 8, just above 7.', wrongHint: 'Which two square numbers is 50 between?', after: () => numberLine({ start: 5, truth: Math.sqrt(50), highlight: [7, 8] }).el },
      { type: 'choice', prompt: `${radical(30)} is between which two whole numbers?`, choices: [{ html: '4 and 5' }, { html: '5 and 6', correct: true }, { html: '6 and 7' }, { html: '14 and 16' }], explain: '25 < 30 < 36, so the root is between 5 and 6.', wrongHint: '30 is between 25 and 36. What are their roots?', after: () => numberLine({ start: 3, truth: Math.sqrt(30), highlight: [5, 6] }).el },
      { type: 'choice', prompt: `${radical(90)} is between which two whole numbers?`, choices: [{ html: '8 and 9' }, { html: '9 and 10', correct: true }, { html: '10 and 11' }, { html: '44 and 46' }], explain: '81 < 90 < 100, so the root is between 9 and 10.', wrongHint: '90 is between 81 and 100.', after: () => numberLine({ start: 7, truth: Math.sqrt(90), highlight: [9, 10] }).el },
      { type: 'estimate', n: 10 },
      { type: 'estimate', n: 30 },
      { type: 'estimate', n: 72 },
      { type: 'estimate', n: 110 },
    ],
  },
  {
    id: 5, place: 'Weed Patrol', name: 'Pull the Myths', skill: 'Bust the classic mix-ups', color: 'berry', icon: 'weed',
    steps: () => [
      { type: 'intro', mood: 'oops', text: 'Uh-oh. Sneaky myths are sprouting in the garden. <b>True</b> statements are flowers: keep them. <b>False</b> ones are weeds: pull them out!' },
      {
        type: 'decide', text: 'Flower or weed? Decide, then pull!', ...flowerWeed,
        items: [
          { prompt: `${radical(16)} = 8`, truth: false, explain: `8 × 8 = 64, not 16. The root is <b>not half</b>. ${radical(16)} = 4 because 4 × 4 = 16.`, visual: () => tileGrid(4, { size: 'sm' }) },
          { prompt: `5<sup>2</sup> = 10`, truth: false, explain: 'Squaring is <b>not doubling</b>. 5<sup>2</sup> = 5 × 5 = 25.', visual: () => tileGrid(5, { size: 'sm' }) },
          { prompt: `${radical(1)} = 1`, truth: true, explain: '1 × 1 = 1. The tiniest square is one tile.', visual: () => tileGrid(1, { size: 'xs' }) },
          { prompt: `${radical(100)} = 10`, truth: true, explain: '10 × 10 = 100.', visual: () => tileGrid(10, { size: 'sm' }) },
          { prompt: `3<sup>2</sup> = 6`, truth: false, explain: 'Doubling 3 gives 6, but squaring gives 3 × 3 = <b>9</b>.', visual: () => tileGrid(3, { size: 'sm' }) },
          { prompt: `${radical(49)} = 7`, truth: true, explain: '7 × 7 = 49.', visual: () => tileGrid(7, { size: 'sm' }) },
          { prompt: `${radical(0)} = 0`, truth: true, explain: '0 × 0 = 0. A square with no tiles has a side of 0.' },
          { prompt: `${radical(25)} = 12.5`, truth: false, explain: `12.5 is <b>half</b> of 25. ${radical(25)} = 5, because 5 × 5 = 25.`, visual: () => tileGrid(5, { size: 'sm' }) },
          { prompt: `12<sup>2</sup> = 144`, truth: true, explain: '12 × 12 = 144. The biggest square in our garden.', visual: () => tileGrid(12, { size: 'sm' }) },
          { prompt: `${radical(9)} = 4.5`, truth: false, explain: `${radical(9)} = 3, since 3 × 3 = 9. Half of 9 is a trap!`, visual: () => tileGrid(3, { size: 'sm' }) },
          { prompt: `${radical(64)} = 32`, truth: false, explain: `${radical(64)} = 8. Half of 64 is 32, but 32 × 32 = 1024!`, visual: () => tileGrid(8, { size: 'sm' }) },
          { prompt: `2<sup>2</sup> = 4`, truth: true, explain: '2 × 2 = 4. Fun fact: 2 is the only number (besides 0) where doubling and squaring agree!', visual: () => tileGrid(2, { size: 'xs' }) },
        ],
      },
    ],
  },
  {
    id: 6, place: 'Big World', name: 'Roots in the Wild', skill: 'Real-life square root problems', color: 'grape', icon: 'globe',
    steps: () => [
      { type: 'intro', mood: 'cheer', text: 'Square roots hide all over the real world: gardens, screens, marching bands. Grab your gear, we\'re going out!' },
      { type: 'answer', prompt: 'A square vegetable patch has <b>49 plants</b> in equal rows. How many plants are in each row?', visual: () => h('div', { class: 'scene' }, scene('garden', 7), h('div', { class: 'scene-caption' }, '49 plants, square patch')), answer: 7, hint: { text: 'Rows × plants-per-row = 49. Which number times itself makes 49?' }, explain: '7 × 7 = 49, so 7 plants in each row.' },
      { type: 'answer', prompt: 'A square pixel picture has <b>100 pixels</b>. How many pixels wide is it?', visual: () => h('div', { class: 'scene' }, scene('pixels', 10), h('div', { class: 'scene-caption' }, '100 pixels in a square')), answer: 10, hint: { text: 'Width × width = 100.' }, explain: '10 × 10 = 100, so it is 10 pixels wide.' },
      { type: 'answer', prompt: 'A marching band forms a perfect square with <b>81 players</b>. How many players are in each row?', visual: () => h('div', { class: 'scene' }, scene('band', 9), h('div', { class: 'scene-caption' }, '81 players in a square formation')), answer: 9, hint: { text: 'Which number times itself makes 81?' }, explain: '9 × 9 = 81: nine rows of nine.' },
      { type: 'answer', prompt: 'A square rug is <b>6 feet</b> on each side. How many square feet does it cover?', visual: () => h('div', { class: 'scene' }, scene('rug', 6), h('div', { class: 'scene-caption' }, '6 feet × 6 feet')), answer: 36, hint: { text: 'Area = side × side. This one goes the other way: square the side!' }, explain: 'Area = 6 × 6 = 36 square feet. Squaring and rooting are opposites.' },
      { type: 'answer', prompt: 'A chessboard has <b>64 squares</b>. How many squares run along one edge?', visual: () => h('div', { class: 'scene' }, scene('chess', 8), h('div', { class: 'scene-caption' }, '64 squares')), answer: 8, hint: { text: 'Which number times itself makes 64?' }, explain: '8 × 8 = 64. Eight along each edge.' },
      { type: 'answer', prompt: 'A square trampoline covers <b>144 square feet</b>. How long is each side?', visual: () => h('div', { class: 'scene' }, scene('trampoline', 12), h('div', { class: 'scene-caption' }, '144 square feet')), answer: 12, hint: { text: 'Side × side = 144.' }, explain: '12 × 12 = 144, so each side is 12 feet.' },
      { type: 'answer', prompt: 'A square bathroom floor has <b>121 tiles</b>. How many tiles run along one wall?', visual: () => h('div', { class: 'scene' }, scene('tiles', 11), h('div', { class: 'scene-caption' }, '121 tiles')), answer: 11, hint: { text: 'Which number times itself makes 121?' }, explain: '11 × 11 = 121.' },
    ],
  },
  {
    id: 7, place: 'Greenhouse', name: 'Root Rush', skill: '60-second speed challenge', color: 'leaf', icon: 'timer', kind: 'rush',
    steps: () => [
      { type: 'rush', seconds: 60, text: 'Sixty seconds. Squares and roots, as many as you can. Every streak of 5 earns a bonus. Ready?' },
    ],
  },
];

const levelById = (id) => LEVELS.find((l) => l.id === Number(id));
/** Stars are only awarded by the scored plots (the Greenhouse rush keeps a best score instead) */
const MAX_STARS = LEVELS.filter((l) => !l.kind).length * 3;
