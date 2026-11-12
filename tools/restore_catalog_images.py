#!/usr/bin/env python3
"""Restaurar fotos V3.63 desde las imágenes incrustadas en el commit V3.62.

Comprueba cada archivo frente a su nombre derivado de SHA-256.
No descarga fuentes externas ni sobrescribe páginas o fichas de producto.
"""
from pathlib import Path
import base64
import hashlib
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
SOURCE_REF = "122bbb34debc586524fc399c63663c1ccf3589c4"
SOURCES = (
    "catalogo-pedidos.js", "index.html", "clubes.html", "selecciones.html",
    "nba.html", "retro.html", "chandals.html", "entrenamiento.html",
)
IMAGE_RE = re.compile(rb"data:image/[A-Za-z0-9+.-]+;base64,([A-Za-z0-9+/=]+)")
PATH_RE = re.compile(rb"assets/catalogo/([0-9a-f]{24}\.(?:webp|png|jpg|jpeg))")


def main():
    expected = set()
    for filename in SOURCES:
        expected.update(m.decode("ascii") for m in PATH_RE.findall((ROOT / filename).read_bytes()))
    if len(expected) != 310:
        raise SystemExit(f"Error: se esperaban 310 rutas únicas, pero hay {len(expected)}.")

    recovered = {}
    for filename in SOURCES:
        old = subprocess.check_output(["git", "show", f"{SOURCE_REF}:{filename}"], cwd=ROOT)
        for value in IMAGE_RE.findall(old):
            binary = base64.b64decode(value, validate=True)
            prefix = hashlib.sha256(binary).hexdigest()[:24]
            for extension in ("webp", "png", "jpg", "jpeg"):
                name = f"{prefix}.{extension}"
                if name in expected:
                    recovered[name] = binary
                    break

    missing = expected - recovered.keys()
    if missing:
        raise SystemExit("No se han recuperado: " + ", ".join(sorted(missing)))

    dest = ROOT / "assets" / "catalogo"
    dest.mkdir(parents=True, exist_ok=True)
    for name, binary in sorted(recovered.items()):
        output = dest / name
        if not output.exists() or output.read_bytes() != binary:
            output.write_bytes(binary)
    print(f"{len(recovered)} fotografías recuperadas y verificadas mediante SHA-256.")


if __name__ == "__main__":
    main()
