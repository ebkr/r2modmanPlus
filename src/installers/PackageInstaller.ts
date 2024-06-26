import Profile from "../model/Profile";
import ManifestV2 from "../model/ManifestV2";


export type InstallArgs = {
    mod: ManifestV2;
    profile: Profile;
    packagePath: string;
};

export class InstallerCapability {
    install: boolean = false;
    uninstall: boolean = false;
    enable: boolean = false;
    disable: boolean = false;
}


export abstract class PackageInstaller {
    abstract capability(): Promise<InstallerCapability>;
    abstract install(args: InstallArgs): Promise<void>;
    abstract uninstall(args: InstallArgs): Promise<void>;
    abstract enable(args: InstallArgs): Promise<void>;
    abstract disable(args: InstallArgs): Promise<void>;
}
