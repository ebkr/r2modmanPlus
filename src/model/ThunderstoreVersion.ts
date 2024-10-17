import VersionNumber from './VersionNumber';
import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';
import CdnProvider from '../providers/generic/connection/CdnProvider';

export default class ThunderstoreVersion implements ReactiveObjectConverterInterface {

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

    public fromReactive(reactive: any): ThunderstoreVersion {
        this.setName(reactive.name);
        this.setVersionNumber(new VersionNumber('0.0.0').fromReactive(reactive.versionNumber));
        this.setDependencies(reactive.dependencies);
        this.setFullName(reactive.fullName);
        this.setDescription(reactive.description);
        this.setIcon(reactive.icon);
        this.enabled = reactive.enabled;
        this.setDownloadCount(reactive.downloadCount);
        this.setDownloadUrl(reactive.downloadUrl);
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
        return CdnProvider.addCdnQueryParameter(this.downloadUrl);
    }

    public setDownloadUrl(url: string) {
        this.downloadUrl = url;
    }
}
