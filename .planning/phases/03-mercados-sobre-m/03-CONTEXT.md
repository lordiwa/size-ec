# Phase 3: Mercados sobre M — Context

**Gathered:** 2026-05-04
**Status:** Ready for planning
**Source:** Direct authoring — Phase 1 prototype-port already wired the runtime; Phase 3's work is verification + a contrast remediation if any of the 12 themes fall under WCAG AA.

<domain>
## Phase Boundary

Phase 1 already shipped:
- `src/data/size-data.ts` — 12 markets with theme tokens (primary/secondary/bg/ink/display/body) and per-market `services[]` arrays in canonical order.
- `src/data/size-data.ts` — `SIZE_SERVICE_COPY` with per-market × per-service short copy.
- `src/App.vue` — applies `--mkt-primary`, `--mkt-secondary`, `--mkt-bg`, `--mkt-ink`, `--mkt-display`, `--mkt-body`, plus the live `--bg`/`--ink`/`--accent`/etc. tokens via `setProperty`. Adds `html.has-market`. Drops `level-{x}` class.
- `src/views/ServiciosView.vue` — market-mode branch renders `style.market.services` with per-market copy.
- `src/components/MarketSelect.vue` — dropdown with all 12 markets on Home.
- `src/components/ReconfigureOverlay.vue` — fires on every market change, ~900ms.

Phase 3 closes:

1. **Per-market WCAG AA verification** — auto-check all 12 markets against the same 5-pair contract used for M (body, muted-on-bg, large heading, accent-CTA, accent-inline). Some prototype themes are likely tight: `automotriz` (silver primary on dark), `bebidas` (amber secondary on dark), `turismo` (teal primary on cream). The script must surface fails before sign-off; remediation is per-token tuning, not rewriting markets.

2. **Service filtering QA** — verify each of the 12 markets renders ONLY the services listed in `market.services[]`, in the correct canonical order, with the correct per-market copy (or fallback copy if a copy entry is missing). 12 markets × variable services = 96 service-card states.

3. **Market recognisability sign-off** — each market is identifiable as its industry without being told. Strategist QA: pass/fail per market.

4. **Switch-between-markets smoke** — picking a different market from Home (or via the gate flow) reconfigures in ≤ ~600ms with the Reconfigurando overlay; no full reload, no flash beyond the overlay.

5. **48-state QA matrix UAT** — 12 markets × 4 view-states (Servicios full, Quiénes somos with M-fallback team, Home with rotator, Contacto with channels). Document each cell pass/fail.

## What's Out of Scope

- L / S / XS / XL level branches (Phases 4–6).
- Per-market typography fine-tuning beyond the prototype's `theme.display` / `theme.body` (Phase 7 polish if needed).
- Per-market photography/imagery (Phase 7 content).
- Real chatbot provider on Contacto (Phase 8).
- Cross-market animations beyond the existing Reconfigurando overlay (out of scope for this phase).

## Phase 2 → Phase 3 invariants

- LOCKED-001 (WCAG AA) and LOCKED-002 (mutual exclusivity) hold.
- `pnpm check:contrast` exists and passes for M; Phase 3 extends it but does NOT regress the M baseline.
- Session-only state model (DEC-015) holds — no localStorage.
- Reconfigurando overlay (DEC-016) plays on every market change.
- ChangeStyleControl from Phase 2 still works in market mode (calls `reopenGate`, modal pops, user can switch to a level which clears market via `setLevel`).

</domain>

<decisions>
## Locked Decisions

| ID | Decision | Source |
|----|----------|--------|
| LOCKED-001 | WCAG AA legibility, including all 12 market themes. | PROJECT.md / brief §3 |
| LOCKED-002 | Single active style; market clears level. | PROJECT.md / brief §3.bis |
| DEC-014 | Roadmap is prototype-first; deploy + Cierre live in Phase 9. | STATE.md |
| DEC-015 | Session-only state — no localStorage. | User decision 2026-05-04 |
| DEC-016 | Reconfigurando overlay on every level/market change. | User decision 2026-05-04 |
| DEC-018 | Market themes are LOCKED to the prototype's `theme` blocks in size-data.ts. Phase 3 only TUNES tokens that fail WCAG AA, never replaces a palette. | This phase, 2026-05-04 |

## Claude's Discretion (resolve in plans)

- D-01 — Contrast remediation strategy. **Decision:** for any market that fails the 5-pair contract, document the fail in a `MARKETS-CONTRAST-FAILS.md` and propose the smallest possible token tweak (usually darkening the muted-derived value or strengthening the accent against the bg). Apply only the minimum tweak required to clear the threshold; preserve the brand colour identity. Do NOT replace the primary/secondary palette. If a tweak alters more than 1 token per market, surface to the user before committing.
- D-02 — Service filtering verification: how to QA 96 service-card states. **Decision:** add a Vitest-like assertion *script* (pure Node, parses size-data.ts via dynamic import + tsx) that for each market:
  1. Reads `market.services[]`.
  2. Verifies every id is a valid `ServiceId` in `SIZE_SERVICES`.
  3. Verifies the array length matches the brief's per-market subset (count check from brief §5).
  4. Verifies `SIZE_SERVICE_COPY[market.id]` exists and covers ≥80% of the market's services (the prototype has copy gaps in a few markets — flag, don't fail).
  Wired as `pnpm check:markets`. Pure Node, no jsdom needed.
- D-03 — Market recognisability sign-off: how to capture. **Decision:** a `03-UAT.md` checklist with one row per market (12 rows × 5 columns: PASS/FAIL/note + screenshot path + review date + reviewer + recognisable-yes-no). Operator fills it in `pnpm dev`. No tooling — this is a human judgment call.
- D-04 — Transition smoke: how to verify the ~600ms is honored across 12 markets. **Decision:** the existing 600ms body transition already covers all market changes. Plan 03-02 just confirms via the same regex sweep used in Phase 2 plus a UAT line ("switch from CPG → Banca → Tech → Moda; each transition feels instant-but-not-jarring; the Reconfigurando overlay carries the gap").

</decisions>

<refs>
## Canonical Refs

- `.planning/PROJECT.md` — locked rules + decisions
- `.planning/ROADMAP.md` — Phase 3 success criteria (lines 64–73)
- `.planning/REQUIREMENTS.md` — REQ-markets-twelve
- `.planning/phases/02-tamano-m-consolidado/02-CONTEXT.md` — sets the contrast-check pattern
- `ExistingData/SIZE-design-brief-v4.md` — §3 (palette per market), §5 (services per market)
- `src/data/size-data.ts` — SIZE_MARKETS, SIZE_SERVICE_COPY, SIZE_SERVICES
- `src/App.vue` — market token application via setProperty
- `src/views/ServiciosView.vue` — market-mode branch (read-only for Phase 3)
- `scripts/check-contrast.cjs` — Phase 2 baseline; extends here
</refs>
