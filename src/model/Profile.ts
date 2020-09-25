import * as path from 'path'
import * as fs from 'fs-extra'
import PathResolver from '../r2mm/manager/PathResolver';
import ProfileProvider from '../providers/ror2/model_implementation/ProfileProvider';

let activeProfile: Profile;

export default class Profile {

    private readonly profileName: string = '';
    private readonly directory: string = '.';

    public constructor(name: string) {
        this.profileName = name;
        this.directory = this.getDirectory();
        ProfileProvider.instance.ensureProfileDirectory(this.directory, this.profileName);
        activeProfile = this;
    }

    // Profile name
    public getProfileName(): string {
        return this.profileName;
    }

    // Directory of profile folder (/mods/profiles/)
    public getDirectory(): string {
        return Profile.getDirectory();
    }

    public static getDirectory(): string {
        return path.join(PathResolver.MOD_ROOT, 'profiles');
    }

    // Directory of profile (/mods/profiles/a_profile)
    public getPathOfProfile(): string {
        return path.join(this.directory, this.profileName);
    }

    public static getActiveProfile() {
        return activeProfile;
    }

}
