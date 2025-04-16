import R2Error from "../errors/R2Error";

export enum StorePlatform {
    STEAM = "Steam",
    STEAM_DIRECT = "Steam ", // Add a space so that there's no conflict in the PlatformInterceptor listing
    EPIC_GAMES_STORE = "Epic Games Store",
    OCULUS_STORE = "Oculus Store",
    ORIGIN = "Origin / EA Desktop",
    XBOX_GAME_PASS = "Xbox Game Pass",
    OTHER = "Other",
}

export function getStorePlatformFromName(name: string): StorePlatform {
    switch (name) {
        case "steam": return StorePlatform.STEAM;
        case "steam-direct": return StorePlatform.STEAM_DIRECT;
        case "epic-games-store": return StorePlatform.EPIC_GAMES_STORE;
        case "oculus-store": return StorePlatform.OCULUS_STORE;
        case "origin": return StorePlatform.ORIGIN;
        case "xbox-game-pass": return StorePlatform.XBOX_GAME_PASS;
        case "other": return StorePlatform.OTHER;
        default:
            throw new R2Error(
                "Invalid schema store platform identifier",
                `"${name}" is not a valid store platform.`
            );
    }
}
