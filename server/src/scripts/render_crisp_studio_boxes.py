import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

# 1. Lolita's Dream (Studio AI generated)
lolita_src = r"C:\Users\MSI\.gemini\antigravity-ide\brain\6408723b-173c-4551-a228-4f6f73c8f5e1\baby_three_lolita_dream_box_1787473539024.jpg"
if os.path.exists(lolita_src):
    Image.open(lolita_src).save(os.path.join(cropped_dir, "7660001603688221973_cropped.webp"), "WEBP", quality=95)
    print("✅ 7660001603688221973 (Lolita's Dream) -> Perfect Studio Box")

# Clean high-precision front-face crops without hand/background
box_configs = {
    # 7660475956859129108 - Baby Three Chinese Zodiac
    "7660475956859129108": {
        "rect": (0.28, 0.385, 0.81, 0.86),
        "aspect": (520, 800),
        "bg_start": (255, 246, 235), "bg_end": (245, 228, 210)
    },
    # 7659642403011284244 - Kurumi Dreamland
    "7659642403011284244": {
        "rect": (0.33, 0.445, 0.77, 0.84),
        "aspect": (500, 780),
        "bg_start": (246, 240, 255), "bg_end": (225, 215, 248)
    },
    # 7645571651836398869 - Baby Three Ocean
    "7645571651836398869": {
        "rect": (0.16, 0.38, 0.86, 0.83),
        "aspect": (600, 680),
        "bg_start": (232, 248, 255), "bg_end": (205, 235, 250)
    },
    # 7639243053240192276 - Baby Three Macaron
    "7639243053240192276": {
        "rect": (0.18, 0.415, 0.77, 0.88),
        "aspect": (520, 780),
        "bg_start": (255, 250, 240), "bg_end": (245, 235, 215)
    },
    # 7633292229603396884 - Mega Space Molly emoji
    "7633292229603396884": {
        "rect": (0.24, 0.405, 0.78, 0.81),
        "aspect": (520, 750),
        "bg_start": (255, 244, 235), "bg_end": (248, 222, 205)
    },
    # 7631985422482017556 - Baby Three Lily Rabbit Town Gen 3
    "7631985422482017556": {
        "rect": (0.14, 0.22, 0.90, 0.88),
        "aspect": (540, 800),
        "bg_start": (240, 240, 255), "bg_end": (218, 218, 248)
    },
    # 7625565020356709652 - KFC x DIMOO
    "7625565020356709652": {
        "rect": (0.23, 0.42, 0.73, 0.76),
        "aspect": (520, 680),
        "bg_start": (255, 242, 242), "bg_end": (245, 218, 218)
    }
}

for vid_id, cfg in box_configs.items():
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    if not os.path.exists(orig_path):
        continue

    img = Image.open(orig_path).convert("RGBA")
    w, h = img.size

    x1, y1, x2, y2 = cfg["rect"]
    crop_box = (int(x1 * w), int(y1 * h), int(x2 * w), int(y2 * h))
    cropped = img.crop(crop_box)

    tw, th = cfg["aspect"]
    cropped = cropped.resize((tw, th), Image.Resampling.LANCZOS)

    # Rounded box corners
    mask = Image.new("L", (tw, th), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([(0, 0), (tw, th)], radius=14, fill=255)

    # Studio canvas
    canvas_w, canvas_h = 800, 800
    canvas = Image.new("RGBA", (canvas_w, canvas_h))
    draw_canvas = ImageDraw.Draw(canvas)
    bg_start = cfg["bg_start"]
    bg_end = cfg["bg_end"]
    for y in range(canvas_h):
        r = int(bg_start[0] + (bg_end[0] - bg_start[0]) * (y / canvas_h))
        g = int(bg_start[1] + (bg_end[1] - bg_start[1]) * (y / canvas_h))
        b = int(bg_start[2] + (bg_end[2] - bg_start[2]) * (y / canvas_h))
        draw_canvas.line([(0, y), (canvas_w, y)], fill=(r, g, b, 255))

    # Soft ambient pedestal shadow
    shadow_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)

    bx = (canvas_w - tw) // 2
    by = (canvas_h - th) // 2 - 10

    # Draw shadow
    sdraw.ellipse([bx - 15, by + th - 20, bx + tw + 15, by + th + 35], fill=(0, 0, 0, 85))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))

    canvas = Image.alpha_composite(canvas, shadow_layer)
    canvas.paste(cropped, (bx, by), mask)

    canvas.convert("RGB").save(out_path, "WEBP", quality=95)
    print(f"✅ Generated crisp studio box: {out_path}")

print("All boxes rendered in high resolution studio quality!")
