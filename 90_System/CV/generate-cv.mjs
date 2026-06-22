#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const VAULT_ROOT = resolve(import.meta.dirname, "../..");
const DEFAULT_SOURCE = resolve(VAULT_ROOT, "02_Sources/Career/Maya Chen - Career Profile.md");
const DEFAULT_OUTPUT = resolve(VAULT_ROOT, "00_Inbox/CV/Maya Chen CV.pdf");
const DEFAULT_PUBLIC_OUTPUT = resolve(VAULT_ROOT, "00_Inbox/CV/Maya Chen CV - public.pdf");
const DEFAULT_HTML = resolve(VAULT_ROOT, "00_Inbox/CV/Maya Chen CV.html");
const DEFAULT_PUBLIC_HTML = resolve(VAULT_ROOT, "00_Inbox/CV/Maya Chen CV - public.html");

const args = parseArgs(process.argv.slice(2));
const sourcePath = resolve(args.source ?? DEFAULT_SOURCE);
const outputPath = resolve(args.out ?? (args.public ? DEFAULT_PUBLIC_OUTPUT : DEFAULT_OUTPUT));
const htmlPath = resolve(args.html ?? (args.public ? DEFAULT_PUBLIC_HTML : outputPath.replace(/\.pdf$/i, ".html") ?? DEFAULT_HTML));

const source = readFileSync(sourcePath, "utf8");
const cv = parseCv(source);
if (args.public) {
  delete cv.contact.email;
}
const html = renderHtml(cv).replace(/[ \t]+$/gm, "");

mkdirSync(dirname(htmlPath), { recursive: true });
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(htmlPath, html);

if (!args.htmlOnly) {
  const chrome = findChrome(args.chrome);
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${outputPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: "inherit" },
  );
  console.log(`Wrote ${outputPath}`);
}

console.log(`Wrote ${htmlPath}`);

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--source") parsed.source = argv[++i];
    else if (arg === "--out") parsed.out = argv[++i];
    else if (arg === "--html") parsed.html = argv[++i];
    else if (arg === "--chrome") parsed.chrome = argv[++i];
    else if (arg === "--public") parsed.public = true;
    else if (arg === "--html-only") parsed.htmlOnly = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node 90_System/CV/generate-cv.mjs [--public] [--html-only] [--source path] [--out path] [--html path] [--chrome path]");
      process.exit(0);
    }
  }
  return parsed;
}

function findChrome(explicitPath) {
  const candidates = [
    explicitPath,
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);

  const chrome = candidates.find((candidate) => existsSync(candidate));
  if (chrome) return chrome;

  throw new Error(
    "Chrome or Chromium was not found. Install one, set CHROME_PATH, pass --chrome /path/to/browser, or use --html-only.",
  );
}

function parseCv(markdown) {
  const body = markdown.replace(/^---[\s\S]*?---\s*/, "");
  const lines = body.split(/\r?\n/);

  return {
    contact: parseContact(section(lines, "## Contact and links", "## Profile summary")),
    profile: parseProfile(section(lines, "## Profile summary", "## Work experience")),
    experience: parseExperience(section(lines, "## Work experience", "## Education")),
    education: parseEducation(section(lines, "## Education", "## More about me")),
    more: parseMore(section(lines, "## More about me", "## Links")),
  };
}

function section(lines, start, end) {
  const startIndex = lines.findIndex((line) => line.trim() === start);
  if (startIndex === -1) return [];
  const endIndex = lines.findIndex((line, index) => index > startIndex && line.trim() === end);
  return lines.slice(startIndex + 1, endIndex === -1 ? lines.length : endIndex);
}

function parseContact(lines) {
  const values = {};
  for (const line of lines) {
    const match = line.match(/^- ([^:]+): (.+)$/);
    if (!match) continue;
    values[slug(match[1])] = parseInline(match[2]);
  }
  return {
    name: values.name?.text ?? "Your Name",
    email: values.email,
    linkedin: values.linkedin,
    website: values.website,
  };
}

function parseProfile(lines) {
  return parseSubsections(lines).map((item) => ({
    label: item.title,
    value: item.lines.join(" ").trim(),
  }));
}

function parseExperience(lines) {
  return parseEntries(lines).map((entry) => ({
    role: entry.title.split(",")[0].trim(),
    company: parseInline(entry.title.split(",").slice(1).join(",").trim()),
    dates: field(entry.lines, "Dates"),
    description: field(entry.lines, "Company description"),
    domains: splitList(field(entry.lines, "Domains")),
    technologies: splitList(field(entry.lines, "Technologies")),
    bullets: bullets(entry.lines),
  }));
}

function parseEducation(lines) {
  return parseEntries(lines).map((entry) => ({
    school: parseInline(entry.title),
    dates: field(entry.lines, "Dates"),
    qualification: field(entry.lines, "Qualification"),
    bullets: bullets(entry.lines),
  }));
}

function parseMore(lines) {
  return parseSubsections(lines).map((item) => ({
    label: item.title,
    value: item.lines.join(" ").trim(),
  }));
}

function parseEntries(lines) {
  const entries = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("### ")) {
      current = { title: line.replace(/^### /, "").trim(), lines: [] };
      entries.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return entries;
}

function parseSubsections(lines) {
  const entries = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("### ")) {
      current = { title: line.replace(/^### /, "").trim(), lines: [] };
      entries.push(current);
    } else if (current && line.trim()) {
      current.lines.push(line.trim());
    }
  }
  return entries;
}

function field(lines, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = lines.find((line) => line.match(new RegExp(`^\\*\\*${escaped}:\\*\\*`)));
  return match?.replace(new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*`), "").trim() ?? "";
}

function bullets(lines) {
  return lines.filter((line) => line.startsWith("- ")).map((line) => line.replace(/^- /, "").trim());
}

function splitList(value) {
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function parseInline(value = "") {
  const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  return link ? { text: link[1], href: link[2] } : { text: value, href: "" };
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderHtml(cv) {
  const wants = cv.profile.find((item) => item.label === "I want to work for a company that...");
  const profileLeft = cv.profile.filter((item) => item.label !== "I want to work for a company that...");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(cv.contact.name)} CV</title>
  <style>${styles()}</style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <h1>${escapeHtml(cv.contact.name)}</h1>
      <nav class="contact">
        ${contactLink(cv.contact.email, cv.contact.email?.text)}
        ${contactLink(cv.contact.linkedin, "LinkedIn")}
        ${contactLink(cv.contact.website, "My website")}
      </nav>
    </header>

    <section class="profile-grid" aria-label="Profile summary">
      <div class="profile-facts">
        ${profileLeft.map((item) => `
          <div class="fact">
            <div class="fact-label">${escapeHtml(item.label)}</div>
            <div class="fact-value">${escapeHtml(item.value)}</div>
          </div>`).join("")}
      </div>
      ${wants ? `
        <aside class="profile-statement">
          <h2>${escapeHtml(wants.label)}</h2>
          <p>${escapeHtml(wants.value)}</p>
        </aside>` : ""}
    </section>

    <section class="section">
      <h2>Work experience</h2>
      ${cv.experience.map(renderExperience).join("")}
    </section>

    <section class="section">
      <h2>Education</h2>
      ${cv.education.map(renderEducation).join("")}
    </section>

    <section class="section compact-section">
      <h2>More about me</h2>
      <div class="more-grid">
        ${cv.more.map((item) => `
          <div>
            <h3>${escapeHtml(item.label)}</h3>
            <p>${escapeHtml(item.value)}</p>
          </div>`).join("")}
      </div>
    </section>
  </main>
</body>
</html>`;
}

function renderExperience(job) {
  return `<article class="entry">
    <div class="entry-heading">
      <h3>${escapeHtml(job.role)}${job.company.text ? `, ${externalLink(job.company)}` : ""}</h3>
      <div class="dates">${escapeHtml(job.dates)}</div>
    </div>
    ${job.description ? `<p class="description">${escapeHtml(job.description)}</p>` : ""}
    ${job.domains.length ? `<p class="domains">${job.domains.map(escapeHtml).join(" · ")}</p>` : ""}
    ${job.technologies.length ? `<ul class="chips">${job.technologies.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
    ${job.bullets.length ? `<ul class="bullets">${job.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
  </article>`;
}

function renderEducation(item) {
  return `<article class="entry education">
    <div class="entry-heading">
      <h3>${externalLink(item.school)}</h3>
      <div class="dates">${escapeHtml(item.dates)}</div>
    </div>
    ${item.qualification ? `<p class="description">${escapeHtml(item.qualification)}</p>` : ""}
    ${item.bullets.length ? `<ul class="bullets">${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
  </article>`;
}

function contactLink(link, label) {
  if (!link?.text) return "";
  const href = link.href || (link.text.includes("@") ? `mailto:${link.text}` : "");
  return href ? `<a href="${escapeAttribute(href)}">${escapeHtml(label ?? link.text)}</a>` : `<span>${escapeHtml(label ?? link.text)}</span>`;
}

function externalLink(link) {
  if (!link?.href) return escapeHtml(link?.text ?? "");
  return `<a href="${escapeAttribute(link.href)}">${escapeHtml(link.text)}</a>`;
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replaceAll("\n", " ");
}

function styles() {
  return `
    @page {
      size: Letter;
      margin: 0.54in 0.58in 0.5in;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: #202326;
      background: #ffffff;
      font: 10.8px/1.38 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }

    a {
      color: #1f5f66;
      text-decoration: none;
    }

    h1,
    h2,
    h3,
    p,
    ul {
      margin: 0;
    }

    .page {
      max-width: 100%;
    }

    .hero {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 22px;
    }

    h1 {
      font-size: 23px;
      line-height: 1.05;
      font-weight: 720;
      color: #111315;
    }

    .contact {
      display: flex;
      gap: 18px;
      padding-top: 4px;
      white-space: nowrap;
      font-size: 10.2px;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
      gap: 34px;
      margin-bottom: 34px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e4e8e7;
    }

    .fact {
      display: grid;
      grid-template-columns: 92px 1fr;
      gap: 14px;
      margin-bottom: 10px;
    }

    .fact-label,
    .dates {
      color: #6d7477;
      font-weight: 620;
    }

    .fact-value {
      color: #2f3437;
    }

    .profile-statement h2 {
      margin-bottom: 4px;
      font-size: 11.3px;
      color: #1e3437;
    }

    .profile-statement p {
      color: #30383b;
    }

    .section {
      margin-top: 18px;
    }

    .section > h2 {
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 1.15;
      color: #111315;
    }

    .entry {
      break-inside: avoid;
      margin-bottom: 17px;
    }

    .entry-heading {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: baseline;
      gap: 18px;
      margin-bottom: 2px;
    }

    .entry h3 {
      font-size: 12px;
      line-height: 1.28;
      font-weight: 700;
      color: #151819;
    }

    .description {
      margin-top: 2px;
      color: #3f4548;
    }

    .domains {
      margin-top: 3px;
      color: #566063;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
      padding: 0;
      list-style: none;
    }

    .chips li {
      padding: 2.5px 7px 3px;
      border-radius: 4px;
      background: #edf3f2;
      color: #243b3f;
      font-size: 9.6px;
      line-height: 1.2;
    }

    .bullets {
      margin-top: 8px;
      padding-left: 14px;
    }

    .bullets li {
      margin-bottom: 3.2px;
      padding-left: 2px;
    }

    .education {
      margin-bottom: 18px;
    }

    .compact-section {
      break-inside: avoid;
    }

    .more-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 34px;
    }

    .more-grid h3 {
      margin-bottom: 3px;
      font-size: 11.5px;
      color: #151819;
    }

    .more-grid p {
      color: #30383b;
    }
  `;
}
