import SettingsDexieStore from 'src/r2mm/manager/SettingsDexieStore';
import GlobalSettingsStructure_V3, { InternalGlobalSettingsStructure_V3 } from 'src/r2mm/manager/settings/structures/v3/GlobalSettingsStructure_V3';
import GameSettingsStructure_V3, { InternalGameSettingsStructure_V3 } from 'src/r2mm/manager/settings/structures/v3/GameSettingsStructure_V3';
import GameManager from 'src/model/game/GameManager';
import BaseSettingsMigration from 'src/r2mm/manager/settings/structures/BaseSettingsMigration';

export default class SettingsMigrator_v3 extends BaseSettingsMigration {

    version(): number {
        return 3;
    }

    async migrate() {
        const settingsDexieStore = new SettingsDexieStore(GameManager.unsetGame());
        const globalSettings = await settingsDexieStore.getLatestGlobal();
        const newGlobalStructure = new GlobalSettingsStructure_V3({
                darkTheme: globalSettings.darkTheme,
                dataDirectory: globalSettings.dataDirectory,
                defaultGame: globalSettings.defaultGame,
                defaultStore: globalSettings.defaultStore,
                expandedCards: globalSettings.expandedCards,
                favouriteGames: globalSettings.favouriteGames,
                funkyModeEnabled: globalSettings.funkyModeEnabled,
                gameSelectionViewMode: globalSettings.gameSelectionViewMode,
                ignoreCache: globalSettings.ignoreCache,
                lastSelectedGame: globalSettings.lastSelectedGame,
                steamDirectory: globalSettings.steamDirectory,
                virtualDesktopDirectory: undefined
            } as InternalGlobalSettingsStructure_V3, this.version()
        );
        await newGlobalStructure.init();

        const gameSettings: {[gameName: string]: InternalGameSettingsStructure_V3} = {};

        for (const settingsIdentifier of SettingsDexieStore.SUPPORTED_GAME_LIST) {
            const game = GameManager.gameList.find(value => value.settingsIdentifier === settingsIdentifier);
            // Just to make sure no games have been removed from GameManager.
            // Would probably set to invisible but doesn't hurt to safely skip.
            if (game !== undefined) {
                const settingsDexieStoreGameScoped = new SettingsDexieStore(game);
                const gameSpecific = await settingsDexieStoreGameScoped.getLatestGameSpecific();
                gameSettings[settingsIdentifier] = {
                    version: this.version(),
                    gameDirectory: gameSpecific.gameDirectory,
                    lastSelectedProfile: gameSpecific.lastSelectedProfile,
                    linkedFiles: gameSpecific.linkedFiles,
                    launchParameters: gameSpecific.launchParameters,
                    installedSortBy: gameSpecific.installedSortBy,
                    installedSortDirection: gameSpecific.installedSortDirection,
                    installedDisablePosition: gameSpecific.installedDisablePosition
                }
            }
        }

        const newGameStructure = new GameSettingsStructure_V3(this.version(), gameSettings);
        await newGameStructure.init();

        await newGlobalStructure.save();
        await newGameStructure.save();
    }

}
