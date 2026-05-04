# Phase 2 — UAT Sign-off Checklist
## Tamaño M (Crafted) consolidado

Operator (or QA agent) ticks each box and pastes findings beside any FAIL before
marking Phase 2 done. All checks run against `pnpm dev` unless stated otherwise.

---

### 1. Abuela test (LOCKED-001 acceptance heuristic)

- [ ] **Abuela test — legibility** · Open `pnpm dev` in M dark-mode (default on
  first visit). Hand the laptop to a non-technical reader and ask two questions:
  1. "What does this agency do?"
  2. "Read me the names of the services."

  **PASS** criteria: the reader identifies advertising / marketing without
  prompting, and reads every service name on Servicios without squinting or
  leaning in.

  **How to verify:** Run `pnpm dev`, navigate to `/servicios`, hand device to a
  non-technical person. Record their answer verbatim. Any hesitation over legibility
  = FAIL; surface the offending element and open a follow-up.

---

### 2. WCAG AA automated check

- [ ] **WCAG AA contrast — M baseline** · All 5 required colour pairs (body,
  muted, large heading, accent CTA, accent inline) report a ratio at or above
  their threshold (≥ 4.5:1 normal text, ≥ 3:1 large text).

  **How to verify:**
  ```
  pnpm check:contrast
  ```
  Must exit 0 and print the summary line:
  `M Crafted dark-mode | 5 pairs checked | all >= …`

  Any `FAIL` line = blocker; do not mark Phase 2 done until resolved.

---

### 3. 600ms transition smoke

- [ ] **600ms body transition — L to M** · On `pnpm dev`, click the **L** tick in
  the footer mini-slider. The body background and ink colour should fade from M
  (dark `#0a0a0a`) to L (yellow `#FFEE00` + black ink) over approximately 600ms.
  The Reconfigurando overlay fires on top, then clears. No full-page reload, no
  blank flash.

  Click **M** again; the fade reverses back to dark mode in approximately 600ms.

  **How to verify:** Open DevTools → Performance tab → record 2s while clicking L.
  Confirm the `background` and `color` CSS properties animate (not snap) on
  `<body>`. Alternatively, watch at human speed — 600ms is visible but not sluggish.

  **PASS** criteria:
  - Transition duration visible (not instant)
  - Reconfigurando overlay appears briefly then clears
  - No full page reload (network tab stays quiet; no document re-fetch)
  - Landing page content still visible during and after transition

---

### 4. Reduced-motion sweep

- [ ] **prefers-reduced-motion — animations attenuated** · Toggle the OS-level
  "Reduce motion" accessibility setting (macOS: System Settings → Accessibility →
  Motion; Windows: Settings → Accessibility → Visual effects → Animation effects off).
  Then reload `pnpm dev`.

  **PASS** criteria (all must hold):
  - The **RotatingWord** component stops cycling (text is static)
  - The gate fade-in on IntensityChooser is instant (no fade animation)
  - The **Reconfigurando** overlay still appears when switching levels (it is a
    state indicator, not decorative motion), but its inner shimmer, dots, and
    moving grid hold still
  - The sticky footer and nav transitions are instant

  **How to verify:** Check DevTools → Rendering panel → "Emulate CSS media
  feature prefers-reduced-motion: reduce" as an alternative to toggling the OS
  setting. Confirm `@media (prefers-reduced-motion: reduce)` block in
  `src/styles/main.css` fires (set breakpoint or use DevTools → Sources → watch
  `animation-duration: 0.01ms` applied to `*`).

---

### 5. Cambiar estilo on all three protected views

- [ ] **Cambiar estilo control — Servicios** · Navigate to `/servicios`. Confirm
  the "Cambiar estilo" pill button appears in the head row. Click it. The
  IntensityChooser gate reopens with the previously selected level still
  highlighted. Pick a different level. The Reconfigurando overlay fires, the
  page restyles, and the user lands back on `/servicios`.

- [ ] **Cambiar estilo control — Quiénes somos** · Navigate to `/quienes-somos`.
  Same flow: pill present, gate reopens with prior tick highlighted, level change
  fires overlay, user stays on `/quienes-somos`.

- [ ] **Cambiar estilo control — Contacto** · Navigate to `/contacto`. Same flow:
  pill present, gate reopens with prior tick highlighted, level change fires
  overlay, user stays on `/contacto`.

  **How to verify:** For each view, open Network tab and confirm no document
  navigation (XHR/fetch only) when the level changes. The route path must not
  change.

---

### 6. Hablemos CTA

- [ ] **Hablemos CTA — Servicios no-market case** · On `/servicios` with no
  market selected (default M mode), scroll to the bottom of the service grid.
  A centered "Hablemos →" CTA button must be visible. Clicking it routes the
  user to `/contacto`.

  **How to verify:** Open `/servicios` in M mode (clear session or use incognito
  so the gate fires, then pick M). Scroll past the 11 services. The `.bright-cta`
  link "Hablemos →" must be present. Click — browser address bar changes to
  `/contacto`, no full reload.

  **Note:** When a market is selected on Home, navigate back to `/servicios` —
  the "Hablemos →" CTA should **not** appear in market mode (the "← Cambiar
  categoría" control serves that branch instead).

---

## Sign-off

| # | Check                          | Status | Operator | Date |
|---|-------------------------------|--------|----------|------|
| 1 | Abuela test                    | [ ]    |          |      |
| 2 | WCAG AA check:contrast         | [ ]    |          |      |
| 3 | 600ms transition smoke         | [ ]    |          |      |
| 4 | prefers-reduced-motion sweep   | [ ]    |          |      |
| 5 | Cambiar estilo — all 3 views   | [ ]    |          |      |
| 6 | Hablemos CTA                   | [ ]    |          |      |

**Phase 2 is done when all six boxes are ticked and no blocking FAIL is recorded.**

---
*Phase: 02-tamano-m-consolidado*
*Created: 2026-05-04*
