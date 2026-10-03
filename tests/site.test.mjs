// Tests run against the built site in dist/, so run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

const built = existsSync(dist) ? files(dist) : [];
const pages = built.filter((file) => extname(file) === ".html");
const read = (file) => readFileSync(file, "utf8");
const index = () => read(join(dist, "index.html"));

test("the site has been built", () => {
  assert.ok(pages.length > 0, "dist/ has no HTML pages; run npm run build first");
});

test("every page declares a language, a title, a description, and a viewport", () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /<html lang="en"/, `${page} is missing lang="en"`);
    assert.match(html, /<title>[^<]+<\/title>/, `${page} is missing a title`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${page} is missing a description`);
    assert.match(html, /<meta name="viewport"/, `${page} is missing a viewport`);
  }
});

test("the home page shows the name, role, and headline", () => {
  const html = index();
  assert.match(html, /<title>Jacob Frericks \| Staff DevOps Engineer<\/title>/);
  assert.match(html, /Staff DevOps Engineer/);
  assert.match(html, /<h1[^>]*>.*secure.*actually use/s);
});

test("years of experience are counted from 2013", () => {
  const years = new Date().getFullYear() - 2013;
  assert.match(index(), new RegExp(`${years} years from Java developer`));
});

// Pages may link out with <a href>, but must never load a script, style, font, or image from another host.
test("no page loads resources from a third-party host", () => {
  const loaders = /<(?:script|link|img|iframe|source)\b[^>]*\b(?:src|href)="(https?:)?\/\/[^"]+"/gi;
  for (const page of pages) {
    assert.deepEqual(read(page).match(loaders) ?? [], [], `${page} loads a third-party resource`);
  }
  for (const css of built.filter((file) => extname(file) === ".css")) {
    assert.doesNotMatch(read(css), /url\(\s*["']?(https?:)?\/\//i, `${css} loads a third-party resource`);
  }
});

test("the service worker that replaces the old site clears caches and removes itself", () => {
  const worker = read(join(dist, "service-worker.js"));
  assert.match(worker, /caches\.delete/);
  assert.match(worker, /registration\.unregister\(\)/);
});
