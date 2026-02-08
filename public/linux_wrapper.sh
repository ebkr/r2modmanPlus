#!/bin/sh

# Linux/MacOS wrapper script for r2modman
# NOTE: The name `linux_wrapper.sh` is kept to avoid breaking existing installs despite this working on Mac too
# Written by Naomi Calabretta (blame her if something does not work)

a="/$0"; a=${a%/*}; a=${a#/}; a=${a:-.}; BASEDIR=$(cd "$a" || exit; pwd -P)

R2PROFILE=""
R2STARTSERVER=""
R2OS="$(uname -s)"
echo "[R2MODMAN WRAPPER] Running on $R2OS"

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
    # Some old versions of run_bepinex.sh require being in the same directory as BepInEx
    cd "$BASEDIR/profiles/$R2PROFILE/"

    [ -n "$R2STARTSERVER" ] && exec "$BASEDIR/profiles/$R2PROFILE/start_server_bepinex.sh" "$@" || true

    if test -f "$BASEDIR/profiles/$R2PROFILE/run_bepinex.sh"; then
        echo "[R2MODMAN WRAPPER] Launching BepInEx! (via run_bepinex.sh)"
        exec "$BASEDIR/profiles/$R2PROFILE/run_bepinex.sh" "$@"
    elif test -f "$BASEDIR/profiles/$R2PROFILE/run_umm.sh"; then
        echo "[R2MODMAN WRAPPER] Launching Unity Mod Loader!"
        exec "$BASEDIR/profiles/$R2PROFILE/run_umm.sh" "$@"
    elif test -f "$BASEDIR/profiles/$R2PROFILE/start_game_bepinex.sh"; then
        echo "[R2MODMAN WRAPPER] Launching BepInEx! (via start_game_bepinex.sh)"
        case $R2OS in
            Linux*)
                exec "$BASEDIR/profiles/$R2PROFILE/start_game_bepinex.sh" "$@"
            ;;
            # start_game_bepinex.sh doesn't inject Doorstop on MacOS, so we need to do that ourselves before running it
            Darwin*)
                exec sh <<'                END' -s -- "$BASEDIR" "$R2PROFILE" "$@"
                    BASEDIR="$1"; shift
                    R2PROFILE="$1"; shift
                    export DYLD_LIBRARY_PATH
                    if [ -z "$DYLD_LIBRARY_PATH" ]; then
                        DYLD_LIBRARY_PATH="$BASEDIR/profiles/$R2PROFILE/doorstop_libs"
                    else
                        DYLD_LIBRARY_PATH="$BASEDIR/profiles/$R2PROFILE/doorstop_libs:$DYLD_LIBRARY_PATH"
                    fi
                    export DYLD_INSERT_LIBRARIES
                    if [ -z "$DYLD_INSERT_LIBRARIES" ]; then
                        DYLD_INSERT_LIBRARIES="$BASEDIR/profiles/$R2PROFILE/doorstop_libs/libdoorstop_x64.dylib"
                    else
                        DYLD_INSERT_LIBRARIES="$BASEDIR/profiles/$R2PROFILE/doorstop_libs/libdoorstop_x64.dylib:$DYLD_INSERT_LIBRARIES"
                    fi
                    source "$BASEDIR/profiles/$R2PROFILE/start_game_bepinex.sh" "$@"
                END
            ;;
        esac
    else
        echo "[R2MODMAN WRAPPER] Error: Tried to launch modloader, but could not find any supported launchers!"
        exit 1
    fi
fi
