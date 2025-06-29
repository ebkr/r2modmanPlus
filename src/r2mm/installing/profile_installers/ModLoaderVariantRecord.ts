import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import VersionNumber from '../../../model/VersionNumber';
import { EcosystemSchema, PackageLoader } from '../../../model/schema/ThunderstoreSchema';

/**
 * A set of modloader packages read from the ecosystem schema.
 */
export const MODLOADER_PACKAGES = EcosystemSchema.modloaderPackages.map((x) =>
    new ModLoaderPackageMapping(
        x.packageId,
        x.rootFolder,
        x.loader,
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
            PackageLoader.MELONLOADER,
            new VersionNumber('0.5.4'),
        ),
    ],
}

export const MOD_LOADER_VARIANTS: Modloaders = Object.fromEntries(
    EcosystemSchema.supportedGames
        .map((game) => [
            game.internalFolderName,
            OVERRIDES[game.internalFolderName] || MODLOADER_PACKAGES
        ])
);

export const getModLoaderPackageNames = () => {
    const deduplicated = new Set(EcosystemSchema.modloaderPackages.map((x) => x.packageId));
    const names = Array.from(deduplicated);
    names.sort();
    return names;
}
