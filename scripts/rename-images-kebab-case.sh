#!/bin/bash

convert_to_kebab_case() {
    local base="$1"
    local kebab=""

    # Check if base name is all caps (only uppercase letters and numbers)
    if [[ "$base" =~ ^[[:upper:][:digit:]]+$ ]]; then
        kebab=$(echo "$base" | tr '[:upper:]' '[:lower:]')
    # Check if the name is already in kebab-case
    elif [[ "$base" =~ ^[[:lower:][:digit:]]+(-[[:lower:][:digit:]]+)*$ ]]; then
        kebab="$base" # Name is already in kebab-case
    else
        kebab=$(echo "$base" | sed 's/[_-]/ /g') # Replace underscores and other separators with spaces

        # Split numbers and letters ("20MinutesTillDawn" -> "20 Minutes Till Dawn" and "Hades2" -> "Hades 2")
        # Skip for all-caps strings (like "H3VR")
        if [[ ! "$base" =~ ^[[:upper:][:digit:]]+$ ]]; then
            kebab=$(echo "$kebab" | sed 's/\([0-9]\)\([A-Za-z]\)/\1 \2/g; s/\([A-Za-z]\)\([0-9]\)/\1 \2/g')
        fi
        
        kebab=$(echo "$kebab" | sed 's/\([a-z]\)\([A-Z]\)/\1 \2/g') # Split uppercase after lowercase ("AmongUs" -> "Among Us")
        
        kebab=$(echo "$kebab" | sed 's/\([A-Z]\)\([A-Z][a-z]\)/\1 \2/g') # Uppercases letters followed by an uppercase letter should stay as a group ("TCGCardShopSimulator" -> "TCG Card Shop Simulator")
        
        kebab=$(echo "$kebab" | sed 's/[^a-zA-Z0-9]\+/-/g') # Replace non-alphanumeric (spaces, etc.) with hyphens
        
        kebab=$(echo "$kebab" | tr '[:upper:]' '[:lower:]') # Convert to lowercase
        
        kebab=$(echo "$kebab" | sed 's/^-//; s/-$//; s/--*/-/g') # Remove extra hyphens
    fi

    echo "$kebab"
}

target_dir="../public/images/game_selection"

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
