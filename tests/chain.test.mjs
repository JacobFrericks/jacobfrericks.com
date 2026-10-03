// Tests for the supply chain diagram on the home page. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const names = ["Source", "Deps", "Build", "Artifact", "Deploy", "Runtime"];
const tabs = [...html.matchAll(/<button[^>]*role="tab"[^>]*>/g)].map((match) => match[0]);
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

test("the chain shows all six links in order", () => {
  assert.equal(tabs.length, 6);
  const shown = [...html.matchAll(/class="link-name"[^>]*>([^<]+)</g)].map((match) => match[1]);
  assert.deepEqual(shown, names);
});

test("exactly one link is selected by default, and it is Build", () => {
  const selected = tabs.filter((tab) => attr(tab, "aria-selected") === "true");
  assert.equal(selected.length, 1);
  assert.equal(attr(selected[0], "id"), "tab-build");
});

test("every tab controls a panel that exists and points back to it", () => {
  for (const tab of tabs) {
    const panelId = attr(tab, "aria-controls");
    const panel = html.match(new RegExp(`<div[^>]*id="${panelId}"[^>]*>`))?.[0];
    assert.ok(panel, `panel ${panelId} is missing`);
    assert.equal(attr(panel, "role"), "tabpanel");
    assert.equal(attr(panel, "aria-labelledby"), attr(tab, "id"));
  }
});

test("only the selected panel is visible without JavaScript", () => {
  const panels = [...html.matchAll(/<div[^>]*role="tabpanel"[^>]*>/g)].map((match) => match[0]);
  assert.equal(panels.length, 6);
  const visible = panels.filter((panel) => !/\shidden(\s|>|=)/.test(panel));
  assert.deepEqual(visible.map((panel) => attr(panel, "id")), ["panel-build"]);
});

test("every panel names a risk, a real attack, and at least one control", () => {
  const panels = html.split(/(?=<div[^>]*role="tabpanel")/).slice(1);
  for (const panel of panels) {
    assert.match(panel, /Link \d{2} · Risk/);
    assert.match(panel, /Real attack/);
    assert.match(panel, /<li[^>]*>/, "panel has no controls");
  }
});

test("every in-page link points to an element that exists", () => {
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(anchors.includes("chain"), "nothing links to the chain section");
  for (const id of anchors) {
    assert.match(html, new RegExp(`id="${id}"`), `#${id} has no target`);
  }
});
