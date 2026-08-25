import os
import json
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import math
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
public_3d_dir = "client/public/3d_boxes"

os.makedirs(originals_dir, exist_ok=True)
os.makedirs(cropped_dir, exist_ok=True)
os.makedirs(public_3d_dir, exist_ok=True)

# Curated High-End 3D Studio Definitions matching user's exact flagship screenshot
flagship_3d_products = [
    {
        "id": "prod_molly_watermelon",
        "name": "Molly Fruit Party Watermelon",
        "price": 14.00,
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Fruit Party Series",
        "description": "Molly Fruit Party Watermelon collectible blind box figure on studio podium.",
        "image_file": "molly_fruit_watermelon_box_1787473215089.jpg",
        "tags": ["Pop Mart", "Molly", "Watermelon", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_nommi_pinky",
        "name": "Nommi Pinky Energy",
        "price": 14.00,
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Nommi",
        "series": "Pinky Energy Series",
        "description": "Nommi Pinky Energy fluffy plush designer art toy collectible by SURE FUN x TOP TOY.",
        "image_file": "nommi_pinky_energy_box_1787473059976.jpg",
        "tags": ["Nommi", "Pinky Energy", "Plush Dolls", "Popular", "In Stock"]
    },
    {
        "id": "prod_stitch_sleep",
        "name": "Disney Stitch Sleepy Dreamland",
        "price": 13.50,
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Disney",
        "series": "Stitch Dreamland Series",
        "description": "Disney Stitch Sleepy Dreamland vinyl plush blind box on white studio podium.",
        "image_file": "stitch_sleep_box_1787473179186.jpg",
        "tags": ["Disney", "Stitch", "Plush Dolls", "Sleepy Dreamland", "In Stock"]
    },
    {
        "id": "prod_baby_three_weirdly",
        "name": "Baby Three Weirdly Adorable Mini",
        "price": 12.50,
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Weirdly Adorable",
        "description": "Baby Three Weirdly Adorable mini plush doll on warm studio floor.",
        "image_file": "baby_three_weirdly_adorable_box_1787473293359.jpg",
        "tags": ["Baby Three", "Weirdly Adorable", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_baby_three_animals",
        "name": "Baby Three Mini Animal Party",
        "price": 14.00,
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Mini Animals Series 1",
        "description": "Baby Three Mini Animals party edition on pastel lavender studio backdrop.",
        "image_file": "baby_three_mini_animals_box_1787473113424.jpg",
        "tags": ["Baby Three", "Mini Animals", "Plush Dolls", "Trending", "In Stock"]
    },
    {
        "id": "prod_space_molly",
        "name": "Mega Space Molly V2 100%",
        "price": 18.50,
        "stockStatus": "In Stock",
        "category": "Action Figures",
        "brand": "Pop Mart",
        "series": "Mega Space Molly Series 2",
        "description": "Mega Space Molly Series 02 blind box in yellow astronaut suit on dark studio podium.",
        "image_file": "mega_space_molly_box_1787473086799.jpg",
        "tags": ["Pop Mart", "Space Molly", "Action Figures", "Limited", "In Stock"]
    },
    {
        "id": "prod_molly_baking",
        "name": "Molly Baking Time Carb Lover",
        "price": 14.50,
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Molly Baking Time",
        "description": "Molly Baking Time Carb-Lover series collectible box with chef hat.",
        "image_file": "molly_baking_time_box_1787473509030.jpg",
        "tags": ["Pop Mart", "Molly", "Baking Time", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_baby_three_lolita",
        "name": "Baby Three Lolita's Dream",
        "price": 14.00,
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Lolita's Dream",
        "description": "Baby Three Lolita's Dream mini plush doll blind box on studio table.",
        "image_file": "baby_three_lolita_dream_box_1787473539024.jpg",
        "tags": ["Baby Three", "Lolita Dream", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_baby_molly_three",
        "name": "Baby Molly When I Was Three",
        "price": 15.00,
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Baby Molly",
        "description": "Baby Molly When I Was Three original POP MART collectible blind box.",
        "image_file": "baby_molly_baby_tabby_box_1787473570037.jpg",
        "tags": ["Pop Mart", "Baby Molly", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_yumi_edm",
        "name": "YuMi Bestie EDM Festival",
        "price": 13.50,
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "DOTEBABY",
        "series": "YuMi EDM Festival",
        "description": "Yumi Bestie EDM festival vinyl plush blind box with headphones.",
        "image_file": "yumi_edm_festival_box_1787473599903.jpg",
        "tags": ["DOTEBABY", "YuMi", "EDM Festival", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_fox_bunny",
        "name": "Fox & Bunny Trick or Treat",
        "price": 14.00,
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Fox & Bunny",
        "series": "Halloween Series",
        "description": "Fox & Bunny Halloween trick or treat special edition blind box.",
        "image_file": "fox_bunny_trick_treat_box_1787473734642.jpg",
        "tags": ["Fox & Bunny", "Halloween", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_baby_three_zodiac",
        "name": "Baby Three Zodiac 12 Stars",
        "price": 14.50,
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Zodiac Star Signs",
        "description": "Baby Three Constellation Zodiac plush doll keychain series on studio stand.",
        "image_file": "baby_three_zodiac_studio_box_1787476804515.jpg",
        "tags": ["Baby Three", "Zodiac", "Plush Dolls", "In Stock"]
    }
]

# Function to synthesize 3D box with side panel perspective on 3D studio podium
def render_photorealistic_podium_box(
    input_img_path,
    output_path,
    bg_theme="soft_studio",
    side_color=(235, 215, 60),
    top_color=(255, 195, 215),
    box_w=460,
    box_h=620,
    depth_w=40,
    depth_h=25
):
    if not os.path.exists(input_img_path):
        return False

    img_bgr = cv2.imread(input_img_path)
    if img_bgr is None:
        return False
    h, w = img_bgr.shape[:2]

    # Center crop high-res artwork from source image
    crop_x1 = int(w * 0.15)
    crop_x2 = int(w * 0.85)
    crop_y1 = int(h * 0.25)
    crop_y2 = int(h * 0.88)
    front_raw = img_bgr[crop_y1:crop_y2, crop_x1:crop_x2]
    if front_raw.size == 0:
        front_raw = img_bgr

    front_resized = cv2.resize(front_raw, (box_w, box_h), interpolation=cv2.INTER_LANCZOS4)
    front_rgb = cv2.cvtColor(front_resized, cv2.COLOR_BGR2RGB)
    front_pil = Image.fromarray(front_rgb)
    front_pil = ImageEnhance.Color(front_pil).enhance(1.15)
    front_pil = ImageEnhance.Sharpness(front_pil).enhance(1.30)
    front_pil = ImageEnhance.Contrast(front_pil).enhance(1.08)

    # 1. 1000x1000 Studio Canvas
    canvas_size = 1000
    canvas = Image.new("RGBA", (canvas_size, canvas_size))
    draw = ImageDraw.Draw(canvas)

    bg_themes = {
        "soft_studio": ((250, 248, 246), (225, 222, 218)),
        "warm": ((255, 248, 240), (235, 224, 212)),
        "cool": ((240, 248, 255), (218, 230, 242)),
        "lavender": ((250, 244, 255), (225, 215, 240)),
        "dark": ((60, 62, 70), (35, 36, 42))
    }
    top_c, bot_c = bg_themes.get(bg_theme, bg_themes["soft_studio"])

    for y in range(canvas_size):
        ratio = y / canvas_size
        r = int(top_c[0] + (bot_c[0] - top_c[0]) * ratio)
        g = int(top_c[1] + (bot_c[1] - top_c[1]) * ratio)
        b = int(top_c[2] + (bot_c[2] - top_c[2]) * ratio)
        draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))

    # 2. 3D Studio Podium (Round Cylinder)
    podium_cx = canvas_size // 2
    podium_cy = 810
    podium_rx = 380
    podium_ry = 65
    podium_h = 60

    # Ambient podium shadow
    p_shadow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    psdraw = ImageDraw.Draw(p_shadow)
    psdraw.ellipse([podium_cx - podium_rx - 25, podium_cy + podium_h - 20,
                    podium_cx + podium_rx + 25, podium_cy + podium_h + 55],
                   fill=(0, 0, 0, 45))
    p_shadow = p_shadow.filter(ImageFilter.GaussianBlur(25))
    canvas = Image.alpha_composite(canvas, p_shadow)

    # Podium side surface
    p_body = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    pbdraw = ImageDraw.Draw(p_body)
    for x in range(podium_cx - podium_rx, podium_cx + podium_rx):
        nx = (x - (podium_cx - podium_rx)) / (2 * podium_rx)
        shade = int(244 - 24 * math.sin(nx * math.pi))
        pbdraw.line([(x, podium_cy), (x, podium_cy + podium_h)], fill=(shade, shade, shade + 2, 255))

    # Podium bottom ellipse & top ellipse
    pbdraw.ellipse([podium_cx - podium_rx, podium_cy + podium_h - podium_ry,
                    podium_cx + podium_rx, podium_cy + podium_h + podium_ry], fill=(225, 222, 218, 255))
    pbdraw.ellipse([podium_cx - podium_rx, podium_cy - podium_ry,
                    podium_cx + podium_rx, podium_cy + podium_ry], fill=(255, 255, 255, 255))
    canvas = Image.alpha_composite(canvas, p_body)

    # 3. 3D Box Geometry Points
    base_x = (canvas_size - (box_w + depth_w)) // 2
    base_y = 770

    # Contact Shadow on Podium
    box_shadow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    bsdraw = ImageDraw.Draw(box_shadow)
    bsdraw.ellipse([base_x - 10, base_y - 14,
                    base_x + box_w + depth_w + 10, base_y + 24],
                   fill=(0, 0, 0, 115))
    box_shadow = box_shadow.filter(ImageFilter.GaussianBlur(12))
    canvas = Image.alpha_composite(canvas, box_shadow)

    p1 = (base_x, base_y - box_h)
    p2 = (base_x + box_w, base_y - box_h)
    p3 = (base_x + box_w, base_y)
    p4 = (base_x, base_y)

    p5 = (base_x + box_w + depth_w, base_y - box_h - depth_h)
    p6 = (base_x + box_w + depth_w, base_y - depth_h)
    p7 = (base_x + depth_w, base_y - box_h - depth_h)

    # 4. Right 3D Side Panel
    side_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(side_layer)
    sdraw.polygon([p2, p5, p6, p3], fill=side_color + (255,))
    for i in range(depth_w):
        t = i / depth_w
        sx = int(p2[0] + (p5[0] - p2[0]) * t)
        sy1 = int(p2[1] + (p5[1] - p2[1]) * t)
        sy2 = int(p3[1] + (p6[1] - p3[1]) * t)
        alpha = int(25 + 45 * t)
        sdraw.line([(sx, sy1), (sx, sy2)], fill=(0, 0, 0, alpha))
    canvas = Image.alpha_composite(canvas, side_layer)

    # 5. Top Lid Panel
    top_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(top_layer)
    tdraw.polygon([p1, p7, p5, p2], fill=top_color + (255,))
    for i in range(depth_w):
        t = i / depth_w
        tx1 = int(p1[0] + (p7[0] - p1[0]) * t)
        ty1 = int(p1[1] + (p7[1] - p1[1]) * t)
        tx2 = int(p2[0] + (p5[0] - p2[0]) * t)
        ty2 = int(p2[1] + (p5[1] - p2[1]) * t)
        alpha = int(50 * (1 - t))
        tdraw.line([(tx1, ty1), (tx2, ty2)], fill=(255, 255, 255, alpha))
    canvas = Image.alpha_composite(canvas, top_layer)

    # 6. Front Artwork Face with Rounded Bevel Mask
    mask = Image.new("L", (box_w, box_h), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rounded_rectangle([(0, 0), (box_w, box_h)], radius=8, fill=255)

    sheen = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    shdraw = ImageDraw.Draw(sheen)
    for x in range(box_w):
        t = x / box_w
        alpha = int(22 * (1 - t))
        shdraw.line([(x, 0), (x, box_h)], fill=(255, 255, 255, alpha))

    front_composite = Image.alpha_composite(front_pil.convert("RGBA"), sheen)
    canvas.paste(front_composite, (p1[0], p1[1]), mask)

    # 7. Specular 3D Highlight Lines
    edge_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    edraw = ImageDraw.Draw(edge_layer)
    edraw.line([p1, p2], fill=(255, 255, 255, 160), width=2)
    edraw.line([p2, p3], fill=(255, 255, 255, 120), width=2)
    edraw.line([p2, p5], fill=(255, 255, 255, 180), width=2)
    edraw.line([p5, p6], fill=(0, 0, 0, 50), width=1)
    edraw.line([p3, p6], fill=(0, 0, 0, 50), width=1)
    canvas = Image.alpha_composite(canvas, edge_layer)

    # Save
    canvas.convert("RGB").save(output_path, "JPEG", quality=95)
    return True

print("💎 Synthesizing 3D Studio Flagship Boxes...")

# Build catalog
final_products = []

for item in flagship_3d_products:
    img_path = f"/3d_boxes/{item['image_file']}"
    full_local_path = os.path.join(public_3d_dir, item['image_file'])
    
    # Ensure cropped webp exists
    cropped_out = os.path.join(cropped_dir, f"{item['id']}_cropped.webp")
    if os.path.exists(full_local_path):
        Image.open(full_local_path).save(cropped_out, "WEBP", quality=95)
        
    product_entry = {
        "id": item["id"],
        "name": item["name"],
        "price": item["price"],
        "currency": "USD",
        "stockStatus": item["stockStatus"],
        "category": item["category"],
        "brand": item["brand"],
        "series": item["series"],
        "description": item["description"],
        "croppedImageUrl": img_path,
        "originalScreenshotUrl": img_path,
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T12:00:00.000Z",
        "tags": item["tags"]
    }
    final_products.append(product_entry)

# Also generate 3D podium boxes for additional clear items from store thumbnails
raw_files = [f for f in os.listdir("server/uploads/tiktok_raw_thumbs") if f.endswith(".jpg")]
themes = ["soft_studio", "warm", "cool", "lavender"]

added_extra = 0
for idx, rf in enumerate(raw_files[:30]):
    vid_id = os.path.splitext(rf)[0]
    # Skip if already in flagship
    if any(item["id"] == f"prod_{vid_id}" for item in final_products):
        continue

    src_raw = os.path.join("server/uploads/tiktok_raw_thumbs", rf)
    out_3d_file = f"studio_3d_{vid_id}.jpg"
    out_3d_path = os.path.join(public_3d_dir, out_3d_file)
    
    theme = themes[idx % len(themes)]
    success = render_photorealistic_podium_box(src_raw, out_3d_path, bg_theme=theme)
    if success:
        p_entry = {
            "id": f"prod_{vid_id}",
            "name": f"Pop Mart & Baby Three Edition #{idx+1}",
            "price": 14.00,
            "currency": "USD",
            "stockStatus": "In Stock",
            "category": "Blind Box" if idx % 2 == 0 else "Plush Dolls",
            "brand": "Pop Mart" if idx % 2 == 0 else "Baby Three",
            "series": "Signature Collectibles",
            "description": "Authentic designer art toy blind box on 3D studio display podium.",
            "croppedImageUrl": f"/3d_boxes/{out_3d_file}",
            "originalScreenshotUrl": f"/3d_boxes/{out_3d_file}",
            "tiktokVideoUrl": f"https://www.tiktok.com/@classy.bling/video/{vid_id}",
            "contactTelegram": "https://t.me/+85592917831",
            "contactFacebook": "https://facebook.com",
            "createdAt": "2026-08-25T12:00:00.000Z",
            "tags": ["Authentic", "In Stock", "3D Studio"]
        }
        final_products.append(p_entry)
        added_extra += 1

print(f"✅ Generated {len(final_products)} crystal-clear 3D studio podium boxes!")

# Save to server/data/products.json
with open("server/data/products.json", "w", encoding="utf-8") as f:
    json.dump(final_products, f, indent=2, ensure_ascii=False)

# Sync to client/src/data/initialProducts.ts
categories = sorted(list(set(p.get("category", "Blind Box") for p in final_products)))
if "All" not in categories:
    categories.insert(0, "All")
brands = sorted(list(set(p.get("brand", "Pop Mart") for p in final_products)))

ts_content = f'''import {{ Product }} from '../types';

export const INITIAL_PRODUCTS: Product[] = {json.dumps(final_products, indent=2, ensure_ascii=False)};

export const INITIAL_CATEGORIES = {json.dumps(categories, indent=2, ensure_ascii=False)};
export const INITIAL_BRANDS = {json.dumps(brands, indent=2, ensure_ascii=False)};
'''

with open("client/src/data/initialProducts.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"✨ Successfully updated initialProducts.ts with {len(final_products)} high-definition 3D studio boxes!")
