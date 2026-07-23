from __future__ import annotations

import json
import math
import argparse
from pathlib import Path
from typing import Callable

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter


SIZE = 768
SCALE = 1
CANVAS = SIZE * SCALE
ROOT = Path("assets/images/medical-theme")
SPECIALTIES = ROOT / "specialties"
SITUATIONS = ROOT / "situations"

Color = tuple[int, int, int]
Drawer = Callable[[], Image.Image]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate themed transparent medical assets.")
    parser.add_argument(
        "--mode",
        choices=["all", "situations", "specialties"],
        default="all",
        help="Generate all assets or only one category.",
    )
    return parser.parse_args()


def s(value: float) -> int:
    return round(value * SCALE)


def box(values: tuple[float, float, float, float]) -> tuple[int, int, int, int]:
    return tuple(s(v) for v in values)


def pt(values: tuple[float, float]) -> tuple[int, int]:
    return s(values[0]), s(values[1])


def blank() -> Image.Image:
    return Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))


def rgba(color: Color, alpha: int = 255) -> tuple[int, int, int, int]:
    return color[0], color[1], color[2], alpha


def add_shadow(
    image: Image.Image,
    mask: Image.Image,
    opacity: int = 48,
    blur: float = 18,
    offset: tuple[float, float] = (10, 16),
    color: Color = (65, 45, 55),
) -> None:
    shadow_alpha = mask.filter(ImageFilter.GaussianBlur(s(blur)))
    shadow_alpha = Image.eval(shadow_alpha, lambda px: int(px * opacity / 255))
    shadow = Image.new("RGBA", image.size, rgba(color, 0))
    shadow.putalpha(shadow_alpha)
    layer = blank()
    layer.alpha_composite(shadow, pt(offset))
    image.alpha_composite(layer)


def gradient_fill(
    image: Image.Image,
    mask: Image.Image,
    top: Color,
    bottom: Color,
    highlight: bool = True,
) -> None:
    width, height = image.size
    alpha = np.asarray(mask, dtype=np.float32) / 255.0
    yy = np.linspace(0, 1, height, dtype=np.float32)[:, None]
    base = np.zeros((height, width, 4), dtype=np.float32)
    for channel in range(3):
        base[:, :, channel] = top[channel] * (1 - yy) + bottom[channel] * yy

    if highlight:
        xx = np.linspace(0, 1, width, dtype=np.float32)[None, :]
        glow = 1 - np.sqrt(((xx - 0.34) / 0.42) ** 2 + ((yy - 0.24) / 0.5) ** 2)
        glow = np.clip(glow, 0, 1) * 34
        base[:, :, :3] = np.clip(base[:, :, :3] + glow[:, :, None], 0, 255)

    base[:, :, 3] = alpha * 255
    image.alpha_composite(Image.fromarray(base.astype(np.uint8), "RGBA"))


def mask_ellipse(values: tuple[float, float, float, float]) -> Image.Image:
    mask = Image.new("L", (CANVAS, CANVAS), 0)
    ImageDraw.Draw(mask).ellipse(box(values), fill=255)
    return mask


def mask_round_rect(values: tuple[float, float, float, float], radius: float) -> Image.Image:
    mask = Image.new("L", (CANVAS, CANVAS), 0)
    ImageDraw.Draw(mask).rounded_rectangle(box(values), radius=s(radius), fill=255)
    return mask


def mask_polygon(points: list[tuple[float, float]]) -> Image.Image:
    mask = Image.new("L", (CANVAS, CANVAS), 0)
    ImageDraw.Draw(mask).polygon([pt(p) for p in points], fill=255)
    return mask


def draw_masked(
    image: Image.Image,
    mask: Image.Image,
    top: Color,
    bottom: Color,
    shadow: bool = True,
    outline: Color | None = (255, 235, 235),
    outline_width: float = 2,
) -> None:
    if shadow:
        add_shadow(image, mask)
    gradient_fill(image, mask, top, bottom)
    if outline:
        edge = ImageChops.subtract(
            mask.filter(ImageFilter.MaxFilter(s(outline_width) * 2 + 1)), mask
        )
        outline_layer = Image.new("RGBA", image.size, rgba(outline, 90))
        outline_layer.putalpha(edge)
        image.alpha_composite(outline_layer)

    highlight = Image.new("L", image.size, 0)
    ImageDraw.Draw(highlight).ellipse(box((220, 110, 470, 270)), fill=70)
    highlight = ImageChops.multiply(highlight.filter(ImageFilter.GaussianBlur(s(12))), mask)
    shine = Image.new("RGBA", image.size, rgba((255, 255, 255), 0))
    shine.putalpha(highlight)
    image.alpha_composite(shine)


def glossy_ellipse(
    image: Image.Image,
    values: tuple[float, float, float, float],
    top: Color,
    bottom: Color,
    outline: Color | None = (255, 235, 235),
    shadow: bool = True,
) -> None:
    draw_masked(image, mask_ellipse(values), top, bottom, shadow=shadow, outline=outline)


def glossy_round_rect(
    image: Image.Image,
    values: tuple[float, float, float, float],
    radius: float,
    top: Color,
    bottom: Color,
    outline: Color | None = (255, 235, 235),
    shadow: bool = True,
) -> None:
    draw_masked(image, mask_round_rect(values, radius), top, bottom, shadow=shadow, outline=outline)


def tube(
    image: Image.Image,
    points: list[tuple[float, float]],
    color: Color,
    width: float,
    highlight: bool = True,
    shadow: bool = True,
) -> None:
    draw = ImageDraw.Draw(image, "RGBA")
    coords = [pt(p) for p in points]
    if shadow:
        draw.line([(x + s(6), y + s(8)) for x, y in coords], fill=(70, 35, 40, 40), width=s(width + 6), joint="curve")
    draw.line(coords, fill=rgba(color), width=s(width), joint="curve")
    if highlight:
        draw.line([(x - s(2), y - s(4)) for x, y in coords], fill=(255, 255, 255, 78), width=max(1, s(width * 0.22)), joint="curve")


def bezier(
    p0: tuple[float, float],
    p1: tuple[float, float],
    p2: tuple[float, float],
    p3: tuple[float, float],
    steps: int = 64,
) -> list[tuple[float, float]]:
    pts = []
    for i in range(steps + 1):
        t = i / steps
        a = (1 - t) ** 3
        b = 3 * (1 - t) ** 2 * t
        c = 3 * (1 - t) * t**2
        d = t**3
        pts.append(
            (
                a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
                a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
            )
        )
    return pts


def draw_heart_icon(image: Image.Image, center: tuple[float, float], scale: float, color: Color = (239, 83, 96)) -> None:
    cx, cy = center
    pts = []
    for i in range(160):
        t = math.pi * 2 * i / 160
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((cx + x * scale, cy + y * scale))
    draw_masked(image, mask_polygon(pts), (255, 128, 138), color, outline=(255, 220, 225), shadow=True)


def draw_cross(image: Image.Image, center: tuple[float, float], size: float, color: Color = (31, 177, 130)) -> None:
    cx, cy = center
    r = size / 5
    pts = [
        (cx - r, cy - size / 2),
        (cx + r, cy - size / 2),
        (cx + r, cy - r),
        (cx + size / 2, cy - r),
        (cx + size / 2, cy + r),
        (cx + r, cy + r),
        (cx + r, cy + size / 2),
        (cx - r, cy + size / 2),
        (cx - r, cy + r),
        (cx - size / 2, cy + r),
        (cx - size / 2, cy - r),
        (cx - r, cy - r),
    ]
    draw_masked(image, mask_polygon(pts), (102, 229, 186), color, outline=(225, 255, 245), shadow=True)


def draw_pain_rings(image: Image.Image, center: tuple[float, float], radii: list[float], color: Color = (231, 61, 82)) -> None:
    draw = ImageDraw.Draw(image, "RGBA")
    cx, cy = center
    for i, radius in enumerate(radii):
        alpha = 170 - i * 36
        draw.ellipse(
            box((cx - radius, cy - radius, cx + radius, cy + radius)),
            outline=rgba(color, max(50, alpha)),
            width=s(5),
        )


def draw_warning_triangle(image: Image.Image, center: tuple[float, float], size: float) -> None:
    cx, cy = center
    pts = [(cx, cy - size / 2), (cx - size / 2, cy + size / 2), (cx + size / 2, cy + size / 2)]
    draw_masked(image, mask_polygon(pts), (255, 226, 123), (245, 139, 64), outline=(255, 247, 210), shadow=True)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.rounded_rectangle(box((cx - 9, cy - 35, cx + 9, cy + 20)), radius=s(8), fill=(104, 57, 26, 210))
    draw.ellipse(box((cx - 9, cy + 36, cx + 9, cy + 54)), fill=(104, 57, 26, 210))


def finish(image: Image.Image) -> Image.Image:
    return image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def fit_existing(path: Path, padding: float = 0.06) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    bbox = image.getchannel("A").getbbox()
    if bbox:
        image = image.crop(bbox)
    max_size = int(SIZE * (1 - padding * 2))
    scale = min(max_size / image.width, max_size / image.height)
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(image, ((SIZE - image.width) // 2, (SIZE - image.height) // 2))
    return canvas


def existing_or(drawer: Drawer, name: str) -> Image.Image:
    path = ROOT / f"{name}.png"
    if path.exists():
        return fit_existing(path)
    return drawer()


def draw_stethoscope() -> Image.Image:
    image = blank()
    left = bezier((205, 205), (160, 330), (230, 510), (365, 510))
    right = bezier((563, 205), (610, 330), (540, 510), (405, 510))
    tube(image, left, (64, 107, 189), 24)
    tube(image, right, (64, 107, 189), 24)
    tube(image, bezier((365, 510), (368, 605), (270, 620), (270, 690)), (64, 107, 189), 22)
    glossy_ellipse(image, (238, 642, 346, 750), (224, 240, 255), (93, 135, 204), outline=(235, 245, 255))
    glossy_ellipse(image, (262, 666, 322, 726), (255, 255, 255), (190, 219, 252), shadow=False)
    glossy_ellipse(image, (168, 160, 242, 238), (245, 250, 255), (90, 130, 203), outline=(235, 245, 255))
    glossy_ellipse(image, (526, 160, 600, 238), (245, 250, 255), (90, 130, 203), outline=(235, 245, 255))
    draw_heart_icon(image, (500, 535), 6.4)
    draw_cross(image, (472, 350), 78)
    return finish(image)


def draw_surgery() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (120, 462, 648, 650), (255, 190, 188), (232, 105, 116), outline=(255, 220, 220))
    draw_pain_rings(image, (384, 554), [62, 94], (194, 38, 52))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.line([pt((230, 552)), pt((538, 552))], fill=(122, 30, 38, 140), width=s(8))
    glossy_round_rect(image, (292, 206, 620, 266), 26, (234, 244, 252), (150, 172, 197), outline=(255, 255, 255))
    blade = [(600, 208), (710, 236), (608, 282), (560, 252)]
    draw_masked(image, mask_polygon(blade), (250, 253, 255), (168, 191, 215), outline=(255, 255, 255), shadow=True)
    tube(image, bezier((240, 212), (188, 278), (170, 362), (214, 424)), (174, 190, 210), 14)
    tube(image, bezier((288, 218), (235, 305), (250, 390), (318, 432)), (174, 190, 210), 14)
    return finish(image)


def draw_oncology() -> Image.Image:
    image = blank()
    centers = [(330, 350), (412, 330), (392, 420), (304, 434), (470, 420), (362, 500), (255, 380)]
    for i, c in enumerate(centers):
        r = [80, 88, 74, 76, 68, 72, 60][i]
        glossy_ellipse(image, (c[0] - r, c[1] - r, c[0] + r, c[1] + r), (255, 185, 205), (205, 85, 145), outline=(255, 224, 235))
        glossy_ellipse(image, (c[0] - r * 0.22, c[1] - r * 0.22, c[0] + r * 0.22, c[1] + r * 0.22), (180, 126, 222), (128, 70, 177), outline=None, shadow=False)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.ellipse(box((205, 205, 555, 555)), outline=(88, 119, 192, 235), width=s(20))
    tube(image, [(515, 515), (650, 650)], (88, 119, 192), 26)
    tube(image, bezier((175, 610), (255, 500), (315, 610), (395, 500)), (235, 132, 164), 22)
    tube(image, bezier((395, 500), (470, 610), (552, 520), (590, 640)), (235, 132, 164), 22)
    return finish(image)


def draw_pediatrics() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (230, 140, 538, 448), (255, 219, 196), (245, 165, 145), outline=(255, 235, 224))
    glossy_ellipse(image, (195, 272, 255, 342), (255, 213, 190), (244, 161, 143), shadow=False)
    glossy_ellipse(image, (513, 272, 573, 342), (255, 213, 190), (244, 161, 143), shadow=False)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.ellipse(box((302, 278, 326, 302)), fill=(78, 58, 54, 220))
    draw.ellipse(box((442, 278, 466, 302)), fill=(78, 58, 54, 220))
    draw.arc(box((330, 310, 438, 385)), 20, 160, fill=(150, 74, 78, 210), width=s(6))
    tube(image, bezier((285, 500), (338, 575), (430, 575), (483, 500)), (64, 107, 189), 18)
    draw_heart_icon(image, (384, 560), 4.9, (237, 93, 116))
    draw_cross(image, (520, 210), 70)
    return finish(image)


def draw_bone_joint() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (214, 110, 430, 330), (255, 246, 228), (227, 197, 164), outline=(255, 250, 236))
    glossy_ellipse(image, (340, 108, 554, 328), (255, 246, 228), (227, 197, 164), outline=(255, 250, 236))
    glossy_round_rect(image, (300, 240, 468, 520), 78, (255, 246, 228), (227, 197, 164), outline=(255, 250, 236))
    glossy_round_rect(image, (270, 468, 498, 620), 74, (255, 246, 228), (227, 197, 164), outline=(255, 250, 236))
    glossy_ellipse(image, (250, 360, 520, 505), (134, 219, 234), (42, 151, 190), outline=(215, 252, 255), shadow=False)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.line([pt((305, 430)), pt((464, 430))], fill=(255, 255, 255, 120), width=s(7))
    return finish(image)


def draw_skin() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (126, 170, 642, 606), 40, (255, 211, 196), (237, 135, 128), outline=(255, 232, 224))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.rounded_rectangle(box((126, 270, 642, 366)), radius=s(28), fill=(255, 158, 162, 220))
    draw.rounded_rectangle(box((126, 366, 642, 606)), radius=s(38), fill=(246, 180, 92, 185))
    for x in [180, 250, 315, 430, 510, 585]:
        tube(image, bezier((x, 340), (x - 36, 430), (x + 32, 470), (x - 10, 560)), (181, 62, 88), 6, shadow=False)
    for c, r in [((250, 240), 24), ((330, 220), 15), ((405, 255), 20), ((512, 230), 18), ((456, 310), 13)]:
        glossy_ellipse(image, (c[0] - r, c[1] - r, c[0] + r, c[1] + r), (255, 128, 136), (205, 54, 77), outline=(255, 214, 218))
    return finish(image)


def draw_ent() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (230, 110, 570, 640), (255, 221, 204), (242, 160, 148), outline=(255, 236, 226))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.polygon([pt((396, 255)), pt((485, 366)), pt((392, 392))], fill=(255, 188, 172, 230))
    draw.arc(box((214, 248, 354, 424)), 80, 300, fill=(196, 74, 90, 230), width=s(18))
    draw.arc(box((248, 294, 326, 380)), 90, 310, fill=(255, 228, 220, 210), width=s(10))
    tube(image, bezier((382, 402), (380, 480), (430, 548), (500, 578)), (211, 82, 98), 20)
    tube(image, bezier((350, 260), (400, 250), (430, 282), (452, 328)), (80, 132, 203), 10)
    return finish(image)


def draw_diabetes() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (160, 190, 455, 600), 46, (245, 253, 255), (176, 207, 228), outline=(255, 255, 255))
    glossy_round_rect(image, (205, 250, 410, 365), 28, (222, 247, 245), (95, 191, 185), outline=(240, 255, 255), shadow=False)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.line([pt((230, 318)), pt((280, 318)), pt((298, 288)), pt((330, 348)), pt((355, 318)), pt((392, 318))], fill=(23, 126, 121, 230), width=s(7), joint="curve")
    draw_heart_icon(image, (565, 410), 6.5, (229, 50, 72))
    glossy_ellipse(image, (522, 465, 610, 555), (255, 154, 170), (211, 41, 68), outline=(255, 218, 225))
    draw_cross(image, (338, 510), 78, (43, 169, 126))
    return finish(image)


def draw_hernia() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (170, 150, 598, 628), (255, 205, 190), (236, 126, 115), outline=(255, 230, 222))
    glossy_ellipse(image, (292, 300, 476, 520), (255, 170, 156), (206, 78, 92), outline=(255, 218, 214), shadow=True)
    draw = ImageDraw.Draw(image, "RGBA")
    for x in range(260, 522, 38):
        draw.line([pt((x, 226)), pt((x + 60, 602))], fill=(255, 255, 255, 72), width=s(4))
    for x in range(270, 530, 38):
        draw.line([pt((x + 60, 226)), pt((x, 602))], fill=(255, 255, 255, 72), width=s(4))
    draw_pain_rings(image, (384, 414), [108, 152], (215, 62, 79))
    return finish(image)


def draw_spine() -> Image.Image:
    image = blank()
    x = 384
    for i in range(8):
        y = 142 + i * 70
        glossy_round_rect(image, (292, y, 476, y + 58), 28, (255, 242, 219), (224, 190, 158), outline=(255, 250, 235), shadow=True)
        glossy_ellipse(image, (324, y + 44, 444, y + 82), (133, 216, 232), (44, 151, 190), outline=(221, 252, 255), shadow=False)
    tube(image, bezier((x, 130), (330, 280), (442, 455), (372, 650)), (219, 86, 104), 16)
    return finish(image)


def draw_thyroid() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (342, 132, 426, 640), 38, (255, 224, 211), (229, 143, 132), outline=(255, 238, 230))
    for y in range(186, 590, 48):
        ImageDraw.Draw(image, "RGBA").line([pt((350, y)), pt((418, y))], fill=(255, 255, 255, 92), width=s(6))
    glossy_ellipse(image, (160, 230, 386, 526), (255, 151, 166), (210, 65, 99), outline=(255, 222, 228))
    glossy_ellipse(image, (382, 230, 608, 526), (255, 151, 166), (210, 65, 99), outline=(255, 222, 228))
    tube(image, bezier((278, 374), (344, 344), (424, 344), (490, 374)), (238, 103, 134), 30)
    return finish(image)


def draw_weight() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (160, 220, 608, 600), 64, (246, 253, 255), (182, 215, 229), outline=(255, 255, 255))
    glossy_ellipse(image, (282, 270, 486, 474), (225, 250, 245), (92, 184, 172), outline=(238, 255, 252), shadow=False)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.line([pt((384, 372)), pt((440, 312))], fill=(35, 109, 111, 230), width=s(8))
    tube(image, bezier((166, 640), (286, 574), (426, 682), (602, 610)), (244, 172, 70), 26)
    for x in [245, 325, 405, 485, 565]:
        draw.line([pt((x, 611)), pt((x + 10, 631))], fill=(255, 244, 210, 170), width=s(4))
    return finish(image)


def draw_pregnancy() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (204, 118, 564, 682), (255, 203, 202), (232, 103, 124), outline=(255, 229, 230))
    glossy_ellipse(image, (272, 214, 496, 546), (255, 228, 215), (244, 165, 149), outline=(255, 240, 232), shadow=False)
    glossy_ellipse(image, (318, 298, 468, 482), (255, 214, 184), (231, 135, 119), outline=(255, 238, 222), shadow=True)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.arc(box((306, 286, 454, 462)), 38, 324, fill=(172, 82, 86, 140), width=s(10))
    draw.ellipse(box((392, 328, 434, 370)), fill=(230, 139, 123, 180))
    tube(image, bezier((384, 130), (392, 202), (390, 294), (386, 382)), (238, 115, 130), 12, shadow=False)
    draw_cross(image, (514, 196), 66, (35, 174, 128))
    return finish(image)


def draw_lab() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (262, 108, 506, 610), 42, (240, 250, 255), (150, 196, 221), outline=(255, 255, 255))
    glossy_round_rect(image, (298, 158, 470, 246), 20, (255, 255, 255), (200, 226, 238), outline=(255, 255, 255), shadow=False)
    glossy_ellipse(image, (246, 432, 522, 704), (112, 222, 214), (18, 159, 150), outline=(210, 255, 250))
    draw = ImageDraw.Draw(image, "RGBA")
    for x in [324, 384, 444]:
        draw.line([pt((x, 250)), pt((x, 420))], fill=(80, 126, 162, 170), width=s(5))
    glossy_ellipse(image, (178, 230, 280, 332), (255, 147, 162), (212, 51, 77), outline=(255, 221, 226))
    return finish(image)


def draw_hospital() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (160, 190, 608, 650), 42, (238, 250, 255), (165, 205, 224), outline=(255, 255, 255))
    glossy_round_rect(image, (258, 300, 510, 650), 32, (252, 255, 255), (194, 224, 238), outline=(255, 255, 255), shadow=False)
    draw_cross(image, (384, 240), 96, (28, 168, 126))
    draw = ImageDraw.Draw(image, "RGBA")
    for y in [370, 448, 526]:
        for x in [210, 312, 456, 558]:
            draw.rounded_rectangle(box((x - 24, y - 24, x + 24, y + 24)), radius=s(10), fill=(84, 143, 194, 120))
    return finish(image)


def draw_home_care() -> Image.Image:
    image = blank()
    roof = [(150, 360), (384, 160), (618, 360)]
    draw_masked(image, mask_polygon(roof), (255, 146, 156), (218, 62, 85), outline=(255, 225, 230), shadow=True)
    glossy_round_rect(image, (200, 334, 568, 650), 42, (244, 253, 255), (174, 215, 228), outline=(255, 255, 255))
    draw_heart_icon(image, (384, 470), 6.2, (239, 78, 104))
    draw_cross(image, (505, 252), 68, (35, 174, 128))
    return finish(image)


def draw_shield() -> Image.Image:
    image = blank()
    pts = [(384, 110), (580, 190), (545, 480), (384, 660), (223, 480), (188, 190)]
    draw_masked(image, mask_polygon(pts), (235, 252, 255), (99, 185, 204), outline=(245, 255, 255), shadow=True)
    draw_heart_icon(image, (384, 356), 7.2, (234, 73, 101))
    draw_cross(image, (474, 510), 70, (38, 170, 126))
    return finish(image)


def draw_family() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (248, 142, 406, 300), (255, 216, 194), (243, 156, 137), outline=(255, 234, 224))
    glossy_ellipse(image, (410, 178, 546, 314), (255, 216, 194), (243, 156, 137), outline=(255, 234, 224))
    glossy_ellipse(image, (334, 264, 454, 384), (255, 224, 203), (245, 165, 146), outline=(255, 236, 226))
    glossy_round_rect(image, (210, 312, 586, 630), 92, (240, 250, 255), (155, 202, 225), outline=(255, 255, 255))
    draw_heart_icon(image, (384, 454), 5.6, (238, 82, 107))
    draw_cross(image, (506, 446), 64, (35, 172, 126))
    return finish(image)


def draw_fitness() -> Image.Image:
    image = blank()
    tube(image, [(120, 384), (648, 384)], (80, 107, 140), 34)
    for x in [170, 220, 548, 598]:
        glossy_round_rect(image, (x - 34, 262, x + 34, 506), 24, (236, 246, 252), (139, 162, 184), outline=(255, 255, 255))
    draw_heart_icon(image, (384, 250), 5.7, (239, 80, 103))
    tube(image, bezier((260, 552), (335, 510), (430, 610), (510, 548)), (37, 168, 128), 22)
    return finish(image)


def draw_fever() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (220, 168, 548, 566), (255, 221, 203), (243, 159, 142), outline=(255, 236, 226))
    glossy_round_rect(image, (490, 98, 570, 452), 40, (246, 252, 255), (170, 205, 226), outline=(255, 255, 255))
    glossy_ellipse(image, (468, 390, 592, 514), (255, 132, 144), (214, 48, 72), outline=(255, 220, 225))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.rounded_rectangle(box((520, 160, 540, 414)), radius=s(10), fill=(218, 57, 81, 220))
    for x in [258, 344, 430]:
        tube(image, bezier((x, 120), (x - 35, 80), (x + 35, 52), (x, 20)), (231, 91, 79), 9, shadow=False)
    return finish(image)


def draw_accident() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (160, 300, 608, 500), 46, (255, 224, 207), (239, 153, 134), outline=(255, 238, 228))
    band = mask_round_rect((198, 326, 570, 474), 32)
    draw_masked(image, band, (252, 246, 232), (221, 195, 162), outline=(255, 252, 242), shadow=True)
    draw = ImageDraw.Draw(image, "RGBA")
    for x in range(238, 532, 48):
        draw.ellipse(box((x - 8, 392 - 8, x + 8, 392 + 8)), fill=(188, 151, 116, 95))
    draw_cross(image, (384, 214), 92, (35, 174, 128))
    draw_pain_rings(image, (384, 400), [118, 158], (220, 63, 82))
    return finish(image)


def draw_poisoning() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (260, 176, 508, 620), 54, (234, 252, 247), (87, 183, 154), outline=(245, 255, 251))
    glossy_round_rect(image, (300, 100, 468, 188), 26, (238, 246, 251), (147, 168, 190), outline=(255, 255, 255))
    glossy_ellipse(image, (286, 390, 482, 596), (120, 224, 175), (24, 151, 112), outline=(218, 255, 237), shadow=False)
    draw_warning_triangle(image, (384, 350), 150)
    glossy_ellipse(image, (156, 488, 280, 612), (255, 154, 160), (214, 51, 72), outline=(255, 224, 226))
    return finish(image)


def draw_chest_pain() -> Image.Image:
    image = blank()
    torso = [(210, 656), (266, 278), (384, 180), (502, 278), (558, 656)]
    draw_masked(image, mask_polygon(torso), (255, 225, 207), (238, 151, 133), outline=(255, 238, 226), shadow=True)
    draw_heart_icon(image, (388, 404), 6.8, (231, 48, 72))
    draw_pain_rings(image, (388, 404), [92, 132, 172], (225, 45, 67))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.line([pt((236, 474)), pt((320, 474)), pt((348, 430)), pt((396, 526)), pt((432, 474)), pt((540, 474))], fill=(255, 255, 255, 160), width=s(8), joint="curve")
    return finish(image)


def draw_breathing() -> Image.Image:
    image = existing_or(draw_stethoscope, "pulmonology").resize((CANVAS, CANVAS), Image.Resampling.LANCZOS)
    tube(image, bezier((144, 254), (64, 304), (64, 424), (142, 482)), (78, 174, 220), 16)
    tube(image, bezier((624, 254), (704, 304), (704, 424), (626, 482)), (78, 174, 220), 16)
    tube(image, bezier((184, 174), (108, 214), (106, 292), (174, 332)), (96, 201, 225), 10, shadow=False)
    tube(image, bezier((584, 174), (660, 214), (662, 292), (594, 332)), (96, 201, 225), 10, shadow=False)
    return finish(image)


def draw_stomach_pain() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (216, 190, 560, 540), (255, 179, 164), (218, 72, 92), outline=(255, 224, 218))
    tube(image, bezier((356, 170), (486, 192), (535, 315), (492, 440)), (236, 106, 119), 34)
    tube(image, bezier((298, 456), (200, 560), (332, 628), (462, 550)), (241, 138, 104), 32)
    draw_pain_rings(image, (386, 386), [72, 116, 158], (222, 60, 77))
    return finish(image)


def draw_fracture() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (280, 110, 488, 640), 92, (255, 246, 228), (225, 194, 160), outline=(255, 250, 236))
    glossy_ellipse(image, (212, 100, 356, 244), (255, 246, 228), (225, 194, 160), outline=(255, 250, 236), shadow=False)
    glossy_ellipse(image, (412, 100, 556, 244), (255, 246, 228), (225, 194, 160), outline=(255, 250, 236), shadow=False)
    glossy_ellipse(image, (212, 506, 356, 650), (255, 246, 228), (225, 194, 160), outline=(255, 250, 236), shadow=False)
    glossy_ellipse(image, (412, 506, 556, 650), (255, 246, 228), (225, 194, 160), outline=(255, 250, 236), shadow=False)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.line([pt((392, 254)), pt((345, 326)), pt((416, 394)), pt((350, 484))], fill=(151, 75, 57, 220), width=s(10), joint="curve")
    draw_pain_rings(image, (382, 374), [100, 144], (219, 62, 80))
    return finish(image)


def draw_migraine() -> Image.Image:
    image = existing_or(draw_stethoscope, "brain").resize((CANVAS, CANVAS), Image.Resampling.LANCZOS)
    draw_pain_rings(image, (264, 292), [46, 82, 122], (231, 65, 92))
    draw = ImageDraw.Draw(image, "RGBA")
    for p in [(230, 250), (258, 214), (288, 260), (248, 306)]:
        draw.line([pt(p), pt((p[0] + 28, p[1] - 42))], fill=(231, 65, 92, 180), width=s(6))
    return finish(image)


def draw_burn() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (152, 206, 616, 584), 56, (255, 209, 190), (239, 143, 121), outline=(255, 235, 224))
    for c, r, color in [((318, 360), 78, (232, 66, 71)), ((420, 390), 68, (245, 115, 68)), ((382, 312), 42, (255, 176, 90))]:
        glossy_ellipse(image, (c[0] - r, c[1] - r, c[0] + r, c[1] + r), tuple(min(255, v + 45) for v in color), color, outline=(255, 226, 218), shadow=False)
    draw_pain_rings(image, (384, 368), [120, 164], (223, 60, 75))
    return finish(image)


def draw_allergy() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (180, 156, 548, 612), (255, 221, 204), (242, 160, 148), outline=(255, 236, 226))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.polygon([pt((360, 270)), pt((510, 380)), pt((360, 424))], fill=(255, 188, 172, 230))
    for c, r in [((276, 474), 22), ((336, 520), 18), ((454, 486), 20), ((506, 540), 16), ((238, 392), 14)]:
        glossy_ellipse(image, (c[0] - r, c[1] - r, c[0] + r, c[1] + r), (255, 132, 144), (208, 47, 72), outline=(255, 220, 225), shadow=False)
    tube(image, bezier((540, 220), (604, 188), (664, 224), (700, 174)), (84, 177, 215), 10)
    tube(image, bezier((558, 302), (636, 280), (658, 352), (718, 330)), (84, 177, 215), 10)
    return finish(image)


def draw_bp() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (112, 248, 342, 560), 42, (98, 141, 205), (52, 86, 153), outline=(227, 239, 255))
    tube(image, bezier((342, 370), (446, 302), (542, 356), (548, 466)), (64, 107, 189), 18)
    glossy_ellipse(image, (454, 328, 656, 530), (245, 253, 255), (162, 204, 225), outline=(255, 255, 255))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.arc(box((492, 368, 618, 494)), 195, 345, fill=(214, 56, 78, 230), width=s(10))
    draw.line([pt((555, 430)), pt((612, 390))], fill=(38, 74, 108, 230), width=s(8))
    draw_pain_rings(image, (555, 430), [126, 162], (221, 62, 82))
    return finish(image)


def draw_bite() -> Image.Image:
    image = blank()
    glossy_round_rect(image, (152, 220, 616, 568), 58, (255, 210, 192), (239, 144, 124), outline=(255, 236, 224))
    draw = ImageDraw.Draw(image, "RGBA")
    marks = [(314, 340), (354, 320), (414, 320), (454, 340), (324, 440), (444, 440)]
    for x, y in marks:
        draw.ellipse(box((x - 18, y - 26, x + 18, y + 26)), fill=(149, 38, 52, 170))
        draw.ellipse(box((x - 9, y - 13, x + 9, y + 13)), fill=(255, 190, 185, 125))
    draw_pain_rings(image, (384, 384), [112, 150], (219, 61, 80))
    return finish(image)


def draw_acne() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (176, 146, 592, 642), (255, 218, 198), (242, 155, 135), outline=(255, 235, 224))
    for c, r in [((296, 320), 22), ((360, 374), 16), ((430, 308), 18), ((456, 430), 23), ((332, 462), 13), ((504, 372), 12), ((260, 412), 14)]:
        glossy_ellipse(image, (c[0] - r, c[1] - r, c[0] + r, c[1] + r), (255, 128, 140), (205, 45, 70), outline=(255, 220, 225), shadow=False)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.ellipse(box((210, 242, 530, 562)), outline=(255, 255, 255, 170), width=s(10))
    tube(image, [(500, 540), (620, 660)], (96, 126, 190), 22)
    return finish(image)


def draw_hair_loss() -> Image.Image:
    image = blank()
    glossy_ellipse(image, (204, 180, 564, 650), (255, 220, 204), (244, 160, 143), outline=(255, 236, 226))
    draw = ImageDraw.Draw(image, "RGBA")
    for start_x in range(250, 530, 34):
        tube(image, bezier((start_x, 210), (start_x - 20, 155), (start_x + 30, 126), (start_x + 2, 74)), (98, 60, 42), 9, shadow=False)
    for x, y, a in [(156, 448, -35), (606, 360, 28), (528, 620, 55), (230, 626, -45)]:
        tube(image, bezier((x, y), (x + 40 * math.cos(math.radians(a)), y - 80), (x + 96, y + 34), (x + 126, y - 54)), (98, 60, 42), 8, shadow=False)
    draw_pain_rings(image, (386, 226), [84, 126], (222, 126, 65))
    return finish(image)


def draw_sexual_health() -> Image.Image:
    image = draw_shield().resize((CANVAS, CANVAS), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(image, "RGBA")
    draw.ellipse(box((214, 206, 360, 352)), outline=(236, 112, 142, 235), width=s(18))
    draw.line([pt((287, 352)), pt((287, 456))], fill=(236, 112, 142, 235), width=s(18))
    draw.line([pt((244, 410)), pt((330, 410))], fill=(236, 112, 142, 235), width=s(18))
    draw.ellipse(box((426, 206, 572, 352)), outline=(82, 142, 209, 235), width=s(18))
    draw.line([pt((530, 248)), pt((606, 172))], fill=(82, 142, 209, 235), width=s(18))
    draw.line([pt((606, 172)), pt((592, 235))], fill=(82, 142, 209, 235), width=s(18))
    draw.line([pt((606, 172)), pt((542, 186))], fill=(82, 142, 209, 235), width=s(18))
    return finish(image)


def draw_period_pain() -> Image.Image:
    image = existing_or(draw_thyroid, "womens-health").resize((CANVAS, CANVAS), Image.Resampling.LANCZOS)
    draw_pain_rings(image, (384, 438), [88, 132, 176], (223, 58, 83))
    return finish(image)


def draw_stress() -> Image.Image:
    image = draw_migraine().resize((CANVAS, CANVAS), Image.Resampling.LANCZOS)
    tube(image, bezier((156, 624), (236, 570), (306, 640), (380, 586)), (81, 178, 209), 14)
    tube(image, bezier((408, 594), (476, 544), (554, 636), (624, 580)), (81, 178, 209), 14)
    return finish(image)


def draw_acidity() -> Image.Image:
    image = draw_stomach_pain().resize((CANVAS, CANVAS), Image.Resampling.LANCZOS)
    for c, r in [((480, 300), 25), ((526, 362), 17), ((438, 240), 14), ((548, 452), 20)]:
        glossy_ellipse(image, (c[0] - r, c[1] - r, c[0] + r, c[1] + r), (255, 230, 92), (240, 148, 52), outline=(255, 247, 204), shadow=False)
    return finish(image)


def draw_generic_care() -> Image.Image:
    image = blank()
    draw_heart_icon(image, (384, 358), 8.2, (238, 78, 105))
    draw_cross(image, (498, 494), 86, (33, 174, 128))
    tube(image, bezier((190, 560), (292, 650), (480, 650), (578, 560)), (93, 132, 196), 20)
    return finish(image)


CORE_DRAWERS: dict[str, Drawer] = {
    "general-physician": draw_stethoscope,
    "doctor": draw_stethoscope,
    "clinical": draw_stethoscope,
    "general-surgery": draw_surgery,
    "oncology": draw_oncology,
    "pediatrics": draw_pediatrics,
    "orthopedics": draw_bone_joint,
    "knee": draw_bone_joint,
    "dermatology": draw_skin,
    "skin": draw_skin,
    "ent-care": draw_ent,
    "diabetes": draw_diabetes,
    "diabetology": draw_diabetes,
    "hernia": draw_hernia,
    "spine": draw_spine,
    "thyroid": draw_thyroid,
    "weight-loss": draw_weight,
    "weight-care": draw_weight,
    "labs": draw_lab,
    "diagnostics": draw_lab,
    "scans": draw_lab,
    "hospital": draw_hospital,
    "clinic": draw_hospital,
    "home-care": draw_home_care,
    "insurance": draw_shield,
    "family": draw_family,
    "fitness": draw_fitness,
    "physiotherapy": draw_fitness,
    "rehab": draw_fitness,
    "post-surgery": draw_surgery,
    "wound-care": draw_skin,
    "homeopathy": draw_generic_care,
    "senior": draw_family,
    "pregnancy": draw_pregnancy,
}

SPECIALTY_MAP: dict[str, str] = {
    "General Physician": "general-physician",
    "Cardiology": "cardiac",
    "Ophthalmology": "eye",
    "Dentistry": "dental",
    "General Surgery": "general-surgery",
    "Oncology": "oncology",
    "Pediatrics": "pediatrics",
    "Orthopedics": "orthopedics",
    "Gynecology": "womens-health",
    "Neurology": "brain",
    "Urology": "urology",
    "Dermatology": "skin",
    "ENT Care": "ent-care",
    "Psychiatry": "brain",
    "Diabetology": "diabetes",
    "Gastroenterology": "gastro",
    "Pulmonology": "pulmonology",
    "Nephrology": "urology",
}

SITUATION_DRAWERS: dict[str, Drawer] = {
    "Accident": draw_accident,
    "Fever": draw_fever,
    "Poisoning": draw_poisoning,
    "Chest Pain": draw_chest_pain,
    "Breathing": draw_breathing,
    "Stomach Ache": draw_stomach_pain,
    "Fracture": draw_fracture,
    "Migraine": draw_migraine,
    "Skin Burn": draw_burn,
    "Allergy": draw_allergy,
    "BP Crisis": draw_bp,
    "Animal Bite": draw_bite,
    "Pimple & Acne": draw_acne,
    "Hair Loss": draw_hair_loss,
    "Sexual Health": draw_sexual_health,
    "Period Pain": draw_period_pain,
    "Weight Care": draw_weight,
    "Stress & Anxiety": draw_stress,
    "Acidity & Gas": draw_acidity,
    "Toothache": lambda: existing_or(draw_generic_care, "dental"),
}

ALIASES: dict[str, str] = {
    "cardiology": "cardiac",
    "gynecology": "womens-health",
    "womensHealth": "womens-health",
    "womens-health": "womens-health",
    "pulmonology": "pulmonology",
    "urology": "urology",
    "nephrology": "urology",
    "gastro": "gastro",
    "eye": "eye",
    "dental": "dental",
    "cardiac": "cardiac",
    "mental": "brain",
    "brain": "brain",
    "weightLoss": "weight-loss",
    "weight-loss": "weight-loss",
    "homeCare": "home-care",
    "home-care": "home-care",
    "postSurgery": "post-surgery",
    "post-surgery": "post-surgery",
    "woundCare": "wound-care",
    "wound-care": "wound-care",
}


def slug(label: str) -> str:
    return (
        label.lower()
        .replace("&", "and")
        .replace("'", "")
        .replace("/", "-")
        .replace(" ", "-")
    )


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def source_image_for(asset: str) -> Image.Image:
    alias = ALIASES.get(asset, asset)
    existing = ROOT / f"{alias}.png"
    if existing.exists():
        return fit_existing(existing)
    drawer = CORE_DRAWERS.get(alias) or CORE_DRAWERS.get(asset) or draw_generic_care
    return drawer()


def create_contact_sheet(files: list[Path], out: Path) -> None:
    thumb = 144
    cols = 6
    rows = math.ceil(len(files) / cols)
    sheet = Image.new("RGB", (cols * thumb, rows * (thumb + 34)), (248, 251, 255))
    draw = ImageDraw.Draw(sheet)
    for index, file in enumerate(files):
        image = Image.open(file).convert("RGBA")
        tile = Image.new("RGBA", (thumb, thumb), (248, 251, 255, 255))
        image.thumbnail((thumb - 20, thumb - 20), Image.Resampling.LANCZOS)
        tile.alpha_composite(image, ((thumb - image.width) // 2, (thumb - image.height) // 2))
        x = (index % cols) * thumb
        y = (index // cols) * (thumb + 34)
        sheet.paste(tile.convert("RGB"), (x, y))
        label = file.stem[:20]
        draw.text((x + 8, y + thumb + 8), label, fill=(57, 69, 85))
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, optimize=True)


def main() -> None:
    args = parse_args()
    ROOT.mkdir(parents=True, exist_ok=True)
    SPECIALTIES.mkdir(parents=True, exist_ok=True)
    SITUATIONS.mkdir(parents=True, exist_ok=True)

    for name, drawer in CORE_DRAWERS.items():
        path = ROOT / f"{name}.png"
        if not path.exists():
            save_png(drawer(), path)

    manifest: dict[str, dict[str, str]] = {"specialties": {}, "situations": {}, "core": {}}

    if args.mode in {"all", "specialties"}:
        for label, asset in SPECIALTY_MAP.items():
            file = SPECIALTIES / f"{slug(label)}.png"
            save_png(source_image_for(asset), file)
            manifest["specialties"][label] = file.as_posix()

    if args.mode in {"all", "situations"}:
        for label, drawer in SITUATION_DRAWERS.items():
            file = SITUATIONS / f"{slug(label)}.png"
            save_png(drawer(), file)
            manifest["situations"][label] = file.as_posix()

    for file in sorted(ROOT.glob("*.png")):
        manifest["core"][file.stem] = file.as_posix()

    manifest_path = ROOT / "asset-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    all_files = []
    if args.mode in {"all", "specialties"}:
        all_files.extend(sorted(SPECIALTIES.glob("*.png")))
    if args.mode in {"all", "situations"}:
        all_files.extend(sorted(SITUATIONS.glob("*.png")))
    create_contact_sheet(all_files, ROOT / "preview-contact-sheet.png")

    print(f"Created {len(list(SPECIALTIES.glob('*.png')))} specialty assets")
    print(f"Created {len(list(SITUATIONS.glob('*.png')))} situation assets")
    print(f"Wrote {manifest_path}")


if __name__ == "__main__":
    main()
