"""
Henry broadside portfolio — behavior tests (TDD).

Run:  python -m unittest tests.test_henry_site -v
"""

from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLE = (ROOT / "style.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
PROJECTS = (ROOT / "projects.html").read_text(encoding="utf-8")
SCRIPT = (ROOT / "script.js").read_text(encoding="utf-8")

# Henry tokens from style reference
PAPER = "#fafafa"
INK = "#2a2722"
FORBIDDEN_CHROMATIC = (
    "#2b59d1",  # lake blue
    "#cfdaf5",  # periwinkle
    "#a0b5eb",
    "#a7fccd",
    "#ff9473",
    "#ecda98",
    "#f6f3f1",  # old parchment
)
FORBIDDEN_CSS_NAMES = (
    "--color-lake-blue",
    "--color-parchment",
    "--color-periwinkle",
)


def _strip_comments(css: str) -> str:
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


class HenryTokensTests(unittest.TestCase):
    """Design tokens must match the Henry style reference."""

    def test_paper_token_is_fafafa(self):
        m = re.search(r"--color-paper:\s*([^;]+);", STYLE)
        self.assertIsNotNone(m, "--color-paper missing")
        self.assertEqual(m.group(1).strip().lower(), PAPER)

    def test_headline_ink_token(self):
        m = re.search(r"--color-headline-ink:\s*([^;]+);", STYLE)
        self.assertIsNotNone(m)
        self.assertEqual(m.group(1).strip().lower(), INK)

    def test_surface_ink_token(self):
        m = re.search(r"--surface-ink:\s*([^;]+);", STYLE)
        self.assertIsNotNone(m)
        self.assertEqual(m.group(1).strip().lower(), INK)

    def test_no_chromatic_or_old_parchment_in_css(self):
        css = _strip_comments(STYLE).lower()
        for bad in FORBIDDEN_CHROMATIC:
            self.assertNotIn(bad.lower(), css, f"forbidden color still present: {bad}")
        for name in FORBIDDEN_CSS_NAMES:
            self.assertNotIn(name, css)

    def test_radius_is_12px_only_for_ui(self):
        self.assertIn("--radius-cards: 12px", STYLE)
        self.assertIn("--radius-buttons: 12px", STYLE)
        self.assertIn("--radius-tags: 12px", STYLE)


class BackgroundTests(unittest.TestCase):
    """Page canvas must be Paper on html AND body (Tailwind-safe)."""

    def test_html_has_paper_background(self):
        # Must set background on html, not only body (browser default white leaks)
        block = re.search(r"html\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(block, "html {} rule missing")
        body_of = block.group(1)
        self.assertTrue(
            "background" in body_of and ("paper" in body_of or PAPER in body_of.lower()),
            f"html must set paper background; got: {body_of!r}",
        )

    def test_body_has_paper_background(self):
        # Prefer a dedicated body rule that includes background
        matches = re.findall(r"(?:^|\n)body(?:\s*,\s*html)?\s*\{([^}]+)\}", STYLE)
        self.assertTrue(matches, "body {} rule missing")
        joined = " ".join(matches)
        self.assertTrue(
            "background" in joined
            and ("--color-paper" in joined or PAPER in joined.lower() or "var(--color-paper)" in joined),
            f"body must use paper background; got: {joined!r}",
        )

    def test_body_background_not_transparent(self):
        matches = re.findall(r"(?:^|\n)body\s*\{([^}]+)\}", STYLE)
        joined = " ".join(matches).lower()
        self.assertNotIn("background: transparent", joined)
        self.assertNotIn("background-color: transparent", joined)

    def test_html_pages_declare_theme_color_paper(self):
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            self.assertIn(f'content="{PAPER}"', html, f"{name}: theme-color should be paper")

    def test_body_element_has_explicit_bg_class_or_style(self):
        """Guards against Tailwind preflight leaving white canvas."""
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            m = re.search(r"<body([^>]*)>", html)
            self.assertIsNotNone(m, f"{name}: body tag missing")
            attrs = m.group(1)
            ok = (
                "bg-paper" in attrs
                or 'style="' in attrs and "background" in attrs
                or 'class="' in attrs and "bg-paper" in attrs
            )
            self.assertTrue(ok, f"{name}: body should include bg-paper class for Tailwind + CSS")


class InkSurfaceTests(unittest.TestCase):
    def test_editorial_letter_is_ink(self):
        m = re.search(r"\.editorial-letter\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m)
        block = m.group(1)
        self.assertTrue("ink" in block or INK in block.lower())

    def test_stamp_header_is_ink(self):
        m = re.search(r"\.stamp-header\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m)
        block = m.group(1)
        self.assertTrue("ink" in block or INK in block.lower())

    def test_ticker_is_ink(self):
        m = re.search(r"\.ticker\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m)
        block = m.group(1)
        self.assertTrue("ink" in block or INK in block.lower())


class CardTextFitTests(unittest.TestCase):
    """Boxes must have padding, wrapping, and no clipping of text."""

    def test_feature_cards_have_comfortable_padding(self):
        m = re.search(r"\.card--feature\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m, ".card--feature rule missing")
        block = m.group(1)
        # Must not rely only on 16px; feature cards need >= 24px
        self.assertTrue(
            any(x in block for x in ("24px", "28px", "32px", "--spacing-24", "--spacing-32")),
            f"feature card padding too tight: {block!r}",
        )

    def test_card_feature_does_not_clip_text_with_overflow_hidden(self):
        m = re.search(r"\.card--feature\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m)
        block = m.group(1)
        # overflow:hidden clips multi-line text / focus rings in tight boxes
        self.assertNotIn("overflow: hidden", block.replace(" ", " "))

    def test_global_text_wrapping_rules_exist(self):
        # Long emails / unbroken strings must wrap inside boxes
        self.assertTrue(
            "overflow-wrap" in STYLE or "word-wrap" in STYLE or "word-break" in STYLE,
            "expected overflow-wrap/word-break for long content in boxes",
        )

    def test_card_body_text_uses_readable_line_height(self):
        # Body leading in tokens
        self.assertIn("--leading-body: 1.5", STYLE)

    def test_project_card_has_padding_and_desc_clamp_safe(self):
        m = re.search(r"\.project-card\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m)
        block = m.group(1)
        self.assertIn("padding", block)

    def test_mono_chart_labels_do_not_escape_via_absolute_top_only(self):
        """Bar labels above bars often clip; require a safer pattern or reserved space."""
        # Either labels below, or chart has top padding, or labels not absolute above
        chart = re.search(r"\.mono-chart\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(chart)
        chart_block = chart.group(1)
        bar_after = re.search(r"\.mono-chart__bar::after\s*\{([^}]+)\}", STYLE)
        if bar_after and "bottom: 100%" in bar_after.group(1):
            # Must reserve space above bars
            self.assertTrue(
                "padding-top" in chart_block or "padding:" in chart_block,
                "mono-chart needs padding-top when labels sit above bars",
            )

    def test_repl_block_allows_horizontal_scroll_not_page_blowout(self):
        m = re.search(r"\.repl-block\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m)
        block = m.group(1)
        self.assertIn("overflow", block)

    def test_section_title_can_wrap(self):
        m = re.search(r"\.section-title\s*\{([^}]+)\}", STYLE)
        self.assertIsNotNone(m)
        block = m.group(1)
        # max-width in ch is fine; ensure no nowrap
        self.assertNotIn("white-space: nowrap", block)

    def test_stamp_header_text_has_overflow_control(self):
        # Architectural type must not force horizontal page scroll
        self.assertTrue(
            re.search(r"\.stamp-header[^{]*\{[^}]*overflow:\s*hidden", STYLE)
            or re.search(r"\.stamp-header__text[^{]*\{[^}]*overflow", STYLE),
            "stamp header needs overflow containment",
        )


class HtmlStructureTests(unittest.TestCase):
    def test_index_has_required_sections(self):
        for sel in ("id=\"about\"", "id=\"skills\"", "id=\"education\"", "id=\"contact\""):
            self.assertIn(sel, INDEX)

    def test_projects_has_namus_showcase(self):
        self.assertIn('id="project-namus-missing"', PROJECTS)
        self.assertIn("data-carousel", PROJECTS)

    def test_no_old_monad_font_cdn_in_html(self):
        for html in (INDEX, PROJECTS):
            self.assertNotIn("Instrument+Serif", html)
            self.assertNotIn("JetBrains+Mono", html)

    def test_style_and_script_linked(self):
        for html in (INDEX, PROJECTS):
            self.assertIn('href="style.css"', html)
            self.assertIn('src="script.js"', html)

    def test_cards_exist_on_index(self):
        self.assertGreaterEqual(INDEX.count("card--feature"), 3)

    def test_contact_email_present(self):
        self.assertIn("bradyherwig@outlook.com", INDEX)

    def test_no_forbidden_colors_in_html_inline(self):
        for bad in FORBIDDEN_CHROMATIC:
            self.assertNotIn(bad, INDEX)
            self.assertNotIn(bad, PROJECTS)


class ScriptBehaviorTests(unittest.TestCase):
    def test_init_functions_exist(self):
        for name in (
            "initMobileMenu",
            "initSmoothScroll",
            "initSkills",
            "initTicker",
            "initClocks",
            "initCarousels",
            "initProjectJumpNav",
            "initReveal",
        ):
            self.assertIn(f"function {name}", SCRIPT)

    def test_skills_render_into_dom_ids(self):
        self.assertIn("tech-skills", SCRIPT)
        self.assertIn("soft-skills", SCRIPT)
        self.assertIn("skill-pill", SCRIPT)


class AccessibilitySmokeTests(unittest.TestCase):
    def test_lang_en(self):
        self.assertIn('<html lang="en">', INDEX)
        self.assertIn('<html lang="en">', PROJECTS)

    def test_nav_aria_expanded_on_menu_button(self):
        self.assertIn('aria-expanded="false"', INDEX)
        self.assertIn('aria-controls="mobile-menu"', INDEX)

    def test_images_have_alt_on_projects(self):
        alts = re.findall(r"<img[^>]+alt=\"([^\"]*)\"", PROJECTS)
        self.assertGreaterEqual(len(alts), 4)
        for a in alts:
            self.assertTrue(a.strip(), "empty alt on project screenshot")


class BoxMarkupTests(unittest.TestCase):
    """Every major box has readable structure and safe chart labels."""

    def test_mono_chart_uses_under_labels(self):
        self.assertIn("mono-chart__label", INDEX)
        self.assertIn("mono-chart__track", INDEX)
        self.assertNotIn("data-label=", INDEX)

    def test_about_cards_are_feature_cards(self):
        self.assertGreaterEqual(INDEX.count("card card--feature"), 5)

    def test_skills_containers_exist(self):
        self.assertIn('id="tech-skills"', INDEX)
        self.assertIn('id="soft-skills"', INDEX)

    def test_contact_card_has_breakable_email(self):
        self.assertIn("break-all", INDEX)
        self.assertIn("bradyherwig@outlook.com", INDEX)

    def test_projects_showcase_blocks_are_equal_stretch(self):
        self.assertIn("lg:items-stretch", PROJECTS)
        self.assertGreaterEqual(PROJECTS.count("card--feature"), 3)

    def test_body_inline_style_paper(self):
        for html in (INDEX, PROJECTS):
            self.assertIn("background-color:#fafafa", html.replace(" ", ""))


class HttpServeTests(unittest.TestCase):
    """Serve static files and assert paper CSS + pages respond."""

    def test_local_http_serves_paper_css_and_pages(self):
        import http.client
        import threading
        from functools import partial
        from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

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
                self.assertEqual(res.status, 200, f"{path} status {res.status}")
                self.assertTrue(len(body) > 100, f"{path} empty")
            conn.request("GET", "/style.css")
            css = conn.getresponse().read().decode("utf-8", errors="replace")
            self.assertIn("--color-paper: #fafafa", css)
            self.assertIn("background-color: #fafafa", css)
            self.assertIn("html {", css)
        finally:
            conn.close()
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main()
