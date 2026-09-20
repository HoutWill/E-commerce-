import cv2
import os

def extract_frames(video_path, output_dir, interval_sec=1.5):
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video: {video_path}, FPS: {fps}, Total Frames: {total_frames}, Duration: {total_frames/fps:.1f}s")

    frame_interval = int(fps * interval_sec)
    frame_idx = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % frame_interval == 0:
            sec = frame_idx / fps
            out_file = os.path.join(output_dir, f"frame_{sec:04.1f}s.jpg")
            cv2.imwrite(out_file, frame)
            saved_count += 1
        frame_idx += 1

    cap.release()
    print(f"Saved {saved_count} frames to {output_dir}")

if __name__ == '__main__':
    extract_frames(
        "server/uploads/claw_machine_investigation/video_7686000918407515412.mp4",
        "server/uploads/claw_machine_investigation/frames_vid1",
        interval_sec=1.0
    )
    extract_frames(
        "server/uploads/claw_machine_investigation/video_7685999910302387476.mp4",
        "server/uploads/claw_machine_investigation/frames_vid2",
        interval_sec=1.5
    )
