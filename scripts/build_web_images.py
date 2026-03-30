#!/usr/bin/env python3
"""
Build web-optimized assets from files in images/ into images/web/.

Run from project root:
  uv run python scripts/build_web_images.py

Edit SOURCE_MAP below if you rename or replace source files.

The homepage gallery uses photos directly from data/food/ (WebP) — not generated here.
The header logo uses images/logo_without_bg.png — not generated here.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images"
OUT = ROOT / "images" / "web"

# Which file in images/ feeds each output in images/web/
SOURCE_MAP: dict[str, str] = {
    "hero.jpg": "cofarm.jpg",
    "work-banner.jpg": "planting2.jpg",
    "about.jpg": "medical.jpg",
    "logo-header.png": "logo_512x512.jpg",
    "logo-footer.png": "Untitled_Project_-_illustrationImage__2_-removebg-preview.png",
    "illustration-mascot.png": "Untitled_Project_-_illustrationImage-removebg-preview.png",
    "favicon.jpg": "favicon.jpg",
}


def crop_center_square(im: Image.Image) -> Image.Image:
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side))


def save_jpeg(
    im: Image.Image,
    dest: Path,
    *,
    quality: int = 88,
    max_width: int | None = None,
) -> None:
    im = im.convert("RGB")
    if max_width and im.width > max_width:
        ratio = max_width / im.width
        new_h = max(1, int(im.height * ratio))
        im = im.resize((max_width, new_h), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=quality, optimize=True)
    print(f"Wrote {dest.relative_to(ROOT)}  ({im.width}×{im.height})")


def save_png_resized(im: Image.Image, dest: Path, *, max_width: int | None = None) -> None:
    if im.mode in ("RGBA", "P"):
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")
    w, h = im.size
    if max_width and w > max_width:
        ratio = max_width / w
        new_h = max(1, int(h * ratio))
        im = im.resize((max_width, new_h), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "PNG", optimize=True)
    print(f"Wrote {dest.relative_to(ROOT)}  ({im.width}×{im.height})")


def build() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for out_name, src_name in SOURCE_MAP.items():
        src_path = SRC / src_name
        if not src_path.is_file():
            raise FileNotFoundError(f"Missing source: {src_path}")

        im = Image.open(src_path)
        dest = OUT / out_name

        if out_name == "hero.jpg":
            save_jpeg(im, dest, quality=88, max_width=1920)

        elif out_name == "work-banner.jpg":
            save_jpeg(im, dest, quality=88, max_width=1600)

        elif out_name == "about.jpg":
            sq = crop_center_square(im)
            save_jpeg(sq, dest, quality=88, max_width=720)

        elif out_name.startswith("gallery"):
            save_jpeg(im, dest, quality=88, max_width=900)

        elif out_name == "logo-header.png":
            save_png_resized(im, dest, max_width=240)

        elif out_name == "logo-footer.png":
            save_png_resized(im, dest, max_width=320)

        elif out_name == "illustration-mascot.png":
            save_png_resized(im, dest, max_width=400)

        elif out_name == "favicon.jpg":
            fav = crop_center_square(im.convert("RGB"))
            fav = fav.resize((48, 48), Image.Resampling.LANCZOS)
            save_jpeg(fav, dest, quality=92, max_width=None)

        else:
            save_jpeg(im, dest, quality=88, max_width=1600)

    print("Done.")


if __name__ == "__main__":
    build()
