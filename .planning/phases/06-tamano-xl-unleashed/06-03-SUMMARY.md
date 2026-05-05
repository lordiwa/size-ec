---
phase: 06-tamano-xl-unleashed
plan: 03
subsystem: home-view-xl
tags: [xl, home, vue3, prototype-port, css-gradient, wcag-aa, lazy-load]

# Dependency graph
requires:
  - phase: 06-tamano-xl-unleashed
    provides: 17-style WCAG AA contract closed (06-01 — DEC-062, DEC-063)
  - phase: 06-tamano-xl-unleashed
    provides: WebGL2 capability gate + L fallback toast (06-02 — DEC-064/065/066/067) — non-WebGL2 visitors never reach XL Home
  - phase: 04-tamanos-s-y-l
    provides: Per-level v-else-if chain in HomeView (L → S → M-default established)
  - phase: 05-tamano-xs-plain
    provides: XS branch inserted between S and M-default, extending the chain to L → S → XS → M-default (DEC-053)
  - phase: 01-paridad-prototipo
    provides: xl-grad-text gradient + size-wordmark/huge atoms in src/styles/main.css (level-xl tokens + @keyframes xl-grad)
provides:
  - "HomeView XL branch — verbatim port of prototype 00021082_04 lines 62-76"
  - "Final HomeView per-level chain: L → S → XL → XS → M-default (per D-01)"
  - "CSS-only XL identity ready for Phase 7 to plug Three.js / Phaser / Tone.js underneath"
affects:
  - phase: 06-tamano-xl-unleashed
    note: "Plan 06-04 (UAT) gets a renderable XL Home to walk through; 5/5 sizes now visually functional"
  - phase: 07-contenido
    note: "Three.js scene installation lands as a child layer behind .home-xl; the runtime label `[ home.scene · runtime ]` is the visible placeholder for that future layer"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Verbatim prototype port — JSX inline styles translated 1:1 to scoped Vue CSS class rules"
    - "Class composition: size-wordmark + huge + xl-grad-text on a single h1 (all atoms already in main.css)"
    - "v-else-if branch keyed solely on style.code === 'xl' (LOCKED-002 honoured — never combined with marketId)"
    - "Reduced-motion compliance via existing global rule in main.css — no per-component override needed"

key-files:
  created:
    - .planning/phases/06-tamano-xl-unleashed/06-03-SUMMARY.md
  modified:
    - src/views/HomeView.vue

key-decisions:
  - "DEC-068 — XL branch insertion point is between S and XS (final order L → S → XL → XS → M-default), as set by D-01 in 06-CONTEXT.md. Honours the visual-weight ordering convention established by Phase 4 and Phase 5: each newly added per-level branch slots ahead of M-default but in a position that reads naturally relative to its neighbours. M-default keeps its triple role (M Crafted, market mode, unknown level) per DEC-046."
  - "DEC-069 — XL Home reuses size-wordmark + huge + xl-grad-text exclusively; no new global CSS, no new @keyframes, no new tokens. The animated gradient lives entirely in main.css (lines 156-168) from the Phase 1 port; Phase 6 only consumes it. Mirrors the same discipline as Phase 5 (XS reused level-xs tokens without adding new ones)."
  - "DEC-070 — The runtime label '[ home.scene · runtime ]' is a static text placeholder for the future Three.js scene; it has no semantic role beyond decoration. Phase 7 will mount the scene UNDER this layer — the label becomes a debug-only HUD or is removed entirely depending on the operator's preference at content time. Per DEC-060, no Three.js / Phaser / Tone.js / postprocessing / physics installs in Phase 6."

requirements-completed: []
  # REQ-sizes-five spans 5 plans across 3 phases (Phase 4 S+L, Phase 5 XS, Phase 6 XL).
  # XL-slice ships in this plan but the parent requirement closes only when Phase 7 wires
  # the actual XL stack (Three.js / Phaser / Tone.js) per DEC-060. Will be marked complete
  # in 06-04 (UAT sign-off) or 07 depending on operator gate.

# Metrics
duration: ~2 min
completed: 2026-05-05
---

# Phase 6 Plan 03: HomeView XL branch — Summary

**Shipped the XL (Unleashed) Home view as a verbatim CSS-only port of the prototype: animated gradient SIZE wordmark, runtime-scene placeholder label, gradient rotator, MarketSelect dropdown — reusing every atom already in main.css, adding zero global rules, and inserting cleanly between the S and XS branches.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-05-05T04:37:55Z
- **Completed:** 2026-05-05T04:39:41Z
- **Tasks:** 1 (single-task plan)
- **Files modified:** 1 (`src/views/HomeView.vue`)

## Accomplishments

- Inserted `v-else-if="style.code === 'xl'"` branch in `src/views/HomeView.vue` between the existing S branch and the XS branch. Final per-level chain: **L → S → XL → XS → M-default**.
- Markup is a 1:1 Vue port of prototype `00021082_04_a353c98e-7080-4c7c-859d-e8ebafc9597d.js` lines 62-76:
  - `<div class="mono upper home-xl-runtime">[ home.scene · runtime ]</div>` — runtime placeholder label
  - `<h1 class="size-wordmark huge xl-grad-text home-xl-mark">SIZE</h1>` — gradient wordmark
  - `<p class="home-xl-tag">Publicidad a tu medida.</p>` — display-font tagline
  - `<p class="home-xl-rotator">Somos tu <span class="xl-grad-text"><RotatingWord …/></span>.</p>` — gradient rotator
  - `<div class="home-xl-cta"><MarketSelect …/></div>` — dropdown
- Added scoped CSS for the XL block translating the prototype's inline styles to class rules (padding `8vh 6vw`, `min-height: 100vh`, `clamp()` typography sizes for tag and rotator, `var(--accent)` runtime label, `var(--font-display)` for the display-font surfaces).
- Added a `@media (max-width: 720px)` rule that flips `.home-xl-rotator` to `white-space: normal` (mirrors the same responsive treatment the M, L, and S branches already have).
- Reused existing main.css atoms exclusively: `xl-grad-text` (lines 161-168), `size-wordmark` + `huge` (lines 172-186), `mono` + `upper` (lines 71-83). **Zero new global CSS, zero new keyframes, zero new tokens.**
- Verified L / S / XS / M branches are untouched by reading the file post-edit and running the plan's automated check pattern.

## Task Commits

Single task, single atomic commit:

1. **Task 1: HomeView XL branch (verbatim port from prototype)** — `7553281` (feat)

_Plan metadata commit follows this SUMMARY._

## Files Created/Modified

- **Modified** `src/views/HomeView.vue` — added the XL branch (template) + scoped CSS block. +57 lines, 0 deletions.

## Decisions Made

- **DEC-068 — XL branch insertion point.** Slots between S and XS for the final chain L → S → XL → XS → M-default. Per D-01 in 06-CONTEXT.md and the visual-weight ordering convention.
- **DEC-069 — Zero new global CSS.** All XL styling reuses existing main.css atoms (`xl-grad-text`, `size-wordmark`, `huge`, `mono`, `upper`). The animated gradient + tokens were already in place from Phase 1.
- **DEC-070 — Runtime label is decorative.** `[ home.scene · runtime ]` is a static placeholder for the future Three.js scene; Phase 7 will mount the scene under this layer per DEC-060.

## Deviations from Plan

None — plan executed exactly as written. The single task's `<verify>` gate passed on first run. `pnpm type-check`, `pnpm build`, and `pnpm check:contrast` all exited 0 with the expected output (17/17 themes; no XL-stack chunks in dist/). No Rule 1/2/3 auto-fixes triggered; no Rule 4 architectural escalations required.

## Issues Encountered

None.

## Verification

- `pnpm type-check` — exits 0 (vue-tsc clean).
- `pnpm build` — exits 0 (built in 2.65 s; output: 79 modules transformed, no chunks matching three / phaser / tone / @tresjs / postprocessing / cannon-es / rapier).
- `pnpm check:contrast` — exits 0 with `OVERALL 17/17 themes pass WCAG AA`. XL block: body 20.38:1, muted 8.77:1, large heading 20.38:1, accent CTA 15.42:1, accent inline 15.42:1 (unchanged from 06-01 — this plan adds no new tokens).
- Plan `<verify>` automated pattern check — all 5 expected patterns found in `src/views/HomeView.vue` (`style.code === 'xl'`, `class="home-xl"`, `xl-grad-text`, `home.scene · runtime`, `home-xl-rotator`).
- XL-stack import audit — `Grep` of `src/` for `three|@tresjs|phaser|tone|postprocessing|cannon-es|@dimforge/rapier` finds only one match (a comment in `PortraitPlaceholder.vue` containing the substring "tone"); zero real imports.

## User Setup Required

None — no external service configuration required. Operator UAT (Plan 06-04) will exercise the XL Home view via `pnpm dev` and confirm the gradient animation + gradient rotator + responsive rotator wrap on narrow viewports.

## Next Phase Readiness

- **Plan 06-04 unblocked** — Operator UAT can walk through XL Home (`pnpm dev` → pick XL from the footer slider) and confirm: (a) `.home-xl` section renders with dark `#050505` bg from `level-xl` tokens, (b) SIZE wordmark animates the magenta-to-neon-green gradient via `@keyframes xl-grad`, (c) runtime label is visible in neon green, (d) tagline + rotator + dropdown are centered, (e) on a non-WebGL2 environment the toast appears + level snaps to L (06-02's gate). Once UAT signs off, Phase 6 is complete and only Phase 7 (Contenido — actual Three.js / Phaser / Tone.js installation) remains for the XL slice.
- **Phase 7 attachment point clear** — The `<section class="home-xl">` wrapper is the documented mount point. Phase 7 will:
  1. Install three / @tresjs/core / phaser / tone / postprocessing / a physics lib (Cannon-es or Rapier) lazy-loaded behind a dynamic `import()`.
  2. Mount a `<TresCanvas>` (or equivalent) absolutely-positioned behind the gradient overlay, gated by `useXlCapability().supported === true` from 06-02.
  3. Either remove the runtime label or convert it to a debug HUD per operator preference at content time.
- **5/5 sizes visually functional** — XS (Phase 5), S (Phase 4), M (Phase 1/2), L (Phase 4), and now XL (Phase 6) all render distinct per-level Home views; the per-level v-else-if chain is complete. The 17-style catalog is now visually-renderable end-to-end (12 markets via the M-default branch's market token application + 5 levels via per-level branches).
- **Reduced-motion compliance maintained** — The global `@media (prefers-reduced-motion: reduce)` rule in main.css (lines 387-398) collapses `xl-grad`'s 6s linear infinite animation to 0.01ms. No per-component override needed; the existing global rule covers the new branch.

## Self-Check: PASSED

Verified before STATE.md / ROADMAP.md update:

- `src/views/HomeView.vue` exists, contains `v-else-if="style.code === 'xl'"`, contains `class="home-xl"`, contains `xl-grad-text`, contains `home.scene · runtime`, contains `.home-xl-rotator` scoped CSS rule.
- Branch order in template: L (line 35) → S (line 55) → XL (line 69) → XS (line 87) → M-default (line 110).
- L / S / XS / M scoped CSS blocks unchanged (line ranges match Phase 4/5 commits).
- Commit `7553281` exists in `git log` (Task 1: feat).
- `pnpm type-check` exits 0.
- `pnpm build` exits 0 (2.65 s; no XL-stack chunks).
- `pnpm check:contrast` exits 0 with `OVERALL 17/17 themes pass`.
- XL-stack import audit on `src/`: zero genuine imports (one false-positive comment match in PortraitPlaceholder.vue).

---
*Phase: 06-tamano-xl-unleashed*
*Plan: 03*
*Completed: 2026-05-05*
