import Mod from './Mod';
import VersionNumber from './VersionNumber';

export default class ThunderstoreVersion extends Mod {

    private downloads: number = 0;

    public make(version: any): ThunderstoreVersion {
        this.setName(version.name);
        this.setFullName(version.full_name);
        this.setDependencies(version.dependencies);
        this.setDescription(version.description);
        this.setVersionNumber(new VersionNumber(version.version_number));
        this.setIcon(version.icon);
        this.setDownloadCount(version.downloads);
        return this;
    }

    public getDownloadCount(): number {
        return this.downloads;
    }

    public setDownloadCount(downloads: number) {
        this.downloads = downloads;
    }
}