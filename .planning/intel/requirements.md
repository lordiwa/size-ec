# Requirements Intel

Synthesized from PRD-class content. Each requirement carries a stable
ID (`REQ-{slug}`), source attribution, scope, description, and
acceptance criteria.

---

## REQ-routes-five-views
- source: ExistingData/SIZE-design-brief-v4.md (§7 Experiencia de usuario, §12 Entregable esperado)
- scope: routing, IA
- description: The site exposes five navigable views, each with its own
  URL for SEO purposes:
  1. Home — `/`
  2. Servicios — `/servicios`
  3. Quiénes somos — `/quienes-somos`
  4. Cliente individual — `/clientes/[slug]`
  5. Contacto — `/contacto`
- acceptance:
  - All five routes resolve in production with their own URL.
  - Footer sticky carries the three flotantes (Quiénes somos, Servicios, Contacto).
  - Components are reused across views.
  - Default visual on first entry is dark mode at level M (Crafted).

## REQ-style-gate
- source: ExistingData/SIZE-design-brief-v4.md (§3.ter Flujo de selección de estilo, §7.2/7.3/7.5)
- scope: first-visit experience, persistence, gating
- description: When a first-time visitor (no `localStorage` flag) clicks
  any footer link to Servicios, Quiénes somos, or Contacto, the
  requested view is replaced by a creativity gate prompt
  (`"¿Cuál es el tamaño de tu creatividad?"`) listing XS · S · M · L · XL.
  After selecting a size, the user lands automatically on the originally
  requested view in that style. Choosing a market from Home also writes
  the flag and bypasses the gate forever after.
- acceptance:
  - Gate appears only when no `size-style` flag exists in `localStorage`.
  - After any first selection (market in Home or size in gate), the gate
    never reappears.
  - Selecting a size in the gate routes the user to the originally
    requested view (Servicios / Quiénes somos / Contacto) styled with
    the chosen level.
  - Home with no selection always renders in M (Crafted) default.

## REQ-services-catalog
- source: ExistingData/SIZE-design-brief-v4.md (§4 Servicios SIZE)
- scope: services view content
- description: SIZE has exactly eleven services that must render in the
  Servicios view. Order is significant:
  1. Estrategia de Marca y Comunicación
  2. Branding & Identidad
  3. Diseño & Contenido Visual
  4. Producción Audiovisual
  5. Desarrollo Web & Software a Medida
  6. Performance & Paid Media
  7. Social Media & Community
  8. Activaciones de Marca & Eventos
  9. SEO & SEM
  10. IA Aplicada & Automatización
  11. Capacitaciones IA
- acceptance:
  - When the active style is a *size*, all eleven services render in
    neutral SIZE brand styling at that intensity.
  - When the active style is a *market*, only the services listed for
    that market in REQ-markets-twelve render, with descriptions adapted.
  - A "Cambiar estilo" control is reachable from Servicios.
  - View ends with a CTA to Contacto.

## REQ-markets-twelve
- source: ExistingData/SIZE-design-brief-v4.md (§5 Mercados objetivo)
- scope: market styles and per-market service mapping
- description: Twelve market styles exist, each with a canonical service
  subset and a base visual style (palette, typography, photography,
  rhythm, tone). Markets and their service subsets:
  1. Consumo masivo (CPG)
  2. Banca y servicios financieros
  3. Retail
  4. Automotriz
  5. Salud y farma
  6. Bebidas y licores
  7. Inmobiliario y construcción
  8. Educación
  9. Turismo y hospitalidad
  10. Tecnología y electrónicos
  11. Moda y belleza
  12. Fintech / D2C / Startups
- acceptance:
  - Each of the twelve markets has its own token set (palette, typography,
    photography spec, rhythm, tone) implemented per the brief.
  - Choosing a market filters the Servicios view to that market's
    subset (per §5).
  - Each market is "immediately recognisable as its industry" (Strategist QA).

## REQ-sizes-five
- source: ExistingData/SIZE-design-brief-v4.md (§6 Tamaños de creatividad)
- scope: creative-size styles
- description: Five creative-size styles exist as pure expressions of
  the SIZE brand without industry bias:
  - XS / Plain — literal Web 1999, gris, Times New Roman, links azules.
  - S / Clean — corporate clean, formal, flat.
  - M / Crafted — modern editorial, dark mode, default level.
  - L / Bold — contemporary brutalist: gigantic typography, contrast, motion.
  - XL / Unleashed — WebGL + Phaser + generative audio (always legible).
- acceptance:
  - Each size renders the eleven full services in neutral SIZE brand
    styling at that intensity.
  - Style transitions complete in approximately 600ms with no reload.
  - Progressive load: XS-M are lightweight; L and XL lazy-load
    Three.js / Phaser / Tone.js (XL stack per DEC-006).

## REQ-team-row
- source: ExistingData/SIZE-design-brief-v4.md (§7.3 Vista Quiénes somos)
- scope: Quiénes somos content
- description: The Equipo row shows team members. Initial roster of four:
  - Javier Ricaurte — Administración y Estrategia
  - Melissa Gaitán — Creatividad y Estrategia
  - Rafael Matovelle — Tecnología y Estrategia
  - Ismael Guerra — Tecnología y Creatividad
  Each person has five photos and five comments — one per creative size.
  Photos and comments swap when the active style is a size. When the
  active style is a market, the M (Crafted) version is shown for all
  markets (presentable baseline).
- acceptance:
  - Each person renders with name, role, image, and comment.
  - Switching between sizes (XS/S/M/L/XL) swaps both the image and the
    comment for every person.
  - Markets fall back to M variants for photos and comments.
  - Layout is a scalable grid that accommodates additions.
- TBD: 20 photos (4×5) and 20 comments (4×5) are pending content
  capture (§11).

## REQ-clients-row-and-pages
- source: ExistingData/SIZE-design-brief-v4.md (§7.3 Fila Clientes, §7.4 Vista Cliente individual)
- scope: client logos in Quiénes somos + per-client pages
- description: A horizontal client logos row in Quiénes somos. Clicking
  a logo routes to a per-client page at `/clientes/[slug]` with header,
  description, industry, year of relationship, prominent Back button to
  Quiénes somos, and a gallery of work examples. Initial three clients:
  - MMA El Valle — `/clientes/mma-el-valle`
  - Cranial Trading — `/clientes/cranial-trading`
  - Sin-Cero — `/clientes/sin-cero`
- acceptance:
  - All three slugs resolve with shareable URLs.
  - Each client page has SEO basics (meta title, description, structured data).
  - Galleries support imagery and embedded video (Vimeo/YouTube) per
    §13.5 recommendation.
- TBD: actual case content and assets per client (§11).

## REQ-home-rotating-words
- source: ExistingData/SIZE-design-brief-v4.md (§7.1 Vista Home)
- scope: Home hero
- description: Home presents the SIZE wordmark at dominant scale,
  followed by "Publicidad a tu medida.", followed by
  "Somos tu [palabra rotativa]". The rotating word cycles continuously
  with a typographic transition (typewriter / fade / scramble — design
  to define). Tentative list: amigo, ayuda, conciencia, competencia,
  socio, aliado, partner, voz, fuerza, sombra. CTA to Servicios is the
  dominant action.
- acceptance:
  - Rotating word changes on a fixed cadence (recommended 2.5-3s per §13.12).
  - Animated text remains in the real DOM with `aria-live="polite"` for
    screen readers.
  - Home also exposes a market-entry control (dropdown / link / button)
    that, when used, restyles Home in place without redirection and
    writes the localStorage flag.
- TBD: final 10-15 word list (§11).

## REQ-contact-view-layout
- source: ExistingData/SIZE-design-brief-v4.md (§7.5 Vista Contacto)
- scope: Contacto view
- description: Contacto uses a 40/60 two-column layout. Left column (40%)
  is a card with direct accesses to Instagram, WhatsApp, corporate
  email, and Facebook. Right column (60%) hosts a chatbot whose role is
  to qualify and route incoming clients (intermediary toward Facebook).
- acceptance:
  - Left column shows the four channels with placeholder values until
    handles/email/phone are confirmed.
  - Right column hosts the chatbot UI; per §13.6 a static placeholder
    ships first ("Conversemos" + WhatsApp/email link) and is swapped
    in place when the provider is chosen.
  - The view is gate-aware (REQ-style-gate).
- TBD: corporate email, social handles, chatbot provider (§11).

## REQ-contact-form-persistence
- source: ExistingData/SIZE-design-brief-v4.md (§8 Backend / persistencia, §10 Fase 8)
- scope: contact form backend
- description: Contact form interactions persist to Firestore. A
  transactional email notifies the team when a contact is received
  (Firebase Functions if required).
- acceptance:
  - Submissions create a Firestore document with form payload and
    timestamp.
  - On success the user sees confirmation; on failure they see a clear
    message plus an alternative email per §13.7.
  - The team receives a transactional email per submission.

## REQ-style-persistence
- source: ExistingData/SIZE-design-brief-v4.md (§3.bis, §3.ter, LOCKED-002)
- scope: persistence
- description: Style persistence uses a single `localStorage` flag named
  `size-style` of shape `{ type: 'market' | 'size', value, updatedAt }`.
  Any selection (market from Home or size from gate) writes this flag.
  Subsequent selections replace the prior value. Last write wins; only
  one style is active at a time.
- acceptance:
  - Only one flag exists; no parallel keys for market and size.
  - The flag survives reloads and recurring visits.
  - A reset control (e.g. footer "Cambiar estilo" / "reset experiencia")
    can clear or replace the flag (§13.1 recommendation).

## REQ-progressive-loading
- source: ExistingData/SIZE-design-brief-v4.md (§6 Reglas globales, §8 Performance, DEC-006)
- scope: performance, asset loading
- description: Sizes XS-M ship with the lightweight bundle. Sizes L and
  XL lazy-load their respective animation/interactivity stacks. Style
  transitions remain ~600ms regardless of level.
- acceptance:
  - Initial bundle on first paint excludes Three.js, Phaser, Tone.js,
    postprocessing, and the physics library.
  - Transitioning into L or XL fetches its stack on demand.
  - Pre-warm of XL when the user is in L is permitted (§13.8).

## REQ-xl-capability-detection
- source: ExistingData/SIZE-design-brief-v4.md (§12 Entregable esperado, §13.9, DEC-006)
- scope: XL gating
- description: Level XL is gated on WebGL2 capability. Devices without
  WebGL2 fall back to L automatically with a toast/educational message.
- acceptance:
  - On XL entry, capability is detected before any heavy load.
  - Failure path falls back to L cleanly (no crash, no blank screen).
  - User is notified of the fallback.
