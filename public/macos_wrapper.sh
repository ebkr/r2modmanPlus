#!/bin/sh

# Linux wrapper script for r2modman
# Written by Naomi Calabretta (blame her if something does not work)

a="/$0"; a=${a%/*}; a=${a#/}; a=${a:-.}; BASEDIR=$(cd "$a" || exit; pwd -P)

R2PROFILE=""
R2STARTSERVER=""

i=0; max=$#
while [ $i -lt $max ]; do
    case $1 in
        --r2profile)
            if [ -n "$2" ]; then
                R2PROFILE="$2"
                shift
                i=$((i+1))
            else
                echo "[R2MODMAN LINUX WRAPPER] Warning: --r2profile value is empty!"
            fi
        ;;
        --server)
            R2STARTSERVER="true"
        ;;
        *)
            set -- "$@" "$1"
        ;;
    esac
    shift
    i=$((i+1))
done

if [ -z "$R2PROFILE" ]; then
    echo "[R2MODMAN LINUX WRAPPER] Launching vanilla!"
    exec "$@"
fi

[ -n "$R2STARTSERVER" ] && exec "$BASEDIR/profiles/$R2PROFILE/start_server_bepinex.sh" "$@" || true

if test -f "$BASEDIR/profiles/$R2PROFILE/run_bepinex.sh"; then
    exec "$BASEDIR/profiles/$R2PROFILE/run_bepinex.sh" "$@"
else
   exec "$BASEDIR/profiles/$R2PROFILE/start_game_bepinex.sh" "$@"
fi
