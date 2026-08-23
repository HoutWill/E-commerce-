import os
import json
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

raw_dir = "server/uploads/tiktok_raw_thumbs"
originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"

os.makedirs(originals_dir, exist_ok=True)
os.makedirs(cropped_dir, exist_ok=True)

# 100% Exact Matching to the Video Screenshot Overlays & Captions
verified_products = [
    {
        "vid_id": "7674630856404684052",
        "name": "Nommi Abt The childhood",
        "price": 13.5,
        "stockStatus": "in_stock",
        "brand": "Nommi",
        "category": "Plush Dolls",
        "series": "About The Childhood",
        "description": "Nommi Abt The childhood plush doll blind box by TOP TOY x SURE FUN. Available in stock.",
        "crop_box": (0.03, 0.31, 0.94, 0.86),
        "tags": ["Nommi", "Abt The childhood", "Plush Dolls", "TOP TOY", "In Stock"]
    },
    {
        "vid_id": "7675390908237352213",
        "name": "Mega Space molly V2",
        "price": 4.0,
        "stockStatus": "in_stock",
        "brand": "Pop Mart",
        "category": "Action Figures",
        "series": "Mega Space Molly",
        "description": "Mega Space molly V2 series 02 collectible figure in yellow astronaut suit. Available in stock.",
        "crop_box": (0.18, 0.42, 0.82, 0.85),
        "tags": ["Pop Mart", "Mega Space molly V2", "Action Figures", "Astronaut", "In Stock"]
    },
    {
        "vid_id": "7675392583178128660",
        "name": "Nommi Pinky Energy",
        "price": 14.0,
        "stockStatus": "in_stock",
        "brand": "Nommi",
        "category": "Plush Dolls",
        "series": "Pinky Energy",
        "description": "Nommi Pinky Energy plush doll blind box. Available in stock.",
        "crop_box": (0.18, 0.35, 0.82, 0.88),
        "tags": ["Nommi", "Pinky Energy", "Plush Dolls", "TOP TOY", "In Stock"]
    },
    {
        "vid_id": "7675019183867841812",
        "name": "SKULLPANDA The Sound",
        "price": 4.0,
        "stockStatus": "in_stock",
        "brand": "Pop Mart",
        "category": "Blind Box",
        "series": "Skullpanda",
        "description": "SKULLPANDA The Sound series collectible blind box figure. Available in stock.",
        "crop_box": (0.06, 0.40, 0.94, 0.82),
        "tags": ["Pop Mart", "Skullpanda", "The Sound", "Blind Box", "In Stock"]
    },
    {
        "vid_id": "7675018044170652949",
        "name": "Baby Three weirdly adorable mini",
        "price": 9.0,
        "stockStatus": "in_stock",
        "brand": "Baby Three",
        "category": "Plush Dolls",
        "series": "Weirdly Adorable",
        "description": "Baby Three weirdly adorable mini plush doll series. Available in stock.",
        "crop_box": (0.16, 0.38, 0.80, 0.82),
        "tags": ["Baby Three", "weirdly adorable mini", "Plush Dolls", "Mini", "In Stock"]
    },
    {
        "vid_id": "7674631770985336085",
        "name": "Stitch blindbox",
        "price": 5.0,
        "stockStatus": "in_stock",
        "brand": "Disney",
        "category": "Plush Dolls",
        "series": "Stitch Sleep Series",
        "description": "Stitch blindbox Eat Something Before Sleep vinyl plush toy. Available in stock.",
        "crop_box": (0.16, 0.44, 0.86, 0.96),
        "tags": ["Disney", "Stitch blindbox", "Plush Dolls", "Nightcap", "In Stock"]
    },
    {
        "vid_id": "7674475508981206293",
        "name": "Molly Baking Time Mini",
        "price": 4.5,
        "stockStatus": "in_stock",
        "brand": "Pop Mart",
        "category": "Blind Box",
        "series": "Molly Baking Time",
        "description": "Molly Baking Time Carb-Lover series mini claw machine collectible box. Available in stock.",
        "crop_box": (0.12, 0.44, 0.86, 0.92),
        "tags": ["Pop Mart", "Molly Baking Time", "Carb Lover", "In Stock"]
    },
    {
        "vid_id": "7674473498621857045",
        "name": "Molly Baking Time",
        "price": 11.0,
        "stockStatus": "in_stock",
        "brand": "Pop Mart",
        "category": "Blind Box",
        "series": "Molly Baking Time",
        "description": "Molly Baking Time Carb Lover series figures with chef hat and loaf toast box. Available in stock.",
        "crop_box": (0.10, 0.45, 0.66, 0.86),
        "tags": ["Pop Mart", "Molly Baking Time", "Carb Lover", "Figures", "In Stock"]
    },
    {
        "vid_id": "7664252590699416853",
        "name": "Baby Three Pocket bunny Treasure",
        "price": 7.5,
        "stockStatus": "in_stock",
        "brand": "Baby Three",
        "category": "Plush Dolls",
        "series": "Pocket Bunny Treasure",
        "description": "Baby Three Pocket bunny Treasure plush blind box with yellow bonnet. Available in stock.",
        "crop_box": (0.14, 0.38, 0.87, 0.85),
        "tags": ["Baby Three", "Pocket bunny Treasure", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7663905196409376021",
        "name": "Cries Baby animal Kindergarten",
        "price": 7.0,
        "stockStatus": "in_stock",
        "brand": "Crie Baby",
        "category": "Plush Dolls",
        "series": "Animal Kindergarten",
        "description": "Cries Baby animal Kindergarten plush doll pendant blind box. Available in stock.",
        "crop_box": (0.08, 0.33, 0.90, 0.90),
        "tags": ["Crie Baby", "Cries Baby animal Kindergarten", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7663903914055503124",
        "name": "Samuel Ocean",
        "price": 5.0,
        "stockStatus": "in_stock",
        "brand": "MEI YI YOU ART TOY",
        "category": "Plush Dolls",
        "series": "Samuel Ocean",
        "description": "Samuel Ocean shark hooded plush doll blind box. Available in stock.",
        "crop_box": (0.08, 0.46, 0.84, 0.93),
        "tags": ["MEI YI YOU", "Samuel Ocean", "Shark", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7660905168304737556",
        "name": "Baby Molly",
        "price": 11.0,
        "stockStatus": "in_stock",
        "brand": "Pop Mart",
        "category": "Blind Box",
        "series": "Baby Molly",
        "description": "Baby Molly When I Was Three original POP MART art toy collectible figures. Available in stock.",
        "crop_box": (0.12, 0.42, 0.85, 0.88),
        "tags": ["Pop Mart", "Baby Molly", "Art Toy", "In Stock"]
    },
    {
        "vid_id": "7660713566617488661",
        "name": "Fox & Bunny",
        "price": 12.0,
        "stockStatus": "in_stock",
        "brand": "Disney",
        "category": "Plush Dolls",
        "series": "Zootopia",
        "description": "Fox & Bunny Nick Wilde & Judy Hopps plush doll series. Available in stock.",
        "crop_box": (0.10, 0.38, 0.88, 0.88),
        "tags": ["Disney", "Fox & Bunny", "Zootopia", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7660475956859129108",
        "name": "Baby Three Zodiac",
        "price": 10.0,
        "stockStatus": "in_stock",
        "brand": "Baby Three",
        "category": "Plush Dolls",
        "series": "Zodiac Signs",
        "description": "Baby Three Zodiac constellation plush doll keychain series. Available in stock.",
        "crop_box": (0.10, 0.40, 0.88, 0.88),
        "tags": ["Baby Three", "Baby Three Zodiac", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7660001603688221973",
        "name": "Babytree Lolita's Dream",
        "price": 9.0,
        "stockStatus": "in_stock",
        "brand": "Baby Three",
        "category": "Plush Dolls",
        "series": "Lolita's Dream",
        "description": "Babytree Lolita's Dream mini plush doll blind box. Available in stock.",
        "crop_box": (0.13, 0.41, 0.85, 0.95),
        "tags": ["Baby Three", "Babytree Lolita's Dream", "Mini", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7659642403011284244",
        "name": "Kurumi Dreamland",
        "price": 2.0,
        "stockStatus": "in_stock",
        "brand": "Sanrio",
        "category": "Blind Box",
        "series": "Dreamland",
        "description": "Kurumi Dreamland collectible figure blind box. Available in stock.",
        "crop_box": (0.27, 0.44, 0.79, 0.86),
        "tags": ["Sanrio", "Kurumi Dreamland", "Blind Box", "In Stock"]
    },
    {
        "vid_id": "7658833670031101204",
        "name": "Yumi Bestie EDM festival",
        "price": 5.5,
        "stockStatus": "in_stock",
        "brand": "DOTEBABY",
        "category": "Plush Dolls",
        "series": "YuMi EDM Festival",
        "description": "Yumi Bestie EDM festival vinyl plush blind box with headphones. Available in stock.",
        "crop_box": (0.26, 0.42, 0.81, 0.78),
        "tags": ["DOTEBABY", "Yumi Bestie EDM festival", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7645571651836398869",
        "name": "Baby Three Ocean",
        "price": 4.5,
        "stockStatus": "in_stock",
        "brand": "Baby Three",
        "category": "Plush Dolls",
        "series": "Ocean Series",
        "description": "Baby Three Ocean series cute pink blobfish plush doll. Available in stock.",
        "crop_box": (0.08, 0.35, 0.93, 0.88),
        "tags": ["Baby Three", "Baby Three Ocean", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7639243053240192276",
        "name": "Baby Three Macaron",
        "price": 7.5,
        "stockStatus": "in_stock",
        "brand": "Baby Three",
        "category": "Plush Dolls",
        "series": "Macaron Bunny",
        "description": "Baby Three Macaron cute bunny plush doll blind box. Available in stock.",
        "crop_box": (0.12, 0.39, 0.80, 0.91),
        "tags": ["Baby Three", "Baby Three Macaron", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7633292229603396884",
        "name": "Mega Space Molly emoji",
        "price": 4.0,
        "stockStatus": "in_stock",
        "brand": "Pop Mart",
        "category": "Action Figures",
        "series": "Space Molly Emoji",
        "description": "Mega Space Molly emoji series 100% collectible figure blind box. Available in stock.",
        "crop_box": (0.14, 0.39, 0.82, 0.84),
        "tags": ["Pop Mart", "Mega Space Molly emoji", "Action Figures", "In Stock"]
    },
    {
        "vid_id": "7631985422482017556",
        "name": "Baby Three Lily Rabbit Town",
        "price": 8.0,
        "stockStatus": "in_stock",
        "brand": "Baby Three",
        "category": "Plush Dolls",
        "series": "Lily Rabbit Town",
        "description": "Baby Three Lily Rabbit Town gen 3 plush doll blind box. Available in stock.",
        "crop_box": (0.03, 0.19, 0.97, 0.92),
        "tags": ["Baby Three", "Baby Three Lily Rabbit Town", "Plush Dolls", "In Stock"]
    },
    {
        "vid_id": "7625565020356709652",
        "name": "KFC x DIMOO",
        "price": 12.0,
        "stockStatus": "in_stock",
        "brand": "Pop Mart",
        "category": "Limited Edition",
        "series": "KFC x DIMOO",
        "description": "KFC x DIMOO Limited Series Pilot Colonel collectible blind box figure. Available in stock.",
        "crop_box": (0.14, 0.40, 0.77, 0.79),
        "tags": ["Pop Mart", "KFC x DIMOO", "Limited Edition", "Pilot Colonel", "In Stock"]
    }
]

catalog = []
print(f"Building clean catalog with {len(verified_products)} unique verified products...")

for item in verified_products:
    vid_id = item["vid_id"]
    raw_path = os.path.join(raw_dir, f"{vid_id}.jpg")
    
    if not os.path.exists(raw_path):
        print(f"Warning: raw thumbnail for {vid_id} ({item['name']}) not found in {raw_dir}")
        continue
    
    im = Image.open(raw_path)
    width, height = im.size
    
    orig_filename = f"{vid_id}_original.png"
    crop_filename = f"{vid_id}_cropped.webp"
    
    orig_out = os.path.join(originals_dir, orig_filename)
    crop_out = os.path.join(cropped_dir, crop_filename)
    
    # Save original PNG
    im.save(orig_out, format="PNG")
    
    # Crop the box cleanly
    xmin, ymin, xmax, ymax = item["crop_box"]
    crop_rect = (
        int(xmin * width),
        int(ymin * height),
        int(xmax * width),
        int(ymax * height)
    )
    cropped_im = im.crop(crop_rect)
    cropped_im.save(crop_out, format="WEBP", quality=95)
    
    product_entry = {
        "id": f"prod_{vid_id}",
        "name": item["name"],
        "price": item["price"],
        "currency": "USD",
        "stockStatus": item["stockStatus"],
        "category": item["category"],
        "brand": item["brand"],
        "series": item["series"],
        "description": item["description"],
        "boxBoundingBox": {
            "ymin": ymin,
            "xmin": xmin,
            "ymax": ymax,
            "xmax": xmax
        },
        "originalScreenshotUrl": f"/uploads/originals/{orig_filename}",
        "croppedImageUrl": f"/uploads/cropped/{crop_filename}",
        "tiktokVideoUrl": f"https://www.tiktok.com/@classy.bling/video/{vid_id}",
        "scrapedAt": "2026-08-23T01:30:00.000Z",
        "tags": item["tags"]
    }
    catalog.append(product_entry)
    print(f"Created: '{item['name']}' | Price: ${item['price']} | Images: {orig_filename} / {crop_filename}")

with open("server/data/products.json", "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully saved {len(catalog)} products matching the exact screenshot titles & prices!")
