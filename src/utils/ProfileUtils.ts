import path from "path";

import * as yaml from "yaml";

import R2Error from "../model/errors/R2Error";
import ExportFormat from "../model/exports/ExportFormat";
import ExportMod from "../model/exports/ExportMod";
import ManifestV2 from "../model/ManifestV2";
import Profile from "../model/Profile";
import ThunderstoreMod from "../model/ThunderstoreMod";
import ThunderstoreVersion from "../model/ThunderstoreVersion";
import VersionNumber from "../model/VersionNumber";
import FsProvider from "../providers/generic/file/FsProvider";
import ZipProvider from "../providers/generic/zip/ZipProvider";
import ProfileInstallerProvider from "../providers/ror2/installing/ProfileInstallerProvider";
import ProfileModList from "../r2mm/mods/ProfileModList";

export async function extractZippedProfileFile(file: string, profileName: string) {
    const entries = await ZipProvider.instance.getEntries(file);
    for (const entry of entries) {
        if (entry.entryName.startsWith('config/') || entry.entryName.startsWith("config\\")) {
            await ZipProvider.instance.extractEntryTo(
                file,
                entry.entryName,
                path.join(
                    Profile.getDirectory(),
                    profileName,
                    'BepInEx'
                )
            );
        } else if (entry.entryName.toLowerCase() !== "export.r2x") {
            await ZipProvider.instance.extractEntryTo(
                file,
                entry.entryName,
                path.join(
                    Profile.getDirectory(),
                    profileName
                )
            )
        }
    }
}

export async function installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion, profile: Profile): Promise<ManifestV2> {
    const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
    const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, profile);
    if (installError instanceof R2Error) {
        throw installError;
    }

    const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, profile);
    if (newModList instanceof R2Error) {
        throw newModList;
    }

    return manifestMod;
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
