import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs-extra';

let activeProfile: Profile;

export default class Profile {

    private profileName: string = '';
    private directory: string = '.';

    public constructor(name: string) {
        this.profileName = name;
        this.directory = path.join(process.cwd(), 'mods', 'profiles')
        fs.mkdirsSync(path.join(this.directory, this.profileName));
        activeProfile = this;
    }

    public getProfileName(): string {
        return this.profileName;
    }

    public getDirectory(): string {
        return this.directory;
    }

    public getPathOfProfile(): string {
        return path.join(this.directory, this.profileName);
    }

    public static getActiveProfile() {
        return activeProfile;
    }

}