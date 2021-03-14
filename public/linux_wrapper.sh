#!/bin/sh

# Linux wrapper script for r2modman
# Written by Naomi Calabretta (blame her if something does not work)

a="/$0"; a=${a%/*}; a=${a#/}; a=${a:-.}; BASEDIR=$(cd "$a"; pwd -P)

R2PROFILE=""
args=""

while :; do
    case $1 in
        --r2profile)
            if [ -n "$2" ]; then
                R2PROFILE="$2"
                shift
            else
                echo "No --r2profile value specified, skipping!"
                exit
            fi
            ;;
        *)
            if [ -z "$1" ]; then
                break
            fi
            if [ -z "$args" ]; then
                args="$1"
            else
                args="$args $1"
            fi
            ;;
    esac
    shift
done

if [ -z "$R2PROFILE" ]; then
    echo "No --r2profile value specified, skipping!"
    exit
fi

exec "$BASEDIR/profiles/$R2PROFILE/start_game_bepinex.sh" $args
