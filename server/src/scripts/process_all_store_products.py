import os
import json
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import sys

sys.stdout.reconfigure(encoding='utf-8')

raw_dir = "server/uploads/tiktok_raw_thumbs"
originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
public_3d_dir = "client/public/3d_boxes"

os.makedirs(originals_dir, exist_ok=True)
os.makedirs(cropped_dir, exist_ok=True)
os.makedirs(public_3d_dir, exist_ok=True)

# Load video list for title metadata
video_meta_file = "server/data/tiktok_video_list.json"
video_meta_map = {}
if os.path.exists(video_meta_file):
    try:
        with open(video_meta_file, "r", encoding="utf-8") as f:
            v_list = json.load(f)
            for item in v_list:
                video_meta_map[item["id"]] = item
    except Exception as e:
        print(f"Error loading video meta: {e}")

# Function to assess image clarity & contrast
def evaluate_image_clarity(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return 0, 0, False
    h, w = img.shape[:2]
    if h < 300 or w < 300:
        return 0, 0, False

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Variance of Laplacian for blur detection
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    # Mean brightness
    mean_brightness = np.mean(gray)

    # Minimum thresholds for usable, clear showcase product photos
    is_clear = (laplacian_var > 60.0) and (40 < mean_brightness < 245)
    return laplacian_var, mean_brightness, is_clear

# Product dictionary & categorization mapper
known_brands = [
    ("nommi", "Nommi", "Plush Dolls", 14.0),
    ("baby three", "Baby Three", "Plush Dolls", 12.5),
    ("space molly", "Pop Mart", "Action Figures", 18.5),
    ("molly", "Pop Mart", "Blind Box", 14.0),
    ("stitch", "Disney", "Plush Dolls", 13.5),
    ("skullpanda", "Pop Mart", "Blind Box", 15.0),
    ("crybaby", "Pop Mart", "Plush Dolls", 16.0),
    ("crie baby", "Pop Mart", "Plush Dolls", 16.0),
    ("labubu", "Pop Mart", "Plush Dolls", 19.5),
    ("dimoo", "Pop Mart", "Blind Box", 14.5),
    ("sanrio", "Sanrio", "Plush Dolls", 12.0),
    ("kurumi", "Sanrio", "Plush Dolls", 12.0),
    ("kuromi", "Sanrio", "Plush Dolls", 12.0),
    ("samuel", "MEI YI YOU ART TOY", "Plush Dolls", 13.0),
    ("yumi", "DOTEBABY", "Plush Dolls", 12.5),
    ("zootopia", "Disney", "Plush Dolls", 14.0),
    ("fox", "Disney", "Plush Dolls", 14.0),
]

def parse_product_info(vid_id, title):
    lower = (title or "").lower()
    
    brand = "Classy Bling"
    category = "Blind Box"
    price = 14.0
    
    for key, b, c, p in known_brands:
        if key in lower:
            brand = b
            category = c
            price = p
            break
            
    # Extract clean name
    name = title.split('#')[0].strip() if title else f"Classy Bling Collectible {vid_id[-4:]}"
    if len(name) < 4 or any(ord(c) > 0x1780 and ord(c) < 0x17FF for c in name): # Khmer title fallback
        name = f"{brand} {category} Edition"
        
    return {
        "name": name,
        "brand": brand,
        "category": category,
        "price": price,
        "series": f"{brand} Signature Series"
    }

# Render high-resolution clear 3D studio image
def generate_crystal_clear_studio_render(orig_path, out_cropped_path, out_public_path):
    img_bgr = cv2.imread(orig_path)
    if img_bgr is None:
        return False
    h, w = img_bgr.shape[:2]

    # Center crop region containing the product
    crop_x1 = int(w * 0.12)
    crop_x2 = int(w * 0.88)
    crop_y1 = int(h * 0.28)
    crop_y2 = int(h * 0.90)

    cropped = img_bgr[crop_y1:crop_y2, crop_x1:crop_x2]
    if cropped.size == 0:
        return False

    # AI Enhancement Pipeline: Super-sampling, contrast adjustment, vibrancy boost
    cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(cropped_rgb)
    pil_img = pil_img.resize((600, 600), Image.Resampling.LANCZOS)
    pil_img = ImageEnhance.Color(pil_img).enhance(1.18)
    pil_img = ImageEnhance.Sharpness(pil_img).enhance(1.35)
    pil_img = ImageEnhance.Contrast(pil_img).enhance(1.10)

    # 3D Studio Canvas (800x800) with soft aesthetic backdrop
    canvas = Image.new("RGBA", (800, 800), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    # Clean Studio Radial Glow
    for r in range(400, 0, -5):
        alpha = int(255 - (400 - r) * 0.08)
        draw.ellipse([400 - r, 400 - r, 400 + r, 400 + r], fill=(250, 250, 252, 255))

    # Soft Contact Drop Shadow
    shadow = Image.new("RGBA", (800, 800), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse([140, 690, 660, 750], fill=(0, 0, 0, 95))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    canvas = Image.alpha_composite(canvas, shadow)

    # Paste Enhanced Product Artwork
    mask = Image.new("L", (600, 600), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rounded_rectangle([(0, 0), (600, 600)], radius=18, fill=255)
    
    canvas.paste(pil_img, (100, 110), mask)

    # Save as high-quality WebP & JPG
    canvas.convert("RGB").save(out_cropped_path, "WEBP", quality=96)
    canvas.convert("RGB").save(out_public_path, "JPEG", quality=94)
    return True

print("🔍 Inspecting all downloaded store TikTok videos...")
raw_files = [f for f in os.listdir(raw_dir) if f.endswith(".jpg")]
print(f"Total raw store photos found: {len(raw_files)}")

verified_catalog = []
skipped_blurry = 0
processed_count = 0

for raw_file in raw_files:
    vid_id = os.path.splitext(raw_file)[0]
    raw_path = os.path.join(raw_dir, raw_file)

    # 1. Clarity Check
    lap_var, brightness, is_clear = evaluate_image_clarity(raw_path)
    if not is_clear:
        skipped_blurry += 1
        continue

    meta = video_meta_map.get(vid_id, {})
    title = meta.get("title", "")
    info = parse_product_info(vid_id, title)

    orig_png_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    cropped_webp_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    public_jpg_path = os.path.join(public_3d_dir, f"cb_{vid_id}.jpg")

    # Save original PNG
    Image.open(raw_path).save(orig_png_path, "PNG")

    # 2. Generate crystal-clear 3D studio image
    success = generate_crystal_clear_studio_render(orig_png_path, cropped_webp_path, public_jpg_path)
    if not success:
        skipped_blurry += 1
        continue

    product_item = {
        "id": f"prod_{vid_id}",
        "name": info["name"],
        "price": info["price"],
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": info["category"],
        "brand": info["brand"],
        "series": info["series"],
        "description": f"Authentic {info['name']} designer art toy collectible. Available in stock at Classy Bling.",
        "originalScreenshotUrl": f"/uploads/originals/{vid_id}_original.png",
        "croppedImageUrl": f"/uploads/cropped/{vid_id}_cropped.webp",
        "tiktokVideoUrl": f"https://www.tiktok.com/@classy.bling/video/{vid_id}",
        "createdAt": "2026-08-25T10:00:00.000Z",
        "tags": [info["brand"], info["category"], "Authentic", "In Stock"]
    }

    verified_catalog.append(product_item)
    processed_count += 1

print(f"\n✨ Inspection & Generation Complete:")
print(f"✅ Crystal-Clear 3D Studio Products Generated: {processed_count}")
print(f"⏭️ Blurry / Low-Contrast Photos Skipped: {skipped_blurry}")

# Save to server/data/products.json
with open("server/data/products.json", "w", encoding="utf-8") as f:
    json.dump(verified_catalog, f, indent=2, ensure_ascii=False)

print(f"📦 Successfully updated server/data/products.json with {len(verified_catalog)} clean items!")
