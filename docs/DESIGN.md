# Rad Roots: design rationale

This document explains the choices behind Rad Roots: what we are trying to teach, how the garden and its mascot serve that, how the visual system was built, and where we deliberately held back.

## 1. The learning problem

Square roots are taught late (grade 6 to 8 in most curricula) and usually as notation. Three misconceptions dominate classroom data and they are all *symbolic* errors that a concrete picture prevents:

1. **"The root is half."** √16 = 8, √25 = 12.5. The child has learned that √ "makes it smaller" and reaches for the only shrinking operation they know well.
2. **"Squaring is doubling."** 5² = 10, 3² = 6. The little 2 reads as "times 2".
3. **"Only perfect squares have roots."** Asked for √20, the child says "you can't".

A child who has physically built a 4×4 square out of 16 tiles does not think √16 is 8. They can *see* the 4. That single picture, the square with its side, is the spine of the whole app.

### Target learner

Ages 8 to 12. Old enough for multiplication facts to 12×12 and comfortable with a number line, young enough that a mascot and confetti still land. The tone is warm and quick, never babyish: a 12-year-old should not feel talked down to.

## 2. The metaphor: a garden with roots

The word *root* in mathematics comes from the idea of the square "growing from" its side, the way a plant grows from its root (Latin *radix*, whence *radical*, and also *radish*). So the garden is not an arbitrary skin: it makes the vocabulary literal.

- **Above ground:** the square, a bloom of coloured tiles.
- **Below ground:** the root, drawn as a bar of soil segments exactly as long as one side.
- **Plots:** each lesson is a garden plot with a seed-packet card on the map.
- **Weeds:** false statements in the misconception plot are weeds to pull; true ones are flowers to keep.
- **Rad the Radish:** a root vegetable named after the radical sign. He introduces himself with that etymology in the first ten seconds.

The metaphor stays out of the way of the maths: the tile grid is always the centre of the screen, and the garden dressing lives at the edges.

## 3. Learning progression

The sequence follows concrete → pictorial → abstract, with retrieval and application at the end. Each plot is 4 to 8 minutes.

| Plot | Idea | Key interaction | Why this interaction |
| --- | --- | --- | --- |
| 1 Seed Patch | Square numbers | Slider grows an n×n grid; sorting counts into square / not square with leftover tiles falling off | The slider makes n and n² move together; leftovers make "not a square" visible instead of a rule |
| 2 Root Cellar | √ as the inverse of squaring | Plant view (square + root bar); the Root Machine with SQUARE and ROOT levers | The machine makes "undo" physical: 6 → 36 → 6 |
| 3 Bloom Field | Odd-number growth; fast recognition | "Grow one layer" highlights the new L-shaped gnomon; whack-a-mole hunt | The gnomon is the classic proof that n² = 1 + 3 + … + (2n−1); the hunt builds recall once the concept exists |
| 4 Wild Meadow | Estimating √ of non-squares | Fit visual (16 + 4 spare tiles); zoomed number line with squares boxed above the integers; draggable pin | Kids sandwich the root between two squares they know, then refine by "which is it closer to" |
| 5 Weed Patrol | Misconceptions | Flower / weed decision cards with an immediate tile-grid rebuttal | Naming the myth and showing the counter-picture is more durable than avoiding the error |
| 6 Big World | Application | Word problems with illustrated square scenes | Transfer: area → side and side → area, in contexts a kid can picture |
| 7 Greenhouse | Fluency | 60-second Root Rush, streak bonuses, personal best | Speed only after understanding; unlocked by finishing all six plots |

### Feedback policy

- **Right on the first try:** chime, "+10 XP", a one-line reason ("7 × 7 = 49, so 49 is a square number"). The reason is shown even when the child is right, so the *why* is repeated at the moment of success.
- **Wrong once:** soft buzz, the hint opens automatically (usually the tile grid), "Try again". Second-try success still earns XP (5).
- **Wrong twice:** the answer is shown with its reason and the lesson moves on. Stars drop, nothing else happens.

## 4. Gamification: what we used and what we refused

Used, because each maps onto a real skill signal:

- **Stars** (accuracy-based, replayable) tell a child which plots are solid.
- **XP and ranks** give a sense of accumulation over sessions.
- **Badges** are earned for specific behaviours: building every square, undoing a square with the machine, three close estimates, a clean sweep of the weeds.
- **One timed mode**, gated behind mastery.

Refused, because they optimise for engagement over learning at this age:

- **Lives / hearts.** Running out of tries punishes the children who need the most practice.
- **Leaderboards.** Social comparison at 8 to 12 makes maths anxiety worse, not better.
- **Timers on concept steps.** Estimation and reasoning need slack.
- **Streak guilt.** We celebrate streaks inside a session; we never nag about days missed.

## 5. Visual system

**Direction.** A morning garden: airy, saturated but not garish, chunky and tactile. Vintage seed packets were the reference for the plot cards (a bold coloured band, a perforated tear line, big friendly type). The look aims to feel like a well-made toy rather than a worksheet.

**Palette.** Tokens on `:root`, redefined for dark mode.

| Token | Light | Role |
| --- | --- | --- |
| `--bg` | `#EAF3FA` | sky ground |
| `--ink` | `#1F2B3A` | text |
| `--leaf` | `#2FB26B` | primary action, correct |
| `--sun` | `#FFC53D` | stars, current step, hints |
| `--berry` | `#FF5D8F` | Rad, the radical sign, gentle "not quite" |
| `--sky` | `#3B82F6` | links, the SQUARE lever |
| `--soil` | `#9A6B48` | roots, the map path |

The twelve perfect squares each get a fixed tile hue (`--t1` … `--t12`, a coral-to-rose rainbow), so 25 is always teal and 100 always fuchsia. Repetition of colour with number is a small memory aid and makes the gallery read as a set.

**Type.** Three faces with distinct jobs:

- *Lilita One* for the wordmark and celebratory numbers (scores, the completion title). Chunky, packaging-like.
- *Fredoka* 500 to 700 for buttons, labels, equations and headings. Rounded and highly legible at size.
- *Nunito* 500 to 800 for reading text and Rad's speech. Friendly without being childish.

**The radical sign.** Fonts vary wildly in how they draw √, and none of them join it to the overbar. Rad Roots draws the radical as an inline SVG stroke with a CSS top border on the radicand, so √25 looks the same everywhere, including inside sentences.

**Shape and depth.** Large radii (20 to 28px), a 6px solid bottom edge on buttons that collapses on press, jelly-style inset highlights on tiles. Elevation is spent sparingly: the stage card and the feedback sheet float; everything else sits flat.

**Motion.** Tiles pop in with a staggered spring; the square grows and shrinks with the slider; the new gnomon flashes gold; stars bounce in one at a time; confetti bursts on completion. All motion is disabled under `prefers-reduced-motion` and by the in-app toggle.

**Sound.** Nine tiny synthesised cues (tap, pop, grow, shrink, correct, wrong, star, win, badge) from the Web Audio API. They are short and pitched to be pleasant on repeat, and a single tap mutes them.

## 6. Accessibility

- Keyboard: number pad accepts digits, Backspace and Enter; the number line is a `role="slider"` with arrow keys; dialogs trap focus on their primary action and close on Escape (except completion, which needs an explicit choice).
- Screen readers: grids announce "5 by 5 square, 25 tiles"; the answer display is a live region; progress bars carry `aria-valuenow`.
- Touch: all targets are 44px or larger; the grid, mounds and levers are big.
- Colour: correct / incorrect states change icon, shape and copy as well as hue; contrast checked in both themes.
- Motion and sound are both optional.

## 7. Technical notes

- Vanilla HTML, CSS and JavaScript. No framework, no build step. Classic `<script>` tags so it runs from `file://`.
- Progress in `localStorage` (`radroots.v1`), wrapped in try/catch so a blocked store degrades to an in-memory session.
- A lesson is an array of *steps*; twelve step types (`intro`, `card`, `build`, `gallery`, `decide`, `answer`, `choice`, `machine`, `grow`, `hunt`, `estimate`, `rush`) cover all seven plots. Adding a plot is adding data to `js/levels.js`.
- `scripts/build.mjs` inlines everything into one HTML file for hosting anywhere.
- A web app manifest, rendered icons and a small service worker (network first, cache fallback) make the site installable on iOS and Android and playable offline. The service worker is only registered over http(s), so the file and artifact builds are unaffected.

## 8. Ideas for a second season

- Cube roots as a "cube garden" (blocks instead of tiles).
- A "Root Rush" two-player pass-the-device mode.
- Teacher dashboard export (a printable page of stars and badges).
- Localisation: all copy lives in `js/levels.js` and `js/app.js`.
