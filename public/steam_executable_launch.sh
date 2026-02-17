#!/bin/sh

if [ $# -eq 0 ]; then
    echo "Error: xdg-open arguments must be provided" >&2
    exit 1
fi

echo "Executing: /usr/bin/xdg-open $@" >&1

exec xdg-open "$@"
