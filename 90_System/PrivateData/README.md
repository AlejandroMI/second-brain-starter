# Optional Encrypted Data

Use this module only if the owner chooses to keep specific sensitive data in an encrypted, Git-synced JSON file. It is independent of agent vendor and requires Python 3.9+ and the `age` / `age-keygen` executables. No key, encrypted store, or real private data ships with this starter.

`08_Private/` remains a separate local-only option. Ignore rules are not encryption. This module protects the store against someone obtaining the repository without its key; it does not encrypt other notes, Git history, chat messages, or an authorized device's memory. An agent that can access the key can decrypt the store.

## Consent and Access

- Store a sensitive datum only with the owner's explicit authorization for that datum. Do not scan or encrypt the rest of the vault as a side effect.
- Read only what is needed for the authorized task. Permission to retain or retrieve a value is not permission to send it to a third party.
- Keep private keys and credentials outside the repository. Never put them in notes, command arguments, chat, tool logs, or exported files.
- The helper prints a requested field to stdout. Agents should capture it in memory without echoing it into tool transcripts. If a runtime cannot prevent plaintext logging, do not decrypt there; use a suitable local workflow instead.

## First Setup

Choose a key location outside the vault. On a POSIX system, for example:

```bash
mkdir -p ~/.config/second-brain
chmod 700 ~/.config/second-brain
age-keygen -o ~/.config/second-brain/age-key.txt
chmod 600 ~/.config/second-brain/age-key.txt
```

Use these commands only for a new key; do not replace a key needed by an existing store. Keep a separate secure backup, such as a password manager. Losing every copy loses access. `SECOND_BRAIN_KEY` can select another key-file path; use a distinct key per independent vault. The helper rejects a key inside the repository and, on POSIX, a key readable by other users. On Windows, restrict access with the platform's file permissions.

The following uses **fictional** data to illustrate initialization from the vault root:

```bash
printf '%s' '{"example_reference":"FICTIONAL-000"}' | python3 90_System/PrivateData/private-data.py init
python3 90_System/PrivateData/private-data.py read example_reference
```

For real data, feed the complete JSON object through stdin from a workflow that does not log or retain its plaintext. Do not substitute real values into a shell command, save them to a temporary JSON file, or paste them into a recorded tool call. The example commands are for a disposable test vault; `init` refuses to overwrite an existing store.

The helper encrypts and verifies recovery in memory before creating `private-data.json.age`. Review and commit only ciphertext and nonsensitive instructions, when authorized. The helper does not commit or sync files. Ignore rules exclude common plaintext copies and key filenames, but they cannot catch every secret under an arbitrary name.

## Read and Update

`read FIELD` returns only that top-level field as JSON. There is intentionally no whole-store read command. The output can still be sensitive and must not be logged.

`write` replaces the **complete object**, supplied through stdin, after proving the current key can decrypt the existing store. For an update, reconcile Git first, read/decrypt the current object in memory in an authorized local process, preserve existing fields, apply only the authorized change, and pass the replacement through stdin. To inspect the complete current object within that process, the underlying command is `age --decrypt --identity KEY_PATH private-data.json.age`; capture stdout privately rather than displaying it. The helper cannot infer whether a missing field was an intentional deletion.

Invalid JSON, a missing key, or a wrong key fails without replacing the store. Successful writes use a verified ciphertext temporary file and atomic replacement. Serialize updates: atomic replacement prevents a partial file but does not merge two writers' changes. For simultaneous devices, sync and take turns before reading and writing.

## Another Device or a Conflict

Provision the existing key securely on each authorized device, outside its checkout, and set restrictive permissions. A newly generated key will not decrypt the existing store. Sharing a Git remote does not distribute the key or authorize every agent to use it.

For a ciphertext merge conflict, preserve both versions and stop ordinary writes. In an authorized local process, decrypt each version with the appropriate key, reconcile the intended fields, and encrypt/verify the resolved object. Do not blindly choose ours/theirs or expose the decrypted versions to logs. Key rotation and multi-recipient access need a separate planned migration; this helper does not implement them.

## Verification

The tests use disposable vaults, generated test keys, and fictional values:

```bash
python3 -m unittest discover -s 90_System/PrivateData/tests -v
```
