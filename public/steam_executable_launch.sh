#!/bin/sh

if [ $# -eq 0 ]; then
    echo "Error: Steam app launch arguments must be provided" >&2
    exit 1
fi

echo "Executing: /usr/bin/flatpak-spawn --host steam -applaunch $@" >&1

exec flatpak-spawn --host steam -applaunch "$@"
