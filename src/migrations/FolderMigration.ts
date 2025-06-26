import FsProvider from '../providers/generic/file/FsProvider';
import PathResolver from '../r2mm/manager/PathResolver';
import FileUtils from '../utils/FileUtils';
import path from '../providers/node/path/path';

/**
 * Mod directory structure was changed when support for other games
 * besides RoR2 was added. Update the dir structure if the old one is
 * still in use.
 */
export class FolderMigration {

    public static async needsMigration() {
        const fs = FsProvider.instance;
        return await fs.exists(path.join(PathResolver.ROOT, "mods"));
    }

    public static async runMigration() {
        if (!await this.needsMigration()) {
            console.log("Does not need migration");
            return;
        }

        console.log("Started legacy directory migration");
        const fs = FsProvider.instance;
        const rorPath = path.join(PathResolver.ROOT, "RiskOfRain2");

        if (await fs.exists(rorPath)) {
            await FileUtils.emptyDirectory(rorPath);
            await fs.rmdir(rorPath);
        }

        await fs.rename(path.join(PathResolver.ROOT, "mods"), rorPath);
        console.log("Directory migration done");
    }
}
