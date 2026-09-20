import os
import random
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIRS = ["client/public", "backend/public"]
for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

WIDTH, HEIGHT = 1440, 420  # Sleeker, more compact height (3.43:1 aspect ratio)

def get_font(size, bold=False):
    font_names = [
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\calibrib.ttf" if bold else "C:\\Windows\\Fonts\\calibri.ttf"
    ]
    for f in font_names:
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except Exception:
                pass
    return ImageFont.load_default()

def fit_cover(img, target_w, target_h):
    aspect = img.width / img.height
    target_aspect = target_w / target_h
    if aspect > target_aspect:
        new_w = int(target_h * aspect)
        scaled = img.resize((new_w, target_h), Image.Resampling.LANCZOS)
        offset_x = (new_w - target_w) // 2
        return scaled.crop((offset_x, 0, offset_x + target_w, target_h))
    else:
        new_h = int(target_w / aspect)
        scaled = img.resize((target_w, new_h), Image.Resampling.LANCZOS)
        offset_y = (new_h - target_h) // 2
        return scaled.crop((0, offset_y, target_w, offset_y + target_h))

def create_claw_machine_banner():
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (255, 246, 248, 255))
    draw = ImageDraw.Draw(banner)
    
    left_w = int(WIDTH * 0.48)
    box_path = "backend/public/3d_boxes/claw_machine_rabbit_space_ai.jpg"
    if os.path.exists(box_path):
        b = Image.open(box_path).convert("RGBA")
        b_cover = fit_cover(b, left_w, HEIGHT)
        banner.paste(b_cover, (0, 0))
    
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    random.seed(77)
    for y in range(0, HEIGHT + 15, 12):
        dx = random.randint(-5, 7)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(255, 246, 248, 255))
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 220))

    # NO LOGO - User requested removing logo from promotion

    f_sub = get_font(17, bold=True)
    draw.text((int(WIDTH * 0.52), 65), "TIKTOK VIRAL ARCADE SPECIAL", font=f_sub, fill=(235, 77, 75, 255))
    
    f_title = get_font(44, bold=True)
    title1 = "Rabbit Space"
    draw.text((int(WIDTH * 0.52) + 2, 102), title1, font=f_title, fill=(255, 215, 225, 255))
    draw.text((int(WIDTH * 0.52), 100), title1, font=f_title, fill=(35, 40, 45, 255))
    
    title2 = "Arcade Claw Machine"
    draw.text((int(WIDTH * 0.52) + 2, 154), title2, font=f_title, fill=(255, 215, 225, 255))
    draw.text((int(WIDTH * 0.52), 152), title2, font=f_title, fill=(35, 40, 45, 255))

    f_desc = get_font(17, bold=False)
    draw.text((int(WIDTH * 0.52), 224), "Authentic motorized crane claw with 3 joystick controls & LED timer.", font=f_desc, fill=(100, 110, 120, 255))
    draw.text((int(WIDTH * 0.52), 254), "Includes surprise doll capsules. Direct Phnom Penh express delivery.", font=f_desc, fill=(100, 110, 120, 255))

    f_price = get_font(23, bold=True)
    draw.text((int(WIDTH * 0.52), 315), "Special Promotion: $25.00 / Unit • 102,500 KHR", font=f_price, fill=(235, 77, 75, 255))

    for d in OUTPUT_DIRS:
        out_path = os.path.join(d, "banner_classybling_clawmachine.png")
        banner.convert("RGB").save(out_path, quality=95)
    print("Created banner_classybling_clawmachine.png (compact, no logo)")

def create_babythree_banner():
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (248, 251, 255, 255))
    draw = ImageDraw.Draw(banner)
    
    left_w = int(WIDTH * 0.48)
    box_path = "backend/public/3d_boxes/baby_three_zodiac_studio_box_1787476804515.jpg"
    if os.path.exists(box_path):
        b = Image.open(box_path).convert("RGBA")
        b_cover = fit_cover(b, left_w, HEIGHT)
        banner.paste(b_cover, (0, 0))
    
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    random.seed(42)
    for y in range(0, HEIGHT + 15, 12):
        dx = random.randint(-5, 7)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(248, 251, 255, 255))
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 220))

    f_sub = get_font(17, bold=True)
    draw.text((int(WIDTH * 0.52), 65), "TIKTOK VIRAL UNBOXING", font=f_sub, fill=(225, 112, 85, 255))
    
    f_title = get_font(44, bold=True)
    title1 = "Baby Three Zodiac"
    draw.text((int(WIDTH * 0.52) + 2, 102), title1, font=f_title, fill=(200, 225, 245, 255))
    draw.text((int(WIDTH * 0.52), 100), title1, font=f_title, fill=(35, 40, 45, 255))
    
    title2 = "& Plush Series"
    draw.text((int(WIDTH * 0.52) + 2, 154), title2, font=f_title, fill=(200, 225, 245, 255))
    draw.text((int(WIDTH * 0.52), 152), title2, font=f_title, fill=(35, 40, 45, 255))

    f_desc = get_font(17, bold=False)
    draw.text((int(WIDTH * 0.52), 224), "Directly indexed from @classy.bling TikTok livestreams.", font=f_desc, fill=(100, 110, 120, 255))
    draw.text((int(WIDTH * 0.52), 254), "100% Genuine Certified Sealed Factory Blind Boxes.", font=f_desc, fill=(100, 110, 120, 255))

    f_price = get_font(23, bold=True)
    draw.text((int(WIDTH * 0.52), 315), "Featured Series: $12.50 / Pick", font=f_price, fill=(225, 112, 85, 255))

    for d in OUTPUT_DIRS:
        out_path = os.path.join(d, "banner_classybling_babythree.png")
        banner.convert("RGB").save(out_path, quality=95)
    print("Created banner_classybling_babythree.png (compact, no logo)")

def create_nommi_banner():
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (255, 248, 250, 255))
    draw = ImageDraw.Draw(banner)
    
    left_w = int(WIDTH * 0.48)
    box_path = "backend/public/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg"
    if os.path.exists(box_path):
        b = Image.open(box_path).convert("RGBA")
        b_cover = fit_cover(b, left_w, HEIGHT)
        banner.paste(b_cover, (0, 0))
    
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    random.seed(88)
    for y in range(0, HEIGHT + 15, 12):
        dx = random.randint(-5, 7)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(255, 248, 251, 255))
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 220))

    f_sub = get_font(17, bold=True)
    draw.text((int(WIDTH * 0.52), 65), "HIGH ENERGY PLUSH CHARMS", font=f_sub, fill=(232, 67, 147, 255))
    
    f_title = get_font(44, bold=True)
    title1 = "Nommi Pinky Energy"
    draw.text((int(WIDTH * 0.52) + 2, 102), title1, font=f_title, fill=(255, 215, 235, 255))
    draw.text((int(WIDTH * 0.52), 100), title1, font=f_title, fill=(35, 40, 45, 255))
    
    title2 = "& Disney Stitch"
    draw.text((int(WIDTH * 0.52) + 2, 154), title2, font=f_title, fill=(255, 215, 235, 255))
    draw.text((int(WIDTH * 0.52), 152), title2, font=f_title, fill=(35, 40, 45, 255))

    f_desc = get_font(17, bold=False)
    draw.text((int(WIDTH * 0.52), 224), "Ultra-soft plush bag pendants with rare secret chase editions.", font=f_desc, fill=(100, 110, 120, 255))
    draw.text((int(WIDTH * 0.52), 254), "1-Click direct orders on Telegram with live stream unboxing confirmation.", font=f_desc, fill=(100, 110, 120, 255))

    f_price = get_font(23, bold=True)
    draw.text((int(WIDTH * 0.52), 315), "Featured Series: $14.00 / Pick", font=f_price, fill=(232, 67, 147, 255))

    for d in OUTPUT_DIRS:
        out_path = os.path.join(d, "banner_classybling_nommi.png")
        banner.convert("RGB").save(out_path, quality=95)
    print("Created banner_classybling_nommi.png (compact, no logo)")

def create_space_molly_banner():
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (18, 16, 26, 255))
    draw = ImageDraw.Draw(banner)
    
    left_w = int(WIDTH * 0.48)
    box_path = "backend/public/3d_boxes/mega_space_molly_box_1787473086799.jpg"
    if os.path.exists(box_path):
        b = Image.open(box_path).convert("RGBA")
        b_cover = fit_cover(b, left_w, HEIGHT)
        banner.paste(b_cover, (0, 0))
    
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    random.seed(99)
    for y in range(0, HEIGHT + 15, 12):
        dx = random.randint(-5, 7)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(22, 20, 32, 255))
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 60))

    f_sub = get_font(17, bold=True)
    draw.text((int(WIDTH * 0.52), 65), "FLAGSHIP POP MART COLLECTION", font=f_sub, fill=(162, 155, 254, 255))
    
    f_title = get_font(44, bold=True)
    title1 = "MEGA SPACE MOLLY"
    draw.text((int(WIDTH * 0.52) + 2, 102), title1, font=f_title, fill=(100, 90, 160, 255))
    draw.text((int(WIDTH * 0.52), 100), title1, font=f_title, fill=(255, 255, 255, 255))
    
    title2 = "& SKULLPANDA"
    draw.text((int(WIDTH * 0.52) + 2, 154), title2, font=f_title, fill=(100, 90, 160, 255))
    draw.text((int(WIDTH * 0.52), 152), title2, font=f_title, fill=(255, 255, 255, 255))

    f_desc = get_font(17, bold=False)
    draw.text((int(WIDTH * 0.52), 224), "Limited edition metallic chrome helmets and premium action figures.", font=f_desc, fill=(180, 180, 195, 255))
    draw.text((int(WIDTH * 0.52), 254), "Available with instant local Phnom Penh grab dispatch.", font=f_desc, fill=(180, 180, 195, 255))

    f_price = get_font(23, bold=True)
    draw.text((int(WIDTH * 0.52), 315), "Featured Series: $18.00 / Pick", font=f_price, fill=(162, 155, 254, 255))

    for d in OUTPUT_DIRS:
        out_path = os.path.join(d, "banner_classybling_spacemolly.png")
        banner.convert("RGB").save(out_path, quality=95)
    print("Created banner_classybling_spacemolly.png (compact, no logo)")

if __name__ == "__main__":
    create_claw_machine_banner()
    create_babythree_banner()
    create_nommi_banner()
    create_space_molly_banner()
    print("All banners regenerated with compact height (420px) and no logo!")
