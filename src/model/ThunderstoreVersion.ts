import VersionNumber from './VersionNumber';
import CdnProvider from '../providers/generic/connection/CdnProvider';

export default class ThunderstoreVersion  {

    private name: string = '';
    private versionNumber: VersionNumber = new VersionNumber('0.0.0');
    private dependencies: string[] = [];
    private fullName: string = '';
    private description: string = ''
    private icon: string = ''
    private enabled: boolean = true;
    private downloads: number = 0;
    private downloadUrl: string = '';

    public static parseFromThunderstoreData(data: any): ThunderstoreVersion {
        const version = new ThunderstoreVersion();
        version.make(data);
        return version;
    }

    public make(version: any): ThunderstoreVersion {
        this.setName(version.name);
        this.setFullName(version.full_name);
        this.setDependencies(version.dependencies);
        this.setDescription(version.description);
        this.setVersionNumber(new VersionNumber(version.version_number));
        this.setIcon(version.icon);
        this.setDownloadCount(version.downloads);
        this.setDownloadUrl(version.download_url);
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getVersionNumber(): VersionNumber {
        return this.versionNumber;
    }

    public setVersionNumber(versionNumber: VersionNumber) {
        this.versionNumber = versionNumber;
    }

    public getDependencies(): string[] {
        return this.dependencies;
    }

    public setDependencies(dependencies: string[]) {
        this.dependencies = dependencies;
    }

    public getFullName(): string {
        return this.fullName;
    }

    public setFullName(name: string) {
        this.fullName = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getIcon(): string {
        return this.icon;
    }

    public setIcon(icon: string) {
        this.icon = icon;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public enable() {
        this.enabled = true;
    }

    public disable() {
        this.enabled = false;
    }

    public getDownloadCount(): number {
        return this.downloads;
    }

    public setDownloadCount(downloads: number) {
        this.downloads = downloads;
    }

    public getDownloadUrl(): string {
        let url = this.downloadUrl;
        if (this.name === 'Valyrim') {
            console.log("Intercepted download URL")
            url = "https://thunderstore.io/package/download/Belze/Valyrim_Music/1.0.0/"
        }
        return CdnProvider.addCdnQueryParameter(url);
    }

    public setDownloadUrl(url: string) {
        this.downloadUrl = url;
    }
}
