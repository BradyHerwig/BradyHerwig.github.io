"""
Regression tests for cool data-science ASCII side rails.

Protects: fixed gutters stay on-screen, paint ABOVE ambient background,
static HTML (not JS-only), wide-viewport visibility, reduced-motion.

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
    pat = re.compile(rf"{re.escape(selector)}\s*\{{", re.MULTILINE)
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


class SideAsciiStacking(unittest.TestCase):
    """Rails must sit above ambient background layers (user regression)."""

    def test_root_is_position_fixed(self):
        block = _rule_block(STYLE, ".side-ascii")
        self.assertRegex(block, r"position:\s*fixed")

    def test_bg_layers_not_negative_z_index(self):
        """Negative z-index paints behind body fill and can hide siblings."""
        for sel in (".bg-grid", ".bg-halo"):
            block = _rule_block(STYLE, sel)
            self.assertIsNotNone(block)
            z = re.search(r"z-index:\s*(-?\d+)", block)
            self.assertIsNotNone(z, f"{sel} needs z-index")
            self.assertGreaterEqual(int(z.group(1)), 0, f"{sel} must not use negative z-index")

    def test_bg_grid_has_no_solid_canvas_fill(self):
        """Solid midnight fill on bg-grid covered the whole viewport and hid rails."""
        block = _rule_block(STYLE, ".bg-grid")
        self.assertNotIn("background-color:", block)
        self.assertNotIn("--color-midnight-canvas", block)

    def test_side_ascii_z_above_background(self):
        bg_z = int(re.search(r"z-index:\s*(-?\d+)", _rule_block(STYLE, ".bg-grid")).group(1))
        ascii_z = int(re.search(r"z-index:\s*(-?\d+)", _rule_block(STYLE, ".side-ascii")).group(1))
        self.assertGreater(ascii_z, bg_z)

    def test_root_does_not_capture_pointer_events(self):
        block = _rule_block(STYLE, ".side-ascii")
        self.assertIn("pointer-events: none", block)

    def test_shown_from_reachable_width(self):
        self.assertRegex(
            STYLE,
            r"@media\s*\(\s*min-width:\s*9\d{2}px\s*\)\s*\{[^}]*\.side-ascii\s*\{[^}]*display:\s*block",
        )

    def test_left_and_right_rails_pinned(self):
        left = _rule_block(STYLE, ".side-ascii__rail--left")
        right = _rule_block(STYLE, ".side-ascii__rail--right")
        self.assertRegex(left, r"left:\s*\d+px")
        self.assertRegex(right, r"right:\s*\d+px")

    def test_fig_uses_solid_readable_color(self):
        block = _rule_block(STYLE, ".side-ascii__fig")
        # Prefer hex / high-opacity tokens, not ghost rgba
        self.assertTrue(
            re.search(r"color:\s*#([0-9a-fA-F]{3,8})", block)
            or re.search(r"color:\s*var\(--color-", block),
            "fig color should be a solid hex or design token",
        )

    def test_reduced_motion_disables_drift(self):
        self.assertIn("side-ascii-drift", STYLE)
        self.assertRegex(
            STYLE,
            r"@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[^}]*"
            r"\.side-ascii__track\s*\{[^}]*animation:\s*none",
        )

    def test_body_overflow_does_not_trap_fixed(self):
        body = _rule_block(STYLE, "body")
        self.assertNotRegex(body, r"overflow-x:\s*hidden\b")
        html = _rule_block(STYLE, "html")
        self.assertRegex(html, r"overflow-x:\s*clip")


class SideAsciiStaticHtml(unittest.TestCase):
    """Markup must exist without JS so rails always paint."""

    def test_index_and_projects_include_side_ascii(self):
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            self.assertIn('class="side-ascii"', html, name)
            self.assertIn("side-ascii__rail--left", html, name)
            self.assertIn("side-ascii__rail--right", html, name)
            self.assertIn("side-ascii__fig", html, name)
            self.assertIn('aria-hidden="true"', html, name)

    def test_cache_bust_assets(self):
        for name, html in (("index", INDEX), ("projects", PROJECTS)):
            self.assertIn("style.css?v=", html, name)
            self.assertIn("script.js?v=", html, name)


class SideAsciiJsFallback(unittest.TestCase):
    def test_init_side_ascii_defined_and_called(self):
        self.assertIn("function initSideAscii", SCRIPT)
        self.assertIn("initSideAscii()", SCRIPT)

    def test_init_skips_when_static_present(self):
        self.assertIn('document.querySelector(".side-ascii")', SCRIPT)

    def test_left_and_right_datasets_exist(self):
        self.assertIn("SIDE_ASCII_LEFT", SCRIPT)
        self.assertIn("SIDE_ASCII_RIGHT", SCRIPT)


class SideAsciiNoLegacyHenry(unittest.TestCase):
    def test_not_henry_ascii_art_class(self):
        blob = STYLE + SCRIPT + INDEX + PROJECTS
        self.assertNotIn("ascii-art", blob)
        self.assertNotIn("#fafafa", blob)


if __name__ == "__main__":
    unittest.main()
