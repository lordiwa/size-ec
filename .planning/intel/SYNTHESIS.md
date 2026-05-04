# Synthesis Summary — Project SIZE

Entry point for downstream consumers (`gsd-roadmapper`). Reads as a
human summary; per-type intel files hold the structured content.

Mode: new
Run date: 2026-05-03

---

## Inputs

- Classifications consumed: 1
- Source documents synthesized: 1
- Precedence applied: ADR > SPEC > PRD > DOC (default), with PRD-level
  override `precedence: 1` honoured for the SIZE design brief

### Doc counts by type
- PRD: 1
- SPEC: 0
- ADR: 0
- DOC: 0

### Source manifest
- ExistingData/SIZE-design-brief-v4.md — PRD, precedence 1,
  manifest-overridden, classifier confidence high

---

## Decisions

- LOCKED tier: 2
  - LOCKED-001 — Legibilidad WCAG AA en los 17 estilos (hoisted from §3)
  - LOCKED-002 — Estilos mutuamente excluyentes con un único flag de
    localStorage `{ type, value, updatedAt }` (hoisted from §3.bis)
- Accepted (non-locked): 10
  - DEC-001 Frontend stack (Vue 3 + Vite + Pinia + Vue Router + Tailwind + TS)
  - DEC-002 Hosting on Firebase Spark + Cloudflare proxy, prod-only
  - DEC-003 Firestore for persistence (+ Functions if needed)
  - DEC-004 Default visual M (Crafted) dark mode
  - DEC-005 Spanish only
  - DEC-006 XL stack via Three.js (`@tresjs/core`) + Phaser 3 + Tone.js
    + postprocessing + Cannon-es / Rapier, lazy-loaded
  - DEC-007 Self-hosted variable fonts, Latin subsets only
  - DEC-008 Kanban eternal sprint, Jira project SIZE via GSD MCP
  - DEC-009 Definition of Done includes WCAG AA verification
  - DEC-010 SEO and analytics deferred to Fase 9

## Requirements

- Total: 13
  - REQ-routes-five-views
  - REQ-style-gate
  - REQ-services-catalog (11 services)
  - REQ-markets-twelve (12 markets with services + base style)
  - REQ-sizes-five (XS / S / M / L / XL)
  - REQ-team-row (4 people × 5 photos × 5 comments)
  - REQ-clients-row-and-pages (3 initial clients)
  - REQ-home-rotating-words
  - REQ-contact-view-layout
  - REQ-contact-form-persistence
  - REQ-style-persistence
  - REQ-progressive-loading
  - REQ-xl-capability-detection

## Constraints

- Total: 13
- Type breakdown:
  - nfr (accessibility): CON-001 [LOCKED], CON-005, CON-011
  - nfr (performance): CON-003, CON-004, CON-012
  - nfr (compat): CON-006
  - schema (state shape) + protocol: CON-002 [LOCKED]
  - protocol: CON-007 [LOCKED, mirrors CON-002], CON-008, CON-009, CON-010, CON-013

## Context topics

- Total: 8
  - Brand & positioning
  - The 17-styles concept
  - Per-market style notes (12 markets detailed)
  - Creative-size personalities (5 sizes)
  - Agentic operating model (Developer / Researcher / QA / Strategist / PM)
  - View-by-view UX notes (5 views)
  - Cross-view style behaviour (level vs market scope)
  - Roadmap shape (Fase 0–9), open TBDs, gap-analysis priorities

---

## Conflicts

- BLOCKERS: 0
- WARNINGS (competing variants): 0
- INFO (auto-resolved): 1 — LOCKED-tier hoist of §3 / §3.bis from a
  PRD-class document, authorised by the classifier's `notes` field.

Detail: `.planning/INGEST-CONFLICTS.md`

---

## Pointers

- Decisions: `.planning/intel/decisions.md`
- Requirements: `.planning/intel/requirements.md`
- Constraints: `.planning/intel/constraints.md`
- Context: `.planning/intel/context.md`
- Conflicts report: `.planning/INGEST-CONFLICTS.md`
- Source classifications: `.planning/intel/classifications/`
- Source brief: `ExistingData/SIZE-design-brief-v4.md`

---

## Open items carried forward (for `gsd-roadmapper`)

These TBDs will need user input or downstream tickets before launch.
They are not synthesis blockers (the brief itself acknowledges them).

- Definitive domain (infra) — affects Fase 0 / Fase 8
- Corporate email (product) — affects Fase 7
- Social handles for Instagram / WhatsApp / Facebook — Fase 6/7
- Chatbot provider selection — Fase 7
- 20 team photos and 20 team comments (4 people × 5 sizes) — Fase 6
- Three client case write-ups (MMA El Valle, Cranial Trading, Sin-Cero) — Fase 6
- Final rotating-words list for Home — Fase 1 may ship with placeholders
- Analytics strategy + event taxonomy — Fase 8

Status: READY — safe to route. No blockers, no competing variants.
