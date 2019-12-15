import VersionNumber from './VersionNumber';

export default class Mod {
    private name: string = '';
    private versionNumber: VersionNumber = new VersionNumber('0.0.0');
    private dependencies: string[] = [];
    private fullName: string = '';
    private description: string = ''
    private icon: string = ''

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

}