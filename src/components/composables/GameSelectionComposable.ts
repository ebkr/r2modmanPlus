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
import { isGameNewlyAdded, registerGames } from '../../r2mm/ecosystem/EcosystemGameStatus';

export type PlatformSelectionIntent = 'SELECT' | 'SET_DEFAULT' | 'CHANGE';

export function useGameSelectionComposable() {
    const store = getStore<State>();
    const router = useRouter();

    const favourites = ref<string[]>([]);
    const selectedGame = ref<Game | null>(null);
    const selectedPlatform = ref<Platform | null>(null);
    const filterText = ref<string>('');
    const activeTab = ref<GameInstanceType>(GameInstanceType.GAME);
    const viewMode = ref<GameSelectionViewMode>(GameSelectionViewMode.LIST);
    const settings = ref<ManagerSettings | undefined>(undefined);
    const runningMigration = ref<boolean>(false);
    const platformSelectionIntent = ref<PlatformSelectionIntent>('SELECT');
    const lastSelectedPlatforms = ref<Record<string, Platform>>({});

    const gameList = computed<Game[]>(() => {
        return GameManager.gameList.sort((a, b) => {
            if (favourites.value.includes(a.settingsIdentifier)) {
                if (favourites.value.includes(b.settingsIdentifier)) {
                    return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase());
                } else {
                    return -1;
                }
            } else if (favourites.value.includes(b.settingsIdentifier)) {
                return 1;
            }
            return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase());
        });
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

    const newGameSet = computed(() => {
        const gameList = filteredGameList.value;
        const gameNames = gameList.map((value: Game) => value.thunderstoreIdentifier);
        registerGames(gameNames);
        return new Set(filteredGameList.value.filter(game =>
            isGameNewlyAdded(game.thunderstoreIdentifier)
        ));
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

    const nonFavouriteGameList = computed(() => {
        return filteredGameList.value
            .filter((value: Game) => !hiddenGameList.value.includes(value))
            .filter((value: Game) => !favourites.value.includes(value.settingsIdentifier));
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

        const platform = selectedPlatform.value as Platform;

        try {
            ProviderUtils.setupGameProviders(selectedGame.value as Game, platform);
        } catch (error) {
            if (error instanceof R2Error) {
                store.commit('error/handleError', error);
                return;
            }
            throw error;
        }

        const s = await ManagerSettings.getSingleton(selectedGame.value as Game);
        await s.setLastSelectedGame(selectedGame.value as Game);
        await saveLastSelectedPlatform(selectedGame.value as Game, platform);
        await GameManager.activate(selectedGame.value as Game, platform);
        await store.dispatch('setActiveGame', selectedGame.value);

        await router.push({ name: 'splash' });
    }

    function getLastSelectedPlatform(game: Game): Platform | undefined {
        return lastSelectedPlatforms.value[game.settingsIdentifier];
    }

    async function saveLastSelectedPlatform(game: Game, platform: Platform) {
        const settings = await ManagerSettings.getSingleton(game);
        await settings.setLastSelectedPlatform(platform);
        lastSelectedPlatforms.value = { ...lastSelectedPlatforms.value, [game.settingsIdentifier]: platform };
    }

    async function changeLastSelectedPlatform(game: Game, platform: Platform) {
        await saveLastSelectedPlatform(game, platform);
        const settings = await ManagerSettings.getSingleton(game);
        if (settings.getContext().global.defaultGame === game.internalFolderName) {
            await settings.setDefaultStorePlatform(platform);
        }
    }

    function selectPlatformForGame(game: Game) {
        selectedPlatform.value = getLastSelectedPlatform(game) ?? null;
    }

    async function initialize() {
        runningMigration.value = true;
        await store.dispatch('checkMigrations');
        runningMigration.value = false;

        await store.dispatch('resetLocalState');

        settings.value = await ManagerSettings.getSingleton(GameManager.defaultGame);
        const globalSettings = settings.value.getContext().global;
        favourites.value = globalSettings.favouriteGames || [];
        lastSelectedPlatforms.value = await ManagerSettings.getLastSelectedPlatforms();

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

        const settingsInstance = settings.value as ManagerSettings;
        const { defaultGame, defaultPlatform } = ManagerUtils.getDefaults(settingsInstance);
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

        const game = selectedGame.value as Game;
        const s = await ManagerSettings.getSingleton(game);
        await s.setDefaultGame(game);
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
        platformSelectionIntent,
        hiddenGameList,
        newGameSet,
        favouriteGameList,
        nonFavouriteGameList,
        isFavourited,
        isGameSelected,
        markAsSelectedGame,
        toggleFavourite,
        changeTab,
        toggleViewMode,
        proceed,
        proceedDefault,
        getLastSelectedPlatform,
        saveLastSelectedPlatform,
        changeLastSelectedPlatform,
        selectPlatformForGame,
        initialize,
    };
}

export type GameSelectionComposable = ReturnType<typeof useGameSelectionComposable>;
export const gameSelectionKey: InjectionKey<GameSelectionComposable> = Symbol('gameSelection');
