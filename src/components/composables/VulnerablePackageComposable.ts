/**
 * Definitions are outside the composable function so that calculations are shared.
 * We do not need to recalculate on a per-usage basis.
 */
import { getStore } from '@r2/providers/generic/store/StoreProvider';
import { computed, ref, watch } from 'vue';
import ManifestV2 from '@r2/model/ManifestV2';
import ThunderstoreMod from '@r2/model/ThunderstoreMod';

const store = getStore<any>();

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const onlineModList = computed<Map<string, ThunderstoreMod>>(() => {
    const mods: ThunderstoreMod[] = store.state.tsMods.mods;
    return new Map<string, ThunderstoreMod>(mods.map(value => [value.getFullName(), value]));
});

const vulnerablePackages = computed<ManifestV2[]>(() => {
    // TODO - Fix logic (post dev testing)
    return localModList.value.filter(value => !value.isOnlineSource() && onlineModList.value.has(value.getName()));
});

export function useVulnerablePackageComposable() {

    const hasVulnerablePackages = computed<boolean>(() => vulnerablePackages.value.length > 0);

    function isVulnerablePackage(mod: ManifestV2) {
        return vulnerablePackages.value.findIndex(value => value.getName() === mod.getName()) >= 0;
    }

    return {
        vulnerablePackages,
        hasVulnerablePackages,
        isVulnerablePackage
    }
}
