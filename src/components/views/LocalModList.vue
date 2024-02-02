<template>
    <div>

        <div class='inherit-background-colour sticky-top sticky-top--search non-selectable'>
            <div class='is-shadowless is-square'>
                <div class='no-padding-left card-header-title'>

                    <div class="input-group input-group--flex margin-right">
                        <label for="local-search" class="non-selectable">Search</label>
                        <DeferredInput
                            @changed="(value) => searchQuery = value"
                            id="local-search"
                            class="input margin-right"
                            type="text"
                            placeholder="Search for an installed mod"
                        />
                    </div>

                    <div class="input-group margin-right">
                        <label for="local-sort-order" class="non-selectable">Sort</label>
                        <select id="local-sort-order" class="select select--content-spacing margin-right margin-right--half-width" v-model="sortOrder">
                            <option v-for="(key, index) in getSortOrderOptions()" :key="`${index}-deprecated-position-option`">
                                {{key}}
                            </option>
                        </select>
                        <select id="local-sort-direction" class="select select--content-spacing" v-model="sortDirection">
                            <option v-for="(key, index) in getSortDirectionOptions()" :key="`${index}-deprecated-position-option`">
                                {{key}}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="local-deprecated-position" class="non-selectable">Disabled</label>
                        <select id="local-deprecated-position" class="select select--content-spacing" v-model="sortDisabledPosition">
                            <option v-for="(key, index) in getDeprecatedFilterOptions()" :key="`${index}-deprecated-position-option`">
                                {{key}}
                            </option>
                        </select>
                    </div>

                </div>
            </div>
        </div>

        <DisableModModal
            v-if="dependencyListDisplayType === 'disable' && !!selectedManifestMod && showingDependencyList"
            :on-close="() => { showingDependencyList = false; }"
            :mod="selectedManifestMod"
            :dependency-list="getDependencyList(selectedManifestMod)"
            :dependants-list="getDependantList(selectedManifestMod)"
            :mod-being-disabled="modBeingDisabled"
            :on-disable-include-dependents ="disableModWithDependents"
            :on-disable-exclude-dependents="disableModExcludeDependents"
        />
        <UninstallModModal
            v-if="dependencyListDisplayType === 'uninstall' && !!selectedManifestMod && showingDependencyList"
            :on-close="() => { showingDependencyList = false; }"
            :mod="selectedManifestMod"
            :dependency-list="getDependencyList(selectedManifestMod)"
            :dependants-list="getDependantList(selectedManifestMod)"
            :mod-being-uninstalled="modBeingUninstalled"
            :on-uninstall-include-dependents="uninstallModWithDependents"
            :on-uninstall-exclude-dependents="uninstallModExcludeDependents"
        />
        <AssociatedModsModal
            v-if="dependencyListDisplayType === 'view' && !!selectedManifestMod && showingDependencyList"
            :on-close="() => { showingDependencyList = false; }"
            :mod="selectedManifestMod"
            :dependency-list="getDependencyList(selectedManifestMod)"
            :dependants-list="getDependantList(selectedManifestMod)"
        />

        <slot name="above-list"></slot>

        <draggable v-model='draggableList' group="local-mods" handle=".handle"
                   @start="drag=canShowSortIcons"
                   @end="drag=false"
                   :force-fallback="true"
                   :scroll-sensitivity="100">
            <local-mod-card
                v-for='(mod, index) in draggableList'
                :key="`local-${mod.getName()}-${profileName}-${index}-${cardExpanded}`"
                :mod="mod"
                @disableMod="disableModRequireConfirmation"
                @enableMod="enableMod"
                @uninstallMod="uninstallModRequireConfirmation"
                @updateMod="updateMod"
                @viewDependencyList="viewDependencyList"
                @downloadDependency="downloadDependency"
                :disabledDependencies="getDisabledDependencies(mod)"
                :missingDependencies="getMissingDependencies(mod)"
                :expandedByDefault="cardExpanded"
                :showSort="canShowSortIcons"
                :funkyMode="funkyMode" />
        </draggable>

        <slot name="below-list"></slot>

    </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator';
import ManifestV2 from '../../model/ManifestV2';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import R2Error from '../../model/errors/R2Error';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import ModBridge from '../../r2mm/mods/ModBridge';
import Mod from '../../model/Mod';
import DependencyListDisplayType from '../../model/enums/DependencyListDisplayType';
import Dependants from '../../r2mm/mods/Dependants';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import Profile from '../../model/Profile';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ModListSort from '../../r2mm/mods/ModListSort';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import GameManager from '../../model/game/GameManager';
import Game from '../../model/game/Game';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import Draggable from 'vuedraggable';
import SearchUtils from '../../utils/SearchUtils';
import AssociatedModsModal from './LocalModList/AssociatedModsModal.vue';
import DisableModModal from './LocalModList/DisableModModal.vue';
import UninstallModModal from './LocalModList/UninstallModModal.vue';
import LocalModCard from './LocalModList/LocalModCard.vue';
import { DeferredInput } from '../all';

@Component({
        components: {
            Draggable,
            AssociatedModsModal,
            DisableModModal,
            UninstallModModal,
            LocalModCard,
            DeferredInput,
        }
    })
    export default class LocalModList extends Vue {

        settings: ManagerSettings = new ManagerSettings();

        private cardExpanded: boolean = false;
        private funkyMode: boolean = false;

        get modifiableModList(): ManifestV2[] {
            return ModListSort.sortLocalModList(this.$store.state.localModList, this.sortDirection,
                this.sortDisabledPosition, this.sortOrder);
        }

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList || [];
        }

        private searchableModList: ManifestV2[] = [];
        private showingDependencyList: boolean = false;
        private selectedManifestMod: ManifestV2 | null = null;
        private dependencyListDisplayType: string = 'view';
        private modBeingUninstalled: string | null = null;
        private modBeingDisabled: string | null = null;

        // Filtering
        private sortDisabledPosition: SortLocalDisabledMods = this.settings.getInstalledDisablePosition();
        private sortOrder: SortNaming = this.settings.getInstalledSortBy();
        private sortDirection: SortDirection = this.settings.getInstalledSortDirection();
        private searchQuery: string = '';
        private activeGame: Game | null = null;

        // Context
        private contextProfile: Profile | null = null;

        get draggableList() {
            return [...this.searchableModList]
        }

        set draggableList(newList: ManifestV2[]) {
            ProfileModList.requestLock(async () => {
                const result = await ProfileModList.saveModList(this.contextProfile!, newList);
                if (result instanceof R2Error) {
                    this.emitError(result);
                    return;
                }
                this.$store.dispatch("updateModList", newList);
                const err = await ConflictManagementProvider.instance.resolveConflicts(newList, this.contextProfile!);
                if (err instanceof R2Error) {
                    this.$emit('error', err);
                }
                this.filterModList();
            })
        }

        get canShowSortIcons() {
            return this.sortDirection === SortDirection.STANDARD
                && this.sortOrder === SortNaming.CUSTOM
                && this.sortDisabledPosition === SortLocalDisabledMods.CUSTOM
                && this.searchQuery.length === 0;
        }

        get profileName() {
            return this.contextProfile!.getProfileName();
        }

        @Watch("sortOrder")
        sortOrderChanged(newValue: string) {
            this.settings.setInstalledSortBy(newValue);
        }

        @Watch("sortDirection")
        sortDirectionChanged(newValue: string) {
            this.settings.setInstalledSortDirection(newValue);
        }

        @Watch("sortDisabledPosition")
        sortDisabledPositionChanged(newValue: string) {
            this.settings.setInstalledDisablePosition(newValue);
        }

        @Watch('modifiableModList')
        @Watch('searchQuery')
        filterModList() {
            if (this.searchQuery.trim() === '') {
                this.searchableModList = [...this.modifiableModList];
                return;
            }

            const searchKeys = SearchUtils.makeKeys(this.searchQuery);
            this.searchableModList = this.modifiableModList.filter((x: ManifestV2) => {
                return SearchUtils.isSearched(searchKeys, x.getName(), x.getDescription());
            });
        }

        async updateModListAfterChange(updatedList: ManifestV2[]) {
            await this.$store.dispatch("updateModList", updatedList);

            const err = await ConflictManagementProvider.instance.resolveConflicts(updatedList, this.contextProfile!);
            if (err instanceof R2Error) {
                this.$emit('error', err);
            }

            this.filterModList();
        }

        getMissingDependencies(vueMod: any): string[] {
            const mod: Mod = new Mod().fromReactive(vueMod);
            return mod.getDependencies().filter((dependency: string) => {
                // Include in filter if mod isn't found.
                return this.modifiableModList.find((localMod: ManifestV2) => dependency.toLowerCase().startsWith(localMod.getName().toLowerCase() + "-")) === undefined;
            });
        }

        getDisabledDependencies(vueMod: any): ManifestV2[] {
            const dependencies = new Mod()
                .fromReactive(vueMod)
                .getDependencies()
                .map((x) => x.toLowerCase().substring(0, x.lastIndexOf('-') + 1));

            return this.modifiableModList.filter(
                (mod) => !mod.isEnabled() && dependencies.includes(mod.getName().toLowerCase() + '-')
            );
        }

        getDependantList(mod: ManifestV2): Set<ManifestV2> {
            return Dependants.getDependantList(mod, this.modifiableModList);
        }

        getDependencyList(mod: ManifestV2): Set<ManifestV2> {
            return Dependants.getDependencyList(mod, this.modifiableModList);
        }

        async performUninstallMod(mod: ManifestV2, updateModList=true): Promise<ManifestV2[] | R2Error> {
            const uninstallError: R2Error | null = await ProfileInstallerProvider.instance.uninstallMod(mod, this.contextProfile!);
            if (uninstallError instanceof R2Error) {
                // Uninstall failed
                this.showingDependencyList = false;
                this.$emit('error', uninstallError);
                return uninstallError;
            }
            const modList: ManifestV2[] | R2Error = await ProfileModList.removeMod(mod, this.contextProfile!);
            if (modList instanceof R2Error) {
                // Failed to remove mod from local list.
                this.showingDependencyList = false;
                this.$emit('error', modList);
                return modList;
            }
            if (updateModList) {
                await this.updateModListAfterChange(modList);
            }
            return modList;
        }

        async disableModWithDependents(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            await this.disableMods([...Dependants.getDependantList(mod, this.modifiableModList), mod]);
        }

        async disableModExcludeDependents(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            await this.disableMods([mod]);
        }

        async disableMods(modsToDisable: ManifestV2[]) {
            try {
                const result = await this.performDisable(modsToDisable);
                if (result instanceof R2Error) {
                    this.$emit('error', result);
                    return;
                }
            } catch (e) {
                // Failed to disable mod.
                const err: Error = e as Error;
                this.$emit("error", err);
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
            } finally {
                this.selectedManifestMod = null;
                this.modBeingDisabled = null;
            }
        }

        async performDisable(mods: ManifestV2[]): Promise<R2Error | void> {
            this.modBeingDisabled = null;
            for (let mod of mods) {
                this.modBeingDisabled = mod.getName();
                const disableErr: R2Error | void = await ProfileInstallerProvider.instance.disableMod(mod, this.contextProfile!);
                if (disableErr instanceof R2Error) {
                    // Failed to disable
                    this.showingDependencyList = false;
                    this.modBeingDisabled = null;
                    this.$emit('error', disableErr);
                    return disableErr;
                }
            }
            const updatedList = await ProfileModList.updateMods(mods, this.contextProfile!, (updatingMod: ManifestV2) => {
                updatingMod.disable();
            });
            if (updatedList instanceof R2Error) {
                // Failed to update mod list.
                this.showingDependencyList = false;
                this.modBeingDisabled = null;
                this.$emit('error', updatedList);
                return updatedList;
            }
            this.modBeingDisabled = null;
            await this.updateModListAfterChange(updatedList);
        }

        async uninstallModWithDependents(vueMod: any) {
            let mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            await this.uninstallMods([...Dependants.getDependantList(mod, this.modifiableModList), mod]);
        }

        async uninstallModExcludeDependents(vueMod: any) {
            let mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            await this.uninstallMods([mod]);
        }

        async uninstallMods(modsToUninstall: ManifestV2[]) {
            let lastSuccess: ManifestV2[] | null = null;
            try {
                for (const mod of modsToUninstall) {
                    this.modBeingUninstalled = mod.getName();
                    const result = await this.performUninstallMod(mod, false);
                    if (result instanceof R2Error) {
                        this.$emit('error', result);
                        this.modBeingUninstalled = null;
                        return;
                    } else {
                        lastSuccess = result;
                    }
                }
            } catch (e) {
                // Failed to uninstall mod.
                const err: Error = e as Error;
                this.$emit('error', err);
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
            } finally {
                this.modBeingUninstalled = null;
                if (lastSuccess) {
                    await this.updateModListAfterChange(lastSuccess);
                }
            }
            this.selectedManifestMod = null;
            const result: ManifestV2[] | R2Error = await ProfileModList.getModList(this.contextProfile!);
            if (result instanceof R2Error) {
                this.$emit('error', result);
                return;
            }
            await this.updateModListAfterChange(result);
        }

        showDependencyList(vueMod: any, displayType: string) {
            this.selectedManifestMod = new ManifestV2().fromReactive(vueMod);
            this.dependencyListDisplayType = displayType;
            this.showingDependencyList = true;
        }

        uninstallModRequireConfirmation(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            if (this.getDependantList(mod).size === 0) {
                this.performUninstallMod(mod);
            } else {
                this.showDependencyList(mod, DependencyListDisplayType.UNINSTALL);
            }
        }

        disableModRequireConfirmation(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            for (const value of this.getDependantList(mod)) {
               if (value.isEnabled()) {
                   this.showDependencyList(mod, DependencyListDisplayType.DISABLE);
                   return;
               }
            }
            this.performDisable([mod]);
        }

        viewDependencyList(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            this.showDependencyList(mod, DependencyListDisplayType.VIEW);
        }

        async enableMod(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            try {
                const result = await this.performEnable([...Dependants.getDependencyList(mod, this.modifiableModList), mod]);
                if (result instanceof R2Error) {
                    throw result;
                }
            } catch (e) {
                // Failed to disable mod.
                const err: Error = e as Error;
                this.$emit('error', err);
                LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
            }
        }

        async performEnable(mods: ManifestV2[]): Promise<R2Error | void> {
            for (let mod of mods) {
                const disableErr: R2Error | void = await ProfileInstallerProvider.instance.enableMod(mod, this.contextProfile!);
                if (disableErr instanceof R2Error) {
                    // Failed to disable
                    this.showingDependencyList = false;
                    this.$emit('error', disableErr);
                    return disableErr;
                }
            }
            const updatedList = await ProfileModList.updateMods(mods, this.contextProfile!, (updatingMod: ManifestV2) => {
                updatingMod.enable();
            });
            if (updatedList instanceof R2Error) {
                // Failed to update mod list.
                this.showingDependencyList = false;
                this.$emit('error', updatedList);
                return updatedList;
            }
            await this.updateModListAfterChange(updatedList);
        }

        updateMod(vueMod: any) {
            this.selectedManifestMod = new ManifestV2().fromReactive(vueMod);
            const mod = ModBridge.getThunderstoreModFromMod(
                this.selectedManifestMod,
                this.thunderstorePackages
            );
            if (mod instanceof ThunderstoreMod) {
                this.$store.commit("openDownloadModModal", mod);
            } else {
                this.$store.commit("closeDownloadModModal");
            }
        }

        downloadDependency(missingDependency: string) {
            const mod: ThunderstoreMod | undefined = this.thunderstorePackages.find(
                (tsMod: ThunderstoreMod) => missingDependency.toLowerCase().startsWith(tsMod.getFullName().toLowerCase() + "-")
            );
            if (mod === undefined) {
                this.$store.commit("closeDownloadModModal");
                const error = new R2Error(
                    `${missingDependency} could not be found`,
                    'You may be offline, or the mod was removed from Thunderstore.',
                    'The dependency may not yet be published to Thunderstore and may be available elsewhere.'
                );
                this.$emit('error', error);
                return;
            }
            this.$store.commit("openDownloadModModal", mod);
        }

        getDeprecatedFilterOptions() {
            return Object.values(SortLocalDisabledMods);
        }

        getSortOrderOptions() {
            return Object.values(SortNaming);
        }

        getSortDirectionOptions() {
            return Object.values(SortDirection);
        }

        async created() {
            this.activeGame = GameManager.activeGame;
            this.settings = await ManagerSettings.getSingleton(this.activeGame);
            this.contextProfile = Profile.getActiveProfile();
            this.filterModList();

            this.cardExpanded = this.settings.getContext().global.expandedCards;
            this.funkyMode = this.settings.getContext().global.funkyModeEnabled;
        }

        emitError(error: R2Error) {
            this.$emit('error', error);
        }

    }

</script>
