import { PackageInstallerId } from '../../installers/registry';

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
        case PackageLoader.ANCIENT_DUNGEON_VR: return null;
    }
}

export function GetInstallerIdForPlugin(loader: PackageLoader): PackageInstallerId | null {
    switch (loader) {
        case PackageLoader.SHIMLOADER: return "shimloader-plugin";
        case PackageLoader.LOVELY: return "lovely-plugin";
        case PackageLoader.RETURN_OF_MODDING: return "returnofmodding-plugin";
        case PackageLoader.GDWEAVE: return "gdweave-plugin";
    }

    return null;
}
