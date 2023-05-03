import { PackageLoader } from '../../model/installing/PackageLoader';

export default class ModLoaderPackageMapping {

    private readonly _packageName: string;
    private readonly _rootFolder: string;
    private readonly _loaderType: PackageLoader;
    private readonly _metalinkedDependencies: string[];

    constructor(packageName: string, rootFolder: string, loaderType: PackageLoader, dependencies?: string[]) {
        this._packageName = packageName;
        this._rootFolder = rootFolder;
        this._loaderType = loaderType;
        this._metalinkedDependencies = dependencies || [];
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

    get metalinkedDependencies(): string[] {
        return this._metalinkedDependencies;
    }
}
