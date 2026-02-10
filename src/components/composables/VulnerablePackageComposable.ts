/**
 * Definitions are outside the composable function so that calculations are shared.
 * We do not need to recalculate on a per-usage basis.
 */
import { getStore } from '@r2/providers/generic/store/StoreProvider';
import { computed } from 'vue';
import ManifestV2 from '@r2/model/ManifestV2';
import ThunderstoreMod from '@r2/model/ThunderstoreMod';

const store = getStore<any>();

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const onlineModList = computed<Map<string, ThunderstoreMod>>(() => {
    const mods: ThunderstoreMod[] = store.state.tsMods.mods;
    return new Map<string, ThunderstoreMod>(mods.map(value => [value.getFullName(), value]));
});

const vulnerablePackages = computed<ManifestV2[]>(() => {
    return localModList.value.filter(value => !value.isOnlineSource() && onlineModList.value.has(value.getName()));
});

const hasVulnerablePackages = computed<boolean>(() => vulnerablePackages.value.length > 0);

export function useVulnerablePackageComposable() {
    return {
        vulnerablePackages,
        hasVulnerablePackages
    }
}
