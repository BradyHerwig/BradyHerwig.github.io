"""AuthKit portfolio behavior tests. Run: python -m unittest tests.test_authkit_site -v"""

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

CANVAS = "#05060f"
VIOLET = "#663af3"
FORBIDDEN = ("#fafafa", "#2a2722", "ascii-art", "Henry", "cdn.tailwindcss.com")


class Tokens(unittest.TestCase):
    def test_midnight_canvas(self):
        self.assertIn("--color-midnight-canvas: #05060f", STYLE)
        self.assertIn("background: var(--color-midnight-canvas)", STYLE)

    def test_void_violet_cta(self):
        self.assertIn("--color-void-violet: #663af3", STYLE)
        self.assertIn(".btn--violet", STYLE)

    def test_glass_tokens(self):
        self.assertIn("--surface-frosted-glass", STYLE)
        self.assertIn("--shadow-feature-card", STYLE)
        self.assertIn("--radius-cards: 16px", STYLE)
        self.assertIn("--radius-buttons: 999px", STYLE)

    def test_no_henry_ascii(self):
        blob = STYLE + INDEX + PROJECTS
        for bad in FORBIDDEN:
            self.assertNotIn(bad, blob, f"forbidden leftover: {bad}")


class Structure(unittest.TestCase):
    def test_theme_color_dark(self):
        self.assertIn('content="#05060f"', INDEX)
        self.assertIn('content="#05060f"', PROJECTS)

    def test_bg_layers(self):
        self.assertIn("bg-grid", INDEX)
        self.assertIn("bg-halo", INDEX)
        self.assertIn(".bg-grid", STYLE)

    def test_sections(self):
        for needle in ('id="about"', 'id="contact"', 'id="education"', "Brady Herwig"):
            self.assertIn(needle, INDEX)

    def test_projects_namus(self):
        self.assertIn('id="project-namus-missing"', PROJECTS)
        self.assertIn("data-carousel", PROJECTS)
        alts = re.findall(r'<img[^>]+alt="([^"]*)"', PROJECTS)
        self.assertGreaterEqual(len(alts), 4)

    def test_glass_cards(self):
        self.assertIn("glass-card", INDEX)
        self.assertIn("btn--violet", INDEX)

    def test_no_ascii_plate(self):
        self.assertNotIn("<pre", INDEX)
        self.assertNotIn("fig. 01", INDEX)

    def test_assets(self):
        for html in (INDEX, PROJECTS):
            self.assertIn('href="style.css"', html)
            self.assertIn('src="script.js"', html)

    def test_email(self):
        self.assertIn("bradyherwig@outlook.com", INDEX)


class Script(unittest.TestCase):
    def test_inits(self):
        for name in (
            "initMobileMenu",
            "initSkills",
            "initCarousels",
            "initProjectJumpNav",
            "initReveal",
        ):
            self.assertIn(f"function {name}", SCRIPT)


class HttpServe(unittest.TestCase):
    def test_serves(self):
        handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        port = server.server_address[1]
        threading.Thread(target=server.serve_forever, daemon=True).start()
        conn = http.client.HTTPConnection("127.0.0.1", port, timeout=5)
        try:
            for path in ("/index.html", "/projects.html", "/style.css", "/script.js"):
                conn.request("GET", path)
                res = conn.getresponse()
                body = res.read()
                self.assertEqual(res.status, 200, path)
                self.assertGreater(len(body), 200)
            conn.request("GET", "/style.css")
            css = conn.getresponse().read().decode()
            self.assertIn(CANVAS, css)
            self.assertIn(VIOLET, css)
        finally:
            conn.close()
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main()
