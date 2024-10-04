import path from "path";

import * as yaml from "yaml";

import R2Error from "../model/errors/R2Error";
import ExportFormat from "../model/exports/ExportFormat";
import ExportMod from "../model/exports/ExportMod";
import ManifestV2 from "../model/ManifestV2";
import Profile, { ImmutableProfile } from "../model/Profile";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import VersionNumber from "../model/VersionNumber";
import FsProvider from "../providers/generic/file/FsProvider";
import ZipProvider from "../providers/generic/zip/ZipProvider";
import ProfileInstallerProvider from "../providers/ror2/installing/ProfileInstallerProvider";
import * as PackageDb from '../r2mm/manager/PackageDexieStore';
import ProfileModList from "../r2mm/mods/ProfileModList";

export async function exportModsToCombos(exportMods: ExportMod[], community: string): Promise<ThunderstoreCombo[]> {
    const tsMods = await PackageDb.getPackagesByNames(community, exportMods.map((m) => m.getName()));

    const combos = tsMods.map((tsMod) => {
        const targetMod = exportMods.find((expMod) => tsMod.getFullName() == expMod.getName());
        const version = targetMod
            ? tsMod.getVersions().find((ver) => ver.getVersionNumber().isEqualTo(targetMod.getVersionNumber()))
            : undefined;

        if (version) {
            const combo = new ThunderstoreCombo();
            combo.setMod(tsMod);
            combo.setVersion(version);
            return combo;
        }
    }).filter((combo): combo is ThunderstoreCombo => combo !== undefined);

    if (combos.length === 0) {
        throw new R2Error(
            'No importable mods found',
            'None of the mods or versions listed in the shared profile are available on Thunderstore.',
            'Make sure the shared profile is meant for the currently selected game.'
        );
    }

    return combos;
}

export async function extractImportedProfileConfigs(file: string, profileName: string) {
    const entries = await ZipProvider.instance.getEntries(file);
    for (const entry of entries) {
        if (entry.entryName.startsWith('config/') || entry.entryName.startsWith("config\\")) {
            await ZipProvider.instance.extractEntryTo(
                file,
                entry.entryName,
                path.join(
                    Profile.getRootDir(),
                    profileName,
                    'BepInEx'
                )
            );
        } else if (entry.entryName.toLowerCase() !== "export.r2x") {
            await ZipProvider.instance.extractEntryTo(
                file,
                entry.entryName,
                path.join(
                    Profile.getRootDir(),
                    profileName
                )
            )
        }
    }
}

export async function installModsToProfile(comboList: ThunderstoreCombo[], modList: ExportMod[], profile: ImmutableProfile) {
    const disabledMods = modList.filter((m) => !m.isEnabled()).map((m) => m.getName());

    for (const comboMod of comboList) {
        const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(comboMod.getMod(), comboMod.getVersion());

        const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, profile);
        if (installError instanceof R2Error) {
            throw installError;
        }

        const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, profile);
        if (newModList instanceof R2Error) {
            throw newModList;
        }

        if (disabledMods.includes(manifestMod.getName())) {
            await ProfileModList.updateMod(manifestMod, profile, async (modToDisable: ManifestV2) => {
                // Need to enable temporarily so the manager doesn't think it's re-disabling a disabled mod.
                modToDisable.enable();
                await ProfileInstallerProvider.instance.disableMod(modToDisable, profile);
                modToDisable.disable();
            });
        }
    }
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
