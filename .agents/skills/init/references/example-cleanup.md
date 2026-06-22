# Starter Example Cleanup

Remove examples only after the user has understood them and explicitly approves the exact plan.

## 1. Inventory

Search tracked files and filenames for the connected demo identities and markers:

- Maya Chen
- Sam Rivera
- neighborhood reading club
- Northstar Tools
- Common Thread Studio
- Westborough University
- `fictional: true`
- `fictional starter example`
- `starter example`

Inspect results before changing anything. Do not use a blind global replacement.

## 2. Classify

### Demo-only files

Delete approved fictional notes and generated artifacts, normally including:

- the example journal entry;
- the Project Gutenberg example source;
- the tiny-community idea;
- the reading-club project;
- the Sam Rivera person note;
- the reading-club decision;
- Maya's career source;
- Maya CV Markdown, HTML, and PDF outputs.

Delete `00_Inbox/Start Here.md` only after the user has another capture note or explicitly wants an empty Inbox.

### Mixed files

Rewrite rather than delete:

- `Home.md`: remove demo links and leave the user's real current links or concise empty-state guidance.
- area notes: remove fictional project and CV references while preserving generic standards.
- `README.md`: remove statements and links claiming Maya artifacts are included if full cleanup was chosen.
- `.agents/skills/cv-generator/SKILL.md`: replace Maya-specific example paths with the user's canonical source, or generic `My Career Profile` paths.
- `90_System/CV/README.md` and `generate-cv.mjs`: replace Maya defaults with the user's source and output names. If no career profile exists, use generic `My Career Profile.md` and `My CV` defaults and explain that the user must create the source before generation.

Keep templates, agent safety rules, the CV generator, and generic area notes unless the user separately asks to remove those capabilities.

## 3. Preserve a Working Vault

Before deleting a demo note, remove or replace every inbound link. Do not leave `Home.md`, an area, a skill, or the CV generator pointing at missing files.

If the user supplied real onboarding context, create the agreed personal replacements first. If the user wants a clean empty vault, use short empty-state copy rather than invented personal content.

## 4. Verify

After cleanup:

1. Search tracked filenames and contents again for every demo identity and marker.
2. Confirm all wiki links resolve.
3. Confirm `Home.md` opens without fictional links.
4. Confirm the CV generator either targets an existing canonical source or gives a clear setup requirement.
5. Run `git status` and show the user the complete deletion and rewrite summary.

Do not commit or push the cleanup without separate explicit approval.
