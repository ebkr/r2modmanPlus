import { PackageLoader } from '../../model/installing/PackageLoader';

export default class ModLoaderPackageMapping {

    private readonly _packageName: string;
    private readonly _rootFolder: string;
    private readonly _loaderType: PackageLoader;

    constructor(packageName: string, rootFolder: string, loaderType: PackageLoader) {
        this._packageName = packageName;
        this._rootFolder = rootFolder;
        this._loaderType = loaderType;
    }

    get packageName() {
        return this._packageName;
    }

    get rootFolder() {
        return this._rootFolder;
    }

    get loaderType(): PackageLoader {
        return this._loaderType;
    }
}
