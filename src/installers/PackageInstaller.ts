import Profile from "../model/Profile";
import ManifestV2 from "../model/ManifestV2";


export type InstallArgs = {
    mod: ManifestV2;
    profile: Profile;
    packagePath: string;
};


export abstract class PackageInstaller {
    abstract install(args: InstallArgs): Promise<void>;
    // abstract uninstall(): Promise<void>;  // TODO: Implement
}
