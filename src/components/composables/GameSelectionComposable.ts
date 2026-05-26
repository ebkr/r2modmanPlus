import { computed, ref, InjectionKey } from 'vue';
import { useRouter } from 'vue-router';
import Game from '../../model/game/Game';
import GameManager from '../../model/game/GameManager';
import { GameInstanceType, GameSelectionDisplayMode, Platform } from '../../model/schema/ThunderstoreSchema';
import { GameSelectionViewMode } from '../../model/enums/GameSelectionViewMode';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import * as ManagerUtils from '../../utils/ManagerUtils';
import ProviderUtils from '../../providers/generic/ProviderUtils';
import R2Error from '../../model/errors/R2Error';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { getInstalledSteamAppIds } from '../../r2mm/manager/SteamLibraryScanner';

export function useGameSelectionComposable() {
    const store = getStore<State>();
    const router = useRouter();

    const favourites = ref<string[]>([]);
    const installedAppIds = ref<Set<string>>(new Set());
    const selectedGame = ref<Game | null>(null);
    const selectedPlatform = ref<Platform | null>(null);
    const filterText = ref<string>('');
    const activeTab = ref<GameInstanceType>(GameInstanceType.GAME);
    const viewMode = ref<GameSelectionViewMode>(GameSelectionViewMode.LIST);
    const settings = ref<ManagerSettings | undefined>(undefined);
    const runningMigration = ref<boolean>(false);
    const isSettingDefaultPlatform = ref<boolean>(false);

    const gameList = computed<Game[]>(() => {
        return GameManager.gameList.sort((a, b) =>
            a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
        );
    });

    const matchesSearch = (game: Game): boolean => {
        const text = filterText.value;
        if (text.trim().length === 0) return true;
        if (game.displayName.toLowerCase().indexOf(text.toLowerCase()) >= 0) return true;
        return game.additionalSearchStrings.find(
            value => value.toLowerCase().trim().indexOf(text.toLowerCase().trim()) >= 0
        ) !== undefined;
    };

    const filteredGameList = computed(() => {
        return gameList.value
            .filter(matchesSearch)
            .filter((value: Game) => value.instanceType === activeTab.value);
    });

    const hiddenGameList = computed(() => {
        return filteredGameList.value
            .filter((value: Game) => value.displayMode === GameSelectionDisplayMode.HIDDEN);
    });

    const favouriteGameList = computed(() => {
        return filteredGameList.value
            .filter((value: Game) => !hiddenGameList.value.includes(value))
            .filter((value: Game) => favourites.value.includes(value.settingsIdentifier));
    });

    const installedGameList = computed(() => {
        return filteredGameList.value
            .filter((value: Game) => !hiddenGameList.value.includes(value))
            .filter((value: Game) => value.storePlatformMetadata.some(
                p => [Platform.STEAM, Platform.STEAM_DIRECT].includes(p.storePlatform)
                    && p.storeIdentifier != null
                    && installedAppIds.value.has(String(p.storeIdentifier))
            ));
    });

    const nonFavouriteGameList = computed(() => {
        return filteredGameList.value
            .filter((value: Game) => !hiddenGameList.value.includes(value))
            .filter((value: Game) => !favourites.value.includes(value.settingsIdentifier))
            .filter((value: Game) => !installedGameList.value.includes(value));
    });

    function isFavourited(game: Game): boolean {
        return favourites.value.includes(game.settingsIdentifier);
    }

    function isGameSelected(game: Game): boolean {
        return selectedGame.value !== null
            && selectedGame.value.internalFolderName === game.internalFolderName;
    }

    function markAsSelectedGame(game: Game) {
        selectedGame.value = game;
    }

    function toggleFavourite(game: Game) {
        if (favourites.value.includes(game.settingsIdentifier)) {
            favourites.value = favourites.value.filter(v => v !== game.settingsIdentifier);
        } else {
            favourites.value = [...favourites.value, game.settingsIdentifier];
        }
        settings.value?.setFavouriteGames(favourites.value);
    }

    function changeTab(tab: GameInstanceType) {
        activeTab.value = tab;
    }

    function toggleViewMode() {
        viewMode.value = viewMode.value === GameSelectionViewMode.LIST
            ? GameSelectionViewMode.CARD
            : GameSelectionViewMode.LIST;
        settings.value?.setGameSelectionViewMode(viewMode.value);
    }

    async function proceed() {
        if (runningMigration.value || selectedGame.value === null || selectedPlatform.value === null) {
            return;
        }

        try {
            ProviderUtils.setupGameProviders(selectedGame.value, selectedPlatform.value);
        } catch (error) {
            if (error instanceof R2Error) {
                store.commit('error/handleError', error);
                return;
            }
            throw error;
        }

        const s = await ManagerSettings.getSingleton(selectedGame.value);
        await s.setLastSelectedGame(selectedGame.value);
        await s.setLastSelectedPlatform(selectedPlatform.value);
        await GameManager.activate(selectedGame.value, selectedPlatform.value);
        await store.dispatch('setActiveGame', selectedGame.value);

        await router.push({ name: 'splash' });
    }

    async function selectPlatformForGame(game: Game) {
        const s = await ManagerSettings.getSingleton(game);
        const platform = await s.getLastSelectedPlatform();
        selectedPlatform.value = platform ? Platform[platform] : null;
    }

    async function initialize() {
        runningMigration.value = true;
        await store.dispatch('checkMigrations');
        runningMigration.value = false;

        await store.dispatch('resetLocalState');

        settings.value = await ManagerSettings.getSingleton(GameManager.defaultGame);
        const globalSettings = settings.value.getContext().global;
        favourites.value = globalSettings.favouriteGames || [];
        installedAppIds.value = await getInstalledSteamAppIds();

        const lastGame = GameManager.findByFolderName(globalSettings.lastSelectedGame);
        if (lastGame) markAsSelectedGame(lastGame);

        switch (globalSettings.gameSelectionViewMode) {
            case GameSelectionViewMode.LIST:
            case GameSelectionViewMode.CARD:
                viewMode.value = globalSettings.gameSelectionViewMode;
                break;
            default:
                viewMode.value = GameSelectionViewMode.CARD;
        }

        const { defaultGame, defaultPlatform } = ManagerUtils.getDefaults(settings.value);
        if (defaultGame && defaultPlatform) {
            markAsSelectedGame(defaultGame);
            selectedPlatform.value = defaultPlatform;
            await proceed();
        }
    }

    async function proceedDefault() {
        if (runningMigration.value || selectedGame.value === null || selectedPlatform.value === null) {
            return;
        }

        const s = await ManagerSettings.getSingleton(selectedGame.value);
        await s.setDefaultGame(selectedGame.value);
        await s.setDefaultStorePlatform(selectedPlatform.value);

        return proceed();
    }

    return {
        favourites,
        selectedGame,
        selectedPlatform,
        filterText,
        activeTab,
        viewMode,
        settings,
        runningMigration,
        isSettingDefaultPlatform,
        hiddenGameList,
        favouriteGameList,
        installedGameList,
        nonFavouriteGameList,
        isFavourited,
        isGameSelected,
        markAsSelectedGame,
        toggleFavourite,
        changeTab,
        toggleViewMode,
        proceed,
        proceedDefault,
        selectPlatformForGame,
        initialize,
    };
}

export type GameSelectionComposable = ReturnType<typeof useGameSelectionComposable>;
export const gameSelectionKey: InjectionKey<GameSelectionComposable> = Symbol('gameSelection');
