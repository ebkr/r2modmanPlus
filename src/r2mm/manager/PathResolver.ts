import * as path from 'path';
import ManagerSettings from './ManagerSettings';
import FileUtils from '../utils/FileUtils';

export default class PathResolver {

    private static _APPDATA_DIR: string = '';
    private static _ROOT: string = '';
    private static _MOD_ROOT: string = '';

    static set APPDATA_DIR(appDataDir: string) {
        PathResolver._APPDATA_DIR = appDataDir;
        ManagerSettings.getSingleton().load();
        PathResolver._ROOT = ManagerSettings.getSingleton().dataDirectory;
        FileUtils.ensureDirectory(PathResolver.ROOT)
        PathResolver._MOD_ROOT = path.join(PathResolver._ROOT, 'mods');
    }

    static get ROOT(): string {
        return PathResolver._ROOT;
    }

    static get MOD_ROOT(): string {
        return PathResolver._MOD_ROOT;
    }

    static get APPDATA_DIR(): string {
        return PathResolver._APPDATA_DIR;
    }
}
