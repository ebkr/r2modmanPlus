import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';

export default class FolderMigration {

    public static async checkAndMigrate(): Promise<void> {
        const fs = FsProvider.instance;
        if (fs.existsSync(path.join(PathResolver.ROOT, "mods"))) {
            return this.runMigration();
        }
        return Promise.resolve();
    }

    private static async runMigration(): Promise<void> {
        const fs = FsProvider.instance;
        FileUtils.ensureDirectory(path.join(PathResolver.ROOT, "games", "Risk of Rain 2"));
        return new Promise(resolve => {
            fs.copyFolderSync(path.join(PathResolver.ROOT, "mods"), path.join(PathResolver.ROOT, "games", "Risk of Rain 2"));
            resolve()
        }).then(() => {
            FileUtils.emptyDirectory(path.join(PathResolver.ROOT, "mods"));
            fs.rmdirSync(path.join(PathResolver.ROOT, "mods"));
            return Promise.resolve();
        });
    }

}
