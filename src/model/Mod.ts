import VersionNumber from './VersionNumber';
import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';
import ModFromManifest from 'src/r2mm/mods/ModFromManifest';
import R2Error from './errors/R2Error';

export default class Mod implements ReactiveObjectConverterInterface {
    private name: string = '';
    private versionNumber: VersionNumber = new VersionNumber('0.0.0');
    private dependencies: string[] = [];
    private fullName: string = '';
    private description: string = ''
    private icon: string = ''

    public fromManifest(): Mod | R2Error {
        return ModFromManifest.get(this.getFullName(), this.getVersionNumber());
    }

    public fromReactive(reactive: any): Mod {
        this.setName(reactive.name);
        this.setVersionNumber(new VersionNumber('0.0.0').fromReactive(reactive.versionNumber));
        this.setDependencies(reactive.dependencies);
        this.setFullName(reactive.fullName);
        this.setDescription(reactive.description);
        this.setIcon(reactive.icon);
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

}