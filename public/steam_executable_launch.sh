#!/bin/sh

# Required for Steam
export DISPLAY
export XAUTHORITY

# Game relevant
export WINEDLLOVERRIDES
export STEAM_RUNTIME

if [ $# -eq 0 ]; then
    echo "Error: flatpak-spawn arguments must be provided" >&2
    exit 1
fi

echo "Executing: /usr/bin/flatpak-spawn $@" >&1

exec flatpak-spawn "$@"
