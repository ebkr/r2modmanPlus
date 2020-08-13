import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import * as fs from 'fs-extra';

export default class FolderMigration {

    public static async checkAndMigrate(): Promise<void> {
        if (fs.existsSync(path.join(PathResolver.ROOT, "mods"))) {
            return this.runMigration();
        }
        return Promise.resolve();
    }

    private static runMigration(): Promise<void> {
        fs.ensureDirSync(path.join(PathResolver.ROOT, "games", "Risk of Rain 2"));
        return fs.copy(path.join(PathResolver.ROOT, "mods"), path.join(PathResolver.ROOT, "games", "Risk of Rain 2"))
            .then(() => fs.removeSync(path.join(PathResolver.ROOT, "mods")));
    }

}
