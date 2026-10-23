---
name: second-brain
description: Safely capture, classify, link, review, and archive notes in this Markdown second brain.
---

# Second Brain

Use this skill when the user asks to capture, organize, review, or update knowledge in this vault.

## Required Context

Read `{baseDir}/../../../AGENTS.md`, `{baseDir}/../../../README.md`, and `{baseDir}/../../../Home.md` before editing. Then read the target note and its directly relevant links.

## Workflow

1. Identify whether the input is a moment, source, idea, finishable outcome, ongoing area, person context, decision, or still unclear.
2. If unclear, create or update an Inbox note. Do not force classification.
3. Reuse an existing note when it is the same entity or outcome.
4. Add the smallest number of links that improve continuity.
5. Preserve provenance and uncertainty.
6. Update `Home.md` only when the user's current focus actually changes.
7. Summarize edits and mention any assumptions.

## Optional Approaches

For review, reflection, follow-up, or catch-up requests, consult [Agent Practices](../../../90_System/Guides/Agent%20Practices.md) when helpful. Adapt the approach to the user and available evidence; a simple capture does not need a review or questionnaire. Do not install routines or require Calendar access as part of this skill.

If several agents share the vault, [Sharing a Vault](../../../90_System/Guides/Sharing%20a%20Vault.md) covers access and edit coordination. For explicitly requested sensitive-data storage or retrieval, consult [Optional Encrypted Data](../../../90_System/PrivateData/README.md) before accessing a store. These references do not grant access or authorization.

## Guardrails

- Do not access `08_Private/` without explicit scope.
- Do not invent facts or silently convert an idea into a commitment.
- Do not create new folder layers, taxonomies, dashboards, or status systems without user approval.
- Do not copy volatile external data when linking to its source of truth is sufficient.
- Draft first; require explicit approval before publishing, messaging, deleting, or changing external systems.
