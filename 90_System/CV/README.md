# CV Generator

This reusable workflow turns a canonical Markdown career profile into styled HTML and a real PDF. The included source and outputs are entirely fictional.

## Files

- Source: `02_Sources/Career/Maya Chen - Career Profile.md`
- Generator: `90_System/CV/generate-cv.mjs`
- Default outputs: `00_Inbox/CV/Maya Chen CV.html` and `00_Inbox/CV/Maya Chen CV.pdf`

## Requirements

- Node.js 20 or newer
- Google Chrome or Chromium

The script checks common macOS, Linux, and Windows locations. If needed, set `CHROME_PATH` or pass `--chrome`.

## Generate

From the vault root:

```bash
node 90_System/CV/generate-cv.mjs
```

Generate a public copy without the email address:

```bash
node 90_System/CV/generate-cv.mjs --public
```

Generate only HTML when Chrome is unavailable:

```bash
node 90_System/CV/generate-cv.mjs --html-only
```

Use another canonical source or output:

```bash
node 90_System/CV/generate-cv.mjs \
  --source "02_Sources/Career/My Career Profile.md" \
  --out "00_Inbox/CV/My CV.pdf"
```

## Source Contract

The parser expects these exact second-level headings:

- `## Contact and links`
- `## Profile summary`
- `## Work experience`
- `## Education`
- `## More about me`
- `## Links`

Use the Maya source as the schema example. Each experience or education entry starts with `###`; metadata uses bold labels such as `**Dates:**`; achievements are Markdown bullets.

Keep generated drafts in `00_Inbox/CV/` while iterating. Update facts only in the canonical source, then regenerate. Verify the final PDF visually before sending or publishing it.
