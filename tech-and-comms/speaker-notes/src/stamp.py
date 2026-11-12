"""Lay the TCBR letterhead (from the concept note) under every page of each PDF."""
import sys, pathlib
from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
here = pathlib.Path(sys.argv[1]); src = here / 'pdf'; dst = here / 'final'; dst.mkdir(exist_ok=True)
lh_pdf = here / 'letterhead.pdf'
c = canvas.Canvas(str(lh_pdf), pagesize=A4); c.drawImage(str(here / 'lh' / 'bg-000.jpg'), 0, 0, width=A4[0], height=A4[1]); c.save()
for f in sorted(src.glob('*.pdf')):
    w = PdfWriter()
    for pg in PdfReader(str(f)).pages:
        base = PdfReader(str(lh_pdf)).pages[0]
        base.merge_page(pg)
        w.add_page(base)
    w.add_metadata({'/Title': f.stem.replace('_', ' ').replace('-', ' '), '/Author': 'Samuel Ogundeji, The Comms Boardroom'})
    w.write(str(dst / f.name)); print(dst / f.name)
