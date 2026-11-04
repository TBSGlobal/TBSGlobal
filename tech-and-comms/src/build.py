"""Build tech-and-comms/index.html from src/template.html.

Inlines the images in ../assets as data URIs and writes the tour calendar
from calendar.json into the page. Run: python3 tech-and-comms/src/build.py
"""
import base64
import json
import pathlib

SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent
ASSETS = ROOT / "assets"

AST = ('<svg viewBox="-50 -50 100 100"><g fill="currentColor">'
       '<rect x="-10" y="-48" width="20" height="96" rx="10"/>'
       '<rect x="-10" y="-48" width="20" height="96" rx="10" transform="rotate(60)"/>'
       '<rect x="-10" y="-48" width="20" height="96" rx="10" transform="rotate(120)"/>'
       '</g></svg>')


def data_uri(name):
    raw = (ASSETS / name).read_bytes()
    return "data:image/jpeg;base64," + base64.b64encode(raw).decode()


html = (SRC / "template.html").read_text()
cal = json.loads((SRC / "calendar.json").read_text())
html = html.replace("__CAL_DATA__", json.dumps(cal, ensure_ascii=False).replace("<", "\\u003c"))
html = html.replace("__AST__", AST)
for key, name in [("SAMUEL", "samuel.jpg"), ("ONAOPEMIPO", "onaopemipo.jpg"),
                  ("MACO", "maco.jpg"), ("UNICORN", "unicorn.jpg")]:
    html = html.replace(f"__IMG_{key}__", data_uri(name))
(ROOT / "index.html").write_text(html)
print("wrote", ROOT / "index.html", len(html), "bytes")
