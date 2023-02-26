export default class PathResolver {

    private static _APPDATA_DIR: string = '';

    // Legacy path
    private static _CONFIG_DIR: string = '';

    private static _ROOT: string = '';
    private static _MOD_ROOT: string = '';

    static set APPDATA_DIR(appDataDir: string) {
        PathResolver._APPDATA_DIR = appDataDir;
    }

    static get ROOT(): string {
        return PathResolver._ROOT;
    }

    static set ROOT(value: string) {
        this._ROOT = value;
    }

    static get MOD_ROOT(): string {
        return PathResolver._MOD_ROOT;
    }

    static set MOD_ROOT(path: string) {
        this._MOD_ROOT = path;
    }

    static get APPDATA_DIR(): string {
        return PathResolver._APPDATA_DIR;
    }

    static get CONFIG_DIR(): string {
        return PathResolver._CONFIG_DIR;
    }

    static set CONFIG_DIR(path: string) {
        PathResolver._CONFIG_DIR = path;
    }
}
