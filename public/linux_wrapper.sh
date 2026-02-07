#!/bin/sh

# Linux/MacOS wrapper script for r2modman
# NOTE: The name `linux_wrapper.sh` is kept to avoid breaking existing installs despite this working on Mac too
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
                echo "[R2MODMAN WRAPPER] Warning: --r2profile value is empty!"
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
    echo "[R2MODMAN WRAPPER] Launching vanilla!"
    exec "$@"
else
    [ -n "$R2STARTSERVER" ] && exec "$BASEDIR/profiles/$R2PROFILE/start_server_bepinex.sh" "$@" || true

    if test -f "$BASEDIR/profiles/$R2PROFILE/run_bepinex.sh"; then
        echo "[R2MODMAN WRAPPER] Launching BepInEx!"
        exec "$BASEDIR/profiles/$R2PROFILE/run_bepinex.sh" "$@"
    elif test -f "$BASEDIR/profiles/$R2PROFILE/run_umm.sh"; then
        echo "[R2MODMAN WRAPPER] Launching Unity Mod Loader!"
        exec "$BASEDIR/profiles/$R2PROFILE/run_umm.sh" "$@"
    elif test -f "$BASEDIR/profiles/$R2PROFILE/start_game_bepinex.sh"; then
        echo "[R2MODMAN WRAPPER] Launching BepInEx!"
        exec "$BASEDIR/profiles/$R2PROFILE/start_game_bepinex.sh" "$@"
    else
        echo "[R2MODMAN WRAPPER] Error: Tried to launch modloader, but could not find any supported launchers!"
        exit 1
    fi
fi
