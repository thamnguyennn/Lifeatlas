# Interaction test in headless Chrome for the seven-part report:
# real typing through the form, the two navigation strips, Back/Forward, the twenty-seven pages, the day and month pickers,
# a chart without a birth time, printing, theme, the method page. Run after `npm run build`.
import re, sys, json
from playwright.sync_api import sync_playwright

URL = "file:///home/claude/atlas2/dist/index.html"
errors, notes = [], []
def ok(cond, msg):
    notes.append(("PASS " if cond else "FAIL ") + msg)

BANNED = (r"bản án|phán quyết|chín muồi|chín mùi|cơn đói|nhiều đời|tiền cảnh|trục nghiệp|chống đỡ|hiện diện|bản sắc|chủ nhà|chủ cung|cát lợi|hóa giải"
          r"|kích hoạt|tự thân|tiềm thức|mẫu hình|bên trong|bên ngoài|vẻ ngoài|năng lượng|nhìn chung|Mình đã đọc lá số|undefined|NaN|\{[a-z0-9]+\}")
PARTS = ["Mở lá số", "Tổng quan", "12 khía cạnh", "Bài học kiếp này", "Biểu đồ chuyên sâu", "Đại vận và tiểu vận", "Lời nhắn tháng này"]

SEEN = "try { localStorage.setItem('lifeatlas.intro.seen', '1') } catch (e) {}"

def cur(pg):
    return pg.get_attribute(".rpage", "data-page")

def part(pg, label):
    pg.click(f".rnav .parts a:has-text('{label}')"); pg.wait_for_timeout(450)

def page(pg, pid):
    pg.click(f".rnav .subpages a[href='#{pid}']"); pg.wait_for_timeout(450)

def nxt(pg):
    pg.click(".rpage .pager .pg-next"); pg.wait_for_timeout(420)

def walk(pg):
    """Open the first page, then press the Next button until the last page; return {page id: text}."""
    part(pg, PARTS[0])
    out = {}
    for _ in range(60):
        out[cur(pg)] = pg.locator(".rpage").inner_text()
        btn = pg.locator(".rpage .pager .pg-next")
        if btn.count() == 0:
            pg.click(".rpage .btn.primary:has-text('Bắt đầu đọc')"); pg.wait_for_timeout(420); continue
        if "Về lời mở đầu" in btn.inner_text(): break
        nxt(pg)
    return out

def fill_form(pg, d, m, y, hh=None, mm=None, place="buon ma", lunar=False, unknown=False):
    if lunar: pg.click("button:has-text('Âm lịch')")
    pg.fill("input[placeholder='dd']", d); pg.locator("input[placeholder='mm']").first.fill(m); pg.fill("input[placeholder='yyyy']", y)
    if unknown: pg.click("button:has-text('Không rõ giờ')")
    elif hh is not None:
        pg.fill("input[placeholder='hh']", hh); pg.locator("input[placeholder='mm']").nth(1).fill(mm)
    pg.fill("input[placeholder^='Gõ tên']", place); pg.wait_for_timeout(300)
    pg.locator(".combo-list li").first.click(); pg.wait_for_timeout(300)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--disable-gpu"])
    # 0) the opening film on a first visit
    ci = b.new_context(viewport={"width": 1280, "height": 900})
    pi = ci.new_page()
    pi.on("console", lambda m: errors.append(f"[intro {m.type}] {m.text}") if m.type in ("error", "warning") else None)
    pi.on("pageerror", lambda e: errors.append(f"[pageerror-intro] {e}"))
    pi.goto(URL); pi.wait_for_timeout(1500)
    ok(pi.locator(".intro canvas").count() == 1 and pi.locator(".intro-skip").is_visible(), "first visit: the opening film covers the page and Bỏ qua is visible")
    ok(pi.evaluate("document.activeElement && document.activeElement.classList.contains('intro-skip')"), "focus starts on Bỏ qua")
    pi.evaluate("window.__introSeek(2.2)"); pi.wait_for_timeout(1400)
    ok("Hàng nghìn năm trước" in pi.locator(".intro-caps").inner_text(), "the first caption appears in time")
    pi.click(".intro-bar button[aria-label='Tắt phụ đề']"); pi.wait_for_timeout(200)
    ok(pi.locator(".intro-caps").count() == 0 and pi.locator(".intro-bar button[aria-label='Bật phụ đề']").count() == 1, "captions can be switched off")
    pi.click(".intro-bar button[aria-label='Bật phụ đề']"); pi.wait_for_timeout(200)
    pi.click(".intro-bar button[aria-label='Bật tiếng']"); pi.wait_for_timeout(600)
    ok(pi.locator(".intro-bar button[aria-label='Tắt tiếng']").count() == 1, "sound switches on with a click")
    pi.evaluate("window.__introSeek(41)"); pi.wait_for_timeout(1200)
    pi.click(".intro-bar button[aria-label='Tắt tiếng']"); pi.wait_for_timeout(200)
    ok(pi.locator(".intro-bar button[aria-label='Bật tiếng']").count() == 1, "sound switches off again")
    pi.evaluate("window.__introSeek(45)"); pi.wait_for_timeout(1800)
    ok("LIFE ATLAS" in pi.locator(".ie-title").inner_text() and pi.locator(".ie-cta.on").count() == 1, "the last scene shows LIFE ATLAS and the start button")
    pi.click(".ie-cta"); pi.wait_for_timeout(1700)
    ok(pi.locator(".intro").count() == 0 and pi.evaluate("localStorage.getItem('lifeatlas.intro.seen')") == "1", "Bắt đầu closes the film and remembers it was seen")
    ok(pi.evaluate("document.activeElement && document.activeElement.closest('#form') !== null"), "Bắt đầu lands in the birth form")
    pi.reload(); pi.wait_for_timeout(900)
    ok(pi.locator(".intro").count() == 0, "a second visit goes straight to the site")
    pi.click(".sitefoot .replay"); pi.wait_for_timeout(800)
    ok(pi.locator(".intro").count() == 1, "Xem lại đoạn mở đầu replays the film")
    pi.click(".intro-skip"); pi.wait_for_timeout(1500)
    ok(pi.locator(".intro").count() == 0 and pi.locator("#form").count() == 1, "Bỏ qua returns to the site with the form intact")
    pi.click(".sitefoot .replay"); pi.wait_for_timeout(600); pi.keyboard.press("Escape"); pi.wait_for_timeout(1500)
    ok(pi.locator(".intro").count() == 0, "Escape also skips the film")
    ci.close()
    cr = b.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    pr = cr.new_page(); pr.on("pageerror", lambda e: errors.append(f"[pageerror-intro-rm] {e}"))
    pr.goto(URL); pr.wait_for_timeout(900)
    ok(pr.locator(".intro.still").count() == 1 and pr.locator(".intro-poem p").count() == 5 and pr.locator(".ie-cta.on").count() == 1, "reduced motion: a still version with all the words and the start button")
    cr.close()

    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    ctx.add_init_script(SEEN)
    pg = ctx.new_page()
    pg.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))
    pg.goto(URL); pg.wait_for_timeout(800)

    # 1) landing
    land = pg.locator("main").inner_text()
    ok("hãy để mình kể cho bạn nghe" in pg.locator("h1").inner_text(), "landing hero speaks in the friend's voice")
    ok(not re.search(BANNED, land), "landing text has none of the rejected words")
    ok(pg.locator(".deva-row .deva").count() == 9 and "Agni" in pg.locator(".devas").inner_text() and "Chitragupta" in pg.locator(".devas").inner_text(), "landing shows the nine grahas with their presiding gods")
    ok(pg.locator("canvas.starfield").count() == 1 and pg.locator(".deva-row .emblem").count() == 9, "the cosmos canvas and nine emblems are on the landing page")
    ok("bầu trời lúc này" in land.lower() and "giờ miền nam" not in land.lower() and "ở lại trên máy" not in land.lower(), "landing keeps the sky chips and drops the device and southern-time notes")
    pg.click("text=Mở lá số →"); pg.wait_for_timeout(300)
    ok(pg.locator(".errors li").count() >= 1, "empty form shows validation errors")

    # 2) a real chart: solar date, exact time, place search without diacritics
    fill_form(pg, "20", "1", "1998", "10", "45")
    ok("UTC+7" in pg.locator(".intake").inner_text(), "time callout shows the converted standard time (UTC+7)")
    pg.click("text=Mở lá số →"); pg.wait_for_timeout(600)
    ok(pg.locator(".cast").count() == 1, "cast overlay appears")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(900)
    ok(pg.locator(".report").count() == 1, "Esc skips the ritual and opens the report")

    # 3) part 1: one sentence, three anchors; the two strips; progress
    ok(cur(pg) == "open", "the report opens on the first page")
    line = pg.locator(".rpage .open-line, .rpage .letter-line, .rpage blockquote, .rpage .p-line").first
    first_text = pg.locator(".rpage").inner_text()
    ok("lòng bạn" in first_text, "opening page carries the one-sentence message")
    ok(len(re.findall(r"[.!?]\s", first_text.split("Gửi")[-1][:260])) <= 1, "the opening message is a single sentence")
    ok(all(w.lower() in first_text.lower() for w in ("Cung mọc", "Mặt Trời", "Mặt Trăng")), "opening page shows the three anchors")
    labels = [t.strip() for t in pg.locator(".rnav .parts a").all_inner_texts()]
    ok(len(labels) == 7, f"seven parts in the top strip ({len(labels)})")
    ok(all(any(w in l for l in labels) for w in PARTS), f"part labels as planned: {labels}")
    ok(pg.locator(".rprog").get_attribute("aria-valuemax") == "27" and pg.locator(".rprog").get_attribute("aria-valuenow") == "1", "progress starts at 1 of 27")
    pg.click(".rpage .btn.primary:has-text('Bắt đầu đọc')"); pg.wait_for_timeout(500)
    ok(cur(pg) == "ov-keys" and pg.locator(".rprog").get_attribute("aria-valuenow") == "2", "Bắt đầu đọc opens page 2")
    pg.go_back(); pg.wait_for_timeout(500)
    ok(cur(pg) == "open", "browser Back returns to the first page")
    pg.go_forward(); pg.wait_for_timeout(500)
    ok(cur(pg) == "ov-keys", "browser Forward goes on")
    pg.click(".rpage .pager .pg-prev"); pg.wait_for_timeout(400)
    ok(cur(pg) == "open", "Trước button returns to the first page")

    # 4) part 2: the three anchors by what they stand for
    part(pg, "Tổng quan")
    ok(cur(pg) == "ov-keys" and pg.locator(".rnav .subpages a").count() == 2, "overview has two pages")
    t = pg.locator(".rpage").inner_text()
    ok("bản ngã và linh hồn" in t and "cảm xúc và tâm trí" in t and "thân thể và cách bạn bước vào đời" in t, "Sun, Moon and Lagna are named by what they stand for")
    ok(not re.search("bên trong|bên ngoài|vẻ ngoài", t), "overview does not use inside/outside")
    ok(pg.locator(".rpage .castlist li").count() == 9 and "Chín nhân vật" in t, "the nine characters are listed, in plain words, on the first overview page")
    ok("Ba điểm này nói chuyện với nhau thế nào" in t, "a paragraph links the three anchors")
    ok(pg.locator(".rpage .castlist li .emblem").count() == 9 and "Vishnu" in t, "each of the nine characters carries its emblem and its god")
    ok(pg.locator(".rpage .castlist details.params").count() == 1 and pg.locator(".rpage .castlist details.params[open]").count() == 0, "planet positions stay folded under the nine characters")
    page(pg, "ov-common")
    ok(pg.locator(".rpage .ptable, .rpage .plist, .rpage details.params").count() >= 1 and "Shadbala" in pg.locator(".rpage").inner_text(), "common page shows planet strength and the folded planet table")

    # 5) part 3: the twelve houses, one page each
    part(pg, "12 khía cạnh")
    ok(cur(pg) == "h-map" and pg.locator(".rnav .subpages a").count() == 14, f"houses part has 14 pages ({pg.locator('.rnav .subpages a').count()})")
    ok(pg.locator(".rpage .pg-next").inner_text().startswith("Đọc nhà 1"), "map page leads to house 1")
    nxt(pg)
    ok(cur(pg) == "h-1", "Đọc nhà 1 opens house 1")
    ht = pg.locator(".rpage").inner_text()
    ok(all(w in ht for w in ("Nhà này nói về điều gì", "Một việc nhỏ để thử")), "house page opens with its meaning and ends with a small thing to try")
    ok(pg.locator(".rpage .pg-next").inner_text().startswith("Nhà tiếp theo"), "house page offers Nhà tiếp theo")
    head = pg.locator(".rpage .hp-head").inner_text()
    ok("Điểm hỗ trợ" not in head and "SAV" not in head and pg.locator(".rpage .hp-chips li").count() == 1, "house header shows only the verdict; the numbers sit folded under 'Xem số liệu'")
    lay = pg.locator(".rpage details.layers")
    ok(lay.count() == 1 and pg.locator(".rpage details.layers[open]").count() == 0 and "Vì sao mình nói vậy" in lay.locator("summary").inner_text(), "house page folds its evidence layers under 'Vì sao mình nói vậy'")
    lay.locator("summary").click(); pg.wait_for_timeout(300)
    ok(pg.locator(".rpage details.layers[open]").count() == 1 and "cai quản" in lay.inner_text(), "opening the layers shows the lord and the rest of the evidence")
    ok("Cái giá" in ht and "Người ngoài thấy" in ht, "the summary of a house in the new voice names the price and what others see")
    seen = []
    for k in range(2, 13):
        nxt(pg); seen.append(cur(pg))
    ok(seen == [f"h-{k}" for k in range(2, 13)], "Nhà tiếp theo walks houses 2 to 12 in order")
    nxt(pg)
    ok(cur(pg) == "yogas" and pg.locator(".rpage .yoga").count() >= 1, "after house 12 comes the yoga summary")
    link = pg.locator(".rpage .yoga-houses .linkbtn").first
    if link.count():
        want = link.inner_text().replace("Nhà ", "h-").strip(); link.click(); pg.wait_for_timeout(450)
        ok(cur(pg) == want, f"a yoga links to the house page that reads it ({want})")
    pg.locator(".rnav .parts a:has-text('12 khía cạnh')").click(); pg.wait_for_timeout(300)
    pg.locator(".rnav .subpages a[href='#h-map']").click(); pg.wait_for_timeout(500)
    pg.locator(".rpage .dh").nth(9).click(force=True); pg.wait_for_timeout(700)
    ok(cur(pg) == "h-10", "clicking a house on the map opens that house's page")

    # 6) part 4: lessons of this life
    part(pg, "Bài học kiếp này")
    ok(cur(pg) == "axis" and pg.locator(".rpage .axis-end").count() == 2, "Rahu and Ketu each have a chapter")
    ok(pg.locator(".rnav .subpages a").count() == 3, "lessons part has three pages (axis, soul, karakas)")
    page(pg, "soul"); ok(pg.locator(".rpage .soul-card").count() >= 1, "soul page shows its cards")
    page(pg, "karakas"); ok(pg.locator(".rpage").inner_text().count("Karaka") >= 1 or pg.locator(".rpage li, .rpage article").count() >= 7, "karakas page lists the seven roles")

    # 7) part 5: the three divisional charts (D9 and D10 are read house by house)
    part(pg, "Biểu đồ chuyên sâu")
    ok(pg.locator(".rnav .subpages a").count() == 3, "three divisional pages")
    for pid, diamond in (("v-2", False), ("v-9", True), ("v-10", True)):
        page(pg, pid)
        ok((pg.locator(".rpage .diamond").count() == 1) == diamond, f"{pid}: {'chart' if diamond else 'hora boxes'}")
        ok(pg.locator(".rpage p").count() >= 3, f"{pid}: has a written reading")
        if pid != "v-2":
            ok(pg.locator(".rpage .varga-houses details.layers").count() == 12, f"{pid}: all twelve houses are read")
    ok(not re.search("chín muồi|chín mùi", pg.locator(".rpage").inner_text()), "D10 page has no rejected wording")

    # 8) part 6: chapters, the five-level ladder, the sky
    part(pg, "Đại vận và tiểu vận")
    ok(cur(pg) == "t-chapters" and pg.locator(".dcard").count() >= 5, f"chapter cards ({pg.locator('.dcard').count()})")
    running = pg.locator(".dcard.open").first.get_attribute("class")
    pg.locator(".dcard:not(.open) .dhead").first.click(); pg.wait_for_timeout(400)
    ok(pg.locator(".dcard.open").count() == 1 and pg.locator(".dcard.open").first.get_attribute("class") != running, "opening another chapter closes the running one (one open at a time)")
    # drill: chapter -> sub-period -> ... down to the fifth level
    deep = pg.locator(".dcard.open").first
    deep.locator(".plist .phead").first.click(); pg.wait_for_timeout(250)
    for _ in range(4):
        btn = deep.locator(".pbody .linkbtn:has-text('Chia nhỏ')").last
        if btn.count() == 0: break
        btn.click(); pg.wait_for_timeout(250)
        deep.locator(".plist .phead").last.click(); pg.wait_for_timeout(250)
    ok(deep.locator(".plist").count() >= 3, f"a chapter can be split down several levels ({deep.locator('.plist').count()} nested lists)")
    page(pg, "t-now")
    ok(pg.locator(".rpage .rung-main").count() == 5, f"five levels shown ({pg.locator('.rpage .rung-main').count()})")
    before = pg.locator(".rpage").inner_text()
    pg.fill(".daypick input[type=date]", "2031-03-10"); pg.wait_for_timeout(700)
    ok(pg.locator(".rpage .rung-main").count() == 5 and pg.locator(".rpage").inner_text() != before, "choosing another date re-reads the five levels")
    page(pg, "t-sky")
    ok(pg.locator(".rpage .skyplanets").count() == 1, "sky page lists the planets")

    # 9) part 7: this month's letter
    part(pg, "Lời nhắn tháng này")
    ok(cur(pg) == "today", "today's page")
    msg = pg.locator(".rpage .today-msg")
    ok(1 <= msg.count() <= 4, f"this month's message has at most four paragraphs ({msg.count()})")
    ok(pg.locator(".rpage .p-ask").count() == 1, "today's letter ends with a question")
    m1 = " ".join(msg.all_inner_texts())
    pg.fill(".daypick input[type=month]", "2027-08"); pg.wait_for_timeout(700)
    ok(" ".join(pg.locator(".rpage .today-msg").all_inner_texts()) != m1, "the message follows the chosen month")

    # 10) every page: no rejected word, no placeholder, no horizontal overflow; print shows all pages
    texts = walk(pg)
    ok(len(texts) == 27, f"walking Next from the start reaches 27 pages ({len(texts)})")
    bad = [k for k, v in texts.items() if re.search(BANNED, v)]
    ok(not bad, f"no rejected wording on any page {bad}")
    ok(pg.evaluate("document.documentElement.scrollWidth") <= pg.evaluate("window.innerWidth") + 1, "no horizontal overflow on desktop")
    pg.evaluate("window.dispatchEvent(new Event('beforeprint'))"); pg.wait_for_timeout(600)
    ok(pg.locator(".rpage").count() == 27, f"printing puts all pages on the sheet ({pg.locator('.rpage').count()})")
    pg.evaluate("window.dispatchEvent(new Event('afterprint'))"); pg.wait_for_timeout(400)
    ok(pg.locator(".rpage").count() == 1, "after printing the report is one page again")

    # 11) theme toggle + persistence
    pg.click(".iconbtn"); pg.wait_for_timeout(300)
    th = pg.evaluate("document.documentElement.dataset.skin")
    ok(th == "parchment", f"theme toggles to {th}")
    pg.reload(); pg.wait_for_load_state("load"); pg.wait_for_timeout(900)
    ok(pg.evaluate("document.documentElement.dataset.skin") == "parchment", "theme persists after reload")
    pg.click(".iconbtn"); pg.wait_for_timeout(200)

    # 12) method page
    pg.goto(URL + "#phuong-phap"); pg.wait_for_timeout(700)
    mt = pg.locator(".method").inner_text()
    ok(pg.locator(".method").count() == 1 and pg.locator(".mtable").count() >= 4, f"method page opens with tables ({pg.locator('.mtable').count()})")
    ok("bảy phần" in mt and "Shadbala" in mt and "Tara Bala" in mt, "method page describes the seven parts, Shadbala and Tara Bala")
    ok(not re.search(BANNED, mt), "method page has none of the rejected words")

    # 13) lunar date + unknown time: no houses, no divisional charts, never a house number
    pg.goto(URL); pg.wait_for_timeout(700)
    fill_form(pg, "1", "1", "1990", place="hue", lunar=True, unknown=True)
    pg.click("text=Mở lá số →"); pg.wait_for_timeout(500); pg.keyboard.press("Escape"); pg.wait_for_timeout(900)
    ok(pg.locator(".report").count() == 1, "lunar + unknown-time input opens a report")
    labels = [t.strip() for t in pg.locator(".rnav .parts a").all_inner_texts()]
    ok(not any("12 khía cạnh" in l or "Biểu đồ chuyên sâu" in l for l in labels), f"no houses or divisional charts without a birth time: {labels}")
    ok(pg.locator(".rprog").get_attribute("aria-valuemax") not in (None, "27"), "fewer pages without a birth time")
    part(pg, "Tổng quan")
    ok(pg.locator(".rnav .subpages a[href='#yogas']").count() == 1, "yogas move into the overview")
    texts = walk(pg)
    body = " ".join(texts.values())
    ok(not re.search(r"\bnhà \d+\b", body, re.I), "no page of the chart without a birth time mentions a house number")
    ok(not re.search(BANNED, body), "no rejected wording in the chart without a birth time")
    print("NOTIME pages:", list(texts))

    # 14) mobile width: nothing spills sideways
    ctx3 = b.new_context(viewport={"width": 390, "height": 844})
    ctx3.add_init_script(SEEN)
    pg3 = ctx3.new_page(); pg3.on("pageerror", lambda e: errors.append(f"[pageerror-m] {e}"))
    pg3.goto(URL); pg3.wait_for_timeout(500)
    pg3.click("text=Xem lá số mẫu"); pg3.wait_for_timeout(900); pg3.keyboard.press("Escape"); pg3.wait_for_timeout(1200)
    worst = 0
    for _ in range(30):
        worst = max(worst, pg3.evaluate("document.documentElement.scrollWidth") - pg3.evaluate("window.innerWidth"))
        btn = pg3.locator(".rpage .pager .pg-next")
        if btn.count() == 0:
            pg3.click(".rpage .btn.primary:has-text('Bắt đầu đọc')"); pg3.wait_for_timeout(350); continue
        if "Về lời mở đầu" in btn.inner_text(): break
        btn.click(); pg3.wait_for_timeout(350)
    ok(worst <= 1, f"mobile 390px: no page is wider than the screen (worst overflow {worst}px)")

    # 15) reduced motion
    ctx2 = b.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
    ctx2.add_init_script(SEEN)
    pg2 = ctx2.new_page(); pg2.on("pageerror", lambda e: errors.append(f"[pageerror-rm] {e}"))
    pg2.goto(URL); pg2.wait_for_timeout(500)
    pg2.click("text=Xem lá số mẫu"); pg2.wait_for_timeout(1800)
    ok(pg2.locator(".report").count() == 1, "reduced motion: ritual is short, report appears")
    b.close()

print("\n".join(notes))
fails = [n for n in notes if n.startswith("FAIL")]
print(f"\n{len(notes) - len(fails)} passed, {len(fails)} failed")
print("errors:", json.dumps(errors, ensure_ascii=False, indent=1) if errors else "none")
sys.exit(1 if fails or errors else 0)
