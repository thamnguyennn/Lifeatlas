# Headless-Chrome screenshots, one per report page + console error check:
#   python3 scripts/shots.py <width> <height> <prefix> [theme]
# Output goes to /tmp/shots. The report is paginated, so each page is opened through the page strip.
import sys, json, os
from playwright.sync_api import sync_playwright

W, H, prefix = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
theme = sys.argv[4] if len(sys.argv) > 4 else "night"
url = "file:///home/claude/atlas2/dist/index.html"
os.makedirs("/tmp/shots", exist_ok=True)
errors = []

def settle(pg, H):
    """Scroll through the open page so every reveal-on-scroll block appears, then return to the top."""
    total = pg.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < total:
        pg.evaluate(f"window.scrollTo(0, {y})"); pg.wait_for_timeout(110); y += int(H * 0.6)
        total = pg.evaluate("document.documentElement.scrollHeight")
    pg.wait_for_timeout(500)
    pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(350)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--disable-gpu"])
    pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    pg.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))
    pg.goto(url)
    if theme != "night":
        pg.evaluate(f"document.documentElement.setAttribute('data-skin','{theme}')")
    pg.wait_for_timeout(2200)
    pg.screenshot(path=f"/tmp/shots/{prefix}_landing.png")
    settle(pg, H)
    pg.screenshot(path=f"/tmp/shots/{prefix}_landing_full.png", full_page=True)
    pg.click("text=Xem lá số mẫu"); pg.wait_for_timeout(1200)
    pg.screenshot(path=f"/tmp/shots/{prefix}_cast.png")
    pg.wait_for_timeout(3800)
    pg.screenshot(path=f"/tmp/shots/{prefix}_report_top.png")
    # The report is read one page at a time: walk it with the Next button, as a reader would.
    ids = []
    pg.screenshot(path=f"/tmp/shots/{prefix}_p00_open_view.png")
    settle(pg, H)
    pg.screenshot(path=f"/tmp/shots/{prefix}_p01_open.png", full_page=True)
    ids.append("open")
    pg.click("text=Bắt đầu đọc"); pg.wait_for_timeout(700)
    i = 2
    while True:
        pid = pg.get_attribute(".rpage", "data-page")
        ids.append(pid)
        settle(pg, H)
        pg.screenshot(path=f"/tmp/shots/{prefix}_p{i:02d}_{pid}.png", full_page=True)
        nxt = pg.locator(".rpage .pager .pg-next")
        if "Về lời mở đầu" in nxt.inner_text() or i > 40: break
        nxt.click(); pg.wait_for_timeout(650); i += 1
    sw = pg.evaluate("document.documentElement.scrollWidth"), pg.evaluate("window.innerWidth")
    print("pages:", ids)
    print("scrollWidth/innerWidth:", sw)
    print("errors:", json.dumps(errors, ensure_ascii=False, indent=1) if errors else "none")
    b.close()
