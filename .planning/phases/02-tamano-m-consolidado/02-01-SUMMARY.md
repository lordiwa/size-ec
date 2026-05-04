---
phase: 02-tamano-m-consolidado
plan: 01
subsystem: ui
tags: [vue3, pinia, composables, router-link, wcag]

# Dependency graph
requires:
  - phase: 01-paridad-prototipo
    provides: IntensityChooser modal gate, useStyleStore session refs (level/levelChosen/marketId), ServiciosView/QuienesSomosView/ContactoView route components, bright-cta atom
provides:
  - reopenGate() Pinia action — non-destructive gate reopener (levelChosen=false, level intact)
  - ChangeStyleControl.vue — reusable mono-uppercase pill button used on all three protected views
  - Servicios no-market head row: eyebrow + ChangeStyleControl
  - Servicios no-market grid foot: "Hablemos →" RouterLink to /contacto
  - QuienesSomosView head row: eyebrow + ChangeStyleControl
  - ContactoView head row: eyebrow + ChangeStyleControl
affects: [03-mercados-sobre-m, 04-tamano-l, 05-tamano-s, 06-tamano-xs-xl]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Non-destructive gate reopen: set levelChosen=false, leave level/marketId untouched so modal reopens with previously highlighted tick"
    - "ChangeStyleControl: single-responsibility pill component, scoped CSS, calls store action directly, emits nothing"
    - "Head-row flex pattern: eyebrow left, control right, flex-wrap for mobile stacking under 720px"

key-files:
  created:
    - src/components/ChangeStyleControl.vue
  modified:
    - src/stores/style.ts
    - src/views/ServiciosView.vue
    - src/views/QuienesSomosView.vue
    - src/views/ContactoView.vue

key-decisions:
  - "DEC-029: reopenGate() is intentionally non-destructive — only levelChosen flips to false so the gate modal shows with the user's prior level highlighted, not reset to M"
  - "DEC-030: ChangeStyleControl uses var(--muted)/var(--ink) tokens so it works on both dark M and any market background without level-specific overrides (Phases 4-6 extend if needed)"
  - "DEC-031: Hablemos CTA placed in a flex-center wrapper div after .srv-grid, before .srv-foot, in no-market branch only (market branch already has Cambiar categoria nav)"

patterns-established:
  - "Reusable pill button pattern: 999px border-radius, 11px mono-uppercase, transparent bg, var(--line-strong) border, var(--muted) color, hover to var(--ink)"
  - "Head-row pattern: flex, center, gap 16px, flex-wrap for mobile — reused in Servicios, QuienesSomos, Contacto"

requirements-completed: [REQ-services-catalog, REQ-contact-view-layout]

# Metrics
duration: 15min
completed: 2026-05-04
---

# Phase 02 Plan 01: Cambiar estilo control + Hablemos CTA Summary

**Non-destructive gate-reopener (reopenGate Pinia action) wired to a reusable ChangeStyleControl pill on all three protected views, plus a "Hablemos →" RouterLink closing the Servicios funnel to /contacto.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-04T00:00:00Z
- **Completed:** 2026-05-04
- **Tasks:** 4
- **Files modified:** 5 (1 store, 1 new component, 3 views)

## Accomplishments

- Added `reopenGate()` to the Pinia style store — sets `levelChosen=false`, leaves `level`/`marketId` untouched so the modal reopens with the previously highlighted tick
- Authored `ChangeStyleControl.vue`: single-responsibility pill button with scoped CSS using CSS custom properties, no props, no emits
- Wired `ChangeStyleControl` into the no-market head row of `ServiciosView` and added the centered "Hablemos →" `RouterLink` pointing to `{ name: 'contacto' }` after the service grid
- Mounted `ChangeStyleControl` in the head rows of `QuienesSomosView` and `ContactoView` using the same flex-row layout pattern
- `pnpm type-check` and `pnpm build` green (72 modules, 2.79s)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add reopenGate action to style store** — `94114bb` (feat)
2. **Task 2: Author ChangeStyleControl reusable component** — `b2ab7c4` (feat)
3. **Task 3: Mount Cambiar estilo + Hablemos CTA on ServiciosView** — `0b863bd` (feat)
4. **Task 4: Mount Cambiar estilo on QuienesSomos and Contacto** — `b50c257` (feat)

## Files Created/Modified

- `src/stores/style.ts` — Added `reopenGate()` action and exported it from the store return tuple
- `src/components/ChangeStyleControl.vue` — New reusable pill button; imports `useStyleStore`, calls `reopenGate()` on click
- `src/views/ServiciosView.vue` — Added `ChangeStyleControl` import, head-row flex wrapper, and "Hablemos →" CTA after `.srv-grid` in no-market branch
- `src/views/QuienesSomosView.vue` — Added `ChangeStyleControl` import and head-row flex wrapper
- `src/views/ContactoView.vue` — Added `ChangeStyleControl` import and head-row flex wrapper

## Decisions Made

- **DEC-029:** `reopenGate()` only flips `levelChosen=false`; `level` and `marketId` are intentionally left untouched. This ensures the IntensityChooser reopens with the user's previous level highlighted rather than resetting to M (per 02-CONTEXT.md D-01).
- **DEC-030:** `ChangeStyleControl` uses only `var(--muted)` and `var(--ink)` — tokens that resolve correctly on both dark M and any of the 12 market backgrounds. No level-specific overrides added; Phases 4-6 extend if needed.
- **DEC-031:** "Hablemos →" CTA is placed in a centered flex wrapper `div.srv-cta-row` between `.srv-grid` and `.srv-foot` in the no-market branch only. The market branch already contains "← Cambiar categoría" and is not touched.

## Deviations from Plan

None — plan executed exactly as written. The automated verify checks for all four tasks passed on the first run. No deviation rules were triggered.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 02-01 fully satisfied: `ChangeStyleControl` mounted on all three protected views, `reopenGate()` is the sole mechanism, `pnpm type-check` + `pnpm build` green.
- Ready for Plan 02-02 (WCAG AA contrast automation — `scripts/check-contrast.cjs` + `pnpm check:contrast`).
- Phase 3 (Mercados sobre M) can import `ChangeStyleControl` from `@/components/ChangeStyleControl.vue` as-is; market branch already uses its own "← Cambiar categoría" control.

## Known Stubs

None — all wired behavior is functional. The chatbot in `ContactoView` is a known stub from Phase 1 (wired in Phase 8); it is not part of this plan's scope.

---
*Phase: 02-tamano-m-consolidado*
*Completed: 2026-05-04*
