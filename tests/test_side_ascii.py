"""
Regression tests for cool data-science ASCII side rails.

Protects: fixed gutters stay on-screen, wide-viewport visibility,
JS injection, a11y/decorative rules, reduced-motion, no Henry legacy.

Run: python -m unittest tests.test_side_ascii -v
"""

from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLE = (ROOT / "style.css").read_text(encoding="utf-8")
SCRIPT = (ROOT / "script.js").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
PROJECTS = (ROOT / "projects.html").read_text(encoding="utf-8")


def _rule_block(css: str, selector: str) -> str:
    """Return the first CSS rule body for an exact selector (best-effort)."""
    # Match ".side-ascii {" ... "}" at brace depth 1
    pat = re.compile(
        rf"{re.escape(selector)}\s*\{{",
        re.MULTILINE,
    )
    m = pat.search(css)
    if not m:
        return ""
    i = m.end()
    depth = 1
    start = i
    while i < len(css) and depth:
        if css[i] == "{":
            depth += 1
        elif css[i] == "}":
            depth -= 1
        i += 1
    return css[start : i - 1]


class SideAsciiCssFixed(unittest.TestCase):
    """Rails must be position:fixed so they stay in the gutters while scrolling."""

    def test_root_is_position_fixed(self):
        block = _rule_block(STYLE, ".side-ascii")
        self.assertIn("position: fixed", block)
        # Root must be fixed (rails may be absolute inside the fixed layer)
        self.assertRegex(block, r"position:\s*fixed")

    def test_body_overflow_does_not_trap_fixed(self):
        """overflow-x:hidden on body breaks position:fixed in some engines."""
        body = _rule_block(STYLE, "body")
        self.assertNotRegex(
            body,
            r"overflow-x:\s*hidden",
            "body overflow-x:hidden traps fixed side rails; use html overflow-x:clip",
        )
        html = _rule_block(STYLE, "html")
        self.assertRegex(html, r"overflow-x:\s*clip")

    def test_root_does_not_capture_pointer_events(self):
        block = _rule_block(STYLE, ".side-ascii")
        self.assertIn("pointer-events: none", block)

    def test_root_sits_above_page_chrome_below_nav(self):
        block = _rule_block(STYLE, ".side-ascii")
        z = re.search(r"z-index:\s*(\d+)", block)
        self.assertIsNotNone(z, "side-ascii needs an explicit z-index")
        z_val = int(z.group(1))
        self.assertGreaterEqual(z_val, 10)
        self.assertLess(z_val, 50)  # nav is 50

    def test_shown_from_laptop_width(self):
        # Media query must enable display:block at a reachable laptop width
        self.assertRegex(
            STYLE,
            r"@media\s*\(\s*min-width:\s*1[01]\d{2}px\s*\)\s*\{[^}]*\.side-ascii\s*\{[^}]*display:\s*block",
            msg="side-ascii should display:block inside a min-width ~1000–1199px media query",
        )

    def test_left_and_right_rails_pinned(self):
        left = _rule_block(STYLE, ".side-ascii__rail--left")
        right = _rule_block(STYLE, ".side-ascii__rail--right")
        self.assertRegex(left, r"left:\s*\d+px")
        self.assertRegex(right, r"right:\s*\d+px")

    def test_fig_contrast_not_ghosted(self):
        """Opacity/alpha must stay readable on midnight canvas (regression)."""
        block = _rule_block(STYLE, ".side-ascii__fig")
        # rgba(..., a) with a >= 0.55 OR solid color without heavy transparency
        alphas = [float(a) for a in re.findall(r"rgba\([^)]+,\s*(0?\.\d+|1(?:\.0+)?)\s*\)", block)]
        self.assertTrue(alphas, "expected rgba color on .side-ascii__fig")
        self.assertTrue(
            any(a >= 0.55 for a in alphas),
            f"fig alpha too low (invisible): {alphas}",
        )

    def test_reduced_motion_disables_drift(self):
        self.assertIn("prefers-reduced-motion", STYLE)
        self.assertIn("side-ascii-drift", STYLE)
        # Within reduced-motion, track animation should be none
        self.assertRegex(
            STYLE,
            r"@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[^}]*"
            r"\.side-ascii__track\s*\{[^}]*animation:\s*none",
        )


class SideAsciiJsInjection(unittest.TestCase):
    """Both pages load script.js; init must inject decorative rails."""

    def test_init_side_ascii_defined_and_called(self):
        self.assertIn("function initSideAscii", SCRIPT)
        self.assertIn("initSideAscii()", SCRIPT)

    def test_init_wired_from_boot(self):
        # init() must call initSideAscii before other UI setup is fine either order
        m = re.search(r"function init\s*\(\s*\)\s*\{([\s\S]*?)\n\}", SCRIPT)
        self.assertIsNotNone(m, "init() function missing")
        self.assertIn("initSideAscii()", m.group(1))

    def test_left_and_right_datasets_exist(self):
        self.assertIn("SIDE_ASCII_LEFT", SCRIPT)
        self.assertIn("SIDE_ASCII_RIGHT", SCRIPT)
        self.assertIn("scatter", SCRIPT)
        self.assertIn("neural", SCRIPT)
        self.assertIn("decision", SCRIPT)

    def test_builds_rails_with_aria_hidden(self):
        self.assertIn('setAttribute("aria-hidden", "true")', SCRIPT)
        self.assertIn("side-ascii__rail--left", SCRIPT)
        self.assertIn("side-ascii__rail--right", SCRIPT)
        self.assertIn("side-ascii__track", SCRIPT)
        self.assertIn("side-ascii__fig", SCRIPT)

    def test_appends_to_body(self):
        self.assertIn("document.body.appendChild(root)", SCRIPT)

    def test_pages_load_script(self):
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            self.assertIn('src="script.js"', html, name)


class SideAsciiNoLegacyHenry(unittest.TestCase):
    def test_not_henry_ascii_art_class(self):
        blob = STYLE + SCRIPT + INDEX + PROJECTS
        self.assertNotIn("ascii-art", blob)
        self.assertNotIn("#fafafa", blob)

    def test_uses_side_ascii_namespace(self):
        self.assertIn(".side-ascii", STYLE)
        self.assertIn("side-ascii", SCRIPT)


if __name__ == "__main__":
    unittest.main()
