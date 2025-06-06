import { PackageLoader } from '../../model/schema/ThunderstoreSchema';
import VersionNumber from '../../model/VersionNumber';

export default class ModLoaderPackageMapping {

    private readonly _packageName: string;
    private readonly _rootFolder: string;
    private readonly _loaderType: PackageLoader;
    private readonly _recommendedVersion: VersionNumber | undefined;

    constructor(packageName: string, rootFolder: string, loaderType: PackageLoader, recommendedVersion?: VersionNumber) {
        this._packageName = packageName;
        this._rootFolder = rootFolder;
        this._loaderType = loaderType;
        this._recommendedVersion = recommendedVersion;
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

    get recommendedVersion(): VersionNumber | undefined {
        return this._recommendedVersion;
    }
}
