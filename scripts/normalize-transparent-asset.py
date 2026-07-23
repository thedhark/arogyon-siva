from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Normalize a transparent cutout onto a square PNG canvas."
    )
    parser.add_argument("--input", required=True, help="Transparent source PNG")
    parser.add_argument("--out", required=True, help="Output PNG path")
    parser.add_argument("--size", type=int, default=768, help="Square canvas size")
    parser.add_argument(
        "--padding",
        type=float,
        default=0.1,
        help="Fractional padding around the cutout on the square canvas",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    source_path = Path(args.input)
    out_path = Path(args.out)
    image = Image.open(source_path).convert("RGBA")

    alpha_bbox = image.getchannel("A").getbbox()
    if alpha_bbox is None:
        raise SystemExit(f"No non-transparent pixels found in {source_path}")

    cutout = image.crop(alpha_bbox)
    max_subject_size = max(1, int(args.size * (1 - args.padding * 2)))
    scale = min(max_subject_size / cutout.width, max_subject_size / cutout.height)
    resized_size = (
        max(1, round(cutout.width * scale)),
        max(1, round(cutout.height * scale)),
    )
    cutout = cutout.resize(resized_size, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (args.size, args.size), (0, 0, 0, 0))
    offset = ((args.size - cutout.width) // 2, (args.size - cutout.height) // 2)
    canvas.alpha_composite(cutout, offset)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, optimize=True)
    print(f"Wrote {out_path} ({args.size}x{args.size})")


if __name__ == "__main__":
    main()
