"""Build one HTML file per speaker on the TCBR letterhead; render.js turns them into PDFs."""
import base64, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from content import EVENT, ABOUT, TONE, NEEDS, SPEAKERS

HERE = pathlib.Path(__file__).parent
FONTS = pathlib.Path(sys.argv[1])
LH = base64.b64encode((HERE / "lh" / "bg-000.jpg").read_bytes()).decode()

def font(name, file, weight=400, style="normal"):
    b = base64.b64encode((FONTS / file).read_bytes()).decode()
    return f"@font-face{{font-family:'{name}';font-weight:{weight};font-style:{style};src:url(data:font/woff2;base64,{b}) format('woff2')}}"

FONT_CSS = "".join([
    font("Montserrat", "montserrat-latin-400-normal.woff2", 400),
    font("Montserrat", "montserrat-latin-700-normal.woff2", 700),
    font("Montserrat", "montserrat-latin-800-normal.woff2", 800),
    font("Montserrat", "montserrat-latin-400-italic.woff2", 400, "italic"),
    font("DM Serif Display", "dm-serif-display-latin-400-italic.woff2", 400, "italic"),
])

CSS = """
@page{size:A4;margin:56mm 20mm 26mm 20mm}
*{box-sizing:border-box}
html,body{margin:0}
body{font:9.6pt/1.55 Montserrat,Arial,sans-serif;color:#1b2140}
.lh{position:fixed;top:-56mm;left:-20mm;width:210mm;height:297mm;z-index:-1}
.lh img{width:100%;height:100%;display:block}
.kicker{font-weight:800;font-size:7.6pt;letter-spacing:.28em;text-transform:uppercase;color:#5a7bfe;margin:0 0 2mm}
h1{font-weight:800;font-size:19pt;line-height:1.15;color:#131838;margin:0 0 1.5mm}
.sub{font-family:'DM Serif Display',Georgia,serif;font-style:italic;font-size:13pt;color:#4b537a;margin:0 0 5mm}
.who{display:flex;gap:6mm;align-items:baseline;border-top:2px solid #131838;border-bottom:1px solid #cfd7f0;padding:3mm 0;margin-bottom:5mm}
.who b{font-size:12pt;color:#131838}
.who span{font-weight:700;font-size:7.6pt;letter-spacing:.2em;text-transform:uppercase;color:#fff;background:#5a7bfe;padding:1mm 2.6mm;border-radius:10mm}
table.facts{width:100%;border-collapse:collapse;margin-bottom:5mm;font-size:9pt}
table.facts td{padding:1.6mm 0;border-bottom:1px solid #e2e8f8;vertical-align:top}
table.facts td:first-child{width:30mm;font-weight:800;font-size:7.2pt;letter-spacing:.18em;text-transform:uppercase;color:#4b537a;padding-top:2.2mm}
h2{font-weight:800;font-size:11pt;color:#131838;margin:6mm 0 2mm;break-after:avoid}
h2 i{font-style:normal;color:#5a7bfe;margin-right:2mm}
p{margin:0 0 2.4mm}
ul{margin:0 0 2mm;padding-left:5mm}
li{margin:0 0 1.4mm}
.flow{width:100%;border-collapse:collapse;font-size:9pt}
.flow td{padding:1.8mm 2mm;border-bottom:1px solid #e2e8f8;vertical-align:top}
.flow td:first-child{width:8mm;font-weight:800;color:#5a7bfe}
.flow td:nth-child(2){width:34mm;font-weight:800;color:#131838}
.box{background:#f2f5fc;border-left:3px solid #5a7bfe;padding:3mm 4mm;margin:2mm 0 3mm;break-inside:avoid}
.box p:last-child,.box ul:last-child{margin-bottom:0}
.q{break-inside:avoid}
.qtag{display:inline-block;font-weight:800;font-size:6.8pt;letter-spacing:.16em;text-transform:uppercase;color:#131838;background:#ffd60a;padding:.4mm 2mm;border-radius:6mm;margin-right:2mm;vertical-align:1px}
.sig{margin-top:7mm;padding-top:3mm;border-top:1px solid #cfd7f0;font-size:9pt;break-inside:avoid}
.sig b{color:#131838}
.avoid{break-inside:avoid}
"""

def esc_list(items):
    return "".join(f"<li>{x}</li>" for x in items)

def page(s):
    facts = [("Date", EVENT["date"]), ("Venue", EVENT["venue"]), ("Your role", s["role"]), ("Your session", s["topic"]),
             ("Length", s["length"]), ("Audience", EVENT["audience"]),
             ("Format", EVENT["format"]), ("Partners", EVENT["partners"])]
    h = [f"<!doctype html><html><head><meta charset='utf-8'><style>{FONT_CSS}{CSS}</style></head><body>",
         f"<p class='kicker'>Tech &amp; Comms · Speaker concept note · {s['kicker']}</p>",
         f"<h1>{s['topic']}</h1><p class='sub'>Where Communications Meet Technology</p>",
         f"<div class='who'><b>{s['name']}</b><span>{s['role']}</span></div>",
         "<table class='facts'>" + "".join(f"<tr><td>{k}</td><td>{v}</td></tr>" for k, v in facts) + "</table>",
         f"<h2><i>01</i>About Tech &amp; Comms</h2><p>{ABOUT}</p>"]
    if s.get("host"):
        h.append(f"<div class='box'><p>{s['host']}</p></div>")
    n = 2
    h.append(f"<h2><i>0{n}</i>{'Why this session matters' if 'flow' in s else 'Why you are on the panel'}</h2>" + "".join(f"<p>{x}</p>" for x in s["why"])); n += 1
    h.append(f"<h2><i>0{n}</i>{'What we would love you to cover' if 'flow' in s else 'Your angle on the panel'}</h2><ul>{esc_list(s['cover'])}</ul>"); n += 1
    if "flow" in s:
        rows = "".join(f"<tr><td>{i+1}</td><td>{a}</td><td>{b}</td></tr>" for i, (a, b) in enumerate(s["flow"]))
        h.append(f"<div class='avoid'><h2><i>0{n}</i>Suggested flow</h2><table class='flow'>{rows}</table><p style='margin-top:2mm;color:#4b537a;font-size:8.6pt'>A suggestion only. Shape it around your own stories.</p></div>"); n += 1
    else:
        qs = "".join(f"<li class='q'><span class='qtag'>{t}</span>{q}</li>" for t, q in s["panel_q"])
        h.append(f"<h2><i>0{n}</i>Questions the moderator may ask you</h2><p>The host moderates. You won't be asked every question; they're here so you can prepare.</p><ol style='padding-left:5mm;margin:0 0 2mm'>{qs}</ol>"); n += 1
    h.append(f"<div class='avoid'><h2><i>0{n}</i>What students should leave with</h2><div class='box'><ul>{esc_list(s['takeaways'])}</ul></div></div>"); n += 1
    if s.get("questions"):
        h.append(f"<div class='avoid'><h2><i>0{n}</i>Questions students may ask you</h2><ul>{esc_list(s['questions'])}</ul></div>"); n += 1
    h.append(f"<div class='avoid'><h2><i>0{n}</i>Tone and approach</h2><ul>{esc_list(TONE)}</ul></div>"); n += 1
    h.append(f"<div class='avoid'><h2><i>{n:02d}</i>What we need from you</h2><ul>{esc_list(NEEDS)}</ul></div>"); n += 1
    h.append("<div class='sig'>Thank you for giving your time to the next generation of communicators.<br><br>"
             "<b>Samuel Ogundeji</b><br>Founder &amp; Lead Strategist, The Comms Boardroom Technologies (TCBR)<br>"
             "08160122896 · info@thecommsboardroom.com · www.thecommsboardroom.com</div>")
    h.append("</body></html>")
    return "".join(h)

out = HERE / "html"; out.mkdir(exist_ok=True)
for s in SPEAKERS:
    (out / f"{s['slug']}.html").write_text(page(s))
print("built", len(SPEAKERS))
