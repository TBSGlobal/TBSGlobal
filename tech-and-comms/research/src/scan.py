import sys,re,json
L=open(sys.argv[1]).read().split('\n')
starts=[i for i,l in enumerate(L) if re.match(r'^\s*Global [Cc]ourse [Ss]tructure\s*$',l)]
names=['Advertising','Broadcasting','Development Communication Studies','Film and Multimedia','Information and Media Studies','Journalism and Media Studies','Mass Communication','Public Relations','Strategic Communication']
bounds=[(n,s,(starts[i+1] if i+1<len(starts) else len(L))) for i,(n,s) in enumerate(zip(names,starts))]
KW={'Artificial intelligence / AI':r'artificial intelligence|\bAI\b|machine learning|algorithm',
    'Social listening':r'social listening|media listening|\blistening tools?',
    'Media monitoring':r'media monitoring|monitoring of (the )?media|press clipping|media tracking',
    'Measurement & evaluation':r'measurement|\bevaluat\w*|\bmetrics?\b|\bKPIs?\b|\bROI\b|return on investment|impact assessment|Barcelona|AMEC',
    'Data & analytics':r'\bdata\b|analytics|big data|dashboard|sentiment',
    'Digital / social media':r'digital|social media|online|new media|internet'}
res={}
for n,s,e in bounds:
    seg='\n'.join(L[s:e])
    # split into courses by headings like "PRS 301: Title"
    courses=re.split(r'\n\s*(?=[A-Z]{3}\s?\d{3}\s*:)',seg)
    r={}
    for k,pat in KW.items():
        hits=[]
        for c in courses:
            m=re.match(r'\s*([A-Z]{3}\s?\d{3})\s*:\s*([^\n(]+)',c)
            if not m: continue
            cnt=len(re.findall(pat,c,re.I))
            if cnt: hits.append((m.group(1).replace('  ',' '),m.group(2).strip()[:60],cnt))
        r[k]=hits
    res[n]=r
json.dump(res,open(sys.argv[2],'w'),indent=1)
for n,r in res.items():
    print('\n##',n)
    for k,h in r.items(): print(f'  {k}: {len(h)} courses', [f"{a} {b}" for a,b,c in h][:6])
