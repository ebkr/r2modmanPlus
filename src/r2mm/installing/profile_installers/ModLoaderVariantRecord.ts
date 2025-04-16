import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import {
    installerVariantFromString,
    PackageLoader,
} from '../../../model/installing/PackageLoader';
import VersionNumber from '../../../model/VersionNumber';
import { EcosystemSchema } from '../../../model/schema/ThunderstoreSchema';

/**
 * A set of modloader packages read from the ecosystem schema.
 */
export const MODLOADER_PACKAGES = EcosystemSchema.modloaderPackages.map((x) =>
    new ModLoaderPackageMapping(
        x.packageId,
        x.rootFolder,
        installerVariantFromString(x.loader),
    ),
);

type Modloaders = Record<string, ModLoaderPackageMapping[]>;

// Overrides are needed as the "recommended version" information
// is not available in the ecosystem data.
const OVERRIDES: Modloaders = {
    BONEWORKS: [
        new ModLoaderPackageMapping(
            'LavaGang-MelonLoader',
            '',
            PackageLoader.MELON_LOADER,
            new VersionNumber('0.5.4'),
        ),
    ],
}

export const MOD_LOADER_VARIANTS: Modloaders = Object.fromEntries(
    EcosystemSchema.supportedGames
        .map((game) => [
            game.r2modman.internalFolderName,
            OVERRIDES[game.r2modman.internalFolderName] || MODLOADER_PACKAGES
        ])
);

export const getModLoaderPackageNames = () => {
    const deduplicated = new Set(EcosystemSchema.modloaderPackages.map((x) => x.packageId));
    const names = Array.from(deduplicated);
    names.sort();
    return names;
}
