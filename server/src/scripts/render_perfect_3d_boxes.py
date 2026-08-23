import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

def render_realistic_3d_box(
    vid_id,
    front_pts_norm,
    side_theme_color,
    side_accent_color,
    top_theme_color,
    series_title,
    series_sub,
    bg_left_color=(205, 235, 250),
    bg_right_color=(255, 225, 235),
    bg_wall_top=(230, 240, 250)
):
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    if not os.path.exists(orig_path):
        return

    img_bgr = cv2.imread(orig_path)
    h, w = img_bgr.shape[:2]

    # --- 1. High-Res Front Artwork Extraction ---
    fw, fh = 420, 600
    src_pts = np.float32([[pt[0] * w, pt[1] * h] for pt in front_pts_norm])
    dst_pts = np.float32([[0, 0], [fw, 0], [fw, fh], [0, fh]])
    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    front_warped = cv2.warpPerspective(img_bgr, matrix, (fw, fh), flags=cv2.INTER_LANCZOS4)
    front_rgb = cv2.cvtColor(front_warped, cv2.COLOR_BGR2RGB)
    front_pil = Image.fromarray(front_rgb)
    front_pil = ImageEnhance.Color(front_pil).enhance(1.15)
    front_pil = ImageEnhance.Sharpness(front_pil).enhance(1.25)

    # --- 2. Side Panel Artwork Design (130 x 600) ---
    sw, sh = 130, 600
    side_img = Image.new("RGBA", (sw, sh), side_theme_color + (255,))
    sdraw = ImageDraw.Draw(side_img)

    # Gradient lighting on side panel
    for x in range(sw):
        alpha = int(25 + 40 * (x / sw))
        sdraw.line([(x, 0), (x, sh)], fill=(0, 0, 0, alpha))

    # Top series pill badge
    sdraw.rounded_rectangle([(12, 25), (sw - 12, 68)], radius=10, fill=side_accent_color + (255,))
    sdraw.text((sw // 2, 38), series_title, fill=(255, 255, 255, 255), anchor="mm")
    sdraw.text((sw // 2, 54), series_sub, fill=(255, 255, 255, 230), anchor="mm")

    # Character preview thumbnail
    mini_front = front_pil.resize((95, 125), Image.Resampling.LANCZOS)
    m_mask = Image.new("L", (95, 125), 0)
    ImageDraw.Draw(m_mask).rounded_rectangle([(0, 0), (95, 125)], radius=10, fill=255)
    side_img.paste(mini_front, (18, 90), m_mask)

    # Middle badge
    sdraw.rounded_rectangle([(15, 250), (sw - 15, 285)], radius=8, fill=side_accent_color + (255,))
    sdraw.text((sw // 2, 267), "CLASSY BLING", fill=(255, 255, 255, 255), anchor="mm")

    # Fine specs lines
    for idx, line_y in enumerate(range(315, 440, 14)):
        line_w = int(sw * 0.75 - (idx % 3) * 15)
        sdraw.line([(15, line_y), (15 + line_w, line_y)], fill=(70, 70, 70, 130), width=3)

    # Barcode
    sdraw.rectangle([(15, 480), (sw - 15, 545)], fill=(255, 255, 255, 245))
    for bx in range(22, sw - 22, 4):
        bw = 2 if bx % 3 == 0 else 3
        sdraw.line([(bx, 490), (bx, 535)], fill=(20, 20, 20, 255), width=bw)

    # --- 3. Top Lid Artwork Design (420 x 130) ---
    tw, th = fw, 130
    top_img = Image.new("RGBA", (tw, th), top_theme_color + (255,))
    tdraw = ImageDraw.Draw(top_img)
    for x in range(-30, tw + 60, 25):
        tdraw.polygon([(x, 0), (x + 12, 0), (x - 12, th), (x - 24, th)], fill=(255, 255, 255, 45))
    # Soft light on top
    for y in range(th):
        alpha = int(45 * (1 - (y / th)))
        tdraw.line([(0, y), (tw, y)], fill=(255, 255, 255, alpha))

    # --- 4. Studio Background Setup (900 x 900) ---
    canvas_w, canvas_h = 900, 900
    canvas = Image.new("RGBA", (canvas_w, canvas_h))
    cdraw = ImageDraw.Draw(canvas)

    # Wall gradient
    for y in range(canvas_h):
        if y < 750:
            ratio = y / 750
            r = int(bg_wall_top[0] - 20 * (1 - ratio))
            g = int(bg_wall_top[1] - 15 * (1 - ratio))
            b = int(bg_wall_top[2] - 10 * (1 - ratio))
            cdraw.line([(0, y), (canvas_w, y)], fill=(r, g, b, 255))
        else:
            # Dual-tone floor
            for x in range(canvas_w):
                fratio = x / canvas_w
                fr = int(bg_left_color[0] + (bg_right_color[0] - bg_left_color[0]) * fratio)
                fg = int(bg_left_color[1] + (bg_right_color[1] - bg_left_color[1]) * fratio)
                fb = int(bg_left_color[2] + (bg_right_color[2] - bg_left_color[2]) * fratio)
                canvas.putpixel((x, y), (fr, fg, fb, 255))

    # --- 5. Clean Parallelogram 3D Box Coordinates ---
    F_TL = (180, 190)
    F_TR = (580, 190)
    F_BR = (580, 770)
    F_BL = (180, 770)

    # Parallel 3D Extrusion Vector = (+120, -60)
    dx, dy = 120, -60
    S_TR = (F_TR[0] + dx, F_TR[1] + dy)
    S_BR = (F_BR[0] + dx, F_BR[1] + dy)
    T_TL = (F_TL[0] + dx, F_TL[1] + dy)
    T_TR = S_TR
    T_BR = F_TR
    T_BL = F_TL

    # --- 6. Soft Realistic Ground Shadows ---
    shadow_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    shdraw = ImageDraw.Draw(shadow_layer)

    # Contact shadow
    shdraw.polygon([
        (F_BL[0] - 10, F_BL[1] + 2),
        (F_BR[0] + 5, F_BR[1] + 2),
        (S_BR[0] + 15, S_BR[1] + 5),
        (S_BR[0] + 35, S_BR[1] + 35),
        (F_BL[0] - 5, F_BL[1] + 35)
    ], fill=(0, 0, 0, 130))

    # Ambient drop shadow
    shdraw.polygon([
        (F_BL[0] - 25, F_BL[1] + 5),
        (F_BR[0] + 20, F_BR[1] + 10),
        (S_BR[0] + 50, S_BR[1] + 20),
        (S_BR[0] + 75, S_BR[1] + 65),
        (F_BL[0] - 10, F_BL[1] + 70)
    ], fill=(0, 0, 0, 75))

    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, shadow_layer)

    # --- 7. Warp Side Panel ---
    side_cv = cv2.cvtColor(np.array(side_img), cv2.COLOR_RGBA2BGRA)
    src_side = np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]])
    dst_side = np.float32([F_TR, S_TR, S_BR, F_BR])
    m_side = cv2.getPerspectiveTransform(src_side, dst_side)
    warped_side = cv2.warpPerspective(side_cv, m_side, (canvas_w, canvas_h), flags=cv2.INTER_LANCZOS4)
    side_pil = Image.fromarray(cv2.cvtColor(warped_side, cv2.COLOR_BGRA2RGBA))

    # --- 8. Warp Top Lid ---
    top_cv = cv2.cvtColor(np.array(top_img), cv2.COLOR_RGBA2BGRA)
    src_top = np.float32([[0, 0], [tw, 0], [tw, th], [0, th]])
    dst_top = np.float32([T_TL, T_TR, T_BR, T_BL])
    m_top = cv2.getPerspectiveTransform(src_top, dst_top)
    warped_top = cv2.warpPerspective(top_cv, m_top, (canvas_w, canvas_h), flags=cv2.INTER_LANCZOS4)
    top_pil = Image.fromarray(cv2.cvtColor(warped_top, cv2.COLOR_BGRA2RGBA))

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

    # --- 10. Composite All Layers ---
    canvas = Image.alpha_composite(canvas, side_pil)
    canvas = Image.alpha_composite(canvas, top_pil)
    canvas = Image.alpha_composite(canvas, front_composite)

    # --- 11. Crisp Paper Fold Edge Lines ---
    edge_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    edraw = ImageDraw.Draw(edge_layer)
    edraw.line([F_TL, F_TR], fill=(255, 255, 255, 200), width=2)
    edraw.line([F_TR, F_BR], fill=(255, 255, 255, 180), width=2)
    edraw.line([F_TR, S_TR], fill=(255, 255, 255, 160), width=2)
    edraw.line([T_TL, T_TR], fill=(255, 255, 255, 120), width=2)
    edraw.line([T_TL, F_TL], fill=(255, 255, 255, 120), width=2)
    edraw.line([F_BL, F_BR], fill=(0, 0, 0, 50), width=2)
    edraw.line([F_BR, S_BR], fill=(0, 0, 0, 70), width=2)
    canvas = Image.alpha_composite(canvas, edge_layer)

    canvas.convert("RGB").save(out_path, "WEBP", quality=96)
    print(f"✨ 3D Box Rendered: {out_path}")

products_to_render = {
    # Kurumi Dreamland
    "7659642403011284244": {
        "pts": [(0.35, 0.47), (0.69, 0.47), (0.69, 0.81), (0.35, 0.81)],
        "side_theme": (85, 65, 145),
        "side_accent": (245, 150, 200),
        "top_theme": (130, 100, 190),
        "title": "梦幻星空系列",
        "sub": "DREAMLAND SERIES",
        "bg_left": (210, 230, 255),
        "bg_right": (245, 215, 245),
        "bg_wall": (225, 235, 250)
    },
    # Baby Three Ocean
    "7645571651836398869": {
        "pts": [(0.17, 0.50), (0.58, 0.38), (0.88, 0.65), (0.47, 0.84)],
        "side_theme": (45, 160, 210),
        "side_accent": (255, 140, 175),
        "top_theme": (110, 205, 245),
        "title": "海洋毛绒系列",
        "sub": "OCEAN PLUSH SERIES",
        "bg_left": (195, 240, 255),
        "bg_right": (255, 220, 235),
        "bg_wall": (215, 242, 252)
    },
    # Baby Three Macaron
    "7639243053240192276": {
        "pts": [(0.26, 0.43), (0.75, 0.43), (0.75, 0.87), (0.26, 0.87)],
        "side_theme": (245, 210, 75),
        "side_accent": (245, 120, 150),
        "top_theme": (250, 230, 170),
        "title": "马卡龙小小兔",
        "sub": "MACARON BUNNY",
        "bg_left": (210, 240, 245),
        "bg_right": (255, 225, 230),
        "bg_wall": (235, 245, 248)
    },
    # Mega Space Molly emoji
    "7633292229603396884": {
        "pts": [(0.20, 0.47), (0.57, 0.39), (0.79, 0.70), (0.47, 0.82)],
        "side_theme": (235, 85, 25),
        "side_accent": (255, 225, 50),
        "top_theme": (245, 140, 70),
        "title": "MEGA 100% 系列",
        "sub": "SPACE MOLLY EMOJI",
        "bg_left": (220, 240, 250),
        "bg_right": (255, 225, 210),
        "bg_wall": (230, 240, 245)
    },
    # Baby Three Lily Rabbit Town Gen 3
    "7631985422482017556": {
        "pts": [(0.10, 0.33), (0.73, 0.21), (0.95, 0.76), (0.51, 0.90)],
        "side_theme": (80, 70, 175),
        "side_accent": (255, 160, 190),
        "top_theme": (140, 130, 220),
        "title": "莉莉兔小镇三代",
        "sub": "LILY RABBIT TOWN",
        "bg_left": (205, 230, 255),
        "bg_right": (255, 220, 245),
        "bg_wall": (220, 235, 250)
    },
    # KFC x DIMOO Limited
    "7625565020356709652": {
        "pts": [(0.23, 0.49), (0.42, 0.41), (0.72, 0.63), (0.50, 0.76)],
        "side_theme": (200, 25, 40),
        "side_accent": (255, 220, 70),
        "top_theme": (235, 70, 80),
        "title": "KFC 35周年限定",
        "sub": "PILOT COLONEL DIMOO",
        "bg_left": (220, 238, 248),
        "bg_right": (255, 225, 225),
        "bg_wall": (235, 242, 246)
    }
}

for vid_id, data in products_to_render.items():
    render_realistic_3d_box(
        vid_id=vid_id,
        front_pts_norm=data["pts"],
        side_theme_color=data["side_theme"],
        side_accent_color=data["side_accent"],
        top_theme_color=data["top_theme"],
        series_title=data["title"],
        series_sub=data["sub"],
        bg_left_color=data["bg_left"],
        bg_right_color=data["bg_right"],
        bg_wall_top=data["bg_wall"]
    )

print("ALL 3D REALISTIC BOXES RENDERED WITH EXACT PARALLEL GEOMETRY!")
