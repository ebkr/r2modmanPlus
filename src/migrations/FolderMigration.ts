import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import FsProvider from '../providers/generic/file/FsProvider';
import FileUtils from '../utils/FileUtils';
import CacheUtil from '../r2mm/mods/CacheUtil';

export default class FolderMigration {

    public static async needsMigration(): Promise<boolean> {
        const fs = FsProvider.instance;
        return await fs.exists(path.join(PathResolver.ROOT, "mods"));
    }

    public static async runMigration(): Promise<void> {
        console.log("Started migration");
        const fs = FsProvider.instance;
        await CacheUtil.clean();
        if ((await fs.exists(path.join(PathResolver.ROOT, "RiskOfRain2")))) {
            await FileUtils.emptyDirectory(path.join(PathResolver.ROOT, "RiskOfRain2"));
            await fs.rmdir(path.join(PathResolver.ROOT, "RiskOfRain2"));
        }
        await fs.rename(path.join(PathResolver.ROOT, "mods"), path.join(PathResolver.ROOT, "RiskOfRain2"));
    }

}
