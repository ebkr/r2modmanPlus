import path from "path";

import * as yaml from "yaml";

import ExportFormat from "../model/exports/ExportFormat";
import ExportMod from "../model/exports/ExportMod";
import Profile from "../model/Profile";
import VersionNumber from "../model/VersionNumber";
import ZipProvider from "../providers/generic/zip/ZipProvider";

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
