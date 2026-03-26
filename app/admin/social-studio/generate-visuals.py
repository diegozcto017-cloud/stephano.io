#!/usr/bin/env python3
"""
Stephano.io — Batch Visual Generator
Uses nano-banana-2 (Gemini Flash) to generate all carousel slides for a post.

Usage:
  python generate-visuals.py --topic "Tu negocio necesita web" --slides 5
  python generate-visuals.py --json content.json --output ./output
  python generate-visuals.py --month  # Generate full month of content
"""

import subprocess
import json
import sys
import os
import argparse
from pathlib import Path

NANO_BANANA = os.path.expanduser("~/tools/nano-banana-2/src/cli.ts")
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyB4UHMLzRvRQo3BOOC_F9I7Ust1S_6cY3w")
OUTPUT_BASE = Path(__file__).parent / "../../public/social-assets"

BRAND_STYLE = "deep navy background #0B1220, royal blue #0066FF to cyan #00C2FF gradient accent, STEPHANO.IO branding, liquid glass corporativo aesthetic, Silicon Valley engineering luxury, frosted glass elements, minimal clean, no people, no faces, 8K sharp"

def build_prompt(slide: dict, index: int, total: int) -> str:
    """Build a nano-banana prompt for a slide."""
    headline = slide.get("headline", "")
    body = slide.get("body", "")
    slide_type = slide.get("type", "content")

    if slide_type == "cover" or index == 0:
        return (
            f"Premium Instagram carousel cover, {BRAND_STYLE}, "
            f"centered bold white headline '{headline}', "
            f"subtle radial cyan glow from bottom, abstract grid lines fading to dark, "
            f"thin cyan horizontal rule, monospace STEPHANO.IO top-right, 8K sharp"
        )
    elif slide_type == "cta" or index == total - 1:
        return (
            f"Instagram CTA slide, pure black #0A0A0F, {BRAND_STYLE}, "
            f"glowing cyan rectangle button with 'stephano.io', "
            f"white text '{headline}', scattered cyan particle dots, premium minimalist"
        )
    else:
        return (
            f"Instagram carousel content slide {index+1}/{total}, dark #111118, {BRAND_STYLE}, "
            f"thin vertical cyan left border, bold white headline '{headline}', "
            f"slide counter '{index+1}/{total}' top-right in cyan, clean grid layout, "
            f"muted body text '{body[:40]}' below headline"
        )

def generate_slide(prompt: str, output_name: str, output_dir: Path, size="1K") -> str:
    """Run nano-banana to generate a single slide."""
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / output_name

    cmd = [
        "bun", "run", NANO_BANANA,
        prompt,
        "-s", size,
        "-a", "1:1",
        "-o", str(output_path.with_suffix("")),
        "--api-key", GEMINI_KEY,
    ]

    print(f"  🎨 Generating: {output_name}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        # Find the generated file
        for ext in [".jpeg", ".jpg", ".png"]:
            candidate = output_path.with_suffix(ext)
            if candidate.exists():
                print(f"  ✓ {candidate}")
                return str(candidate)
    else:
        print(f"  ✗ Error: {result.stderr}")
    return ""

def generate_carousel(content: dict, output_subdir: str = None) -> list[str]:
    """Generate all slides for a carousel post."""
    slides = content.get("slides", [])
    title = content.get("carouselTitle", "post").replace(" ", "-").lower()[:30]
    output_dir = OUTPUT_BASE / (output_subdir or title)

    print(f"\n📸 Generating {len(slides)} slides for: {title}")
    generated = []

    for i, slide in enumerate(slides):
        prompt = build_prompt(slide, i, len(slides))
        filename = f"slide-{i+1:02d}"
        path = generate_slide(prompt, filename, output_dir)
        if path:
            generated.append(path)

    print(f"\n✅ Generated {len(generated)}/{len(slides)} slides")
    print(f"📁 Output: {output_dir}")
    return generated

def main():
    parser = argparse.ArgumentParser(description="Stephano.io Batch Visual Generator")
    parser.add_argument("--json", help="JSON file with carousel content")
    parser.add_argument("--topic", help="Topic to generate content for (uses Claude API)")
    parser.add_argument("--slides", type=int, default=5, help="Number of slides")
    parser.add_argument("--output", default=None, help="Output subdirectory")
    parser.add_argument("--size", default="1K", choices=["512", "1K", "2K"], help="Image size")
    parser.add_argument("--month", action="store_true", help="Generate full month calendar")
    args = parser.parse_args()

    if args.json:
        with open(args.json) as f:
            content = json.load(f)
        generate_carousel(content, args.output)

    elif args.topic:
        # Generate simple slides from topic
        content = {
            "carouselTitle": args.topic,
            "slides": [
                {"type": "cover", "headline": args.topic, "body": "Stephano.io te lo explica"},
                *[{"type": "content", "headline": f"Punto {i+1}", "body": "Swipe para más"} for i in range(args.slides - 2)],
                {"type": "cta", "headline": "¿Listo para el siguiente nivel?", "body": "stephano.io"},
            ]
        }
        generate_carousel(content, args.output)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
