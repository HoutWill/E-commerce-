import os
import shutil
import json
import glob
import sys

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r"C:\Users\MSI\.gemini\antigravity-ide\brain\4f6f7ae8-c890-42a0-bae2-3f21b0824536"
public_3d_dir = r"c:\Users\MSI\Desktop\Classybling\client\public\3d_boxes"
cropped_dir = r"c:\Users\MSI\Desktop\Classybling\server\uploads\cropped"

os.makedirs(public_3d_dir, exist_ok=True)
os.makedirs(cropped_dir, exist_ok=True)

def find_latest_image(prefix):
    pattern = os.path.join(brain_dir, f"{prefix}*.*")
    files = glob.glob(pattern)
    if not files:
        return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

ai_image_mappings = {
    "zootopia_fox": ("zootopia_fox_box", "zootopia_fox_box_ai.jpg"),
    "yumi_dream": ("yumi_dream_box", "yumi_dream_box_ai.jpg"),
    "baby_three_bunny": ("baby_three_bunny_box", "baby_three_bunny_box_ai.jpg"),
    "mini_animal": ("mini_animal_box", "mini_animal_box_ai.jpg"),
    "kfc_dimoo": ("kfc_dimoo_box", "kfc_dimoo_box_ai.jpg"),
    "fantasy_world": ("fantasy_world_box", "fantasy_world_box_ai.jpg"),
    "samuel_ocean": ("samuel_ocean_box", "samuel_ocean_box_ai.jpg"),
    "skullpanda_sound": ("skullpanda_sound_box", "skullpanda_sound_box_ai.jpg"),
    "labubu_macaron": ("labubu_macaron_box", "labubu_macaron_box_ai.jpg"),
    "crybaby_concert": ("crybaby_concert_box", "crybaby_concert_box_ai.jpg"),
    "kuromi_dreamland": ("kuromi_dreamland_box", "kuromi_dreamland_box_ai.jpg"),
    "hirono_mischief": ("hirono_mischief_box", "hirono_mischief_box_ai.jpg"),
    "cinnamoroll_bakery": ("cinnamoroll_bakery_box", "cinnamoroll_bakery_box_ai.jpg")
}

copied_files = {}
for key, (prefix, target_name) in ai_image_mappings.items():
    src = find_latest_image(prefix)
    if src:
        dst_pub = os.path.join(public_3d_dir, target_name)
        dst_crop = os.path.join(cropped_dir, target_name)
        shutil.copy2(src, dst_pub)
        shutil.copy2(src, dst_crop)
        copied_files[key] = f"/3d_boxes/{target_name}"
        print(f"Copied {src} -> {dst_pub}")
    else:
        print(f"Warning: could not find {prefix}")

# Comprehensive High-Definition 25-Product Store Catalog
full_master_catalog = [
    {
        "id": "prod_labubu_macaron",
        "name": "Pop Mart Labubu Tasty Macarons",
        "price": 19.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Pop Mart",
        "series": "The Monsters Tasty Macarons",
        "description": "Viral Pop Mart Labubu The Monsters Tasty Macarons Series fluffy vinyl plush blind box with strawberry macaron.",
        "croppedImageUrl": copied_files.get("labubu_macaron", "/3d_boxes/labubu_macaron_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("labubu_macaron", "/3d_boxes/labubu_macaron_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:00:00.000Z",
        "tags": ["Pop Mart", "Labubu", "Plush Dolls", "Trending", "In Stock"]
    },
    {
        "id": "prod_crybaby_concert",
        "name": "Pop Mart CRYBABY Sunset Concert",
        "price": 16.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Sunset Concert Series",
        "description": "Authentic Pop Mart CRYBABY Sunset Concert collectible blind box figure with guitar and star tears.",
        "croppedImageUrl": copied_files.get("crybaby_concert", "/3d_boxes/crybaby_concert_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("crybaby_concert", "/3d_boxes/crybaby_concert_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:05:00.000Z",
        "tags": ["Pop Mart", "CRYBABY", "Blind Box", "Limited", "In Stock"]
    },
    {
        "id": "prod_kuromi_dreamland",
        "name": "Sanrio Kuromi Dreamland Starry",
        "price": 12.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Sanrio",
        "series": "Kuromi Starry Series",
        "description": "Sanrio licensed Kuromi Dreamland Starry Series collectible blind box with star wand on lavender podium.",
        "croppedImageUrl": copied_files.get("kuromi_dreamland", "/3d_boxes/kuromi_dreamland_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("kuromi_dreamland", "/3d_boxes/kuromi_dreamland_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:10:00.000Z",
        "tags": ["Sanrio", "Kuromi", "Dreamland", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_hirono_mischief",
        "name": "Pop Mart Hirono Little Mischief",
        "price": 15.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Hirono Little Mischief",
        "description": "Iconic Pop Mart Hirono Little Mischief Series art toy collectible blind box on concrete studio pedestal.",
        "croppedImageUrl": copied_files.get("hirono_mischief", "/3d_boxes/hirono_mischief_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("hirono_mischief", "/3d_boxes/hirono_mischief_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:15:00.000Z",
        "tags": ["Pop Mart", "Hirono", "Streetwear", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_cinnamoroll_bakery",
        "name": "Sanrio Cinnamoroll Cloud Bakery",
        "price": 13.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Sanrio",
        "series": "Cloud Bakery Series",
        "description": "Sanrio licensed Cinnamoroll Cloud Bakery Series cute puppy chef blind box with golden cinnamon roll.",
        "croppedImageUrl": copied_files.get("cinnamoroll_bakery", "/3d_boxes/cinnamoroll_bakery_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("cinnamoroll_bakery", "/3d_boxes/cinnamoroll_bakery_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:20:00.000Z",
        "tags": ["Sanrio", "Cinnamoroll", "Bakery", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_molly_watermelon",
        "name": "Molly Fruit Party Watermelon",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Fruit Party Series",
        "description": "Authentic Pop Mart Molly Fruit Party Watermelon collectible blind box figure on studio display podium.",
        "croppedImageUrl": "/3d_boxes/molly_fruit_watermelon_box_1787473215089.jpg",
        "originalScreenshotUrl": "/3d_boxes/molly_fruit_watermelon_box_1787473215089.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:25:00.000Z",
        "tags": ["Pop Mart", "Molly", "Watermelon", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_nommi_pinky",
        "name": "Nommi Pinky Energy",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Nommi",
        "series": "Pinky Energy Series",
        "description": "Authentic Nommi Pinky Energy plush doll designer art toy collectible by SURE FUN x TOP TOY.",
        "croppedImageUrl": "/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg",
        "originalScreenshotUrl": "/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:30:00.000Z",
        "tags": ["Nommi", "Pinky Energy", "Plush Dolls", "Popular", "In Stock"]
    },
    {
        "id": "prod_stitch_sleep",
        "name": "Disney Stitch Sleepy Dreamland",
        "price": 13.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Disney",
        "series": "Stitch Dreamland Series",
        "description": "Disney licensed Stitch Sleepy Dreamland blind box figure with pajamas and star pillow on studio podium.",
        "croppedImageUrl": "/3d_boxes/stitch_sleep_box_1787473179186.jpg",
        "originalScreenshotUrl": "/3d_boxes/stitch_sleep_box_1787473179186.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:35:00.000Z",
        "tags": ["Disney", "Stitch", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_zootopia_fox",
        "name": "Disney Zootopia Nick Wilde",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Disney",
        "series": "Zootopia Series 1",
        "description": "Official Disney Zootopia Nick Wilde collectible blind box figure on minimalist studio podium.",
        "croppedImageUrl": copied_files.get("zootopia_fox", "/3d_boxes/zootopia_fox_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("zootopia_fox", "/3d_boxes/zootopia_fox_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:40:00.000Z",
        "tags": ["Disney", "Zootopia", "Nick Wilde", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_yumi_dream",
        "name": "YuMi Dreamy Girl Collection",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "DOTEBABY",
        "series": "Dreamy Girl Vol. 1",
        "description": "YuMi Dreamy Girl art toy collection blind box featuring anime twintail figure on pastel pink studio pedestal.",
        "croppedImageUrl": copied_files.get("yumi_dream", "/3d_boxes/yumi_dream_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("yumi_dream", "/3d_boxes/yumi_dream_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:45:00.000Z",
        "tags": ["DOTEBABY", "YuMi", "Dreamy Girl", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_baby_three_bunny",
        "name": "Baby Three 3-Year-Old Cutie",
        "price": 12.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "3-Year-Old Cutie Series",
        "description": "Authentic Baby Three 3-year-old cutie plush doll blind box with soft bunny hood on studio podium.",
        "croppedImageUrl": copied_files.get("baby_three_bunny", "/3d_boxes/baby_three_bunny_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("baby_three_bunny", "/3d_boxes/baby_three_bunny_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:50:00.000Z",
        "tags": ["Baby Three", "Plush Dolls", "Cute Bunny", "In Stock"]
    },
    {
        "id": "prod_mini_animal",
        "name": "Baby Three Mini Animal Party",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Mini Animal Party Series",
        "description": "Baby Three Mini Animal Party collectible blind box with panda onesie character on lavender studio pedestal.",
        "croppedImageUrl": copied_files.get("mini_animal", "/3d_boxes/mini_animal_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("mini_animal", "/3d_boxes/mini_animal_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T14:55:00.000Z",
        "tags": ["Baby Three", "Mini Animal", "Panda", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_kfc_dimoo",
        "name": "Pop Mart KFC x DIMOO Aviator",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Limited Edition",
        "brand": "Pop Mart",
        "series": "KFC x DIMOO Aviator Series",
        "description": "Limited Edition Pop Mart KFC x DIMOO Aviator Series pilot colonel collectible blind box on white studio display.",
        "croppedImageUrl": copied_files.get("kfc_dimoo", "/3d_boxes/kfc_dimoo_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("kfc_dimoo", "/3d_boxes/kfc_dimoo_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:00:00.000Z",
        "tags": ["Pop Mart", "DIMOO", "KFC", "Limited Edition", "In Stock"]
    },
    {
        "id": "prod_fantasy_world",
        "name": "Fantasy World Pastel Plush Bunny",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Fantasy World Series 1",
        "description": "Dreamy Fantasy World pastel plush fairy bunny blind box with wings on studio pedestal.",
        "croppedImageUrl": copied_files.get("fantasy_world", "/3d_boxes/fantasy_world_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("fantasy_world", "/3d_boxes/fantasy_world_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:05:00.000Z",
        "tags": ["Baby Three", "Fantasy World", "Pastel", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_samuel_ocean",
        "name": "Samuel Ocean Series Shark Hood",
        "price": 13.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "MEI YI YOU ART TOY",
        "series": "Samuel Ocean Series",
        "description": "Samuel Ocean Series collectible blind box with plush shark hoodie doll on cyan studio podium.",
        "croppedImageUrl": copied_files.get("samuel_ocean", "/3d_boxes/samuel_ocean_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("samuel_ocean", "/3d_boxes/samuel_ocean_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:10:00.000Z",
        "tags": ["MEI YI YOU", "Samuel Ocean", "Shark", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_skullpanda_sound",
        "name": "SKULLPANDA The Sound Series",
        "price": 15.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "The Sound Series",
        "description": "Pop Mart SKULLPANDA The Sound Series designer art toy collectible blind box on dark stone pedestal.",
        "croppedImageUrl": copied_files.get("skullpanda_sound", "/3d_boxes/skullpanda_sound_box_ai.jpg"),
        "originalScreenshotUrl": copied_files.get("skullpanda_sound", "/3d_boxes/skullpanda_sound_box_ai.jpg"),
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:15:00.000Z",
        "tags": ["Pop Mart", "SKULLPANDA", "The Sound", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_space_molly",
        "name": "Mega Space Molly V2 100%",
        "price": 18.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Action Figures",
        "brand": "Pop Mart",
        "series": "Mega Space Molly Series 2",
        "description": "Iconic Pop Mart MEGA Space Molly Series 02 blind box with glossy astronaut suit on dark studio podium.",
        "croppedImageUrl": "/3d_boxes/mega_space_molly_box_1787473086799.jpg",
        "originalScreenshotUrl": "/3d_boxes/mega_space_molly_box_1787473086799.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:20:00.000Z",
        "tags": ["Pop Mart", "Space Molly", "Action Figures", "Limited", "In Stock"]
    },
    {
        "id": "prod_baby_three_weirdly",
        "name": "Baby Three Weirdly Adorable Mini",
        "price": 12.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Weirdly Adorable",
        "description": "Baby Three Weirdly Adorable mini plush doll on warm studio floor.",
        "croppedImageUrl": "/3d_boxes/baby_three_weirdly_adorable_box_1787473293359.jpg",
        "originalScreenshotUrl": "/3d_boxes/baby_three_weirdly_adorable_box_1787473293359.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:25:00.000Z",
        "tags": ["Baby Three", "Weirdly Adorable", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_molly_baking",
        "name": "Molly Baking Time Carb Lover",
        "price": 14.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Molly Baking Time",
        "description": "Molly Baking Time Carb-Lover series collectible box with chef hat.",
        "croppedImageUrl": "/3d_boxes/molly_baking_time_box_1787473509030.jpg",
        "originalScreenshotUrl": "/3d_boxes/molly_baking_time_box_1787473509030.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:30:00.000Z",
        "tags": ["Pop Mart", "Molly", "Baking Time", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_baby_three_lolita",
        "name": "Baby Three Lolita's Dream",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Lolita's Dream",
        "description": "Baby Three Lolita's Dream mini plush doll blind box on studio table.",
        "croppedImageUrl": "/3d_boxes/baby_three_lolita_dream_box_1787473539024.jpg",
        "originalScreenshotUrl": "/3d_boxes/baby_three_lolita_dream_box_1787473539024.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:35:00.000Z",
        "tags": ["Baby Three", "Lolita Dream", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_baby_molly_three",
        "name": "Baby Molly When I Was Three",
        "price": 15.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Pop Mart",
        "series": "Baby Molly",
        "description": "Baby Molly When I Was Three original POP MART collectible blind box.",
        "croppedImageUrl": "/3d_boxes/baby_molly_baby_tabby_box_1787473570037.jpg",
        "originalScreenshotUrl": "/3d_boxes/baby_molly_baby_tabby_box_1787473570037.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:40:00.000Z",
        "tags": ["Pop Mart", "Baby Molly", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_yumi_edm",
        "name": "YuMi Bestie EDM Festival",
        "price": 13.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "DOTEBABY",
        "series": "YuMi EDM Festival",
        "description": "Yumi Bestie EDM festival vinyl plush blind box with headphones.",
        "croppedImageUrl": "/3d_boxes/yumi_edm_festival_box_1787473599903.jpg",
        "originalScreenshotUrl": "/3d_boxes/yumi_edm_festival_box_1787473599903.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:45:00.000Z",
        "tags": ["DOTEBABY", "YuMi", "EDM Festival", "Plush Dolls", "In Stock"]
    },
    {
        "id": "prod_fox_bunny",
        "name": "Fox & Bunny Trick or Treat",
        "price": 14.00,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Blind Box",
        "brand": "Fox & Bunny",
        "series": "Halloween Series",
        "description": "Fox & Bunny Halloween trick or treat special edition blind box.",
        "croppedImageUrl": "/3d_boxes/fox_bunny_trick_treat_box_1787473734642.jpg",
        "originalScreenshotUrl": "/3d_boxes/fox_bunny_trick_treat_box_1787473734642.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:50:00.000Z",
        "tags": ["Fox & Bunny", "Halloween", "Blind Box", "In Stock"]
    },
    {
        "id": "prod_baby_three_zodiac",
        "name": "Baby Three Zodiac 12 Stars",
        "price": 14.50,
        "currency": "USD",
        "stockStatus": "In Stock",
        "category": "Plush Dolls",
        "brand": "Baby Three",
        "series": "Zodiac Star Signs",
        "description": "Baby Three Constellation Zodiac plush doll keychain series on studio stand.",
        "croppedImageUrl": "/3d_boxes/baby_three_zodiac_studio_box_1787476804515.jpg",
        "originalScreenshotUrl": "/3d_boxes/baby_three_zodiac_studio_box_1787476804515.jpg",
        "tiktokVideoUrl": "https://www.tiktok.com/@classy.bling",
        "contactTelegram": "https://t.me/+85592917831",
        "contactFacebook": "https://facebook.com",
        "createdAt": "2026-08-25T15:55:00.000Z",
        "tags": ["Baby Three", "Zodiac", "Plush Dolls", "In Stock"]
    }
]

# Write to server/data/products.json
with open("server/data/products.json", "w", encoding="utf-8") as f:
    json.dump(full_master_catalog, f, indent=2, ensure_ascii=False)

# Sync to client/src/data/initialProducts.ts
categories = sorted(list(set(p.get("category", "Blind Box") for p in full_master_catalog)))
if "All" not in categories:
    categories.insert(0, "All")
brands = sorted(list(set(p.get("brand", "Pop Mart") for p in full_master_catalog)))

ts_code = f'''import {{ Product }} from '../types';

export const INITIAL_PRODUCTS: Product[] = {json.dumps(full_master_catalog, indent=2, ensure_ascii=False)};

export const INITIAL_CATEGORIES = {json.dumps(categories, indent=2, ensure_ascii=False)};
export const INITIAL_BRANDS = {json.dumps(brands, indent=2, ensure_ascii=False)};
'''

with open("client/src/data/initialProducts.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print(f"✨ Successfully integrated {len(full_master_catalog)} AI-generated master studio products into catalog!")
