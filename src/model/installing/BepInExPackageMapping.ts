export default class BepInExPackageMapping {

    private readonly _packageName: string;
    private readonly _rootFolder: string;

    constructor(packageName: string, rootFolder: string) {
        this._packageName = packageName;
        this._rootFolder = rootFolder;
    }

    get packageName() {
        return this._packageName;
    }

    get rootFolder() {
        return this._rootFolder;
    }
}
