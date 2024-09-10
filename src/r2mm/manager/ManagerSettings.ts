import R2Error from '../../model/errors/R2Error';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import SettingsDexieStore, { ManagerSettingsInterfaceHolder } from './SettingsDexieStore';
import Game from '../../model/game/Game';
import { StorePlatform } from '../../model/game/StorePlatform';
import { GameSelectionViewMode } from '../../model/enums/GameSelectionViewMode';

export default class ManagerSettings {

    private static LOADED_SETTINGS: ManagerSettings | undefined;
    private static DEXIE_STORE: SettingsDexieStore;
    private static ACTIVE_GAME: Game;
    public static NEEDS_MIGRATION = false;

    private static CONTEXT: ManagerSettingsInterfaceHolder;

    public static async getSingleton(game: Game): Promise<ManagerSettings> {
        if (this.LOADED_SETTINGS === undefined || this.ACTIVE_GAME === undefined || (this.ACTIVE_GAME.displayName !== game.displayName)) {
            this.ACTIVE_GAME = game;
            this.LOADED_SETTINGS = new ManagerSettings();
            this.DEXIE_STORE = new SettingsDexieStore(game);
            await this.LOADED_SETTINGS.load(true);
        }
        return this.LOADED_SETTINGS;
    }

    public static discardSingleton() {
        this.LOADED_SETTINGS = undefined;
    }

    /**
     * Reset the default game selection before redirecting the user to
     * game selection screen. Otherwise the game would be automatically
     * reselected and the user redirected to profile selection screen.
     */
    public static async resetDefaults() {
        const settings = await ManagerSettings.getSingleton(ManagerSettings.ACTIVE_GAME);
        const error = await settings.load();

        if (error) {
            throw error;
        }

        ManagerSettings.CONTEXT.global.defaultGame = undefined;
        ManagerSettings.CONTEXT.global.defaultStore = undefined;
        await settings.save();
    }

    public async load(forceRefresh?: boolean): Promise<R2Error | void> {
        try {
            if (ManagerSettings.CONTEXT === undefined || forceRefresh === true) {
                ManagerSettings.CONTEXT = await ManagerSettings.DEXIE_STORE.getLatest();
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
        return ManagerSettings.CONTEXT;
    }


    private async save() {
        await ManagerSettings.DEXIE_STORE.save(ManagerSettings.CONTEXT);
    }

    public async setGameDirectory(dir: string) {
        ManagerSettings.CONTEXT.gameSpecific.gameDirectory = dir;
        await this.save();
    }

    public async setSteamDirectory(dir: string) {
        ManagerSettings.CONTEXT.global.steamDirectory = dir;
        await this.save();
    }

    public async setLinkedFiles(linkedFiles: string[]) {
        ManagerSettings.CONTEXT.gameSpecific.linkedFiles = linkedFiles;
        await this.save();
    }

    public async setProfile(profile: string) {
        ManagerSettings.CONTEXT.gameSpecific.lastSelectedProfile = profile;
        await this.save();
    }

    public async setFunkyMode(enabled: boolean) {
        ManagerSettings.CONTEXT.global.funkyModeEnabled = enabled;
        await this.save();
    }

    public async expandCards() {
        ManagerSettings.CONTEXT.global.expandedCards = true;
        await this.save();
    }

    public async collapseCards() {
        ManagerSettings.CONTEXT.global.expandedCards = false;
        await this.save();
    }

    public async toggleDarkTheme() {
        ManagerSettings.CONTEXT.global.darkTheme = !ManagerSettings.CONTEXT.global.darkTheme;
        await this.save();
    }

    public async setLaunchParameters(launchParams: string) {
        ManagerSettings.CONTEXT.gameSpecific.launchParameters = launchParams;
        await this.save();
    }

    public async setIgnoreCache(ignore: boolean) {
        ManagerSettings.CONTEXT.global.ignoreCache = ignore;
        await this.save();
    }

    public async setDataDirectory(dataDirectory: string) {
        ManagerSettings.CONTEXT.global.dataDirectory = dataDirectory;
        await this.save();
    }

    public getInstalledSortBy() {
        try {
            return Object.entries(SortNaming).filter(value => value[0] === ManagerSettings.CONTEXT.gameSpecific.installedSortBy)[0][1];
        } catch (e) {
            console.log("Failed to get installedSortBy:", e);
            return SortNaming.CUSTOM;
        }
    }

    public async setInstalledSortBy(sortNaming: string) {
        ManagerSettings.CONTEXT.gameSpecific.installedSortBy = EnumResolver.from(SortNaming, sortNaming)!;
        await this.save();
    }

    public getInstalledSortDirection() {
        try {
            return Object.entries(SortDirection).filter(value => value[0] === ManagerSettings.CONTEXT.gameSpecific.installedSortDirection)[0][1];
        } catch (e) {
            console.log("Failed to get installedSortDirection:", e);
            return SortDirection.STANDARD;
        }
    }

    public async setInstalledSortDirection(sortDirection: string) {
        ManagerSettings.CONTEXT.gameSpecific.installedSortDirection = EnumResolver.from(SortDirection, sortDirection)!;
        await this.save();
    }

    public getInstalledDisablePosition() {
        try {
            return Object.entries(SortLocalDisabledMods).filter(value => value[0] === ManagerSettings.CONTEXT.gameSpecific.installedDisablePosition)[0][1];
        } catch (e) {
            console.log("Failed to get installedDisablePosition:", e);
            return SortLocalDisabledMods.CUSTOM;
        }
    }

    public async setInstalledDisablePosition(disablePosition: string) {
        ManagerSettings.CONTEXT.gameSpecific.installedDisablePosition = EnumResolver.from(SortLocalDisabledMods, disablePosition)!;
        await this.save();
    }

    public async setLastSelectedGame(game: Game) {
        ManagerSettings.CONTEXT.global.lastSelectedGame = game.internalFolderName;
        await this.save();
    }

    public async setFavouriteGames(favourites: string[]) {
        ManagerSettings.CONTEXT.global.favouriteGames = favourites;
        await this.save();
    }

    public async setDefaultGame(defaultGame: Game | undefined) {
        if (defaultGame === undefined) {
            ManagerSettings.CONTEXT.global.defaultGame = undefined;
        } else {
            ManagerSettings.CONTEXT.global.defaultGame = defaultGame.internalFolderName;
        }
        await this.save();
    }

    public async setDefaultStorePlatform(storePlatform: StorePlatform | undefined) {
        ManagerSettings.CONTEXT.global.defaultStore = storePlatform;
        await this.save();
    }

    public async setGameSelectionViewMode(viewMode: GameSelectionViewMode) {
        ManagerSettings.CONTEXT.global.gameSelectionViewMode = viewMode;
        await this.save();
    }

    public async setDisplayLanguage(displayLanguage: string) {
        ManagerSettings.CONTEXT.global.displayLanguage = displayLanguage;
        await this.save();
    }
}
