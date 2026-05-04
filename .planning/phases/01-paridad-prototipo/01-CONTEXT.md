# Phase 2: Sistema base — Context

**Gathered:** 2026-05-04
**Status:** Ready for planning
**Source:** /gsd-plan-phase 1+2 paired pass (gray areas resolved inline; full discuss-phase ceremony skipped because the four gray areas were resolved during plan approval)

<domain>
## Phase Boundary

The styling and routing skeleton works end-to-end. A user can navigate the 5 routes, see a sticky footer, hit the creativity gate on first visit to a protected route, pick a size or a market, watch the site re-style in place via a single Pinia store backed by one localStorage flag, and see Home's rotating word animate accessibly. Phase 2 ships the **infrastructure** to support 12 markets and 5 sizes; the actual market visual treatments (palette per market beyond palette+accent+display-font tokens) ship in Phase 4, and per-size full treatments ship in Phases 5/6/7.

In scope:
- 12 market token blocks (palette + accent + radius + per-market `--font-display`) in a dedicated CSS file
- Markets selector grid on Home (4×3 inline, click-to-restyle)
- Mini-slider M-tick doubles as the reset control
- Rotating word crossfade ~250ms with reduced-motion fallback
- Token transition timing aligned to the brief's ~600ms spec
- Smoke tests for routing, gate behaviour, persistence

Out of scope (deferred):
- Full per-market visual treatments beyond the token block (Phase 4 ships the actual market looks)
- L / XS / XL component-level treatments (Phases 5 / 6 / 7)
- Settings drawer or alternate reset surfaces
- Typewriter / scramble rotator alternatives

</domain>

<decisions>
## Implementation Decisions

### Markets selector on Home — inline 4×3 tile grid below the rotator

**Decision:** Build a `MarketsGrid.vue` component shown directly on `HomeView` below the `Somos tu [palabra]` rotator. Above the grid, a monospace eyebrow reads `¿DE QUÉ INDUSTRIA VIENES?` in `mono upper` style.

The grid is a 4-column × 3-row layout (12 markets, brief §5 order):

```
CPG · Banca · Retail · Automotriz
Salud · Bebidas · Inmobiliario · Educación
Turismo · Tecnología · Moda · Fintech
```

Each tile shows the market name in Geist body weight (16-18px). Hover: accent-color underline grows from 0 to full width, `border-color` shifts to `--line-strong`. Click: invokes `useStyleStore().setMarket(id)`. The page restyles in place — no redirection, no reload.

When a market is active and the user is on Home, the grid still renders (so they can switch). The currently-active tile shows a small mono `ACTIVO` label in the accent color.

Mobile (≤720px): collapses to a 2-column grid.

### Reset to default — the M tick in the footer mini-slider IS the reset

**Decision:** Clicking the `M` tick in the footer's `lvl-mini` is the canonical reset. There is no separate `Cambiar estilo` button. The reset semantics:

- If user is on a **market** (e.g. `level-m has-market market-banca`): clicking `M` calls `useStyleStore().setSize('M')`, which clears the market overlay (removes `has-market` and `market-{id}` from `<html>`) and writes `{type: 'size', value: 'M', updatedAt}` to localStorage. The gate does not reappear (the user has an explicit size choice).
- If user is on a **non-M size** (e.g. `level-l`): clicking `M` calls `useStyleStore().setSize('M')`, same behaviour.
- If user is on **M-default with no flag** (fresh visit, never chose anything): clicking `M` is a no-op (the active style is already M; localStorage stays empty so the gate still triggers on first protected route).
- The mini-slider is the single style-control surface. Future iterations may add a settings drawer; not in scope.

To keep the M-tick visually distinct as both a destination and a reset, when a market is active the M-tick shows a faint accent-color ring (`box-shadow: 0 0 0 2px var(--accent)` at 30% opacity) signalling "you are styled, click here to return to clean".

### Rotating word — crossfade ~250ms

**Decision:** Replace the current instant cut with a Vue `<Transition>` named `word-fade`. Timing: 100ms out + 50ms hold + 100ms in (total ~250ms). Implementation pattern:

```vue
<Transition name="word-fade" mode="out-in">
  <span :key="rotatingWords[wordIndex]" class="serif home-rotator-word">
    {{ rotatingWords[wordIndex] }}
  </span>
</Transition>
```

CSS keyframes in scoped block:

```css
.word-fade-enter-active, .word-fade-leave-active { transition: opacity 100ms ease; }
.word-fade-enter-from, .word-fade-leave-to { opacity: 0; }
```

`prefers-reduced-motion` collapses the transition to instant (`transition-duration: 0ms`). The existing `aria-live="polite"` stays — the screen reader reads the new word once per cycle. Cadence stays at the existing 2.8s interval (the brief recommends 2.5–3s; current is fine).

### Per-market typography v1 — palette + accent + display only

**Decision:** Each of the 12 markets gets:

- A unique `--bg`, `--ink`, `--muted`, `--line`, `--line-strong`, `--accent` (and optional `--accent-2`)
- A `--radius` (some markets keep 0; Salud / Educación may go to 8-12px)
- A unique `--font-display` for editorial italic accents (e.g. Druk / Tiempos / Didot / Söhne / Migra per brief §5)
- **Body stays `--font-body: "Geist"`** for all 12 markets
- **Mono stays `--font-mono: "Geist Mono"`** for all 12 markets

Tokens live in a new file `src/styles/markets.css` imported by `main.css`. Per-market display fonts are added to the Google Fonts link in `index.html` initially (researcher confirms availability — fallback: web-safe families per brief §5; or self-host if a face is paid-only). Self-hosting is deferred to a polish pass; Google Fonts is acceptable for v1.

Bundle impact: shared Geist + 12 display fonts ≈ acceptable for v1 because we use `font-display: swap` and Google's variable / unicode-range serving. If size becomes a concern, dynamic `@font-face` injection on market activation is a follow-up (deferred).

### Carryovers from PROJECT.md (not re-decided here)

- LOCKED-001 — WCAG AA in all 17 styles, no exceptions.
- LOCKED-002 — Mutually exclusive 17 styles via single localStorage flag `size-style: { type, value, updatedAt }`.
- DEC-004 — Default visual M (Crafted), dark mode.
- DEC-005 — Spanish only.
- ~600ms transitions on style swaps (CON-008 from brief §6 — currently `transition: background 500ms, color 500ms` on body in `main.css`; Phase 2 aligns to 600ms).

### Claude's Discretion

- Exact Vite import strategy for `markets.css` (top-level `@import` in `main.css` vs separate entry).
- Whether `MarketsGrid.vue` lives at `src/components/MarketsGrid.vue` or `src/views/home/MarketsGrid.vue` — planner picks.
- Smoke-test framework: Vitest + @vue/test-utils for unit/store, Playwright for e2e if added (Playwright is a heavier dependency; planner can defer e2e to Phase 10 closure if Vitest unit smoke is sufficient).
- Exact tile hover micro-interaction (underline animation curve, padding shift, etc.) — match the editorial language already established in `ServiciosView.vue` hover pattern.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before researching or planning.**

### Source brief
- `ExistingData/SIZE-design-brief-v4.md` — master document.
  - §3 (REGLA INVIOLABLE — Legibilidad)
  - §3.bis (REGLA INVIOLABLE — Estilos mutuamente excluyentes)
  - §3.ter (Flujo de selección de estilo — el "gate")
  - §5 (Mercados objetivo — 12 markets with their style bases)
  - §6 (Tamaños de creatividad — 5 sizes)
  - §7 (Experiencia de usuario — 5 vistas)
  - §8 (Stack técnico)

### Prototype reference
- `ExistingData/SIZE Web Prototype - standalone.html` — embeds the canonical CSS (lines 1–168 readable; line 177 is the bundle template). The prototype's `level-m`, `lvl-mini`, `footer-nav`, `size-wordmark`, `bright-cta` rules are the visual contract for Phase 2.

### Project planning
- `.planning/PROJECT.md` — project charter; LOCKED-001 / LOCKED-002 / DEC-001..010 / DECISION-LX-LOCKED / DECISION-XS-RETRO / DECISION-XL-PHASER.
- `.planning/REQUIREMENTS.md` — Phase 2 owns: REQ-routes-five-views, REQ-style-gate, REQ-style-persistence, REQ-home-rotating-words.
- `.planning/ROADMAP.md` — Phase 2 section.
- `.planning/intel/decisions.md`, `.planning/intel/constraints.md`, `.planning/intel/SYNTHESIS.md`.
- `.planning/phases/01-setup/01-CONTEXT.md` — Phase 1 decisions (deploy skill, Firebase default URL, MCP wiring) — Phase 2 inherits the Phase 1 environment.

### Project conventions
- `CLAUDE.md` — root-level agent context with reglas inviolables and stack.

### Live code (already in repo, planner reads)
- `src/main.ts` — app entry, mounts Pinia + Vue Router.
- `src/App.vue` — `watchEffect` already swaps `<html>` class on store changes; Phase 2 extends with the 12 market IDs.
- `src/router/index.ts` — 5 routes already wired.
- `src/stores/style.ts` — `setMarket`, `setSize`, `reset` already exist; Phase 2 may add `resetToDefault()` and ensure the M-tick reset semantics.
- `src/components/StickyFooter.vue` — mini-slider; Phase 2 extends `pickSize('M')` to satisfy the M-tick reset contract.
- `src/components/StyleGate.vue` — first-visit gate.
- `src/views/HomeView.vue` — rotator; Phase 2 mounts `MarketsGrid.vue` here.
- `src/styles/main.css` — 5 level token blocks already present; Phase 2 adds `markets.css` and aligns transition timing.
- `index.html` — Google Fonts link; Phase 2 may extend with per-market display fonts.

</canonical_refs>

<code_context>
## Reusable Assets and Patterns

**Already in repo:**
- Pinia store with single-flag persistence: `src/stores/style.ts` writes `{type, value, updatedAt}` to localStorage on every change via a deep `watch`. `MarketId` and `SizeId` types already enumerate the 12 markets and 5 sizes.
- `<html>` class watcher: `src/App.vue` strips and reapplies `level-{x}` / `has-market` / `market-{id}` on every store change. Adding the 12 market IDs is a one-line list extension.
- 5 level token blocks in `src/styles/main.css` (lines ~80–160) — the per-market token blocks will follow the same shape in `markets.css`.
- Sticky footer mini-slider: `src/components/StickyFooter.vue` calls `style.setSize(s)` on tick click. The reset semantics are a small addition to `pickSize` or the store action.
- Style gate: `src/components/StyleGate.vue` is the first-visit fallback for protected routes. The `gateRequired` computed in `App.vue` checks `!style.active && protectedRoutes.includes(route.name)`.
- Home rotator: `src/views/HomeView.vue` has a `setInterval` cycling `wordIndex` every 2800ms with `aria-live="polite"`. Wrapping the span in a `<Transition>` is the only change.

**Patterns to follow:**
- Composition API with `<script setup>` and TypeScript on every SFC.
- Scoped `<style>` blocks per SFC; tokens via `var(--bg)` etc.; no Tailwind utility classes inside the visual hierarchy (Tailwind is present in the toolchain but the prototype's design language is hand-rolled CSS — keep that consistency).
- Naming: views in `src/views/<Name>View.vue`; components in `src/components/<Name>.vue`; styles per SFC scoped + global atoms in `src/styles/main.css`.

**Not yet present (Phase 2 creates):**
- `src/styles/markets.css` — 12 market token blocks.
- `src/components/MarketsGrid.vue` — the 4×3 selector grid.
- A `resetToDefault()` action in `src/stores/style.ts` (if the planner decides to factor it out vs inlining `setSize('M')` semantics in the M-tick handler).
- Smoke tests under `tests/` or `e2e/` (Vitest config + a few specs).

</code_context>

<specifics>
## Specific Ideas

- Markets grid eyebrow text: `¿DE QUÉ INDUSTRIA VIENES?` (uppercase mono, 11px, `--muted`).
- 12 markets, in order: cpg, banca, retail, automotriz, salud, bebidas, inmobiliario, educacion, turismo, tecnologia, moda, fintech.
- Display labels in tiles (Spanish): `Consumo`, `Banca`, `Retail`, `Automotriz`, `Salud`, `Bebidas`, `Inmobiliario`, `Educación`, `Turismo`, `Tecnología`, `Moda`, `Fintech`.
- Rotator transition timing: 100ms fade-out + 50ms hold + 100ms fade-in. CSS uses `transition: opacity 100ms ease` on `.word-fade-enter-active, .word-fade-leave-active`. `mode="out-in"` on the `<Transition>`.
- Token swap transition (M tick / market click / size click): align body to `transition: background 600ms ease, color 600ms ease` (currently 500ms). The brief's CON-008 spec is ~600ms.
- M-tick visual when a non-M style is active: `box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent)`.
- Per-market display fonts (research confirms availability):
  - cpg → Poppins
  - banca → Source Serif 4 (Google Fonts current name; formerly Source Serif Pro)
  - retail → Bebas Neue
  - automotriz → Saira
  - salud → Inter
  - bebidas → Cormorant Garamond
  - inmobiliario → Playfair Display
  - educacion → Inter (acento amistoso vía weight)
  - turismo → Cormorant Garamond
  - tecnologia → JetBrains Mono (display variant)
  - moda → Bodoni Moda
  - fintech → Sora
  (Researcher cross-checks against brief §5 — these are reasonable Google-Fonts-available approximations of the brief's stated typographic intent. Planner is free to substitute.)

</specifics>

<deferred>
## Deferred Ideas

- Self-hosted variable fonts with Latin subsets (DEC-007) → polish pass; Google Fonts CDN is acceptable for v1.
- Settings drawer / alternate reset surfaces → not needed; M-tick suffices.
- Typewriter / scramble rotator alternatives → revisit if user wants more personality on the rotator after seeing crossfade live.
- Per-market full visual treatments (typography pairings, photography directives, full layout shifts) → Phase 4 (Mercados sobre M).
- L / XS / XL component-level treatments → Phases 5 / 6 / 7.
- Playwright e2e suite → defer to Phase 10 closure if Vitest unit smoke covers the gate + persistence flows.
- ARIA polish pass beyond `aria-live` on the rotator → CON-011 is its own broader pass, not Phase 2's job.

</deferred>

---

*Phase: 01-paridad-prototipo*
*Context gathered: 2026-05-04 (paired with /gsd-plan-phase 1+2)*
