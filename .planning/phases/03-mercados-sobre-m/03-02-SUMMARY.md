---
phase: 03-mercados-sobre-m
plan: 02
subsystem: ui
tags: [markets, service-integrity, wcag, uat, check-markets, contrast]

# Dependency graph
requires:
  - phase: 03-mercados-sobre-m
    plan: 01
    provides: "scripts/check-contrast.cjs extended to 13 themes; 03-CONTRAST-RESULTS.md; token remediation committed"

provides:
  - scripts/check-markets.cjs — service-list integrity check for all 12 markets (id validity, no dupes, length 5-11, copy coverage >=80%)
  - pnpm check:markets — wired in package.json scripts
  - .planning/phases/03-mercados-sobre-m/03-UAT.md — operator sign-off document (recognisability + 48-state matrix + transition smoke)

affects: [phase-4-onward, any plan touching size-data.ts markets or service copy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "check-markets.cjs: regex-based SIZE_MARKETS + SIZE_SERVICE_COPY parser mirroring check-contrast.cjs approach — no esbuild/tsx dependency"
    - "Per-market copy coverage report: covered/total (pct%) with PASS/WARN/FAIL thresholds (>=80/60-80/<60)"
    - "Size_SERVICE_COPY brace-depth extractor: iterates source chars to find the matching closing brace of the outer object"

key-files:
  created:
    - scripts/check-markets.cjs
    - .planning/phases/03-mercados-sobre-m/03-UAT.md
  modified:
    - package.json

key-decisions:
  - "Task 2 (smoke) requires no commit — it is verification-only (no file changes); documented as passed in summary"
  - "03-UAT.md Section B uses a fixed-width text grid instead of a Markdown table to keep 48 cells scannable in one glance"
  - "Copy coverage thresholds: PASS >=80%, WARN 60-80%, FAIL <60% — all 12 markets achieve 100% so no warnings triggered"

patterns-established:
  - "check-markets.cjs: SIZE_SERVICE_COPY parsed via brace-depth walk (handles nested strings safely)"
  - "OVERALL N/12 exit-code gate is CI-ready and re-runnable on every size-data.ts edit"

requirements-completed: [REQ-markets-twelve]

# Metrics
duration: 3min
completed: 2026-05-04
---

# Phase 03, Plan 02: Service Integrity + UAT Summary

**Pure-Node check-markets script validates all 12 markets at 100% copy coverage (12/12 PASS); 6/6 smoke checks OK; 03-UAT.md authored with 79 checkboxes covering 12-market recognisability + 48-state view matrix + transition smoke**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-04T22:41:53Z
- **Completed:** 2026-05-04T22:45:00Z
- **Tasks:** 3 (Task 1 feat, Task 2 verify-only, Task 3 docs)
- **Files modified:** 3 (scripts/check-markets.cjs, package.json, 03-UAT.md)

## Accomplishments

- Created `scripts/check-markets.cjs` (pure Node, no third-party deps) using the same regex-parse pattern as `check-contrast.cjs`. Validates all 12 markets: service id validity, no duplicates, length in [5, 11], and copy coverage against `SIZE_SERVICE_COPY`. Prints a per-market block + OVERALL line; exits non-zero on any FAIL.
- All 12 markets: 100% copy coverage, all service ids valid, all lengths in range. OVERALL 12/12 PASS.
- Task 2 smoke: 6/6 checks pass — `--mkt-primary` setProperty, `--mkt-bg` setProperty, `has-market` classList, `pulseReconfigure` call, `html.has-market --muted` CSS rule, and `600ms body transition`.
- Created `03-UAT.md` with Section A (12-row recognisability table), Section B (12×4 = 48-cell QA matrix in text grid format), Section C (transition smoke checkbox), and Section D (sign-off + automated gate checklist). 79 total checkboxes; references `03-CONTRAST-RESULTS.md`.
- `pnpm check:contrast` (13/13 PASS), `pnpm check:markets` (12/12 PASS), `pnpm type-check` (exit 0), `pnpm build` (exit 0) — all four gates green.

## Task Commits

1. **Task 1: Author scripts/check-markets.cjs** - `9f77cd2` (feat)
2. **Task 2: Smoke market token application + transitions** - no commit (verification-only; no file changes per plan)
3. **Task 3: Author 03-UAT.md** - `aaf37ba` (docs)

## Files Created/Modified

- `scripts/check-markets.cjs` — Service-list integrity check; parses SIZE_SERVICES keys, SIZE_MARKETS services arrays, SIZE_SERVICE_COPY coverage via brace-depth walk
- `package.json` — Added `"check:markets": "node scripts/check-markets.cjs"` next to `check:contrast`
- `.planning/phases/03-mercados-sobre-m/03-UAT.md` — Operator sign-off document; 79 checkboxes, 4 sections

## Decisions Made

- Task 2 is verification-only per the plan (`<files>(no file changes — verification only)</files>`). All 6 smoke checks pass from existing code. No commit generated.
- Section B of 03-UAT.md uses a fixed-width text grid rather than a Markdown table — 48 cells in a table would be unreadable; the text grid scans faster in a terminal or editor.
- The plan's automated verify for Task 1 uses `tee /tmp/markets.txt` (POSIX path). On Windows this fails. Verified equivalently using `$TEMP` path — the script output itself is correct and the logic passes. No code change needed.

## Deviations from Plan

None — plan executed exactly as written.

The `/tmp/markets.txt` POSIX path in the plan's inline verify command does not resolve on Windows (the Bash tool's environment does not have `/tmp`). This is a platform-only issue with the verify command text, not with the script or its output. The equivalent Windows-path verify produced `ok 12 lines + OVERALL`.

## Issues Encountered

None beyond the Windows `/tmp` path noted above in Decisions. Resolved inline without any code changes.

## User Setup Required

None — no external service configuration required. This plan is tooling and documentation only.

## Known Stubs

None — `check-markets.cjs` is a pure verification script with no UI output. `03-UAT.md` is a sign-off template intentionally unpopulated pending operator walk-through.

## Next Phase Readiness

Phase 3 automated gates are now fully wired:

- `pnpm check:contrast` — 13/13 themes pass WCAG AA
- `pnpm check:markets` — 12/12 markets valid

Operator must walk `03-UAT.md` (Sections A–D) before Phase 4 planning begins. Section A (recognisability) and Section B (48-state matrix) require manual human confirmation — they cannot be automated. Section C (transition smoke) is a single checkbox requiring 4-market manual switch.

Phase 3 success criteria status after Plans 01 + 02:
- SC 1 (12 token sets): DONE (tokens + WCAG AA remediation in 03-01)
- SC 2 (filtered services): DONE (check:markets gate, 12/12 valid arrays)
- SC 3 (recognisability): STAGED — 03-UAT.md Section A awaits operator sign-off
- SC 4 (WCAG AA): DONE (check:contrast 13/13, committed 03-01)
- SC 5 (transitions): STAGED — 03-UAT.md Section C awaits operator walk-through; automated smoke passes

---
*Phase: 03-mercados-sobre-m*
*Completed: 2026-05-04*
