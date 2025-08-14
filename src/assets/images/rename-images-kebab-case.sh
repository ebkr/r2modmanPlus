#!/bin/bash

source "$(dirname "$0")/kebab-case-utils.sh"

target_dir="game_selection"

for f in "$target_dir"/*.jpg "$target_dir"/*.jpeg "$target_dir"/*.png "$target_dir"/*.webp; do
    [ -f "$f" ] || continue

    filename=$(basename "$f")
    base="${filename%.*}"
    ext="${filename##*.}"

    kebab=$(convert_to_kebab_case "$base")

    if [[ "$filename" != "${kebab}.${ext,,}" ]]; then
        mv -- "$f" "${target_dir}/${kebab}.${ext,,}"
        echo "Successfully renamed '$filename' → '${kebab}.${ext,,}'"
    else
        echo "No change needed for '$filename'"
    fi
done
