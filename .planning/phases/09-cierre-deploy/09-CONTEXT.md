# Phase 1: Setup — Context

**Gathered:** 2026-05-03
**Status:** Ready for planning
**Source:** /gsd-discuss-phase 1

<domain>
## Phase Boundary

Infrastructure plumbing exists so that:

1. The Vue 3 + Vite shell is deployable to Firebase Hosting (Spark plan).
2. The agentic team can invoke a single, idempotent **deploy skill** that runs commit → push → type-check → build → `firebase deploy` in one chain.
3. The GSD MCP server is wired to the SIZE project on Atlassian (board 100), so any agent in this repo can read/write Jira tickets without per-session re-config.
4. Initial Jira epics are seeded (one per remaining roadmap phase, 2–10).
5. The repo's root-level `CLAUDE.md` carries the Definition-of-Done references (WCAG AA + 60-combo invariant from CON-013).

In scope: Firebase project creation, `firebase init hosting`, deploy-skill authoring, `.mcp.json` wiring, env-var documentation, epic seeding, GitHub remote setup, smoke deploy.

Out of scope: Definitive domain registration (TBD per PROJECT.md), Cloudflare DNS/proxy wiring (deferred to whenever the definitive domain lands), CI/CD workflows in `.github/workflows/` (replaced by the deploy skill), staging environment (production-only per brief §8).

</domain>

<decisions>
## Implementation Decisions

### Deploy mechanism — project-local Claude Code skill, not GitHub Actions

**Decision:** Author a project-local Claude Code skill at `.claude/skills/deploy/SKILL.md` that chains, in order:

1. `git add -A && git commit -m "<message>"` (skill takes a commit message argument)
2. `git push origin <current-branch>`
3. `pnpm type-check` (must pass — abort on failure)
4. `pnpm build` (must pass — abort on failure)
5. `firebase deploy --only hosting` (publishes `dist/` to Firebase Hosting)

The skill is the canonical "push-to-deploy" flow for both human and agent operators. It supersedes the brief's literal "push to main → deploy" success criterion (§10 Fase 0) without losing the property: invoking the skill IS the push-and-deploy in one operation.

**Why not GitHub Actions:** Operator preference (user already runs `pnpm build && firebase deploy` manually on other projects); a skill makes that explicit, agent-callable, and gates type-check + build before publishing.

**Why not raw manual:** Without the skill, "push to main → deploy" is undocumented and not agent-invokable.

### Pre-deploy gates (inside the skill, before `firebase deploy`)

**Locked:** Type-check (`pnpm type-check` via `vue-tsc --noEmit`) and successful build (`pnpm build`).

**Not enforced:** Built-output smoke checks; git-clean-after-commit guard. Both deferred (can be added later if drift is observed).

### Placeholder domain — Firebase default

**Decision:** Phase 1 uses the Firebase default URL `<project-id>.web.app` (and `<project-id>.firebaseapp.com`). No Cloudflare proxy wiring in Phase 1.

**Why:** Definitive domain is TBD in PROJECT.md and not blocking. Firebase default is free, instant, SSL-ready. Cloudflare wiring properly belongs to the phase that resolves the domain TBD (likely Phase 10 Cierre, or whenever the user picks a domain).

**Implication for ROADMAP:** Phase 1 success criterion #1 is interpreted as "reachable at the Firebase default URL". Cloudflare proxy + SSL are deferred to a later phase and tracked as a STATE.md open item.

### GSD MCP → Jira wiring

**Decision:** Commit a project-level `.mcp.json` that registers the GSD MCP server for the SIZE Jira project at `cranialtrading.atlassian.net`. The Atlassian API token is referenced via the env var `ATLASSIAN_API_TOKEN` (or whatever GSD MCP expects — the planner / researcher confirms the canonical name) so the secret never lands in git.

**Why:** Project-level config makes every Claude Code session in this checkout connect to Jira automatically — required for the agentic team. Env-var token keeps the secret per-machine.

**Documentation duty:** `CLAUDE.md` gets a short "Atlassian API token setup" section (where to generate, which env var to set, how to verify with a test MCP call).

### Jira epic seeding (already locked by ROADMAP §Phase 1 success criterion #2)

**Decision:** Nine epics, one per remaining roadmap phase (Phase 2 Sistema base → Phase 10 Cierre). Each epic carries the phase goal as its description. Created via the GSD MCP once the wiring above is verified.

### Definition-of-Done note

**Decision:** Lives in `CLAUDE.md` at repo root (already written during scaffold). It already references LOCKED-001 (WCAG AA) and LOCKED-002 (mutually-exclusive 17 styles). Phase 1 work: confirm it also points to CON-013 (60-combo smoke / 17-style smoke per the LOCKED-002 reading) and add an Atlassian-token setup section.

### Claude's Discretion

- Exact `firebase.json` rewrites/headers config — researcher/planner picks defaults that work for a Vue Router SPA (catch-all to `index.html`, sane caching headers).
- Exact GSD MCP config schema in `.mcp.json` — researcher confirms by reading the GSD MCP docs / existing MCP config conventions.
- Whether `firebase-tools` is added as a `devDependency` or expected as a global install — planner picks; recommendation is `devDependency` so `pnpm dlx firebase deploy` works without global state.
- Skill argument shape (positional commit message vs `--message`) — planner authors per Claude Code skill conventions.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before researching or planning.**

### Source brief
- `ExistingData/SIZE-design-brief-v4.md` — master document. Specifically: §8 (stack), §9 (agentic ops + Jira), §10 (phased roadmap, Phase 1 = "Fase 0 Setup"), §13.15 (CLAUDE.md / AGENTS.md).

### Project planning
- `.planning/PROJECT.md` — project charter, locked decisions LOCKED-001 / LOCKED-002, Phase 1 acceptance criteria.
- `.planning/REQUIREMENTS.md` — 13 v1 requirements (none owned by Phase 1; foundation phase).
- `.planning/ROADMAP.md` — Phase 1 section (lines 30–40) for goal + success criteria.
- `.planning/intel/decisions.md` — 12 synthesized decisions with their LOCKED status.
- `.planning/intel/constraints.md` — 13 constraints; CON-013 = 60-combo smoke gate referenced by Phase 1 success criterion #4.

### Project conventions
- `CLAUDE.md` — root-level agent context; DoD note + reglas inviolables. Phase 1 augments this.

### External (researcher fetches)
- Firebase Hosting Spark plan docs — quotas, deploy commands, default domain behavior, headers config.
- `firebase-tools` CLI reference — `firebase init hosting`, `firebase deploy --only hosting`, login flow.
- Claude Code skill authoring docs — `SKILL.md` shape, argument conventions, project-local skill discovery.
- `.mcp.json` schema — fields, env-var interpolation, GSD MCP server registration.
- Atlassian Cloud API tokens — generation URL, scope, expiry behavior.

</canonical_refs>

<code_context>
## Reusable Assets and Patterns

**Already in repo (from scaffold commit):**
- `package.json` — `pnpm dev`, `pnpm build`, `pnpm type-check` already wired.
- `vite.config.ts`, `tsconfig.{,app,node}.json` — TS-strict-ish setup with `@/` alias.
- `src/{main.ts,App.vue,router/index.ts,stores/style.ts,components/*,views/*}` — full route tree, sticky footer, single-flag style store, gate component, 5 views + 404.
- `CLAUDE.md` — root-level agent context with reglas inviolables and stack notes.
- Git repo at `main` with two commits: `6eebad5` (ingest .planning/) + `<scaffold sha>` (Vue scaffold).

**Not yet present (Phase 1 creates):**
- `firebase.json`, `.firebaserc` — Firebase project config.
- `.mcp.json` at repo root — GSD MCP server registration.
- `.claude/skills/deploy/SKILL.md` — the deploy skill.
- `firebase-tools` in `devDependencies`.
- GitHub remote (origin) — `git remote -v` is currently empty.
- Nine Jira epics in the SIZE project.

</code_context>

<specifics>
## Specific Ideas

- Skill name: `deploy` (project-local). Discovery path `.claude/skills/deploy/SKILL.md`.
- Skill chain order is non-negotiable: commit → push → type-check → build → deploy. Failure at type-check or build aborts before any external publish.
- `firebase.json` must include a Vue Router catch-all rewrite so deep links work: rewrites all paths to `/index.html`.
- `.mcp.json` env-var interpolation pattern: `"ATLASSIAN_API_TOKEN": "${env:ATLASSIAN_API_TOKEN}"` (researcher confirms exact GSD MCP shape).
- Jira board reference: `https://cranialtrading.atlassian.net/jira/software/projects/SIZE/boards/100`.
- Initial epic titles: copy phase names from ROADMAP.md (e.g., "Phase 2: Sistema base", "Phase 3: Tamaño M (Crafted) y default visual", …, "Phase 10: Cierre").
- Each epic description: copy the **Goal** sentence from ROADMAP.md for the corresponding phase.

</specifics>

<deferred>
## Deferred Ideas

- Cloudflare DNS / proxy wiring + SSL via Cloudflare → wait for definitive domain (likely Phase 10 Cierre).
- GitHub Actions deploy workflow → not required given the deploy skill; revisit only if multi-developer concurrency or PR previews become valuable.
- PR preview channels via Firebase Hosting → tied to the GitHub Actions decision above; deferred.
- Definitive domain registration → tracked in PROJECT.md "open items" / STATE.md blockers.
- Built-output smoke check inside the deploy skill (e.g., grep `dist/index.html` for `SIZE`) → add only if a future regression motivates it.
- "Block deploy on uncommitted changes" guard → same; add if drift is observed.
- Staging environment → out of scope per brief §8 ("solo ambiente de producción").
- Email transactional infra (Firebase Functions, corporate email creation) → owned by Phase 9 Integraciones.
- SEO meta / sitemap / structured data / GA4 → owned by Phase 10 Cierre.

</deferred>

---

*Phase: 09-cierre-deploy*
*Context gathered: 2026-05-03 via /gsd-discuss-phase*
