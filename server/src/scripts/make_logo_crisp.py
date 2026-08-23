import os
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

src_path = "C:/Users/MSI/.gemini/antigravity-ide/brain/6408723b-173c-4551-a228-4f6f73c8f5e1/.user_uploaded/media_1787480577431.jpg"
img = Image.open(src_path)

# Let's inspect dimensions: (1024, 1024)
# Crop tightly around the stars, squiggles and text
# The content is in the center roughly [100, 100, 924, 924]
w, h = img.size

# Let's crop tightly to the content
crop_box = (int(w * 0.08), int(h * 0.10), int(w * 0.92), int(h * 0.90))
cropped = img.crop(crop_box)

# Resize to high-res 512x512
resized = cropped.resize((512, 512), Image.Resampling.LANCZOS)

# Enhance contrast and sharpness slightly for ultra crisp visibility
enhancer = ImageEnhance.Sharpness(resized)
sharp = enhancer.enhance(1.8)

contrast = ImageEnhance.Contrast(sharp)
crisp = contrast.enhance(1.1)

# Save to public and assets
out_paths = [
    "client/public/logo.png",
    "client/public/logo_crisp.png",
    "client/src/assets/logo.png"
]

for p in out_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    crisp.save(p, "PNG", quality=100)
    print(f"Saved sharp logo to {p}")

