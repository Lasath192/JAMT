"""
Bundle script for ASTRA-1: The Red Frontier
Combines index.html, css/styles.css, and js/*.js into a single standalone distribution file:
astra_1_the_red_frontier.html
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(ROOT, "index.html")
OUTPUT_PATH = os.path.join(ROOT, "astra_1_the_red_frontier.html")
CSS_PATH = os.path.join(ROOT, "css", "styles.css")

JS_FILES = [
    "js/soundfx.js",
    "js/nasa_data.js",
    "js/chapters.js",
    "js/simulation.js",
    "js/render.js",
    "js/render3d.js",
    "js/activities.js",
    "js/ui.js",
    "js/game.js"
]

def bundle():
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    # Read CSS
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css_content = f.read()

    # Replace <link rel="stylesheet" href="css/styles.css"> with inlined style
    css_tag = '<link rel="stylesheet" href="css/styles.css">'
    if css_tag in html:
        html = html.replace(css_tag, f"<style>\n{css_content}\n</style>")
    else:
        html = re.sub(r'<link\s+rel="stylesheet"\s+href="css/styles\.css"[^>]*>', f"<style>\n{css_content}\n</style>", html)

    # In standalone html, ensure Three.js is cleanly loaded via CDN or local fallback
    # The local <script src="js/three.min.js"> tag in standalone will point to js/three.min.js if folder exists,
    # and fallback to CDN if standalone file is moved alone.
    
    # Read and concatenate all JS files
    bundled_js = []
    for js_rel in JS_FILES:
        full_p = os.path.join(ROOT, js_rel)
        with open(full_p, "r", encoding="utf-8") as f:
            code = f.read()
            bundled_js.append(f"/* ==========================================================================\n   FILE: {js_rel}\n   ========================================================================== */\n{code}\n")

    full_script_bundle = "<script>\n" + "\n".join(bundled_js) + "\n</script>"

    # Find the range of the modular script tags in HTML
    pattern = r'<!-- Modular Mission Engine Scripts.*?-->\s*(<script\s+src="js/[^"]+"></script>\s*)+'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        html = html[:match.start()] + full_script_bundle + "\n" + html[match.end():]
    else:
        # Fallback: find first js/ script (after three.min.js)
        start_idx = html.find('<script src="js/soundfx.js">')
        last_idx = html.rfind('<script src="js/')
        last_end = html.find('</script>', last_idx) + len('</script>')
        html = html[:start_idx] + full_script_bundle + html[last_end:]

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Successfully generated standalone build: {OUTPUT_PATH} ({len(html):,} bytes)")

if __name__ == "__main__":
    bundle()
