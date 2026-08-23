import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

def warp_box_front(vid_id, src_pts_norm, target_w=500, target_h=750, bg_start=(252, 250, 248), bg_end=(235, 230, 225)):
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    if not os.path.exists(orig_path):
        return

    img_bgr = cv2.imread(orig_path)
    h, w = img_bgr.shape[:2]

    # 4 points: TL, TR, BR, BL
    src_pts = np.float32([[pt[0] * w, pt[1] * h] for pt in src_pts_norm])
    dst_pts = np.float32([[0, 0], [target_w, 0], [target_w, target_h], [0, target_h]])

    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(img_bgr, matrix, (target_w, target_h), flags=cv2.INTER_LANCZOS4)

    warped_rgb = cv2.cvtColor(warped, cv2.COLOR_BGR2RGB)
    box_pil = Image.fromarray(warped_rgb)

    # Studio Presentation Canvas
    canvas_w, canvas_h = 800, 800
    canvas = Image.new("RGBA", (canvas_w, canvas_h))
    draw = ImageDraw.Draw(canvas)
    for y in range(canvas_h):
        r = int(bg_start[0] + (bg_end[0] - bg_start[0]) * (y / canvas_h))
        g = int(bg_start[1] + (bg_end[1] - bg_start[1]) * (y / canvas_h))
        b = int(bg_start[2] + (bg_end[2] - bg_start[2]) * (y / canvas_h))
        draw.line([(0, y), (canvas_w, y)], fill=(r, g, b, 255))

    # Scale box cleanly
    box_w_scaled = int(target_w * 0.78)
    box_h_scaled = int(target_h * 0.78)
    box_resized = box_pil.resize((box_w_scaled, box_h_scaled), Image.Resampling.LANCZOS)

    # Rounded corners on box
    mask = Image.new("L", (box_w_scaled, box_h_scaled), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([(0, 0), (box_w_scaled, box_h_scaled)], radius=12, fill=255)

    # Soft ambient drop shadow underneath
    shadow = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)

    bx = (canvas_w - box_w_scaled) // 2
    by = (canvas_h - box_h_scaled) // 2 - 10

    sdraw.ellipse([bx - 20, by + box_h_scaled - 15, bx + box_w_scaled + 20, by + box_h_scaled + 30], fill=(0, 0, 0, 75))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))

    canvas = Image.alpha_composite(canvas, shadow)
    canvas.paste(box_resized, (bx, by), mask)

    canvas.convert("RGB").save(out_path, "WEBP", quality=95)
    print(f"✨ Ultra Clean Box: {out_path}")

front_face_specs = {
    # 7660475956859129108 - Baby Three Zodiac (Rooster)
    "7660475956859129108": {
        "pts": [(0.32, 0.385), (0.80, 0.385), (0.80, 0.855), (0.32, 0.855)],
        "w": 500, "h": 760,
        "bg_start": (255, 248, 238), "bg_end": (245, 230, 215)
    },
    # 7659642403011284244 - Kurumi Dreamland (Pure Front Face)
    "7659642403011284244": {
        "pts": [(0.28, 0.47), (0.69, 0.44), (0.76, 0.81), (0.33, 0.84)],
        "w": 480, "h": 740,
        "bg_start": (248, 242, 255), "bg_end": (228, 218, 248)
    },
    # 7645571651836398869 - Baby Three Ocean (TL, TR, BR, BL)
    "7645571651836398869": {
        "pts": [(0.13, 0.50), (0.59, 0.36), (0.90, 0.65), (0.44, 0.86)],
        "w": 600, "h": 600,
        "bg_start": (235, 248, 255), "bg_end": (210, 235, 250)
    },
    # 7639243053240192276 - Baby Three Macaron
    "7639243053240192276": {
        "pts": [(0.21, 0.415), (0.76, 0.415), (0.76, 0.87), (0.21, 0.87)],
        "w": 500, "h": 750,
        "bg_start": (255, 250, 242), "bg_end": (245, 236, 220)
    },
    # 7633292229603396884 - Mega Space Molly emoji
    "7633292229603396884": {
        "pts": [(0.18, 0.47), (0.57, 0.39), (0.79, 0.70), (0.47, 0.82)],
        "w": 480, "h": 720,
        "bg_start": (255, 245, 236), "bg_end": (248, 225, 210)
    },
    # 7631985422482017556 - Baby Three Lily Rabbit Town Gen 3 (TL, TR, BR, BL)
    "7631985422482017556": {
        "pts": [(0.05, 0.32), (0.75, 0.19), (0.97, 0.77), (0.47, 0.92)],
        "w": 520, "h": 780,
        "bg_start": (242, 242, 255), "bg_end": (220, 220, 248)
    },
    # 7625565020356709652 - KFC x DIMOO
    "7625565020356709652": {
        "pts": [(0.19, 0.48), (0.42, 0.40), (0.74, 0.64), (0.48, 0.77)],
        "w": 480, "h": 680,
        "bg_start": (255, 242, 242), "bg_end": (245, 220, 220)
    }
}

for vid_id, data in front_face_specs.items():
    warp_box_front(
        vid_id=vid_id,
        src_pts_norm=data["pts"],
        target_w=data["w"],
        target_h=data["h"],
        bg_start=data["bg_start"],
        bg_end=data["bg_end"]
    )

print("Finished rendering all pristine front boxes!")
