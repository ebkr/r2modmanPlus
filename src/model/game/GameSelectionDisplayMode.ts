import R2Error from "../errors/R2Error";

export enum GameSelectionDisplayMode {
    VISIBLE,
    HIDDEN
}

export function displayModeFromString(mode: string): GameSelectionDisplayMode {
    switch (mode.toLocaleLowerCase()) {
        case "visible": return GameSelectionDisplayMode.VISIBLE;
        case "hidden": return GameSelectionDisplayMode.HIDDEN;
    }

    throw new R2Error(
        "Invalid game selection mode identifier",
        `${mode} is not a valid game selection mode.`
    )
}
