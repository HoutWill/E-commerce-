import cv2
import numpy as np
from PIL import Image, ImageFilter
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

# Refined tight crops to completely eliminate any remaining fingers / thumb / hand on edges
specs = {
    # 7660475956859129108 - Baby Three Zodiac
    "7660475956859129108": {
        "box": (0.27, 0.38, 0.81, 0.86),  # x1, y1, x2, y2
        "bg_color": (255, 245, 235)
    },
    # 7659642403011284244 - Kuromi Dreamland
    "7659642403011284244": {
        "box": (0.31, 0.44, 0.77, 0.84),
        "bg_color": (245, 240, 255)
    },
    # 7645571651836398869 - Baby Three Ocean
    "7645571651836398869": {
        "box": (0.13, 0.37, 0.88, 0.84),
        "bg_color": (235, 248, 255)
    },
    # 7639243053240192276 - Baby Three Macaron
    "7639243053240192276": {
        "box": (0.16, 0.41, 0.78, 0.89),
        "bg_color": (255, 250, 240)
    },
    # 7633292229603396884 - Mega Space Molly emoji
    "7633292229603396884": {
        "box": (0.18, 0.40, 0.78, 0.81),
        "bg_color": (255, 242, 235)
    },
    # 7631985422482017556 - Baby Three Lily Rabbit Town
    "7631985422482017556": {
        "box": (0.10, 0.21, 0.94, 0.89),
        "bg_color": (238, 238, 255)
    },
    # 7625565020356709652 - KFC x DIMOO
    "7625565020356709652": {
        "box": (0.20, 0.41, 0.74, 0.76),
        "bg_color": (255, 242, 242)
    },
}

for vid_id, config in specs.items():
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    
    if not os.path.exists(orig_path):
        continue

    img = Image.open(orig_path).convert("RGBA")
    w, h = img.size

    x1_norm, y1_norm, x2_norm, y2_norm = config["box"]
    x1, y1, x2, y2 = int(x1_norm * w), int(y1_norm * h), int(x2_norm * w), int(y2_norm * h)

    # Crop tightly to the box only
    cropped = img.crop((x1, y1, x2, y2))
    cw, ch = cropped.size

    # Create a clean studio canvas
    canvas_size = max(cw, ch) + 100
    canvas = Image.new("RGBA", (canvas_size, canvas_size), config["bg_color"] + (255,))

    # Center the box on canvas
    paste_x = (canvas_size - cw) // 2
    paste_y = (canvas_size - ch) // 2

    canvas.paste(cropped, (paste_x, paste_y))

    # Convert to RGB and save as WebP
    final_rgb = canvas.convert("RGB")
    final_rgb.save(out_path, "WEBP", quality=95)
    print(f"✨ Perfect clean box without hand saved: {out_path}")

print("Done processing all clean boxes!")
