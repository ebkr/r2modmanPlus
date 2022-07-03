import DexiePrep from 'app/test/jest/__tests__/impl/RollbackableSettings/dexie.prep';
import SettingsDexieStore from 'src/r2mm/manager/SettingsDexieStore';
import GameManager from 'src/model/game/GameManager';
import { GameSelectionViewMode } from 'src/model/enums/GameSelectionViewMode';
import { StorePlatform } from 'src/model/game/StorePlatform';
import SettingsStore from 'src/r2mm/manager/settings/SettingsStore';

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

        latest.gameSpecific.gameDirectory = "game_dir";
        latest.gameSpecific.lastSelectedProfile = "Some profile";
        latest.gameSpecific.linkedFiles = ["linked file"];
        latest.gameSpecific.launchParameters = "launch_param";
        latest.gameSpecific.installedSortBy = "sort_by";
        latest.gameSpecific.installedSortDirection = "dir";
        latest.gameSpecific.installedDisablePosition = "pos";

        await settingsStore.save(latest);
        const newLatest = await settingsStore.getLatest();

        // Global assertion
        expect(newLatest.global.steamDirectory).toEqual(latest.global.steamDirectory);
        expect(newLatest.global.funkyModeEnabled).toEqual(latest.global.funkyModeEnabled);
        expect(newLatest.global.expandedCards).toEqual(latest.global.expandedCards);
        expect(newLatest.global.darkTheme).toEqual(latest.global.darkTheme);
        expect(newLatest.global.ignoreCache).toEqual(latest.global.ignoreCache);
        expect(newLatest.global.dataDirectory).toEqual(latest.global.dataDirectory);
        expect(newLatest.global.lastSelectedGame).toEqual(latest.global.lastSelectedGame);
        expect(newLatest.global.favouriteGames).toEqual(latest.global.favouriteGames);
        expect(newLatest.global.defaultGame).toEqual(latest.global.defaultGame);
        expect(newLatest.global.defaultStore).toEqual(latest.global.defaultStore);
        expect(newLatest.global.gameSelectionViewMode).toEqual(latest.global.gameSelectionViewMode);

        // Game specific assertion
        expect(newLatest.gameSpecific.gameDirectory).toEqual(latest.gameSpecific.gameDirectory);
        expect(newLatest.gameSpecific.lastSelectedProfile).toEqual(latest.gameSpecific.lastSelectedProfile);
        expect(newLatest.gameSpecific.linkedFiles).toEqual(latest.gameSpecific.linkedFiles);
        expect(newLatest.gameSpecific.launchParameters).toEqual(latest.gameSpecific.launchParameters);
        expect(newLatest.gameSpecific.installedSortBy).toEqual(latest.gameSpecific.installedSortBy);
        expect(newLatest.gameSpecific.installedSortDirection).toEqual(latest.gameSpecific.installedSortDirection);
        expect(newLatest.gameSpecific.installedDisablePosition).toEqual(latest.gameSpecific.installedDisablePosition);
    });

    test("Run settings migration", async () => {
        const settingsStore = new SettingsStore();
        await settingsStore.init(GameManager.unsetGame());

        const context = settingsStore.getContext();
        const structureKeys = Object.keys(context.gameFormat.structure);

        // Ensure every game is supported
        GameManager.gameList.forEach(game => {
            expect(structureKeys.includes(game.settingsIdentifier));
        });
    });

    test("Verify migrated global settings", async () => {
        const newStore = new SettingsStore();
        await newStore.init(GameManager.unsetGame());

        const oldStore = new SettingsDexieStore(GameManager.unsetGame());
        expect(oldStore.getLatest()).not.toBeNull();

        // Verify old store is using previously saved structure
        expect((await oldStore.getLatest()).global.steamDirectory).toEqual("steam_dir");

        expect(newStore.getContext().global.steamDirectory).toEqual((await oldStore.getLatest()).global.steamDirectory);
        expect(newStore.getContext().global.funkyModeEnabled).toEqual((await oldStore.getLatest()).global.funkyModeEnabled);
        expect(newStore.getContext().global.expandedCards).toEqual((await oldStore.getLatest()).global.expandedCards);
        expect(newStore.getContext().global.darkTheme).toEqual((await oldStore.getLatest()).global.darkTheme);
        expect(newStore.getContext().global.ignoreCache).toEqual((await oldStore.getLatest()).global.ignoreCache);
        expect(newStore.getContext().global.dataDirectory).toEqual((await oldStore.getLatest()).global.dataDirectory);
        expect(newStore.getContext().global.lastSelectedGame).toEqual((await oldStore.getLatest()).global.lastSelectedGame);
        expect(newStore.getContext().global.favouriteGames).toEqual((await oldStore.getLatest()).global.favouriteGames);
        expect(newStore.getContext().global.defaultGame).toEqual((await oldStore.getLatest()).global.defaultGame);
        expect(newStore.getContext().global.defaultStore).toEqual((await oldStore.getLatest()).global.defaultStore);
        expect(newStore.getContext().global.gameSelectionViewMode).toEqual((await oldStore.getLatest()).global.gameSelectionViewMode);
    });

    test("Verify migrated game specific settings", async () => {
        const newStore = new SettingsStore();
        await newStore.init(GameManager.unsetGame());

        const oldStore = new SettingsDexieStore(GameManager.unsetGame());
        expect(oldStore.getLatest()).not.toBeNull();

        // Verify old store is using previously saved structure
        expect((await oldStore.getLatest()).gameSpecific.gameDirectory).toEqual("game_dir");

        expect(newStore.getContext().gameSpecific.gameDirectory).toEqual((await oldStore.getLatest()).gameSpecific.gameDirectory);
        expect(newStore.getContext().gameSpecific.lastSelectedProfile).toEqual((await oldStore.getLatest()).gameSpecific.lastSelectedProfile);
        expect(newStore.getContext().gameSpecific.linkedFiles).toEqual((await oldStore.getLatest()).gameSpecific.linkedFiles);
        expect(newStore.getContext().gameSpecific.launchParameters).toEqual((await oldStore.getLatest()).gameSpecific.launchParameters);
        expect(newStore.getContext().gameSpecific.installedSortBy).toEqual((await oldStore.getLatest()).gameSpecific.installedSortBy);
        expect(newStore.getContext().gameSpecific.installedSortDirection).toEqual((await oldStore.getLatest()).gameSpecific.installedSortDirection);
        expect(newStore.getContext().gameSpecific.installedDisablePosition).toEqual((await oldStore.getLatest()).gameSpecific.installedDisablePosition);
    });

})
