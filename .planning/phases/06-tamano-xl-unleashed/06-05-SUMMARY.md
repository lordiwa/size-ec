---
phase: 06-tamano-xl-unleashed
plan: 05
subsystem: xl-chaos-scene
tags: [xl, phaser, lazy-load, course-correction, wcag-aa, contrast-fix, defineAsyncComponent, scrim, vue3]

# Dependency graph
requires:
  - phase: 06-tamano-xl-unleashed
    provides: 17-style WCAG AA contract closed (06-01 — DEC-062)
  - phase: 06-tamano-xl-unleashed
    provides: WebGL2 capability gate + L fallback (06-02 — DEC-064/065/066/067) — non-WebGL2 visitors never reach XL Home, so the chaos canvas mount is safe
  - phase: 06-tamano-xl-unleashed
    provides: HomeView XL branch + .home-xl section (06-03 — DEC-068/069/070) — the mount point for XlChaos
  - phase: 06-tamano-xl-unleashed
    provides: Operator UAT scaffolding closed (06-04) — UAT will pick up the new chaos canvas in section A on walk-through
provides:
  - "src/components/XlChaos.vue — Phaser-driven 60-shape chaos scene, lazy-loaded behind XL Home"
  - "package.json + pnpm-lock.yaml — phaser@^4.1.0 in runtime dependencies (only XL lib installed; Three.js/Tone.js/postprocessing/physics remain Phase 7)"
  - ".home-xl-content scrim wrapper — text-shadow keeps content legible regardless of canvas state"
  - "html.level-xl .lvl-mini .tick.active override — black-on-neon-green ~10:1 fixes the WCAG-failing white-on-#00ffaa default"
  - "DEC-060 partial supersession + DEC-071 logged in PROJECT.md"
  - "Lazy-load contract verified at production build time: XlChaos-*.js is a separate chunk; index-*.js (121.8KB) is Phaser-free"
affects:
  - phase: 06-tamano-xl-unleashed
    note: "06-04 UAT walk-through gains a new visible behaviour to confirm: animated chaos behind the XL Home content. Section A's existing checkboxes still apply; an additional informal check (chaos visible + content legible despite motion + reduced-motion freezes everything) lands as part of the walk-through."
  - phase: 07-contenido
    note: "Phase 7's installs are reduced by one: only Three.js / @tresjs/core / Tone.js / postprocessing / physics remain. The Phaser dependency + lazy-load pattern (defineAsyncComponent) is now an established template Phase 7 can re-apply for the Three.js scene."

# Tech tracking
tech-stack:
  added:
    - "phaser@^4.1.0 (runtime dependency)"
  patterns:
    - "defineAsyncComponent + dynamic import → Vite chunk split → lazy load gated on style.code === 'xl'"
    - "Decorative canvas + content scrim — z-index: 0 canvas, z-index: 1 content with text-shadow keeps WCAG AA regardless of motion"
    - "Triple-gated chaos start: prefers-reduced-motion bail + WebGL2 probe re-check + container-ref guard, all in onMounted"
    - "Phaser lifecycle bound to Vue lifecycle: new Phaser.Game in onMounted, game.destroy(true) in onBeforeUnmount — no orphaned canvases on level/route change"

key-files:
  created:
    - src/components/XlChaos.vue
    - .planning/phases/06-tamano-xl-unleashed/06-05-SUMMARY.md
  modified:
    - src/styles/main.css
    - src/views/HomeView.vue
    - package.json
    - pnpm-lock.yaml
    - .planning/PROJECT.md

key-decisions:
  - "DEC-071 — Phaser shipped in Phase 6 (06-05) as a course correction. The user re-affirmed XL must literally feel 'Unleashed' with motion behind, not just a CSS gradient. DEC-060's spirit (lazy-loaded XL stack) is preserved; only the timing of one library moves forward. Three.js / Tone.js / postprocessing / physics remain Phase 7."
  - "DEC-072 — DECISION-XL-PHASER's brief mention of 'Phaser 3' is satisfied by phaser@^4.1.0. The plan instruction was `pnpm add phaser`; npm's tag now resolves to v4. The API surfaces consumed by XlChaos.vue (Phaser.AUTO, Phaser.Game, Phaser.Scale.RESIZE, Phaser.Types.Core.GameConfig, Graphics.fillStyle/fillRect/fillCircle/fillTriangle, scene events, setData/getData) are stable across the v3 → v4 transition. Type-check exits 0."
  - "DEC-073 — Content legibility on top of motion is owned by a CSS scrim on .home-xl-content (multi-stop text-shadow: 0 0 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.95)), not by colour-tweaking the chaos shapes. Rationale: shapes are decorative and can use the brand palette (neon green / magenta / white at 55% alpha) without WCAG-driven dimming; the scrim activates only behind text glyphs and is invisible against the dark XL bg. Honours LOCKED-001 without compromising the visual punch of the chaos canvas."
  - "DEC-074 — XL footer tick override mirrors the existing XS (#000080 + white) and L (#ff00aa + black) overrides. Default `.lvl-mini .tick.active { color: #ffffff }` paints white-on-#00ffaa at ~1.2:1 — a WCAG fail not caught by `pnpm check:contrast` (which audits the body-pair contract, not interactive states). The `html.level-xl .lvl-mini .tick.active { color: #000000 }` override restores ~10:1. Found by user inspection of the rendered footer; fixed as part of the same course correction."

requirements-completed: []
  # REQ-progressive-loading remains tied to Phase 7 (full XL stack installed); this plan
  # ships its first concrete dependency under that contract. REQ-sizes-five and
  # REQ-xl-capability-detection were already at contract level in 06-02; they remain so.
  # Mark requirements complete only when Phase 7 closes.

# Metrics
duration: ~5 min
completed: 2026-05-05
---

# Phase 6 Plan 05: XL chaos course correction — Summary

**Course correction inside Phase 6: fixed the WCAG-failing XL footer-tick contrast (white-on-neon-green ~1.2:1 → black-on-neon-green ~10:1, mirroring existing XS/L overrides) and shipped a Phaser-driven chaos scene behind XL Home, lazy-loaded via defineAsyncComponent so the index bundle stays Phaser-free. DEC-060 partially superseded (Phaser moves Phase 7 → Phase 6); Three.js / Tone.js / postprocessing / physics remain deferred. WCAG AA holds via a multi-stop text-shadow scrim on the content wrapper, independent of whatever motion the canvas is rendering behind it.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-05T22:46:14Z
- **Completed:** 2026-05-05T22:50:54Z
- **Tasks:** 5 (all committed atomically)
- **Files created:** 2 (`src/components/XlChaos.vue`, this SUMMARY)
- **Files modified:** 5 (`src/styles/main.css`, `src/views/HomeView.vue`, `package.json`, `pnpm-lock.yaml`, `.planning/PROJECT.md`)

## Accomplishments

- **Footer tick contrast fix.** Added `html.level-xl .lvl-mini .tick.active { color: #000000 }` to `src/styles/main.css`. Black-on-#00ffaa is ~10:1 PASS; the previous white-on-#00ffaa was ~1.2:1 FAIL. `pnpm check:contrast` still 17/17.
- **Phaser installed as a runtime dependency.** `pnpm add phaser` resolved to `phaser@^4.1.0`. No other XL libs installed (banned set audited: three / @tresjs/core / tone / postprocessing / cannon-es / @dimforge/rapier3d).
- **`src/components/XlChaos.vue` created.** Phaser scene with 60 shapes (rects/circles/triangles, neon green / magenta / white at 55% alpha) drifting + rotating at 30 FPS with toroidal wrap. Triple-gated start (prefers-reduced-motion bail + `probeXlCapability().supported` re-check + container-ref guard). `Phaser.Game.destroy(true)` in `onBeforeUnmount` — no orphaned canvases on level/route change. Decorative-only: `aria-hidden="true"`, `pointer-events: none`, `position: absolute; inset: 0; z-index: 0`. CSS belt-and-braces `@media (prefers-reduced-motion: reduce) { .xl-chaos { display: none } }`.
- **HomeView XL branch wires XlChaos lazy.** `defineAsyncComponent(() => import('@/components/XlChaos.vue'))` causes Vite to split Phaser into its own chunk. `<XlChaos />` mounted inside the `<section class="home-xl">` ahead of content. Content wrapped in `<div class="home-xl-content">` (z-index: 1; multi-stop `text-shadow` scrim). `.home-xl` gained `position: relative` to anchor the absolute canvas. L / S / XS / M branches untouched.
- **Bundle audit passed.** `pnpm build` produced `dist/assets/XlChaos-Bxcht4eJ.js` (~1.66 MB raw / ~375 KB gzipped) as a dedicated chunk. `dist/assets/index-BctiONzA.js` is 121.8 KB and contains zero `Phaser.Game` references. The full Phaser stack lives only in the XlChaos chunk and is fetched only when `defineAsyncComponent` resolves on an XL Home render.
- **DEC-060 partially superseded; DEC-071 logged.** PROJECT.md DECISION-XL-PHASER row now reads "Phaser implemented in Phase 6 (06-05); Tone.js + Three.js + postprocessing + physics remain in Phase 7". DEC-071 captures the course-correction rationale (user clarification on "Unleashed").

## Task Commits

Each task was committed atomically:

1. **Task 1: Footer tick contrast override for XL** — `3a37ec5` (fix)
2. **Task 2: Install Phaser as a lazy-loaded dependency** — `434eaf2` (feat)
3. **Task 3: XlChaos.vue — Phaser scene with controlled chaos** — `0ef474b` (feat)
4. **Task 4: Mount XlChaos lazy + scrim in HomeView XL branch** — `e5e29aa` (feat)
5. **Task 5: Bundle audit + DEC-060 update + DEC-071** — `95089a5` (docs)

_Plan metadata commit follows this SUMMARY._

## Files Created/Modified

- **Created** `src/components/XlChaos.vue` — `<script setup lang="ts">`; imports `Phaser` and `probeXlCapability`; mounts a Phaser.Game on `onMounted` (with reduced-motion + WebGL2 + ref guards); destroys it on `onBeforeUnmount`. Scoped CSS positions the canvas absolutely behind content. 99 lines.
- **Created** `.planning/phases/06-tamano-xl-unleashed/06-05-SUMMARY.md` — this file.
- **Modified** `src/styles/main.css` — added the `html.level-xl .lvl-mini .tick.active { color: #000000 }` rule between the L block and the responsive media query (8 lines added including comment).
- **Modified** `src/views/HomeView.vue` — added `defineAsyncComponent` import + `XlChaos` async-component constant; mounted `<XlChaos />` inside the XL section; wrapped content in `.home-xl-content`; added `.home-xl-content` and `position: relative` to `.home-xl` in scoped CSS.
- **Modified** `package.json` — `dependencies.phaser: ^4.1.0`.
- **Modified** `pnpm-lock.yaml` — phaser + transitive deps (`eventemitter3` is the only addition; matches Phaser's published peer set).
- **Modified** `.planning/PROJECT.md` — DECISION-XL-PHASER row's Outcome column updated; new DEC-071 row added directly below it.

## Decisions Made

- **DEC-071 — Phaser ships in Phase 6 (06-05).** Course correction: user re-affirmed XL must feel "Unleashed" with motion behind, not just CSS gradient. DEC-006's spirit (lazy-loaded XL stack) preserved; only the timing of one library shifts. The remaining XL libs (Three.js / Tone.js / postprocessing / physics) stay in Phase 7. Captured in PROJECT.md.
- **DEC-072 — phaser@^4.1.0 satisfies DECISION-XL-PHASER.** The plan said `pnpm add phaser`; npm's `latest` tag resolves to v4. API surfaces consumed (`Phaser.AUTO`, `Phaser.Game`, `Phaser.Scale.RESIZE`, `Phaser.Types.Core.GameConfig`, `Graphics` fill primitives, scene events, `setData`/`getData`) are stable v3 → v4. `pnpm type-check` exits 0 against `phaser/types`.
- **DEC-073 — CSS scrim, not colour-dimmed shapes.** Content legibility on top of motion is owned by `.home-xl-content { text-shadow: 0 0 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.95) }`, not by softening the chaos shapes' colours. Shapes keep the brand palette at 55% alpha; the scrim is invisible against the dark XL bg and activates only behind text glyphs. Preserves visual punch without compromising LOCKED-001.
- **DEC-074 — XL footer tick override mirrors XS/L pattern.** `pnpm check:contrast` audits the body-pair contract, not interactive states like `.tick.active`, so the WCAG-failing default white-on-neon-green slipped through previous phases. The fix is a one-line override in the same idiom as the existing XS (`#000080` + white) and L (`#ff00aa` + black) overrides directly above in `main.css`.

## Deviations from Plan

- **[Rule 3 — Blocking issue] TypeScript `this` annotation on the scene `create()` method.** The plan's source listed `create()` without a `this` parameter, which the strict tsconfig rejected once Phaser types were resolved. Added `this: Phaser.Scene` to the `create` signature; behaviour unchanged. Caught at the type-check step before commit; fix folded into the Task 3 commit. Tracked here for auditability — does not change the plan's intent or any acceptance criterion.

  Note: the plan's source code is otherwise verbatim. No other deviations.

## Issues Encountered

None beyond the deviation above. All five tasks' verify gates passed on first run after the `this` annotation. `pnpm type-check`, `pnpm build`, and `pnpm check:contrast` all exited 0.

## Verification

- `pnpm type-check` — exits 0 (vue-tsc clean).
- `pnpm build` — exits 0 in 10.28 s. Output:
  - `dist/assets/index-BctiONzA.js` — 124.82 kB / 48.81 kB gzipped, **Phaser-free**.
  - `dist/assets/XlChaos-Bxcht4eJ.js` — 1657.59 kB / 375.45 kB gzipped, **isolated chunk**.
  - 7 view chunks + 1 ChangeStyleControl chunk + index — same shape as before, plus the new XlChaos chunk. No XL-stack libraries other than Phaser appear anywhere.
- `pnpm check:contrast` — `OVERALL 17/17 themes pass WCAG AA at the required thresholds`. XL block unchanged: body 20.38:1, muted 8.77:1, large heading 20.38:1, accent CTA 15.42:1, accent inline 15.42:1.
- Bundle audit script (Task 5 verify) — XlChaos chunk present, `Phaser.Game` not in index. Both gates `ok`.
- PROJECT.md audit — DEC-071 row present; DECISION-XL-PHASER status reads "Phaser implemented in Phase 6". Both regex checks `ok`.

## User Setup Required

None — Phaser is a pure runtime dependency, no API keys, no service configuration. Operator UAT (already authored at `06-UAT.md`) gains a new behaviour to confirm informally during Section A's walk-through:

- The chaos canvas should be visible behind the SIZE wordmark + tagline + rotator on XL Home.
- Content should remain legible (text-shadow scrim active).
- `prefers-reduced-motion` (DevTools → Rendering → emulate) should freeze the chaos AND collapse the canvas to `display: none` (belt-and-braces).
- A non-WebGL2 environment should never see the chaos because the store auto-flips XL → L (06-02's gate); the lazy chunk is still split, but its `import()` is never triggered.

## Next Phase Readiness

- **Phase 6 plan deck closure.** With 06-05 shipped, Phase 6's plan deck is now 5/5 (06-01 through 06-05). Operator UAT remains the only open gate on Phase 6 — and now the operator gets a richer XL Home to walk through (animated chaos + reduced-motion compliance check).
- **Phase 7 surface area reduced by one library.** Phase 7 (Contenido) still owns Three.js / @tresjs/core / Tone.js / postprocessing / a physics library + content (team photos / client cases / final rotating-words list). The lazy-load pattern (`defineAsyncComponent`) is now an established template — Phase 7 will re-apply it for the Three.js scene mount, gated on the same `useXlCapability().supported === true` branch from 06-02.
- **WCAG AA contract integrity.** The 17/17 contrast contract is unchanged. The footer-tick fix closes a previously-undetected interactive-state failure; no token values were modified, so no per-level rendered-surface escalation (DEC-041 / DEC-052 patterns) is triggered. The next time someone audits interactive states explicitly, this plan's fix is in place.
- **Reduced-motion compliance.** The chaos canvas honours `prefers-reduced-motion: reduce` at three layers: (a) onMounted bails before `new Phaser.Game`, (b) the existing global `@media` rule in `main.css` collapses any animation-duration to 0.01ms, (c) the scoped `.xl-chaos { display: none }` rule under the same media query removes the canvas from the layout entirely. A reduced-motion visitor on XL Home sees the same static layout as Phase 6 plan 03 shipped.

## Self-Check: PASSED

Verified before STATE.md / ROADMAP.md update:

- `src/components/XlChaos.vue` exists, contains `import Phaser from 'phaser'`, `Phaser.Game`, `game.destroy`, `aria-hidden="true"`, `pointer-events: none`, `prefers-reduced-motion`.
- `src/styles/main.css` contains `html.level-xl .lvl-mini .tick.active`.
- `src/views/HomeView.vue` contains `defineAsyncComponent`, `XlChaos`, `.home-xl-content`, `text-shadow`, `position: relative` on `.home-xl`.
- `package.json` `dependencies.phaser` is `^4.1.0`; banned set absent.
- `dist/assets/XlChaos-Bxcht4eJ.js` exists; `dist/assets/index-BctiONzA.js` is Phaser-free.
- `.planning/PROJECT.md` contains `DEC-071` and `Phaser implemented in Phase 6`.
- Commits `3a37ec5` / `434eaf2` / `0ef474b` / `e5e29aa` / `95089a5` exist in `git log` with the correct types/scopes.
- `pnpm type-check` exits 0.
- `pnpm build` exits 0 (10.28 s).
- `pnpm check:contrast` exits 0 with `OVERALL 17/17 themes pass`.

---
*Phase: 06-tamano-xl-unleashed*
*Plan: 05*
*Completed: 2026-05-05*
