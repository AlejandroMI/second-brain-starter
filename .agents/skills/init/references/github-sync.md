# Private GitHub Sync

## Preflight

1. Run `git status` and inspect the current branch and remotes.
2. Inspect tracked files for obvious secrets or personal material the user did not intend to sync.
3. Confirm that `08_Private/` contents and local environment files are ignored.
4. Check GitHub authentication with the available GitHub integration or `gh auth status`.

## First Sync

Explain the actions, then ask for explicit approval before external changes.

Typical GitHub CLI flow:

```bash
git add .
git commit -m "Initialize second brain"
gh repo create <repository-name> --private --source=. --remote=origin --push
```

If the remote already exists:

```bash
git push -u origin main
```

Do not run these commands blindly. Adapt to the current Git state, existing history, branch name, remote, authentication, and user preference.

## Ongoing Sync

Before work:

```bash
git pull --rebase
```

After a coherent change:

```bash
git status
git diff
git add <reviewed-files>
git commit -m "Describe the knowledge update"
git push
```

Do not commit private exports, secrets, or files merely because they exist. Never rewrite shared history or resolve conflicts destructively without the user's informed approval.
