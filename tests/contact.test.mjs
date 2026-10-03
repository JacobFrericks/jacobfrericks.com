// Tests for the contact section, the footer, and the site's privacy rules. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const section = html.split(/<section[^>]*id="contact"/)[1]?.split("</section>")[0] ?? "";
const text = html.replace(/<[^>]+>/g, " ");

test("contact offers LinkedIn, GitHub, and a private security report", () => {
  assert.match(section, /href="https:\/\/www\.linkedin\.com\/in\/jacobfrericks"/);
  assert.match(section, /href="https:\/\/github\.com\/JacobFrericks"/);
  assert.match(section, /href="https:\/\/github\.com\/JacobFrericks\/jacobfrericks\.com\/security\/advisories\/new"/);
});

test("contact is the last section, followed by the footer", () => {
  const sections = [...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(sections.at(-1), "contact");
  assert.ok(html.indexOf("<footer") > html.indexOf('id="contact"'));
});

// The CSP sets form-action 'none', so a form could never submit. There must be none.
test("the page has no forms", () => {
  assert.doesNotMatch(html, /<form\b/);
});

test("the page shows no email address or phone number", () => {
  assert.doesNotMatch(text, /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, "an email address is on the page");
  assert.doesNotMatch(text, /\b\d{3}[-.\s)]+\d{3}[-.\s]+\d{4}\b/, "a phone number is on the page");
  assert.doesNotMatch(html, /href="(mailto|tel):/);
});

test("the footer shows the release version and links to the source and license", () => {
  const footer = html.split("<footer")[1]?.split("</footer>")[0] ?? "";
  assert.match(footer, new RegExp(`rev ${version.replace(/\./g, "\\.")}`));
  assert.match(footer, /href="https:\/\/github\.com\/JacobFrericks\/jacobfrericks\.com"/);
  assert.match(footer, /LICENSE/);
});

test("every outside link uses https", () => {
  for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"#][^"]*)"/g)) {
    assert.ok(href.startsWith("https://") || href.startsWith("/"), `${href} is not https`);
  }
});
