// Tests that every page carries a strict Content Security Policy and needs no exceptions to it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
const pages = files(dist).filter((file) => extname(file) === ".html");
const read = (file) => readFileSync(file, "utf8");

function policy(html) {
  const content = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  if (!content) return null;
  return Object.fromEntries(
    content.split(";").map((part) => part.trim().split(/\s+/)).map(([name, ...values]) => [name, values]),
  );
}

test("every page has a Content Security Policy", () => {
  for (const page of pages) assert.ok(policy(read(page)), `${page} has no CSP`);
});

test("the policy denies everything by default and allows only this site's own files", () => {
  for (const page of pages) {
    const csp = policy(read(page));
    assert.deepEqual(csp["default-src"], ["'none'"]);
    for (const kind of ["script-src", "style-src", "font-src", "img-src"]) {
      assert.deepEqual(csp[kind], ["'self'"], `${kind} must be 'self' only`);
    }
    assert.deepEqual(csp["base-uri"], ["'none'"]);
    assert.deepEqual(csp["form-action"], ["'none'"]);
  }
});

test("the policy never loosens itself with unsafe keywords, wildcards, or other hosts", () => {
  for (const page of pages) {
    const values = Object.values(policy(read(page))).flat();
    for (const value of values) {
      assert.ok(!/unsafe-|^\*$|^https?:|^data:|^blob:/.test(value), `${page} allows ${value}`);
    }
  }
});

test("the policy is the first thing in the head after the charset", () => {
  for (const page of pages) {
    const head = read(page).split("<head>")[1] ?? "";
    assert.match(head, /^\s*<meta charset="utf-8"\s*\/?>\s*<meta http-equiv="Content-Security-Policy"/);
  }
});

// The policy blocks inline code, so the pages must not depend on any.
test("pages contain no inline scripts, style blocks, style attributes, or event handlers", () => {
  for (const page of pages) {
    const html = read(page);
    const inlineScripts = [...html.matchAll(/<script\b[^>]*>/g)].filter((match) => !/\ssrc=/.test(match[0]));
    assert.equal(inlineScripts.length, 0, `${page} has an inline script`);
    assert.doesNotMatch(html, /<style\b/, `${page} has a <style> block`);
    assert.doesNotMatch(html, /\sstyle="/, `${page} has a style attribute`);
    assert.doesNotMatch(html, /\son[a-z]+="/i, `${page} has an inline event handler`);
  }
});

test("every script and stylesheet is served from this site", () => {
  for (const page of pages) {
    const html = read(page);
    const sources = [
      ...[...html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)].map((match) => match[1]),
      ...[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((match) => match[1]),
    ];
    for (const src of sources) assert.match(src, /^\/(?!\/)/, `${src} is not a same-origin path`);
  }
});
