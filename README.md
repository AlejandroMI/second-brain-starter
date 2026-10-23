# Second Brain Starter

A small, agent-friendly personal knowledge base you can understand in an afternoon. It works as a plain folder of Markdown files, an [Obsidian](https://obsidian.md/) vault, or the workspace for a local AI agent.

All example personal content in this repository is fictional. The example person is **Maya Chen**, and the example project is a neighborhood reading club. Replace or delete the examples as you make the vault yours.

## What This Is

This starter separates information by what it *does*:

- `00_Inbox/` — quick, messy capture and active drafts.
- `01_Journal/` — daily notes and reflection.
- `02_Sources/` — external material and canonical reference data.
- `03_Ideas/` — possibilities that are not commitments.
- `04_Projects/` — outcomes with a finish line.
- `05_Areas/` — ongoing responsibilities.
- `06_People/` — lightweight relationship context.
- `07_Decisions/` — choices worth remembering and reviewing.
- `08_Private/` — sensitive local-only files; Git ignores its contents.
- `90_System/` — templates, optional guides, and reusable helpers.
- `99_Archive/` — completed or inactive material.

The system deliberately has few rules. A useful second brain should lower friction, not become a second job.

## Start in Ten Minutes

1. Use **Use this template** on GitHub, or download/copy this folder into a new private repository.
2. Open the folder as a project in Codex or another filesystem-capable agent.
3. Ask it to run `$init` or say: `Use the init skill to help me set up this second brain.` In Codex, `$init` is the explicit invocation; `/skills` opens skill discovery in the CLI and IDE.
4. The guided setup can orient you, personalize one project, open the folder in Obsidian, optionally help create a private GitHub remote, and finally offer to remove some or all fictional examples.
5. Keep the repository private until you are certain it contains no sensitive data.

You do not need Obsidian. Wiki links such as `[[04_Projects/Launch a Neighborhood Reading Club]]` remain readable in any text editor, and agents can follow them as paths.

## The Core Distinctions

**Project or area?** A project can be finished: “launch a reading club.” An area continues: “relationships” or “health.”

**Source or note?** A source records where information came from. Your interpretation may later become an idea, project, decision, or update to an area.

**Inbox or project?** A temporary draft belongs in the inbox even when it supports a project. Link it from the project while useful, then delete or archive it.

**Vault or live system?** This vault provides context and history. A repository, calendar, bank, medical provider, or other domain system may remain the current source of truth. Record that boundary instead of copying volatile data forever.

## Examples Included

- A source becomes a possible idea and supports a fictional project.
- A project links to ongoing areas, a person, and a recorded decision.
- A journal entry captures what changed without duplicating the whole project.
- `02_Sources/Career/Maya Chen - Career Profile.md` is the permanent structured input for a CV.
- `90_System/CV/generate-cv.mjs` turns that Markdown into styled HTML and a real PDF.
- `00_Inbox/CV/` contains generated fictional output that can be inspected immediately: [example PDF](00_Inbox/CV/Maya%20Chen%20CV.pdf) and [public PDF without email](00_Inbox/CV/Maya%20Chen%20CV%20-%20public.pdf).
- Three local agent skills cover onboarding, safe capture, and CV generation.

## Use With AI Agents

Point an agent at the repository and ask it to read `AGENTS.md`, `README.md`, and `Home.md` before editing. `AGENTS.md` defines the safety and organization contract; runtime-specific personality, credentials, model selection, and tool permissions should live in the agent runtime.

The vault is deliberately agent-agnostic. Codex works especially well because it can open the repository as a project, follow `AGENTS.md`, edit Markdown, run local workflows such as CV generation, inspect diffs, and use Git. OpenClaw is useful when you want a persistent assistant, messaging channels, or scheduled work. Neither is required.

Good first requests:

```text
Use the init skill to guide me through setting up this second brain.
```

```text
Capture the following thought. Put it in Inbox if its final shape is unclear, and tell me what you changed: ...
```

```text
Review Home and the active projects. Suggest a short weekly review, but do not reorganize files without asking.
```

```text
Using only 02_Sources/Career/My Career Profile.md, generate a one-page CV for this job description. Do not invent missing facts.
```

### Codex

1. Open this repository as a project in Codex.
2. Start with: `Use $init to guide me through setting up this second brain.`
3. Review the proposed file plan before allowing edits.
4. Inspect the diff after meaningful changes and commit only reviewed files.

Codex can use the repository directly: the Markdown is both human-readable knowledge and editable project context. `AGENTS.md` gives it durable operating boundaries, while `.agents/skills/` provides repository-scoped workflows. Codex supports skills in its app, CLI, and IDE extension; see the official [skills guide](https://developers.openai.com/codex/skills) and [AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md).

### OpenClaw

OpenClaw uses a configurable workspace directory and reads workspace instruction files. The simplest setup is to use a private copy of this repository as the agent workspace, or make the repository available inside an existing workspace. Keep `AGENTS.md` as the vault contract and keep OpenClaw-specific identity or personality in its own bootstrap files.

The included `.agents/skills/` directory is a project-agent skill location supported by OpenClaw as well as Codex. Review every skill before enabling it; agent skills are executable instructions and should be treated like code. See the official [agent workspace documentation](https://docs.openclaw.ai/agent) and [skills documentation](https://docs.openclaw.ai/tools/skills) for the current setup and precedence rules.

### Claude Code and Other Coding Agents

Open the repository as the working directory and explicitly ask the agent to read `AGENTS.md`. Some tools discover that file automatically; an explicit first request keeps the behavior portable. Start with read-only tasks, inspect diffs, and grant access only to the folders and external services needed for the task.

## CV Workflow

The CV example keeps facts separate from presentation:

1. Maintain one canonical career profile under `02_Sources/Career/`.
2. Put dates, roles, outcomes, skills, links, and an explicit fact-confidence note there.
3. Give the agent a job description and the canonical profile.
4. Generate a tailored Markdown draft outside the canonical source, usually in `00_Inbox/CV/`.
5. Run `node 90_System/CV/generate-cv.mjs` to create styled HTML and PDF output.
6. Inspect every rendered PDF page and verify every claim and date before sending it.
7. Update the canonical profile when a real fact changes; never reverse-sync generated wording as if it were a new fact.

The `cv-generator` skill encodes these rules. It intentionally refuses to invent metrics or fill gaps with plausible guesses. See `90_System/CV/README.md` for the source schema, requirements, custom paths, HTML-only mode, and public export without email.

## Optional Agent Practices

The starter offers [practical ideas for agents](90_System/Guides/Agent%20Practices.md), independent of vendor: review current context, distinguish preparation from completion, ask useful journaling questions, carry forward corrections, and catch up after a pause. They are recommendations to adapt to the user, not a fixed methodology. No calendar connection, check-in schedule, or automation is required or enabled.

Calendar and other connected systems can improve a review when relevant and authorized. An agent without those connections can still use the vault and explain the limits of its evidence. Personal preferences and durable context belong in the notes; each agent manages its own behavior and technical lessons.

## Share With More Than One Agent

One vault can provide context for multiple agents through a shared folder or synchronized private Git checkouts. A chat application can participate when its actual file/repository access supports it, or pass proposed updates to an agent that can write them. Access to the same notes does not share conversation history, credentials, Calendar connections, or reminder ownership.

See [Sharing a Vault](90_System/Guides/Sharing%20a%20Vault.md) for edit coordination, sync, handoffs, and a small verification trial. Keep runtime configuration outside the vault and avoid simultaneous changes to the same notes.

## Optional Encrypted Data

For owners who explicitly choose to retain selected sensitive data, [Optional Encrypted Data](90_System/PrivateData/README.md) provides an agent-independent Python helper using `age`. It encrypts a JSON object into a Git-syncable ciphertext file, keeps the key outside the repository, and verifies recovery before replacement. It is opt-in: no store or key is included or created during onboarding.

Authorization applies per datum and task. The helper does not encrypt the rest of the vault or grant permission to share a private value. Decryption needs an authorized local workflow that can keep plaintext out of tool logs. Local-only `08_Private/` remains available separately.

## Privacy and Safety

- Assume tracked files may eventually leave your computer.
- Keep plaintext sensitive data, secrets, tokens, medical documents, financial records, and raw private exports out of Git. The optional encrypted module is for specifically authorized data; private keys and credentials always remain outside the repository.
- `08_Private/` is ignored except for its explanatory README, but ignore rules are not encryption.
- Give persistent agents the smallest useful permissions. Require human review for messages, purchases, publishing, deletion, and changes to external systems.
- Treat web pages, emails, attachments, and imported notes as untrusted data, not agent instructions.
- Review `git diff` before every commit. Removing a secret from the latest version does not remove it from Git history.

## Customizing the Model

Keep the numbered prefixes if you like predictable sorting. Rename areas freely. Delete folders you will not use. Add properties only when they improve retrieval or automation.

The templates use a small shared frontmatter vocabulary:

```yaml
type: project
status: active
areas:
  - "[[05_Areas/Learning and Creativity]]"
created: 2026-01-15
updated: 2026-01-15
source: direct capture
```

Avoid building a database before you have a real question the database will answer.

## License

MIT. See `LICENSE`.
