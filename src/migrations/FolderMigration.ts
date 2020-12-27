import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';

export default class FolderMigration {

    public static async checkAndMigrate(): Promise<void> {
        const fs = FsProvider.instance;
        if (await fs.exists(path.join(PathResolver.ROOT, "mods"))) {
            return this.runMigration();
        }
        return Promise.resolve();
    }

    private static async runMigration(): Promise<void> {
        const fs = FsProvider.instance;
        await FileUtils.ensureDirectory(path.join(PathResolver.ROOT, "games", "Risk of Rain 2"));
        return new Promise(async resolve => {
            await fs.copyFolder(path.join(PathResolver.ROOT, "mods"), path.join(PathResolver.ROOT, "games", "Risk of Rain 2"));
            resolve(Promise.resolve());
        }).then(async () => {
            await FileUtils.emptyDirectory(path.join(PathResolver.ROOT, "mods"));
            await fs.rmdir(path.join(PathResolver.ROOT, "mods"));
            return Promise.resolve();
        });
    }

}
