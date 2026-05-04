---
phase: 03-mercados-sobre-m
plan: 01
subsystem: ui
tags: [wcag, contrast, accessibility, market-themes, check-contrast]

# Dependency graph
requires:
  - phase: 02-tamano-m-consolidado
    provides: scripts/check-contrast.cjs M-baseline checker + pnpm check:contrast script

provides:
  - scripts/check-contrast.cjs extended to cover M baseline + 12 market themes (13 total)
  - .planning/phases/03-mercados-sobre-m/03-CONTRAST-RESULTS.md with full per-market audit
  - BLOCKED: token remediation for 9 single-token markets + 2 two-token markets (cpg, turismo)

affects: [03-mercados-sobre-m remaining plans, phase-7-polish, any plan touching market themes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Market muted derivation: color-mix(ink 55%, transparent) → Porter-Duff alpha-blend in Node"
    - "Pure-Node TS data extraction: regex-based SIZE_MARKETS parser, no esbuild/tsx dependency"

key-files:
  created:
    - .planning/phases/03-mercados-sobre-m/03-CONTRAST-RESULTS.md
  modified:
    - scripts/check-contrast.cjs

key-decisions:
  - "Muted contrast computed via alpha-blend (ink×55% over bg) matching the html.has-market CSS rule, not a raw token"
  - "cpg and turismo each need 2 tokens (ink + primary) to clear all failures — plan aborted per DEC-018 pending user sign-off"
  - "7 markets need only ink darkening (1 token each) — proposed values computed but not committed"
  - "3 markets pass natively: automotriz, bebidas, tech"

patterns-established:
  - "check-contrast.cjs: reusable buildPairs(tokens) + runTheme(title, tokens) pattern for any future theme"
  - "OVERALL N/13 exit-code gate as CI-ready re-runnable contract"

requirements-completed: [REQ-markets-twelve]

# Metrics
duration: 45min
completed: 2026-05-04
---

# Phase 03, Plan 01: 12-Market WCAG AA Audit Summary

**check-contrast.cjs extended to 13 themes via regex-parsed SIZE_MARKETS; 4/13 pass natively; 9 need 1-token ink darkening; cpg and turismo blocked on 2-token rework pending user approval**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-05-04T00:00:00Z
- **Completed:** 2026-05-04T00:45:00Z
- **Tasks:** 2 (Task 1 complete; Task 2 aborted per plan rule)
- **Files modified:** 2

## Accomplishments

- Extended `scripts/check-contrast.cjs` from M-only to all 13 themes with a regex-based
  SIZE_MARKETS parser, `buildPairs()` helper that replicates the `color-mix(ink 55%, transparent)`
  CSS derivation for market muted, and `--markets-only` CLI flag.
- OVERALL N/13 summary line with per-theme fail counts; exit non-zero on any failure.
- Full pre-remediation audit captured in `03-CONTRAST-RESULTS.md` with exact before ratios,
  proposed minimum token tweaks, and mathematically verified after ratios.
- Identified root cause: 55% ink opacity blend on near-white bgs produces mid-tones that fall
  short of 4.5:1; fix is minimal ink darkening toward pure black.
- Surfaced that cpg (3 pairs fail: muted + CTA + inline) and turismo (2 pairs fail: muted + CTA)
  each require changes to two independent tokens, triggering the plan's abort rule.

## Task Commits

1. **Task 1: Extend check-contrast to 12 market themes** - `1cc3f0c` (feat)
2. **Task 2: Audit document** - `1a1f475` (docs — no token changes committed per abort rule)

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `scripts/check-contrast.cjs` — Rewrote to add SIZE_MARKETS regex parser, `buildPairs()`,
  `runTheme()`, OVERALL line, `--markets-only` flag; M block preserved verbatim in structure
- `.planning/phases/03-mercados-sobre-m/03-CONTRAST-RESULTS.md` — Full audit: methodology,
  M baseline, pre-remediation table, triage analysis, per-market proposed tweaks, abort reason

## Decisions Made

- Market muted is computed as `alphaBlend({ ...ink, a: 0.55 }, bg)` — matching the CSS
  `color-mix(in srgb, var(--ink) 55%, transparent)` rule that applies in `html.has-market` mode.
  Using a raw `--muted` token would produce wrong numbers for light-bg markets.
- Plan aborted before committing any token changes to `src/data/size-data.ts` because cpg and
  turismo each require 2-token fixes, which per DEC-018 and the plan constraint requires explicit
  user approval before application.

## Deviations from Plan

None — plan executed exactly as written, including the abort rule for markets needing >1 token.

## Issues Encountered

The dominant failure pattern was unexpected: 9 of 12 markets fail the muted pair. The context
doc anticipated failures in automotriz (silver primary on dark), bebidas (amber on dark), and
turismo (teal on cream) — but automotriz and bebidas actually PASS. The real failures are all
light-bg markets where the ink-at-55% blend falls short of 4.5:1. Only 3 markets pass natively
(automotriz, bebidas, tech — all dark-bg or high-saturation themes).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**BLOCKED on user sign-off for cpg and turismo 2-token reworks.**

Once approved, the follow-up commit to `src/data/size-data.ts` applies:

| market | token | old | new |
|--------|-------|-----|-----|
| cpg | ink | #1A1A1A | #040404 |
| cpg | primary | #FF5A1F | #D23700 |
| banca | ink | #0A2540 | #010304 |
| retail | ink | #0A0A0A | #060606 |
| salud | ink | #0F2A3F | #020609 |
| inmobiliario | ink | #1F1F1F | #000000 |
| educacion | ink | #0F1B3D | #03050c |
| turismo | ink | #1A2E2E | #010202 |
| turismo | primary | #0E7C7B | #0D7776 |
| moda | ink | #0A0A0A | #020202 |
| startups | ink | #0F0F0F | #050505 |

After that commit, `pnpm check:contrast` should exit 0 with `OVERALL 13/13 themes pass`.

---
*Phase: 03-mercados-sobre-m*
*Completed: 2026-05-04*
