#!/usr/bin/env python3
"""FutNexo: isolate product photography, preserve original files via git history.
Only accepts masks with credible size and nonempty garment edges.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageOps
from rembg import remove, new_session
import json, sys
ROOT=Path("assets/catalogo")
files=sorted(ROOT.glob("*.webp"))
session=new_session("u2netp")
ok=[]; skipped=[]
for i,path in enumerate(files,1):
    try:
        original=Image.open(path).convert("RGBA")
        w,h=original.size
        if w<100 or h<100: skipped.append((path.name,"too small"));continue
        result=remove(original,session=session,alpha_matting=False,post_process_mask=True)
        result=result.convert("RGBA")
        a=result.getchannel("A")
        hist=a.histogram()
        coverage=sum(hist[96:])/float(w*h)
        box=a.point(lambda p:255 if p>=96 else 0).getbbox()
        if not box or not (0.12<=coverage<=0.85):
            skipped.append((path.name,"mask coverage %.2f"%coverage));continue
        left,top,right,bottom=box
        if (right-left)<w*.22 or (bottom-top)<h*.28:
            skipped.append((path.name,"mask too narrow"));continue
        # Do not erase photos with a highly fragmented mask.
        if sum(hist[:16])<w*h*.06:
            skipped.append((path.name,"no removable background"));continue
        # Keep original dimensions and layout; transparency reveals the card background.
        output=BytesIO()
        result.save(output,"WEBP",lossless=True,method=4)
        path.write_bytes(output.getvalue())
        ok.append(path.name)
    except Exception as exc:
        skipped.append((path.name,str(exc)[:160]))
    if i%40==0: print("Processed",i,"/",len(files),flush=True)
Path("INFORME_RECORTE_FONDOS.json").write_text(json.dumps({"processed":len(files),"updated":ok,"skipped":skipped},ensure_ascii=False,indent=2),encoding="utf-8")
print("Updated",len(ok),"Skipped",len(skipped))
