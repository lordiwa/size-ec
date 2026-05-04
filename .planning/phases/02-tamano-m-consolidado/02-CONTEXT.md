# Phase 2: Tamaño M (Crafted) consolidado — Context

**Gathered:** 2026-05-04
**Status:** Ready for planning
**Source:** Direct authoring (Phase 1 prototype-parity already shipped 90% of Phase 2; orchestrator skipped the agent loop because gaps are mechanical and small)

<domain>
## Phase Boundary

Phase 1 (Paridad prototipo) shipped a working M Crafted dark-mode default across all 5 routes, the intensity gate as a session-scoped modal, the Reconfigurando overlay, the markets dropdown on Home with in-place restyle, and the prototype's 40/60 Contacto, team timeline, client cases, and full 11-service Servicios layouts. State is session-only — no `localStorage`, every visit re-triggers the gate.

Phase 2 closes the **last legibility + control gaps** that Phase 1 deferred:

1. Servicios (no-market case) needs a closing CTA to Contacto and a "Cambiar estilo" reopen-the-gate control, per ROADMAP §Phase 2 SC #2.
2. WCAG AA contrast must be auto-verified across the 5 M views (body ≥ 4.5:1, large text ≥ 3:1) — automated check, not just visual.
3. Transition timing in main.css is currently 600ms — already correct, but re-verify the CON-008 "no full reload" invariant after the gate-modal + Reconfigurando overlay landed.
4. Document the abuela-test acceptance heuristic as a manual UAT line so Phase 2 can be marked done.

Phase 3 (Mercados sobre M) layers all 12 market styles on top of M; Phase 2 does NOT touch market mode beyond verifying that exiting a market falls back to M cleanly.

## What's Out of Scope

- L / S / XS / XL level branches in HomeView and other views (Phases 4–6).
- Per-market service copy or service filtering refinements (Phase 3).
- Real chatbot provider for Contacto (Phase 8).
- SEO / analytics / 17-style smoke (Phase 9).
- Re-introducing localStorage persistence (locked out by user decision 2026-05-04: state is session-only).

## Phase 1 → Phase 2 invariants

- IntensityChooser and ReconfigureOverlay are the only two full-screen overlays. Phase 2 must not introduce a third.
- LOCKED-001 (WCAG AA) and LOCKED-002 (mutually exclusive styles) hold.
- The single-flag mental model from PROJECT.md is still respected, just expressed as session refs (`level`, `levelChosen`, `marketId`) instead of localStorage tagged-union.

</domain>

<decisions>
## Locked Decisions

| ID | Decision | Source |
|----|----------|--------|
| LOCKED-001 | WCAG AA legibility in all 17 styles. Body ≥ 4.5:1, large text ≥ 3:1. | PROJECT.md / brief §3 |
| LOCKED-002 | Single active style at a time; 12 + 5 = 17, never 60. | PROJECT.md / brief §3.bis |
| DEC-014 | Roadmap is prototype-first; deploy + Cierre live in Phase 9. | STATE.md 2026-05-04 |
| DEC-015 | State is session-only — NO localStorage. The gate triggers on every fresh session. | User decision 2026-05-04 (chat) |
| DEC-016 | Reconfigurando overlay (~900ms) plays on every level/market change, telegraphing the restyle. | User decision 2026-05-04 (chat) |
| DEC-017 | Picking a market on Home keeps the user on Home with the market style applied live; does NOT auto-navigate. | User decision 2026-05-04 (chat) |

## Claude's Discretion (resolve in plans)

- D-01 — "Cambiar estilo" control on Servicios: how to render. **Decision:** small mono-uppercase button in the same row as the canonical-order eyebrow, label "Cambiar estilo", click reopens the gate by setting `levelChosen=false` (does not clear current `level` so the previously selected tick stays highlighted as a default). Same control lives on Quiénes somos and Contacto for symmetry — single component reused.
- D-02 — Servicios CTA copy + destination. **Decision:** label "Hablemos →", target `{ name: 'contacto' }`, render at the end of the no-market service grid as a centered `.bright-cta`. In market mode the CTA is suppressed because the user is in narrative-detail mode and "← Cambiar categoría" is already there.
- D-03 — WCAG AA automation: how to check. **Decision:** add `scripts/check-contrast.cjs` that reads the M token values from `src/styles/main.css` and computes WCAG contrast ratios for each ink/bg + accent/bg pair against the canonical 4.5:1 / 3:1 thresholds. Called from a new `pnpm check:contrast` script; emits non-zero exit on failure. Phase 3 will extend the same script with the 12 market themes.
- D-04 — Reduced-motion verification: covered by existing `@media (prefers-reduced-motion: reduce)` rule in main.css plus per-component opt-outs (RotatingWord, ReconfigureOverlay). Phase 2 only documents that the audit was run, no code change unless a regression is found.

</decisions>

<refs>
## Canonical Refs

- `.planning/PROJECT.md` — locked rules + decisions
- `.planning/ROADMAP.md` — Phase 2 success criteria (lines 49–60)
- `.planning/REQUIREMENTS.md` — REQ-services-catalog, REQ-contact-view-layout
- `.planning/phases/01-paridad-prototipo/01-CONTEXT.md` — Phase 1 token + transition decisions
- `ExistingData/SIZE-design-brief-v4.md` — §3, §5 (services per market), §11 (TBDs)
- `src/styles/main.css` — M token block (lines 60+) and 600ms body transition
- `src/views/ServiciosView.vue` — current no-market and market layouts (Phase 1)
- `src/components/IntensityChooser.vue` — modal gate (Phase 1)
- `src/stores/style.ts` — session-only state model (Phase 1)
</refs>
