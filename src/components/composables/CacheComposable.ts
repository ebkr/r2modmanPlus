import { throwForR2Error } from '@r2/model/errors/R2Error';
import DirectoryTree from '@r2/model/file/DirectoryTree';
import Game from '@r2/model/game/Game';
import ManifestV2 from '@r2/model/ManifestV2';
import FsProvider from '@r2/providers/generic/file/FsProvider';
import { getStore } from '@r2/providers/generic/store/StoreProvider';
import path from '@r2/providers/node/path/path';
import PathResolver from '@r2/r2mm/manager/PathResolver';
import { computed, onMounted, Ref, ref, watch } from 'vue';

type GameCacheContent = {
    cacheByteSize: Ref<number>;
    cachePackageCount: Ref<number>;
}

const store = getStore<any>();

const activeGame = computed<Game>(() => store.state.activeGame);
const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);

const gameCacheContentMap = new Map<string, GameCacheContent>();

function getOrCreateScope(game: Game): GameCacheContent {
    const existing = gameCacheContentMap.get(game.internalFolderName);
    if (existing !== undefined) {
        return existing;
    }

    const created: GameCacheContent = {
        cacheByteSize: ref<number>(0),
        cachePackageCount: ref<number>(0)
    };
    gameCacheContentMap.set(game.internalFolderName, created);
    return created;
}

async function refresh(game: Game) {
    const content = getOrCreateScope(game);
    const cacheDir = path.join(PathResolver.ROOT, game.internalFolderName, 'cache');

    if (!await FsProvider.instance.exists(cacheDir)) {
        content.cacheByteSize.value = 0;
        content.cachePackageCount.value = 0;
        return;
    }

    const tree = throwForR2Error(await DirectoryTree.buildFromLocation(cacheDir));

    content.cacheByteSize.value = tree.getSize();
    content.cachePackageCount.value = tree.getDirectories()
        .filter(directory => directory.getDirectoryName() !== '_state')
        .length;
}

function refreshInBackground(game: Game) {
    refresh(game).catch(e => console.error('Failed to update cache size', e));
}

watch([activeGame, localModList], () => refreshInBackground(activeGame.value));

export function useCacheComposable() {

    onMounted(() => refreshInBackground(activeGame.value));

    function getScope(game: Game): GameCacheContent {
        return getOrCreateScope(game);
    }

    return {
        getScope,
        refresh
    }

}
