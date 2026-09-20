import json
import subprocess

def check_latest():
    target_url = 'tiktokuser:MS4wLjABAAAAQntFizUVgF-eJcoJmAEk3f80scmZGXgCVGu_tejpao9s1z7ibN09ymoVlYb69Twj'
    res = subprocess.run([
        'python', '-m', 'yt_dlp',
        '--impersonate', 'chrome',
        '--flat-playlist',
        '--dump-json',
        target_url,
        '--playlist-end', '30'
    ], capture_output=True, text=True, encoding='utf-8')

    print(f"Return code: {res.returncode}")
    if res.stderr:
        print(f"Stderr: {res.stderr[:500]}")
    lines = [l for l in res.stdout.strip().split('\n') if l.strip()]
    print(f"Total video JSON lines fetched: {len(lines)}")
    videos = []
    for i, line in enumerate(lines):
        if not line:
            continue
        try:
            d = json.loads(line)
            thumbs = d.get('thumbnails', [])
            cover = next((t['url'] for t in thumbs if t.get('id') in ('cover', 'originCover')), thumbs[0]['url'] if thumbs else None)
            info = {
                "index": i + 1,
                "id": d.get('id'),
                "date": d.get('upload_date'),
                "duration": d.get('duration'),
                "title": d.get('title', ''),
                "description": d.get('description', ''),
                "cover": cover,
                "url": d.get('webpage_url') or d.get('url') or f"https://www.tiktok.com/@classy.bling/video/{d.get('id')}"
            }
            videos.append(info)
        except Exception as e:
            print(f"Error parsing line {i}: {e}")

    with open('server/src/scripts/latest_tiktok_data.json', 'w', encoding='utf-8') as f:
        json.dump(videos, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(videos)} videos to latest_tiktok_data.json")

if __name__ == '__main__':
    check_latest()
