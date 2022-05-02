import R2Error from '../../model/errors/R2Error';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import SettingsDexieStore, { ManagerSettingsInterfaceGame_V2 } from './SettingsDexieStore';
import Game from '../../model/game/Game';
import { StorePlatform } from '../../model/game/StorePlatform';
import { GameSelectionViewMode } from '../../model/enums/GameSelectionViewMode';
import SettingsStore from './settings/SettingsStore';
import SettingsProxy from './settings/SettingsProxy';
import { InternalGlobalSettingsStructure_V3 } from './settings/structures/v3/GlobalSettingsStructure_V3';
import { InternalGameSettingsStructure_V3 } from './settings/structures/v3/GameSettingsStructure_V3';

export default class ManagerSettings {

    private static LOADED_SETTINGS: ManagerSettings | undefined;
    private static SETTINGS_STORE: SettingsStore | SettingsDexieStore;
    private static ACTIVE_GAME: Game;
    public static NEEDS_MIGRATION = false;

    private static GLOBAL_CONTEXT: InternalGlobalSettingsStructure_V3;
    private static GAME_CONTEXT: InternalGameSettingsStructure_V3 | ManagerSettingsInterfaceGame_V2;

    public static async getSingleton(game: Game): Promise<ManagerSettings> {
        if (this.LOADED_SETTINGS === undefined || this.ACTIVE_GAME === undefined || (this.ACTIVE_GAME.displayName !== game.displayName)) {
            this.ACTIVE_GAME = game;
            this.LOADED_SETTINGS = new ManagerSettings();
            this.SETTINGS_STORE = new SettingsStore();
            await this.SETTINGS_STORE.init(game);
            await this.LOADED_SETTINGS.load(true);
        }
        return this.LOADED_SETTINGS;
    }

    public async load(forceRefresh?: boolean): Promise<R2Error | void> {
        try {
            if (ManagerSettings.GAME_CONTEXT === undefined || forceRefresh === true) {
                ManagerSettings.GLOBAL_CONTEXT = await SettingsProxy.getGlobalContext(ManagerSettings.ACTIVE_GAME);
                ManagerSettings.GAME_CONTEXT = await SettingsProxy.getGameContext(ManagerSettings.ACTIVE_GAME);
            }
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to initialise settings storage", err.message, null);
        }
    }

    /**
     * Allow access to the context via the singleton directly.
     */
    public getContext() {
        return {global: ManagerSettings.GLOBAL_CONTEXT, gameSpecific: ManagerSettings.GAME_CONTEXT};
    }


    private async save(): Promise<R2Error | void> {
        await SettingsProxy.saveGlobalContext(ManagerSettings.ACTIVE_GAME, ManagerSettings.GLOBAL_CONTEXT);
        await SettingsProxy.saveGameContext(ManagerSettings.ACTIVE_GAME, ManagerSettings.GAME_CONTEXT);
    }

    public async setGameDirectory(dir: string): Promise<R2Error | void> {
        ManagerSettings.GAME_CONTEXT.gameDirectory = dir;
        return await this.save();
    }

    public async setSteamDirectory(dir: string): Promise<R2Error | void> {
        ManagerSettings.GLOBAL_CONTEXT.steamDirectory = dir;
        return await this.save();
    }

    public async setLinkedFiles(linkedFiles: string[]): Promise<R2Error | void> {
        ManagerSettings.GAME_CONTEXT.linkedFiles = linkedFiles;
        return await this.save();
    }

    public async setProfile(profile: string): Promise<R2Error | void> {
        ManagerSettings.GAME_CONTEXT.lastSelectedProfile = profile;
        return await this.save();
    }

    public async setFunkyMode(enabled: boolean): Promise<R2Error | void> {
        ManagerSettings.GLOBAL_CONTEXT.funkyModeEnabled = enabled;
        return await this.save();
    }

    public async expandCards(): Promise<R2Error | void> {
        ManagerSettings.GLOBAL_CONTEXT.expandedCards = true;
        return await this.save();
    }

    public async collapseCards(): Promise<R2Error | void> {
        ManagerSettings.GLOBAL_CONTEXT.expandedCards = false;
        return await this.save();
    }

    public async toggleDarkTheme(): Promise<R2Error | void> {
        ManagerSettings.GLOBAL_CONTEXT.darkTheme = !ManagerSettings.GLOBAL_CONTEXT.darkTheme;
        return await this.save();
    }

    public async setLaunchParameters(launchParams: string): Promise<R2Error | void> {
        ManagerSettings.GAME_CONTEXT.launchParameters = launchParams;
        return await this.save();
    }

    public async setIgnoreCache(ignore: boolean): Promise<R2Error | void> {
        ManagerSettings.GLOBAL_CONTEXT.ignoreCache = ignore;
        return await this.save();
    }

    public async setDataDirectory(dataDirectory: string): Promise<R2Error | void> {
        ManagerSettings.GLOBAL_CONTEXT.dataDirectory = dataDirectory;
        return await this.save();
    }

    public getInstalledSortBy() {
        try {
            return Object.entries(SortNaming).filter(value => value[0] === ManagerSettings.GAME_CONTEXT.installedSortBy)[0][1];
        } catch (e) {
            console.log("Failed to get installedSortBy:", e);
            return SortNaming.CUSTOM;
        }
    }

    public async setInstalledSortBy(sortNaming: string): Promise<R2Error | void> {
        ManagerSettings.GAME_CONTEXT.installedSortBy = EnumResolver.from(SortNaming, sortNaming)!;
        return await this.save();
    }

    public getInstalledSortDirection() {
        try {
            return Object.entries(SortDirection).filter(value => value[0] === ManagerSettings.GAME_CONTEXT.installedSortDirection)[0][1];
        } catch (e) {
            console.log("Failed to get installedSortDirection:", e);
            return SortDirection.STANDARD;
        }
    }

    public async setInstalledSortDirection(sortDirection: string): Promise<R2Error | void> {
        ManagerSettings.GAME_CONTEXT.installedSortDirection = EnumResolver.from(SortDirection, sortDirection)!;
        return await this.save();
    }

    public getInstalledDisablePosition() {
        try {
            return Object.entries(SortLocalDisabledMods).filter(value => value[0] === ManagerSettings.GAME_CONTEXT.installedDisablePosition)[0][1];
        } catch (e) {
            console.log("Failed to get installedDisablePosition:", e);
            return SortLocalDisabledMods.CUSTOM;
        }
    }

    public async setInstalledDisablePosition(disablePosition: string): Promise<R2Error | void> {
        ManagerSettings.GAME_CONTEXT.installedDisablePosition = EnumResolver.from(SortLocalDisabledMods, disablePosition)!;
        return await this.save();
    }

    public async setLastSelectedGame(game: Game) {
        ManagerSettings.GLOBAL_CONTEXT.lastSelectedGame = game.internalFolderName;
        return await this.save();
    }

    public async setFavouriteGames(favourites: string[]) {
        ManagerSettings.GLOBAL_CONTEXT.favouriteGames = favourites;
        return await this.save();
    }

    public async setDefaultGame(defaultGame: Game | undefined) {
        if (defaultGame === undefined) {
            ManagerSettings.GLOBAL_CONTEXT.defaultGame = undefined;
        } else {
            ManagerSettings.GLOBAL_CONTEXT.defaultGame = defaultGame.internalFolderName;
        }
        return await this.save();
    }

    public async setDefaultStorePlatform(storePlatform: StorePlatform | undefined) {
        if (storePlatform === undefined) {
            ManagerSettings.GLOBAL_CONTEXT.defaultStore = undefined;
        } else {
            ManagerSettings.GLOBAL_CONTEXT.defaultStore = storePlatform;
        }
        return await this.save();
    }

    public async setGameSelectionViewMode(viewMode: GameSelectionViewMode) {
        ManagerSettings.GLOBAL_CONTEXT.gameSelectionViewMode = viewMode;
        return await this.save();
    }
}
