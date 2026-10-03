// Tests for the toolbox. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const section = html.split(/<section[^>]*id="toolbox"/)[1]?.split("</section>")[0] ?? "";
const chipText = (part) => [...part.matchAll(/class="chip"[^>]*>([^<]+)</g)].map((match) => match[1].trim());
const toolboxTools = chipText(section);

test("the toolbox has a DevOps column and a DevSecOps column", () => {
  const titles = [...section.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((match) => match[1]);
  assert.deepEqual(titles, ["DevOps", "DevSecOps"]);
});

test("every group lists at least one tool, and no tool is listed twice", () => {
  const groups = section.split(/class="group"/).slice(1);
  assert.ok(groups.length >= 6);
  for (const group of groups) assert.ok(chipText(group).length > 0, "a group has no tools");
  assert.equal(new Set(toolboxTools).size, toolboxTools.length, "a tool is listed twice");
});

test("every tool named on a project card also appears in the toolbox", () => {
  const projects = html.split(/<section[^>]*id="projects"/)[1]?.split("</section>")[0] ?? "";
  const cardTools = new Set(chipText(projects));
  assert.ok(cardTools.size > 0, "no project tools found");
  for (const tool of cardTools) {
    assert.ok(toolboxTools.includes(tool), `${tool} is on a project card but missing from the toolbox`);
  }
});

test("the security scanners this site runs are listed", () => {
  for (const tool of ["Semgrep", "Gitleaks", "Trivy", "zizmor", "OpenSSF Scorecard", "Dependabot"]) {
    assert.ok(toolboxTools.includes(tool), `${tool} is missing`);
  }
});
