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
        x.identifier,
        x.rootFolder,
        installerVariantFromString(x.variant),
    ),
);

const OVERRIDES: { [key: string]: [ModLoaderPackageMapping] } = {
    BONEWORKS: [
        new ModLoaderPackageMapping(
            'LavaGang-MelonLoader',
            '',
            PackageLoader.MELON_LOADER,
            new VersionNumber('0.5.4'),
        ),
    ],
    BONELAB: [
        new ModLoaderPackageMapping(
            'LavaGang-MelonLoader',
            '',
            PackageLoader.MELON_LOADER,
        ),
    ],
}

// TODO:
// - Overrides for BONELAB and BONEWORKS.
// - Better type?
export const MOD_LOADER_VARIANTS = Object.fromEntries(
    EcosystemSchema.supportedGames
        .map((game) => [
            game.r2modman!.internalFolderName,
            OVERRIDES[game.r2modman!.internalFolderName] || MODLOADER_PACKAGES
        ])
);

export function getModLoaderPackageNames() {
    const names = MODLOADER_PACKAGES.map((mapping) => mapping.packageName);

    // Hard code MelonLoader to avoid having to iterate over MODLOADER_PACKAGES
    // for each game separately. Hopefully we'll get rid of this once ML v0.6.6
    // is released, as it's supposed to fix a bug that forces some games to
    // currently use the older versions.
    names.push('LavaGang-MelonLoader');
    return names;
}
