import VersionNumber from '../VersionNumber';
import ManifestV2 from '../ManifestV2';

export default class ExportMod {
    private name: string = '';
    private version: VersionNumber = new VersionNumber('0.0.0');
    private enabled: boolean = false;

    public constructor(name: string, versionNumber: VersionNumber, enabled: boolean) {
        this.name = name;
        this.version = versionNumber;
        this.enabled = enabled;
    }

    public static fromManifest(mod: ManifestV2): ExportMod {
        const exportFormat = new ExportMod(mod.getName(), mod.getVersionNumber(), mod.isEnabled());
        return exportFormat;
    }

    public getName(): string {
        return this.name;
    }

    public getVersionNumber(): VersionNumber {
        return this.version;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }
}