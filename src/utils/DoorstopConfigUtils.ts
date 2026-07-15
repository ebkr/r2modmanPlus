import { ImmutableProfile } from '../model/Profile';
import R2Error from '../model/errors/R2Error';
import FsProvider from '../providers/generic/file/FsProvider';
import path from '../providers/node/path/path';
import { buildConfigurationFileFromPath, saveConfigurationFile } from './ConfigUtils';
import { getUnityDoorstopVersion, BEPINEX_PRELOADER_DLLS } from './UnityDoorstopUtils';

async function findPreloader(profile: ImmutableProfile): Promise<{ corePath: string, dll: string } | R2Error> {
    try {
        const corePath = await FsProvider.instance.realpath(profile.joinToProfilePath("BepInEx", "core"));
        const dll = (await FsProvider.instance.readdir(corePath)).filter((x: string) => BEPINEX_PRELOADER_DLLS.includes(x))[0];
        if (!dll) {
            return new R2Error(
                "Failed to find preloader dll",
                `No BepInEx preloader was found in ${corePath}`,
                "BepInEx may not be installed correctly."
            );
        }
        return { corePath, dll };
    } catch (e) {
        return new R2Error("Failed to find preloader dll", (e as Error).message, "BepInEx may not be installed correctly.");
    }
}

/**
 * Absolute path to the profile's BepInEx preloader, `Z:`-prefixed for Proton so
 * Windows/Proton can resolve it. This is the value that lets doorstop load mods
 * straight from the profile directory, independent of launch arguments.
 */
export async function resolveProfilePreloaderPath(profile: ImmutableProfile, proton: boolean): Promise<string | R2Error> {
    const found = await findPreloader(profile);
    if (found instanceof R2Error) {
        return found;
    }
    return `${proton ? 'Z:' : ''}${path.join(found.corePath, found.dll)}`;
}

/**
 * The default game-relative preloader path shipped by BepInEx (Windows-style
 * separators). Used to revert the redirect so an external launch no longer
 * points at the profile directory.
 */
export async function resolveDefaultRelativePreloaderPath(profile: ImmutableProfile): Promise<string | R2Error> {
    const found = await findPreloader(profile);
    if (found instanceof R2Error) {
        return found;
    }
    return `BepInEx\\core\\${found.dll}`;
}

/**
 * Write the doorstop target assembly (and enabled flag) into the profile's
 * doorstop_config.ini. This file is copied into the game directory by
 * ModLinker, so the value here is what an out-of-manager launch reads.
 * Handles both Doorstop v3 (UnityDoorstop/targetAssembly) and v4
 * (General/target_assembly). No-op if the profile has no doorstop_config.ini.
 */
export async function setProfileDoorstopTarget(
    profile: ImmutableProfile,
    targetAssembly: string,
    enabled: boolean
): Promise<void | R2Error> {
    const doorstopPath = profile.joinToProfilePath("doorstop_config.ini");
    if (!(await FsProvider.instance.exists(doorstopPath))) {
        return;
    }

    const config = await buildConfigurationFileFromPath(doorstopPath);
    const version = await getUnityDoorstopVersion(profile);

    const [sectionName, targetKey] = version === 4
        ? ['General', 'target_assembly']
        : version === 3
            ? ['UnityDoorstop', 'targetAssembly']
            : [null, null];

    if (sectionName === null) {
        return new R2Error(
            "Unsupported Doorstop version",
            "The version of Unity Doorstop is unsupported. This is likely due to a BepInEx update.",
            "Either downgrade your BepInEx version or wait for a manager update"
        );
    }

    const section = config.sections.find((s) => s.sectionName === sectionName);
    const targetEntry = section?.entries.find((e) => e.entryName === targetKey);
    const enabledEntry = section?.entries.find((e) => e.entryName === 'enabled');
    if (!targetEntry || !enabledEntry) {
        return new R2Error(
            "Malformed doorstop_config.ini",
            `Expected [${sectionName}] section with '${targetKey}' and 'enabled' entries.`,
            "BepInEx may not be installed correctly. Reinstalling BepInEx may help."
        );
    }

    targetEntry.value = targetAssembly;
    enabledEntry.value = Boolean(enabled).toString();

    await saveConfigurationFile(config);
}
