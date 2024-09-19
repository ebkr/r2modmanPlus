import ZipProvider from "../providers/generic/zip/ZipProvider";
import path from "path";
import Profile from "../model/Profile";

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
