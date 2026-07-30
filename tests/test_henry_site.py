"""
Henry broadside portfolio — behavior tests.

Run:  python -m unittest tests.test_henry_site -v
"""

from __future__ import annotations

import http.client
import re
import threading
import unittest
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLE = (ROOT / "style.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
PROJECTS = (ROOT / "projects.html").read_text(encoding="utf-8")
SCRIPT = (ROOT / "script.js").read_text(encoding="utf-8")

PAPER = "#fafafa"
INK = "#2a2722"
FORBIDDEN = (
    "#2b59d1",
    "#cfdaf5",
    "#a0b5eb",
    "#a7fccd",
    "#ff9473",
    "#ecda98",
    "#f6f3f1",
    "cdn.tailwindcss.com",
)


def _strip_comments(css: str) -> str:
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


class Tokens(unittest.TestCase):
    def test_paper_and_ink(self):
        self.assertIn("--color-paper: #fafafa", STYLE)
        self.assertIn("--color-headline-ink: #2a2722", STYLE)
        self.assertIn("--paper: #fafafa", STYLE)
        self.assertIn("--ink: #2a2722", STYLE)

    def test_no_chromatic_or_tailwind_cdn(self):
        blob = _strip_comments(STYLE).lower() + INDEX.lower() + PROJECTS.lower()
        for bad in FORBIDDEN:
            self.assertNotIn(bad.lower(), blob, f"forbidden: {bad}")

    def test_radius_12(self):
        self.assertIn("--radius: 12px", STYLE)
        self.assertIn("--radius-cards: 12px", STYLE)


class Background(unittest.TestCase):
    def test_html_body_paper(self):
        html_block = re.search(r"html\s*\{([^}]+)\}", STYLE)
        body_block = re.search(r"body\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(html_block)
        self.assertIsNotNone(body_block)
        self.assertIn("background", html_block.group(1))
        self.assertIn("fafafa", html_block.group(1).lower() + body_block.group(1).lower())

    def test_body_markup(self):
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            self.assertIn("bg-paper", html)
            self.assertIn("background-color:#fafafa", html.replace(" ", ""))
            self.assertIn(f'content="{PAPER}"', html)

    def test_ink_bands(self):
        self.assertIn(".band-ink", STYLE)
        self.assertIn("background: #2a2722", STYLE)
        self.assertIn('class="band-ink', INDEX)


class Structure(unittest.TestCase):
    def test_no_tailwind_script(self):
        self.assertNotIn("tailwindcss", INDEX)
        self.assertNotIn("tailwindcss", PROJECTS)

    def test_index_sections(self):
        for needle in ('id="about"', 'id="contact"', 'id="education"', "Brady", "Herwig"):
            self.assertIn(needle, INDEX)

    def test_projects_namus(self):
        self.assertIn('id="project-namus-missing"', PROJECTS)
        self.assertIn("data-carousel", PROJECTS)
        alts = re.findall(r'<img[^>]+alt="([^"]*)"', PROJECTS)
        self.assertGreaterEqual(len(alts), 4)
        for a in alts:
            self.assertTrue(a.strip())

    def test_type_first_hero(self):
        self.assertIn('class="display', INDEX)
        self.assertIn("nav__link", INDEX)

    def test_no_saas_card_grid_spam(self):
        # Editorial rows instead of three feature cards
        self.assertIn('class="row', INDEX)
        self.assertNotIn("card--feature", INDEX)

    def test_contact_email(self):
        self.assertIn("bradyherwig@outlook.com", INDEX)

    def test_assets_linked(self):
        for html in (INDEX, PROJECTS):
            self.assertIn('href="style.css"', html)
            self.assertIn('src="script.js"', html)


class Script(unittest.TestCase):
    def test_inits(self):
        for name in (
            "initMobileMenu",
            "initSmoothScroll",
            "initTicker",
            "initClocks",
            "initCarousels",
            "initProjectJumpNav",
            "initReveal",
        ):
            self.assertIn(f"function {name}", SCRIPT)


class A11y(unittest.TestCase):
    def test_lang_and_menu(self):
        self.assertIn('<html lang="en">', INDEX)
        self.assertIn('aria-expanded="false"', INDEX)
        self.assertIn('aria-controls="mobile-menu"', INDEX)


class HttpServe(unittest.TestCase):
    def test_serves(self):
        handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        port = server.server_address[1]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        conn = http.client.HTTPConnection("127.0.0.1", port, timeout=5)
        try:
            for path in ("/index.html", "/projects.html", "/style.css", "/script.js"):
                conn.request("GET", path)
                res = conn.getresponse()
                body = res.read()
                self.assertEqual(res.status, 200, path)
                self.assertGreater(len(body), 100, path)
            conn.request("GET", "/style.css")
            css = conn.getresponse().read().decode("utf-8", errors="replace")
            self.assertIn("#fafafa", css)
            self.assertIn("#2a2722", css)
            self.assertNotIn("cdn.tailwindcss.com", css)
        finally:
            conn.close()
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main()
