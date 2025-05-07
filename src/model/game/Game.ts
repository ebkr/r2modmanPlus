import R2Error from '../errors/R2Error';
import StorePlatformMetadata from '../../model/game/StorePlatformMetadata';
import { PackageLoader } from '../../model/installing/PackageLoader';
import { GameInstanceType, GameSelectionDisplayMode, Platform } from '../../model/schema/ThunderstoreSchema';

export default class Game {

    private readonly _displayName: string;
    private readonly _internalFolderName: string;
    private readonly _steamFolderName: string;
    private readonly _settingsIdentifier: string;
    private readonly _exeName: string[];
    private readonly _dataFolderName: string;
    private readonly _thunderstoreUrl: string;
    private readonly _storePlatformMetadata: StorePlatformMetadata[];
    private readonly _gameImage: string;
    private readonly _displayMode: GameSelectionDisplayMode;
    private readonly _instanceType: GameInstanceType;
    private readonly _packageLoader: PackageLoader;
    // Exists for when a game title is too long. Still allows searching using the real game name.
    private readonly _additionalSearchStrings: string[];

    private _activePlatform: StorePlatformMetadata;

    constructor(displayName: string, internalFolderName: string, settingsIdentifier: string,
                steamFolderName: string, exeName: string[], dataFolderName: string,
                tsUrl: string, platforms: StorePlatformMetadata[], gameImage: string,
                displayMode: GameSelectionDisplayMode, instanceType: GameInstanceType, packageLoader: PackageLoader, additionalSearchStrings?: string[]) {

        this._displayName = displayName;
        this._internalFolderName = internalFolderName;
        this._settingsIdentifier = settingsIdentifier;
        this._steamFolderName = steamFolderName;
        this._exeName = exeName;
        this._dataFolderName = dataFolderName;
        this._thunderstoreUrl = tsUrl;
        this._storePlatformMetadata = platforms;
        this._activePlatform = platforms[0];
        this._gameImage = gameImage;
        this._displayMode = displayMode;
        this._instanceType = instanceType;
        this._packageLoader = packageLoader;
        this._additionalSearchStrings = additionalSearchStrings || [];
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

    get settingsIdentifier(): string {
        return this._settingsIdentifier;
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

    get storePlatformMetadata(): StorePlatformMetadata[] {
        return this._storePlatformMetadata;
    }

    get activePlatform(): StorePlatformMetadata {
        return this._activePlatform;
    }

    public setActivePlatformByStore(storePlatform: Platform) {
        const platform = this._storePlatformMetadata.find(platform => platform.storePlatform === storePlatform);

        if (!platform) {
            throw new R2Error(
                "Invalid store platform",
                `"${storePlatform}" is not a valid platform for ${this.displayName}.`
            );
        };

        this._activePlatform = platform;
    }

    get gameImage(): string {
        return this._gameImage;
    }

    get displayMode(): GameSelectionDisplayMode {
        return this._displayMode;
    }

    get instanceType(): GameInstanceType {
        return this._instanceType;
    }

    get packageLoader(): PackageLoader {
        return this._packageLoader;
    }

    get additionalSearchStrings(): string[] {
        return this._additionalSearchStrings;
    }

    get isInstalledViaSteam(): boolean {
        return [Platform.STEAM, Platform.STEAM_DIRECT].includes(this._activePlatform.storePlatform);
    }
}
