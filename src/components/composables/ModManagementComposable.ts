import { getStore } from '@r2/providers/generic/store/StoreProvider';
import Dependants from '@r2/r2mm/mods/Dependants';
import R2Error from '@r2/model/errors/R2Error';
import { LogSeverity } from '@r2/providers/ror2/logging/LoggerProvider';
import ManifestV2 from '@r2/model/ManifestV2';

const store = getStore<any>();

export function useModManagementComposable() {

    async function uninstallMod(mod: ManifestV2) {
        const dependants = Dependants.getDependantList(mod, store.state.profile.modList);

        if (dependants.size > 0) {
            store.commit('openUninstallModModal', mod);
            return;
        }

        try {
            await store.dispatch(
                'profile/uninstallModsFromActiveProfile',
                { mods: [mod] }
            );
        } catch (e) {
            store.commit('error/handleError', {
                error: R2Error.fromThrownValue(e),
                severity: LogSeverity.ACTION_STOPPED
            });
        }
    }

    return {
        uninstallMod
    }
}
