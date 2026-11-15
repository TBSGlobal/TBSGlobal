import sys,re,json
L=open(sys.argv[1]).read().split('\n')
starts=[i for i,l in enumerate(L) if re.match(r'^\s*Global [Cc]ourse [Ss]tructure\s*$',l)]
names=['Advertising','Broadcasting','Development Communication Studies','Film and Multimedia','Information and Media Studies','Journalism and Media Studies','Mass Communication','Public Relations','Strategic Communication']
out={}
for n,s in zip(names,starts):
    e=s+1
    while e<len(L) and not re.search(r'Course Contents',L[e]): e+=1
    rows=[]; level='100'
    for l in L[s:e]:
        m=re.match(r'^\s*(\d)00\s*[Ll]evel',l)
        if m: level=m.group(1)+'00'; continue
        cm=re.match(r'^\s*(?:\d{1,2}\s+)?([A-Z1]{3})\s?(\d{3})\s+(.+?)\s+(\d{1,2})\s+([CE])\b',l)
        if cm:
            rows.append({'code':cm.group(1)+' '+cm.group(2),'title':re.sub(r'\s+',' ',cm.group(3)).strip(),'units':int(cm.group(4)),'status':cm.group(5),'level':level}); continue
        cont=l.strip()
        if rows and cont and re.match(r'^[A-Za-z(&/]',cont) and not re.match(r'^(TOTAL|COURSE|Course|CODE|Code|400 LEVEL)',cont) and len(l)-len(l.lstrip())>=5 and not re.search(r'\d+\s+[CE]\b',cont):
            rows[-1]['title']+=' '+re.sub(r'\s+',' ',cont)
    out[n]=rows
json.dump(out,open(sys.argv[2],'w'),indent=1)
for k,v in out.items(): print(k,len(v),sum(r['units'] for r in v))
