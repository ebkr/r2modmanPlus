import {describe, expect, test} from 'vitest';
import {getGameSupportStatus} from 'src/model/game/GameSupportStatus';
import {GameInstanceType, GameSelectionDisplayMode, Loader, ModloaderPackage, Platform, R2Modman} from 'src/assets/data/ecosystemTypes';

function makeGame(overrides: Partial<R2Modman> = {}): R2Modman {
    return {
        additionalSearchStrings: [],
        dataFolderName: "TestGame_Data",
        distributions: [{platform: Platform.STEAM, identifier: "12345"}],
        exeNames: ["TestGame.exe"],
        gameInstanceType: GameInstanceType.GAME,
        gameSelectionDisplayMode: GameSelectionDisplayMode.VISIBLE,
        installRules: [],
        internalFolderName: "TestGame",
        meta: {displayName: "Test Game", iconUrl: "test.webp"},
        packageIndex: "https://thunderstore.io/c/test/api/v1/package-listing-index/",
        packageLoader: Loader.BEPINEX,
        relativeFileExclusions: null,
        settingsIdentifier: "TestGame",
        steamFolderName: "TestGame",
        ...overrides,
    };
}

const MODLOADER_PACKAGES: ModloaderPackage[] = [
    {packageId: "BepInEx-BepInExPack", loader: Loader.BEPINEX, rootFolder: "."},
    {packageId: "LavaGang-MelonLoader", loader: Loader.MELONLOADER, rootFolder: ""},
];

describe('getGameSupportStatus', () => {

    test('returns supported when loader and platform are known', () => {
        const game = makeGame();
        expect(getGameSupportStatus(game, MODLOADER_PACKAGES)).toBe("supported");
    });

    test('returns supported for Loader.NONE regardless of modloader packages', () => {
        const game = makeGame({packageLoader: Loader.NONE});
        expect(getGameSupportStatus(game, [])).toBe("supported");
    });

    test('returns unsupported-loader when loader is not in modloader packages', () => {
        const game = makeGame({packageLoader: Loader.GDWEAVE});
        expect(getGameSupportStatus(game, MODLOADER_PACKAGES)).toBe("unsupported-loader");
    });

    test('returns unsupported-loader when modloader packages list is empty', () => {
        const game = makeGame({packageLoader: Loader.BEPINEX});
        expect(getGameSupportStatus(game, [])).toBe("unsupported-loader");
    });

    test('returns unsupported-loader when loader is unknown to this build, even if schema lists it', () => {
        const unknownLoader = "future-loader" as Loader;
        const game = makeGame({packageLoader: unknownLoader});
        const packages: ModloaderPackage[] = [
            {packageId: "Future-Pack", loader: unknownLoader, rootFolder: "."},
        ];
        expect(getGameSupportStatus(game, packages)).toBe("unsupported-loader");
    });

    test('returns unsupported-store when game has no distributions', () => {
        const game = makeGame({distributions: []});
        expect(getGameSupportStatus(game, MODLOADER_PACKAGES)).toBe("unsupported-store");
    });

    test('returns unsupported-store when all platforms are unknown', () => {
        const game = makeGame({
            distributions: [{platform: "playstation-store" as Platform}],
        });
        expect(getGameSupportStatus(game, MODLOADER_PACKAGES)).toBe("unsupported-store");
    });

    test('returns supported when at least one platform is known', () => {
        const game = makeGame({
            distributions: [
                {platform: "playstation-store" as Platform},
                {platform: Platform.STEAM, identifier: "12345"},
            ],
        });
        expect(getGameSupportStatus(game, MODLOADER_PACKAGES)).toBe("supported");
    });

    test('loader check takes priority over store check', () => {
        const game = makeGame({
            packageLoader: Loader.GDWEAVE,
            distributions: [],
        });
        expect(getGameSupportStatus(game, MODLOADER_PACKAGES)).toBe("unsupported-loader");
    });

    test('supports all known platform types', () => {
        for (const platform of Object.values(Platform)) {
            const game = makeGame({distributions: [{platform}]});
            expect(getGameSupportStatus(game, MODLOADER_PACKAGES)).toBe("supported");
        }
    });
});
