import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "client/public"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 1024, 429

def get_font(size, bold=False):
    font_names = [
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\calibrib.ttf" if bold else "C:\\Windows\\Fonts\\calibri.ttf"
    ]
    for f in font_names:
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_baby_three_banner():
    # Base canvas
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (247, 243, 237, 255)) # soft warm cream
    draw = ImageDraw.Draw(banner)
    
    # Left side: Soft scenic gradient
    left_bg = Image.new("RGBA", (int(WIDTH * 0.48), HEIGHT), (255, 238, 222, 255))
    left_draw = ImageDraw.Draw(left_bg)
    
    # Add warm radial or subtle gradient
    for y in range(HEIGHT):
        alpha = int(255 * (1 - y / HEIGHT * 0.3))
        left_draw.line([(0, y), (int(WIDTH * 0.48), y)], fill=(255, 230 + int(y * 0.05), 215, alpha))
        
    banner.paste(left_bg, (0, 0))
    
    # Paste 3D Zodiac Box on the left side
    zodiac_path = "server/uploads/cropped/crop_baby_three_zodiac_studio_box_1787476804515.jpg"
    if os.path.exists(zodiac_path):
        z_img = Image.open(zodiac_path).convert("RGBA")
        # Resize to fit nicely
        z_w = int(HEIGHT * 0.88)
        z_h = int(HEIGHT * 0.88)
        z_resized = z_img.resize((z_w, z_h), Image.Resampling.LANCZOS)
        
        # Soft shadow
        shadow = Image.new("RGBA", (z_w + 30, z_h + 30), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.ellipse([20, z_h - 15, z_w + 10, z_h + 20], fill=(0, 0, 0, 80))
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        banner.paste(shadow, (40, int(HEIGHT * 0.06)), shadow)
        
        banner.paste(z_resized, (50, int(HEIGHT * 0.06)), z_resized)
    
    # Torn paper divider line / edge in the middle
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    import random
    random.seed(42)
    for y in range(0, HEIGHT + 10, 12):
        dx = random.randint(-4, 6)
        torn_poly.append((divider_x + dx, y))
    
    # Fill right side
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(233, 242, 250, 255))
    
    # Draw torn edge shadow
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 200))

    # Badges on top left
    # POP MART / CLASSY BLING Red Badge
    draw.rounded_rectangle([25, 20, 115, 52], radius=4, fill=(235, 25, 45, 255))
    f_badge = get_font(18, bold=True)
    draw.text((32, 26), "CLASSY", font=f_badge, fill=(255, 255, 255, 255))
    
    f_badge_sub = get_font(16, bold=False)
    draw.text((125, 27), "Baby Three Official", font=f_badge_sub, fill=(50, 50, 50, 220))

    # Right side typography: "Baby Three Plush & Zodiac Series"
    f_title_small = get_font(20, bold=True)
    draw.text((int(WIDTH * 0.52), 90), "BABY THREE COLLECTIBLE", font=f_title_small, fill=(225, 112, 85, 255))
    
    f_title_main = get_font(44, bold=True)
    # 3D sticker effect for title
    title_text = "Zodiac & Plush"
    # Shadow
    draw.text((int(WIDTH * 0.52) + 3, 123), title_text, font=f_title_main, fill=(180, 205, 230, 255))
    draw.text((int(WIDTH * 0.52), 120), title_text, font=f_title_main, fill=(45, 52, 54, 255))
    
    title_sub = "Series Drop"
    draw.text((int(WIDTH * 0.52) + 3, 178), title_sub, font=f_title_main, fill=(180, 205, 230, 255))
    draw.text((int(WIDTH * 0.52), 175), title_sub, font=f_title_main, fill=(45, 52, 54, 255))

    # Description text
    f_desc = get_font(15, bold=False)
    draw.text((int(WIDTH * 0.52), 245), "Viral unboxing plush charms with animated eyes & secret chases.", font=f_desc, fill=(99, 110, 114, 255))
    draw.text((int(WIDTH * 0.52), 268), "100% Genuine Certified Sealed Blind Boxes.", font=f_desc, fill=(99, 110, 114, 255))

    # Action buttons
    # Button 1: White solid "SHOP NOW"
    btn1_x = int(WIDTH * 0.52)
    btn1_y = 320
    draw.rounded_rectangle([btn1_x, btn1_y, btn1_x + 130, btn1_y + 44], radius=6, fill=(255, 255, 255, 255), outline=(200, 200, 200, 255), width=1)
    f_btn = get_font(14, bold=True)
    draw.text((btn1_x + 22, btn1_y + 13), "SHOP NOW", font=f_btn, fill=(45, 52, 54, 255))

    # Button 2: Telegram Order button
    btn2_x = btn1_x + 145
    draw.rounded_rectangle([btn2_x, btn1_y, btn2_x + 160, btn1_y + 44], radius=6, fill=(34, 158, 217, 255))
    draw.text((btn2_x + 18, btn1_y + 13), "ORDER TELEGRAM", font=f_btn, fill=(255, 255, 255, 255))

    # Save
    out_path = os.path.join(OUTPUT_DIR, "banner_babythree.png")
    banner.convert("RGB").save(out_path, quality=95)
    print(f"Created {out_path}")

def create_space_molly_banner():
    # Base canvas (Sleek dark gradient)
    banner = Image.new("RGBA", (WIDTH, HEIGHT), (18, 16, 26, 255))
    draw = ImageDraw.Draw(banner)
    
    # Left side: Cosmic / Studio lighting
    left_bg = Image.new("RGBA", (int(WIDTH * 0.48), HEIGHT), (28, 24, 42, 255))
    left_draw = ImageDraw.Draw(left_bg)
    for y in range(HEIGHT):
        left_draw.line([(0, y), (int(WIDTH * 0.48), y)], fill=(35 + int(y*0.04), 28, 55 + int(y*0.06), 255))
    banner.paste(left_bg, (0, 0))
    
    # Paste Space Molly 3D Box
    molly_path = "server/uploads/cropped/crop_mega_space_molly_box_1787473086799.jpg"
    if os.path.exists(molly_path):
        m_img = Image.open(molly_path).convert("RGBA")
        m_w = int(HEIGHT * 0.88)
        m_h = int(HEIGHT * 0.88)
        m_resized = m_img.resize((m_w, m_h), Image.Resampling.LANCZOS)
        
        # Soft shadow
        shadow = Image.new("RGBA", (m_w + 30, m_h + 30), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.ellipse([20, m_h - 15, m_w + 10, m_h + 20], fill=(0, 0, 0, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))
        banner.paste(shadow, (40, int(HEIGHT * 0.06)), shadow)
        
        banner.paste(m_resized, (50, int(HEIGHT * 0.06)), m_resized)

    # Torn paper divider in middle
    divider_x = int(WIDTH * 0.46)
    torn_poly = []
    import random
    random.seed(99)
    for y in range(0, HEIGHT + 10, 12):
        dx = random.randint(-4, 6)
        torn_poly.append((divider_x + dx, y))
    
    right_poly = [(WIDTH, 0)] + torn_poly + [(WIDTH, HEIGHT)]
    draw.polygon(right_poly, fill=(26, 32, 44, 255))
    
    for pt in torn_poly:
        draw.ellipse([pt[0]-2, pt[1]-2, pt[0]+4, pt[1]+4], fill=(255, 255, 255, 120))

    # Badge
    draw.rounded_rectangle([25, 20, 115, 52], radius=4, fill=(235, 25, 45, 255))
    f_badge = get_font(18, bold=True)
    draw.text((32, 26), "POP MART", font=f_badge, fill=(255, 255, 255, 255))
    
    f_badge_sub = get_font(16, bold=False)
    draw.text((125, 27), "MEGA SPACE MOLLY", font=f_badge_sub, fill=(200, 200, 220, 255))

    # Right side typography
    f_title_small = get_font(20, bold=True)
    draw.text((int(WIDTH * 0.52), 90), "COLLECTOR EDITION", font=f_title_small, fill=(253, 203, 110, 255))
    
    f_title_main = get_font(44, bold=True)
    title_text = "Space Molly 100%"
    draw.text((int(WIDTH * 0.52) + 3, 123), title_text, font=f_title_main, fill=(15, 15, 20, 255))
    draw.text((int(WIDTH * 0.52), 120), title_text, font=f_title_main, fill=(255, 255, 255, 255))
    
    title_sub = "Mega Series"
    draw.text((int(WIDTH * 0.52) + 3, 178), title_sub, font=f_title_main, fill=(15, 15, 20, 255))
    draw.text((int(WIDTH * 0.52), 175), title_sub, font=f_title_main, fill=(255, 255, 255, 255))

    # Description text
    f_desc = get_font(15, bold=False)
    draw.text((int(WIDTH * 0.52), 245), "Authentic designer art toys and pop culture icons.", font=f_desc, fill=(160, 174, 192, 255))
    draw.text((int(WIDTH * 0.52), 268), "Live stream drops with guaranteed intact original packaging.", font=f_desc, fill=(160, 174, 192, 255))

    # Action buttons
    btn1_x = int(WIDTH * 0.52)
    btn1_y = 320
    draw.rounded_rectangle([btn1_x, btn1_y, btn1_x + 130, btn1_y + 44], radius=6, fill=(255, 255, 255, 255))
    f_btn = get_font(14, bold=True)
    draw.text((btn1_x + 22, btn1_y + 13), "SHOP NOW", font=f_btn, fill=(20, 20, 20, 255))

    btn2_x = btn1_x + 145
    draw.rounded_rectangle([btn2_x, btn1_y, btn2_x + 160, btn1_y + 44], radius=6, fill=(34, 158, 217, 255))
    draw.text((btn2_x + 18, btn1_y + 13), "ORDER TELEGRAM", font=f_btn, fill=(255, 255, 255, 255))

    out_path = os.path.join(OUTPUT_DIR, "banner_spacemolly.png")
    banner.convert("RGB").save(out_path, quality=95)
    print(f"Created {out_path}")

create_baby_three_banner()
create_space_molly_banner()
