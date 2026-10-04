// Tests for the recruiter page at /hire/. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");
const hire = read("hire/index.html");
const home = read("index.html");
const text = hire.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("the hire page exists with its own title and the light theme", () => {
  assert.match(hire, /<title>Jacob Frericks \| Hire<\/title>/);
  assert.match(hire, /<body[^>]*data-theme="whiteprint"/);
});

test("the location says Des Moines and open to remote, and nothing about relocating", () => {
  assert.match(text, /Des Moines, IA · Open to remote/);
  assert.doesNotMatch(text, /relocat/i);
});

// The page is public, so it must not announce a job search to the current employer.
test("the page does not say the owner is looking for a new job", () => {
  assert.doesNotMatch(text, /open to (new )?(roles|opportunities|work)|looking for|available for hire|job search|actively/i);
});

test("experience lists every role from the main site's career timeline", () => {
  const homeCareer = home.split(/<section[^>]*id="career"/)[1]?.split("</section>")[0] ?? "";
  const homeRoles = (homeCareer.match(/<li\b/g) ?? []).length;
  const hireRoles = (hire.match(/<tr\b/g) ?? []).length;
  assert.ok(homeRoles >= 6);
  assert.equal(hireRoles, homeRoles);
});

test("every skill on the hire page is also in the main site's toolbox", () => {
  const chips = (html) => [...html.matchAll(/class="chip"[^>]*>([^<]+)</g)].map((match) => match[1].trim());
  const toolbox = home.split(/<section[^>]*id="toolbox"/)[1]?.split("</section>")[0] ?? "";
  const skills = chips(hire.split('id="skills"')[1] ?? "");
  assert.ok(skills.length >= 10);
  for (const skill of skills) assert.ok(chips(toolbox).includes(skill), `${skill} is not in the toolbox`);
});

test("the two pages link to each other", () => {
  assert.match(home, /href="\/hire\/"/);
  assert.match(hire, /href="\/"/);
});

test("the hire page shows the release version and links to verification", () => {
  assert.match(hire, new RegExp(`v${version.replace(/\./g, "\\.")}`));
  assert.match(hire, /href="\/#verify"/);
});
