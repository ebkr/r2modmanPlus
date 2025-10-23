# Scripts Documentation

This directory contains utility scripts for managing images used in the game selection screen in the r2modman.

## Target Directory

All scripts operate on the `../public/images/game_selection/` directory, which contains the game selection images used in the mod manager.

## Scripts Overview

### 1. `validate-image-names.sh`
Validates that all game selection images follow the correct naming convention.

**Usage:**
```bash
./validate-image-names.sh
```

**What it checks:**
- All files must have `.webp` extension
- Base filenames must be in kebab-case format (lowercase letters, numbers, hyphens only)
- Reports any files that don't meet the requirements
- Exits with error code 1 if validation fails

**Expected format:** `kebab-case.webp`

### 2. `convert-to-webp.sh`
Optimizes image files by converting JPG, JPEG, and PNG images to WebP format with 90% quality for better compression and performance..

**Usage:**
```bash
./convert-to-webp.sh
```

**Requirements:**
- Google WebP tools must be installed
- Install with: `choco install webp` (Windows) or `brew install webp` (macOS)

**What it does:**
- Converts all `.jpg`, `.jpeg`, and `.png` files in `../public/images/game_selection/`
- Uses 90% quality for optimal balance between file size and image quality
- Deletes original files after successful conversion
- Reports success/failure for each file

### 3. `rename-images-kebab-case.sh`
Renames game selection images to follow kebab-case naming convention.

**Usage:**
```bash
./rename-images-kebab-case.sh
```

**What it does:**
- Processes all image files in `../public/images/game_selection/`
- Converts filenames to kebab-case format
- Handles various input formats:
  - `AmongUs.png` → `among-us.png`
  - `Hades2.jpg` → `hades-2.jpg`
  - `20MinutesTillDawn.png` → `20-minutes-till-dawn.png`
  - `TCGCardShopSimulator.webp` → `tcg-card-shop-simulator.webp`
- Preserves all-caps names (e.g., `H3VR` stays as `h3vr`)
- Already kebab-case names are left unchanged


## Workflow

When a new game selection image is added to `../public/images/game_selection/`, the validation script (`./validate-image-names.sh`) should be ran. If the validation doesn't pass you can run renaming script (`./rename-images-kebab-case.sh`) or WebP conversion script (`./convert-to-webp.sh`) based on what's wrong with the image file:

## Error Handling

- Scripts will exit with code `1` if they encounter issues
- Missing dependencies (like `cwebp`) will be reported with installation instructions
- Validation script provides details on issues with formatting