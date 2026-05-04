# Roadmap: SIZE

## Overview

This roadmap is **prototype-first**: Phase 1 reaches feature parity with the standalone HTML prototype (`ExistingData/SIZE Web Prototype - standalone.html`) inside the Vue 3 app — 5 routes, sticky footer, creativity gate, 12 markets + 5 sizes selectable, single Pinia/localStorage flag, ~600ms in-place restyle, M Crafted dark-mode default, all WCAG AA. Once that runs locally in the browser, every subsequent phase layers a single concern on top: M consolidation, mercados, S+L, XS, XL, content, integrations. Operational concerns (Firebase Hosting, Cloudflare DNS, GSD MCP wiring, Jira epics, SEO + analytics + final QA + cutover) are deferred to the **last** phase, so we don't ship an empty shell to production before the design system works.

The journey is **goal-backward by phase**: each phase delivers a coherent, observable capability that compounds toward the project-level acceptance criteria in PROJECT.md. Style mutual-exclusivity (LOCKED-002) and WCAG AA legibility (LOCKED-001) are non-negotiable on every phase that touches a view.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Paridad prototipo** - Match the standalone HTML prototype inside Vue: 5 routes + sticky footer + creativity gate + 12 markets + 5 sizes + single Pinia/localStorage flag + Home rotating word + ~600ms in-place restyle, M Crafted dark default, WCAG AA
- [ ] **Phase 2: Tamaño M (Crafted) consolidado** - M as default everywhere on every view (Servicios full 11-service list, Quiénes somos, Contacto 40/60 placeholder, Cliente individual base) with WCAG AA + 600ms transitions verified end-to-end
- [ ] **Phase 3: Mercados sobre M** - 12 market styles applied on top of M baseline; service-list filtered to canonical subset per market; 12 × 4 = 48-state QA matrix passes
- [ ] **Phase 4: Tamaños S y L** - S (Clean) and L (Bold) as neutral SIZE expressions; L lazy-loads GSAP + Lottie
- [ ] **Phase 5: Tamaño XS (Plain)** - Web 1999 literal: gris, Times New Roman, links azules, no JS animation
- [ ] **Phase 6: Tamaño XL (Unleashed)** - Three.js + Phaser + Tone.js + postprocessing + physics, lazy-loaded, WebGL2-gated, L fallback
- [ ] **Phase 7: Contenido** - 20 team photos, 20 team comments, 3 client cases, final rotating-words list
- [ ] **Phase 8: Integraciones** - Firestore contact form + transactional email + chatbot + corporate email
- [ ] **Phase 9: Cierre + Despliegue** - SEO + GA4 analytics + 17-style final QA + Firebase Hosting deploy + Cloudflare DNS + GSD MCP wiring + Jira epics + definitive domain cutover

## Phase Details

### Phase 1: Paridad prototipo
**Goal**: Reach feature parity with the standalone HTML prototype inside the Vue app. A user can navigate the 5 routes locally (`pnpm dev`), see a sticky footer, hit the creativity gate on first visit, pick a size or a market, watch the site re-style in place via a single Pinia store backed by one localStorage flag, and see Home's rotating word animate accessibly. M Crafted dark mode is the working default.
**Depends on**: Nothing (first phase — there is no deploy to depend on)
**Requirements**: REQ-routes-five-views, REQ-style-gate, REQ-style-persistence, REQ-home-rotating-words
**Success Criteria** (what must be TRUE):
  1. All 5 routes (`/`, `/servicios`, `/quienes-somos`, `/clientes/[slug]`, `/contacto`) resolve with their own URLs and reuse a sticky footer that links to Quiénes somos / Servicios / Contacto.
  2. A first-time visitor (no `size-style` flag) clicking footer Servicios / Quiénes somos / Contacto sees the creativity gate (XS · S · M · L · XL); after selection they land on the originally requested view styled with that size.
  3. Picking a market on Home or a size at the gate writes a single localStorage flag `size-style: { type, value, updatedAt }`, replacing any prior value, and the gate never reappears for that visitor.
  4. The token system supports 12 markets + 5 sizes as **independent** sets (no merging) and a "Cambiar estilo" reset control restores first-time behaviour.
  5. Home renders the SIZE wordmark + brand promise + a *"Somos tu …"* line whose word rotates ~2.5–3s with `aria-live="polite"`; toggling sizes/markets restyles Home in place without redirection in ≤ ~600ms.
  6. M Crafted dark mode is the rendered default for any visitor with no flag, on every view.
  7. Browser-verifiable via `pnpm dev` — no Firebase deploy required to demonstrate the prototype parity.
**Plans**: 4 plans
  - [x] 01-01-PLAN.md — Markets token system (12 market CSS blocks + 600ms body transition + Google Fonts)
  - [x] 01-02-PLAN.md — Markets selector grid on Home + rotator crossfade
  - [x] 01-03-PLAN.md — M-tick reset semantics + post-gate routing
  - [x] 01-04-PLAN.md — Vitest smoke layer (store + MarketsGrid + gate-flow + routes)
**UI hint**: yes

### Phase 2: Tamaño M (Crafted) consolidado
**Goal**: M (Crafted) is the working default everywhere. A first-time or recurring visitor with no flag lands on every view in M dark-mode, reads the 11 services, sees the team in M, and reaches Contacto in M — with WCAG AA verified and ~600ms transitions.
**Depends on**: Phase 1
**Requirements**: REQ-services-catalog (M slice), REQ-contact-view-layout
**Success Criteria** (what must be TRUE):
  1. With no flag, every one of the 5 views renders in M (Crafted) dark mode and is fully legible per WCAG AA (LOCKED-001) — body ≥ 4.5:1, large text ≥ 3:1, hierarchy clear.
  2. Servicios at M renders all 11 services in the canonical order (REQ-services-catalog) in neutral SIZE styling, ending with a CTA to Contacto and exposing a "Cambiar estilo" control.
  3. Contacto at M presents the 40/60 layout: left card with placeholder Instagram / WhatsApp / corporate email / Facebook entries, right column with the static "Conversemos" placeholder ready to be replaced.
  4. Style transitions into and out of M complete in ~600ms with no full reload (CON-008), respecting `prefers-reduced-motion` (CON-005).
  5. The "abuela test" passes on M: a non-technical reader can identify what SIZE does and read every service name (LOCKED-001 acceptance heuristic).
**Plans**: TBD
**UI hint**: yes

### Phase 3: Mercados sobre M
**Goal**: All 12 market styles work on top of the M baseline. Each market is immediately recognisable as its industry, filters Servicios to its canonical service subset, and stays WCAG AA legible. The 12 × 4 = 48-state QA matrix passes.
**Depends on**: Phase 2
**Requirements**: REQ-markets-twelve
**Success Criteria** (what must be TRUE):
  1. Twelve market token sets exist and apply on demand (CPG, Banca, Retail, Automotriz, Salud, Bebidas, Inmobiliario, Educación, Turismo, Tecnología, Moda, Fintech), each with its specified palette, typography, photography spec, rhythm, and tone.
  2. Choosing a market filters Servicios to the canonical subset for that market (per §5 of the brief), keeps the order, and adapts the descriptions.
  3. Each market is "immediately recognisable as its industry" on a Strategist QA pass — a target user identifies the industry without being told.
  4. WCAG AA legibility holds for body and large text in **every one** of the 12 markets across the 4 view-states where markets meaningfully apply (Servicios full + Quiénes somos accents + Home/Contacto neutral fallbacks behaving correctly), totalling 12 × 4 = 48 visual states.
  5. Switching between any two markets is animated, in place, ~600ms, with no reload (CON-003 / CON-008).
**Plans**: TBD
**UI hint**: yes

### Phase 4: Tamaños S y L
**Goal**: S (Clean) and L (Bold) ship as neutral SIZE expressions. S is corporate clean and flat with zero animation JS; L is contemporary brutalist with full GSAP + Lottie, lazy-loaded, still WCAG AA.
**Depends on**: Phase 3
**Requirements**: REQ-sizes-five (S+L slice)
**Success Criteria** (what must be TRUE):
  1. Choosing S from the gate or from a Cambiar-estilo control restyles all 5 views into corporate clean / formal / flat — with zero animation JS — and renders all 11 services neutral.
  2. Choosing L restyles all 5 views into contemporary brutalist (gigantic typography, contrast, motion) and lazy-loads GSAP + Lottie — the L stack is **not** in the initial bundle.
  3. WCAG AA legibility holds in both S and L across all 5 views (body ≥ 4.5:1, large text ≥ 3:1).
  4. Style transitions into S and L complete in ~600ms; `prefers-reduced-motion` attenuates or blocks L animations.
  5. The 60-combination invariant still holds: choosing S or L resets any prior market; no merging of S/L with a market style.
  6. **L visual treatment is locked to DECISION-LX-LOCKED in PROJECT.md** — match the prototype CSS (`level-l`, `l-l-card`, `l-l-button`, `l-l-marquee`) exactly: `#FFEE00`/`#000`/`#FF00AA`, Archivo Black, 4px borders, 8px+6px chunky shadows with hover translate, 30s marquee.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Tamaño XS (Plain)
**Goal**: XS / Plain is the literal Web 1999 size — gris, Times New Roman, links azules — and is genuinely usable, with the size catalog now complete except for XL.
**Depends on**: Phase 4
**Requirements**: REQ-sizes-five (XS slice)
**Success Criteria** (what must be TRUE):
  1. Choosing XS from the gate restyles all 5 views into Web-1999 plain: grey background, Times New Roman, blue links, no JS animations.
  2. XS renders all 11 services in the canonical order, the team grid (Quiénes somos), and the Contacto layout — all reachable, all readable.
  3. XS works in legacy environments down to IE11 (ironic intent per CON-006), and the size never breaks the gate flow on any modern browser.
  4. WCAG AA legibility holds in XS (body ≥ 4.5:1, large text ≥ 3:1) — the 1999 aesthetic does not become an accessibility regression.
  5. **XS is locked to DECISION-XS-RETRO in PROJECT.md** — full 1999, not a retro accent. Times New Roman everywhere, raised/inset bevels, `<table>` layouts, `<hr>` rules, blue underlined links.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Tamaño XL (Unleashed)
**Goal**: XL / Unleashed is fully alive — Three.js / Phaser / Tone.js / postprocessing / physics — but it always degrades cleanly to L when WebGL2 is missing, and progressive loading verifies that XS-M ship lightweight bundles end-to-end.
**Depends on**: Phase 5
**Requirements**: REQ-sizes-five (XL slice), REQ-progressive-loading, REQ-xl-capability-detection
**Success Criteria** (what must be TRUE):
  1. Choosing XL from the gate lazy-loads Three.js (`@tresjs/core`), Phaser 3, Tone.js (default OFF), `postprocessing`, and a physics library (Cannon-es or Rapier) — none of these libraries are present in the initial bundle when the active style is XS / S / M.
  2. WebGL2 capability is detected before any heavy load. Devices without WebGL2 fall back to L cleanly with a toast/educational message — no crash, no blank screen.
  3. WCAG AA legibility holds in XL: all visual effects live in background or decorative layers, and functional content (services, copy, CTAs) is always readable (LOCKED-001).
  4. Style transitions into XL complete in ~600ms perceived (heavy assets stream in afterwards), and `prefers-reduced-motion` blocks or attenuates motion in XL.
  5. End-to-end bundle audit confirms aggressive code-splitting per intensity level and per market (CON-004): an XS / S / M visitor never downloads L or XL stacks.
  6. **Phaser 3 is locked to DECISION-XL-PHASER in PROJECT.md** as a first-class capability for embedded mini-games, not just decorative WebGL. Three.js + Tone.js + postprocessing remain auxiliary. Phaser is lazy-loaded only when active style is XL.
**Plans**: TBD
**UI hint**: yes

### Phase 7: Contenido
**Goal**: The site is content-complete. The Equipo grid has 20 photos and 20 comments (4 founders × 5 sizes), three full client cases ship at their slugs, and the Home rotating-words list is final.
**Depends on**: Phase 6
**Requirements**: REQ-team-row, REQ-clients-row-and-pages, REQ-home-rotating-words (final word list slice)
**Success Criteria** (what must be TRUE):
  1. Quiénes somos renders the four founders (Javier Ricaurte, Melissa Gaitán, Rafael Matovelle, Ismael Guerra) each with name, role, image, and comment; switching sizes (XS/S/M/L/XL) swaps both the image and the comment for every founder; markets fall back to M variants.
  2. The horizontal client logos row links to per-client pages at `/clientes/mma-el-valle`, `/clientes/cranial-trading`, `/clientes/sin-cero`, each with header, description, industry, year, prominent Back button to Quiénes somos, and a gallery (imagery + Vimeo/YouTube embeds).
  3. Each client page has SEO basics: meta title, meta description, structured data.
  4. Home's rotating-words list is final (10–15 words confirmed by product) and replaces the placeholder list.
  5. All imagery uses WebP with JPG fallback (and AVIF where supported), uses `loading="lazy"` below the fold, and is compressed by the build pipeline (CON-012).
**Plans**: TBD
**UI hint**: yes

### Phase 8: Integraciones
**Goal**: Contacto goes from static placeholder to live: Firestore stores submissions, transactional email notifies the team, the chosen chatbot provider replaces the placeholder, and the corporate email channel is real on the left card.
**Depends on**: Phase 7
**Requirements**: REQ-contact-form-persistence
**Success Criteria** (what must be TRUE):
  1. Submitting the contact form creates a Firestore document with the form payload and a server timestamp.
  2. The team receives a transactional email per submission (Firebase Functions if required); on success the user sees a confirmation message; on failure the user sees a clear message with an alternative email channel.
  3. The 40/60 Contacto layout shows real Instagram / WhatsApp / corporate-email / Facebook destinations on the left card (no more placeholders).
  4. The chatbot UI on the right column is wired to the chosen provider (TBD per §11) and qualifies/routes incoming clients toward Facebook / WhatsApp; if the provider is still pending at this phase, the placeholder remains and the requirement carries the unresolved TBD into Phase 9 closure review.
**Plans**: TBD
**UI hint**: yes

### Phase 9: Cierre + Despliegue
**Goal**: The site is launch-ready and live. SEO + analytics + final QA across the 17 styles + Firebase Hosting deploy + Cloudflare DNS + GSD MCP wiring + Jira epics + cutover to the definitive domain.
**Depends on**: Phase 8
**Requirements**: (cross-cutting closure — verifies all REQs)
**Success Criteria** (what must be TRUE):
  1. SEO basics are in place: meta title and meta description on every view, a sitemap, structured data on per-client pages, and an M-level prerender for crawlers.
  2. GA4 analytics is wired with the agreed event taxonomy (market selection, size selection, gate completion, primary CTAs, scroll depth) — per the Phase 9 closure of TBD §11.
  3. Final QA passes the 17-style smoke: each of the 12 markets and each of the 5 sizes is exercised on Home / Servicios / Quiénes somos / Contacto / Cliente individual where they apply, with WCAG AA verified and ~600ms transitions intact (LOCKED-001, CON-013).
  4. The site is deployed via Firebase Hosting (Spark) + Cloudflare proxy + SSL to the definitive domain; redirects from any prior placeholder domain are configured.
  5. The push-to-deploy chain (`.claude/skills/deploy/SKILL.md`) is exercised end-to-end: stage → commit → push → type-check → build → `firebase deploy --only hosting`.
  6. GSD MCP is reachable from Claude Code in this checkout; nine epics for Phases 1–8 (or remaining work) exist in Jira project SIZE on cranialtrading.atlassian.net (board 100). CLAUDE.md carries the Definition-of-Done note referencing CON-013 plus the Atlassian token setup section.
  7. The Jira board reflects every Phase 1–9 ticket as Done with WCAG AA verified, and the project-level acceptance criteria in PROJECT.md are all satisfied in production.
**Plans**: 4 plans (carried from the original Setup phase — operational artifacts that only make sense once the design system ships)
  - [x] 09-01-PLAN.md — Firebase Hosting bootstrap (firebase-tools devDep, firebase.json SPA rewrite, .firebaserc, build smoke) — **already executed; artifacts are inert until Plan 09-04**
  - [ ] 09-02-PLAN.md — CLAUDE.md DoD + Atlassian token section, .mcp.json wiring GSD MCP to SIZE Jira
  - [ ] 09-03-PLAN.md — Author project-local deploy skill at .claude/skills/deploy/SKILL.md
  - [ ] 09-04-PLAN.md — First real deploy + GSD MCP verify + seed Jira epics + SEO/GA4/17-style QA + definitive domain cutover (will need expansion when planned — currently scoped only to first deploy + epics)
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Paridad prototipo | 4/4 | Complete | 2026-05-04 |
| 2. Tamaño M (Crafted) consolidado | 0/TBD | Not started | - |
| 3. Mercados sobre M | 0/TBD | Not started | - |
| 4. Tamaños S y L | 0/TBD | Not started | - |
| 5. Tamaño XS (Plain) | 0/TBD | Not started | - |
| 6. Tamaño XL (Unleashed) | 0/TBD | Not started | - |
| 7. Contenido | 0/TBD | Not started | - |
| 8. Integraciones | 0/TBD | Not started | - |
| 9. Cierre + Despliegue | 1/4 | Not started | - |
