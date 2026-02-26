#!/usr/bin/env python3
"""
Extract facility images from Static_Lists_businesses_filled.numbers by row.
Each image is taken from the "Photo to Use" column and saved with the correct business name.
Run: python3 scripts/extract-facility-images-from-numbers.py
"""
import os
import sys

# Default path - adjust if needed
NUMBERS_PATH = os.path.expanduser(
    os.environ.get("NUMBERS_FILE", "/Users/larisacavallaro/Desktop/Static_Lists_businesses_filled.numbers")
)
OUT_DIR = os.path.join(os.path.dirname(__file__), "facility-images-by-row")


def main():
    try:
        from numbers_parser import Document
    except ImportError:
        print("Install numbers-parser: pip install numbers-parser")
        sys.exit(1)

    if not os.path.exists(NUMBERS_PATH):
        print(f"Numbers file not found: {NUMBERS_PATH}")
        sys.exit(1)

    os.makedirs(OUT_DIR, exist_ok=True)
    doc = Document(NUMBERS_PATH)
    t = doc.sheets[0].tables[0]

    for row in range(1, t.num_rows):
        name_cell = t.cell(row, 0)
        photo_cell = t.cell(row, 8)
        name = str(name_cell.value).strip() if name_cell.value else ""
        if not name:
            continue
        try:
            img_data = photo_cell.image_data
            if img_data:
                safe_name = "".join(c if c.isalnum() or c in " -_" else "-" for c in name)[:50]
                fpath = os.path.join(OUT_DIR, f"row{row:02d}_{safe_name}.png")
                with open(fpath, "wb") as f:
                    f.write(img_data)
                print(f"Row {row}: {name[:40]} -> {len(img_data)} bytes")
            else:
                print(f"Row {row}: {name[:40]} -> no image")
        except Exception as e:
            print(f"Row {row}: {name[:40]} -> ERROR: {e}")

    print(f"\nSaved to {OUT_DIR}/")


if __name__ == "__main__":
    main()
