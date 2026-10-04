// Tests for the project cards and the site's content rules. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const chainIds = ["source", "deps", "build", "artifact", "deploy", "runtime"];
const cards = html.split(/(?=<article[^>]*class="card)/).slice(1).map((part) => part.split("</article>")[0]);
const cardLink = (card) => card.match(/data-link="([^"]+)"/)?.[1];

test("the projects section lists all nine cards", () => {
  assert.match(html, /<section[^>]*id="projects"/);
  assert.equal(cards.length, 9);
});

test("every card is tagged with a real chain link", () => {
  for (const card of cards) {
    assert.ok(chainIds.includes(cardLink(card)), `unknown chain link "${cardLink(card)}"`);
  }
});

test("every chain link has at least one project", () => {
  const covered = new Set(cards.map(cardLink));
  for (const id of chainIds) assert.ok(covered.has(id), `no project for the ${id} link`);
});

test("every card states a problem, a fix, a result, and at least one tool", () => {
  for (const card of cards) {
    for (const term of ["Problem", "Fix", "Result"]) {
      assert.match(card, new RegExp(`<dt[^>]*>${term}</dt>\\s*<dd[^>]*>[^<]+</dd>`), `card is missing ${term}`);
    }
    assert.match(card, /class="chip[^"]*"[^>]*>[^<]+</, "card lists no tools");
  }
});

test("all cards are visible without JavaScript, and the filters stay hidden until it runs", () => {
  for (const card of cards) assert.doesNotMatch(card.split(">")[0], /\shidden/);
  assert.match(html, /<div[^>]*class="filters"[^>]*hidden/);
});

test("there is one filter per chain link, plus All", () => {
  const filters = [...html.matchAll(/data-filter="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(filters, ["all", ...chainIds]);
});

// The current employer is described, never named, anywhere on the site.
test("no page names the current employer", () => {
  const pages = ["index.html", "hire/index.html"].map((page) => readFileSync(new URL(`../dist/${page}`, import.meta.url), "utf8"));
  for (const page of pages) {
    assert.doesNotMatch(page, /\bCVS\b/i);
    assert.match(page, /Fortune 10 healthcare company/);
  }
});
