export default class ExportMod {
    private profileName: string = '';
    private mods: ExportMod[] = [];

    public constructor(name: string, modList: ExportMod[]) {
        this.profileName = name;
        this.mods = modList;
    }
}