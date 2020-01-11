// Used to map mod list of r2modman versions prior to V3.
// Only include fields we care about

import VersionNumber from '../VersionNumber';

export default class LegacyModList {

    private FullName: string = '';
    private Version: VersionNumber = new VersionNumber('0.0.0');

    public constructor(data: any) {
        this.FullName = data.FullName;
        this.Version = new VersionNumber(`${data.Version.Major}.${data.Version.Minor}.${data.Version.Patch}`);
    }

    public getFullName(): string {
        return this.FullName;
    }

    public getVersion(): VersionNumber {
        return this.Version;
    }

}