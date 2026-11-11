"""
fetch_doda.py
Downloads key vocabulary files from the Darija Open Dataset (DODa)
repository (CC BY-NC 4.0) into data/raw/
"""

import os
import urllib.request

RAW_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "raw")
os.makedirs(RAW_DIR, exist_ok=True)

BASE_URL = "https://raw.githubusercontent.com/darija-open-dataset/dataset/master"

SYNTACTIC_FILES = ["nouns.csv", "verbs.csv", "adjectives.csv"]
SEMANTIC_FILES = ["food.csv", "clothes.csv", "animals.csv", "humanbody.csv", "emotions.csv"]

def download_file(subfolder: str, filename: str):
    target_path = os.path.join(RAW_DIR, filename)
    if os.path.exists(target_path):
        print(f"[SKIP] {filename} already exists")
        return

    url = f"{BASE_URL}/{subfolder}/{filename}"
    print(f"[FETCH] Downloading {url} -> {target_path}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "9afiya-DataPipeline/1.0"})
        with urllib.request.urlopen(req) as resp, open(target_path, "wb") as out:
            out.write(resp.read())
        print(f"[OK] Downloaded {filename} ({os.path.getsize(target_path)} bytes)")
    except Exception as e:
        print(f"[ERROR] Failed to download {filename}: {e}")

if __name__ == "__main__":
    for f in SYNTACTIC_FILES:
        download_file("syntactic%20categories", f)
    for f in SEMANTIC_FILES:
        download_file("semantic%20categories", f)
