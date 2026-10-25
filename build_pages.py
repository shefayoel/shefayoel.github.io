# גרסה 2 - 2026-10-25 - משימה יג-ד: גם דפים לפי מספר רץ /y/1 עד /y/2000 ו-/e/1 עד /e/2000 (קוראים מהממשק לפי מספר).
# הדפים הישנים לפי תאריך (y/DDMM, e/DDMM) נשארים ועובדים. שם של 4 ספרות שהוא גם מספר וגם תאריך (למשל 1501) -
# דף אחד: קודם לפי המספר, ואם אין הודעה במספר הזה - לפי התאריך (site.js). (1: דף לכל יום בשנה)
import os
N_MAX = 2000
for l, lang, d in [("y", "yi", "rtl"), ("e", "en", "ltr")]:
    os.makedirs(l, exist_ok=True)
    names = {}
    for m in range(1, 13):
        for day in range(1, 32):
            if (m == 2 and day > 29) or (m in (4, 6, 9, 11) and day > 30): continue
            names.setdefault(f"{day:02d}{m:02d}", {})["ddmm"] = f"{day:02d}{m:02d}"
    for n in range(1, N_MAX + 1):
        names.setdefault(str(n), {})["n"] = str(n)
    for name, v in sorted(names.items()):
        front = f'---\nlayout: base\nkind: day\nl: {l}\n' + (f'ddmm: "{v["ddmm"]}"\n' if "ddmm" in v else '') + \
                (f'n: "{v["n"]}"\n' if "n" in v else '') + f'htmllang: {lang}\ndir: {d}\n---\n'
        open(f"{l}/{name}.html", "w", encoding="utf-8").write(front + '<h1>שפע יואל</h1>\n<div id="msg"></div>\n<div id="join"></div>\n')
