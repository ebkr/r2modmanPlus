import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import VersionNumber from '../../../model/VersionNumber';
import {
    EcosystemModloaderPackages,
    EcosystemSupportedGames,
    PackageLoader
} from '../../../model/schema/ThunderstoreSchema';

type Modloaders = Record<string, ModLoaderPackageMapping[]>;

// Overrides are needed as the "recommended version" information
// is not available in the ecosystem data.
const OVERRIDES: Modloaders = {
    BONEWORKS: [
        new ModLoaderPackageMapping(
            'LavaGang-MelonLoader',
            '',
            PackageLoader.MELONLOADER,
            new VersionNumber('0.5.4'),
        ),
    ],
}

export let MODLOADER_PACKAGES: ModLoaderPackageMapping[] = [];
export let MOD_LOADER_VARIANTS: Modloaders = {};

export function updateModLoaderExports() {
    MODLOADER_PACKAGES = EcosystemModloaderPackages.value.map((x) =>
        new ModLoaderPackageMapping(x.packageId, x.rootFolder, x.loader)
    );
    MOD_LOADER_VARIANTS = Object.fromEntries(
        EcosystemSupportedGames.value
            .map(([_, game]) => [
                game.internalFolderName,
                OVERRIDES[game.internalFolderName] || MODLOADER_PACKAGES
            ])
    );
}

export const getModLoaderPackageNames = () => {
    const deduplicated = new Set(EcosystemModloaderPackages.value.map((x) => x.packageId));
    const names = Array.from(deduplicated);
    names.sort();
    return names;
}
