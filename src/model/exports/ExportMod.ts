import VersionNumber from '../VersionNumber';
import ManifestV2 from '../ManifestV2';

export default class ExportMod {
    private name: string = '';
    private version: VersionNumber = new VersionNumber('0.0.0');

    public static fromManifest(mod: ManifestV2): ExportMod {
        const exportFormat = new ExportMod();
        exportFormat.name = mod.getName();
        exportFormat.version = mod.getVersionNumber();
        return exportFormat;
    }
}