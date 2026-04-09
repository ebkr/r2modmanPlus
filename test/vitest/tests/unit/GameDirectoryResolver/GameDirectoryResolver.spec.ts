import {beforeAll, beforeEach, describe, expect, test} from 'vitest';
import path from 'path';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import GameManager from '../../../../../src/model/game/GameManager';
import GameDirectoryResolverImpl from '../../../../../src/r2mm/manager/win32/GameDirectoryResolver';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import { providePathImplementation } from '../../../../../src/providers/node/path/path';
import { TestPathProvider } from '../../../stubs/providers/node/Node.Path.Provider';
import {updateEcosystemReactives} from "src/r2mm/ecosystem/EcosystemSchema";

describe.skipIf(process.platform !== 'win32')('GameDirectoryResolver', () => {
    const steamRoot = 'TEST_STEAM_PATH';
    let resolver: GameDirectoryResolverImpl;

    beforeAll(async () => {
        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        InMemoryFsProvider.clear();
        providePathImplementation(() => TestPathProvider);
        await updateEcosystemReactives();
    })

    beforeEach(async () => {
        resolver = new GameDirectoryResolverImpl();
        await FsProvider.instance.mkdirs(path.join(steamRoot, 'steamapps', 'common'));
    });

    async function seedManifest(storeIdentifier: string, installdir: string) {
        await FsProvider.instance.writeFile(
            path.join(steamRoot, 'steamapps', `appmanifest_${storeIdentifier}.acf`),
            `"AppState"
{
    "installdir"    "${installdir}"
}`
        );
    }

    test('resolves nested steam folders with three path components', async () => {
        const game = GameManager.gameList.find((value) => value.steamFolderName === 'Hot Lava/archive/build');
        expect(game).toBeDefined();

        GameManager.activeGame = game!;
        await seedManifest(game!.activePlatform.storeIdentifier!, 'Hot Lava');
        await FsProvider.instance.mkdirs(path.join(steamRoot, 'steamapps', 'common', 'Hot Lava', 'archive', 'build'));

        const result = await (resolver as any).findSteamAppManifest(steamRoot, game!);

        expect(result).toBe(path.join(steamRoot, 'steamapps', 'common', 'Hot Lava', 'archive', 'build'));
    });

    test('preserves existing nested steam folders with two path components', async () => {
        const game = GameManager.gameList.find((value) => value.steamFolderName === 'Very Very Valet/windows');
        expect(game).toBeDefined();

        GameManager.activeGame = game!;
        await seedManifest(game!.activePlatform.storeIdentifier!, 'Very Very Valet');
        await FsProvider.instance.mkdirs(path.join(steamRoot, 'steamapps', 'common', 'Very Very Valet', 'windows'));

        const result = await (resolver as any).findSteamAppManifest(steamRoot, game!);

        expect(result).toBe(path.join(steamRoot, 'steamapps', 'common', 'Very Very Valet', 'windows'));
    });
});
