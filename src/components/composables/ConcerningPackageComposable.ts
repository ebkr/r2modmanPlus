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

const allConcerningPackages = computed<ManifestV2[]>(() => {
    return localModList.value.filter(value => (value.isOnlineSource() && !onlineModList.value.has(value.getName())));
});

const activeConcerningPackages = computed<ManifestV2[]>(() => {
    return allConcerningPackages.value.filter(value => !value.isTrustedPackage() && (value.isOnlineSource() && !onlineModList.value.has(value.getName())));
});

export function useConcerningPackageComposable() {

    const hasConcerningPackages = computed<boolean>(() => activeConcerningPackages.value.length > 0);

    function isConcerningPackage(mod: ManifestV2) {
        return activeConcerningPackages.value.findIndex(value => value.getName() === mod.getName()) >= 0;
    }

    function wasConcerningPackage(mod: ManifestV2) {
        return allConcerningPackages.value.findIndex(value => value.getName() === mod.getName()) >= 0;
    }

    return {
        concerningPackages: activeConcerningPackages,
        hasConcerningPackages,
        isConcerningPackage,
        wasConcerningPackage,
    }
}
