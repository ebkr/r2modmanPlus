import Dexie from 'dexie';
import Game from '../../model/game/Game';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import { Platform } from '../../model/schema/ThunderstoreSchema';
import { GameSelectionViewMode } from '../../model/enums/GameSelectionViewMode';
import GameManager from '../../model/game/GameManager'
import {LaunchType} from "../../model/real_enums/launch/LaunchType";

export const SETTINGS_DB_NAME = "settings";

export default class SettingsDexieStore extends Dexie {

    activeGame: Game;
    games: Dexie.Table<GameSettingsInterface, string>;
    global: Dexie.Table<SettingsInterface, number>;

    constructor(game: Game) {
        super(SETTINGS_DB_NAME);
        this.version(1).stores({
            value: `++id,settings`,
        });

        const store = {
            value: `++id,settings`,
            games: `identifier,settings`,
        } as any;

        // Setup the v3 (>= 75) dexie store.
        // This contains the following tables:
        // - `games`: (settingsIdentifier,settings) <-- Game-specific settings.
        // - `value`: (++id, settings)              <-- Global settings.
        this.version(75).stores(store).upgrade(async (tx) => {
            // Migrate the current game's legacy (v2) table to the v3 schema, if applicable - versions < 75.
            //
            // v2 (whose types we still utilize) stored game-specific settings in individual tables.
            // This worked but required us to bump the Dexie store version every time we added a new game. Yuck!
            // To get around this we have moved all game settings into the `games` table, where the key
            // is the settings identifier of the game, and the value is a JSON string.
            for (const game of GameManager.gameList) {
                let gameTable;

                try {
                    gameTable = tx.table(game.settingsIdentifier);
                } catch {
                    continue;
                }

                const legacyEntry = await gameTable.toCollection().first();
                if (legacyEntry === undefined) {
                    continue;
                }

                // If the legacy game table exists AND it contains a valid settings field, write it to the games table.
                // Then clear the contents of the legacy game table.
                await this.games.put({ identifier: gameTable.name, settings: legacyEntry.settings });
                await gameTable.clear();
            }
        })

        this.activeGame = game;
        console.debug("SettingsDexieStore created with active game", this.activeGame.settingsIdentifier);
        this.global = this.table("value");
        this.games = this.table("games");
    }

    public async getLatestGlobal(): Promise<ManagerSettingsInterfaceGlobal_V2> {
        const global = await this.global.get(1);

        // Create the global settings row if it does not already exist.
        if (global === undefined) {
            const newSettings = this.createNewSettingsInstance();
            await this.global.put({ settings: JSON.stringify(newSettings.global) });
            return newSettings.global;
        }

        // Otherwise parse and return the settings field.
        return JSON.parse(global.settings);
    }

    public async getLatestGameSpecific(): Promise<ManagerSettingsInterfaceGame_V2> {
        const identifier = this.activeGame.settingsIdentifier;
        const game = await this.games.get(identifier);

        if (game !== undefined) {
            return JSON.parse(game.settings);
        }

        let newGame = this.createNewSettingsInstance();
        await this.games.put({ identifier: identifier, settings: JSON.stringify(newGame.gameSpecific) });

        return newGame.gameSpecific;
    }

    public async getLatest(): Promise<ManagerSettingsInterfaceHolder> {
        const get = async () => {
            const latestGlobal = await this.getLatestGlobal();
            const latestGameSpecific = await this.getLatestGameSpecific();
            return {
                global: latestGlobal,
                gameSpecific: latestGameSpecific
            };
        };

        return await this.transaction("rw!", this.global, this.games, get);
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
                gameSelectionViewMode: GameSelectionViewMode.CARD,
                previewPanelWidth: 500,
                linuxUseFlatpak: null,
            },
            gameSpecific: {
                version: 2,
                gameDirectory: null,
                installedDisablePosition: EnumResolver.from<SortLocalDisabledMods>(SortLocalDisabledMods, SortLocalDisabledMods.CUSTOM),
                installedSortBy: EnumResolver.from<SortNaming>(SortNaming, SortNaming.CUSTOM),
                installedSortDirection: EnumResolver.from<SortDirection>(SortDirection, SortDirection.STANDARD),
                lastSelectedProfile: "Default",
                launchParameters: "",
                linkedFiles: [],
                launchType: LaunchType.AUTO,
                lastSelectedPlatform: null,
            }
        }
    }

    public async save(holder: ManagerSettingsInterfaceHolder) {
        const update = async () => {
            // Update global settings.
            await this.global.toArray().then(async result => {
                for (let settingsInterface of result) {
                    await this.global.update(settingsInterface.id!, {settings: JSON.stringify(holder.global)});
                }
            });

            // Update the active game's settings.
            try {
                await this.games.put({
                    identifier: this.activeGame.settingsIdentifier,
                    settings: JSON.stringify(holder.gameSpecific)
                });
            } catch (e) {
                throw new Error(
                    `IDB.Put fail for key "${this.activeGame.settingsIdentifier}": ${e}`
                );
            }
        }

        await this.transaction("rw!", this.global, this.games, update);
    }
}

interface SettingsInterface {
    id?: number;
    settings: string;
}

interface GameSettingsInterface {
    identifier: string;
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
    defaultStore: Platform | undefined;
    gameSelectionViewMode: GameSelectionViewMode;
    previewPanelWidth: number;
    linuxUseFlatpak: boolean | null;
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
    launchType: string;
    lastSelectedPlatform: string | null;
}

/**
 * Helper interface to neatly store settings internally.
 */
export interface ManagerSettingsInterfaceHolder {
    global: ManagerSettingsInterfaceGlobal_V2;
    gameSpecific: ManagerSettingsInterfaceGame_V2;
}
