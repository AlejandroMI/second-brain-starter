---
name: init
description: Guide a new owner through safely personalizing this second-brain starter, opening it in Obsidian, choosing initial areas and projects, and optionally creating and syncing a private GitHub repository. Use when the user invokes /init, $init, asks to initialize or onboard into the vault, or wants help setting up Obsidian and GitHub sync for this repository.
---

# Initialize Second Brain

Run a guided conversation. Optimize for a useful first session, not a complete life import.

## Rules

- Read `AGENTS.md`, `README.md`, and `Home.md` first.
- Explain each proposed change before making it.
- Ask one small group of questions at a time.
- Accept partial answers and skip anything the user does not want to store.
- Never request or store passwords, API keys, recovery codes, medical records, account numbers, or other secrets.
- Keep the repository private by default. Publishing requires a separate explicit decision.
- Do not delete fictional examples until the user has seen them and approves replacement or removal.
- Always offer example cleanup again after the user has completed the useful onboarding steps.
- Do not install software, create a remote repository, push, or change external state without explicit authorization.

## Onboarding Flow

### 1. Orient

Explain the folder model in plain language and show how the fictional source, project, person, decision, and journal entry connect. Ask whether the user wants to keep examples temporarily, archive them, or remove them after setup.

### 2. Learn the Minimum Useful Context

Ask for:

- preferred name and timezone;
- one current priority;
- one finishable project and its desired outcome;
- which ongoing areas matter now;
- preferred capture method: Obsidian, editor/agent, or both.

Make every question optional. Do not ask for a biography or bulk personal history.

### 3. Propose the First Changes

Propose a short file plan before editing. Usually:

- personalize `Home.md`;
- create one project from `90_System/Templates/Project.md`;
- update only the relevant area notes;
- create today's journal note only if the user wants daily capture;
- place unresolved material in `00_Inbox/`.

Preserve the information model and use vault-relative wiki links.

### 4. Configure Obsidian

If requested, follow `references/obsidian.md`. Verify whether Obsidian is already installed before suggesting installation. Do not require community plugins.

### 5. Configure Git and GitHub

If requested, follow `references/github-sync.md`. First explain that Git history is durable and that a private remote is not a substitute for careful privacy. Inspect Git state and authentication before proposing commands.

Require explicit approval before:

- creating a GitHub repository;
- adding or changing a remote;
- committing;
- pushing.

Never make the repository public during `/init`.

### 6. Connect an Agent

Explain that the vault works with Codex, OpenClaw, Claude Code, or another filesystem-capable agent. The durable contract is `AGENTS.md`; runtime personality and credentials stay outside the vault.

- For Codex: open this repository as the project, read `AGENTS.md`, and start with a read-only orientation or `$init`.
- For OpenClaw: use or expose the repository as the workspace and review workspace skills before enabling them.
- For any agent: grant minimum permissions and review diffs before commits.

### 7. Offer Example Cleanup

After the user understands the model and has at least one useful personal note or explicitly chooses an empty vault, ask what to do with the fictional starter material:

1. Keep it for now.
2. Remove the connected reading-club demo but keep the fictional CV workflow example.
3. Remove all fictional examples, including every Maya CV source and generated file.

If the user chooses removal, read and follow `references/example-cleanup.md`. Show the exact delete-and-rewrite plan first and require explicit approval. Cleanup must remove example references from mixed files, not merely delete the obvious notes.

### 8. Finish

Summarize:

- what was personalized;
- which fictional examples were kept or removed;
- whether Obsidian is ready;
- whether Git is initialized, committed, and synced;
- the next three low-friction actions.

End with one suggested request, such as: “Capture this thought…” or “Review my active project and suggest the next action.”
