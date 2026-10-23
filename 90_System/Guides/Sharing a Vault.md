# Sharing a Vault Between Agents

The Markdown vault is shared durable context. Each agent keeps its own identity, credentials, tool permissions, session state, and schedules outside it. You can use one agent for conversation and another for local work without migrating your knowledge into either runtime.

## Choose How Each Agent Gets Access

- **Same computer:** filesystem-capable agents can open the same repository folder. Point each at `AGENTS.md`, `README.md`, and `Home.md`. Let one agent finish writing before another edits the same files.
- **Different computers:** use separate checkouts of a private Git remote. Sync reviewed changes so another agent sees them. A local uncommitted edit is not available on another computer.
- **Connected chat:** a conversation in ChatGPT or another chat application can participate through whatever repository or file access is actually available in that session. Ask it to check whether it can read the current files and whether it can write changes back. If access is read-only, have it produce a proposed update for a filesystem-capable agent to apply. An uploaded snapshot is a dated copy, not live sync.
- **Persistent assistant:** an assistant such as Hermes can use an accessible checkout as context while owning its messaging and schedules separately. Follow that runtime's current setup instructions. Do not assume it discovers this repository's instructions or skills automatically; verify that it reads them.

Giving two agents the same vault does not share their conversation histories, tool connections, or permissions. Each needs its own authorized access. Share useful durable context through notes instead of copying entire chats or authentication state.

## Coordinate Edits and Git Sync

Before editing, check the branch, remotes, worktree status, and whether local changes belong to someone else. On a clean checkout, pull/reconcile the intended shared branch before meaningful work. Do not rebase another agent's unfinished work or stash it without agreement.

Prefer one writer at a time for overlapping notes and especially for encrypted data. Independent changes can be made on separate branches, reviewed, and merged. Do not use a timestamp alone to decide which account is true: read both changes, preserve useful provenance, and resolve conflicting facts from their sources. Re-read files before writing if another agent may have changed them.

After an authorized change, review the diff and commit only intended files. Push when authorized, then have the other checkout sync and verify it can read the update. Do not treat "saved locally" as "shared." Avoid force pushes or silently overwriting notes to clear a conflict.

## Divide Responsibilities Without Duplicating Context

A conversational agent might capture a reflection while another checks a project repository. Keep personal motivation, decisions, and pointers in the vault; keep the technical backlog in its repository. Avoid separate copies of the same project status or people index.

For proactive support, choose one owner per reminder or routine. A migration is complete only after the previous owner is disabled and the replacement's actual execution and delivery are verified. Do not turn on a replacement simply because the old agent seems quiet.

## Check the Arrangement With a Small Task

One possible trial is to capture a fictional update through one agent, sync it, and ask the second to find it and explain its source. If Calendar access is part of the setup, check an existing event before authorizing a change. If reminders are desired, verify one agreed reminder rather than installing a whole routine.

Encrypted data requires additional explicit authorization and a securely provisioned key on each authorized device. Repository access alone does not grant decryption or permission to use a private value. See [Optional Encrypted Data](../PrivateData/README.md).
