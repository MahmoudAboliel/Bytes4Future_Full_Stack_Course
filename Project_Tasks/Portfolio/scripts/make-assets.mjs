#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────
 *  Generates every binary asset straight from the running site:
 *
 *    public/files/Mahmoud-Abulail-CV-EN.pdf   ← /cv   (A4, print CSS)
 *    public/files/Mahmoud-Abulail-CV-AR.pdf   ← /ar/cv
 *    public/og.png                          ← /og   (1200×630)
 *    public/icon-512.png                    ← scripts/icon-source.html
 *    public/apple-touch-icon.png            ← scripts/icon-source.html
 *
 *  Usage:
 *    npm run build && npm run assets        # builds a server, then renders
 *    npm run assets -- --only=cv            # only the two CV PDFs
 *    npm run assets -- --url=http://localhost:3000   # use a running server
 *
 *  Requires Chrome or Edge (set CHROME_PATH to override the auto-detect).
 * ─────────────────────────────────────────────────────────────
 */

import { spawn } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "build", "server", "index.js");
const port = Number(process.env.PORT || 4317);

/* ── CLI ─────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const flag = (name) => {
  const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

const only = (flag("only") ?? "cv,og,icon,photo")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const externalUrl = flag("url");
const baseUrl = (externalUrl ?? `http://localhost:${port}`).replace(/\/$/, "");

/* ── Outputs (CV names come from app/data/site.ts) ───────────── */

const siteSource = readFileSync(join(root, "app", "data", "site.ts"), "utf8");
const cvSection = siteSource.slice(siteSource.indexOf("cv: {"));
const cvFile = (locale) =>
  cvSection.match(new RegExp(`${locale}:\\s*"([^"]+)"`))?.[1] ??
  `/files/Mahmoud-Abulail-CV-${locale.toUpperCase()}.pdf`;

/** The printable page and the file it produces. */
const cvTarget = (locale) => ({
  url: locale === "ar" ? "/ar/cv" : "/cv",
  file: join(root, "public", cvFile(locale)),
});

const out = {
  cvEn: cvTarget("en"),
  cvAr: cvTarget("ar"),
  og: join(root, "public", "og.png"),
  icon: join(root, "public", "icon-512.png"),
  appleIcon: join(root, "public", "apple-touch-icon.png"),
};

/* ── Portrait photos (hero card + CV avatar) ─────────────────── */

/** Drop your photo here, then run `npm run assets -- --only=photo`. */
const photoSource =
  flag("source") ?? join(root, "assets", "portrait-source.png");

/** Same crop for both hero sizes so the srcset swap is seamless. */
const heroCrop = { fit: "cover", position: "center 42%" };
const faceCrop = { fit: "cover", position: "center 30%" };

const photoTargets = [
  { name: "portrait", width: 1000, height: 667, ...heroCrop },
  { name: "portrait-640", width: 640, height: 427, ...heroCrop },
  { name: "avatar", width: 400, height: 400, ...faceCrop },
  { name: "avatar-240", width: 240, height: 240, ...faceCrop },
];

/** JPEG is the fallback, WebP is what browsers actually pick. */
const photoFormats = [
  { ext: "jpg", format: "jpeg", quality: 84 },
  { ext: "webp", format: "webp", quality: 82 },
];

/* ── Browser detection ───────────────────────────────────────── */

const browserCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const browser = browserCandidates.find((path) => existsSync(path));

/* ── Helpers ─────────────────────────────────────────────────── */

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function isUp(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 30_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isUp(url)) return;
    await sleep(300);
  }
  throw new Error(`Server did not answer on ${url} within ${timeoutMs / 1000}s.`);
}

function runBrowser(args) {
  return new Promise((done, fail) => {
    const child = spawn(browser, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", fail);
    child.on("close", (code) => done({ code, stderr }));
  });
}

async function render({ url, file, width, height }) {
  mkdirSync(dirname(file), { recursive: true });

  const profile = join(
    tmpdir(),
    `portfolio-assets-${process.pid}-${Math.random().toString(36).slice(2, 8)}`,
  );

  const common = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-sync",
    "--mute-audio",
    `--user-data-dir=${profile}`,
    "--virtual-time-budget=6000",
  ];

  const print = width === undefined;

  const args = print
    ? [
        ...common,
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        `--print-to-pdf=${file}`,
        url,
      ]
    : [
        ...common,
        `--window-size=${width},${height}`,
        "--force-device-scale-factor=1",
        `--screenshot=${file}`,
        url,
      ];

  const { code, stderr } = await runBrowser(args);

  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    /* Windows can keep a lock briefly — harmless. */
  }

  if (!existsSync(file) || statSync(file).size === 0) {
    throw new Error(
      `Failed to render ${url} → ${file} (browser exited ${code}).\n${stderr.slice(-1200)}`,
    );
  }

  const kb = (statSync(file).size / 1024).toFixed(1);
  console.log(`  ✓ ${relative(root, file).replaceAll("\\", "/")}  (${kb} KB)`);

  syncToBuild(file);
}

/** `npm run start` serves build/client, a copy of public/ made at build time.
 *  Keep that copy in sync so a local preview never shows an old asset. */
function syncToBuild(file) {
  const publicDir = join(root, "public");
  const distClient = join(root, "build", "client");
  if (file.startsWith(publicDir) && existsSync(distClient)) {
    const target = join(distClient, relative(publicDir, file));
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(file, target);
  }
}

/* ── Photos ──────────────────────────────────────────────────── */

/**
 * Renders one `<img>` at an exact viewport and screenshots it as JPEG, so the
 * photo is cropped, resized and compressed without any image dependency.
 */
async function captureJpeg({ url, width, height, format = "jpeg", quality = 84 }) {
  const profile = join(
    tmpdir(),
    `portfolio-photo-${process.pid}-${Math.random().toString(36).slice(2, 8)}`,
  );
  const debugPort = 9200 + Math.floor(Math.random() * 600);

  const child = spawn(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--allow-file-access-from-files",
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${debugPort}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  try {
    let wsUrl;
    for (let attempt = 0; attempt < 80 && !wsUrl; attempt += 1) {
      try {
        const targets = await (
          await fetch(`http://127.0.0.1:${debugPort}/json/list`)
        ).json();
        wsUrl = targets.find((target) => target.type === "page")?.webSocketDebuggerUrl;
      } catch {
        /* browser not listening yet */
      }
      if (!wsUrl) await sleep(150);
    }
    if (!wsUrl) throw new Error("Could not reach the browser's DevTools endpoint.");

    const ws = new WebSocket(wsUrl);
    await new Promise((done, fail) => {
      ws.addEventListener("open", done, { once: true });
      ws.addEventListener("error", fail, { once: true });
    });

    let seq = 0;
    const pending = new Map();
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) waiter.fail(new Error(message.error.message));
      else waiter.done(message.result);
    });

    const send = (method, params = {}) =>
      new Promise((done, fail) => {
        const id = (seq += 1);
        pending.set(id, { done, fail });
        ws.send(JSON.stringify({ id, method, params }));
      });

    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", { url });

    for (let attempt = 0; attempt < 60; attempt += 1) {
      const { result } = await send("Runtime.evaluate", {
        expression:
          "Boolean(document.images[0]?.complete && document.images[0]?.naturalWidth)",
        returnByValue: true,
      });
      if (result?.value) break;
      await sleep(100);
    }
    await sleep(150);

    const shot = await send("Page.captureScreenshot", {
      format,
      quality,
    });
    ws.close();
    return Buffer.from(shot.data, "base64");
  } finally {
    child.kill();
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      /* Windows can keep a lock briefly — harmless. */
    }
  }
}

async function renderPhoto({ file, width, height, fit, position, format, quality }) {
  const workdir = join(
    tmpdir(),
    `portfolio-photo-page-${process.pid}-${Math.random().toString(36).slice(2, 8)}`,
  );
  mkdirSync(workdir, { recursive: true });
  const page = join(workdir, "photo.html");

  writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8"><title>photo</title>
<style>
  html, body { margin: 0; height: 100%; background: #0b0b10; }
  img { display: block; width: 100vw; height: 100vh; object-fit: ${fit}; object-position: ${position}; }
</style>
<img src="${pathToFileURL(photoSource).href}" alt="">`,
  );

  try {
    mkdirSync(dirname(file), { recursive: true });
    const jpeg = await captureJpeg({
      url: pathToFileURL(page).href,
      width,
      height,
      format,
      quality,
    });
    writeFileSync(file, jpeg);
    const kb = (jpeg.length / 1024).toFixed(1);
    console.log(
      `  ✓ ${relative(root, file).replaceAll("\\", "/")}  (${width}×${height}, ${kb} KB)`,
    );
    syncToBuild(file);
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }
}

/* ── Main ────────────────────────────────────────────────────── */

async function main() {
  if (!browser) {
    throw new Error(
      "Chrome or Edge was not found. Install one or set CHROME_PATH=/path/to/chrome.",
    );
  }

  console.log(`\n▸ Rendering site assets from ${baseUrl}\n`);

  let server;
  if (!externalUrl) {
    if (!existsSync(dist)) {
      throw new Error(
        "Missing build/server/index.js — run `npm run build` first (or pass --url=...).",
      );
    }
    server = spawn(process.execPath, [join(root, "node_modules", "@react-router", "serve", "bin.js"), dist], {
      cwd: root,
      env: { ...process.env, PORT: String(port), NODE_ENV: "production" },
      stdio: "ignore",
    });
    server.on("error", (error) => {
      throw error;
    });
  }

  try {
    await waitForServer(`${baseUrl}/`);

    if (only.includes("cv")) {
      console.log("CV PDFs (A4, from /cv and /ar/cv)");
      await render({ url: `${baseUrl}${out.cvEn.url}`, file: out.cvEn.file });
      await render({ url: `${baseUrl}${out.cvAr.url}`, file: out.cvAr.file });
    }

    if (only.includes("og")) {
      console.log("Open Graph card (/og)");
      await render({ url: `${baseUrl}/og`, file: out.og, width: 1200, height: 630 });
    }

    if (only.includes("icon")) {
      console.log("App icons (scripts/icon-source.html)");
      const iconHtml = pathToFileURL(join(root, "scripts", "icon-source.html")).href;
      await render({ url: iconHtml, file: out.icon, width: 512, height: 512 });
      await render({ url: iconHtml, file: out.appleIcon, width: 180, height: 180 });
    }

    if (only.includes("photo")) {
      if (existsSync(photoSource)) {
        console.log(`Portrait photos (${relative(root, photoSource).replaceAll("\\", "/")})`);
        for (const target of photoTargets) {
          for (const format of photoFormats) {
            await renderPhoto({
              ...target,
              ...format,
              file: join(root, "public", "images", `${target.name}.${format.ext}`),
            });
          }
        }
      } else {
        console.log(
          `Portrait photos — skipped, no ${relative(root, photoSource).replaceAll("\\", "/")}`,
        );
      }
    }

    console.log("\nDone.\n");
  } finally {
    server?.kill();
  }
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}\n`);
  process.exitCode = 1;
});
