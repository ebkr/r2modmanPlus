import { computed } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';

let expandedByDefault: ReturnType<typeof computed<boolean>>;
let initialized = false;

export function useModCardSettings() {
    const store = getStore<State>();

    if (!initialized) {
        initialized = true;
        store.dispatch('profile/loadModCardSettings');
        expandedByDefault = computed(() => store.state.profile.expandedByDefault);
    }

    return { expandedByDefault };
}
