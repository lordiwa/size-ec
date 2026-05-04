# Phase 1: Setup — Discussion Log

**Date:** 2026-05-03
**Mode:** /gsd-discuss-phase (default, no flags)

This log is for human reference (audits, retrospectives). Downstream agents (researcher, planner, executor) consume `01-CONTEXT.md`, not this file.

---

## Areas presented (4 candidates)

User selected all 4:

1. Deploy mechanism
2. Placeholder domain strategy
3. GSD MCP → Jira wiring
4. CI scope on push to main

---

## Area 1 — Deploy mechanism

**Q1:** How should `git push main` reach Firebase Hosting?
**Options offered:**
- A. GitHub Actions + FirebaseExtended/action-hosting-deploy (Recommended)
- B. Firebase Hosting native GitHub integration
- C. Manual `firebase-tools` deploy

**User answer:** "i normally do a npm run build and firebase deploy on my other projects" — preference for manual flow.

**Q2 (follow-up):** Manual conflicts with ROADMAP §Phase 1 SC #1 ("push to main → deploy"). How to reconcile?
**Options offered:**
- A. Amend ROADMAP — manual deploy is the answer
- B. Keep CI but make it match the manual habit (Recommended)
- C. Both — manual now, CI in Phase 10

**User answer:** "create a deploy skill that commits pushes builds deploys"

**Decision captured:** Project-local Claude Code skill at `.claude/skills/deploy/SKILL.md` that chains commit → push → type-check → build → `firebase deploy`. The skill IS the push-to-deploy flow for both humans and agents.

---

## Area 2 — Placeholder domain

**Q1:** What domain do we point at while the definitive domain is still TBD?
**Options offered:**
- A. Firebase default `<project-id>.web.app` (Recommended)
- B. Cloudflare-proxied subdomain on a domain you already own
- C. Buy the definitive domain in Phase 1 instead of leaving it TBD

**User answer:** A — Firebase default for Phase 1.

**Decision captured:** Firebase default URL during Phase 1. Cloudflare wiring deferred until the definitive domain is chosen.

---

## Area 3 — GSD MCP → Jira wiring

**Q1:** Where does the GSD MCP → Jira config live, and how do we handle the Atlassian API token?
**Options offered:**
- A. Project-level `.mcp.json` + token in user env var (Recommended)
- B. User-level config only
- C. Both — project default with user-override

**User answer:** A — project `.mcp.json` committed; token via env var.

**Decision captured:** `.mcp.json` at repo root references the Atlassian token via env var (e.g. `${env:ATLASSIAN_API_TOKEN}`); secret stays per-machine.

---

## Area 4 — CI scope (recast as deploy-skill gates)

**Q1:** What gates run inside the deploy skill before `firebase deploy` actually fires?
**Options offered (multiSelect):**
- A. `pnpm type-check` (Recommended)
- B. `pnpm build` must succeed (Recommended)
- C. Smoke check `dist/index.html` for "SIZE"
- D. Block deploy on uncommitted changes after the auto-commit step

**User answer:** A + B.

**Decision captured:** Pre-deploy gates are type-check + build. Smoke check and clean-tree guard deferred.

---

## Deferred ideas surfaced during discussion

- Cloudflare DNS/proxy wiring → wait for definitive domain.
- GitHub Actions deploy workflow → unnecessary given the skill.
- PR preview channels → tied to GH Actions decision; deferred.
- Built-output smoke check → reconsider if regressions appear.
- Clean-tree guard inside skill → same.

---

## Claude's discretion (planner / researcher decides)

- `firebase.json` rewrites/headers (Vue Router SPA defaults).
- `firebase-tools` install location (devDependency vs global).
- Skill argument shape (positional vs flag).
- Exact `.mcp.json` schema for GSD MCP server registration (researcher confirms).

---

*End of discussion log.*
