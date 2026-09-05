#!/usr/bin/env python3
"""Empaqueta el sitio en un solo HTML autocontenido (abre con file://).
Incrusta css/*.css y todos los <script src> en el orden original.
Uso: python3 tools/bundle.py [salida]
"""
import re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

def css_repl(m):
    css = open(os.path.join(ROOT, m.group(1)), encoding="utf-8").read()
    return "<style>\n" + css + "\n</style>"
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', css_repl, html)

def js_repl(m):
    code = open(os.path.join(ROOT, m.group(1)), encoding="utf-8").read()
    return "<script>\n" + code + "\n</script>"
html = re.sub(r'<script src="(js/[^"]+)"></script>', js_repl, html)

out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "dist-single.html")
open(out, "w", encoding="utf-8").write(html)
print(out, len(html), "bytes")
