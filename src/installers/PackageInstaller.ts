import ModLoaderPackageMapping from "../model/installing/ModLoaderPackageMapping";
import Profile from "../model/Profile";

export abstract class PackageInstaller {
    abstract install(mlLocation: string, modLoaderMapping: ModLoaderPackageMapping, profile: Profile): Promise<void>;
    // abstract uninstall(): Promise<void>;  // TODO: Implement
}
