// Tests for the career timeline. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const section = html.split(/<section[^>]*id="career"/)[1]?.split("</section>")[0] ?? "";
const items = [...section.matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)].map(([, attrs, body]) => ({ attrs, body }));
const startYear = (item) => Number(item.body.match(/class="when"[^>]*>(\d{4})/)?.[1]);

test("the career section comes after projects", () => {
  assert.ok(html.indexOf('id="career"') > html.indexOf('id="projects"'));
});

test("roles are listed newest first", () => {
  const years = items.map(startYear);
  assert.ok(years.length >= 6, "too few entries");
  assert.deepEqual(years, [...years].sort((a, b) => b - a));
});

test("only the first role is marked as current", () => {
  const current = items.filter((item) => /class="now"/.test(item.attrs));
  assert.equal(current.length, 1);
  assert.equal(items[0], current[0]);
  assert.match(items[0].body, /– now/);
});

test("past employers and education are named", () => {
  for (const name of ["Hy-Vee", "Principal Financial Group", "IBM", "Iowa State University"]) {
    assert.match(section, new RegExp(name), `${name} is missing`);
  }
});

test("experience starts in 2013, matching the hero's years counter", () => {
  assert.equal(Math.min(...items.map(startYear)), 2013);
});
