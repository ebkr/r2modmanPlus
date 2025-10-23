#!/bin/bash

target_dir="../public/images/game_selection"
quality=90 # 0-100, 100 is best quality, 90 seems to be a good balance

# Check if cwebp is available
if ! command -v cwebp >/dev/null 2>&1; then
    echo "Error: cwebp not found. Please install Google WebP tools (choco install webp)"
    exit 1
fi

echo "Converting images to WebP (quality: $quality)..."
echo "---"

for f in "$target_dir"/*.jpg "$target_dir"/*.jpeg "$target_dir"/*.png; do
    [ -f "$f" ] || continue

    filename=$(basename "$f")
    base="${filename%.*}"
    webp_file="$target_dir/${base}.webp"

    echo "Converting '$filename'..."

    if cwebp -q "$quality" "$f" -o "$webp_file"; then
        echo "  ✓ Done: ${base}.webp"
        rm "$f"
        echo "  🗑️ Deleted original: $filename"
    else
        echo "  ✗ Failed: $filename"
    fi
done

echo "---"
echo "Conversion complete!"
