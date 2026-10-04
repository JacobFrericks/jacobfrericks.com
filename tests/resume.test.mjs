// Tests for the generated résumé PDF and the page it is printed from. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const dist = (path) => new URL(`../dist/${path}`, import.meta.url);
const pdfPath = dist("jacob-frericks-resume.pdf");
const pdf = existsSync(pdfPath) ? readFileSync(pdfPath).toString("latin1") : "";
const resume = readFileSync(dist("hire/resume/index.html"), "utf8");
const hire = readFileSync(dist("hire/index.html"), "utf8");

test("the build produces the résumé PDF", () => {
  assert.ok(pdf.startsWith("%PDF-"), "dist/jacob-frericks-resume.pdf is missing or not a PDF");
});

test("the résumé fits on exactly one page", () => {
  const pages = pdf.match(/\/Type\s*\/Page(?![s\w])/g) ?? [];
  assert.equal(pages.length, 1);
});

test("the PDF embeds the site's own fonts", () => {
  for (const font of ["BarlowCondensed", "IBMPlexSans", "JetBrainsMono"]) {
    assert.match(pdf, new RegExp(`/FontName /[A-Z]+\\+${font}`), `${font} is not embedded`);
  }
});

test("the hire page offers the PDF as a download", () => {
  assert.match(hire, /<a[^>]*href="\/jacob-frericks-resume\.pdf"[^>]*download/);
});

test("the print page is kept out of search results and uses the same data", () => {
  assert.match(resume, /<meta name="robots" content="noindex"/);
  assert.match(resume, /Des Moines, IA · Open to remote/);
  for (const org of ["Hy-Vee", "Principal Financial Group", "IBM", "Iowa State University"]) {
    assert.match(resume, new RegExp(org));
  }
});
