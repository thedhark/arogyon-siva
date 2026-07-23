from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Remove a flat border-connected background while preserving enclosed light subject details."
    )
    parser.add_argument("--input", required=True, help="Source PNG/JPG")
    parser.add_argument("--out", required=True, help="Transparent PNG output path")
    parser.add_argument(
        "--threshold",
        type=float,
        default=42,
        help="RGB distance threshold from sampled border key color",
    )
    parser.add_argument(
        "--feather",
        type=float,
        default=0.7,
        help="Soft edge radius in pixels",
    )
    return parser.parse_args()


def sample_border_key(rgb: np.ndarray) -> np.ndarray:
    top = rgb[0, :, :]
    bottom = rgb[-1, :, :]
    left = rgb[:, 0, :]
    right = rgb[:, -1, :]
    border = np.concatenate([top, bottom, left, right], axis=0)
    return np.median(border, axis=0)


def flood_background(candidate: np.ndarray) -> np.ndarray:
    height, width = candidate.shape
    visited = np.zeros_like(candidate, dtype=bool)
    background = np.zeros_like(candidate, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidate[0, x]:
            queue.append((0, x))
        if candidate[height - 1, x]:
            queue.append((height - 1, x))
    for y in range(height):
        if candidate[y, 0]:
            queue.append((y, 0))
        if candidate[y, width - 1]:
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        if visited[y, x] or not candidate[y, x]:
            continue

        left = x
        while left > 0 and candidate[y, left - 1] and not visited[y, left - 1]:
            left -= 1

        right = x
        while (
            right < width - 1
            and candidate[y, right + 1]
            and not visited[y, right + 1]
        ):
            right += 1

        visited[y, left : right + 1] = True
        background[y, left : right + 1] = True

        for next_y in (y - 1, y + 1):
            if next_y < 0 or next_y >= height:
                continue
            row = candidate[next_y, left : right + 1] & ~visited[next_y, left : right + 1]
            for offset in np.flatnonzero(row):
                queue.append((next_y, left + int(offset)))

    return background


def main() -> None:
    args = parse_args()
    source_path = Path(args.input)
    out_path = Path(args.out)

    image = Image.open(source_path).convert("RGBA")
    arr = np.array(image)
    rgb = arr[:, :, :3].astype(np.float32)
    key = sample_border_key(rgb)
    distance = np.linalg.norm(rgb - key, axis=2)
    candidate = distance <= args.threshold
    background = flood_background(candidate)

    mask = Image.fromarray((background * 255).astype(np.uint8), "L")
    if args.feather > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(args.feather))

    alpha = np.array(image.getchannel("A"), dtype=np.uint8)
    background_alpha = np.array(mask, dtype=np.uint8)
    alpha = np.minimum(alpha, 255 - background_alpha)

    arr[:, :, 3] = alpha
    out_path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(arr, "RGBA").save(out_path, optimize=True)
    print(
        f"Wrote {out_path}; key=#{int(key[0]):02x}{int(key[1]):02x}{int(key[2]):02x}; "
        f"transparent={int((alpha == 0).sum())}/{alpha.size}"
    )


if __name__ == "__main__":
    main()
