---
name: cv-generator
description: Generate and verify a factual tailored CV, resume, or bio from a canonical Markdown career profile, including styled HTML and PDF output through the vault's CV renderer. Use for career-profile maintenance, role tailoring, CV generation, public versions without email, or Markdown-to-PDF CV export.
---

# CV Generator

## Inputs

- A canonical career profile under `02_Sources/Career/`.
- The target role, job description, audience, or requested output.
- Optional length, language, tone, and format constraints.

## Workflow

1. Read `AGENTS.md` and the entire canonical career profile.
2. Treat the job description as selection context, not as evidence about the person.
3. Build a private claim checklist mapping each output claim to a fact in the profile.
4. Select and reorder relevant facts. Preserve meaning while improving clarity and concision.
5. If a required fact is missing or contradictory, flag it. Do not guess.
6. Preserve the source schema described in `90_System/CV/README.md`.
7. Write the tailored canonical-format draft to `00_Inbox/CV/` unless the user specifies another destination.
8. Run `node 90_System/CV/generate-cv.mjs` with explicit `--source` and output paths when using a tailored draft.
9. For a public version, use `--public` to omit email.
10. Render the resulting PDF to images and inspect every page for clipping, awkward page breaks, overlaps, tiny text, broken glyphs, and excess whitespace.
11. Extract PDF text as a secondary check that expected sections and claims are present.
12. Link the draft to the canonical profile and remind the user to verify it before sending or publishing.

## Forbidden

- Inventing metrics, employers, dates, titles, qualifications, clients, awards, tools, or testimonials.
- Upgrading proficiency words without evidence.
- Adding job-description requirements as if the person possesses them.
- Overwriting the canonical profile with generated prose.
- Presenting inferred claims as verified facts.
- Treating generated HTML or PDF output as a canonical source.

## Example

Input: `02_Sources/Career/Maya Chen - Career Profile.md`

Generator: `90_System/CV/generate-cv.mjs`

Outputs: `00_Inbox/CV/Maya Chen CV.html` and `00_Inbox/CV/Maya Chen CV.pdf`
