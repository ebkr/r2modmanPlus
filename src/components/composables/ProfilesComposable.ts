import { getStore } from '../../providers/generic/store/StoreProvider';
import sanitize from 'sanitize-filename';

export function useProfilesComposable() {
    const store = getStore<any>();

    function doesProfileExist(nameToCheck: string): boolean {
        if ((nameToCheck.match(new RegExp('^([a-zA-Z0-9])(\\s|[a-zA-Z0-9]|_|-|[.])*$'))) === null) {
            return true;
        }
        const safe: string = makeProfileNameSafe(nameToCheck);
        const profileList = store.state.profiles.profileList;
        return (profileList.some((profile: string) => {
            return profile.toLowerCase() === safe.toLowerCase()
        }));
    }

    function makeProfileNameSafe(nameToSanitize: string): string {
        return sanitize(nameToSanitize);
    }

    return {
        doesProfileExist,
        makeProfileNameSafe,
    }
}
