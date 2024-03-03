import Profile from "../model/Profile";
import ManifestV2 from "../model/ManifestV2";
import { InstallArgs } from "./PackageInstaller";

export type LinkArgs = {
    profile: Profile;
    installDir: string,
};

export abstract class ProfileLinker {
    abstract perform(profile: Profile, gameDir: string): Promise<string[]>;
    // abstract unwind(args: LinkArgs): Promise<void>; <-- TODO
}
