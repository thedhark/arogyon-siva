import os
from PIL import Image

artifact_dir = r"C:\Users\kanda\.gemini\antigravity-ide\brain\031e53e5-613b-41d8-9beb-f1c38d2df627"

for filename in os.listdir(artifact_dir):
    if filename.startswith("uploaded_media_") and filename.endswith(".img"):
        path = os.path.join(artifact_dir, filename)
        try:
            with Image.open(path) as img:
                print(f"File: {filename}, Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
        except Exception as e:
            print(f"Error opening {filename}: {e}")
