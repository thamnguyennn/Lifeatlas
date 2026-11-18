// Every browser that runs this page reads woff2, so the embedded woff fallbacks are dead weight (about 160 KB).
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../dist/index.html", import.meta.url);
const before = readFileSync(file, "utf8");
const after = before.replace(/,url\(data:font\/woff;base64,[A-Za-z0-9+/=]+\) format\("woff"\)/g, "");
writeFileSync(file, after);
const kb = (n) => (n / 1024).toFixed(0) + " KB";
console.log(`post-build: ${kb(before.length)} -> ${kb(after.length)} (removed ${before.length - after.length} bytes of woff fallbacks)`);
