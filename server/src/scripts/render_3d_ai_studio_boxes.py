import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import os
import sys
import math

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

def render_photorealistic_studio_3d_box(
    vid_id,
    front_pts_norm,
    side_color=(230, 225, 220),
    top_color=(245, 240, 235),
    bg_theme="soft_studio",
    target_box_w=460,
    target_box_h=660,
    depth_w=35,
    depth_h=20
):
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    if not os.path.exists(orig_path):
        return

    img_bgr = cv2.imread(orig_path)
    h, w = img_bgr.shape[:2]

    # 1. Perspective warp front face
    src_pts = np.float32([[pt[0] * w, pt[1] * h] for pt in front_pts_norm])
    dst_pts = np.float32([[0, 0], [target_box_w, 0], [target_box_w, target_box_h], [0, target_box_h]])

    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(img_bgr, matrix, (target_box_w, target_box_h), flags=cv2.INTER_LANCZOS4)

    warped_rgb = cv2.cvtColor(warped, cv2.COLOR_BGR2RGB)
    front_pil = Image.fromarray(warped_rgb)
    front_pil = ImageEnhance.Color(front_pil).enhance(1.08)
    front_pil = ImageEnhance.Sharpness(front_pil).enhance(1.15)

    # 2. Studio Shelf Back-Wall & Ambient Lighting (1024x1024)
    canvas_size = 1024
    canvas = Image.new("RGBA", (canvas_size, canvas_size))
    draw = ImageDraw.Draw(canvas)

    bg_centers = {
        "soft_studio": ((250, 248, 246), (232, 228, 224)),
        "warm": ((255, 249, 242), (238, 226, 215)),
        "cool": ((244, 250, 254), (220, 230, 240)),
        "lavender": ((250, 245, 255), (228, 220, 242))
    }
    top_c, bot_c = bg_centers.get(bg_theme, bg_centers["soft_studio"])

    # Draw Back-wall Ambient Gradient
    shelf_horizon_y = 780
    for y in range(shelf_horizon_y):
        ratio = y / shelf_horizon_y
        r = int(top_c[0] + (bot_c[0] - top_c[0]) * ratio)
        g = int(top_c[1] + (bot_c[1] - top_c[1]) * ratio)
        b = int(top_c[2] + (bot_c[2] - top_c[2]) * ratio)
        draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))

    # Soft Back-Wall Spot Glow
    spot_glow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    sgdraw = ImageDraw.Draw(spot_glow)
    sgdraw.ellipse([canvas_size // 2 - 320, shelf_horizon_y - 560,
                    canvas_size // 2 + 320, shelf_horizon_y + 80],
                   fill=(255, 255, 255, 60))
    spot_glow = spot_glow.filter(ImageFilter.GaussianBlur(50))
    canvas = Image.alpha_composite(canvas, spot_glow)

    # 3. Boutique White Shelf Plank Floor (y = 780 to 920)
    shelf_surface = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    ssdraw = ImageDraw.Draw(shelf_surface)
    
    # Top shelf flat surface
    for y in range(shelf_horizon_y, 900):
        ratio = (y - shelf_horizon_y) / 120.0
        r = int(255 - 12 * ratio)
        g = int(255 - 12 * ratio)
        b = int(255 - 10 * ratio)
        ssdraw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))

    # Shelf Horizon line highlight
    ssdraw.line([(0, shelf_horizon_y), (canvas_size, shelf_horizon_y)], fill=(255, 255, 255, 240), width=2)

    # Shelf Front Bevel Lip (y = 900 to 930)
    for y in range(900, 930):
        ratio = (y - 900) / 30.0
        shade = int(230 - 25 * ratio)
        ssdraw.line([(0, y), (canvas_size, y)], fill=(shade, shade, shade + 2, 255))

    # Shelf Front Top Highlight Edge
    ssdraw.line([(0, 900), (canvas_size, 900)], fill=(255, 255, 255, 220), width=1)

    # Under-shelf shadow area (y = 930 to 1024)
    for y in range(930, canvas_size):
        ratio = (y - 930) / 94.0
        shade = int(200 + 30 * ratio)
        ssdraw.line([(0, y), (canvas_size, y)], fill=(shade, shade, shade, 255))

    canvas = Image.alpha_composite(canvas, shelf_surface)

    # 4. Box Position & Shelf Contact Shadow
    box_base_x = (canvas_size - (target_box_w + depth_w)) // 2
    box_base_y = shelf_horizon_y

    # Contact shadow on shelf surface
    box_shadow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    bsdraw = ImageDraw.Draw(box_shadow)
    bsdraw.ellipse([box_base_x - 20, box_base_y - 12,
                    box_base_x + target_box_w + depth_w + 20, box_base_y + 30],
                   fill=(0, 0, 0, 110))
    box_shadow = box_shadow.filter(ImageFilter.GaussianBlur(14))
    canvas = Image.alpha_composite(canvas, box_shadow)

    # 5. 3D Box Geometry Points
    p1 = (box_base_x, box_base_y - target_box_h)
    p2 = (box_base_x + target_box_w, box_base_y - target_box_h)
    p3 = (box_base_x + target_box_w, box_base_y)
    p4 = (box_base_x, box_base_y)

    p5 = (box_base_x + target_box_w + depth_w, box_base_y - target_box_h - depth_h)
    p6 = (box_base_x + target_box_w + depth_w, box_base_y - depth_h)
    p7 = (box_base_x + depth_w, box_base_y - target_box_h - depth_h)

    # Draw Right Side Panel
    side_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(side_layer)
    sdraw.polygon([p2, p5, p6, p3], fill=side_color + (255,))
    for i in range(depth_w):
        t = i / depth_w
        sx = int(p2[0] + (p5[0] - p2[0]) * t)
        sy1 = int(p2[1] + (p5[1] - p2[1]) * t)
        sy2 = int(p3[1] + (p6[1] - p3[1]) * t)
        alpha = int(20 + 40 * t)
        sdraw.line([(sx, sy1), (sx, sy2)], fill=(0, 0, 0, alpha))

    # Draw Top Panel
    top_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(top_layer)
    tdraw.polygon([p1, p7, p5, p2], fill=top_color + (255,))
    for i in range(depth_w):
        t = i / depth_w
        tx1 = int(p1[0] + (p7[0] - p1[0]) * t)
        ty1 = int(p1[1] + (p7[1] - p1[1]) * t)
        tx2 = int(p2[0] + (p5[0] - p2[0]) * t)
        ty2 = int(p2[1] + (p5[1] - p2[1]) * t)
        alpha = int(45 * (1 - t))
        tdraw.line([(tx1, ty1), (tx2, ty2)], fill=(255, 255, 255, alpha))

    canvas = Image.alpha_composite(canvas, side_layer)
    canvas = Image.alpha_composite(canvas, top_layer)

    # 6. Paste Front Face with Bevel
    mask = Image.new("L", (target_box_w, target_box_h), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rounded_rectangle([(0, 0), (target_box_w, target_box_h)], radius=8, fill=255)

    sheen = Image.new("RGBA", (target_box_w, target_box_h), (0, 0, 0, 0))
    shdraw = ImageDraw.Draw(sheen)
    for x in range(target_box_w):
        t = x / target_box_w
        alpha = int(20 * (1 - t))
        shdraw.line([(x, 0), (x, target_box_h)], fill=(255, 255, 255, alpha))

    front_composite = Image.alpha_composite(front_pil.convert("RGBA"), sheen)
    canvas.paste(front_composite, (p1[0], p1[1]), mask)

    # 7. Subtle Bevel Highlight Edge lines
    edge_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    edraw = ImageDraw.Draw(edge_layer)
    edraw.line([p1, p2], fill=(255, 255, 255, 140), width=2)
    edraw.line([p2, p3], fill=(255, 255, 255, 100), width=2)
    edraw.line([p2, p5], fill=(255, 255, 255, 160), width=2)
    edraw.line([p5, p6], fill=(0, 0, 0, 50), width=1)
    edraw.line([p3, p6], fill=(0, 0, 0, 50), width=1)

    canvas = Image.alpha_composite(canvas, edge_layer)

    # Save as WebP
    canvas.convert("RGB").save(out_path, "WEBP", quality=96)
    print(f"💎 Refined 3D Studio AI Box: {out_path}")

studio_box_data = {
    # Kurumi Dreamland
    "7659642403011284244": {
        "pts": [(0.28, 0.47), (0.69, 0.44), (0.76, 0.81), (0.33, 0.84)],
        "side": (75, 45, 115), "top": (105, 75, 145), "bg": "lavender"
    },
    # Baby Three Ocean
    "7645571651836398869": {
        "pts": [(0.13, 0.50), (0.59, 0.36), (0.90, 0.65), (0.44, 0.86)],
        "side": (45, 155, 205), "top": (95, 195, 235), "bg": "cool"
    },
    # Baby Three Macaron
    "7639243053240192276": {
        "pts": [(0.21, 0.415), (0.76, 0.415), (0.76, 0.87), (0.21, 0.87)],
        "side": (235, 215, 185), "top": (250, 240, 215), "bg": "warm"
    },
    # Mega Space Molly emoji
    "7633292229603396884": {
        "pts": [(0.18, 0.47), (0.57, 0.39), (0.79, 0.70), (0.47, 0.82)],
        "side": (220, 75, 30), "top": (245, 115, 65), "bg": "warm"
    },
    # Baby Three Lily Rabbit Town
    "7631985422482017556": {
        "pts": [(0.05, 0.32), (0.75, 0.19), (0.97, 0.77), (0.47, 0.92)],
        "side": (65, 55, 145), "top": (95, 85, 185), "bg": "lavender"
    },
    # KFC x DIMOO
    "7625565020356709652": {
        "pts": [(0.19, 0.48), (0.42, 0.40), (0.74, 0.64), (0.48, 0.77)],
        "side": (185, 25, 35), "top": (225, 55, 65), "bg": "warm"
    }
}

for vid_id, data in studio_box_data.items():
    render_photorealistic_studio_3d_box(
        vid_id=vid_id,
        front_pts_norm=data["pts"],
        side_color=data["side"],
        top_color=data["top"],
        bg_theme=data["bg"]
    )

print("ALL PRODUCTS RENDERED WITH PERFECTION!")
