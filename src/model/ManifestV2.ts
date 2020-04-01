import InvalidManifestError from './errors/Manifest/InvalidManifestError';
import VersionNumber from './VersionNumber';
import ThunderstoreMod from './ThunderstoreMod';
import ThunderstoreVersion from './ThunderstoreVersion';
import InstallMode from './enums/InstallMode';
import PackageType from './enums/PackageType';
import NetworkMode from './enums/NetworkMode';
import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';

import * as path from 'path';
import PathResolver from 'src/r2mm/manager/PathResolver';

export default class ManifestV2 implements ReactiveObjectConverterInterface {

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
        this.setVersionNumber(new VersionNumber(data.VersionNumber));
        return this;
    }

    private fromUnsupported(data: any): ManifestV2 {
        return this;
    }

    public fromThunderstoreMod(mod: ThunderstoreMod, version: ThunderstoreVersion): ManifestV2 {
        this.setManifestVersion(1);
        this.setAuthorName(mod.getOwner());
        this.setDisplayName(mod.getName());
        this.setName(mod.getFullName());
        this.setDescription(version.getDescription());
        this.setNetworkMode(NetworkMode.BOTH);
        this.setPackageType(PackageType.OTHER);
        this.setInstallMode(InstallMode.MANAGED);
        this.setDependencies(version.getDependencies());
        this.setVersionNumber(version.getVersionNumber());
        this.setWebsiteUrl(mod.getPackageUrl());
        this.setGameVersion('0');
        return this;
    }

    public fromReactive(reactive: any): ManifestV2 {
        this.setManifestVersion(reactive.manifestVersion);
        this.setName(reactive.name);
        this.setAuthorName(reactive.authorName);
        this.setWebsiteUrl(reactive.websiteUrl);
        this.setDisplayName(reactive.displayName);
        this.setDescription(reactive.description);
        this.setGameVersion(reactive.gameVersion);
        this.setNetworkMode(reactive.networkMode);
        this.setPackageType(reactive.packageType);
        this.setInstallMode(reactive.installMode);
        this.setLoaders(reactive.loaders);
        this.setDependencies(reactive.dependencies);
        this.setIncompatibilities(reactive.incompatibilities);
        this.setOptionalDependencies(reactive.optionalDependencies);
        const versionNumber = reactive.versionNumber;
        this.setVersionNumber(new VersionNumber(`${versionNumber.major}.${versionNumber.minor}.${versionNumber.patch}`));
        this.setGameVersion(reactive.gameVersion);
        this.icon = path.join(PathResolver.ROOT, 'mods', 'cache', this.getName(), this.versionNumber.toString(), 'icon.png');
        if (!reactive.enabled) {
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

}