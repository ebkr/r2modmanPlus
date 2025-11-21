#!/bin/sh

STEAM_EXECUTABLE=""

i=0; max=$#
while [ $i -lt $max ]; do
    case $1 in
        --steam-executable)
            if [ -n "$2" ]; then
                STEAM_EXECUTABLE="$2"
                shift
                i=$((i+1))
            else
                echo "The --steam-executable argument must be provided"
                exit 1
            fi
        ;;
        *)
            set -- "$@" "$1"
        ;;
    esac
    shift
    i=$((i+1))
done

exec "$STEAM_EXECUTABLE" "$@"
