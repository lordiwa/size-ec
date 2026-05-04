# Requirements: SIZE

**Defined:** 2026-05-03
**Core Value:** A visitor can pick one of 17 mutually exclusive styles (12 markets + 5 creative sizes) and see the entire site reshape itself — legibly, in place, without reload — to that single style.

Source brief (canonical reference): `ExistingData/SIZE-design-brief-v4.md` (§1–§14).
Synthesized intel: `.planning/intel/requirements.md`.

## v1 Requirements

Requirements for initial release. Each maps to exactly one roadmap phase.

### Routing & IA

- [x] **REQ-routes-five-views**: The site exposes five navigable views, each with its own URL — Home `/`, Servicios `/servicios`, Quiénes somos `/quienes-somos`, Cliente individual `/clientes/[slug]`, Contacto `/contacto`. Footer sticky carries Quiénes somos, Servicios, Contacto. Default visual on first entry is dark mode at level M (Crafted).

### Style System

- [x] **REQ-style-gate**: When a first-time visitor (no `localStorage` flag) clicks any footer link to Servicios, Quiénes somos, or Contacto, the requested view is replaced by a creativity gate prompt (*"¿Cuál es el tamaño de tu creatividad?"*) listing XS · S · M · L · XL. After selection, the user lands on the originally requested view styled with the chosen level. Choosing a market from Home also writes the flag and bypasses the gate forever.
- [x] **REQ-style-persistence**: Style persistence uses a single `localStorage` flag named `size-style` of shape `{ type: 'market' | 'size', value, updatedAt }`. Any selection writes this flag; subsequent selections replace the prior value. Last write wins; only one style is active at a time. A reset control (footer "Cambiar estilo") can clear or replace the flag.
- [ ] **REQ-progressive-loading**: Sizes XS-M ship with the lightweight bundle. Sizes L and XL lazy-load their respective animation/interactivity stacks (GSAP+Lottie for L; Three.js + Phaser + Tone.js + postprocessing + physics for XL). Style transitions remain ~600ms regardless of level.
- [ ] **REQ-xl-capability-detection**: Level XL is gated on WebGL2 capability. Devices without WebGL2 fall back to L automatically with a toast/educational message and no crash.

### Creative Sizes (5)

- [ ] **REQ-sizes-five**: Five creative-size styles exist as pure SIZE-brand expressions without industry bias — XS / Plain (literal Web 1999), S / Clean, M / Crafted (default), L / Bold, XL / Unleashed. Each renders the full 11-service catalog at its intensity. Style transitions complete in ~600ms with no reload.

### Markets (12)

- [ ] **REQ-markets-twelve**: Twelve market styles exist with their own token sets (palette, typography, photography, rhythm, tone) and canonical service subsets — Consumo masivo (CPG), Banca y servicios financieros, Retail, Automotriz, Salud y farma, Bebidas y licores, Inmobiliario y construcción, Educación, Turismo y hospitalidad, Tecnología y electrónicos, Moda y belleza, Fintech / D2C / Startups. Choosing a market filters Servicios to that market's subset. Each market is "immediately recognisable as its industry."

### Content Surfaces

- [ ] **REQ-services-catalog**: SIZE has exactly 11 services rendered in Servicios, in this order — Estrategia de Marca y Comunicación; Branding & Identidad; Diseño & Contenido Visual; Producción Audiovisual; Desarrollo Web & Software a Medida; Performance & Paid Media; Social Media & Community; Activaciones de Marca & Eventos; SEO & SEM; IA Aplicada & Automatización; Capacitaciones IA. When the active style is a *size*, all 11 render in neutral SIZE styling at that intensity. When the active style is a *market*, only that market's subset renders. A "Cambiar estilo" control is reachable; the view ends with a CTA to Contacto.
- [x] **REQ-home-rotating-words**: Home presents the SIZE wordmark at dominant scale, the brand promise *"Publicidad a tu medida."*, and a rotating *"Somos tu [palabra]"* line. The rotating word cycles continuously (typewriter / fade / scramble — to define) on a fixed cadence (~2.5–3s). Tentative list: amigo, ayuda, conciencia, competencia, socio, aliado, partner, voz, fuerza, sombra. Animated text remains in the real DOM with `aria-live="polite"`. Home also exposes a market-entry control that restyles Home in place without redirection.
- [ ] **REQ-team-row**: Quiénes somos shows an Equipo grid with the four founders — Javier Ricaurte (Administración y Estrategia), Melissa Gaitán (Creatividad y Estrategia), Rafael Matovelle (Tecnología y Estrategia), Ismael Guerra (Tecnología y Creatividad) — each with 5 photos and 5 comments (one per creative size). Sizes swap photos and comments. Markets fall back to M variants. Layout is a scalable grid.
- [ ] **REQ-clients-row-and-pages**: Quiénes somos has a horizontal client logos row. Clicking a logo routes to a per-client page at `/clientes/[slug]` with header, description, industry, year of relationship, prominent Back button to Quiénes somos, and a gallery (imagery + Vimeo/YouTube embeds). Initial three: MMA El Valle (`/clientes/mma-el-valle`), Cranial Trading (`/clientes/cranial-trading`), Sin-Cero (`/clientes/sin-cero`). Each client page has SEO basics (meta title, description, structured data).
- [ ] **REQ-contact-view-layout**: Contacto uses a 40/60 two-column layout. Left column (40%) is a card with direct accesses to Instagram, WhatsApp, corporate email, and Facebook. Right column (60%) hosts a chatbot. A static placeholder ("Conversemos" + WhatsApp/email link) ships first and is swapped in place when the provider is chosen. The view is gate-aware.

### Backend

- [ ] **REQ-contact-form-persistence**: Contact form interactions persist to Firestore with timestamp. A transactional email notifies the team on each submission (Firebase Functions if required). On success the user sees confirmation; on failure they see a clear message plus an alternative email.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

(None yet — captured in PROJECT.md "Out of Scope" instead.)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Internationalization / non-Spanish copy | Spanish-only ship per DEC-005; no i18n layer. |
| Cross-product of market × size (60 combinations) | Forbidden by LOCKED-002 — styles are mutually exclusive. |
| Staging environment | Production-only per DEC-002 / CON-010. |
| Generic service menu / fixed package | Counter to the brand positioning ("publicidad a tu medida"). |
| Third-party auth on the site | Out of scope for v1; site is anonymous-read with one form. |
| Heavy animation libraries on first paint | Three.js / Phaser / Tone.js / postprocessing / physics are lazy-loaded only (DEC-006 / CON-004). |
| Live chatbot before provider chosen | Ships as static placeholder until product picks a provider (TBD §11). |
| Mobile native app | Web-first; no native app in scope. |

## Traceability

Each v1 requirement maps to exactly one phase. See `ROADMAP.md` for full phase definitions.

| Requirement | Phase | Status |
|-------------|-------|--------|
| REQ-routes-five-views | Phase 1 | Complete (01-01 + 01-04) |
| REQ-style-gate | Phase 1 | Complete (01-03 + 01-04) |
| REQ-style-persistence | Phase 1 | Complete (01-01 + 01-04) |
| REQ-services-catalog | Phase 3 | Pending |
| REQ-home-rotating-words | Phase 1 | Complete (01-02 + 01-04) |
| REQ-sizes-five | Phase 5 | Pending |
| REQ-markets-twelve | Phase 4 | Pending |
| REQ-team-row | Phase 8 | Pending |
| REQ-clients-row-and-pages | Phase 8 | Pending |
| REQ-contact-view-layout | Phase 3 | Pending |
| REQ-contact-form-persistence | Phase 9 | Pending |
| REQ-progressive-loading | Phase 7 | Pending |
| REQ-xl-capability-detection | Phase 7 | Pending |

**Notes:**
- REQ-sizes-five is split across Phases 3 (M default), 5 (S+L), 6 (XS), and 7 (XL); the row above marks the *first phase that must complete* for the requirement to be considered substantively realized — XS is the last small/medium size to be added, after which the size catalog is feature-complete except for XL. Final completion of REQ-sizes-five depends on Phase 7 (XL) shipping. The traceability is therefore "first phase that begins it" with the understanding that several sizes complete it across phases. (See ROADMAP.md Phase 5–7 for full mapping.)
- REQ-services-catalog first lands in Phase 3 (M default rendering all 11) and is exercised again in Phase 4 (market-filtered subsets).
- REQ-progressive-loading is incrementally satisfied in Phases 5 (L lazy-load) and 7 (XL lazy-load), but its phase of completion — when the bundle-splitting policy is verified end-to-end — is Phase 7.

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-03*
*Last updated: 2026-05-03 after initial synthesis*
