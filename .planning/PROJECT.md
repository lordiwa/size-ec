# SIZE

> *We size up to anything.*
> Brand promise: *Publicidad a tu medida.*

## What This Is

SIZE is a new advertising and media agency in Ecuador. This project builds its
public website — a single SPA that lets the visitor experience the agency
through one of **17 mutually exclusive styles**: 12 industry/market styles
plus 5 creative-size styles (XS · S · M · L · XL). The site itself is the
first living proof of the positioning: *publicidad a tu medida*.

Source brief (canonical reference, do not duplicate): `ExistingData/SIZE-design-brief-v4.md` (sections §1–§14).

## Core Value

**The site renders SIZE's positioning by becoming the example.** A visitor
must be able to pick one of 17 styles and see the entire site reshape itself
— legibly, in place, without reload — to that single style. If everything
else fails, that experience must work.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. See REQUIREMENTS.md for full list. -->

- [ ] **REQ-routes-five-views** — 5 routes (Home, Servicios, Quiénes somos, Cliente individual, Contacto) with own URLs
- [ ] **REQ-style-gate** — first-visit creativity gate before non-Home views
- [ ] **REQ-services-catalog** — 11 services rendered per active style
- [ ] **REQ-markets-twelve** — 12 market styles with their own token sets and service subsets
- [ ] **REQ-sizes-five** — 5 creative-size styles (XS Plain · S Clean · M Crafted · L Bold · XL Unleashed)
- [ ] **REQ-team-row** — Equipo grid with 4 people × 5 photos × 5 comments
- [ ] **REQ-clients-row-and-pages** — client logos row plus per-client pages at `/clientes/[slug]`
- [ ] **REQ-home-rotating-words** — Home with SIZE wordmark + brand promise + rotating "Somos tu …"
- [ ] **REQ-contact-view-layout** — 40/60 Contacto layout: channel card + chatbot
- [ ] **REQ-contact-form-persistence** — Firestore persistence + transactional email
- [ ] **REQ-style-persistence** — single localStorage flag `size-style: { type, value, updatedAt }`
- [ ] **REQ-progressive-loading** — XS-M lightweight; L and XL lazy-load their stacks
- [ ] **REQ-xl-capability-detection** — XL gated on WebGL2; fallback to L on failure

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- **Internationalization / non-Spanish copy** — Spanish-only ship per DEC-005; no i18n layer.
- **Cross-product of market × size (60 combinations)** — explicitly forbidden by LOCKED-002; styles are mutually exclusive.
- **Staging environment** — production-only per DEC-002 / CON-010; pipeline is `push to main → Firebase Hosting → Cloudflare`.
- **Generic service menu / one-size template** — the agency does not offer a fixed package; SIZE adapts to each client.
- **Third-party auth or chatbot before provider is chosen** — Contacto ships with a static placeholder until provider is selected.
- **Heavy animation libraries on first paint** — Three.js / Phaser / Tone.js / postprocessing / physics are lazy-loaded only.

## Context

- **Brand & positioning** — Integral agency with a creative heart and digital/tech muscle. Adapts to the size and nature of each client.
- **17-styles concept** — `12 markets + 5 sizes = 17 styles. Active at a time = 1.` Each pick replaces the prior. The site is one of seventeen ways to see SIZE — never a sixtieth blend.
- **Per-market expression** — Each of the 12 markets has its own palette, typography, photography, rhythm, and tone (CPG, Banca, Retail, Automotriz, Salud, Bebidas, Inmobiliario, Educación, Turismo, Tecnología, Moda, Fintech).
- **Creative-size personalities** — XS literal Web 1999 (gris, Times, links azules); S corporate clean; M modern editorial dark mode (default); L contemporary brutalist; XL WebGL+Phaser+generative audio (always legible).
- **Cross-view style behaviour** — Sizes persist across all 5 views as transversal "creative intensity". Markets fully apply on Servicios, partially on Quiénes somos (accents), and fall back to neutral on Home / Contacto. Photos and comments on Quiénes somos always swap with the *level*, not the market.
- **Agentic operating model** — Developer / Researcher / QA / Strategist / PM agents orchestrated in Claude Code with GSD MCP wired to Jira (project key SIZE, Kanban eternal sprint, board 100 at cranialtrading.atlassian.net). Definition of Done = AC met in production + QA validated + WCAG AA verified + affected market×size combinations still work.
- **First-vs-recurring visit** — Recurring visitors (flag exists) bypass the gate forever and load straight into their last style.

## Constraints

<!-- Hard limits on implementation choices. -->

- **Accessibility (LOCKED-001 / CON-001)**: Body text ≥ 4.5:1 contrast, large text ≥ 3:1, in **every** one of the 17 styles, on every view. Conflicts between creativity and legibility always resolve in favour of legibility (the "abuela test"). XL effects must live in background or decorative layers only.
- **State (LOCKED-002 / CON-002 / CON-007)**: Exactly one style active at a time. Single localStorage flag `size-style: { type: 'market' | 'size', value, updatedAt }`. Last write wins. Choosing a market resets any prior size and vice versa. The 60-combination cross-product is forbidden.
- **Tech stack (DEC-001)**: Vue 3 (Composition API, `<script setup>`) + Vite + Vue Router + Pinia + Tailwind CSS + CSS custom properties + TypeScript.
- **Hosting (DEC-002 / CON-010)**: Firebase Hosting (Spark) + Cloudflare DNS/proxy/SSL. GitHub repo. Production-only — no staging. Pipeline: `push to main → Firebase Hosting → Cloudflare`.
- **Persistence (DEC-003)**: Firebase Firestore for contact form + future chatbot leads. Firebase Functions for transactional email and webhooks if needed.
- **Default visual (DEC-004)**: First entry with no flag → M (Crafted), dark mode.
- **Language (DEC-005 / CON-009)**: Spanish only. No i18n layer. Latin font subsets only.
- **Animation tiers (DEC-006 / CON-004)**: Levels 1-2 (XS, S) zero animation JS. Level 3 (M) GSAP (ScrollTrigger) + Lenis. Level 4 (L) full GSAP + Lottie. Level 5 (XL) lazy-loaded Three.js via `@tresjs/core` + Phaser 3 + Tone.js (default OFF) + `postprocessing` + Cannon-es or Rapier physics.
- **Typography (DEC-007)**: Self-hosted variable fonts via `@font-face`. Latin subsets only.
- **Performance (CON-003 / CON-004)**: Style transitions ~600ms, animated, no full reload (CON-008). Aggressive code-splitting per intensity level and per market. XS-M lightweight bundles; L and XL lazy-load.
- **Compatibility (CON-006)**: Chrome / Edge / Safari / Firefox last 2 majors. iOS 15+, Android 10+. XL gated on WebGL2 with educational fallback to L. XS allowed to work in IE11 (ironic intent).
- **Reduce-motion (CON-005)**: `prefers-reduced-motion` honoured on levels 3-5; animations attenuated or blocked.
- **Accessibility beyond contrast (CON-011)**: Full keyboard nav (Tab, Enter, Esc) across all 5 views. ARIA on slider, dropdown, footer sticky, chatbot. Manual VoiceOver + NVDA passes. Touch targets ≥ 44×44 px.
- **Imagery (CON-012)**: WebP (JPG fallback) + AVIF for modern browsers. Below-the-fold uses `loading="lazy"`. Iconography via SVG/sprites. Build pipeline compresses images.
- **Definition of Done (DEC-009 / CON-013)**: Any view-touching ticket verifies WCAG AA + affected market×size combinations still function.
- **Methodology (DEC-008)**: Kanban with one eternal sprint. Jira project key `SIZE`, board 100. States: Backlog → To Do → In Progress → In Review → Done. Wired through GSD MCP in Claude Code.

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| ID | Decision | Rationale | Outcome |
|----|----------|-----------|---------|
| **LOCKED-001** | WCAG AA legibility in all 17 styles, no exceptions | Brand integrity demands the site be readable everywhere; hierarchy must remain clear in every style. Creativity-vs-legibility conflicts always resolve to legibility. | 🔒 Locked (REGLA INVIOLABLE) |
| **LOCKED-002** | Mutually exclusive styles via single localStorage flag (12 + 5 = 17) | The 60-combination cross-product would dilute the positioning. The site is one of seventeen ways to see SIZE — never a sixtieth blend. | 🔒 Locked (REGLA INVIOLABLE) |
| DEC-001 | Vue 3 + Vite + Pinia + Vue Router + Tailwind + TS | Mature SPA stack with first-class CSS variable / token-system support and good Three.js bridge (`@tresjs/core`). | — Pending |
| DEC-002 | Firebase Hosting (Spark) + Cloudflare, prod-only | Free tier, automatic CI from GitHub push to main, Cloudflare adds CDN/SSL. | — Pending |
| DEC-003 | Firestore (+ Functions if needed) | Cheap and serverless for low-volume contact form + future chatbot leads. | — Pending |
| DEC-004 | Default visual: M (Crafted), dark mode | M is the brand baseline; dark mode reads as modern editorial. | — Pending |
| DEC-005 | Spanish only | Local market + first launch scope. | — Pending |
| DEC-006 | XL stack lazy-loaded: Three.js + Phaser + Tone.js + postprocessing + Cannon-es/Rapier | XL is the most expensive level by far; everything else must stay light. | — Pending |
| DEC-007 | Self-hosted variable fonts, Latin subsets | Performance + offline parity + no third-party CDN dependency. | — Pending |
| DEC-008 | Kanban eternal sprint, Jira project SIZE via GSD MCP | Solo+agentic flow; ceremonies have no value here. | — Pending |
| DEC-009 | Definition of Done includes WCAG AA verification | Anchors LOCKED-001 in the QA gate. | — Pending |
| DEC-010 | SEO and analytics deferred to Fase 9 (Phase 10 in roadmap) | MVP-functional first; instrumentation last. | — Pending |

## Open Questions / TBD

<!-- Acknowledged blockers from §11 of the brief. Not synthesis blockers. -->

| Item | Owner type | Affects |
|------|------------|---------|
| Definitive domain | infra | Phase 1 (partial) and Phase 10 |
| Corporate email | product | Phase 9 |
| Social handles (Instagram, WhatsApp, Facebook) | product | Phase 8 / Phase 9 |
| Chatbot provider selection | product | Phase 9 |
| 20 team photos (4 people × 5 sizes) | content | Phase 8 |
| 20 team comments (4 people × 5 sizes) | content | Phase 8 |
| 3 client case write-ups (MMA El Valle, Cranial Trading, Sin-Cero) | content | Phase 8 |
| Final rotating-words list for Home | content | Phase 2 ships with placeholders |
| Analytics strategy and event taxonomy | product | Phase 10 |

## Project-level Acceptance Criteria

From §12 of the source brief — what must be true at launch:

1. The site exposes 5 views, each at its own URL, and reuses components across them.
2. The visitor can choose among 12 markets and among 5 creative sizes — exactly 17 mutually exclusive styles.
3. Style transitions complete in approximately 600ms with no reload.
4. Default visual on first entry is dark mode at level M (Crafted).
5. Sizes XS-M ship lightweight; L and XL lazy-load their stacks (XL stack per DEC-006).
6. XL detects WebGL2 capability and falls back to L cleanly when unavailable.
7. WCAG AA legibility holds in every one of the 17 styles, including XL (LOCKED-001).
8. The contact form persists submissions to Firestore and notifies the team via transactional email.
9. The 11-service catalog renders per the active style: filtered to the market's subset for markets, full 11 for sizes.
10. Equipo on Quiénes somos has photo/comment swaps across the 5 sizes for each of the 4 founding members.
11. Per-client pages exist with shareable URLs at `/clientes/mma-el-valle`, `/clientes/cranial-trading`, `/clientes/sin-cero`.
12. Footer sticky is reachable from every view with the three flotantes (Quiénes somos, Servicios, Contacto).
13. The site is deployed under the definitive domain via Firebase Hosting + Cloudflare, and the Jira board reflects all of the above as Done with WCAG AA verified.

---
*Last updated: 2026-05-03 after intel synthesis (new-project-from-ingest)*
