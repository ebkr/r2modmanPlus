import * as path from 'path';

import ProfileProvider from '../providers/ror2/model_implementation/ProfileProvider';
import PathResolver from '../r2mm/manager/PathResolver';

interface ProfileCompatible {
    getProfileName: () => string;
    getPathOfProfile: () => string;
}

/**
 * ImmutableProfile does not know about the current active profile or
 * other parts of the app state. It's ideal to be used as a function
 * argument in cases where the active profile changing during the
 * execution would cause unwanted behaviour.
 */
export class ImmutableProfile implements ProfileCompatible {
    private readonly profileName: string = '';
    private readonly rootDir: string = '.';

    public constructor(name: string) {
        this.profileName = name;
        this.rootDir = path.join(PathResolver.MOD_ROOT, 'profiles');
        ProfileProvider.instance.ensureProfileDirectory(this.rootDir, this.profileName);
    }

    public getProfileName(): string {
        return this.profileName;
    }

    public getPathOfProfile(): string {
        return path.join(this.rootDir, this.profileName);
    }
}

let activeProfile: Profile;

/**
 * Profile updates and provides access to activeProfile singleton.
 * It's ideal to be used when an operation targets the active profile
 * but you don't have access to the it in the current scope.
 *
 * Note that while changes to the active game are reflected to already
 * instantiated objects, changes to the active profile are not. To get
 * guaranteed latest data, access instance methods via
 * Profile.getActiveProfile().
 */
export default class Profile implements ProfileCompatible {
    private readonly profileName: string = '';

    public constructor(name: string) {
        this.profileName = name;
        activeProfile = this;
    }

    public static getActiveProfile() {
        return activeProfile;
    }

    /**
     * Returns the root dir for profiles for the currently active game.
     * PathResolver.MOD_ROOT is updated when the active game changes.
     * E.g. DataFolder/[Game.internalFolderName]/profiles
     */
    public static getRootDir(): string {
        return path.join(PathResolver.MOD_ROOT, 'profiles');
    }

    public getProfileName(): string {
        return this.profileName;
    }

    public getPathOfProfile(): string {
        return path.join(Profile.getRootDir(), this.profileName);
    }
}
