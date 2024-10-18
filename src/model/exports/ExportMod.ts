import VersionNumber from '../VersionNumber';
import ManifestV2 from '../ManifestV2';

export default class ExportMod {
    private readonly name: string = '';
    private readonly version: VersionNumber = new VersionNumber('0.0.0');
    private readonly enabled: boolean = false;

    public constructor(name: string, versionNumber: VersionNumber, enabled: boolean) {
        this.name = name;
        this.version = versionNumber;
        this.enabled = enabled;
    }

    public static fromManifest(mod: ManifestV2): ExportMod {
        const exportFormat = new ExportMod(mod.getName(), mod.getVersionNumber(), mod.isEnabled());
        return exportFormat;
    }

    public static fromFullString(modStr: string): ExportMod {
        const name = modStr.match(new RegExp("(.+)-\\d+\\.\\d+\\.\\d+$"));
        let resolvedName: string;
        if (name !== null) {
            resolvedName = name[1];
        } else {
            resolvedName = "";
        }
        const version = modStr.match(new RegExp("\\d+\\.\\d+\\.\\d+$"));
        let resolvedVersion: VersionNumber;
        if (version !== null) {
            resolvedVersion = new VersionNumber(version[0]);
        } else {
            resolvedVersion = new VersionNumber("0.0.0");
        }
        return new ExportMod(resolvedName, resolvedVersion, true);
    }

    public getName(): string {
        return this.name;
    }

    public getVersionNumber(): VersionNumber {
        return this.version;
    }

    public getDependencyString(): string {
        return `${this.name}-${this.version}`;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }
}
