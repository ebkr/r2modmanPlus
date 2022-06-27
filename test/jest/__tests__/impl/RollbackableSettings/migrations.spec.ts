import DexiePrep from 'app/test/jest/__tests__/impl/RollbackableSettings/dexie.prep';
import SettingsDexieStore from 'src/r2mm/manager/SettingsDexieStore';
import GameManager from 'src/model/game/GameManager';
import { GameSelectionViewMode } from 'src/model/enums/GameSelectionViewMode';
import { StorePlatform } from 'src/model/game/StorePlatform';

describe("Setup legacy", () => {

    beforeAll(async () => {
        DexiePrep.initDexie();
    })

    test("Init legacy", async () => {


        const settingsStore = new SettingsDexieStore(GameManager.unsetGame());
        expect(settingsStore.getLatest()).not.toBeNull();

        const latest = await settingsStore.getLatest();

        // Overwrite values to non-default
        latest.global.steamDirectory = "steam_dir";
        latest.global.funkyModeEnabled = true;
        latest.global.expandedCards = true;
        latest.global.darkTheme = false;
        latest.global.ignoreCache = true;
        latest.global.dataDirectory = "data_dir";
        latest.global.lastSelectedGame = "some_game";
        latest.global.favouriteGames = ["some_game"];
        latest.global.defaultGame = "some_game";
        latest.global.defaultStore = StorePlatform.STEAM;
        latest.global.gameSelectionViewMode = GameSelectionViewMode.CARD;

        await settingsStore.save(latest);
        const newLatest = await settingsStore.getLatest();

        expect(newLatest.global.steamDirectory).toEqual(latest.global.steamDirectory)
        expect(newLatest.global.funkyModeEnabled).toEqual(latest.global.funkyModeEnabled)
        expect(newLatest.global.expandedCards).toEqual(latest.global.expandedCards)
        expect(newLatest.global.darkTheme).toEqual(latest.global.darkTheme)
        expect(newLatest.global.ignoreCache).toEqual(latest.global.ignoreCache)
        expect(newLatest.global.dataDirectory).toEqual(latest.global.dataDirectory)
        expect(newLatest.global.lastSelectedGame).toEqual(latest.global.lastSelectedGame)
        expect(newLatest.global.favouriteGames).toEqual(latest.global.favouriteGames)
        expect(newLatest.global.defaultGame).toEqual(latest.global.defaultGame)
        expect(newLatest.global.defaultStore).toEqual(latest.global.defaultStore)
        expect(newLatest.global.gameSelectionViewMode).toEqual(latest.global.gameSelectionViewMode)
    })

})
