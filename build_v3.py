from pathlib import Path
import re
root=Path(__file__).parent
base=root/'index.v2.html'
if base.exists():
    src=base.read_text('utf-8')
else:
    from subprocess import check_output
    from subprocess import CalledProcessError
    try:
        src=check_output(['git','show','origin/main:index.html'],cwd=root,text=True)
    except (FileNotFoundError,CalledProcessError):
        # Supports the original v2 working directory before the release is assembled.
        src=(root/'index.html').read_text('utf-8')
        assert 'window.LAV3.enhance' not in src, 'Missing v2 baseline; supply index.v2.html or git origin/main' 
engine=(root/'v3-engine.js').read_text('utf-8')
assert 'function Rx(a)' in src

def replace_exact(s, old,new,label):
    n=s.count(old)
    assert n==1,(label,n)
    return s.replace(old,new,1)

# Keep the original calculation engine; route its completed reading through the tested narrative layer.
m=re.search(r'function Rx\(a\)\{.*?\}\}(?=function )',src)
assert m, 'reading factory not found'
fn=m.group(0)
newfn=fn.replace('return{meta:', 'const v3reading={meta:',1).replace('today:$o(a)}}','today:$o(a)};return typeof window!=="undefined"&&window.LAV3?window.LAV3.enhance(v3reading,a):v3reading}',1)
assert newfn!=fn and 'v3reading' in newfn
src=src[:m.start()]+newfn+src[m.end():]
# Day/month navigation creates a new reading outside Rx; apply the same reference-frame split.
src=replace_exact(src,'function ju(a,e){const l=No(a,e);return{ladder:_o(l),sky:Uo(l),today:$o(l)}}',
                      'function ju(a,e){const l=No(a,e);return{ladder:_o(l),sky:typeof window!=="undefined"&&window.LAV3?window.LAV3.gochara(Uo(l)):Uo(l),today:$o(l)}}', 'dynamic sky')

# The opening becomes four connected paragraphs; retain chips and navigation.
# The overview is one integrated, chart-grounded narrative, not three parallel horoscopes.
start=src.index('function eM({prepared:a})')
stop=src.index('const aM=',start)
newOverview='''function eM({prepared:a}){const e=a.reading.overview;return u.jsxs(u.Fragment,{children:[u.jsx("p",{className:"eyebrow reveal",children:"Tổng quan"}),u.jsx("h2",{className:"reveal",children:"Những đường nét làm nên câu chuyện của bạn"}),u.jsx("div",{className:"v3-story",children:(e.story||[]).map((l,c)=>u.jsxs("article",{className:"v3-story-part card reveal",children:[u.jsx("p",{className:"eyebrow",children:`0${c+1} · ${c===0?"Bức tranh chung":"Chiều sâu"}`}),u.jsx("h3",{children:l.title}),u.jsx(H2,{list:l.paragraphs}),l.evidence&&l.evidence.length>0&&u.jsxs("details",{className:"params mini",children:[u.jsx("summary",{children:"Vì sao mình nói điều này?"}),u.jsx("ul",{className:"v3-evidence",children:l.evidence.map((p,k)=>u.jsx("li",{children:p},k))})]})]},l.id))})]})}'''
src=src[:start]+newOverview+src[stop:]
# Keep planet tables as technical lookups elsewhere, not as a renamed 'nine characters' section in Overview.
start=src.index('function gM({prepared:a})')
stop=src.index('function uM({prepared:a',start)
newCommons='''function gM({prepared:a}){const e=a.reading.overview;return u.jsxs(u.Fragment,{children:[u.jsx("p",{className:"eyebrow reveal",children:"Tổng quan"}),u.jsx("h2",{className:"reveal",children:"Những nét chung và nguồn lực"}),u.jsx("div",{className:"commons",children:e.common.map(l=>u.jsxs("article",{className:"card common reveal",children:[u.jsx("h3",{children:l.title}),u.jsx(H2,{list:l.paragraphs})]},l.id))}),e.strength&&u.jsxs("section",{className:"card strength reveal",children:[u.jsx("h3",{children:"Sức mạnh của bảy hành tinh"}),u.jsx("p",{children:u.jsx(_n,{text:e.strength.intro})}),u.jsx(cM,{rows:e.strength.rows}),u.jsx("p",{children:e.strength.best}),u.jsx("p",{children:e.strength.worst})]})]})}'''
src=src[:start]+newCommons+src[stop:]

# Remove all of the named sections and their layout wrappers.
start=src.index('u.jsxs("section",{className:"devas"')
end=src.index('u.jsxs("section",{className:"author"',start)
src=src[:start]+src[end:]
src=replace_exact(src,'u.jsx("div",{className:"intake-side reveal",children:u.jsx("h2",{children:"Bắt đầu từ ba điều bạn nhớ"})}),','', 'remove form title')

# The text export must reflect the new overview without the deleted planetary cast.
start=src.index('m(e.overview.link.title),d(e.overview.link.paragraphs),m(e.overview.cast.title)')
end=src.index('for(const b of e.overview.common)',start)
src=src[:start]+'for(const b of e.overview.story||[])m(b.title),d(b.paragraphs);'+src[end:]

# Clear outdated descriptive copy within the compiled bundle (not merely display:none).
src=src.replace('Yk="Chín nhân vật trong lá số của bạn"','Yk=""')
src=re.sub(r'Zk="Mỗi hành tinh là một nhân vật[^"\n]*"','Zk=""',src,count=1)
src=src.replace('nav:"Ba điểm gốc",label:"Tổng quan: ba điểm gốc"','nav:"Bức tranh chung",label:"Tổng quan: bức tranh chung"')

# Include the narrative engine inside the HTML file, preserving single-file GitHub Pages deployments.
load='<script type="module" crossorigin>'
assert src.count(load)==1
src=src.replace(load, '<script>\n'+engine.replace('</script','<\\/script')+'\n</script>\n    '+load,1)

# Accessibility, responsive long-form typography and a single-column intake form.
css='''\n/* Life Atlas v3 narrative presentation */
.letter .headline{white-space:pre-line;font:400 clamp(1.08rem,1.1rem + .3vw,1.35rem)/1.95 var(--font-display);max-width:68ch;letter-spacing:.015em;text-wrap:pretty;margin-inline:auto}
.v3-story{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(1rem,2.5vw,2rem)}
.v3-story-part{padding:clamp(1.35rem,3vw,2.5rem);max-width:78ch;margin-inline:auto;width:100%}
.v3-story-part h3{font:500 clamp(1.35rem,1.8vw,1.85rem)/1.3 var(--font-display);margin:.4em 0 1.15em;color:var(--gold,#d5b477)}
.v3-story-part p{line-height:1.85;max-width:70ch;text-wrap:pretty}
.v3-story-part p+p{margin-top:1.1rem}
.v3-evidence{margin:1rem 0 0;padding-left:1.25rem;font-size:.9rem;line-height:1.65}
.intake-wrap{grid-template-columns:minmax(0,1fr);max-width:760px;margin-inline:auto}
.skyplanets article.sp >p{white-space:pre-line;line-height:1.8}
@media(max-width:600px){.letter .headline{font-size:1.08rem;line-height:1.85}.v3-story-part{padding:1.3rem}.v3-story-part h3{font-size:1.38rem}}
'''
src=replace_exact(src,'</style>',''+css+'</style>','styles')

assert 'Chín hành tinh, chín vị gìn giữ' not in src
assert 'Bắt đầu từ ba điều bạn nhớ' not in src
assert 'Chín nhân vật trong lá số của bạn' not in src
assert 'function Rx(a)' in src and 'window.LAV3.enhance' in src
out=root/'index.v3.html'
out.write_text(src,'utf-8')
# Pull the script into a checkable .mjs for syntax validation.
script=src.split('<script type="module" crossorigin>',1)[1].split('</script>',1)[0]
(root/'bundle.v3.mjs').write_text(script,'utf-8')
print('Wrote',out,'bytes',out.stat().st_size)
print('compiled module chars:',len(script))