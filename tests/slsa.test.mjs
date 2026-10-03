// Tests for the SLSA ladder and the Verify box. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const section = html.split(/<section[^>]*id="slsa"/)[1]?.split("</section>")[0] ?? "";
const decode = (text) => text.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

test("sections appear in order: chain, SLSA ladder, projects", () => {
  const order = ["chain", "slsa", "projects"].map((id) => html.indexOf(`id="${id}"`));
  assert.ok(order.every((i) => i > 0), "a section is missing");
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test("the ladder shows L3 down to L0, and every level says what it stops", () => {
  const levels = [...section.matchAll(/class="lvl"[^>]*>\s*(L\d)/g)].map((match) => match[1]);
  assert.deepEqual(levels, ["L3", "L2", "L1", "L0"]);
  assert.equal((section.match(/Stops:/g) ?? []).length, 4);
});

test("this site sits at L3 with the version from package.json, linked to Verify", () => {
  const chip = section.match(/<a[^>]*href="#verify"[^>]*>[^<]*<\/a>/)?.[0] ?? "";
  assert.match(chip, new RegExp(`This site · v${version.replace(/\./g, "\\.")}`));
  assert.match(html, /id="verify"/);
});

test("the drawing title block shows the same version", () => {
  assert.match(html, new RegExp(`<b[^>]*>Rev</b>${version.replace(/\./g, "\\.")}<`));
});

test("every verify check is marked PASS or NEXT, and planned work is not marked PASS", () => {
  const checks = [...section.matchAll(/<li[^>]*data-status="([^"]+)"[^>]*>([^<]+)/g)];
  assert.ok(checks.length >= 5);
  for (const [, status] of checks) assert.ok(["pass", "next"].includes(status), `unknown status ${status}`);
  const passed = checks.filter(([, status]) => status === "pass").map(([, , name]) => name);
  for (const planned of ["Content Security Policy", "SBOM"]) {
    assert.ok(!passed.some((name) => name.includes(planned)), `${planned} is claimed before it exists`);
  }
});

test("the copy button holds the same verify command the README documents", () => {
  const copied = decode(section.match(/data-copy="([^"]*)"/)?.[1] ?? "");
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const documented = readme.match(/```sh\n(gh release download[\s\S]*?)\n```/)?.[1] ?? "";
  const normalize = (text) => text.replace(/\\\n\s*/g, " ").replace(/\s+/g, " ").trim();
  assert.ok(documented, "README has no verify command");
  assert.equal(normalize(copied), normalize(documented));
});
