---
phase: 06-tamano-xl-unleashed
plan: 02
subsystem: capability-detection
tags: [webgl2, capability, fallback, xl, lazy-load, vue3, composable, pinia, toast, a11y]

# Dependency graph
requires:
  - phase: 06-tamano-xl-unleashed
    provides: 17-style WCAG AA contract closed (06-01 — DEC-062, DEC-063)
  - phase: 04-tamanos-s-y-l
    provides: setLevel() store method + L (level 4) as the documented fallback target for XL
  - phase: 01-paridad-prototipo
    provides: Reconfigurando overlay teleport pattern in App.vue (mirrored for XlFallbackToast)
provides:
  - "src/composables/useXlCapability.ts — WebGL2 probe contract (probeXlCapability + useXlCapability)"
  - "Pinia style store XL → L auto-fallback path with reactive xlFallback signal"
  - "XlFallbackToast component (educational message, dismissible, ~3.5s auto-dismiss)"
  - "Lazy-load contract verified — zero XL-stack libs imported anywhere in repo"
  - "REQ-xl-capability-detection satisfied at the contract level"
affects:
  - phase: 06-tamano-xl-unleashed
    note: "Plan 06-03 (HomeView XL branch) renders confidently — non-WebGL2 visitors never reach XL Home, they hit L instead"
  - phase: 06-tamano-xl-unleashed
    note: "Plan 06-04 (UAT) operator script gets a deterministic WebGL2-emulation step (DevTools → disable WebGL2 → pick XL → confirm toast + auto-flip)"
  - phase: 07-contenido
    note: "Three.js / Phaser / Tone.js / postprocessing installation lands in Phase 7 — this plan's contract is the entry point; the supported === true branch is where the lazy chunks attach"
  - phase: 09-cierre
    note: "Final UAT inherits the established gate; no new fallback path to author"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Module-scope memoized capability probe — synchronous, idempotent, document-guarded for SSR safety"
    - "Pinia store as the single source of truth for the XL → L redirect (no view-level conditionals; setLevel mutates target before commit)"
    - "Teleport-to-body for transient signals (XlFallbackToast joins ReconfigureOverlay + IntensityChooser in the same Teleport block)"
    - "Token-driven toast styling via var(--bg) / var(--ink) / var(--accent) — inherits the active level's palette without any per-style override"

key-files:
  created:
    - src/composables/useXlCapability.ts
    - src/components/XlFallbackToast.vue
  modified:
    - src/stores/style.ts
    - src/App.vue

key-decisions:
  - "DEC-064 — XL → L fallback is the store's responsibility, not the view's. setLevel(5) probes WebGL2 in-place; if unsupported it rewrites target to 4 before assigning level.value, then sets xlFallback.active. Views never see an XL state on a non-WebGL2 browser. Mirrors LOCKED-002 (single mutation) — the user's intent (5) becomes the actual level (4) atomically; no intermediate flicker."
  - "DEC-065 — Capability probe is memoized at module scope, not inside the composable. probeXlCapability() is a plain function callable from the store without instantiating reactivity; useXlCapability() wraps the same memoized result in a ref for view-level use. Mirrors the patterns established in DEC-022 (immediate watchers) and DEC-024 (no store extension when one assignment suffices) — keep the surface minimal."
  - "DEC-066 — XlFallbackToast lives in App.vue's Teleport-to-body block alongside ReconfigureOverlay, NOT inside individual views. Survives route changes by definition; matches DEC-016's overlay placement (Reconfigurando) and respects DEC-021's owner pattern (App.vue owns global UI signals, views own page content)."
  - "DEC-067 — Toast auto-dismiss timer is 3500ms, owned by the store (not the component). The store's clearXlFallbackTimer() is also invoked by manual dismissXlFallback() so a user click does not leave a dangling setTimeout that would re-clear an already-cleared flag. The component is purely declarative — it watches the flag and renders."

requirements-completed:
  - REQ-xl-capability-detection  # Contract level: WebGL2 probe + auto-fallback + educational toast all live; Phase 7 will plug the actual stack into the same hook

# Metrics
duration: ~3 min
completed: 2026-05-05
---

# Phase 6 Plan 02: WebGL2 capability gate + L fallback toast — Summary

**Established the XL capability-detection contract end-to-end: WebGL2 probe composable, Pinia store auto-fallback to L, mounted educational toast, and verified lazy-load discipline (zero XL-stack libraries imported anywhere in the codebase). Picking XL on a non-WebGL2 browser is now a survivable, dismissible, accessible event.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-05T04:29:16Z
- **Completed:** 2026-05-05T04:32:19Z
- **Tasks:** 4 (3 commits + 1 verification-only)
- **Files created:** 2 (`useXlCapability.ts`, `XlFallbackToast.vue`)
- **Files modified:** 2 (`stores/style.ts`, `App.vue`)

## Accomplishments

- Authored `src/composables/useXlCapability.ts` — pure DOM probe via `canvas.getContext('webgl2')`, throwaway canvas (zeroed dimensions in `finally`), module-scope memoization, SSR-safe (`typeof document === 'undefined'` early return). Exports both `probeXlCapability()` (plain function, callable from the store) and `useXlCapability()` (reactive composable wrapper).
- Extended `src/stores/style.ts`: `setLevel(5)` now calls `probeXlCapability()` and rewrites the target to `4` (L) when `supported === false`. Reactive `xlFallback: { active, reason }` exposed; `dismissXlFallback()` method clears flag + cancels auto-clear timer. Other levels (1–4) pass through untouched.
- Created `src/components/XlFallbackToast.vue` with `<script setup lang="ts">`, `role="status"`, `aria-live="polite"`, dismiss button, copy that explicitly mentions WebGL2 and the L (Bold) fallback. Styled exclusively via `var(--bg)`, `var(--ink)`, `var(--accent)`, `var(--font-body)` so it inherits whatever level is active — works on M, L, and any market block without per-style overrides.
- Mounted the toast in `src/App.vue` inside the existing `<Teleport to="body">` block alongside `ReconfigureOverlay` so it survives `<RouterView>` swaps.
- Verified the lazy-load contract: `package.json` contains none of `three / @tresjs/core / phaser / tone / postprocessing / cannon-es / @dimforge/rapier3d`, and `git grep` finds zero such imports in `src/` or `scripts/`. Build emits zero chunks matching those names.

## Task Commits

Each task was committed atomically:

1. **Task 1: useXlCapability composable** — `265a433` (feat)
2. **Task 2: Style store XL → L auto-fallback** — `ba65d43` (feat)
3. **Task 3: XlFallbackToast + App.vue mount** — `132e4aa` (feat)
4. **Task 4: Bundle audit** — verification-only, no commit (per plan)

_Plan metadata commit follows this SUMMARY._

## Files Created/Modified

- **Created** `src/composables/useXlCapability.ts` — `probeXlCapability()` (plain) + `useXlCapability()` (reactive); memoized; zero XL-stack imports.
- **Created** `src/components/XlFallbackToast.vue` — accessible toast bound to `style.xlFallback.active`; dismiss button calls `style.dismissXlFallback()`; token-driven styling.
- **Modified** `src/stores/style.ts` — added `xlFallback` reactive ref + timer + `dismissXlFallback()` method; `setLevel()` now branches on the WebGL2 probe when `n === 5`; `XL_FALLBACK_MS = 3500` constant; new import from `@/composables/useXlCapability`.
- **Modified** `src/App.vue` — added `XlFallbackToast` import + mount inside the existing `<Teleport to="body">` block.

## Decisions Made

- **DEC-064 — XL → L fallback owned by the store (atomic).** `setLevel(5)` rewrites the target to `4` before assigning `level.value` when WebGL2 is missing. Views never observe an intermediate XL state on a non-WebGL2 browser; mutations remain single-assignment per LOCKED-002.
- **DEC-065 — Probe memoization at module scope, not composable scope.** The store calls `probeXlCapability()` directly without setting up reactivity; the `useXlCapability()` composable just wraps the same memoized result in a `ref`. Keeps the surface minimal and idempotent.
- **DEC-066 — Toast lives in App.vue's Teleport-to-body block.** Mirrors the pattern established by `ReconfigureOverlay` (DEC-016) and `IntensityChooser` (DEC-021). Per-view mounts would lose the toast on route navigation.
- **DEC-067 — 3500 ms auto-dismiss; manual dismiss cancels timer.** The store owns the timer so a manual dismiss cleanly cancels it; the component is purely declarative.

## Deviations from Plan

None — plan executed exactly as written. All four tasks' verify gates passed on first run; no Rule 1/2/3 auto-fixes triggered; no Rule 4 architectural escalations required. The plan's contract — composable + store extension + toast + bundle audit — mapped 1:1 onto the codebase's existing extension points (Teleport-to-body in App.vue, single `setLevel()` in the store, no preexisting `composables/` directory so no naming conflicts).

## Issues Encountered

- **Bash tool defaulted to bash, not PowerShell.** First attempt to record `PLAN_START_TIME` used PowerShell syntax inside the bash tool and failed. Switched to `date -u +"%Y-%m-%dT%H:%M:%SZ"` (POSIX). No code or commit impact — purely a timing-record accommodation.

## Lazy-load contract verified

- `package.json` is clean of `three`, `@tresjs/core`, `phaser`, `tone`, `postprocessing`, `cannon-es`, `@dimforge/rapier3d`.
- `git grep` across `src/` and `scripts/` finds zero imports from any of those packages.
- `pnpm build` emits 7 view-level chunks, 1 ChangeStyleControl chunk, the index bundle (123.11 kB / 48.06 kB gzipped) — none match XL-stack names.
- Phase 7 will be the first plan to install Three.js / Phaser / Tone.js. The `supported === true` branch of `probeXlCapability()` is the documented attachment point.

## User Setup Required

None — no external service configuration required. Operator UAT (Plan 06-04) will exercise the WebGL2-disabled path via DevTools (Rendering → "WebGL: disabled" or equivalent), no real hardware constraint needed.

## Next Phase Readiness

- **Plan 06-03 unblocked** — HomeView XL branch (verbatim port of prototype lines 62-76) can now assume the active level is genuinely XL (not a non-WebGL2 imposter). The runtime label `[ home.scene · runtime ]` is the visible placeholder for the future Three.js scene; the L fallback is owned by the store, not by the view's `v-else-if` chain.
- **Plan 06-04 UAT now has a deterministic WebGL2-emulation step** — operator opens DevTools, disables WebGL2 (Chrome: Rendering panel → "WebGL: disabled"; Firefox: `webgl.disabled = true` in `about:config`), picks XL from the gate or footer slider, confirms (a) toast appears with WebGL2 wording, (b) level snaps to L, (c) toast auto-dismisses after ~3.5 s, (d) manual dismiss button works.
- **Phase 7 baseline locked** — Three.js / Phaser / Tone.js / postprocessing / physics installation can land directly on the `supported === true` branch of `probeXlCapability()`. The composable's contract does not need to expand; Phase 7 just plugs in dynamic `import()` chains. The L fallback path remains the canonical degradation route.
- **Reduced-motion compliance maintained** — toast has a `prefers-reduced-motion: reduce` rule scaffolded for any future transition additions. Current implementation has no animation, so the rule is dormant but documented.

## Self-Check: PASSED

Verified before STATE.md / ROADMAP.md update:

- `src/composables/useXlCapability.ts` exists, exports `probeXlCapability` + `useXlCapability`, contains `getContext('webgl2')`, zero XL-stack imports.
- `src/components/XlFallbackToast.vue` exists, references `WebGL2`, binds `xlFallback`, has dismiss button + `role="status"`.
- `src/stores/style.ts` imports `probeXlCapability`, exposes `xlFallback`, exposes `dismissXlFallback`.
- `src/App.vue` imports + mounts `XlFallbackToast` inside the `<Teleport to="body">` block.
- Commit `265a433` exists in `git log` (Task 1: feat).
- Commit `ba65d43` exists in `git log` (Task 2: feat).
- Commit `132e4aa` exists in `git log` (Task 3: feat).
- `pnpm type-check` exits 0.
- `pnpm build` exits 0 (built in 2.47 s; no XL-stack chunks).
- `pnpm check:contrast` exits 0 with `OVERALL 17/17 themes pass`.
- `package.json` audit: clean of three / @tresjs/core / phaser / tone / postprocessing / cannon-es / rapier.
- `git grep` audit on `src/` and `scripts/`: zero XL-stack imports.

---
*Phase: 06-tamano-xl-unleashed*
*Plan: 02*
*Completed: 2026-05-05*
