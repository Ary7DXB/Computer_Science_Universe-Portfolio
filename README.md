# Aryan Satghare's - A Computer Science Universe - Interactive Portfolio

An interactive portfolio that maps a resume onto a navigable solar system. Each planet is a portfolio section. Recruiters can explore by scrolling, clicking planets, or querying **Mission Control**, a local resume assistant with no API dependency.

**Live concept:** Education, Projects, Leadership, Skills, and Contact are not tabs on a static page. They are orbital destinations with cinematic focus transitions, scroll-synced navigation, and a deterministic Q&A layer built for hiring workflows.

---

## Why this project exists

Most portfolios present information in a linear document. This one treats exploration as an interaction model: spatial navigation, progressive disclosure, and performance-aware animation on real hardware constraints (laptops, phones, low-core devices, data-saver mode).

It demonstrates skills that transfer directly to product engineering:

- **Frontend architecture** without a framework dependency
- **Animation systems** that respect frame budgets and battery life
- **Data separation** between content, presentation, and behavior
- **Accessibility and resilience** (keyboard nav, ARIA, reduced motion, autoplay fallbacks)
- **Recruiter UX** via Mission Control: structured answers from a curated knowledge base

---

## Feature overview

| Feature | What it does |
|--------|----------------|
| **Solar system navigation** | Five planets map to Education, Projects, Experience, Skills, and Contact |
| **Scroll journey** | Full-height scroll steps sync the active section, floating nav, and planet focus |
| **Planet focus transition** | Click or scroll to zoom a planet clone into a detail panel with resume content |
| **Mission Control** | 18 preloaded Q&A signals with fuzzy matching, autocomplete, and typewriter replies |
| **CRT intro sequence** | Optional startup video with boot telemetry, skip, and autoplay fallback |
| **Adaptive starfield** | Canvas parallax background with capped meteor count and pointer reactivity |
| **Custom cursor** | Fine-pointer trail effect; disabled on touch devices |
| **Performance profiles** | `perf-lite` mode on coarse pointer, small screens, low core count, or save-data |

---

## Architecture

Vanilla HTML, CSS, and JavaScript. No build step, no bundler, no runtime framework. Modules are plain script files loaded in a fixed order so dependencies stay explicit.

```
index.html                 Entry point, semantic structure, asset preloads
css/01-base.css            Design tokens, reset, typography
css/02-background.css      Canvas layer, nebula, vignette
css/03-topbar-hero.css     Fixed chrome and hero copy
css/04-solar-system.css    Orbits, sun, planet renderer
css/05-panel.css           Zoom clone and glass detail panel
css/06-scroll-footer...    Scroll track, footer, intro, cursor
css/07-responsive.css      Breakpoints, touch, prefers-reduced-motion
css/08-performance...      GPU-conscious visual overrides
css/09-mission-control.css Mission Control modal
css/10-perf-additions.css  CSS containment for layout isolation

js/01-utils.js             Shared helpers (debounce)
js/00-dom-refs.js          Cached DOM handles
js/data-portfolio.js       Resume content + planet configuration
js/02-solar-system.js      Orbit build, rAF loop, lighting
js/03-planet-focus.js      Zoom clone, panel open/close, phase sync
js/04-starfield.js         Canvas starfield and meteors
js/05-scroll-nav.js        Scroll-driven section state
js/data-mission.js         Mission Control Q&A knowledge base
js/06-mission-control.js   Chat UI, fuzzy match, autocomplete
js/07-cursor.js            Custom cursor (pointer:fine only)
js/08-intro.js             Intro video and boot sequence
```

Later stylesheets intentionally override earlier ones. Script order encodes the dependency graph: utilities and DOM refs load before data modules, which load before features that consume them.

---

## Programming principles in practice

### Separation of concerns

- **`data-portfolio.js`** holds all resume copy and planet metadata. UI modules never embed content strings.
- **`data-mission.js`** is the single source of truth for recruiter Q&A. The chat layer only matches and renders.
- **CSS is layered by responsibility** (base, scene, components, responsive, performance) instead of one monolithic stylesheet.

### Performance as a design constraint

- **`planetState` cache** in the solar system loop avoids DOM queries and string parsing every frame.
- **Frame pacing** caps orbit, starfield, and cursor updates near 60 FPS with early exits when the tab is hidden.
- **`perf-lite` profile** (inline in `index.html`) activates on touch, small viewports, low `hardwareConcurrency`, or `saveData`.
- **Static nebula gradients** replace always-on animated blur layers in performance overrides.
- **CSS `contain: layout style`** on high-churn elements limits layout recalculation scope.
- **Idle-time initialization** for Mission Control question library so first paint stays focused on the main scene.

### Progressive enhancement

- Core content is HTML. Planets and panels degrade to scrollable sections without JavaScript for structure.
- Custom cursor, starfield pointer effects, and heavy glow are gated behind capability checks.
- Intro video has skip, tap-to-play, and error fallback paths.

### Deterministic behavior over black-box AI

Mission Control is intentionally **not** a generative API. Answers come from a curated `MISSION_QA` array with aliases and a scoring function. Recruiters get consistent, resume-accurate responses; you get zero latency, zero API cost, and zero hallucination risk.

### Animation correctness

Planet focus uses a **clone-and-handoff** pattern: the zoom clone inherits live lighting and texture phase from the orbital planet, then syncs phase back on close so the surface never jumps. Orbit revolution pauses during focus to prevent desync during the return animation.

### Accessibility

- Planets are focusable buttons with `aria-label` and keyboard activation.
- Mission Control is a modal dialog with backdrop dismiss, Escape handling, and `aria-live` transcript updates.
- `prefers-reduced-motion` collapses animation duration site-wide.

---

## Tech stack

| Layer | Choices |
|-------|---------|
| Markup | Semantic HTML5 |
| Styling | CSS custom properties, flex/grid, scroll-snap, backdrop-filter |
| Script | ES6+ vanilla JavaScript, `requestAnimationFrame`, Canvas 2D |
| Fonts | Space Grotesk, Inter, JetBrains Mono (Google Fonts) |
| Imagery | NASA/JPL/GSFC planet textures (local assets) |
| Video | `startup.mp4` intro (optional, with fallback) |

---

## Local development

No install required. Serve the project root over HTTP (recommended for video and module loading):

```bash
# Python 3
python3 -m http.server 8080

# Node (if npx is available)
npx serve .
```

Open `http://localhost:8080` and allow the intro video to play or skip it.

### Required assets

Place these under `assets/` (see `assets/README.txt`):

- `venus.webp`
- `earth-realistic.webp`
- `mars.webp`
- `jupiter.jpg`
- `saturn-cassini.webp`

Place `startup.mp4` in the project root next to `index.html`.

---

## Mission Control (recruiter mode)

Mission Control is a **local resume uplink**: 18 categorized questions covering profile, education, projects, skills, experience, and contact.

**How matching works:**

1. User input is normalized (lowercase, punctuation stripped).
2. Each Q&A item is scored against the question text and alias list.
3. Exact match, prefix match, substring match, and token overlap contribute to the score.
4. Best match above threshold returns the prewritten answer; otherwise a helpful fallback suggests valid topics.

Features: category filters, question library, Tab autocomplete, typewriter reveal, clear transcript.

---

## Performance checklist (what to look for in a review)

- [ ] Smooth orbit on mid-range laptop without sustained layout thrashing
- [ ] `perf-lite` activates on mobile / save-data
- [ ] Planet zoom in and out with no texture pop at handoff
- [ ] Scroll sections stay in sync with floating nav labels
- [ ] Mission Control opens without blocking initial solar system render
- [ ] Reduced motion preference respected

---

## Author

**Aryan Satghare**  
BSc (Honors) Computer Science, Heriot-Watt University  
Dubai, United Arab Emirates  

- Email: [aryansatghare@hotmail.com](mailto:aryansatghare@hotmail.com)
- Phone: +971 502170919

Open to internships, collaborations, and interesting technical problems.

---

## License and credits

Designed and built by Aryan Satghare. Planet imagery courtesy of NASA/JPL/GSFC.
