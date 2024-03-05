<template>
    <div>
        <SearchAndSort />
        <DisableModModal />
        <UninstallModModal />

        <AssociatedModsModal
            v-if="dependencyListDisplayType === 'view' && !!selectedManifestMod && showingDependencyList"
            :on-close="() => { showingDependencyList = false; }"
            :mod="selectedManifestMod"
            :dependency-list="getDependencyList(selectedManifestMod)"
            :dependants-list="getDependantList(selectedManifestMod)"
        />

        <slot name="above-list"></slot>

        <draggable v-model='draggableList' group="local-mods" handle=".handle"
                   @start="drag=$store.getters['profile/canSortMods']"
                   @end="drag=false"
                   :force-fallback="true"
                   :scroll-sensitivity="100">
            <local-mod-card
                v-for='(mod, index) in draggableList'
                :key="`local-${mod.getName()}-${profileName}-${index}-${cardExpanded}`"
                :mod="mod"
                @enableMod="enableMod"
                @uninstallMod="uninstallModRequireConfirmation"
                @updateMod="updateMod"
                @viewDependencyList="viewDependencyList"
                @downloadDependency="downloadDependency"
                :expandedByDefault="cardExpanded"
                :showSort="$store.getters['profile/canSortMods']"
                :funkyMode="funkyMode" />
        </draggable>

        <slot name="below-list"></slot>

    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import ManifestV2 from '../../model/ManifestV2';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import R2Error from '../../model/errors/R2Error';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import ModBridge from '../../r2mm/mods/ModBridge';
import DependencyListDisplayType from '../../model/enums/DependencyListDisplayType';
import Dependants from '../../r2mm/mods/Dependants';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import Profile from '../../model/Profile';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import GameManager from '../../model/game/GameManager';
import Game from '../../model/game/Game';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import Draggable from 'vuedraggable';
import AssociatedModsModal from './LocalModList/AssociatedModsModal.vue';
import DisableModModal from './LocalModList/DisableModModal.vue';
import UninstallModModal from './LocalModList/UninstallModModal.vue';
import LocalModCard from './LocalModList/LocalModCard.vue';
import SearchAndSort from './LocalModList/SearchAndSort.vue';

@Component({
        components: {
            Draggable,
            AssociatedModsModal,
            DisableModModal,
            UninstallModModal,
            LocalModCard,
            SearchAndSort,
        }
    })
    export default class LocalModList extends Vue {
        private activeGame: Game | null = null;
        settings: ManagerSettings = new ManagerSettings();

        private cardExpanded: boolean = false;
        private funkyMode: boolean = false;

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList || [];
        }

        private showingDependencyList: boolean = false;
        private selectedManifestMod: ManifestV2 | null = null;
        private dependencyListDisplayType: string = 'view';

        // Context
        private contextProfile: Profile | null = null;

        get draggableList() {
            return this.$store.getters['profile/visibleModList'];
        }

        set draggableList(newList: ManifestV2[]) {
            ProfileModList.requestLock(async () => {
                const result = await ProfileModList.saveModList(this.contextProfile!, newList);
                if (result instanceof R2Error) {
                    this.$store.commit('error/handleError', result);
                    return;
                }
                this.updateModListAfterChange(newList);
            })
        }

        get profileName() {
            return this.contextProfile!.getProfileName();
        }

        async updateModListAfterChange(updatedList: ManifestV2[]) {
            await this.$store.dispatch('profile/updateModList', updatedList);

            const err = await ConflictManagementProvider.instance.resolveConflicts(updatedList, this.contextProfile!);
            if (err instanceof R2Error) {
                this.$store.commit('error/handleError', err);
            }
        }

        getDependantList(mod: ManifestV2): Set<ManifestV2> {
            return Dependants.getDependantList(mod, this.$store.state.profile.modList);
        }

        getDependencyList(mod: ManifestV2): Set<ManifestV2> {
            return Dependants.getDependencyList(mod, this.$store.state.profile.modList);
        }

        async performUninstallMod(mod: ManifestV2, updateModList=true): Promise<ManifestV2[] | R2Error> {
            const uninstallError: R2Error | null = await ProfileInstallerProvider.instance.uninstallMod(mod, this.contextProfile!);
            if (uninstallError instanceof R2Error) {
                // Uninstall failed
                this.$store.commit('error/handleError', uninstallError);
                return uninstallError;
            }
            const modList: ManifestV2[] | R2Error = await ProfileModList.removeMod(mod, this.contextProfile!);
            if (modList instanceof R2Error) {
                // Failed to remove mod from local list.
                this.$store.commit('error/handleError', modList);
                return modList;
            }
            if (updateModList) {
                await this.updateModListAfterChange(modList);
            }
            return modList;
        }

        showDependencyList(mod: ManifestV2, displayType: string) {
            this.selectedManifestMod = mod;
            this.dependencyListDisplayType = displayType;
            this.showingDependencyList = true;
        }

        uninstallModRequireConfirmation(mod: ManifestV2) {
            if (this.getDependantList(mod).size === 0) {
                this.performUninstallMod(mod);
            } else {
                this.$store.commit('openUninstallModModal', mod);
            }
        }

        viewDependencyList(mod: ManifestV2) {
            this.showDependencyList(mod, DependencyListDisplayType.VIEW);
        }

        async enableMod(mod: ManifestV2) {
            try {
                const result = await this.performEnable([...this.getDependencyList(mod), mod]);
                if (result instanceof R2Error) {
                    throw result;
                }
            } catch (e) {
                this.$store.commit('error/handleError', {
                    error: R2Error.fromThrownValue(e),
                    severity: LogSeverity.ACTION_STOPPED
                });
            }
        }

        async performEnable(mods: ManifestV2[]): Promise<R2Error | void> {
            for (let mod of mods) {
                const enableErr: R2Error | void = await ProfileInstallerProvider.instance.enableMod(mod, this.contextProfile!);
                if (enableErr instanceof R2Error) {
                    // Failed to disable
                    this.showingDependencyList = false;
                    this.$store.commit('error/handleError', enableErr);
                    return enableErr;
                }
            }
            const updatedList = await ProfileModList.updateMods(mods, this.contextProfile!, (updatingMod: ManifestV2) => {
                updatingMod.enable();
            });
            if (updatedList instanceof R2Error) {
                // Failed to update mod list.
                this.showingDependencyList = false;
                this.$store.commit('error/handleError', updatedList);
                return updatedList;
            }
            await this.updateModListAfterChange(updatedList);
        }

        updateMod(mod: ManifestV2) {
            this.selectedManifestMod = mod;
            const tsMod = ModBridge.getCachedThunderstoreModFromMod(mod);

            if (tsMod instanceof ThunderstoreMod) {
                this.$store.commit("openDownloadModModal", tsMod);
            } else {
                this.$store.commit("closeDownloadModModal");
            }
        }

        downloadDependency(missingDependency: string) {
            const tsMod: ThunderstoreMod | undefined = this.thunderstorePackages.find(
                (m: ThunderstoreMod) => missingDependency.toLowerCase().startsWith(m.getFullName().toLowerCase() + "-")
            );
            if (tsMod === undefined) {
                this.$store.commit("closeDownloadModModal");
                const error = new R2Error(
                    `${missingDependency} could not be found`,
                    'You may be offline, or the mod was removed from Thunderstore.',
                    'The dependency may not yet be published to Thunderstore and may be available elsewhere.'
                );
                this.$store.commit('error/handleError', error);
                return;
            }
            this.$store.commit("openDownloadModModal", tsMod);
        }

        async created() {
            this.activeGame = GameManager.activeGame;
            this.contextProfile = Profile.getActiveProfile();
            this.settings = await ManagerSettings.getSingleton(this.activeGame);
            this.cardExpanded = this.settings.getContext().global.expandedCards;
            this.funkyMode = this.settings.getContext().global.funkyModeEnabled;
        }
    }

</script>
