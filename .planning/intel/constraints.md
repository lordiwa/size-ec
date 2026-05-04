# Constraints Intel

Hard rules and non-functional requirements extracted from the planning
docs. Items marked [LOCKED] mirror the LOCKED-tier decisions and cannot
be relaxed.

---

## CON-001 — WCAG AA contrast in all 17 styles  [LOCKED]
- source: ExistingData/SIZE-design-brief-v4.md (§3, §9.6)
- type: nfr (accessibility)
- content: Body text must achieve at least 4.5:1 contrast; large text
  at least 3:1. Applies to every market and every size, including XL.
  In XL, all visual effects must remain in background or decorative
  layers — functional content (services, copy, CTAs) is always readable.
  Hierarchy must remain clear in every style. Conflicts between
  creativity and legibility resolve in favour of legibility every time.

## CON-002 — Mutually exclusive styles, single localStorage flag  [LOCKED]
- source: ExistingData/SIZE-design-brief-v4.md (§3.bis)
- type: schema (state shape) + protocol (selection semantics)
- content: There are 17 styles total — 12 markets and 5 sizes — and
  exactly one is active at any time. Selection writes a single
  localStorage flag `size-style: { type: 'market' | 'size', value, updatedAt }`.
  The 60-combination cross-product is forbidden. Choosing a market
  resets any prior size; choosing a size resets any prior market. Last
  write wins.

## CON-003 — Style transition timing
- source: ExistingData/SIZE-design-brief-v4.md (§3.ter, §6 Reglas globales)
- type: nfr (perceived performance)
- content: Style transitions take approximately 600ms. No full reload.
  The transition is animated.

## CON-004 — Progressive loading by level
- source: ExistingData/SIZE-design-brief-v4.md (§6 Reglas globales, §8 Build y deploy)
- type: nfr (performance) + protocol (bundle splitting)
- content: XS-M ship lightweight bundles with no heavy animation
  libraries. L and XL lazy-load their stacks: GSAP+Lottie for L; Three.js
  via `@tresjs/core` + Phaser 3 + Tone.js + postprocessing + Cannon-es or
  Rapier for XL. Code-splitting is aggressive both per intensity level
  and per market.

## CON-005 — Reduce-motion respected
- source: ExistingData/SIZE-design-brief-v4.md (§13.11 Accesibilidad más allá del contraste)
- type: nfr (accessibility)
- content: `prefers-reduced-motion` is honoured; animations on levels
  3-5 are blocked or attenuated when the user has it set. Default is
  dark mode but `prefers-color-scheme` is respected where it applies.

## CON-006 — Browser support matrix
- source: ExistingData/SIZE-design-brief-v4.md (§13.9 Compatibilidad de browsers)
- type: nfr (compat)
- content: Officially supported: Chrome, Edge, Safari, Firefox — last
  two major versions. Mobile: iOS 15+, Android 10+. XL is blocked on
  browsers without WebGL2 with an educational message; users fall back
  to L. XS is allowed to work on any browser including IE11 (the size's
  ironic design intent).

## CON-007 — Single style active at a time  [LOCKED — see CON-002]
- source: ExistingData/SIZE-design-brief-v4.md (§3.bis)
- type: protocol (state invariant)
- content: At any moment exactly one style is active across the whole
  site. Cross-view navigation does not change the active style. The
  active style applies wherever it makes sense per §13.3 (sizes
  persist across all views; markets apply where they have meaning).

## CON-008 — Style transitions never reload the page
- source: ExistingData/SIZE-design-brief-v4.md (§3.ter Estados resumidos, §6 Reglas globales)
- type: protocol
- content: Changing market or size happens via in-place transition.
  The user is never sent through a full reload to switch styles.

## CON-009 — Spanish-only content
- source: ExistingData/SIZE-design-brief-v4.md (§8 Idiomas)
- type: protocol (i18n scope)
- content: All UI and content ship in Spanish. No i18n layer is in
  scope. Font subsetting is Latin only (DEC-007).

## CON-010 — Production-only environment
- source: ExistingData/SIZE-design-brief-v4.md (§8 Build y deploy)
- type: protocol (environments)
- content: Only the production environment exists. There is no staging
  environment. Pipeline is `push to main → deploy to Firebase Hosting →
  propagation via Cloudflare`.

## CON-011 — Accessibility beyond contrast
- source: ExistingData/SIZE-design-brief-v4.md (§13.11)
- type: nfr (accessibility)
- content: Full keyboard navigation across the five views (Tab, Enter,
  Esc). ARIA labels on slider, dropdown, footer sticky, chatbot. Manual
  screen-reader passes on VoiceOver and NVDA. Touch targets ≥ 44×44 px
  (§13.4).

## CON-012 — Image format and lazy-loading
- source: ExistingData/SIZE-design-brief-v4.md (§13.14)
- type: nfr (asset performance)
- content: Imagery uses WebP (with JPG fallback) and AVIF for modern
  browsers. Below-the-fold images use native `loading="lazy"`. Iconography
  via SVG/sprites. Build pipeline compresses images.

## CON-013 — Definition of Done includes the 60-combination smoke
- source: ExistingData/SIZE-design-brief-v4.md (§9.5)
- type: protocol (QA gate)
- content: Any ticket touching a view or component must verify that all
  affected market×size combinations still function. WCAG AA is verified
  on every view-touching ticket.
