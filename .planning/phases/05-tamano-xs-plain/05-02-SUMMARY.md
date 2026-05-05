---
phase: 05-tamano-xs-plain
plan: 02
subsystem: views
tags: [xs-plain, decision-xs-retro, dec-050, dec-052, web-1999, table-layout, marquee, vue-template-branches]

# Dependency graph
requires:
  - phase: 05-tamano-xs-plain
    plan: 01
    provides: "scripts/check-contrast.cjs covering 16 themes (M + 12 markets + S + L + XS) with DEC-052 per-level overrides (CTA = LINK on BG; inline = INK on marquee #FFFF00). DECISION-XS-RETRO + DEC-050 vocabulary contracts that this plan must honour at the markup layer."
  - phase: 04-tamanos-s-y-l
    plan: 02
    provides: "Per-level v-else-if branches in HomeView (L / S / M-default) — pattern this plan extends with the XS branch between S and M-default. Sibling v-if=\"style.code === 'l'\" pattern in the 4 protected views — pattern this plan mirrors for XS."

provides:
  - "src/views/HomeView.vue — XS branch (verbatim port of prototype 00021082_04 lines 23-37): <center>, ★ SIZE ★, italic tagline, <marquee> #FFFF00, <hr/>, 'Somos tu [rotator]' line, MarketSelect"
  - "src/views/ServiciosView.vue — XS branch with single <table border=\"1\"> listing all 11 canonical services"
  - "src/views/QuienesSomosView.vue — XS branch with 4-column <table> team grid (driven by teamRows computed) + clients <table border=\"1\">"
  - "src/views/ClienteView.vue — XS branch with one <table border=\"1\"> per cliente listing trabajos as rows; renders all clientes when slug doesn't resolve"
  - "src/views/ContactoView.vue — XS branch with 2-column <table> for Canales/Chatbot + 1999 <form> with table-aligned inputs; @submit.prevent keeps the form a no-op until Phase 9"

affects: [phase-5-onward, 05-03 UAT, phase-6-xl, phase-9-firebase-form-wiring]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sibling v-if pattern for level branches: a <section v-if=\"style.code === 'xs'\"> sits above the existing markup, which gets wrapped in <template v-else>. Multiple top-level elements stay grouped under the same v-else (template fragment) — Vue 3 supports this natively."
    - "1999-pure layout via nested tables: when a placeholder needs explicit dimensions (PortraitPlaceholder cell, channels/bot card), use a <table cellpadding=\"0\" cellspacing=\"0\"> frame with width/height on the <td> instead of CSS flexbox or inline-block. Keeps the XS scoped CSS strictly within DEC-050 vocabulary."
    - "Form-submission no-op: <form @submit.prevent> + <input type=\"submit\"> is the 1999-authentic markup that does not actually submit. Phase 9 swaps the no-op for a Firestore write."

key-files:
  created:
    - .planning/phases/05-tamano-xs-plain/05-02-SUMMARY.md
  modified:
    - src/views/HomeView.vue
    - src/views/ServiciosView.vue
    - src/views/QuienesSomosView.vue
    - src/views/ClienteView.vue
    - src/views/ContactoView.vue

key-decisions:
  - "DEC-053 — XS branches in the 4 protected views (Servicios, QuienesSomos, Cliente, Contacto) use the sibling v-if=\"style.code === 'xs'\" pattern (NOT v-else-if appended after a level-specific branch chain), with the existing M/S/L markup wrapped in a single <template v-else>. HomeView is the exception: it uses v-else-if=\"style.code === 'xs'\" in the chain L → S → XS → M-default because Phase 4 already established per-level branching there. This split preserves the Phase 4 layout's invariants while adding XS at the topmost decision in the views that did not previously branch on level."
  - "DEC-054 — PortraitPlaceholder XS sizing in QuienesSomosView is achieved via a nested <table> frame ('photo-frame' table) with explicit width/height on the inner <td>, NOT via a <span> with display:inline-block on its surrounding wrapper. This keeps the XS scoped CSS strictly within DEC-050 vocabulary (no display: declarations beyond what the browser default already provides for table cells). The PortraitPlaceholder's own .pp-xs internals (display:flex) live inside that component's scoped block from Phase 1 — out of scope for this plan and not modified."
  - "DEC-055 — ContactoView XS form uses @submit.prevent on the <form> element to make <input type=\"submit\"> a no-op until Phase 9 wires Firestore. The 1999 markup (<input type=\"submit\" value=\"Enviar\">) is preserved verbatim; only the submission intent is suppressed. This honours the 'one-shot Phase 8/9 wiring' invariant — the form's HTML structure does not change when the backend lands."

requirements-completed: [REQ-sizes-five]

# Metrics
duration: ~9min
completed: 2026-05-05
---

# Phase 05, Plan 02: XS view branches across HomeView + 4 protected views Summary

**XS treatment shipped across all 5 views as Web 1999 markup (HomeView verbatim port from prototype 00021082_04; the 4 protected views authored within DEC-050's strict CSS vocabulary): `<table>`-driven layouts, `<center>`, `<hr/>`, `<marquee>` #FFFF00, Times New Roman, `<input type="submit">` form — zero Tailwind, zero flex/grid, zero border-radius/box-shadow/transform/transition in the new XS scoped CSS blocks. All four gates green: type-check exit 0, build exit 0, check:contrast OVERALL 16/16 (DEC-052 marquee-yellow + LINK-on-BG overrides validated against actual rendered surfaces).**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-05-05T03:03:39Z
- **Completed:** 2026-05-05T03:12:03Z
- **Tasks:** 3 (all `feat`)
- **Files modified:** 5 (the 5 protected views)
- **Files created:** 1 (this SUMMARY.md)

## Accomplishments

### Task 1 — HomeView XS branch (verbatim port from prototype)

- New `<section v-else-if="style.code === 'xs'" class="home-xs">` inserted between the S branch and the M-default `v-else`. Final order: **L → S → XS → M-default** (per D-01).
- Markup mirrors prototype `home.jsx` XS branch (`ExistingData/prototype-extracted/00021082_04_*.js` lines 23-37) verbatim:
  - `<center>` wrapping
  - `<h1>★ SIZE ★</h1>` at 48px Times New Roman
  - Italic tagline `<p><i>Publicidad a tu medida.</i></p>`
  - `<marquee scrollamount="6">` with background #FFFF00, 2px solid black border, 4px padding, max-width 760px — content `✦ Somos tu [rotator] ✦ Bienvenido a SIZE Agency Inc. ✦`
  - `<hr/>` separator
  - `<p style="white-space:nowrap">Somos tu <b>[rotator]</b>.</p>`
  - `<MarketSelect>` dropdown 16px below the rotator line
- The marquee surface honours DEC-052's inline-pair contract (INK `#000` on `#FFFF00` = 19.56:1 contrast).
- The `<MarketSelect>` dropdown remains the existing component — its native `<select>` markup is 1999-acceptable; the chevron CSS background-image doesn't violate DEC-050 because that styling lives in `MarketSelect.vue`'s own scoped block (out of scope for the XS view-branch CSS).
- `prefers-reduced-motion` global rule freezes the `<marquee>` automatically (no per-component override needed — D-05).
- L / S / M branches structurally unchanged. Only the M-default comment was clarified to remove the obsolete "XS" reference.

### Task 2 — ServiciosView XS branch (table of services)

- New `<section v-if="style.code === 'xs'" class="srv-xs">` sibling above the existing CASE A / CASE B markup; the existing two blocks are wrapped in a single `<template v-else>`.
- Renders all 11 canonical services in a single `<table border="1" cellpadding="6" cellspacing="0">`:
  - `<thead>`: `# | Servicio | Descripción`
  - `<tbody>`: one row per service, sourced from `allServices` computed (the existing data binding stays untouched)
  - `<b>` for service name, `<i>` for short description
- `<RouterLink>` rendered as plain underlined anchor (auto-styled by global `html.level-xs a { color: #0000ee; text-decoration: underline }`).
- Footer links: "Vuelve al inicio" + "Hablemos →".

### Task 3 — QuienesSomosView + ClienteView + ContactoView XS branches

**QuienesSomosView:**
- New `teamRows` computed splits `SIZE_TEAM` into rows of 4 (handles current 4-member team and the future 4×5 = 20 layout). The existing 4-member team renders as one row × 4 cells; when Phase 7 lands the full 20-member roster, the same component will render 5 rows × 4 cells with no further code change.
- `<center>` SIZE wordmark + `— EL EQUIPO —` h2; 4-column team `<table>` with each cell housing a nested `<table cellpadding="0" cellspacing="0">` photo frame (DEC-054) + `<i>name</i>` + `<small>role</small>`.
- `<hr/>`, then `— CLIENTES —` h2 + `<table border="1">` with `[ LOGO ]` placeholder column + `<RouterLink>` to `cliente.params.slug`.

**ClienteView:**
- New `xsClients` computed returns `[client]` when the slug resolves or `SIZE_CLIENTS` (all 3) when it doesn't — the XS branch becomes a directory of clientes when no slug is given, otherwise a single-client view.
- Per cliente: `<h3>` name, `<i>` tagline, justified `<p>` description, `<table border="1">` listing `# | Trabajo | Detalle` rows (from `c.work[]`), `<hr/>` separator.
- Footer `<RouterLink>` back to Quiénes somos.

**ContactoView:**
- 2-column `<table>` (channels left, chatbot right). Channels list rendered as `<ul><li><b>label:</b> val</li></ul>` from the existing `channels` const. Chatbot cell shows `[ CHATBOT 1999 GOES HERE — TBD Phase 8 ]` — placeholder until Phase 8 wires the Bruja.
- `<form @submit.prevent>` with table-aligned `<label>` / `<input>` rows for Nombre, Email, Mensaje (`<textarea rows="4" cols="40">`), submit button (`<input type="submit" value="Enviar">`). DEC-055: `@submit.prevent` keeps the form a true no-op until Phase 9 wires Firestore; the 1999 markup is preserved.

### Cross-cutting

- All five XS scoped CSS blocks adhere to DEC-050 verbatim. Verified by post-task scan: zero matches for `display:flex`, `display:grid`, `border-radius`, `box-shadow`, `transform:`, `transition:`, `color-mix`, `gap:`, in any `.home-xs`, `.srv-xs`, `.qn-xs`, `.cl-xs`, `.ct-xs` rule.
- All XS scoped CSS uses only: `padding`, `margin`, `font-family` (Times New Roman or inherited), `font-size` in px, `font-weight: normal/bold`, `letter-spacing`, `text-align`, `vertical-align`, `border: 1px solid #000`, `border-collapse: collapse`, `background: #ffffff` / `#ffff00`, `color`, `width` (in px or %), `max-width`, `white-space: nowrap`.
- The `<marquee>` HTML element passed `vue-tsc` without any module augmentation needed — Vue 3.4's TS template compiler accepts deprecated-but-standard HTML elements via the DOM lib types.

## Task Commits

1. **Task 1: HomeView XS branch (1999 verbatim port)** — `759cf3c` (feat)
2. **Task 2: ServiciosView XS branch (1999 service table)** — `c7db587` (feat)
3. **Task 3: QuienesSomos + Cliente + Contacto XS branches** — `6073541` (feat)

## Files Created/Modified

- `src/views/HomeView.vue` — Added v-else-if XS branch (20 lines markup) + 22-line scoped CSS block. (modified, +45 / -1)
- `src/views/ServiciosView.vue` — Added v-if XS branch (29 lines markup, wrapping the existing two blocks in `<template v-else>`) + 39-line scoped CSS block. (modified, +72 / -0)
- `src/views/QuienesSomosView.vue` — Added v-if XS branch (29 lines markup, wrapping the three existing sections in `<template v-else>`) + `teamRows` computed (8 lines script) + 38-line scoped CSS block. (modified, +97 / -0)
- `src/views/ClienteView.vue` — Added v-if XS branch (32 lines markup, sitting ABOVE the missing-fallback v-else-if and the existing v-else market markup) + `SIZE_CLIENTS` import + `xsClients` computed (4 lines script) + 47-line scoped CSS block. (modified, +89 / -1)
- `src/views/ContactoView.vue` — Added v-if XS branch (45 lines markup, wrapping the existing chatbot/channels markup in `<template v-else>`) + 47-line scoped CSS block. (modified, +78 / -1)
- `.planning/phases/05-tamano-xs-plain/05-02-SUMMARY.md` — this file. (created)

## Decisions Made

- **DEC-053 (Phase 5)** — Sibling `v-if="style.code === 'xs'"` pattern with `<template v-else>` wrap is the standard for the 4 protected views (Servicios, QuienesSomos, Cliente, Contacto). HomeView remains the exception with `v-else-if` because Phase 4 already established a per-level branch chain (L → S → M-default) there. New order in HomeView: L → S → XS → M-default.
- **DEC-054 (Phase 5)** — PortraitPlaceholder XS sizing in QuienesSomosView's team grid uses a nested `<table>` frame (`<table cellpadding="0" cellspacing="0"><tr><td>{placeholder}</td></tr></table>` with `width: 120px; height: 160px` on the inner `<td>`) instead of a `<span>` with `display: inline-block`. Keeps DEC-050 vocabulary strict — only browser-default `display` values appear in the XS scoped CSS. The PortraitPlaceholder's own `.pp-xs { display: flex }` lives inside that component's scoped block from Phase 1 — out of scope and unchanged.
- **DEC-055 (Phase 5)** — ContactoView XS form uses `<form @submit.prevent>` to make the 1999-authentic `<input type="submit">` a true no-op until Phase 9 wires Firestore. The HTML markup is preserved verbatim (`<input type="submit" value="Enviar">`); only the submission intent is suppressed at the Vue event-binding layer. This honours the "one-shot Phase 8/9 wiring" invariant — when the backend lands, the form's structure does not change, only the handler does.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] PortraitPlaceholder sizing in QuienesSomosView**

- **Found during:** Task 3 (first pass on QuienesSomosView XS markup).
- **Issue:** PortraitPlaceholder's `.pp-xs` element uses `width: 100%; height: 100%`, so it expands to fill its container. Without an explicit container size, the placeholder renders zero-pixel. The plan's example markup didn't address this — the prototype reference doesn't include a working photo grid for XS (D-02 noted "design within the vocabulary").
- **Fix considered (rejected):** A `<span class="qn-xs-photo">` wrapper with `display: inline-block; width: 120px; height: 160px`. Rejected because `display: inline-block` is not on DEC-050's allowed list (DEC-050 explicitly enumerates "basic CSS" and only mentions `border-collapse`, `vertical-align`, `letter-spacing`, `white-space`, `width`, `max-width`, etc. — no `display:` directives).
- **Fix applied:** A nested 1×1 `<table cellpadding="0" cellspacing="0" class="qn-xs-photo-frame">` with `width: 120px; height: 160px` on the inner `<td>`. This is genuinely 1999-pure: the same trick used to size logos and photo frames in Geocities-era HTML. Documented as DEC-054.
- **Files modified:** `src/views/QuienesSomosView.vue` only (the team-grid markup + 1 CSS rule for `.qn-xs-photo-frame td`).
- **Commit:** `6073541` (rolled into Task 3's commit since the fix is part of the QuienesSomosView XS markup itself).

### Plan precision notes (not deviations)

- **Plan Task 3 example markup placeholder for ClienteView** referenced `(c.works || [...])` as a fallback. The actual data shape uses `c.work` (singular) per `src/data/size-data.ts` line 196. Used the actual property; no fallback needed because all 3 clientes have a populated `work` array.
- **Plan Task 3 example markup for QuienesSomosView clients** referenced `[ LOGO ]` as a placeholder. Kept the placeholder for now; replaces in Phase 7 when client logos arrive (TBD per STATE.md "Pending Todos").
- **Plan Task 3 example markup for ContactoView** included a `<ul>` of `<li><a href="...">` channels. Replaced the hard-coded social-link URLs with the existing `channels` const data (`@size.ec`, `+593 99 000 0000`, etc.) rendered as `<li><b>label:</b> val</li>`. Reasoning: the social handles are TBDs per STATE.md (handles + WhatsApp number not finalised); the existing `channels` const has placeholder values that can be updated centrally in Phase 7 / Phase 8 without touching the XS branch markup. The plan's Instagram/WhatsApp/email anchor list would have hard-coded URLs that contradict the channels data and the TBD list.

### Auth gates / external dependencies

None.

## Issues Encountered

None of consequence. The plan's `<input type="submit">` no-op concern (the form might submit on click) was addressed via `@submit.prevent` on the `<form>` element — confirmed by manual reasoning: a form with no `action` attribute attempts to GET the current URL with form-encoded query parameters on submit; `event.preventDefault()` (via Vue's `.prevent` modifier) blocks that. The `<input type="submit">` keeps the 1999 button chrome.

## User Setup Required

None — pure markup/CSS.

## Known Stubs

The Contacto XS branch contains an explicit Phase 8 placeholder text: `[ CHATBOT 1999 GOES HERE — TBD Phase 8 ]`. This is intentional and tracked:

| Stub | File | Line | Reason / Owner |
|------|------|------|----------------|
| Chatbot placeholder | `src/views/ContactoView.vue` | inside `.ct-xs-bot <td>` | Phase 8 (Integraciones) wires the real chatbot provider; XS gets a styled-text block by design (per Phase 5 brief and 05-CONTEXT.md "What's deferred") |
| `[ LOGO ]` placeholder in QuienesSomos clients table | `src/views/QuienesSomosView.vue` | `.qn-xs-clients <td>` first column | Phase 7 (Contenido) delivers client logos; a 1999 `<img>` tag will replace the `[ LOGO ]` text with no markup-shape change |
| `[ FOTO ]` placeholders in QuienesSomos team grid | `src/components/PortraitPlaceholder.vue` (Phase 1) | n/a | Phase 7 (Contenido) delivers 20 team photos; the existing `pp-xs` placeholder swaps for an `<img>` element |
| Form is a no-op (`@submit.prevent`) | `src/views/ContactoView.vue` | `<form>` line | Phase 9 (Cierre + Despliegue) wires Firestore + Firebase Functions; the form markup is final |

All four stubs are blocked on content/wiring deliveries from later phases — they do not block Phase 5 sign-off (the brief explicitly defers chatbot, photos, logos, and form submission).

## Threat Flags

None. The XS view branches add no new network endpoints, no new auth surface, no new file access, and no schema changes. The form is a no-op at this layer.

## Next Phase Readiness

Plan 05-02 closes the **markup layer** of Phase 5. After this plan, picking XS from the gate or footer mini-slider renders all 5 views in literal Web 1999 markup, with WCAG AA holding via DEC-052's per-level overrides validated against actual rendered surfaces.

Phase 5 success-criteria status after Plan 02:
- SC 1 (XS restyles all 5 views into Web 1999 plain): **DONE** — all 5 views ship XS branches in 1999 vocabulary
- SC 2 (XS renders 11 services + team grid + Contacto layout): **DONE** — Servicios `<table border="1">` of 11; QuienesSomos 4-column team `<table>` + clients `<table>`; Contacto 2-column channels/chatbot `<table>` + form `<table>`
- SC 3 (XS works in IE11): **DEFERRED** per DEC-051; does not gate Phase 5
- SC 4 (WCAG AA in XS): **DONE** at the token level (16/16 PASS via DEC-052 override; per-component visual treatment validated in 05-03 UAT walk-through)
- SC 5 (DECISION-XS-RETRO + DEC-050 fidelity): **DONE** — 0 banned constructs in any of the 5 new XS scoped CSS blocks; verified by post-task scan

Plan 05-03 (5-cell XS view-state UAT + reduced-motion + transition smoke + DEC-052 escalation flag) is unblocked. The escalation flag from DEC-052 (red-on-gray accent surface detection) — Plan 05-02 ships zero red-on-gray surfaces (the only red token use in XS is `--accent: #ff0000` declared at the token-system level for uniformity, never consumed as a colour value in any of the 5 XS scoped CSS blocks). The escalation path documented in `05-CONTRAST-RESULTS.md` is not triggered.

After 05-03 UAT signs off, Phase 5 is fully closed and 16 of 17 styles will be visually validated — only XL (Phase 6) remains.

---
*Phase: 05-tamano-xs-plain*
*Completed: 2026-05-05*

## Self-Check: PASSED

- FOUND: `src/views/HomeView.vue` (modified)
- FOUND: `src/views/ServiciosView.vue` (modified)
- FOUND: `src/views/QuienesSomosView.vue` (modified)
- FOUND: `src/views/ClienteView.vue` (modified)
- FOUND: `src/views/ContactoView.vue` (modified)
- FOUND: `.planning/phases/05-tamano-xs-plain/05-02-SUMMARY.md` (created — this file)
- FOUND commit: `759cf3c` (Task 1 — feat: HomeView XS branch)
- FOUND commit: `c7db587` (Task 2 — feat: ServiciosView XS branch)
- FOUND commit: `6073541` (Task 3 — feat: QuienesSomos + Cliente + Contacto XS branches)
- VERIFIED: `pnpm type-check` → exit 0
- VERIFIED: `pnpm build` → exit 0
- VERIFIED: `pnpm check:contrast` → OVERALL 16/16 themes pass
- VERIFIED: All 5 XS scoped CSS blocks contain ZERO instances of `display:flex`, `display:grid`, `border-radius`, `box-shadow`, `transform:`, `transition:`, `color-mix`, `gap:` (post-task automated scan, comments stripped before matching).
- VERIFIED: HomeView XS branch ordering is L → S → XS → M-default (per D-01).
- VERIFIED: Each XS branch renders `<table>` for layout (plan acceptance criterion).
- VERIFIED: Each XS branch uses `Times New Roman` font-family (plan acceptance criterion).
