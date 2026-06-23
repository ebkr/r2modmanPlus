import { ref, watch, Ref } from 'vue';

import ManifestV2 from '../../model/ManifestV2';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

export function useModIcon(mod: () => ManifestV2): Ref<string> {
    const store = getStore<State>();
    const icon = ref<string>('/unknown.png');

    watch(() => mod().getDependencyString(), async () => {
        const profile = store.getters['profile/activeProfile'].asImmutableProfile();
        icon.value = await ProfileModList.getModIcon(mod(), profile);
    }, { immediate: true });

    return icon;
}
