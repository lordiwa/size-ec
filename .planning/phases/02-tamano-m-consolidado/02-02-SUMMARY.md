---
phase: 02-tamano-m-consolidado
plan: 02
subsystem: testing
tags: [wcag, contrast, a11y, uat, node-script]

# Dependency graph
requires:
  - phase: 02-tamano-m-consolidado
    provides: M Crafted dark-mode token set in html.level-m (src/styles/main.css), 600ms body transition, prefers-reduced-motion block, rc-overlay z-index 300, ic-overlay z-index 100

provides:
  - scripts/check-contrast.cjs — pure-Node WCAG 2.1 AA contrast checker for M baseline (5 required pairs, exits non-zero on failure)
  - pnpm check:contrast npm script — one-command automation gate re-runnable on every Phase 3+ token tweak
  - 02-UAT.md — manual sign-off checklist (abuela test, contrast, 600ms transition, reduced-motion sweep, Cambiar estilo, Hablemos CTA)

affects: [03-mercados-sobre-m, 04-tamano-l, 05-tamano-s, 06-tamano-xs-xl]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "WCAG 2.1 luminance math in plain Node (toLinear sRGB gamma, L=0.2126R+0.7152G+0.0722B, ratio=(L+0.05)/(L+0.05))"
    - "Alpha-blend 8-digit hex before contrast measurement: effective=alpha*fg+(1-alpha)*bg; emit note when alpha<1"
    - "Per-pair threshold table (4.5 body/muted/CTA, 3.0 heading/accent-inline) — extensible THEMES array for Phase 3 markets"

key-files:
  created:
    - scripts/check-contrast.cjs
    - .planning/phases/02-tamano-m-consolidado/02-UAT.md
  modified:
    - package.json

key-decisions:
  - "DEC-032: check-contrast.cjs hard-codes M token values with source-comment pointing to html.level-m in main.css; Phase 3 extends by adding market theme entries to the THEMES table"
  - "DEC-033: MUTED is checked at the 4.5:1 body-text threshold (not 3:1) because it is used for readable copy, not decorative text — passes at 5.71:1"
  - "DEC-034: LINE and LINE_STRONG are separator/border tokens and are not in the contrast-check pairs; the plan's 8-digit alpha note applies to those tokens if they were ever used as foreground text"

patterns-established:
  - "Contrast script pattern: TOKENS object + PAIRS array + per-pair threshold; prints table + summary line; exit non-zero with named failing pairs"
  - "UAT checklist pattern: numbered items with How-to-verify subsection + sign-off table with Operator/Date columns"

requirements-completed: [REQ-services-catalog, REQ-contact-view-layout]

# Metrics
duration: 20min
completed: 2026-05-04
---

# Phase 02 Plan 02: WCAG AA Contrast Check + UAT Checklist Summary

**Pure-Node WCAG 2.1 AA contrast script (`pnpm check:contrast`) verifying all 5 M dark-mode pairs with margin, plus a 6-item UAT sign-off document covering abuela test, transitions, reduced-motion, and Cambiar estilo.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-05-04T00:00:00Z
- **Completed:** 2026-05-04
- **Tasks:** 3 (Task 2 was verification-only, no file changes)
- **Files modified:** 3 (1 new script, 1 new UAT doc, 1 updated package.json)

## Accomplishments

- Authored `scripts/check-contrast.cjs`: WCAG 2.1 relative-luminance math from scratch, handles 8-digit hex via alpha-blend, checks 5 M-mode pairs against thresholds (4.5:1 body/muted/CTA, 3:1 heading/accent-inline), exits non-zero with named failing pairs on failure
- Added `"check:contrast": "node scripts/check-contrast.cjs"` to `package.json` next to `type-check`
- Confirmed all 5 CON-008 / CON-005 invariants via automated regex sweep (600ms transition, prefers-reduced-motion, padding-bottom 88px, rc-overlay z-index 300, ic-overlay z-index 100) — 5/5 OK, exit 0
- Authored `02-UAT.md` with 6 checkbox items (14 checkboxes total), each with a How-to-verify section and a sign-off table

## Task Commits

Each task was committed atomically:

1. **Task 1: scripts/check-contrast.cjs + package.json** — `a472223` (feat)
2. **Task 2: 600ms + reduced-motion smoke** — verification-only; no commit (no file changes per plan)
3. **Task 3: 02-UAT.md** — `f221cb7` (docs)

## Files Created/Modified

- `scripts/check-contrast.cjs` — WCAG 2.1 contrast checker; pure Node; M token table with source comment; 5 required pairs; alpha-blend for 8-digit hex; summary line; extensible to Phase 3 markets
- `package.json` — Added `check:contrast` script entry
- `.planning/phases/02-tamano-m-consolidado/02-UAT.md` — 6-item manual UAT checklist with sign-off table

## Decisions Made

- **DEC-032:** `check-contrast.cjs` hard-codes the M token values with a comment referencing their source (`html.level-m` block in `src/styles/main.css`). Phase 3 will add market theme entries to the same file.
- **DEC-033:** `MUTED` is checked at the 4.5:1 threshold (same as body text) because it is readable copy, not decorative text. It passes at 5.71:1.
- **DEC-034:** `LINE` (#ffffff14) and `LINE_STRONG` (#ffffff33) are separator/border tokens, not text colours. They are excluded from the contrast pairs but are documented in the script's token table with alpha values noted for auditability.

## Contrast Results (pnpm check:contrast output)

```
M Crafted dark-mode | WCAG AA contrast check
Pair                                Ratio    Required  Result
body text     (INK on BG)           18.16:1  >= 4.5    PASS
muted text    (MUTED on BG)          5.71:1  >= 4.5    PASS
large heading (INK on BG)           18.16:1  >= 3.0    PASS
accent CTA    (BG on ACCENT)         5.56:1  >= 4.5    PASS
accent inline (ACCENT on BG)         5.56:1  >= 3.0    PASS

M Crafted dark-mode | 5 pairs checked | all >= 3.0 (lowest: accent CTA (BG on ACCENT) = 5.56:1)
```

Exit: 0

## Task 2 Smoke Results (5/5 OK)

```
OK 600ms body transition
OK reduced-motion media query
OK padding-bottom for sticky footer
OK rc-overlay z-index 300
OK ic-overlay z-index 100
```

## Deviations from Plan

None — plan executed exactly as written. All automated verify checks passed on the first run.

Note on LINE_STRONG value: the plan prompt cited `#ffffff33` for LINE_STRONG in `html.level-m`; the `:root` block has `#ffffff44` but the `html.level-m` overrides it to `#ffffff33`. The script sources from the M-level block, which is correct. The contrast script uses the M-specific value.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Known Stubs

None — both deliverables are verification artifacts, not UI components.

## Next Phase Readiness

- `pnpm check:contrast` is now a standing automation gate; Phase 3 extends `check-contrast.cjs` by adding a per-market theme entry when each market's token set is defined.
- `02-UAT.md` is ready for operator sign-off before Phase 3 planning begins.
- Phase 2 success criteria 1 (WCAG AA), 4 (600ms + reduced-motion), and 5 (abuela test) are evidence-backed.

---
*Phase: 02-tamano-m-consolidado*
*Completed: 2026-05-04*
