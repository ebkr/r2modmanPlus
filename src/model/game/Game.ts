export default class Game {

    private readonly _displayName: string;
    private readonly _appId: number;
    private readonly _internalFolderName: string;
    private readonly _steamFolderName: string;
    private readonly _exeName: string;
    private readonly _dataFolderName: string;
    private readonly _thunderstoreUrl: string;
    private readonly _exclusionsUrl: string;
    private readonly _linuxNative: boolean;

    constructor(displayName: string, appid: number, internalFolderName: string,
                steamFolderName: string, exeName: string, dataFolderName: string,
                tsUrl: string, exclusionsUrl: string, linuxNative: boolean) {

        this._displayName = displayName;
        this._appId = appid;
        this._internalFolderName = internalFolderName;
        this._steamFolderName = steamFolderName;
        this._exeName = exeName;
        this._dataFolderName = dataFolderName;
        this._thunderstoreUrl = tsUrl;
        this._exclusionsUrl = exclusionsUrl;
        this._linuxNative = linuxNative;
    }

    get displayName(): string {
        return this._displayName;
    }

    get appId(): number {
        return this._appId;
    }

    get internalFolderName(): string {
        return this._internalFolderName;
    }

    get steamFolderName(): string {
        return this._steamFolderName;
    }

    get exeName(): string {
        return this._exeName;
    }

    get dataFolderName(): string {
        return this._dataFolderName;
    }

    get thunderstoreUrl(): string {
        return this._thunderstoreUrl;
    }

    get exclusionsUrl(): string {
        return this._exclusionsUrl;
    }

    get linuxNative(): boolean {
        return this._linuxNative;
    }
}
