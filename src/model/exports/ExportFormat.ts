import ExportMod from './ExportMod';

export default class ExportFormat {
    private profileName: string = '';
    private mods: ExportMod[] = [];

    public constructor(name: string, modList: ExportMod[]) {
        this.profileName = name;
        this.mods = modList;
    }
}