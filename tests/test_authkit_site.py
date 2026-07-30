"""
AuthKit + site-kit overhaul tests (TDD).

Run: python -m unittest tests.test_authkit_site -v
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

ASSETS = ROOT / "assets"
FONTS = ASSETS / "fonts"
ICONS = ASSETS / "icons" / "lucide"

REQUIRED_FONTS = [
    "inter/inter-latin-400-normal.woff2",
    "inter/inter-latin-500-normal.woff2",
    "inter/inter-latin-600-normal.woff2",
    "inter/inter-latin-700-normal.woff2",
    "space-grotesk/space-grotesk-latin-400-normal.woff2",
    "space-grotesk/space-grotesk-latin-500-normal.woff2",
    "jetbrains-mono/jetbrains-mono-latin-400-normal.woff2",
    "jetbrains-mono/jetbrains-mono-latin-500-normal.woff2",
]

REQUIRED_ICONS = [
    "github",
    "linkedin",
    "mail",
    "download",
    "menu",
    "x",
    "chevron-left",
    "chevron-right",
    "code",
    "chart-column",
    "database",
    "brain",
    "graduation-cap",
    "users",
    "git-branch",
    "sparkles",
    "external-link",
    "arrow-right",
]


class LocalAssets(unittest.TestCase):
    """Site-kit fonts and Lucide icons must be vendored into the repo."""

    def test_font_files_exist(self):
        for rel in REQUIRED_FONTS:
            path = FONTS / rel
            self.assertTrue(path.is_file(), f"missing font {rel}")
            self.assertGreater(path.stat().st_size, 1000, f"font too small: {rel}")

    def test_fonts_css_exists_and_declares_faces(self):
        css_path = FONTS / "fonts.css"
        self.assertTrue(css_path.is_file())
        css = css_path.read_text(encoding="utf-8")
        self.assertIn("@font-face", css)
        self.assertIn("Inter", css)
        self.assertIn("Space Grotesk", css)
        self.assertIn("JetBrains Mono", css)
        self.assertIn(".woff2", css)

    def test_lucide_icons_exist(self):
        for name in REQUIRED_ICONS:
            path = ICONS / f"{name}.svg"
            self.assertTrue(path.is_file(), f"missing icon {name}.svg")
            text = path.read_text(encoding="utf-8")
            self.assertIn("<svg", text.lower())


class NoExternalFontCdn(unittest.TestCase):
    def test_html_does_not_load_google_fonts(self):
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            self.assertNotIn("fonts.googleapis.com", html, name)
            self.assertNotIn("fonts.gstatic.com", html, name)

    def test_style_does_not_import_google_fonts(self):
        self.assertNotIn("fonts.googleapis.com", STYLE)

    def test_pages_link_local_fonts_css(self):
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            self.assertIn('href="assets/fonts/fonts.css"', html, name)


class AuthKitTokens(unittest.TestCase):
    def test_midnight_and_violet(self):
        self.assertIn("--color-midnight-canvas: #05060f", STYLE)
        self.assertIn("--color-void-violet: #663af3", STYLE)
        self.assertIn("background: var(--color-midnight-canvas)", STYLE)

    def test_glass_and_radii(self):
        self.assertIn("--radius-cards: 16px", STYLE)
        self.assertIn("--radius-buttons: 999px", STYLE)
        self.assertIn("--shadow-feature-card", STYLE)
        self.assertIn(".glass-card", STYLE)
        self.assertIn(".btn--violet", STYLE)

    def test_local_font_families_in_css(self):
        self.assertIn('"Inter"', STYLE)
        self.assertIn('"Space Grotesk"', STYLE)
        self.assertIn('"JetBrains Mono"', STYLE)

    def test_no_henry_ascii(self):
        blob = STYLE + INDEX + PROJECTS
        for bad in ("#fafafa", "ascii-art", "cdn.tailwindcss.com"):
            self.assertNotIn(bad, blob)


class LucideInMarkup(unittest.TestCase):
    def test_icon_img_or_inline_from_assets(self):
        # Prefer <img src="assets/icons/lucide/..."> or inline SVG with data-icon
        combined = INDEX + PROJECTS
        self.assertTrue(
            "assets/icons/lucide/" in combined or 'data-icon="' in combined,
            "pages should use Lucide assets",
        )

    def test_social_icons_present(self):
        # GitHub / LinkedIn should use lucide assets on home
        self.assertTrue(
            "lucide/github" in INDEX or 'data-icon="github"' in INDEX,
            "github lucide icon missing on index",
        )
        self.assertTrue(
            "lucide/linkedin" in INDEX or 'data-icon="linkedin"' in INDEX,
            "linkedin lucide icon missing on index",
        )

    def test_nav_menu_uses_lucide(self):
        self.assertTrue(
            "lucide/menu" in INDEX or 'data-icon="menu"' in INDEX,
            "menu icon missing",
        )


class Structure(unittest.TestCase):
    def test_theme_color(self):
        self.assertIn('content="#05060f"', INDEX)
        self.assertIn('content="#05060f"', PROJECTS)

    def test_ambient_layers(self):
        self.assertIn("bg-grid", INDEX)
        self.assertIn("bg-halo", INDEX)

    def test_sections(self):
        for needle in ('id="about"', 'id="contact"', 'id="education"', "Brady"):
            self.assertIn(needle, INDEX)

    def test_projects_namus(self):
        self.assertIn('id="project-namus-missing"', PROJECTS)
        self.assertIn("data-carousel", PROJECTS)
        alts = re.findall(r'<img[^>]+alt="([^"]*)"', PROJECTS)
        # screenshots + maybe icon imgs
        self.assertGreaterEqual(len([a for a in alts if a.strip()]), 4)

    def test_email_and_resume(self):
        self.assertIn("bradyherwig@outlook.com", INDEX)
        self.assertIn("resume/HerwigBradyResume.pdf", INDEX)

    def test_style_and_script_linked(self):
        for html in (INDEX, PROJECTS):
            self.assertIn('href="style.css"', html)
            self.assertIn('src="script.js"', html)


class Script(unittest.TestCase):
    def test_core_inits(self):
        for name in (
            "initMobileMenu",
            "initSkills",
            "initCarousels",
            "initProjectJumpNav",
            "initReveal",
            "initSideAscii",
        ):
            self.assertIn(f"function {name}", SCRIPT)


class HttpServe(unittest.TestCase):
    def test_serves_pages_css_fonts_icons(self):
        handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        port = server.server_address[1]
        threading.Thread(target=server.serve_forever, daemon=True).start()
        conn = http.client.HTTPConnection("127.0.0.1", port, timeout=5)
        try:
            paths = [
                "/index.html",
                "/projects.html",
                "/style.css",
                "/script.js",
                "/assets/fonts/fonts.css",
                "/assets/fonts/inter/inter-latin-400-normal.woff2",
                "/assets/icons/lucide/github.svg",
            ]
            for path in paths:
                conn.request("GET", path)
                res = conn.getresponse()
                body = res.read()
                self.assertEqual(res.status, 200, f"{path} -> {res.status}")
                self.assertGreater(len(body), 50, path)
        finally:
            conn.close()
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main()
