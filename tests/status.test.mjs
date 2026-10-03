// The drawing title block's status must match the release version. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const status = html.match(/<b[^>]*>Status<\/b><span[^>]*>([^<]+)</)?.[1];

test("the status says Released from 1.0.0 on, and Under construction before", () => {
  const major = Number(version.split(".")[0]);
  assert.equal(status, major >= 1 ? "Released" : "Under construction");
});
