import { PackageInstallerId } from '../../installers/registry';
import R2Error from '../errors/R2Error';

export enum PackageLoader {
    BEPINEX,
    MELON_LOADER,
    NORTHSTAR,
    GODOT_ML,
    ANCIENT_DUNGEON_VR,
    SHIMLOADER,
    LOVELY,
    RETURN_OF_MODDING,
    GDWEAVE,
    RECURSIVE_MELON_LOADER,
}

export function GetInstallerIdForLoader(loader: PackageLoader): PackageInstallerId | null {
    // Switch is used here to trigger TS errors if new package loaders aren't
    // mapped explicitly.
    switch (loader) {
        case PackageLoader.BEPINEX: return "bepinex";
        case PackageLoader.MELON_LOADER: return "melonloader";
        case PackageLoader.GODOT_ML: return "godotml";
        case PackageLoader.NORTHSTAR: return "northstar";
        case PackageLoader.SHIMLOADER: return "shimloader";
        case PackageLoader.LOVELY: return "lovely";
        case PackageLoader.RETURN_OF_MODDING: return "returnofmodding";
        case PackageLoader.GDWEAVE: return "gdweave";
        case PackageLoader.RECURSIVE_MELON_LOADER: return "recursive-melonloader";
        case PackageLoader.ANCIENT_DUNGEON_VR: return null;
    }
}

export function GetInstallerIdForPlugin(loader: PackageLoader): PackageInstallerId | null {
    switch (loader) {
        case PackageLoader.SHIMLOADER: return "shimloader-plugin";
        case PackageLoader.LOVELY: return "lovely-plugin";
        case PackageLoader.RETURN_OF_MODDING: return "returnofmodding-plugin";
        case PackageLoader.GDWEAVE: return "gdweave-plugin";
        case PackageLoader.RECURSIVE_MELON_LOADER: return "recursive-melonloader-plugin";
    }

    return null;
}

// Return the PackageLoader enum variant from the provided ecosystem-schema package loader name.
export function installerVariantFromString(name: string|null): PackageLoader {
    switch (name) {
        // TODO: PR #1687 introduces PackageLoader.NONE which should be used here instead.
        case null: return PackageLoader.ANCIENT_DUNGEON_VR;

        case "bepinex": return PackageLoader.BEPINEX;
        case "melonloader": return PackageLoader.MELON_LOADER;
        case "northstar": return PackageLoader.NORTHSTAR;
        case "godotml": return PackageLoader.GODOT_ML;
        case "shimloader": return PackageLoader.SHIMLOADER;
        case "lovely": return PackageLoader.LOVELY;
        case "returnofmodding": return PackageLoader.RETURN_OF_MODDING;
        case "gdweave": return PackageLoader.GDWEAVE;
        case "recursive-melonloader": return PackageLoader.RECURSIVE_MELON_LOADER;
    }

    throw new R2Error(
        "Invalid schema installer identifier",
        `"${name}" is not a valid installer identifier.`
    );
}
