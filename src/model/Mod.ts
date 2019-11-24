import VersionNumber from "./VersionNumber";

export default class Mod {
    private name: string = '';
    private versionNumber: VersionNumber = new VersionNumber("0.0.0");

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

}