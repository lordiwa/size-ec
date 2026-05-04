# Decisions Intel

Synthesized from classified planning docs. Decisions are grouped by tier:
LOCKED tier comes first (immovable, hoisted from explicit "REGLA INVIOLABLE"
content even when the host doc is a PRD), followed by accepted decisions and
defaults that may evolve.

---

## LOCKED tier (REGLA INVIOLABLE — cannot be auto-overridden)

### LOCKED-001 — Legibilidad WCAG AA en los 17 estilos
- source: ExistingData/SIZE-design-brief-v4.md (§3 "REGLA INVIOLABLE — Legibilidad")
- status: locked (user-pinned via classifier note)
- scope: typography, contrast, all 17 site styles (12 markets + 5 sizes), all 5 views
- decision: Body text must meet WCAG AA contrast minimum 4.5:1; large text 3:1.
  Applies to every market style and every creative size, including XL.
  Functional content (services, copy, CTAs) is always readable; in XL all
  effects live in the background or as decorative elements only. Hierarchy
  must remain clear in every style. The "abuela test" governs acceptance:
  if a grandmother can read service names and understand what SIZE does,
  the level is correctly implemented. Conflicts between creativity and
  legibility always resolve in favour of legibility (cross-ref §9.6).

### LOCKED-002 — Estilos mutuamente excluyentes (12 + 5 = 17, single active)
- source: ExistingData/SIZE-design-brief-v4.md (§3.bis "REGLA INVIOLABLE — Estilos mutuamente excluyentes")
- status: locked (user-pinned via classifier note)
- scope: site styling system, persistence model, store shape
- decision: The site has exactly 17 styles — 12 market styles
  (CPG, Banca, Retail, Automotriz, Salud, Bebidas, Inmobiliario, Educación,
  Turismo, Tecnología, Moda, Fintech) and 5 creative sizes
  (XS, S, M, L, XL). Styles are mutually exclusive: only one is active at
  a time. Choosing a market deactivates any prior size and vice versa.
  The 60-combination space (12×5) is forbidden by design.
- persistence shape: a SINGLE flag in localStorage, key `size-style`, value
  `{ type: 'market' | 'size', value, updatedAt }`. The last selection
  replaces the previous one; no merging, no stacking.
- defaults on selection:
  - choosing a market → site renders in that market style at its M (Crafted) visual baseline
  - choosing a size → site renders in that size as a neutral SIZE-brand expression with no industry bias

---

## Accepted decisions (non-locked)

### DEC-001 — Frontend stack: Vue 3 + Vite + Pinia + Vue Router + Tailwind + TypeScript
- source: ExistingData/SIZE-design-brief-v4.md (§8 Stack técnico → Frontend)
- status: accepted
- scope: frontend tooling
- decision: Vue 3 (Composition API, `<script setup>`), Vite as bundler,
  Vue Router for SPA with real per-view URLs, Pinia for global state
  (selected market + creative size + active theme), Tailwind CSS plus
  CSS custom properties for the token system, TypeScript recommended.

### DEC-002 — Hosting: Firebase Hosting (Spark) + Cloudflare proxy, production-only
- source: ExistingData/SIZE-design-brief-v4.md (§8 Build y deploy)
- status: accepted
- scope: infrastructure, deployment
- decision: Repository on GitHub, hosted on Firebase Hosting Spark (free)
  tier, DNS and CDN through Cloudflare with proxy and SSL. Only the
  production environment exists — no staging. Pipeline is `push to main`
  → automatic deploy to Firebase Hosting → Cloudflare propagation.
  Aggressive code-splitting per intensity level and per market.

### DEC-003 — Backend persistence: Firebase Firestore (+ Functions if needed)
- source: ExistingData/SIZE-design-brief-v4.md (§8 Backend / persistencia)
- status: accepted
- scope: contact form storage, future chatbot leads
- decision: Firestore stores contact-form interactions and (future)
  chatbot leads. Firebase Functions are used if needed for transactional
  email and chatbot webhooks.

### DEC-004 — Default visual on entry: M (Crafted), dark mode
- source: ExistingData/SIZE-design-brief-v4.md (§6 Tamaños de creatividad, §7 Estructura global)
- status: accepted
- scope: initial render, first-visit experience
- decision: Without any prior selection, Home renders in level M (Crafted)
  with dark mode. M is the default. `localStorage` is empty until the
  user picks a market or a size.

### DEC-005 — Spanish only
- source: ExistingData/SIZE-design-brief-v4.md (§8 Idiomas)
- status: accepted
- scope: i18n
- decision: The site ships in Spanish only. No internationalization layer
  is in scope.

### DEC-006 — XL stack: lazy-loaded Three.js + Phaser 3 + Tone.js + postprocessing + physics
- source: ExistingData/SIZE-design-brief-v4.md (§8 Animación e interactividad por nivel → Nivel 5 (XL))
- status: accepted
- scope: XL "Unleashed" implementation
- decision: Level XL is lazy-loaded. Stack: Three.js via `@tresjs/core`
  (official Vue wrapper), Phaser 3 for embedded mini-games, Tone.js for
  generative audio (default OFF), `postprocessing` for shaders (bloom,
  glitch, RGB shift), and either Cannon-es or Rapier for physics.
  Levels 1-2 use zero animation JS. Level 3 (M) uses GSAP (ScrollTrigger)
  + Lenis. Level 4 (L) uses full GSAP + Lottie.

### DEC-007 — Typography hosting and subsetting
- source: ExistingData/SIZE-design-brief-v4.md (§8 Tipografía)
- status: accepted
- scope: fonts, performance
- decision: Fonts are self-hosted via `@font-face`. Variable fonts for
  levels 3-5. Latin subsets only (Spanish).

### DEC-008 — Sprint methodology: Kanban with eternal sprint, Jira project SIZE
- source: ExistingData/SIZE-design-brief-v4.md (§9.4 Integración con Jira)
- status: accepted
- scope: project management, agentic ops
- decision: Kanban with one eternal sprint that never closes. Jira project
  key SIZE. Board URL `https://cranialtrading.atlassian.net/jira/software/projects/SIZE/boards/100`.
  Workflow: Backlog → To Do → In Progress → In Review → Done. Integration
  via GSD MCP running in Claude Code.

### DEC-009 — Definition of Done includes WCAG AA verification
- source: ExistingData/SIZE-design-brief-v4.md (§9.5 Definición de Done)
- status: accepted
- scope: QA acceptance
- decision: A ticket is Done only when its acceptance criterion is in
  production, QA validated it, WCAG AA legibility is verified for any
  view/component touched, and any affected market×size combinations
  still work.

### DEC-010 — SEO and Analytics deferred to project end
- source: ExistingData/SIZE-design-brief-v4.md (§8 SEO, Analytics; §10 Fase 9)
- status: accepted
- scope: launch scope
- decision: SEO (meta tags, sitemap, structured data, M-level prerender)
  and analytics belong to the final phase (Fase 9), post-MVP-functional.
- note: The exact analytics strategy and event taxonomy is TBD (§11).
