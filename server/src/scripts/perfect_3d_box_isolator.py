import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

originals_dir = "server/uploads/originals"
cropped_dir = "server/uploads/cropped"
os.makedirs(cropped_dir, exist_ok=True)

def isolate_3d_box(vid_id, poly_pts_norm, bg_color=(250, 248, 245)):
    orig_path = os.path.join(originals_dir, f"{vid_id}_original.png")
    out_path = os.path.join(cropped_dir, f"{vid_id}_cropped.webp")
    if not os.path.exists(orig_path):
        return

    img_bgr = cv2.imread(orig_path)
    h, w = img_bgr.shape[:2]

    # Convert polygon points to pixel coordinates
    pts = np.array([[int(pt[0] * w), int(pt[1] * h)] for pt in poly_pts_norm], dtype=np.int32)

    # Create binary mask for the 3D box
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(mask, [pts], 255)

    # Inpaint any fingers overlapping inside the box boundaries
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    lower_skin = np.array([0, 25, 75], dtype=np.uint8)
    upper_skin = np.array([24, 255, 255], dtype=np.uint8)
    skin = cv2.inRange(hsv, lower_skin, upper_skin)
    
    # Restrict skin mask to within the box mask
    inside_skin = cv2.bitwise_and(skin, mask)
    
    # Inpaint overlapping fingers inside the box
    if cv2.countNonZero(inside_skin) > 0:
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        inside_skin_dilated = cv2.dilate(inside_skin, kernel, iterations=2)
        cleaned_bgr = cv2.inpaint(img_bgr, inside_skin_dilated, 9, cv2.INPAINT_TELEA)
    else:
        cleaned_bgr = img_bgr

    # Convert to RGBA
    cleaned_rgb = cv2.cvtColor(cleaned_bgr, cv2.COLOR_BGR2RGB)
    box_rgba = np.dstack((cleaned_rgb, mask))

    # Bounding rect of the box
    x, y, bw, bh = cv2.boundingRect(pts)
    box_cropped = box_rgba[y:y+bh, x:x+bw]

    box_pil = Image.fromarray(box_cropped)

    # Create clean studio background
    canvas_dim = max(bw, bh) + 120
    canvas = Image.new("RGBA", (canvas_dim, canvas_dim), bg_color + (255,))
    
    # Draw soft ambient shadow beneath
    shadow_layer = Image.new("RGBA", (canvas_dim, canvas_dim), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)
    
    bx = (canvas_dim - bw) // 2
    by = (canvas_dim - bh) // 2
    
    sdraw.ellipse([bx - 10, by + bh - 20, bx + bw + 10, by + bh + 30], fill=(0, 0, 0, 80))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))
    
    canvas = Image.alpha_composite(canvas, shadow_layer)
    canvas.paste(box_pil, (bx, by), box_pil)

    # Save as WebP
    canvas.convert("RGB").save(out_path, "WEBP", quality=95)
    print(f"✨ 100% Clean 3D Box Generated: {out_path}")

# Accurate 3D polygonal outlines of each physical box
polygon_specs = {
    # 7660475956859129108 - Baby Three Zodiac
    "7660475956859129108": {
        "poly": [(0.26, 0.38), (0.80, 0.38), (0.82, 0.86), (0.28, 0.86)],
        "bg": (255, 246, 235)
    },
    # 7659642403011284244 - Kurumi Dreamland
    "7659642403011284244": {
        "poly": [(0.29, 0.44), (0.75, 0.44), (0.77, 0.84), (0.33, 0.84)],
        "bg": (245, 238, 255)
    },
    # 7645571651836398869 - Baby Three Ocean
    "7645571651836398869": {
        "poly": [(0.14, 0.38), (0.88, 0.38), (0.86, 0.83), (0.17, 0.83)],
        "bg": (230, 248, 255)
    },
    # 7639243053240192276 - Baby Three Macaron
    "7639243053240192276": {
        "poly": [(0.16, 0.41), (0.76, 0.41), (0.78, 0.88), (0.21, 0.88)],
        "bg": (255, 250, 240)
    },
    # 7633292229603396884 - Mega Space Molly emoji (Orange 3D box)
    "7633292229603396884": {
        "poly": [
            (0.18, 0.47), (0.57, 0.39), (0.68, 0.52), (0.79, 0.70), 
            (0.48, 0.82), (0.26, 0.83), (0.25, 0.65)
        ],
        "bg": (255, 242, 230)
    },
    # 7631985422482017556 - Baby Three Lily Rabbit Town Gen 3
    "7631985422482017556": {
        "poly": [(0.11, 0.22), (0.92, 0.22), (0.90, 0.88), (0.16, 0.88)],
        "bg": (238, 238, 255)
    },
    # 7625565020356709652 - KFC x DIMOO (Red/White 3D box)
    "7625565020356709652": {
        "poly": [
            (0.19, 0.48), (0.42, 0.40), (0.59, 0.41), (0.75, 0.64),
            (0.48, 0.77), (0.24, 0.63)
        ],
        "bg": (255, 240, 240)
    }
}

for vid_id, config in polygon_specs.items():
    isolate_3d_box(vid_id, config["poly"], config["bg"])

print("All 3D boxes isolated and cleaned without hands!")
