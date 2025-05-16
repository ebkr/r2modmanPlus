import { getStore } from '../../providers/generic/store/StoreProvider';
import sanitize from 'sanitize-filename';
import { computed } from 'vue';

export function useProfilesComposable() {
    const store = getStore<any>();

    const profileList = computed(() => store.state.profiles.profileList as string[]);

    function setActiveProfile(profileName: string) {
        store.dispatch('profiles/setSelectedProfile', {profileName: profileName, prewarmCache: false});
    }

    function doesProfileExist(nameToCheck: string): boolean {
        if ((nameToCheck.match(new RegExp('^([a-zA-Z0-9])(\\s|[a-zA-Z0-9]|_|-|[.])*$'))) === null) {
            return true;
        }
        const safe: string = makeProfileNameSafe(nameToCheck);
        return (profileList.value.some((profile: string) => {
            return profile.toLowerCase() === safe.toLowerCase()
        }));
    }

    function makeProfileNameSafe(nameToSanitize: string): string {
        return sanitize(nameToSanitize);
    }

    return {
        setActiveProfile,
        doesProfileExist,
        makeProfileNameSafe,
        profileList,
    }
}
