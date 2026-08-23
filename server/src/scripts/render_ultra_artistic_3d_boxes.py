import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

def render_ultra_artistic_3d_box(
    vid_id,
    front_pts_norm,
    side_bg_color=(254, 218, 55),          # Sunny yellow side panel
    side_pill_color=(235, 95, 155),        # Vibrant magenta pill
    side_pill_text_cn="毛绒系列",
    side_pill_text_en="PLUSH SERIES",
    top_color_start=(255, 170, 205),       # Pink candy top start
    top_color_end=(255, 205, 225),         # Pink candy top end
    side_badge_text="CLASSY BLING",
    char_crop_norm=None,
    bg_left_color=(195, 235, 252),
    bg_right_color=(255, 215, 235),
    bg_wall_top=(220, 240, 252)
):
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    if not os.path.exists(orig_path):
        return

    img_bgr = cv2.imread(orig_path)
    h, w = img_bgr.shape[:2]

    # --- 1. High-Res Front Artwork Extraction ---
    fw, fh = 480, 640
    src_pts = np.float32([[pt[0] * w, pt[1] * h] for pt in front_pts_norm])
    dst_pts = np.float32([[0, 0], [fw, 0], [fw, fh], [0, fh]])
    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    front_warped = cv2.warpPerspective(img_bgr, matrix, (fw, fh), flags=cv2.INTER_LANCZOS4)
    front_rgb = cv2.cvtColor(front_warped, cv2.COLOR_BGR2RGB)
    front_pil = Image.fromarray(front_rgb)
    front_pil = ImageEnhance.Color(front_pil).enhance(1.20)
    front_pil = ImageEnhance.Sharpness(front_pil).enhance(1.30)
    front_pil = ImageEnhance.Contrast(front_pil).enhance(1.06)

    # --- 2. Side Panel Artwork Design (180 x 640) ---
    sw, sh = 180, 640
    # Solid background with no transparency
    side_img = Image.new("RGB", (sw, sh), side_bg_color)
    sdraw = ImageDraw.Draw(side_img)

    # Soft directional shadow on side panel
    for x in range(sw):
        factor = 1.0 - 0.14 * (x / sw)
        r = int(side_bg_color[0] * factor)
        g = int(side_bg_color[1] * factor)
        b = int(side_bg_color[2] * factor)
        sdraw.line([(x, 0), (x, sh)], fill=(r, g, b))

    # Top Header Pill Badge
    sdraw.rounded_rectangle([(18, 25), (sw - 18, 78)], radius=12, fill=side_pill_color)
    sdraw.text((sw // 2, 42), side_pill_text_cn, fill=(255, 255, 255), anchor="mm")
    sdraw.text((sw // 2, 62), side_pill_text_en, fill=(255, 255, 255), anchor="mm")

    # Character Preview on Side Panel
    if char_crop_norm:
        cx1, cy1, cx2, cy2 = char_crop_norm
        cp_box = (int(cx1 * w), int(cy1 * h), int(cx2 * w), int(cy2 * h))
        char_raw = Image.fromarray(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)).crop(cp_box)
        char_thumb = char_raw.resize((125, 160), Image.Resampling.LANCZOS)
    else:
        char_thumb = front_pil.resize((125, 160), Image.Resampling.LANCZOS)

    t_mask = Image.new("L", (125, 160), 0)
    ImageDraw.Draw(t_mask).rounded_rectangle([(0, 0), (125, 160)], radius=16, fill=255)
    side_img.paste(char_thumb, (28, 100), t_mask)

    sdraw = ImageDraw.Draw(side_img)
    # Middle Pill Label
    sdraw.rounded_rectangle([(22, 285), (sw - 22, 325)], radius=10, fill=side_pill_color)
    sdraw.text((sw // 2, 305), side_badge_text, fill=(255, 255, 255), anchor="mm")

    # Decorative Specs Text Lines
    for idx, line_y in enumerate(range(355, 490, 16)):
        line_w = int(sw * 0.75 - (idx % 3) * 18)
        sdraw.line([(22, line_y), (22 + line_w, line_y)], fill=(120, 95, 30), width=3)

    # Bottom Authentic Barcode
    sdraw.rectangle([(22, 530), (sw - 22, 600)], fill=(255, 255, 255))
    for bx in range(32, sw - 32, 5):
        bw = 2 if bx % 3 == 0 else 3
        sdraw.line([(bx, 540), (bx, 590)], fill=(20, 20, 20), width=bw)

    # --- 3. Top Lid Artwork Design (480 x 140) ---
    tw, th = fw, 140
    top_img = Image.new("RGB", (tw, th))
    tdraw = ImageDraw.Draw(top_img)

    for y in range(th):
        ratio = y / th
        r = int(top_color_start[0] + (top_color_end[0] - top_color_start[0]) * ratio)
        g = int(top_color_start[1] + (top_color_end[1] - top_color_start[1]) * ratio)
        b = int(top_color_start[2] + (top_color_end[2] - top_color_start[2]) * ratio)
        tdraw.line([(0, y), (tw, y)], fill=(r, g, b))

    # Diagonal cheerful candy stripes
    for x in range(-50, tw + 100, 32):
        tdraw.polygon([(x, 0), (x + 16, 0), (x - 16, th), (x - 32, th)], fill=(255, 255, 255))

    # Soft top specular lighting
    top_overlay = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    todraw = ImageDraw.Draw(top_overlay)
    for y in range(th):
        alpha = int(70 * (1 - (y / th)))
        todraw.line([(0, y), (tw, y)], fill=(255, 255, 255, alpha))
    top_img = Image.alpha_composite(top_img.convert("RGBA"), top_overlay).convert("RGB")

    # --- 4. Studio Background Setup (900 x 900) ---
    canvas_w, canvas_h = 900, 900
    canvas = Image.new("RGBA", (canvas_w, canvas_h))
    cdraw = ImageDraw.Draw(canvas)

    for y in range(canvas_h):
        if y < 750:
            ratio = y / 750
            r = int(bg_wall_top[0] - 25 * (1 - ratio))
            g = int(bg_wall_top[1] - 20 * (1 - ratio))
            b = int(bg_wall_top[2] - 15 * (1 - ratio))
            cdraw.line([(0, y), (canvas_w, y)], fill=(r, g, b, 255))
        else:
            for x in range(canvas_w):
                fratio = x / canvas_w
                fr = int(bg_left_color[0] + (bg_right_color[0] - bg_left_color[0]) * fratio)
                fg = int(bg_left_color[1] + (bg_right_color[1] - bg_left_color[1]) * fratio)
                fb = int(bg_left_color[2] + (bg_right_color[2] - bg_left_color[2]) * fratio)
                canvas.putpixel((x, y), (fr, fg, fb, 255))

    # --- 5. 3D Coordinates (Parallelogram Extrusion) ---
    F_TL = (160, 180)
    F_TR = (560, 180)
    F_BR = (560, 770)
    F_BL = (160, 770)

    dx, dy = 160, -70
    S_TR = (F_TR[0] + dx, F_TR[1] + dy)   # (720, 110)
    S_BR = (F_BR[0] + dx, F_BR[1] + dy)   # (720, 700)
    T_TL = (F_TL[0] + dx, F_TL[1] + dy)   # (320, 110)
    T_TR = S_TR
    T_BR = F_TR
    T_BL = F_TL

    # --- 6. Multi-Layered Soft Studio Contact Shadow ---
    shadow_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    shdraw = ImageDraw.Draw(shadow_layer)

    shdraw.polygon([
        (F_BL[0] - 10, F_BL[1] + 2),
        (F_BR[0] + 5, F_BR[1] + 2),
        (S_BR[0] + 15, S_BR[1] + 5),
        (S_BR[0] + 35, S_BR[1] + 35),
        (F_BL[0] - 5, F_BL[1] + 35)
    ], fill=(0, 0, 0, 140))

    shdraw.polygon([
        (F_BL[0] - 25, F_BL[1] + 5),
        (F_BR[0] + 20, F_BR[1] + 10),
        (S_BR[0] + 60, S_BR[1] + 20),
        (S_BR[0] + 95, S_BR[1] + 75),
        (F_BL[0] - 10, F_BL[1] + 80)
    ], fill=(0, 0, 0, 80))

    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, shadow_layer)

    # --- 7. Warp Side Panel ---
    side_cv = cv2.cvtColor(np.array(side_img), cv2.COLOR_RGB2BGR)
    src_side = np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]])
    dst_side = np.float32([F_TR, S_TR, S_BR, F_BR])
    m_side = cv2.getPerspectiveTransform(src_side, dst_side)
    warped_side = cv2.warpPerspective(side_cv, m_side, (canvas_w, canvas_h), flags=cv2.INTER_LANCZOS4)
    mask_side = np.zeros((canvas_h, canvas_w), dtype=np.uint8)
    cv2.fillConvexPoly(mask_side, np.int32([F_TR, S_TR, S_BR, F_BR]), 255)
    warped_side_rgba = cv2.merge([warped_side, mask_side])
    side_composite = Image.fromarray(cv2.cvtColor(warped_side_rgba, cv2.COLOR_BGRA2RGBA))

    # --- 8. Warp Top Lid ---
    top_cv = cv2.cvtColor(np.array(top_img), cv2.COLOR_RGB2BGR)
    src_top = np.float32([[0, 0], [tw, 0], [tw, th], [0, th]])
    dst_top = np.float32([T_TL, T_TR, T_BR, T_BL])
    m_top = cv2.getPerspectiveTransform(src_top, dst_top)
    warped_top = cv2.warpPerspective(top_cv, m_top, (canvas_w, canvas_h), flags=cv2.INTER_LANCZOS4)
    mask_top = np.zeros((canvas_h, canvas_w), dtype=np.uint8)
    cv2.fillConvexPoly(mask_top, np.int32([T_TL, T_TR, T_BR, T_BL]), 255)
    warped_top_rgba = cv2.merge([warped_top, mask_top])
    top_composite = Image.fromarray(cv2.cvtColor(warped_top_rgba, cv2.COLOR_BGRA2RGBA))

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

    # --- 10. Composite 3D Box Layers ---
    canvas = Image.alpha_composite(canvas, side_composite)
    canvas = Image.alpha_composite(canvas, top_composite)
    canvas = Image.alpha_composite(canvas, front_composite)

    # --- 11. Crisp Paper Fold Edge Lines ---
    edge_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    edraw = ImageDraw.Draw(edge_layer)
    edraw.line([F_TL, F_TR], fill=(255, 255, 255, 220), width=2)
    edraw.line([F_TR, F_BR], fill=(255, 255, 255, 200), width=2)
    edraw.line([F_TR, S_TR], fill=(255, 255, 255, 180), width=2)
    edraw.line([T_TL, T_TR], fill=(255, 255, 255, 140), width=2)
    edraw.line([T_TL, F_TL], fill=(255, 255, 255, 140), width=2)
    edraw.line([F_BL, F_BR], fill=(0, 0, 0, 45), width=2)
    edraw.line([F_BR, S_BR], fill=(0, 0, 0, 65), width=2)
    canvas = Image.alpha_composite(canvas, edge_layer)

    canvas.convert("RGB").save(out_path, "WEBP", quality=96)
    print(f"🌟 Ultra Artistic 3D Box Created: {out_path}")

artistic_box_configs = {
    # 1. Kurumi Dreamland
    "7659642403011284244": {
        "pts": [(0.35, 0.47), (0.69, 0.47), (0.69, 0.81), (0.35, 0.81)],
        "side_bg": (254, 218, 55),
        "side_pill": (235, 95, 155),
        "cn_text": "毛绒系列",
        "en_text": "PLUSH SERIES",
        "top_start": (255, 170, 205),
        "top_end": (255, 210, 230),
        "badge_text": "梦幻星空",
        "char_crop": None,
        "bg_left": (195, 235, 252),
        "bg_right": (255, 215, 235),
        "bg_wall": (220, 240, 252)
    },
    # 2. Baby Three Ocean
    "7645571651836398869": {
        "pts": [(0.17, 0.50), (0.58, 0.38), (0.88, 0.65), (0.47, 0.84)],
        "side_bg": (254, 218, 55),
        "side_pill": (255, 105, 165),
        "cn_text": "海洋毛绒",
        "en_text": "OCEAN PLUSH",
        "top_start": (150, 225, 255),
        "top_end": (200, 240, 255),
        "badge_text": "娃三岁",
        "char_crop": None,
        "bg_left": (190, 235, 252),
        "bg_right": (255, 220, 235),
        "bg_wall": (215, 240, 250)
    },
    # 3. Baby Three Macaron
    "7639243053240192276": {
        "pts": [(0.24, 0.425), (0.75, 0.425), (0.75, 0.87), (0.24, 0.87)],
        "side_bg": (254, 218, 55),
        "side_pill": (240, 100, 150),
        "cn_text": "马卡龙系列",
        "en_text": "MACARON BUNNY",
        "top_start": (255, 175, 205),
        "top_end": (255, 215, 235),
        "badge_text": "小小兔",
        "char_crop": None,
        "bg_left": (195, 235, 250),
        "bg_right": (255, 220, 230),
        "bg_wall": (220, 242, 252)
    },
    # 4. Mega Space Molly emoji
    "7633292229603396884": {
        "pts": [(0.20, 0.47), (0.57, 0.39), (0.79, 0.70), (0.47, 0.82)],
        "side_bg": (254, 218, 55),
        "side_pill": (245, 90, 35),
        "cn_text": "MEGA 100%",
        "en_text": "SPACE MOLLY",
        "top_start": (255, 140, 75),
        "top_end": (255, 190, 130),
        "badge_text": "EMOJI 系列",
        "char_crop": None,
        "bg_left": (205, 238, 252),
        "bg_right": (255, 225, 210),
        "bg_wall": (225, 240, 250)
    },
    # 5. Baby Three Lily Rabbit Town Gen 3
    "7631985422482017556": {
        "pts": [(0.10, 0.33), (0.73, 0.21), (0.95, 0.76), (0.51, 0.90)],
        "side_bg": (254, 218, 55),
        "side_pill": (245, 105, 170),
        "cn_text": "莉莉兔小镇",
        "en_text": "LILY RABBIT TOWN",
        "top_start": (200, 180, 245),
        "top_end": (235, 215, 255),
        "badge_text": "三代系列",
        "char_crop": None,
        "bg_left": (195, 230, 252),
        "bg_right": (255, 220, 240),
        "bg_wall": (220, 238, 250)
    },
    # 6. KFC x DIMOO Limited
    "7625565020356709652": {
        "pts": [(0.23, 0.49), (0.42, 0.41), (0.72, 0.63), (0.50, 0.76)],
        "side_bg": (254, 218, 55),
        "side_pill": (220, 30, 45),
        "cn_text": "限定系列",
        "en_text": "PILOT COLONEL",
        "top_start": (245, 80, 90),
        "top_end": (255, 180, 190),
        "badge_text": "KFC x DIMOO",
        "char_crop": None,
        "bg_left": (205, 238, 250),
        "bg_right": (255, 225, 225),
        "bg_wall": (225, 242, 250)
    }
}

for vid_id, cfg in artistic_box_configs.items():
    render_ultra_artistic_3d_box(
        vid_id=vid_id,
        front_pts_norm=cfg["pts"],
        side_bg_color=cfg["side_bg"],
        side_pill_color=cfg["side_pill"],
        side_pill_text_cn=cfg["cn_text"],
        side_pill_text_en=cfg["en_text"],
        top_color_start=cfg["top_start"],
        top_color_end=cfg["top_end"],
        side_badge_text=cfg["badge_text"],
        char_crop_norm=cfg.get("char_crop"),
        bg_left_color=cfg["bg_left"],
        bg_right_color=cfg["bg_right"],
        bg_wall_top=cfg["bg_wall"]
    )

print("COMPLETED ALL ULTRA ARTISTIC 3D STUDIO BOXES!")
