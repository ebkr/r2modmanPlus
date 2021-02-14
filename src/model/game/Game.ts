export default class Game {

    private readonly _displayName: string;
    private readonly _appId: number;
    private readonly _folderName: string;
    private readonly _exeName: string;
    private readonly _dataFolderName: string;
    private readonly _thunderstoreUrl: string;
    private readonly _exclusionsUrl: string;

    constructor(displayName: string, appid: number, internalFolderName: string,
                exeName: string, dataFolderName: string, tsUrl: string,
                exclusionsUrl: string) {

        this._displayName = displayName;
        this._appId = appid;
        this._folderName = internalFolderName;
        this._exeName = exeName;
        this._dataFolderName = dataFolderName;
        this._thunderstoreUrl = tsUrl;
        this._exclusionsUrl = exclusionsUrl;
    }

    get displayName(): string {
        return this._displayName;
    }

    get appId(): number {
        return this._appId;
    }

    get folderName(): string {
        return this._folderName;
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
}
