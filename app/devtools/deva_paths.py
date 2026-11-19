# Shape three Sanskrit terms with HarfBuzz from Noto Serif Devanagari (SIL OFL 1.1) and write their outlines as SVG path data.
import json, sys, io, math, random
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
src = sys.argv[1]
ft = TTFont(src); buf = io.BytesIO(); ft.flavor = None; ft.save(buf); data = buf.getvalue()
face = hb.Face(data); font = hb.Font(face); upem = face.upem
gs = ft.getGlyphSet(); order = ft.getGlyphOrder()
out = {}
random.seed(7)
for word in ["ज्योतिष", "नवग्रह", "नक्षत्र"]:
    b = hb.Buffer(); b.add_str(word); b.guess_segment_properties(); hb.shape(font, b, {})
    x = 0; pen = SVGPathPen(gs); rec = RecordingPen()
    for info, pos in zip(b.glyph_infos, b.glyph_positions):
        name = order[info.codepoint]
        t = (1/upem, 0, 0, -1/upem, (x + pos.x_offset)/upem, -pos.y_offset/upem + 0.0)
        gs[name].draw(TransformPen(pen, t)); gs[name].draw(TransformPen(rec, t))
        x += pos.x_advance
    # sample points along the outline (flattened) for the particles that fly out of the ink
    pts = []; cur = None; start = None
    def seg(a, bb, n):
        for i in range(n): pts.append((a[0]+(bb[0]-a[0])*i/n, a[1]+(bb[1]-a[1])*i/n))
    for op, args in rec.value:
        if op == "moveTo": cur = start = args[0]
        elif op == "lineTo": seg(cur, args[0], 3); cur = args[0]
        elif op in ("qCurveTo", "curveTo"):
            p = args[-1]; ctrl = args[:-1]
            prev = cur
            for i in range(1, 7):
                tt = i/6
                if op == "curveTo" and len(ctrl) == 2:
                    a, c1, c2, d = cur, ctrl[0], ctrl[1], p
                    q = [ (1-tt)**3*a[k] + 3*(1-tt)**2*tt*c1[k] + 3*(1-tt)*tt**2*c2[k] + tt**3*d[k] for k in (0,1) ]
                else:
                    c = ctrl[0] if ctrl else cur
                    q = [ (1-tt)**2*cur[k] + 2*(1-tt)*tt*c[k] + tt**2*p[k] for k in (0,1) ]
                pts.append(tuple(q))
            cur = p
        elif op == "closePath" and cur and start: seg(cur, start, 3); cur = start
    random.shuffle(pts)
    w = x/upem
    out[word] = {"d": pen.getCommands(), "w": round(w, 4), "pts": [[round(a,3), round(c,3)] for a, c in pts[:140]]}
print(json.dumps(out, ensure_ascii=False))
