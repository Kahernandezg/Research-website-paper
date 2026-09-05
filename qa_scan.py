#!/usr/bin/env python3
"""QA scan: dual-width slow-scroll, console/pageerror capture, screenshots."""
import sys, time
from playwright.sync_api import sync_playwright

W = int(sys.argv[1]) if len(sys.argv) > 1 else 1680
TAG = sys.argv[2] if len(sys.argv) > 2 else "w"
URL = "http://localhost:8471/index.html"
OUT = "/tmp/qa"
import os; os.makedirs(OUT, exist_ok=True)

errors, consoles = [], []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/chromium",
        args=["--no-sandbox", "--disable-dev-shm-usage"])
    pg = browser.new_page(viewport={"width": W, "height": 1000})
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: consoles.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    pg.goto(URL, wait_until="networkidle")
    pg.wait_for_timeout(2200)
    pg.screenshot(path=f"{OUT}/{TAG}_00_cover.png")
    # slow scroll to trigger IO animations
    y, i = 0, 1
    sh = pg.evaluate("document.body.scrollHeight")
    while y < sh:
        pg.evaluate(f"scrollTo(0,{y})")
        pg.wait_for_timeout(140)
        y += 700
    pg.wait_for_timeout(1600)
    # element screenshots
    targets = ["sec-exec", "evidence-chart", "network-chart", "shelf-chart", "cited-chart",
               "periphery-chart", "scatter-chart", "prod-table", "quartile-chart",
               "topics-chart", "verdict-chart", "sec-sources"]
    for t in targets:
        try:
            el = pg.locator("#" + t)
            el.scroll_into_view_if_needed()
            pg.wait_for_timeout(900)
            el.screenshot(path=f"{OUT}/{TAG}_{t}.png")
        except Exception as e:
            errors.append(f"shot {t}: {e}")
    # overflow + font checks
    res = pg.evaluate("""() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        font: document.fonts.check('16px et-book'),
        sh: document.body.scrollHeight })""")
    print("RESULT", res)
    # cover variants
    for mode in ["x", "w"]:
        pg.evaluate("scrollTo(0,0)")
        pg.wait_for_timeout(400)
        pg.click(f'#cover-mode button[data-mode="{mode}"]')
        pg.wait_for_timeout(2000)
        pg.screenshot(path=f"{OUT}/{TAG}_cover_{mode}.png")
    browser.close()

print("PAGEERRORS:", len(errors))
for e in errors[:12]: print("  ", e[:300])
print("CONSOLE(err/warn):", len(consoles))
for c in consoles[:12]: print("  ", c[:300])
