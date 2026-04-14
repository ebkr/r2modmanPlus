import {Loader, ModloaderPackage, Platform, R2Modman} from "../../assets/data/ecosystemTypes";

export type GameSupportStatus = "supported" | "unsupported-loader" | "unsupported-store";

const KNOWN_PLATFORMS = new Set<string>(Object.values(Platform));

export function getGameSupportStatus(
    game: R2Modman,
    modloaderPackages: ModloaderPackage[]
): GameSupportStatus {
    if (game.packageLoader !== Loader.NONE) {
        const hasLoader = modloaderPackages.some(p => p.loader === game.packageLoader);
        if (!hasLoader) {
            return "unsupported-loader";
        }
    }

    const hasKnownPlatform = game.distributions.some(d => KNOWN_PLATFORMS.has(d.platform));
    if (!hasKnownPlatform) {
        return "unsupported-store";
    }

    return "supported";
}
