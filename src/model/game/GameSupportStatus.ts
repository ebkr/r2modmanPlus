import {Loader, ModloaderPackage, Platform, R2Modman} from "../../assets/data/ecosystemTypes";

export type GameSupportStatus = "supported" | "unsupported-loader" | "unsupported-store";

const KNOWN_PLATFORMS = new Set<string>(Object.values(Platform));
const KNOWN_LOADERS = new Set<string>(Object.values(Loader));

export function getGameSupportStatus(
    game: R2Modman,
    modloaderPackages: ModloaderPackage[]
): GameSupportStatus {
    if (game.packageLoader !== Loader.NONE) {
        if (!KNOWN_LOADERS.has(game.packageLoader)) {
            return "unsupported-loader";
        }
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
