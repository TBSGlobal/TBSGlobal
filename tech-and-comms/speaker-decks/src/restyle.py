"""Restyle Gabriel's deck into the Tech & Comms design system without touching its content.
usage: python3 -I restyle.py <unpacked dir> <tools dir>
- colours: green/gold/cream -> navy/royal/blue/yellow/paper
- headings: Georgia -> Arial Black (sized down to keep the same footprint)
- background: cream slides get the grid-paper image
- Tech & Comms logo on every slide; asterisk on the title slide
- venue: Legacy Hall -> Multipurpose Hall (the event moved)
"""
import os, re, shutil, sys, glob

U, T = sys.argv[1], sys.argv[2]
COLOURS = {
    '0B3D2E': '071566',  # dark green -> deep navy
    '145A43': '022394',  # green -> royal
    '2E7D5B': '5379F6',  # mid green -> brand blue
    '1B2A23': '131838',  # dark text -> ink
    '5C6B63': '4B537A',  # muted text
    'D4A017': 'FFD60A',  # gold -> yellow
    'DDD6BF': 'D9E0F5',  # beige lines -> grid blue
    'DCE8DF': 'DFE6FF',  # pale green -> soft blue
    'F8F4E9': 'F2F5FC',  # cream -> paper
    'EFF4EE': 'EEF2FF',
    'EFEBDD': 'E8EDF8',
    'E4EEE8': 'E6ECFF',
    'F3E3B0': 'FFF1A6',
    'D6E4DB': 'D6DFFA',
}
EMU = 914400
SCALE = 0.84  # Arial Black is wider than Georgia

def recolour(s):
    return re.sub(r'(val|lastClr)="([0-9A-Fa-f]{6})"', lambda m: f'{m.group(1)}="{COLOURS.get(m.group(2).upper(), m.group(2))}"', s)

def headings(s):
    # shrink runs set in Georgia, then switch the face
    def shrink(m):
        return m.group(1) + str(int(int(m.group(2)) * SCALE)) + m.group(3)
    s = re.sub(r'(<a:(?:rPr|defRPr|endParaRPr)\b[^>]*?\bsz=")(\d+)("[^>]*>(?:(?!</a:(?:rPr|defRPr|endParaRPr)>).)*?typeface="Georgia")', shrink, s, flags=re.S)
    return s.replace('typeface="Georgia"', 'typeface="Arial Black"')

def add_rel(rels_path, rid, target, rtype='http://schemas.openxmlformats.org/officeDocument/2006/relationships/image'):
    r = open(rels_path).read()
    if f'Id="{rid}"' not in r:
        r = r.replace('</Relationships>', f'<Relationship Id="{rid}" Type="{rtype}" Target="{target}"/></Relationships>')
        open(rels_path, 'w').write(r)

def pic(pid, rid, name, x, y, w, h):
    e = lambda v: int(v * EMU)
    return (f'<p:pic><p:nvPicPr><p:cNvPr id="{pid}" name="{name}" descr="{name}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>'
            f'<p:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>'
            f'<p:spPr><a:xfrm><a:off x="{e(x)}" y="{e(y)}"/><a:ext cx="{e(w)}" cy="{e(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>')

for f in ['tc-grid.png', 'tc-logo.png', 'tc-logo-white.png', 'tc-ast.png']:
    shutil.copy(os.path.join(T, f), os.path.join(U, 'ppt/media', f))

parts = glob.glob(f'{U}/ppt/slides/*.xml') + glob.glob(f'{U}/ppt/slideLayouts/*.xml') + glob.glob(f'{U}/ppt/slideMasters/*.xml') + glob.glob(f'{U}/ppt/charts/*.xml')
for p in parts:
    s = open(p, encoding='utf-8').read()
    s = headings(recolour(s))
    open(p, 'w', encoding='utf-8').write(s)

# theme fonts: headings follow the new face too
th = f'{U}/ppt/theme/theme1.xml'
s = open(th, encoding='utf-8').read()
s = re.sub(r'(<a:majorFont><a:latin typeface=")[^"]*"', r'\1Arial Black"', s)
open(th, 'w', encoding='utf-8').write(s)

LOGO_H = 0.46
for p in sorted(glob.glob(f'{U}/ppt/slides/slide*.xml'), key=lambda x: int(re.findall(r'(\d+)', os.path.basename(x))[0])):
    n = int(re.findall(r'(\d+)', os.path.basename(p))[0])
    rels = f'{U}/ppt/slides/_rels/slide{n}.xml.rels'
    s = open(p, encoding='utf-8').read()
    # grid-paper background on light slides
    if '<p:bg><p:bgPr><a:solidFill><a:srgbClr val="F2F5FC"/></a:solidFill>' in s:
        add_rel(rels, 'rIdTcGrid', '../media/tc-grid.png')
        s = s.replace('<p:bg><p:bgPr><a:solidFill><a:srgbClr val="F2F5FC"/></a:solidFill>',
                      '<p:bg><p:bgPr><a:blipFill dpi="0" rotWithShape="1"><a:blip r:embed="rIdTcGrid"/><a:srcRect/><a:stretch><a:fillRect/></a:stretch></a:blipFill>')
    ids = [int(i) for i in re.findall(r'<p:cNvPr id="(\d+)"', s)] or [1]
    nid = max(ids) + 1
    extra = ''
    if n == 1:   # title: white logo above the title, asterisk at the panel edge
        add_rel(rels, 'rIdTcLogoW', '../media/tc-logo-white.png'); add_rel(rels, 'rIdTcAst', '../media/tc-ast.png')
        extra += pic(nid, 'rIdTcLogoW', 'Tech and Comms logo', 0.7, 0.42, LOGO_H * 1.3 * 900 / 402, LOGO_H * 1.3)
        extra += pic(nid + 1, 'rIdTcAst', 'Asterisk', 6.75, 4.35, 1.0, 1.0)
    elif 'name="Image 0"' in s and n == 23:  # closing: white logo inside the dark panel
        add_rel(rels, 'rIdTcLogoW', '../media/tc-logo-white.png')
        extra += pic(nid, 'rIdTcLogoW', 'Tech and Comms logo', 7.25, 0.5, LOGO_H * 900 / 402, LOGO_H)
    else:        # content slides: full-colour logo, top right
        add_rel(rels, 'rIdTcLogo', '../media/tc-logo.png')
        w = LOGO_H * 900 / 402
        extra += pic(nid, 'rIdTcLogo', 'Tech and Comms logo', 13.333 - 0.6 - w, 0.38, w, LOGO_H)
    s = s.replace('</p:spTree>', extra + '</p:spTree>', 1)
    s = s.replace('Legacy Hall', 'Multipurpose Hall')
    open(p, 'w', encoding='utf-8').write(s)

# png content type
ct = f'{U}/[Content_Types].xml'
c = open(ct).read()
if 'Extension="png"' not in c:
    c = c.replace('<Default Extension="xml"', '<Default Extension="png" ContentType="image/png"/><Default Extension="xml"')
    open(ct, 'w').write(c)
print('done')
