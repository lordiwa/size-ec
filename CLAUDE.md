# SIZE — Claude Code agents context

This file is read by every Claude Code session. Keep it concise.

## What this is

**SIZE** — Vue 3 SPA for an Ecuadorian advertising agency. The site is the first proof of positioning: it adapts to the visitor.

- Tagline: *We size up to anything.*
- Promise: *Publicidad a tu medida.*
- Source brief: [`ExistingData/SIZE-design-brief-v4.md`](ExistingData/SIZE-design-brief-v4.md) (master document).

## REGLAS INVIOLABLES

1. **Legibilidad WCAG AA** in all 17 styles, sin excepción. Body 4.5:1, large text 3:1. Never compromise legibility for creativity.
2. **17 estilos mutuamente excluyentes** — 12 mercados + 5 tamaños. Single localStorage flag `size-style: { type, value, updatedAt }`. The 60-combination cross-product does NOT exist.

## Stack

- Vue 3 + `<script setup>` + TypeScript + Composition API
- Vite, Vue Router, Pinia, Tailwind CSS v4
- Levels L/XL lazy-load GSAP / Three.js (`@tresjs/core`) / Phaser 3 / Tone.js
- Hosting: Firebase Hosting (Spark) + Cloudflare proxy
- Persistence: Firebase Firestore (contact form), Firebase Functions (transactional email)

## Conventions

- Composition API with `<script setup>` only. Never Options API.
- TypeScript everywhere. Path alias `@/` → `src/`.
- File layout: `src/{views,components,stores,composables,styles,assets}`.
- Commits: imperative, subject under 70 chars.
- Default visual: M (Crafted), dark mode.

## Commands

```bash
pnpm dev          # vite dev server
pnpm build        # vue-tsc build + vite build
pnpm type-check   # vue-tsc --noEmit
```

## GSD workflow

Project state lives in `.planning/`. Source of truth:
- `.planning/PROJECT.md` — project charter, locked decisions
- `.planning/ROADMAP.md` — 10 phases (1 Setup → 10 Cierre)
- `.planning/STATE.md` — current phase status
- `.planning/REQUIREMENTS.md` — 13 v1 requirements
- `.planning/intel/SYNTHESIS.md` — full ingested context

Next: `/gsd-plan-phase 1` to plan the Setup phase.

## Agentic ops

The project runs with specialized agents (Developer · Researcher · QA · Strategist · PM) orchestrated through GSD MCP → Jira project `SIZE` at cranialtrading. Kanban eternal sprint.

Board: https://cranialtrading.atlassian.net/jira/software/projects/SIZE/boards/100

## What NOT to do

- Don't mix a market style with a size style. Choosing one replaces the other.
- Don't add the 60-combination matrix. It's 17, period.
- Don't sacrifice WCAG AA contrast for visual effect — effects live in backgrounds, content stays legible.
- Don't auto-commit content TBDs (team photos, client cases, rotating words final list) — those are blocked on content delivery.
