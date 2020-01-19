import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs-extra';
import PathResolver from 'src/r2mm/manager/PathResolver';

let activeProfile: Profile;

export default class Profile {

    private profileName: string = '';
    private directory: string = '.';

    public constructor(name: string) {
        this.profileName = name;
        this.directory = path.join(PathResolver.ROOT, 'mods', 'profiles')
        if (!fs.existsSync(path.join(this.directory, this.profileName))) {
            fs.mkdirsSync(path.join(this.directory, this.profileName));
        }
        activeProfile = this;
    }

    // Profile name
    public getProfileName(): string {
        return this.profileName;
    }

    // Directory of profile folder (/mods/profiles/)
    public getDirectory(): string {
        return this.directory;
    }

    // Directory of profile (/mods/profiles/a_profile)
    public getPathOfProfile(): string {
        return path.join(this.directory, this.profileName);
    }

    public static getActiveProfile() {
        return activeProfile;
    }

}