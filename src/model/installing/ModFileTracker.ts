// Designed to be used to record state of which mods install to where.
export default class ModFileTracker {

    private readonly _modName: string;
    private readonly _files: Map<string, string>;

    constructor(modName: string, files: Map<string, string>) {
        this._modName = modName;
        this._files = files;
    }

    get modName(): string {
        return this._modName;
    }

    get files(): Map<string, string> {
        return this._files;
    }
}
