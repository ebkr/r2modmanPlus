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

const allConcerningNames = computed(() => new Set(allConcerningPackages.value.map(mod => mod.getName())));
const activeConcerningNames = computed(() => new Set(activeConcerningPackages.value.map(mod => mod.getName())));

async function updateConcerningPackages() {
    const game = activeGame.value;
    const localMods = localModList.value;
    const concerningPackages: ManifestV2[] = [];
    const modsToCheck: ManifestV2[] = [];

    for (const mod of localMods) {
        if (!mod.isOnlineSource()) {
            continue;
        }
        if (!onlineModList.value.has(mod.getName())) {
            concerningPackages.push(mod);
        } else {
            modsToCheck.push(mod);
        }
    }

    const versionNumbersBatch = await PackageDb.getPackageVersionNumbersBatch(
        game.internalFolderName,
        modsToCheck.map(mod => mod.getName())
    );

    for (const mod of modsToCheck) {
        const versions = versionNumbersBatch.get(mod.getName());
        const dnf = !versions || !versions.includes(mod.getVersionNumber().toString());
        if (dnf) {
            concerningPackages.push(mod);
        }
    }

    allConcerningPackages.value = concerningPackages;
    activeConcerningPackages.value = concerningPackages.filter(value => !value.isTrustedPackage());
}

watch([activeGame, localModList, onlineModList], async () => {
    await updateConcerningPackages();
});

let initialLoad: Promise<void> | null = null;

export function useConcerningPackageComposable() {

    onMounted(() => {
        if (initialLoad === null) {
            initialLoad = updateConcerningPackages();
        }
    });

    const hasConcerningPackages = computed<boolean>(() => activeConcerningPackages.value.length > 0);

    function isConcerningPackage(mod: ManifestV2) {
        return activeConcerningNames.value.has(mod.getName());
    }

    function wasConcerningPackage(mod: ManifestV2) {
        return allConcerningNames.value.has(mod.getName());
    }

    return {
        concerningPackages: activeConcerningPackages,
        hasConcerningPackages,
        isConcerningPackage,
        wasConcerningPackage,
    }
}
