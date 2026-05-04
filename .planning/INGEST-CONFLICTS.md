## Conflict Detection Report

Mode: new
Sources synthesized: 1
  - ExistingData/SIZE-design-brief-v4.md (PRD, precedence 1, manifest-overridden)

Precedence ordering: ADR > SPEC > PRD > DOC (default), with the per-doc
override `precedence: 1` honoured for the SIZE design brief.

---

### BLOCKERS (0)

No LOCKED-vs-LOCKED contradictions, no unresolved low-confidence
classifications, no cycles in the cross-ref graph. Single-source
ingest cannot produce inter-doc blockers.

---

### WARNINGS (0)

No competing acceptance variants. With a single source PRD, there is
no requirement-level overlap to reconcile.

---

### INFO (1)

[INFO] LOCKED-tier hoist from PRD-class document
  Found: ExistingData/SIZE-design-brief-v4.md is classified as PRD with
    precedence 1 and `locked: false` at the file level.
  Note: §3 "REGLA INVIOLABLE — Legibilidad" (WCAG AA contrast 4.5:1
    body / 3:1 large in all 17 styles) and §3.bis "REGLA INVIOLABLE —
    Estilos mutuamente excluyentes" (12 markets + 5 sizes = 17 styles,
    mutually exclusive, single-flag persistence shape
    `{ type, value, updatedAt }`) carry the explicit user-pinned LOCKED
    designation per the classifier note. Both rules were hoisted to the
    LOCKED tier of `decisions.md` (LOCKED-001 and LOCKED-002) and are
    mirrored as constraints CON-001, CON-002, CON-007 in `constraints.md`.
  source: ExistingData/SIZE-design-brief-v4.md (§3, §3.bis)
  source: .planning/intel/classifications/SIZE-design-brief-v4-a3f2b8e1.json (notes field)
  Rationale: The classifier's `notes` explicitly authorised the
    synthesizer to promote those two inline rules despite the host
    doc's PRD class. No source contradicts them, so the hoist is
    auto-resolved rather than requiring user adjudication.
