# יוצר דף לכל יום בשנה: y/DDMM.html (אידיש) ו-e/DDMM.html (אנגלית). כל הדפים זהים - התוכן נקרא מה-Web app
import os
for l, lang, d in [("y", "yi", "rtl"), ("e", "en", "ltr")]:
    os.makedirs(l, exist_ok=True)
    for m in range(1, 13):
        for day in range(1, 32):
            if (m == 2 and day > 29) or (m in (4, 6, 9, 11) and day > 30): continue
            dm = f"{day:02d}{m:02d}"
            open(f"{l}/{dm}.html", "w", encoding="utf-8").write(
                f'---\nlayout: base\nkind: day\nl: {l}\nddmm: "{dm}"\nhtmllang: {lang}\ndir: {d}\n---\n'
                '<h1>שפע יואל</h1>\n<div id="msg"></div>\n<div id="join"></div>\n')
