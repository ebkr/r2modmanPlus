import InvalidManifestError from './errors/Manifest/InvalidManifestError';
import VersionNumber from './VersionNumber';
import ThunderstoreCombo from './ThunderstoreCombo';
import InstallMode from './enums/InstallMode';
import PackageType from './enums/PackageType';
import NetworkMode from './enums/NetworkMode';

import * as path from 'path';
import PathResolver from '../r2mm/manager/PathResolver';
import R2Error from './errors/R2Error';

export default class ManifestV2 {

    private manifestVersion: number = 1;

    private name: string = '';
    private authorName: string = '';
    private websiteUrl: string = '';
    private displayName: string = '';
    private description: string = '';
    private gameVersion: string = '';
    private networkMode: string = '';
    private packageType: string = '';
    private installMode: string = '';
    private installedAtTime: number = 0;

    private loaders: string[] = [];
    private dependencies: string[] = [];
    private incompatibilities: string[] = [];
    private optionalDependencies: string[] = [];

    private versionNumber: VersionNumber = new VersionNumber('0.0.0');
    private enabled: boolean = true;
    private icon: string = '';

    // Will create a ManifestV2 object from a given manifest.
    // If manifest is V1, convert as much as possible to V2.
    public make(data: any): InvalidManifestError | ManifestV2  {
        if (data.ManifestVersion === undefined) {
            return this.fromUnsupported(data);
        }
        this.setManifestVersion(data.ManifestVersion);
        this.setName(data.Name);
        this.setAuthorName(data.AuthorName);
        this.setWebsiteUrl(data.WebsiteUrl);
        this.setDisplayName(data.DisplayName);
        this.setDescription(data.Description);
        this.setGameVersion(data.GameVersion);
        this.setNetworkMode(data.NetworkMode);
        this.setPackageType(data.PackageType);
        this.setInstallMode(data.InstallMode);
        this.setLoaders(data.Loaders);
        this.setDependencies(data.Dependencies);
        this.setIncompatibilities(data.Incompatibilities);
        this.setOptionalDependencies(data.OptionalDependencies);
        this.setVersionNumber(new VersionNumber(data.Version));
        this.setInstalledAtTime(data.installedAtTime || 0);
        return this;
    }

    public makeSafe(data: any): R2Error | ManifestV2 {
        if (data.ManifestVersion === undefined || data.ManifestVersion != 2) {
            return new R2Error('Manifest is not V2', 'Manifest version is not supported',
                'Contact the mod author to ask for a ManifestV2 zip. If they\'re unsure how, they can follow the guide here:\nhttps://github.com/ebkr/r2modmanPlus/wiki/Installing-mods-locally#developers');
        }
        return this.make(data);
    }

    // Intended to be used to import a mod with only minimal fields specified.
    // Should support manifest V1. Defaults to an "Unknown" author field if not found.
    public makeSafeFromPartial(data: any): R2Error | ManifestV2 {
        // Safety net to ensure author and Author field aren't both undefined.
        // (Partial should include at least one of these).
        if (data.author !== data.AuthorName) {
            this.setManifestVersion(2);
            this.setAuthorName(data.AuthorName || data.author || "Unknown");
            this.setName(data.Name || `${this.getAuthorName()}-${data.name}`);
            this.setWebsiteUrl(data.WebsiteURL || data.website_url || "");
            this.setDisplayName(data.DisplayName || data.name);
            this.setDescription(data.Description || data.description || "");
            this.setVersionNumber(new VersionNumber(data.Version || data.version_number));
            this.setDependencies(data.Dependencies || data.dependencies || []);
            return this;
        }
        return new R2Error("Manifest failed to be validated.", "The manifest is missing an author field.", "Add the author field to the manifest.json file manually.");
    }

    private fromUnsupported(data: any): ManifestV2 {
        return this;
    }

    public fromThunderstoreCombo(combo: ThunderstoreCombo): ManifestV2 {
        this.setManifestVersion(1);
        this.setAuthorName(combo.getMod().getOwner());
        this.setDisplayName(combo.getMod().getName());
        this.setName(combo.getMod().getFullName());
        this.setDescription(combo.getVersion().getDescription());
        this.setNetworkMode(NetworkMode.BOTH);
        this.setPackageType(PackageType.OTHER);
        this.setInstallMode(InstallMode.MANAGED);
        this.setDependencies(combo.getVersion().getDependencies());
        this.setVersionNumber(combo.getVersion().getVersionNumber());
        this.setWebsiteUrl(combo.getMod().getPackageUrl());
        this.setGameVersion('0');
        this.icon = path.join(PathResolver.MOD_ROOT, 'cache', this.getName(), this.versionNumber.toString(), 'icon.png');
        return this;
    }

    public fromJsObject(jsManifestObject: any): ManifestV2 {
        this.setManifestVersion(jsManifestObject.manifestVersion);
        this.setName(jsManifestObject.name);
        this.setAuthorName(jsManifestObject.authorName);
        this.setWebsiteUrl(jsManifestObject.websiteUrl);
        this.setDisplayName(jsManifestObject.displayName);
        this.setDescription(jsManifestObject.description);
        this.setGameVersion(jsManifestObject.gameVersion);
        this.setNetworkMode(jsManifestObject.networkMode);
        this.setPackageType(jsManifestObject.packageType);
        this.setInstallMode(jsManifestObject.installMode);
        this.setLoaders(jsManifestObject.loaders);
        this.setDependencies(jsManifestObject.dependencies);
        this.setIncompatibilities(jsManifestObject.incompatibilities);
        this.setOptionalDependencies(jsManifestObject.optionalDependencies);
        const versionNumber = jsManifestObject.versionNumber;
        this.setVersionNumber(new VersionNumber(`${versionNumber.major}.${versionNumber.minor}.${versionNumber.patch}`));
        this.setGameVersion(jsManifestObject.gameVersion);
        this.icon = path.join(PathResolver.MOD_ROOT, 'cache', this.getName(), this.versionNumber.toString(), 'icon.png');
        this.setInstalledAtTime(jsManifestObject.installedAtTime || 0);
        if (!jsManifestObject.enabled) {
            this.disable();
        }
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getManifestVersion(): number {
        return this.manifestVersion;
    }

    private setManifestVersion(version: number) {
        this.manifestVersion = version;
    }

    public getAuthorName(): string {
        return this.authorName;
    }

    public setAuthorName(name: string) {
        this.authorName = name;
    }

    public getWebsiteUrl(): string {
        return this.websiteUrl;
    }

    public setWebsiteUrl(url: string) {
        this.websiteUrl = url;
    }


    public getDisplayName(): string {
        return this.displayName;
    }

    public setDisplayName(name: string) {
        this.displayName = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getGameVersion(): string {
        return this.gameVersion;
    }

    public setGameVersion(version: string) {
        this.gameVersion = version;
    }

    public getNetworkMode(): string {
        return this.networkMode;
    }

    public setNetworkMode(mode: string) {
        this.networkMode = mode;
    }

    public getPackageType(): string {
        return this.packageType;
    }

    public setPackageType(type: string) {
        this.packageType = type;
    }

    public getInstallMode(): string {
        return this.installMode;
    }

    public setInstallMode(mode: string) {
        this.installMode = mode;
    }

    public getLoaders(): string[] {
        return this.loaders;
    }

    public setLoaders(loaders: string[]) {
        this.loaders = loaders;
    }

    public getDependencies(): string[] {
        return this.dependencies;
    }

    public setDependencies(dependencies: string[]) {
        this.dependencies = dependencies;
    }

    public getIncompatibilities(): string[] {
        return this.incompatibilities;
    }

    public setIncompatibilities(incompatibilties: string[]) {
        this.incompatibilities = incompatibilties;
    }

    public getOptionalDependencies(): string[] {
        return this.optionalDependencies;
    }

    public setOptionalDependencies(dependencies: string[]) {
        this.optionalDependencies = dependencies;
    }

    public getVersionNumber(): VersionNumber {
        return this.versionNumber;
    }

    public setVersionNumber(version: VersionNumber) {
        this.versionNumber = version;
    }

    public enable() {
        this.enabled = true;
    }

    public disable() {
        this.enabled = false;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public getIcon(): string {
        return this.icon;
    }

    public setIcon(iconUri: string) {
        this.icon = iconUri;
    }

    public getInstalledAtTime(): number {
        return this.installedAtTime;
    }

    public setInstalledAtTime(installedAtTime: number) {
        this.installedAtTime = installedAtTime;
    }

    public getDependencyString(): string {
        return `${this.getName()}-${this.getVersionNumber().toString()}`;
    }
}
