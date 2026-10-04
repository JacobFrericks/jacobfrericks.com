// Prints the built résumé page to dist/jacob-frericks-resume.pdf with headless Chrome.
// Uses only Node built-ins and the Chrome already on the machine, so it adds no dependencies.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, extname, resolve } from "node:path";

const dist = resolve("dist");
const output = join(dist, "jacob-frericks-resume.pdf");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

// Serves dist/ so the page loads its CSS and fonts the same way it does in production.
const server = createServer(async (req, res) => {
  let path = join(dist, decodeURIComponent(new URL(req.url, "http://localhost").pathname));
  if (!path.startsWith(dist)) return res.writeHead(403).end();
  try {
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
    res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
});

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  const found = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!found) throw new Error("Chrome not found. Set CHROME_PATH to a Chrome or Chromium binary.");
  return found;
}

await new Promise((done) => server.listen(0, "127.0.0.1", done));
const url = `http://127.0.0.1:${server.address().port}/hire/resume/`;

// CI runners block Chrome's sandbox, so it is turned off there. Chrome only loads this site's own files.
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=5000",
  `--print-to-pdf=${output}`,
  ...(process.env.CI ? ["--no-sandbox"] : []),
  url,
];

const code = await new Promise((done) => {
  const chrome = spawn(findChrome(), args, { stdio: "ignore" });
  const timer = setTimeout(() => chrome.kill(), 60_000);
  chrome.on("exit", (exitCode) => {
    clearTimeout(timer);
    done(exitCode);
  });
});
server.close();

if (code !== 0 || !existsSync(output)) {
  console.error(`Chrome failed to print the résumé (exit code ${code}).`);
  process.exit(1);
}
console.log(`Wrote ${output}`);
