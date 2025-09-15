import { defineStore, acceptHMRUpdate } from 'pinia';
import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import { ref } from 'vue';

export const useProviderStore = defineStore('providers', () => {
    const initialProvider = (import.meta.hot?.data.gameDirectoryResolverProvider)
        ? () => import.meta.hot!.data.gameDirectoryResolverProvider
        : () => { throw new Error("GameDirectoryResolverProvider has not been provided") };

    const gameDirectoryResolverProvider = ref<() => GameDirectoryResolverProvider>(initialProvider);

    function setGameDirectoryResolverProvider(provider: () => GameDirectoryResolverProvider) {
        gameDirectoryResolverProvider.value = provider;
        if (import.meta.hot) {
            import.meta.hot.data.gameDirectoryResolverProvider = provider();
        }
    }

    return { gameDirectoryResolverProvider, setGameDirectoryResolverProvider };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProviderStore, import.meta.hot));
}
