import { Store } from "vuex";

import R2Error from "../model/errors/R2Error";
import Profile from "../model/Profile";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import ConflictManagementProvider from "../providers/generic/installing/ConflictManagementProvider";
import ProfileModList from "../r2mm/mods/ProfileModList";
import { installModsToProfile } from "../utils/ProfileUtils";

export async function downloadCompletedCallback(profile: Profile, downloadedMods: ThunderstoreCombo[], store: Store<any>) {
    const immutableProfile = profile.asImmutableProfile();
    await ProfileModList.requestLock(async () => {
        try {
            const modList = await installModsToProfile(downloadedMods, immutableProfile);
            await store.dispatch('profile/updateModList', modList);

            const err = await ConflictManagementProvider.instance.resolveConflicts(modList, profile);
            if (err instanceof R2Error) {
                throw err;
            }
        } catch (e) {
            store.commit('error/handleError', R2Error.fromThrownValue(e));
        }
    });
}
