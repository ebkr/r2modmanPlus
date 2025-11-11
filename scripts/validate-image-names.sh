#!/bin/bash

target_dir="../public/images/game_selection"
total_files=0
error_files=()

echo "Validating image names and extensions in '$target_dir' directory..."
echo "Expected format: kebab-case.webp"
echo "---"

# Check if directory exists
if [[ ! -d "$target_dir" ]]; then
    echo "Error: Directory '$target_dir' not found!"
    exit 1
fi

# Process all files
for f in "$target_dir"/*; do
    [ -f "$f" ] || continue
    
    total_files=$((total_files + 1))
    filename=$(basename "$f")
    base="${filename%.*}"
    ext="${filename##*.}"
    
    # Check if extension is webp
    if [[ "${ext,,}" != "webp" ]]; then
        echo "✗ $filename (wrong extension: ${ext})"
        error_files+=("$filename")
        continue
    fi
    
    # Check if base name is in kebab-case (lowercase letters, numbers, hyphens only)
    if [[ ! "$base" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
        echo "✗ $filename (not kebab-case: $base)"
        error_files+=("$filename")
    fi
done

echo
echo "Validation completed. Checked $total_files files"
if [[ ${#error_files[@]} -gt 0 ]]; then
    echo
    echo "${#error_files[@]} files with formatting issues:"
    for file in "${error_files[@]}"; do
        echo "$file"
    done
    exit 1
else
    echo "✓ No formatting issues found"
    exit 0
fi
