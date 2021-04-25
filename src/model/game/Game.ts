import { StorePlatform } from '../../model/game/StorePlatform';
import StorePlatformMetadata from '../../model/game/StorePlatformMetadata';
import { GameSelectionDisplayMode } from '../../model/game/GameSelectionDisplayMode';

export default class Game {

    private readonly _displayName: string;
    private readonly _internalFolderName: string;
    private readonly _steamFolderName: string;
    private readonly _exeName: string[];
    private readonly _dataFolderName: string;
    private readonly _thunderstoreUrl: string;
    private readonly _exclusionsUrl: string;
    private readonly _storePlatformMetadata: StorePlatformMetadata[];
    private readonly _gameImage: string;
    private readonly _displayMode: GameSelectionDisplayMode;

    private _activePlatform: StorePlatformMetadata;

    constructor(displayName: string, internalFolderName: string,
                steamFolderName: string, exeName: string[], dataFolderName: string,
                tsUrl: string, exclusionsUrl: string, platforms: StorePlatformMetadata[], gameImage: string,
                displayMode: GameSelectionDisplayMode) {

        this._displayName = displayName;
        this._internalFolderName = internalFolderName;
        this._steamFolderName = steamFolderName;
        this._exeName = exeName;
        this._dataFolderName = dataFolderName;
        this._thunderstoreUrl = tsUrl;
        this._exclusionsUrl = exclusionsUrl;
        this._storePlatformMetadata = platforms;
        this._activePlatform = platforms[0];
        this._gameImage = gameImage;
        this._displayMode = displayMode;
    }

    get displayName(): string {
        return this._displayName;
    }

    get internalFolderName(): string {
        return this._internalFolderName;
    }

    get steamFolderName(): string {
        return this._steamFolderName;
    }

    get exeName(): string[] {
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

    get storePlatformMetadata(): StorePlatformMetadata[] {
        return this._storePlatformMetadata;
    }

    get activePlatform(): StorePlatformMetadata {
        return this._activePlatform;
    }

    public setActivePlatformByStore(storePlatform: StorePlatform) {
        this._activePlatform = this._storePlatformMetadata.find(platform => platform.storePlatform === storePlatform)!;
    }

    get gameImage(): string {
        return this._gameImage;
    }

    get displayMode(): GameSelectionDisplayMode {
        return this._displayMode;
    }
}
