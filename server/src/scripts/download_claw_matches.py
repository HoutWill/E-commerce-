import json
import os
import requests

with open('server/src/scripts/latest_tiktok_data.json', 'r', encoding='utf-8') as f:
    videos = json.load(f)

matches = []
for v in videos:
    text = (v.get('title', '') + ' ' + v.get('description', '')).lower()
    if 'claw' in text or 'machine' in text:
        matches.append(v)

print(f"Found {len(matches)} claw machine videos in latest 30 videos:")
os.makedirs('server/uploads/claw_machine_investigation', exist_ok=True)

for i, m in enumerate(matches):
    print(f"Match #{i+1}: Index {m['index']}, ID: {m['id']}, Date: {m['date']}, Duration: {m['duration']}s")
    print(f"URL: https://www.tiktok.com/@classy.bling/video/{m['id']}")
    # Download the cover
    if m.get('cover'):
        cover_path = f"server/uploads/claw_machine_investigation/cover_{m['id']}.jpg"
        r = requests.get(m['cover'], headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.tiktok.com/'})
        with open(cover_path, 'wb') as img_f:
            img_f.write(r.content)
        print(f"Downloaded cover: {cover_path} ({len(r.content)} bytes)")

with open('server/uploads/claw_machine_investigation/matches.json', 'w', encoding='utf-8') as f:
    json.dump(matches, f, indent=2, ensure_ascii=False)
