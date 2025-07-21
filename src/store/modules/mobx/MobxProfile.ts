import Profile from 'src/model/Profile';
import { makeObservable, observable, computed, action } from 'mobx';
import R2Error from 'src/model/errors/R2Error';
import { getStore } from 'src/providers/generic/store/StoreProvider';
import { State } from 'src/store';

class MobxProfile {

    _activeProfile: Profile = Profile.getActiveProfile() || new Profile("Default");

    constructor() {
        makeObservable(this, {
            _activeProfile: observable,
            activeProfile: computed,
            setActiveProfile: action,
            activeProfileOrThrow: action,
        });
    }

    get activeProfile() {
        return this._activeProfile;
    }

    activeProfileOrThrow() {
        if (this._activeProfile === null) {
            throw new R2Error(
                'No active profile found',
                'Unable to modify mod list state when active profile is not set.'
            )
        }
        return this._activeProfile;
    }

    async setActiveProfile(params: { profileName: string, prewarmCache: boolean }) {
        this._activeProfile = new Profile(params.profileName);
        const store = getStore<State>()
        await store.getters['settings'].setProfile(params.profileName);
        if (params.prewarmCache) {
            await store.dispatch('profile/updateModListFromFile', null, { root: true });
            await store.dispatch('tsMods/prewarmCache', null, { root: true });
        }
    }
}

export const MobxProfileInstance = new MobxProfile();
