#!/bin/sh

cd "$(dirname "$0")" || exit

# File to read arguments from
ARGS_FILE="./wrapper_args.txt"

# Find the Steam executable from direct arguments (%command%)
# Remaining arguments are appended to "$@"
STEAM_EXECUTABLE=""
for arg in "$@"; do
    if [ -z "$STEAM_EXECUTABLE" ] && [ "${arg#-}" = "$arg" ]; then
        STEAM_EXECUTABLE="$arg"
    else
        set -- "$@" "$arg"
    fi
    shift
done

echo "Steam executable: $STEAM_EXECUTABLE"

# Read the $ARGS_FILE and further append arguments to $@
# If a wrapper script is required (Linux native), then it should be the first argument
# Pull it out and store it as that becomes the primary execution target when present
WRAPPER_EXECUTABLE=""
FIRST_LINE_CHECKED=false
if [ -f "$ARGS_FILE" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines, allows comments for debugging
        [ -z "$line" ] && continue
        case "$line" in "#"*) continue ;; esac

        if [ "$FIRST_LINE_CHECKED" = "false" ]; then
            FIRST_LINE_CHECKED=true

            # If it's a file that exists AND isn't an option (no leading -)
            if [ "${line#-}" = "$line" ] && [ -f "$line" ]; then
                WRAPPER_EXECUTABLE="$line"
                echo "Found valid wrapper: $WRAPPER_EXECUTABLE"
                continue # Skip adding this line to $@ because it's the executable
            fi
        fi

        # Everything else becomes an argument as part of $@
        set -- "$@" "$line"
    done < "$ARGS_FILE"
fi

echo "Wrapper executable: $WRAPPER_EXECUTABLE"

# We forcibly clear args to prevent malicous injection
# This also ensures that subsequent runs through Steam remain unmodded
echo '' > "$ARGS_FILE"

if [ -z "$STEAM_EXECUTABLE" ]; then
    echo "Error: no executable provided by Steam %command%" >&2
    exit 1
fi

if [ -n "$WRAPPER_EXECUTABLE" ]; then
    echo "Executing with wrapper executable: $WRAPPER_EXECUTABLE $STEAM_EXECUTABLE $@"
    exec "$WRAPPER_EXECUTABLE" "$STEAM_EXECUTABLE" "$@"
else
    echo "Executing without wrapper executable: $STEAM_EXECUTABLE $@"
    exec "$STEAM_EXECUTABLE" "$@"
fi

