// Smoke test on the built single file (needs playwright): node scripts/smoke.cjs
const { chromium } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
const errs = [], notes = [];
const ok = (c, m) => notes.push((c ? "PASS " : "FAIL ") + m);
const SEEN = "try { localStorage.setItem('lifeatlas.intro.seen', '1') } catch (e) {}";
async function fill(pg, d, m, y, hh, mm, place) {
  await pg.fill("input[placeholder='dd']", d); await pg.locator("input[placeholder='mm']").first().fill(m); await pg.fill("input[placeholder='yyyy']", y);
  await pg.fill("input[placeholder='hh']", hh); await pg.locator("input[placeholder='mm']").nth(1).fill(mm);
  await pg.fill("input[placeholder^='Gõ tên']", place); await pg.waitForTimeout(300);
  await pg.locator(".combo-list li").first().click(); await pg.waitForTimeout(300);
}
(async () => {
  const b = await chromium.launch({ args: ["--no-sandbox", "--disable-gpu"] });
  for (const [label, vp] of [["desktop", { width: 1280, height: 900 }], ["mobile", { width: 390, height: 800 }]]) {
    const c = await b.newContext({ viewport: vp }); await c.addInitScript(SEEN);
    const pg = await c.newPage();
    pg.on("console", (m) => { if (m.type() === "error") errs.push(`[${label}] ${m.text()}`); });
    pg.on("pageerror", (e) => errs.push(`[${label} pageerror] ${e}`));
    await pg.goto(URL); await pg.waitForTimeout(800);
    const body = await pg.locator("body").innerText();
    ok(!/xem lá số mẫu/i.test(body) && !body.includes("Jyotish trong vài câu"), `${label}: no sample button, no Jyotish card`);
    ok((await pg.locator("body").innerHTML()).includes("30 phút"), `${label}: birth-time error selector`);
    ok((await pg.locator("body").innerHTML()).includes("khoảng lặng"), `${label}: author note at the bottom`);
    await fill(pg, "23", "5", "1990", "1", "40", "hue");
    await pg.click("button:has-text('Mở lá số')"); await pg.waitForTimeout(1500);
    let seen = 0;
    for (let i = 0; i < 60; i++) {
      if (await pg.locator(".rpage .btn.primary:has-text('Bắt đầu đọc')").count()) { await pg.click(".rpage .btn.primary:has-text('Bắt đầu đọc')"); await pg.waitForTimeout(350); continue; }
      seen++;
      const t = await pg.locator(".rpage").innerText();
      const id = await pg.getAttribute(".rpage", "data-page");
      if (/undefined|NaN/.test(t)) errs.push(`[${label}] bad text on ${id}`);
      const sw = await pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth");
      if (sw > 2) errs.push(`[${label}] sideways scroll ${sw}px on ${id}`);
      const nx = pg.locator(".rpage .pager .pg-next");
      if (!(await nx.count()) || (await nx.innerText()).includes("Về lời mở đầu")) break;
      await nx.click(); await pg.waitForTimeout(300);
    }
    ok(seen >= 27, `${label}: walked ${seen} pages`);
    if (label === "desktop") {
      await pg.click(".rnav .parts a:has-text('Khám phá thêm')"); await pg.waitForTimeout(400);
      ok((await pg.locator(".rpage").innerText()).includes("So sánh hai lá số"), "explore: compatibility page opens");
      await fill(pg, "2", "11", "1992", "7", "20", "ha noi");
      await pg.locator(".rpage button:has-text('Mở lá số')").click(); await pg.waitForTimeout(1200);
      ok((await pg.locator(".rpage").innerText()).includes("/36"), "compatibility shows a score out of 36");
      await pg.click(".rnav .parts a:has-text('Biểu đồ chuyên sâu')"); await pg.waitForTimeout(400);
      ok((await pg.locator(".rpage svg").count()) >= 1, "D-chart page has a diamond chart");
    }
    await pg.screenshot({ path: `/tmp/claude-0/smoke-${label}.png` });
    await c.close();
  }
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await c.newPage();
  pg.on("pageerror", (e) => errs.push(`[intro pageerror] ${e}`));
  await pg.goto(URL); await pg.waitForTimeout(1200);
  ok((await pg.locator(".intro canvas").count()) === 1, "intro shows on first visit");
  await pg.click(".intro-bar button[aria-label='Bật tiếng']"); await pg.waitForTimeout(1500);
  ok((await pg.locator(".intro-bar button[aria-label='Tắt tiếng']").count()) === 1, "intro sound switches on");
  await b.close();
  console.log(notes.join("\n")); console.log(errs.length ? "ERRORS:\n" + errs.slice(0, 20).join("\n") : "no console errors");
  process.exit(errs.length || notes.some((n) => n.startsWith("FAIL")) ? 1 : 0);
})();
