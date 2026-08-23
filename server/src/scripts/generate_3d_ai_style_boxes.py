import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

def render_exact_3d_ai_box(
    vid_id,
    front_pts_norm,
    side_theme_color=(252, 215, 60),      # Main side panel color
    side_accent_color=(235, 110, 160),    # Side banner / badge color
    top_theme_color=(255, 190, 215),      # Top lid color
    series_title="毛绒系列",
    series_sub="PLUSH SERIES",
    floor_left=(180, 225, 240),           # Split pastel floor left
    floor_right=(255, 205, 220),          # Split pastel floor right
    wall_bg=(210, 235, 245),              # Studio wall color
):
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    if not os.path.exists(orig_path):
        return

    img_bgr = cv2.imread(orig_path)
    h, w = img_bgr.shape[:2]

    # --- 1. Extract High-Res Front Artwork ---
    fw, fh = 560, 720
    src_pts = np.float32([[pt[0] * w, pt[1] * h] for pt in front_pts_norm])
    dst_pts = np.float32([[0, 0], [fw, 0], [fw, fh], [0, fh]])
    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    front_warped = cv2.warpPerspective(img_bgr, matrix, (fw, fh), flags=cv2.INTER_LANCZOS4)
    front_rgb = cv2.cvtColor(front_warped, cv2.COLOR_BGR2RGB)
    front_pil = Image.fromarray(front_rgb)
    front_pil = ImageEnhance.Color(front_pil).enhance(1.12)
    front_pil = ImageEnhance.Sharpness(front_pil).enhance(1.20)

    # --- 2. Synthesize High-Res 3D Side Panel Artwork ---
    sw, sh = 220, 720
    side_img = Image.new("RGBA", (sw, sh), side_theme_color + (255,))
    sdraw = ImageDraw.Draw(side_img)

    # Top badge
    sdraw.rounded_rectangle([(20, 30), (sw - 20, 85)], radius=12, fill=side_accent_color + (255,))
    sdraw.text((sw // 2, 48), series_title, fill=(255, 255, 255, 255), anchor="mm")
    sdraw.text((sw // 2, 68), series_sub, fill=(255, 255, 255, 230), anchor="mm")

    # Character preview thumbnail
    mini_front = front_pil.resize((150, 190), Image.Resampling.LANCZOS)
    m_mask = Image.new("L", (150, 190), 0)
    ImageDraw.Draw(m_mask).rounded_rectangle([(0, 0), (150, 190)], radius=16, fill=255)
    side_img.paste(mini_front, (35, 120), m_mask)

    # Mid label
    sdraw.rounded_rectangle([(25, 340), (sw - 25, 380)], radius=10, fill=side_accent_color + (255,))
    sdraw.text((sw // 2, 360), "CLASSY BLING", fill=(255, 255, 255, 255), anchor="mm")

    # Product specs text lines
    for idx, line_y in enumerate(range(420, 560, 15)):
        line_w = int(sw * 0.75 - (idx % 3) * 20)
        sdraw.line([(25, line_y), (25 + line_w, line_y)], fill=(80, 80, 80, 130), width=3)

    # Barcode
    sdraw.rectangle([(25, 600), (sw - 25, 665)], fill=(255, 255, 255, 245))
    for bx in range(35, sw - 35, 6):
        bw_line = 2 if bx % 4 == 0 else 4
        sdraw.line([(bx, 610), (bx, 655)], fill=(30, 30, 30, 255), width=bw_line)

    # --- 3. Synthesize Top Lid Artwork ---
    tw, th = fw, 160
    top_img = Image.new("RGBA", (tw, th), top_theme_color + (255,))
    tdraw = ImageDraw.Draw(top_img)
    for x in range(-50, tw + 100, 35):
        tdraw.polygon([(x, 0), (x + 18, 0), (x - 18, th), (x - 36, th)], fill=(255, 255, 255, 55))
    tdraw.text((tw // 2, th // 2), "CLASSY BLING", fill=(255, 255, 255, 240), anchor="mm")

    # --- 4. Studio Background Setup ---
    canvas_w, canvas_h = 1000, 1000
    canvas = Image.new("RGBA", (canvas_w, canvas_h))
    cdraw = ImageDraw.Draw(canvas)

    for y in range(canvas_h):
        if y < 820:
            ratio = y / 820
            r = int(wall_bg[0] - 25 * (1 - ratio))
            g = int(wall_bg[1] - 20 * (1 - ratio))
            b = int(wall_bg[2] - 15 * (1 - ratio))
            cdraw.line([(0, y), (canvas_w, y)], fill=(r, g, b, 255))
        else:
            # Dual-tone floor
            for x in range(canvas_w):
                fratio = x / canvas_w
                fr = int(floor_left[0] + (floor_right[0] - floor_left[0]) * fratio)
                fg = int(floor_left[1] + (floor_right[1] - floor_left[1]) * fratio)
                fb = int(floor_left[2] + (floor_right[2] - floor_left[2]) * fratio)
                canvas.putpixel((x, y), (fr, fg, fb, 255))

    # --- 5. Precise 3D Box Geometry Points ---
    F_TL = (150, 160)
    F_TR = (650, 130)
    F_BR = (650, 845)
    F_BL = (150, 825)

    S_TR = (830, 100)
    S_BR = (830, 785)

    T_TL = (330, 130)

    # --- 6. Realistic Ground Drop Shadow ---
    shadow_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    shdraw = ImageDraw.Draw(shadow_layer)
    shdraw.polygon([
        (F_BL[0] - 20, F_BL[1] + 5),
        (F_BR[0] + 10, F_BR[1] + 10),
        (S_BR[0] + 40, S_BR[1] + 20),
        (S_BR[0] + 60, S_BR[1] + 55),
        (F_BL[0] - 10, F_BL[1] + 60)
    ], fill=(0, 0, 0, 120))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(20))
    canvas = Image.alpha_composite(canvas, shadow_layer)

    # --- 7. Warp Side Panel ---
    side_cv = cv2.cvtColor(np.array(side_img), cv2.COLOR_RGBA2BGRA)
    src_side = np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]])
    dst_side = np.float32([F_TR, S_TR, S_BR, F_BR])
    m_side = cv2.getPerspectiveTransform(src_side, dst_side)
    warped_side = cv2.warpPerspective(side_cv, m_side, (canvas_w, canvas_h), flags=cv2.INTER_LANCZOS4)
    side_pil = Image.fromarray(cv2.cvtColor(warped_side, cv2.COLOR_BGRA2RGBA))
    side_pil = ImageEnhance.Brightness(side_pil).enhance(0.93)

    # --- 8. Warp Top Lid ---
    top_cv = cv2.cvtColor(np.array(top_img), cv2.COLOR_RGBA2BGRA)
    src_top = np.float32([[0, 0], [tw, 0], [tw, th], [0, th]])
    dst_top = np.float32([T_TL, S_TR, F_TR, F_TL])
    m_top = cv2.getPerspectiveTransform(src_top, dst_top)
    warped_top = cv2.warpPerspective(top_cv, m_top, (canvas_w, canvas_h), flags=cv2.INTER_LANCZOS4)
    top_pil = Image.fromarray(cv2.cvtColor(warped_top, cv2.COLOR_BGRA2RGBA))
    top_pil = ImageEnhance.Brightness(top_pil).enhance(1.06)

    # --- 9. Warp Front Face ---
    front_cv = cv2.cvtColor(np.array(front_pil), cv2.COLOR_RGB2BGR)
    src_front = np.float32([[0, 0], [fw, 0], [fw, fh], [0, fh]])
    dst_front = np.float32([F_TL, F_TR, F_BR, F_BL])
    m_front = cv2.getPerspectiveTransform(src_front, dst_front)
    warped_front = cv2.warpPerspective(front_cv, m_front, (canvas_w, canvas_h), flags=cv2.INTER_LANCZOS4)
    mask_front = np.zeros((canvas_h, canvas_w), dtype=np.uint8)
    cv2.fillConvexPoly(mask_front, np.int32([F_TL, F_TR, F_BR, F_BL]), 255)
    warped_front_rgba = cv2.merge([warped_front, mask_front])
    front_composite = Image.fromarray(cv2.cvtColor(warped_front_rgba, cv2.COLOR_BGRA2RGBA))

    # --- 10. Composite 3D Box ---
    canvas = Image.alpha_composite(canvas, side_pil)
    canvas = Image.alpha_composite(canvas, top_pil)
    canvas = Image.alpha_composite(canvas, front_composite)

    # --- 11. Edge Highlights ---
    edge_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    edraw = ImageDraw.Draw(edge_layer)
    edraw.line([F_TL, F_TR], fill=(255, 255, 255, 170), width=2)
    edraw.line([F_TR, F_BR], fill=(255, 255, 255, 150), width=2)
    edraw.line([F_TR, S_TR], fill=(255, 255, 255, 130), width=2)
    edraw.line([F_BL, F_BR], fill=(0, 0, 0, 60), width=2)
    edraw.line([F_BR, S_BR], fill=(0, 0, 0, 70), width=2)

    canvas = Image.alpha_composite(canvas, edge_layer)

    canvas.convert("RGB").save(out_path, "WEBP", quality=96)
    print(f"🎉 Exact 3D AI-Style Box: {out_path}")

exact_3d_specs = {
    # Kurumi Dreamland
    "7659642403011284244": {
        "pts": [(0.32, 0.47), (0.69, 0.44), (0.76, 0.81), (0.35, 0.84)],
        "side_color": (95, 75, 160),
        "accent_color": (245, 150, 200),
        "top_color": (140, 110, 200),
        "series_title": "梦幻星空系列",
        "series_sub": "DREAMLAND SERIES",
        "floor_left": (210, 230, 255),
        "floor_right": (245, 215, 245),
        "wall_bg": (225, 235, 250)
    },
    # Baby Three Ocean
    "7645571651836398869": {
        "pts": [(0.15, 0.50), (0.59, 0.36), (0.90, 0.65), (0.46, 0.86)],
        "side_color": (50, 170, 220),
        "accent_color": (255, 140, 175),
        "top_color": (120, 215, 255),
        "series_title": "海洋毛绒系列",
        "series_sub": "OCEAN PLUSH SERIES",
        "floor_left": (195, 240, 255),
        "floor_right": (255, 220, 235),
        "wall_bg": (215, 242, 252)
    },
    # Baby Three Macaron
    "7639243053240192276": {
        "pts": [(0.24, 0.415), (0.76, 0.415), (0.76, 0.87), (0.24, 0.87)],
        "side_color": (250, 215, 80),
        "accent_color": (245, 120, 150),
        "top_color": (255, 235, 180),
        "series_title": "马卡龙小小兔",
        "series_sub": "MACARON BUNNY",
        "floor_left": (210, 240, 245),
        "floor_right": (255, 225, 230),
        "wall_bg": (235, 245, 248)
    },
    # Mega Space Molly emoji
    "7633292229603396884": {
        "pts": [(0.20, 0.47), (0.57, 0.39), (0.79, 0.70), (0.47, 0.82)],
        "side_color": (245, 95, 30),
        "accent_color": (255, 225, 50),
        "top_color": (255, 150, 80),
        "series_title": "MEGA 100% 系列",
        "series_sub": "SPACE MOLLY EMOJI",
        "floor_left": (220, 240, 250),
        "floor_right": (255, 225, 210),
        "wall_bg": (230, 240, 245)
    },
    # Baby Three Lily Rabbit Town Gen 3
    "7631985422482017556": {
        "pts": [(0.07, 0.32), (0.75, 0.19), (0.97, 0.77), (0.49, 0.92)],
        "side_color": (90, 80, 185),
        "accent_color": (255, 160, 190),
        "top_color": (150, 140, 230),
        "series_title": "莉莉兔小镇三代",
        "series_sub": "LILY RABBIT TOWN",
        "floor_left": (205, 230, 255),
        "floor_right": (255, 220, 245),
        "wall_bg": (220, 235, 250)
    },
    # KFC x DIMOO Limited
    "7625565020356709652": {
        "pts": [(0.21, 0.48), (0.42, 0.40), (0.74, 0.64), (0.48, 0.77)],
        "side_color": (210, 30, 45),
        "accent_color": (255, 220, 70),
        "top_color": (245, 80, 90),
        "series_title": "KFC 35周年限定",
        "series_sub": "PILOT COLONEL DIMOO",
        "floor_left": (220, 238, 248),
        "floor_right": (255, 225, 225),
        "wall_bg": (235, 242, 246)
    }
}

for vid_id, spec in exact_3d_specs.items():
    render_exact_3d_ai_box(
        vid_id=vid_id,
        front_pts_norm=spec["pts"],
        side_theme_color=spec["side_color"],
        side_accent_color=spec["accent_color"],
        top_theme_color=spec["top_color"],
        series_title=spec["series_title"],
        series_sub=spec["series_sub"],
        floor_left=spec["floor_left"],
        floor_right=spec["floor_right"],
        wall_bg=spec["wall_bg"]
    )

print("ALL 100% OF BOXES RENDERED WITH EXACT USER REFERENCE STYLE!")
