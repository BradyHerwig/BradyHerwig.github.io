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
    "source-serif-4/source-serif-4-latin-600-normal.woff2",
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
        self.assertIn("Source Serif 4", css)
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


class ReportTokens(unittest.TestCase):
    def test_paper_and_navy(self):
        self.assertIn("--color-bg: #FAFAF7", STYLE)
        self.assertIn("--color-accent: #1D4ED8", STYLE)
        self.assertIn("--color-positive: #047857", STYLE)
        self.assertNotIn("--color-void-violet", STYLE)

    def test_dark_theme_tokens(self):
        self.assertIn('[data-theme="dark"]', STYLE)
        self.assertIn("--color-bg: #0B1120", STYLE)

    def test_local_font_families_in_css(self):
        self.assertIn('"Inter"', STYLE)
        self.assertIn('"Source Serif 4"', STYLE)
        self.assertIn('"JetBrains Mono"', STYLE)

    def test_no_framework_cdn(self):
        blob = STYLE + INDEX + PROJECTS
        self.assertNotIn("cdn.tailwindcss.com", blob)
        self.assertNotIn("ascii-art", blob)


class LucideInMarkup(unittest.TestCase):
    def test_icon_img_or_inline_from_assets(self):
        # Prefer <img src="assets/icons/lucide/..."> or inline SVG with data-icon
        combined = INDEX + PROJECTS
        self.assertTrue(
            "assets/icons/lucide/" in combined or 'data-icon="' in combined,
            "pages should use Lucide assets",
        )

    def test_profile_links_hidden_by_default(self):
        self.assertIn("showGitHub: false", SCRIPT)
        self.assertIn("showLinkedIn: false", SCRIPT)
        self.assertNotIn("github.com/BradyHerwig", INDEX)
        self.assertNotIn("linkedin.com", INDEX)

    def test_nav_menu_uses_lucide(self):
        self.assertTrue(
            "lucide/menu" in INDEX or 'data-icon="menu"' in INDEX,
            "menu icon missing",
        )


class Structure(unittest.TestCase):
    def test_theme_color(self):
        self.assertIn('content="#FAFAF7"', INDEX)
        self.assertIn('content="#0B1120"', INDEX)
        self.assertIn('content="#FAFAF7"', PROJECTS)

    def test_no_glass_background(self):
        self.assertNotIn("bg-grid", INDEX)
        self.assertNotIn("bg-halo", INDEX)

    def test_sections(self):
        for needle in ('id="about"', 'id="contact"', 'id="education"', "Brady"):
            self.assertIn(needle, INDEX)

    def test_projects_namus(self):
        self.assertIn('id="project-namus-missing"', PROJECTS)
        self.assertNotIn("data-carousel", PROJECTS)
        alts = re.findall(r'<img[^>]+alt="([^"]*)"', PROJECTS)
        # screenshots + maybe icon imgs
        self.assertGreaterEqual(len([a for a in alts if a.strip()]), 4)

    def test_internship_and_cscn421(self):
        self.assertIn("summer internship", INDEX.lower())
        for pid in (
            "project-nhtsa-complaints",
            "project-churn-classification",
            "project-cifar10-cnn",
        ):
            self.assertIn(f'id="{pid}"', PROJECTS)
        self.assertIn("work/cscn421/churn/knn_train.py", PROJECTS)
        self.assertIn("work/cscn421/nhtsa/HerwigB_Lab3.knwf", PROJECTS)
        self.assertIn("work/cscn421/cifar10/Assignment5_DeepNeuralNet.ipynb", PROJECTS)
        for rel in (
            "work/cscn421/churn/knn_train.py",
            "work/cscn421/churn/svm_train.py",
            "work/cscn421/churn/voting_train.py",
            "work/cscn421/churn/HerwigB_Lab1.knwf",
            "work/cscn421/churn-network/model_train.py",
            "work/cscn421/churn-network/model_test.py",
            "work/cscn421/nhtsa/HerwigB_Lab3.knwf",
            "work/cscn421/cifar10/Assignment5_DeepNeuralNet.ipynb",
            "screenshots/cifar10/part_a_curves.png",
            "screenshots/cifar10/part_b_curves.png",
            "screenshots/cifar10/part_c_curves.png",
        ):
            path = ROOT / rel
            self.assertTrue(path.is_file(), f"missing {rel}")
            self.assertGreater(path.stat().st_size, 100, rel)

    def test_email_and_resume(self):
        self.assertIn("bradyherwig@outlook.com", INDEX)
        self.assertIn("resume/HerwigBradyResume.pdf", INDEX)

    def test_style_and_script_linked(self):
        for html in (INDEX, PROJECTS):
            # Allow cache-busting query strings (style.css?v=...)
            self.assertRegex(html, r'href="style\.css(\?[^"]*)?"')
            self.assertRegex(html, r'src="script\.js(\?[^"]*)?"')


class Script(unittest.TestCase):
    def test_core_inits(self):
        for name in (
            "initMobileMenu",
            "initSkills",
            "initCarousels",
            "initProjectJumpNav",
            "initReveal",
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
