<template>
    <div class="bundle-list">
        <p v-if="bundles.length === 0" class="no-bundles">
            No mods to show.
        </p>

        <div v-for="bundle in bundles" :key="`bundle-${bundle.root.getName()}`" class="bundle">
            <div class="bundle-header">
                <span class="bundle-header-toggle" @click="toggleExpanded(bundle.root.getName())">
                    <i :class="isExpanded(bundle.root.getName()) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
                    <span class="bundle-title">{{ bundle.root.getDisplayName() }}</span>
                    <span class="bundle-subtitle">
                        {{ dependencyCount(bundle) }} {{ dependencyCount(bundle) === 1 ? 'dependency' : 'dependencies' }}
                    </span>
                    <span v-if="!bundle.root.isEnabled()" class="tag is-warning bundle-tag">Disabled</span>
                </span>
                <span class="bundle-header-actions">
                    <button v-if="bundle.root.isEnabled()"
                        class="button is-small"
                        :disabled="pending"
                        @click="disableBundle(bundle.root)">
                        Disable bundle
                    </button>
                    <button v-else
                        class="button is-small"
                        :disabled="pending"
                        @click="enableBundle(bundle.root)">
                        Enable bundle
                    </button>
                </span>
            </div>

            <div v-if="isExpanded(bundle.root.getName())" class="bundle-members">
                <LocalModCard
                    :version="installedVersions.get(bundle.root.getName())"
                    :mod="bundle.root" />

                <div v-for="member in dependencies(bundle)"
                    :key="`bundle-${bundle.root.getName()}-member-${member.getName()}`"
                    class="bundle-member">
                    <span v-if="sharedMemberNames.has(member.getName())"
                        class="tag is-info bundle-shared-tag"
                        v-tooltip.right="'Shared with another bundle; stays enabled while any owning bundle is enabled.'">
                        Shared
                    </span>
                    <LocalModCard
                        :version="installedVersions.get(member.getName())"
                        :mod="member" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import LocalModCard from './LocalModCard.vue';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import ThunderstoreVersion from '../../../model/ThunderstoreVersion';
import { Bundle } from '../../../r2mm/mods/BundleGraph';
import { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import { getCombosByDependencyStrings } from '../../../r2mm/manager/PackageDexieStore';

const store = getStore<State>();

const bundles = computed<Bundle[]>(() => store.getters['profile/bundleList']);
const modList = computed<ManifestV2[]>(() => store.state.profile.modList);
const activeGame = computed(() => store.state.activeGame);

const pending = ref<boolean>(false);
const expanded = ref<Set<string>>(new Set());

function isExpanded(rootName: string): boolean {
    return expanded.value.has(rootName);
}

function toggleExpanded(rootName: string) {
    const next = new Set(expanded.value);
    next.has(rootName) ? next.delete(rootName) : next.add(rootName);
    expanded.value = next;
}

function dependencies(bundle: Bundle): ManifestV2[] {
    return bundle.members.filter((mod) => mod !== bundle.root);
}

function dependencyCount(bundle: Bundle): number {
    return bundle.members.length - 1;
}

// Members that belong to more than one bundle, so the user knows disabling one
// bundle may leave them enabled.
const sharedMemberNames = computed<Set<string>>(() => {
    const counts = new Map<string, number>();
    for (const bundle of bundles.value) {
        for (const member of bundle.members) {
            counts.set(member.getName(), (counts.get(member.getName()) ?? 0) + 1);
        }
    }
    return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([name]) => name));
});

async function disableBundle(root: ManifestV2) {
    if (pending.value) {
        return;
    }
    pending.value = true;
    try {
        await store.dispatch('profile/disableBundleOnActiveProfile', { root });
    } catch (e) {
        store.commit('error/handleError', {
            error: R2Error.fromThrownValue(e),
            severity: LogSeverity.ACTION_STOPPED
        });
    } finally {
        pending.value = false;
    }
}

async function enableBundle(root: ManifestV2) {
    if (pending.value) {
        return;
    }
    pending.value = true;
    try {
        await store.dispatch('profile/enableBundleOnActiveProfile', { root });
    } catch (e) {
        store.commit('error/handleError', {
            error: R2Error.fromThrownValue(e),
            severity: LogSeverity.ACTION_STOPPED
        });
    } finally {
        pending.value = false;
    }
}

const installedVersions = ref<Map<string, ThunderstoreVersion>>(new Map());

async function updateInstalledVersions() {
    const dependencyStrings = modList.value.map((mod) => `${mod.getName()}-${mod.getVersionNumber().toString()}`);
    const combos = await getCombosByDependencyStrings(activeGame.value, dependencyStrings, false);
    installedVersions.value = new Map(combos.map((combo) => [combo.getMod().getFullName(), combo.getVersion()]));
}

onMounted(updateInstalledVersions);
watch(modList, updateInstalledVersions);
</script>

<style scoped lang="scss">
.bundle {
    margin-bottom: 1rem;
}

.bundle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    background-color: var(--bundle-header-bg, rgba(128, 128, 128, 0.12));
    cursor: default;
}

.bundle-header-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    flex: 1;
    min-width: 0;
}

.bundle-title {
    font-weight: 600;
}

.bundle-subtitle {
    opacity: 0.7;
    font-size: 0.85em;
}

.bundle-tag,
.bundle-shared-tag {
    margin-left: 0.25rem;
}

.bundle-members {
    padding-left: 1.25rem;
    margin-top: 0.5rem;
    border-left: 2px solid rgba(128, 128, 128, 0.25);
}

.bundle-member {
    position: relative;
}

.bundle-shared-tag {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    z-index: 1;
}

.no-bundles {
    opacity: 0.7;
    padding: 1rem;
}
</style>
