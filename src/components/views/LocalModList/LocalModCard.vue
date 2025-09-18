<script lang="ts" setup>
import { ExpandableCard, ExternalLink } from '../../all';
import DonateButton from '../../buttons/DonateButton.vue';
import DonateIconButton from '../../buttons/DonateIconButton.vue';
import R2Error from '../../../model/errors/R2Error';
import ManifestV2 from '../../../model/ManifestV2';
import VersionNumber from '../../../model/VersionNumber';
import { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import Dependants from '../../../r2mm/mods/Dependants';
import { valueToReadableDate } from '../../../utils/DateUtils';
import { splitToNameAndVersion } from '../../../utils/DependencyUtils';
import { computed, ref, watch } from 'vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';

const store = getStore<State>();

type LocalModCardProps = {
    mod: ManifestV2;
}

const props = defineProps<LocalModCardProps>();

const disabledDependencies = ref<ManifestV2[]>([]);
const missingDependencies = ref<string[]>([]);
const disableChangePending = ref<boolean>(false);

// Mod loader packages can't be disabled as it's hard to define
// what that should even do in all cases.
const canBeDisabled = computed(() => !store.getters['isModLoader'](props.mod.getName()));

const isDeprecated = computed(() => store.state.tsMods.deprecated.get(props.mod.getName()) || false);
const isLatestVersion = computed(() => store.getters['tsMods/isLatestVersion'](props.mod));
const localModList = computed(() => store.state.profile.modList);
const tsMod = computed(() => store.getters['tsMods/tsMod'](props.mod));

function updateDependencies() {
    if (props.mod.getDependencies().length === 0) {
        return;
    }

    const dependencies = props.mod.getDependencies();
    const dependencyNames = dependencies.map(dependencyStringToModName);
    const foundDependencies: ManifestV2[] = [];

    for (const mod of localModList.value) {
        if (foundDependencies.length === dependencyNames.length) {
            break;
        }

        if (dependencyNames.includes(mod.getName())) {
            foundDependencies.push(mod);
        }
    }

    const foundNames = foundDependencies.map((mod) => mod.getName());

    disabledDependencies.value = foundDependencies.filter((d) => !d.isEnabled());
    missingDependencies.value = dependencies.filter(
        (d) => !foundNames.includes(dependencyStringToModName(d))
    );
}

watch(localModList, updateDependencies);

async function disableMod() {
    if (disableChangePending.value) {
        return;
    }

    disableChangePending.value = true;
    const dependants = Dependants.getDependantList(props.mod, localModList.value);

    for (const mod of dependants) {
        if (mod.isEnabled()) {
            store.commit('openDisableModModal', props.mod);
            disableChangePending.value = false;
            return;
        }
    }

    try {
        await store.dispatch(
            'profile/disableModsFromActiveProfile',
            { mods: [props.mod] }
        );
    } catch (e) {
        store.commit('error/handleError', {
            error: R2Error.fromThrownValue(e),
            severity: LogSeverity.ACTION_STOPPED
        });
    }

    disableChangePending.value = false;
}

async function enableMod(mod: ManifestV2) {
    if (disableChangePending.value) {
        return;
    }

    disableChangePending.value = true;
    const dependencies = Dependants.getDependencyList(mod, localModList.value);

    try {
        await store.dispatch(
            'profile/enableModsOnActiveProfile',
            { mods: [...dependencies, mod] }
        );
    } catch (e) {
        store.commit('error/handleError', {
            error: R2Error.fromThrownValue(e),
            severity: LogSeverity.ACTION_STOPPED
        });
    }

    disableChangePending.value = false;
}

async function uninstallMod() {
    const dependants = Dependants.getDependantList(props.mod, localModList.value);

    if (dependants.size > 0) {
        store.commit('openUninstallModModal', props.mod);
        return;
    }

    try {
        await store.dispatch(
            'profile/uninstallModsFromActiveProfile',
            { mods: [props.mod] }
        );
    } catch (e) {
        store.commit('error/handleError', {
            error: R2Error.fromThrownValue(e),
            severity: LogSeverity.ACTION_STOPPED
        });
    }
}

function updateMod() {
    if (tsMod.value !== undefined) {
        store.commit('openDownloadModVersionSelectModal', tsMod.value);
    }
}

function downloadDependency(dependencyString: string) {
    const [name, version] = splitToNameAndVersion(dependencyString);
    const partialManifest = new ManifestV2();
    partialManifest.setName(name);
    partialManifest.setVersionNumber(new VersionNumber(version));
    const dependency = store.getters['tsMods/tsMod'](partialManifest);

    if (dependency === undefined) {
        const error = new R2Error(
            `${dependencyString} could not be found`,
            'You may be offline, or the mod was removed from Thunderstore.',
            'The dependency may not yet be published to Thunderstore and may be available elsewhere.'
        );
        store.commit('error/handleError', error);
        return;
    }
    store.commit('openDownloadModVersionSelectModal', dependency);
}

function viewAssociatedMods() {
    store.commit('openAssociatedModsModal', props.mod);
}

function created() {
    updateDependencies();
}

// Need to wrap util call in method to allow access from Vue context
function getReadableDate(value: number): string {
    return valueToReadableDate(value);
}

function dependencyStringToModName(x: string) {
    return x.substring(0, x.lastIndexOf('-'));
}
</script>

<template>
    <ExpandableCard
        :description="mod.getDescription()"
        :enabled="mod.isEnabled()"
        :id="`${mod.getAuthorName()}-${mod.getName()}-${mod.getVersionNumber()}`"
        :image="mod.getIcon()"
        :allowSorting="true">

        <template v-slot:title>
            <span class="non-selectable">
                <span v-if="isDeprecated"
                    class="tag is-danger margin-right margin-right--half-width"
                    v-tooltip.right="'This mod is deprecated and could be broken'">
                    Deprecated
                </span>
                <span v-if="!mod.isEnabled()"
                    class="tag is-warning margin-right margin-right--half-width"
                    v-tooltip.right="'This mod will not be used in-game'">
                    Disabled
                </span>
                <span class="card-title selectable">
                    <component :is="mod.isEnabled() ? 'span' : 'strike'" class="selectable">
                        {{mod.getDisplayName()}}
                        <span class="selectable card-byline">
                            v{{mod.getVersionNumber()}}
                        </span>
                        <span :class="`card-byline ${mod.isEnabled() && 'selectable'}`">
                            by {{mod.getAuthorName()}}
                        </span>
                    </component>
                </span>
            </span>
        </template>

        <template v-slot:description>
            <p class='card-timestamp' v-if="mod.getInstalledAtTime() !== 0"><strong>Installed on:</strong> {{ getReadableDate(mod.getInstalledAtTime()) }}</p>
        </template>

        <!-- Show icon button row even when card is collapsed -->
        <template v-slot:other-icons>
            <DonateIconButton :mod="tsMod" v-if="tsMod"/>
            <span v-if="!isLatestVersion"
                @click.prevent.stop="updateMod()"
                class='card-header-icon'>
                <i class='fas fa-cloud-upload-alt' v-tooltip.left="'An update is available'"></i>
            </span>
            <span v-if="disabledDependencies.length || missingDependencies.length"
                class='card-header-icon'>
                <i v-tooltip.left="`There is an issue with the dependencies for this mod`"
                    class='fas fa-exclamation-circle'
                ></i>
            </span>
            <span v-if="canBeDisabled"
                @click.prevent.stop="() => mod.isEnabled() ? disableMod() : enableMod(mod)"
                class='card-header-icon'>
                <div class="field">
                    <input :id="`switch-${mod.getName()}`"
                        type="checkbox"
                        :class="['switch', 'is-small', {'switch is-info' : mod.isEnabled()}]"
                        :checked="mod.isEnabled()" />
                    <label :for="`switch-${mod.getName()}`"
                        v-tooltip.left="mod.isEnabled() ? 'Disable' : 'Enable'"></label>
                </div>
            </span>
        </template>

        <!-- Show bottom button row -->
        <a @click="uninstallMod()" class='card-footer-item'>
            Uninstall
        </a>

        <a v-if="canBeDisabled && mod.isEnabled()" @click="disableMod()" class='card-footer-item'>
            Disable
        </a>
        <a v-else-if="canBeDisabled && !mod.isEnabled()" @click="enableMod(mod)" class='card-footer-item' >
            Enable
        </a>

        <a @click="viewAssociatedMods()" class='card-footer-item'>
            Associated
        </a>

        <ExternalLink :url="mod.getWebsiteUrl()" class="card-footer-item">
            Website
            <i class="fas fa-external-link-alt margin-left margin-left--half-width"></i>
        </ExternalLink>

        <a v-if="!isLatestVersion" @click="updateMod()" class='card-footer-item'>
            Update
        </a>

        <a v-if="missingDependencies.length"
            @click="downloadDependency(missingDependencies[0])"
            class='card-footer-item'>
            Download dependency
        </a>

        <a v-if="disabledDependencies.length"
            @click="enableMod(disabledDependencies[0])"
            class='card-footer-item'>
            Enable {{disabledDependencies[0].getDisplayName()}}
        </a>

        <DonateButton :mod="tsMod"/>
    </ExpandableCard>
</template>

<style scoped lang="scss">
.switch {
    position: relative;
}
</style>
