import path from "path";

import * as yaml from "yaml";

import FileUtils from "./FileUtils";
import R2Error from "../model/errors/R2Error";
import ExportFormat from "../model/exports/ExportFormat";
import ExportMod from "../model/exports/ExportMod";
import Game from "../model/game/Game";
import ManifestV2 from "../model/ManifestV2";
import Profile, { ImmutableProfile } from "../model/Profile";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import VersionNumber from "../model/VersionNumber";
import FsProvider from "../providers/generic/file/FsProvider";
import ZipProvider from "../providers/generic/zip/ZipProvider";
import ProfileInstallerProvider from "../providers/ror2/installing/ProfileInstallerProvider";
import * as PackageDb from '../r2mm/manager/PackageDexieStore';
import ProfileModList from "../r2mm/mods/ProfileModList";

export async function exportModsToCombos(exportMods: ExportMod[], game: Game): Promise<ThunderstoreCombo[]> {
    const dependencyStrings = exportMods.map((m) => m.getDependencyString());
    const combos = await PackageDb.getCombosByDependencyStrings(game, dependencyStrings);

    if (combos.length === 0) {
        throw new R2Error(
            'No importable mods found',
            'None of the mods or versions listed in the shared profile are available on Thunderstore.',
            'Make sure the shared profile is meant for the currently selected game.'
        );
    }

    return combos;
}

async function extractConfigsToImportedProfile(
    file: string,
    profileName: string,
    progressCallback: (status: string) => void
) {
    const zipEntries = await ZipProvider.instance.getEntries(file);
    const excludedFiles = ["export.r2x", "mods.yml"];

    for (const [index, entry] of zipEntries.entries()) {
        if (!excludedFiles.includes(entry.entryName.toLowerCase())) {
            let outputPath = path.join(Profile.getRootDir(), profileName);

            if (entry.entryName.startsWith('config/') || entry.entryName.startsWith("config\\")) {
                outputPath = path.join(outputPath, 'BepInEx');
            }

            await ZipProvider.instance.extractEntryTo(file, entry.entryName, outputPath);
        }

        const progress = Math.floor(((index + 1) / zipEntries.length) * 100);
        progressCallback(`Copying configs to profile: ${progress}%`);
    }
}

/**
 * Install mods to target profile and sync the changes to mods.yml file
 * This is more performant than calling ProfileModList.addMod() on a
 * loop, as that causes multiple disc operations per mod.
 */
export async function installModsToProfile(
    comboList: ThunderstoreCombo[],
    profile: ImmutableProfile,
    disabledModsOverride?: string[],
    progressCallback?: (status: string) => void
): Promise<ManifestV2[]> {
    const profileMods = await ProfileModList.getModList(profile);
    if (profileMods instanceof R2Error) {
        throw profileMods;
    }

    const installedVersions = profileMods.map((m) => m.getDependencyString());
    const disabledMods = disabledModsOverride || profileMods.filter((m) => !m.isEnabled()).map((m) => m.getName());
    let currentMod;

    try {
        for (const [index, comboMod] of comboList.entries()) {
            currentMod = comboMod;
            const manifestMod = new ManifestV2().fromThunderstoreMod(comboMod.getMod(), comboMod.getVersion());

            if (installedVersions.includes(manifestMod.getDependencyString())) {
                continue;
            }

            // Uninstall possible different version of the mod before installing the target version.
            throwForR2Error(await ProfileInstallerProvider.instance.uninstallMod(manifestMod, profile));
            throwForR2Error(await ProfileInstallerProvider.instance.installMod(manifestMod, profile));

            if (disabledMods.includes(manifestMod.getName())) {
                throwForR2Error(await ProfileInstallerProvider.instance.disableMod(manifestMod, profile));
                manifestMod.disable();
            }

            manifestMod.setInstalledAtTime(Number(new Date()));
            ProfileModList.setIconPath(manifestMod, profile);

            const positionInProfile = profileMods.findIndex((m) => m.getName() === manifestMod.getName());
            if (positionInProfile >= 0) {
                profileMods[positionInProfile] = manifestMod;
            } else {
                profileMods.push(manifestMod);
            }

            if (typeof progressCallback === "function") {
                const progress = Math.floor(((index + 1) / comboList.length) * 100);
                progressCallback(`Copying mods to profile: ${progress}%`);
            }
        }
    } catch (e) {
        const originalError = R2Error.fromThrownValue(e);
        const modName = currentMod ? currentMod.getMod().getFullName() : 'Unknown';
        throw new R2Error(
            `Failed to install mod [${modName}] to profile`,
            'All mods/dependencies might not be installed properly. Please try again.',
            `The original error might provide hints about what went wrong: ${originalError.name}: ${originalError.message}`
        );
    }

    throwForR2Error(await ProfileModList.saveModList(profile, profileMods));
    return profileMods;
}

export async function parseYamlToExportFormat(yamlContent: string) {
    const parsedYaml = await yaml.parse(yamlContent);
    return new ExportFormat(
        parsedYaml.profileName,
        parsedYaml.mods.map((mod: any) => {
            const enabled = mod.enabled === undefined || mod.enabled;
            return new ExportMod(
                mod.name,
                new VersionNumber(
                    `${mod.version.major}.${mod.version.minor}.${mod.version.patch}`
                ),
                enabled
            );
        })
    );
}

/**
 * Copies mods (which should exists in the cache at this point) to profile folder and
 * updates the profile status. Extracts the configs etc. files that are included in
 * the zip file created when the profile was exported.
 *
 * When updating an existing profile, all this is done to a temporary profile first,
 * and the target profile is overwritten only if the process is successful.
 */
export async function populateImportedProfile(
    comboList: ThunderstoreCombo[],
    exportModList: ExportMod[],
    profileName: string,
    isUpdate: boolean,
    zipPath: string,
    progressCallback: (status: string) => void
) {
    const profile = new ImmutableProfile(isUpdate ? '_profile_update' : profileName);

    if (isUpdate) {
        progressCallback('Cleaning up...');
        await FileUtils.recursiveRemoveDirectoryIfExists(profile.getProfilePath());
    }

    try {
        const disabledMods = exportModList.filter((m) => !m.isEnabled()).map((m) => m.getName());
        await installModsToProfile(comboList, profile, disabledMods, progressCallback);
        await extractConfigsToImportedProfile(zipPath, profile.getProfileName(), progressCallback);
    } catch (e) {
        await FileUtils.recursiveRemoveDirectoryIfExists(profile.getProfilePath());
        throw e;
    }

    if (isUpdate) {
        progressCallback('Applying changes to updated profile...');
        const targetProfile = new ImmutableProfile(profileName);
        await FileUtils.recursiveRemoveDirectoryIfExists(targetProfile.getProfilePath());
        await FsProvider.instance.rename(profile.getProfilePath(), targetProfile.getProfilePath());
    }
}

//TODO: Check if instead of returning null/empty strings, there's some errors that should be handled
export async function readProfileFile(file: string) {
    let read = '';
    if (file.endsWith('.r2x')) {
        read = (await FsProvider.instance.readFile(file)).toString();
    } else if (file.endsWith('.r2z')) {
        const result: Buffer | null = await ZipProvider.instance.readFile(file, "export.r2x");
        if (result === null) {
            return null;
        }
        read = result.toString();
    }
    return read;
}

function throwForR2Error(maybeError: unknown) {
    if (maybeError instanceof R2Error) {
        throw maybeError;
    }
}
