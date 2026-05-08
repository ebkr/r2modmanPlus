import { getStore } from '@r2/providers/generic/store/StoreProvider';
import { computed, onMounted, ref, watch } from 'vue';
import ManifestV2 from '@r2/model/ManifestV2';
import ThunderstoreMod from '@r2/model/ThunderstoreMod';
import VersionNumber from '@r2/model/VersionNumber';
import * as PackageDb from "@r2/r2mm/manager/PackageDexieStore";

type ConcerningPackage = {
    fullName: string;
    latestVersion: string;
}

const store = getStore<any>();

const activeGame = computed(() => store.state.activeGame);

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const onlineModList = computed<Map<string, ConcerningPackage>>(() => {
    const mods: ThunderstoreMod[] = store.state.tsMods.mods;
    return new Map<string, ConcerningPackage>(mods.map(value => [value.getFullName(), {
        fullName: value.getFullName(),
        latestVersion: value.getLatestVersion(),
    }]));
});

const allConcerningPackages = ref<ManifestV2[]>([]);
const activeConcerningPackages = ref<ManifestV2[]>([]);

async function updateConcerningPackages() {
    const game = activeGame.value;
    const localMods = localModList.value;
    const concerningPackages = [];

    for (const mod of localMods) {
        if (!mod.isOnlineSource()) {
            continue;
        }
        if (!onlineModList.value.has(mod.getName())) {
            concerningPackages.push(mod);
            continue;
        }
        const packageVersionNumbers = await PackageDb.getPackageVersionNumbers(
            game.internalFolderName,
            mod.getName()
        );
        const dnf = !packageVersionNumbers.find(ver => ver === mod.getVersionNumber().toString());
        if (dnf) {
            concerningPackages.push(mod);
        }
    }

    allConcerningPackages.value = concerningPackages;
    activeConcerningPackages.value = concerningPackages.filter(value => !value.isTrustedPackage());
}

watch([activeGame, localModList], async () => {
    await updateConcerningPackages();
});

export function useConcerningPackageComposable() {

    onMounted(async () => {
        await updateConcerningPackages();
    });

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
