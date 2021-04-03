import Dexie from 'dexie';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import Game from '../../model/game/Game';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import GameManager from '../../model/game/GameManager';
import { StorePlatform } from 'src/model/game/StorePlatform';
import { GameSelectionViewMode } from 'src/model/enums/GameSelectionViewMode';

export default class SettingsDexieStore extends Dexie {

    global: Dexie.Table<SettingsInterface, number>;
    gameSpecific: Dexie.Table<SettingsInterface, number>;
    activeGame: Game;

    constructor(game: Game) {
        super(`settings`);
        this.version(1).stores({
            value: `++id,settings`,
        });

        const store = {
            value: `++id,settings`
        } as any;

        GameManager.gameList
            .forEach(value => {
                store[value.internalFolderName] = `++id,settings`;
            });

        // Add all games to store. Borked v2-3 locally
        // Increment per game or change to settings.
        this.version(7).stores(store);

        this.activeGame = game;
        this.global = this.table("value");
        this.gameSpecific = this.table(game.internalFolderName);
    }

    public async getLatestGlobal(): Promise<ManagerSettingsInterfaceGlobal_V2> {
        return this.global.toArray().then(result => {
            if (result.length > 0) {
                const globalEntry = result[result.length - 1];
                const parsed = JSON.parse(globalEntry.settings);
                if ((parsed as ManagerSettingsInterfaceGlobal_V2).version) {
                    // Is modern (at least V2).
                    return parsed;
                } else {
                    // Is legacy.
                    const legacyToV2 = this.mapLegacyToV2(parsed, this.activeGame);
                    this.global.put({ settings: JSON.stringify(legacyToV2.global) });
                    this.gameSpecific.put({ settings: JSON.stringify(legacyToV2.gameSpecific) });
                    return legacyToV2.global;
                }
            } else {
                ManagerSettings.NEEDS_MIGRATION = true;
                const obj = this.createNewSettingsInstance();
                this.global.put({ settings: JSON.stringify(obj.global) });
                this.gameSpecific.put({ settings: JSON.stringify(obj.gameSpecific) });
                return obj.global;
            }
        });
    }

    public async getLatestGameSpecific(): Promise<ManagerSettingsInterfaceGame_V2> {
        return this.gameSpecific.toArray().then(result => {
            if (result.length > 0) {
                const globalEntry = result[result.length - 1];
                const parsed = JSON.parse(globalEntry.settings);
                if ((parsed as ManagerSettingsInterfaceGame_V2).version === 2) {
                    // Is modern (at least V2).
                    return parsed;
                } else {
                    // Placeholder for future migration
                    return;
                }
            } else {
                const obj = this.createNewSettingsInstance();
                this.gameSpecific.put({ settings: JSON.stringify(obj.gameSpecific) });
                return obj.gameSpecific;
            }
        });
    }

    public async getLatest(): Promise<ManagerSettingsInterfaceHolder> {
        const latestGlobal = await this.getLatestGlobal();
        const latestGameSpecific = await this.getLatestGameSpecific();
        return {
            global: latestGlobal,
            gameSpecific: latestGameSpecific
        };
    }

    private createNewSettingsInstance(): ManagerSettingsInterfaceHolder {
        return {
            global: {
                darkTheme: true,
                dataDirectory: "",
                expandedCards: false,
                funkyModeEnabled: false,
                ignoreCache: false,
                steamDirectory: null,
                lastSelectedGame: null,
                version: 2,
                favouriteGames: [],
                defaultGame: undefined,
                defaultStore: undefined,
                gameSelectionViewMode: GameSelectionViewMode.CARD
            },
            gameSpecific: {
                version: 2,
                gameDirectory: null,
                installedDisablePosition: EnumResolver.from(SortLocalDisabledMods, SortLocalDisabledMods.CUSTOM)!,
                installedSortBy: EnumResolver.from(SortNaming, SortNaming.CUSTOM)!,
                installedSortDirection: EnumResolver.from(SortDirection, SortDirection.STANDARD)!,
                lastSelectedProfile: "Default",
                launchParameters: "",
                linkedFiles: []
            }
        }
    }

    public async save(holder: ManagerSettingsInterfaceHolder) {
        await this.global.toArray().then(result => {
            for (let settingsInterface of result) {
                this.global.update(settingsInterface.id!, {settings: JSON.stringify(holder.global)});
            }
        });
        await this.gameSpecific.toArray().then(result => {
            for (let settingsInterface of result) {
                this.gameSpecific.update(settingsInterface.id!, {settings: JSON.stringify(holder.gameSpecific)});
            }
        });
    }

    private mapLegacyToV2(itf: ManagerSettingsInterface_Legacy, game: Game): ManagerSettingsInterfaceHolder {
        return {
            global: {
                darkTheme: itf.darkTheme,
                dataDirectory: itf.dataDirectory,
                expandedCards: itf.expandedCards,
                funkyModeEnabled: itf.funkyModeEnabled,
                ignoreCache: itf.ignoreCache,
                steamDirectory: itf.steamDirectory,
                lastSelectedGame: null,
                version: 2,
                favouriteGames: [],
                defaultGame: undefined,
                defaultStore: undefined,
                gameSelectionViewMode: GameSelectionViewMode.CARD
            },
            gameSpecific: {
                version: 2,
                gameDirectory: game.displayName === "Risk of Rain 2" ? itf.riskOfRain2Directory : null,
                installedDisablePosition: itf.installedDisablePosition,
                installedSortBy: itf.installedDisablePosition,
                installedSortDirection: itf.installedSortDirection,
                lastSelectedProfile: itf.lastSelectedProfile,
                launchParameters: itf.launchParameters,
                linkedFiles: itf.linkedFiles
            }
        }
    }

}

interface SettingsInterface {
    id?: number;
    settings: string;
}

/**
 * Legacy interface as manager was designed to originally only support Risk of Rain 2.
 * Expanding supported games means that the "riskOfRain2Directory" setting should no longer be global.
 */
export interface ManagerSettingsInterface_Legacy {
    riskOfRain2Directory: string | null;
    steamDirectory: string | null;
    lastSelectedProfile: string;
    funkyModeEnabled: boolean;
    expandedCards: boolean;
    linkedFiles: string[];
    darkTheme: boolean;
    launchParameters: string;
    ignoreCache: boolean;
    dataDirectory: string;
    installedSortBy: string;
    installedSortDirection: string;
    installedDisablePosition: string;
}

/**
 * These settings should persist regardless of the game selected.
 */
export interface ManagerSettingsInterfaceGlobal_V2 {
    version: number;
    steamDirectory: string | null;
    funkyModeEnabled: boolean;
    expandedCards: boolean;
    darkTheme: boolean;
    ignoreCache: boolean;
    dataDirectory: string;
    lastSelectedGame: string | null;
    favouriteGames: string[] | undefined;
    defaultGame: string | undefined;
    defaultStore: StorePlatform | undefined;
    gameSelectionViewMode: string | undefined;
}

/**
 * These settings should only be applied on a per-game basis.
 */
export interface ManagerSettingsInterfaceGame_V2 {
    version: number;
    gameDirectory: string | null;
    lastSelectedProfile: string;
    linkedFiles: string[];
    launchParameters: string;
    installedSortBy: string;
    installedSortDirection: string;
    installedDisablePosition: string;
}

/**
 * Helper interface to neatly store settings internally.
 */
export interface ManagerSettingsInterfaceHolder {
    global: ManagerSettingsInterfaceGlobal_V2;
    gameSpecific: ManagerSettingsInterfaceGame_V2;
}
