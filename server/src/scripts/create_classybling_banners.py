import os
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "client/public"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 1024, 429

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

def paste_official_logo(banner, category_text, dark_mode=False):
    # Load official Classy Bling Logo
    logo_path = "client/public/logo.png"
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        logo = logo.resize((48, 48), Image.Resampling.LANCZOS)
        
        # Rounded mask for logo
        mask = Image.new("L", (48, 48), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, 48, 48], radius=12, fill=255)
        
        banner.paste(logo, (25, 20), mask)
        
        draw = ImageDraw.Draw(banner)
        f_brand = get_font(18, bold=True)
        brand_color = (255, 255, 255, 255) if dark_mode else (25, 25, 25, 255)
        draw.text((82, 22), "CLASSY BLING", font=f_brand, fill=brand_color)
        
        f_sub = get_font(13, bold=False)
        sub_color = (180, 180, 200, 255) if dark_mode else (120, 120, 130, 255)
        draw.text((82, 44), category_text, font=f_sub, fill=sub_color)

def create_baby_three_banner():
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (252, 248, 242, 255))
    draw = ImageDraw.Draw(banner)
    
    # Left background gradient (Soft sunlit cream)
    left_bg = Image.new("RGBA", (int(WIDTH * 0.48), HEIGHT), (255, 239, 228, 255))
    left_draw = ImageDraw.Draw(left_bg)
    for y in range(HEIGHT):
        alpha = int(255 * (1 - (y / HEIGHT) * 0.25))
        left_draw.line([(0, y), (int(WIDTH * 0.48), y)], fill=(255, 232 + int(y * 0.05), 218, alpha))
    banner.paste(left_bg, (0, 0))
    
    # Left side: Display Baby Three Zodiac box
    box1_path = "client/public/3d_boxes/baby_three_zodiac_studio_box_1787476804515.jpg"
    if os.path.exists(box1_path):
        b1 = Image.open(box1_path).convert("RGBA")
        b1_w, b1_h = int(HEIGHT * 0.88), int(HEIGHT * 0.88)
        b1_res = b1.resize((b1_w, b1_h), Image.Resampling.LANCZOS)
        
        # Soft floor shadow
        shadow = Image.new("RGBA", (b1_w + 30, b1_h + 30), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.ellipse([20, b1_h - 15, b1_w + 10, b1_h + 18], fill=(0, 0, 0, 75))
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        banner.paste(shadow, (40, int(HEIGHT * 0.06)), shadow)
        banner.paste(b1_res, (40, int(HEIGHT * 0.06)), b1_res)

    # Torn paper edge in middle
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    random.seed(42)
    for y in range(0, HEIGHT + 10, 12):
        dx = random.randint(-4, 6)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(238, 246, 252, 255))
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 200))

    # Paste Official Logo & Category
    paste_official_logo(banner, "Baby Three Official Drops", dark_mode=False)

    # Typography (Clean & Elegant, NO BUTTONS)
    f_sub = get_font(17, bold=True)
    draw.text((int(WIDTH * 0.52), 95), "TIKTOK VIRAL UNBOXING", font=f_sub, fill=(225, 112, 85, 255))
    
    f_title = get_font(42, bold=True)
    title1 = "Baby Three Zodiac"
    draw.text((int(WIDTH * 0.52) + 2, 132), title1, font=f_title, fill=(185, 210, 235, 255))
    draw.text((int(WIDTH * 0.52), 130), title1, font=f_title, fill=(45, 52, 54, 255))
    
    title2 = "& Plush Series"
    draw.text((int(WIDTH * 0.52) + 2, 184), title2, font=f_title, fill=(185, 210, 235, 255))
    draw.text((int(WIDTH * 0.52), 182), title2, font=f_title, fill=(45, 52, 54, 255))

    f_desc = get_font(16, bold=False)
    draw.text((int(WIDTH * 0.52), 260), "Directly indexed from @classy.bling TikTok livestreams.", font=f_desc, fill=(99, 110, 114, 255))
    draw.text((int(WIDTH * 0.52), 286), "100% Genuine Certified Sealed Factory Blind Boxes.", font=f_desc, fill=(99, 110, 114, 255))

    f_price = get_font(20, bold=True)
    draw.text((int(WIDTH * 0.52), 340), "Featured Series: $12.50 / Pick", font=f_price, fill=(225, 112, 85, 255))

    out_path = os.path.join(OUTPUT_DIR, "banner_classybling_babythree.png")
    banner.convert("RGB").save(out_path, quality=95)
    print(f"Created {out_path}")

def create_nommi_banner():
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (255, 245, 248, 255))
    draw = ImageDraw.Draw(banner)
    
    # Left background gradient (Soft pink)
    left_bg = Image.new("RGBA", (int(WIDTH * 0.48), HEIGHT), (255, 230, 240, 255))
    left_draw = ImageDraw.Draw(left_bg)
    for y in range(HEIGHT):
        left_draw.line([(0, y), (int(WIDTH * 0.48), y)], fill=(255, 220 + int(y * 0.06), 235, 255))
    banner.paste(left_bg, (0, 0))
    
    # Left box: Nommi Pinky Energy
    box_path = "client/public/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg"
    if os.path.exists(box_path):
        b = Image.open(box_path).convert("RGBA")
        b_w, b_h = int(HEIGHT * 0.88), int(HEIGHT * 0.88)
        b_res = b.resize((b_w, b_h), Image.Resampling.LANCZOS)
        
        shadow = Image.new("RGBA", (b_w + 30, b_h + 30), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.ellipse([20, b_h - 15, b_w + 10, b_h + 18], fill=(0, 0, 0, 75))
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        banner.paste(shadow, (40, int(HEIGHT * 0.06)), shadow)
        banner.paste(b_res, (40, int(HEIGHT * 0.06)), b_res)

    # Torn paper divider
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    random.seed(88)
    for y in range(0, HEIGHT + 10, 12):
        dx = random.randint(-4, 6)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(255, 248, 250, 255))
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 200))

    # Paste Official Logo & Category
    paste_official_logo(banner, "Nommi & Plush Dolls Drop", dark_mode=False)

    # Typography (Clean & Elegant, NO BUTTONS)
    f_sub = get_font(17, bold=True)
    draw.text((int(WIDTH * 0.52), 95), "HIGH ENERGY PLUSH CHARMS", font=f_sub, fill=(232, 67, 147, 255))
    
    f_title = get_font(42, bold=True)
    title1 = "Nommi Pinky Energy"
    draw.text((int(WIDTH * 0.52) + 2, 132), title1, font=f_title, fill=(255, 204, 229, 255))
    draw.text((int(WIDTH * 0.52), 130), title1, font=f_title, fill=(45, 52, 54, 255))
    
    title2 = "& Disney Stitch"
    draw.text((int(WIDTH * 0.52) + 2, 184), title2, font=f_title, fill=(255, 204, 229, 255))
    draw.text((int(WIDTH * 0.52), 182), title2, font=f_title, fill=(45, 52, 54, 255))

    f_desc = get_font(16, bold=False)
    draw.text((int(WIDTH * 0.52), 260), "Ultra-soft plush bag pendants with rare secret chase editions.", font=f_desc, fill=(99, 110, 114, 255))
    draw.text((int(WIDTH * 0.52), 286), "1-Click direct orders on Telegram with live confirmation.", font=f_desc, fill=(99, 110, 114, 255))

    f_price = get_font(20, bold=True)
    draw.text((int(WIDTH * 0.52), 340), "Featured Series: $14.00 / Pick", font=f_price, fill=(232, 67, 147, 255))

    out_path = os.path.join(OUTPUT_DIR, "banner_classybling_nommi.png")
    banner.convert("RGB").save(out_path, quality=95)
    print(f"Created {out_path}")

def create_space_molly_banner():
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (18, 16, 26, 255))
    draw = ImageDraw.Draw(banner)
    
    # Left background cosmic gradient
    left_bg = Image.new("RGBA", (int(WIDTH * 0.48), HEIGHT), (28, 24, 42, 255))
    left_draw = ImageDraw.Draw(left_bg)
    for y in range(HEIGHT):
        left_draw.line([(0, y), (int(WIDTH * 0.48), y)], fill=(35 + int(y*0.04), 28, 55 + int(y*0.06), 255))
    banner.paste(left_bg, (0, 0))
    
    # Space Molly Box
    molly_path = "client/public/3d_boxes/mega_space_molly_box_1787473086799.jpg"
    if os.path.exists(molly_path):
        m = Image.open(molly_path).convert("RGBA")
        m_w, m_h = int(HEIGHT * 0.88), int(HEIGHT * 0.88)
        m_res = m.resize((m_w, m_h), Image.Resampling.LANCZOS)
        
        shadow = Image.new("RGBA", (m_w + 30, m_h + 30), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.ellipse([20, m_h - 15, m_w + 10, m_h + 18], fill=(0, 0, 0, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))
        banner.paste(shadow, (40, int(HEIGHT * 0.06)), shadow)
        banner.paste(m_res, (40, int(HEIGHT * 0.06)), m_res)

    # Torn paper divider in middle
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    random.seed(99)
    for y in range(0, HEIGHT + 10, 12):
        dx = random.randint(-4, 6)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(26, 32, 44, 255))
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 120))

    # Paste Official Logo & Category
    paste_official_logo(banner, "Pop Mart Mega Series", dark_mode=True)

    # Typography (Clean & Elegant, NO BUTTONS)
    f_sub = get_font(17, bold=True)
    draw.text((int(WIDTH * 0.52), 95), "COLLECTOR EDITION ART TOYS", font=f_sub, fill=(253, 203, 110, 255))
    
    f_title = get_font(42, bold=True)
    title1 = "Mega Space Molly"
    draw.text((int(WIDTH * 0.52) + 2, 132), title1, font=f_title, fill=(15, 15, 20, 255))
    draw.text((int(WIDTH * 0.52), 130), title1, font=f_title, fill=(255, 255, 255, 255))
    
    title2 = "& Baking Time Series"
    draw.text((int(WIDTH * 0.52) + 2, 184), title2, font=f_title, fill=(15, 15, 20, 255))
    draw.text((int(WIDTH * 0.52), 182), title2, font=f_title, fill=(255, 255, 255, 255))

    f_desc = get_font(16, bold=False)
    draw.text((int(WIDTH * 0.52), 260), "Authentic Pop Mart designer figures and sealed blind boxes.", font=f_desc, fill=(160, 174, 192, 255))
    draw.text((int(WIDTH * 0.52), 286), "Guaranteed intact packaging with certified batch codes.", font=f_desc, fill=(160, 174, 192, 255))

    f_price = get_font(20, bold=True)
    draw.text((int(WIDTH * 0.52), 340), "Featured Series: $18.00 / Pick", font=f_price, fill=(253, 203, 110, 255))

    out_path = os.path.join(OUTPUT_DIR, "banner_classybling_spacemolly.png")
    banner.convert("RGB").save(out_path, quality=95)
    print(f"Created {out_path}")

create_baby_three_banner()
create_nommi_banner()
create_space_molly_banner()
