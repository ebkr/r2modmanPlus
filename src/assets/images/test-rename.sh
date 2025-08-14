#!/bin/bash

source "$(dirname "$0")/kebab-case-utils.sh"

declare -A test_cases=(
    ["STRAFTAT"]="straftat"
    ["MiSide"]="mi-side"
    ["BackpackHero"]="backpack-hero"
    ["20MinutesTillDawn"]="20-minutes-till-dawn"
    ["Hades2"]="hades-2"
    ["H3VR"]="h3vr"
    ["west-of-loathing"]="west-of-loathing"
)

test_name() {
    local base="$1"
    local expected="${test_cases[$base]}"

    if [[ -z "$expected" ]]; then
        echo "Testing: $base (no expected result defined)"
        return
    fi

    local actual_result=$(convert_to_kebab_case "$base")
    
    if [[ "$actual_result" == "$expected" ]]; then
        echo "  ✓ PASS: '$base' → '$actual_result'"
    else
        echo "  ✗ FAIL: '$base' → '$actual_result' (expected: '$expected')"
    fi
}

test_name "STRAFTAT"
test_name "MiSide"
test_name "BackpackHero"
test_name "20MinutesTillDawn"
test_name "Hades2"
test_name "H3VR"
test_name "west-of-loathing"
