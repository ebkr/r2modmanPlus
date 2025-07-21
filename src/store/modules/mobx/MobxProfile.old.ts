import { getStore as _getStore } from "../../../providers/generic/store/StoreProvider"
import { State } from 'src/store';
import Profile from 'src/model/Profile';
import { ref } from 'vue';
import R2Error from 'src/model/errors/R2Error';

// Allow us to dispatch into Vuex store
function getStore() {
    return _getStore<State>();
}

const unsetProfile = Profile.getActiveProfile() || new Profile("Default");
export const activeProfile = ref<Profile>(unsetProfile);

export async function setActiveProfile(params: { profileName: string, prewarmCache: boolean }) {
    activeProfile.value = new Profile(params.profileName);
    await getStore().getters['settings'].setProfile(params.profileName);
    if (params.prewarmCache) {
        await getStore().dispatch('profile/updateModListFromFile', null, { root: true });
        await getStore().dispatch('tsMods/prewarmCache', null, { root: true });
    }
}

export function getActiveProfileOrThrow(): Profile {
    if (activeProfile.value === null) {
        throw new R2Error(
            'No active profile found',
            'Unable to modify mod list state when active profile is not set.'
        )
    }
    return <Profile>activeProfile.value;
}
