# Context Intel

Topical, non-prescriptive context captured from the planning docs.
Useful for downstream PROJECT.md / ROADMAP.md authoring but not
binding in the way decisions/requirements/constraints are.

---

## Brand & positioning
- source: ExistingData/SIZE-design-brief-v4.md (§1 La marca)
- SIZE is a new advertising and media agency in Ecuador.
- Tagline: *We size up to anything.*
- Brand promise: *Publicidad a tu medida.*
- Positioning: integral agency with a creative heart and digital/tech
  muscle. Adapts to the size and nature of each client — from mass
  brands to startups — rather than offering a generic service menu.

## The 17-styles concept
- source: ExistingData/SIZE-design-brief-v4.md (§2 El concepto del sitio)
- The site itself is the first living proof of the positioning. The
  visitor controls it by choosing among 17 mutually exclusive styles.
- Two axes: 12 market styles (industry expression + service filtering)
  and 5 creative-size styles (pure intensity, no industry bias, full
  service catalog).
- Formula: `12 markets + 5 sizes = 17 styles. Active at a time = 1.`
- Each pick replaces the prior. The site is one of seventeen ways to
  see SIZE — never a sixtieth blend.

## Per-market style notes
- source: ExistingData/SIZE-design-brief-v4.md (§5 Mercados objetivo)
- Each market has both prioritized services (rendered in Servicios) and
  a base style (palette, typography, photography, rhythm, tone). The
  brief specifies these for all twelve markets. Examples:
  - CPG: saturated palette (rojo `#E63946`, amarillo `#FFD60A`, azul
    `#0077B6`), rounded sans (Poppins/DM Sans/Nunito), fast energetic
    rhythm, popular tone.
  - Banca: deep blues (`#003566`, `#001D3D`), institutional serif +
    Inter/IBM Plex sans, slow hierarchical rhythm, formal tone.
  - Retail: high contrast with hero accent, condensed bold sans (Druk,
    Bebas Neue, Anton), urgent rhythm, sales-driven tone.
  - Automotriz: deep blacks, silver, metallic accents, geometric sans
    with weight (Eurostile, Neue Haas Grotesk, Suisse), cinematic.
  - Salud: white-dominant, soft clinical blues + greens, humanist sans
    (Inter, Source Sans, Karla), calm pedagogical rhythm.
  - Bebidas: ambers/golds on black or vibrant fruit tones, character
    serif (Canela/Domaine), sensual rhythm.
  - Inmobiliario: architectural neutrals, architectural serif (Tiempos,
    GT Sectra) + clean sans (Söhne), slow contemplative rhythm.
  - Educación: trustworthy blues + youthful accent, friendly sans,
    motivating tone.
  - Turismo: location-driven palettes (turquoise/sands, deep greens,
    ochres, blacks/golds), evocative serif (Playfair, Cormorant),
    immersive full-bleed rhythm.
  - Tecnología: dark-mode-dominant, vibrant accents (cyan/lime/purple),
    neo-grotesque or mono sans (Inter, JetBrains Mono, Geist).
  - Moda: nudes/cream or strong editorial combinations, tall editorial
    serif (Didot, Bodoni, Migra) + condensed sans, magazine rhythm.
  - Fintech: modern color-blocking (mint, lila, off-white), geometric
    sans (Söhne, Geist, Satoshi, General Sans), product-led rhythm.

## Creative-size personalities
- source: ExistingData/SIZE-design-brief-v4.md (§6 Tamaños de creatividad)
- XS / Plain — literal Web 1999, gris, Times New Roman, links azules.
- S / Clean — corporate clean, formal, flat.
- M / Crafted — modern editorial, dark mode default. Default level.
- L / Bold — contemporary brutalist: gigantic typography, contrast, motion.
- XL / Unleashed — limitless: WebGL + Phaser + generative audio, but
  always legible.

## Agentic operating model
- source: ExistingData/SIZE-design-brief-v4.md (§9)
- The project runs through specialized agents orchestrated by a PM in
  Claude Code, with GSD MCP wired to Jira.
- Roster:
  - Developer — Front End Dev / Back End Dev / ReportToPM
  - Researcher — Research / ReportToPM
  - QA — Find Bugs / ReportToPM
  - Strategist — Advertisement / Marketing / Design Analysis / ReportToPM
  - PM — UseJira (via GSD MCP) / ProcessTeamReports
- Workflow: tickets originate from any agent or human → PM grooms
  (clarifies, adds AC, estimates, labels, status) → PM proactively
  surfaces critical groomed tickets → agent picks up and reports back →
  PM updates → QA validates before Done.
- Jira: project SIZE at cranialtrading, Kanban with one eternal sprint,
  states Backlog → To Do → In Progress → In Review → Done.
- Definition of Done: AC met in production + QA validated + WCAG AA
  verified for views/components + 60 affected combinations still work.
- Blockers: technical blocker → Developer escalates to Researcher first,
  then PM. Critical prod bug → QA reports to PM, PM consults human.
  Creativity-vs-legibility → legibility always wins (LOCKED-001).

## View-by-view UX notes
- source: ExistingData/SIZE-design-brief-v4.md (§7.1-7.5)
- Home: SIZE wordmark dominant, "Publicidad a tu medida.", rotating
  "Somos tu …" line, CTA to Servicios with shine/pulse hover, accessible
  market entry. Picks restyle Home in place; no redirect.
- Servicios: state-A is the gate when no flag exists; state-B shows the
  view in the active style (filtered services for markets, all 11 for
  sizes), with "Cambiar estilo" control and a closing CTA to Contacto.
- Quiénes somos: gate-aware as well; team row with 5 photos × 5 comments
  per person; client logos row links to per-client pages. Sizes drive
  photo/comment swaps; markets fall back to M variants.
- Cliente individual: header with name, descriptive metadata, prominent
  Back button, gallery of work. SEO basics on every page.
- Contacto: gate-aware; 40/60 layout with channel card on the left and
  chatbot on the right; the chatbot ships as a static placeholder
  (WhatsApp/email link) until the provider is chosen.

## Cross-view style behaviour (gap analysis recommendation)
- source: ExistingData/SIZE-design-brief-v4.md (§13.3)
- The level (creative size) persists across all views as the user's
  transversal "creative intensity".
- The market applies where it makes sense: Servicios fully, Quiénes
  somos partially (used to tint accents), Home and Contacto use the
  neutral SIZE-brand expression.
- Photos and comments in Quiénes somos always swap with the level, not
  with the market.

## Roadmap shape (for downstream consumption)
- source: ExistingData/SIZE-design-brief-v4.md (§10)
- Fase 0 — Setup: Firebase Spark project, GitHub repo, Hosting wiring,
  Cloudflare configuration, GSD MCP pointed at Jira project SIZE,
  initial epics in Jira.
- Fase 1 — Sistema base: token system (brand + 12 markets + 5 sizes
  as independent sets), Vue Router with five routes, Pinia store with
  the single style flag, sticky footer, Home with rotating word, the
  creativity gate, live-style validation.
- Fase 2 — Tamaño M y default visual.
- Fase 3 — 12 market styles all on M.
- Fase 4 — Tamaños S y L.
- Fase 5 — Tamaño XS.
- Fase 6 — Tamaño XL: lazy-load Three.js + Phaser + Tone.js, capability
  detection with fallback to L, performance polish.
- Fase 7 — Contenido: 20 team photos, 20 comments, 3 client cases,
  final rotating-words list.
- Fase 8 — Integraciones: Firestore contact form + transactional email,
  chatbot wired in, corporate email connected.
- Fase 9 — Cierre: SEO, analytics (GA4 events for market/size
  selection, gate completion, CTAs, scroll depth), final QA across the
  17 styles, deploy with definitive domain.

## Open items (TBD)
- source: ExistingData/SIZE-design-brief-v4.md (§11 Pendientes abiertos)
- Definitive domain — infra — blocker for Fase 0 (partial) and Fase 8.
- Corporate email — product — blocker for Fase 7.
- Social handles — product — blocker for Fase 6/7.
- Chatbot provider — product — blocker for Fase 7.
- 20 team photos — content — blocker for Fase 6.
- 20 team comments — content — blocker for Fase 6.
- Three client cases (descriptions + examples) — content — blocker for Fase 6.
- Final rotating-words list — content — Fase 1 can ship with placeholders.
- Analytics strategy and event taxonomy — product — blocker for Fase 8.

## Gap analysis priorities
- source: ExistingData/SIZE-design-brief-v4.md (§14 Priorización de los gaps)
- Resolve before Fase 1: first-vs-recurring visit state (§13.1),
  Servicios pre-market state (§13.2), level/market persistence across
  views (§13.3), basic error handling at least 404 (§13.7), CLAUDE.md /
  AGENTS.md for the agentic team (§13.15).
- Resolve during Fases 2-4: mobile slider behaviour, client case format,
  chatbot placeholder, browser compatibility, content versioning,
  full accessibility, accessible rotating text.
- Resolve during Fases 5-8: XL loading personality, automated testing,
  asset optimization, success metrics.
