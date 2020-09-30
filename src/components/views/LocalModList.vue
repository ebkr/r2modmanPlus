<template>
    <div>

        <div class='sticky-top sticky-top--search border-at-bottom'>
            <div class='card is-shadowless is-square card--is-compressed'>
                <div class='card-header-title'>

                    <div class="input-group input-group--flex margin-right">
                        <label for="local-search" class="non-selectable">Search</label>
                        <input id="local-search" v-model='searchQuery' class="input margin-right" type="text" placeholder="Search for an installed mod"/>
                    </div>

                    <div class="input-group margin-right">
                        <label for="local-sort-order" class="non-selectable">Sort</label>
                        <select id="local-sort-order" class="select select--content-spacing" v-model="sortOrder">
                            <option v-for="(key, index) in getSortOrderOptions()" :key="`${index}-deprecated-position-option`">
                                {{key}}
                            </option>
                        </select>
                        <span>&nbsp;</span>
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

        <DownloadModModal
            :show-download-modal="manifestModAsThunderstoreMod !== null"
            :thunderstore-mod="manifestModAsThunderstoreMod"
            :update-all-mods="false"
            @closed-modal="manifestModAsThunderstoreMod = null;"
            @error="emitError($event)"
        />

        <Modal v-show="showingDependencyList" v-if="selectedManifestMod !== null"
               @close-modal="showingDependencyList = null">
            <template v-slot:title>
                <p v-if="dependencyListDisplayType === 'disable'" class='card-header-title'>Disabling
                    {{selectedManifestMod.getName()}}
                </p>
                <p v-if="dependencyListDisplayType === 'uninstall'" class='card-header-title'>Uninstalling
                    {{selectedManifestMod.getName()}}
                </p>
                <p v-if="dependencyListDisplayType === 'view'" class='card-header-title'>Mods associated with
                    {{selectedManifestMod.getName()}}
                </p>
            </template>
            <template v-slot:body>
                <div v-if="dependencyListDisplayType === 'disable'" class='notification is-warning'>
                    <p>Other mods depend on this mod. Disabling this mod will disable all other dependants.</p>
                </div>
                <div v-if="dependencyListDisplayType === 'uninstall'" class='notification is-warning'>
                    <p>Other mods depend on this mod. Uninstalling this mod will remove all mods that depend on it.</p>
                </div>
                <p v-if="dependencyListDisplayType === 'disable'">Mods to be disabled:</p>
                <p v-if="dependencyListDisplayType === 'uninstall'">Mods to be uninstalled:</p>
                <br v-if="dependencyListDisplayType !== 'view'"/>
                <div v-if="dependencyListDisplayType !== 'view'">
                    <ul class="list">
                        <li class="list-item">{{selectedManifestMod.getName()}}</li>
                        <li class="list-item" v-for='(key, index) in getDependantList(selectedManifestMod)'
                            :key='`dependant-${index}`'>
                            {{key.getName()}}
                        </li>
                    </ul>
                </div>
                <div v-if="dependencyListDisplayType === 'view'">
                    <div v-if="getDependencyList(selectedManifestMod).size > 0">
                        <h3 class="subtitle is-5">Dependencies</h3>
                        <ul class="list">
                            <li class="list-item" v-for='(key, index) in getDependencyList(selectedManifestMod)'
                                :key='`dependency-${index}`'>
                                {{key.getName()}}
                            </li>
                        </ul>
                    </div>
                    <br v-if="getDependencyList(selectedManifestMod).size > 0"/>
                    <div v-if="getDependantList(selectedManifestMod).size > 0">
                        <h3 class="subtitle is-5">Dependants</h3>
                        <ul class="list">
                            <li class="list-item" v-for='(key, index) in getDependantList(selectedManifestMod)'
                                :key='`dependant-${index}`'>
                                {{key.getName()}}
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button v-if="dependencyListDisplayType === 'disable'" class="button is-info"
                        @click="disableMod(selectedManifestMod)">
                    Disable
                </button>
                <button v-if="dependencyListDisplayType === 'uninstall'" class="button is-info"
                        @click="uninstallMod(selectedManifestMod)">
                    Uninstall
                </button>
                <button v-if="dependencyListDisplayType === 'view'" class="button is-info"
                        @click="selectedManifestMod = null">
                    Done
                </button>
            </template>
        </Modal>

        <draggable ref="draggable" v-model='sortableModList' group="mods"
                   animation="200"
                   @start="startSort()" 
                   @end="endSort()">
                    <local-mod-card v-for='(key, index) in sortableModList' :key="'local-' + key.getName()"
                                    :id="index"
                                    :manifest="key"
                                    :missingDependencies="getMissingDependencies(key)"
                                    :funkyMode="settings.funkyModeEnabled"
                                    @update-enabled="toggleMod(key, $event)"
                                    @update-mod="updateMod(key)"
                                    @uninstall-mod="uninstallModRequireConfirmation(key)"
                                    @view-associated-mods="viewDependencyList(key)">
                    </local-mod-card>
        </draggable>
    </div>
</template>

<script lang="ts">

    import { Component, Vue, Watch } from 'vue-property-decorator';
    import Draggable from 'vuedraggable';
    import ManifestV2 from '../../model/ManifestV2';
    import ProfileModList from '../../r2mm/mods/ProfileModList';
    import R2Error from '../../model/errors/R2Error';
    import ManagerSettings from '../../r2mm/manager/ManagerSettings';
    import ThunderstoreVersion from '../../model/ThunderstoreVersion';
    import ModBridge from '../../r2mm/mods/ModBridge';
    import Mod from '../../model/Mod';
    import DependencyListDisplayType from '../../model/enums/DependencyListDisplayType';
    import Dependants from '../../r2mm/mods/Dependants';
    import ProfileInstaller from '../../r2mm/installing/ProfileInstaller';
    import { Logger, LogSeverity } from '../../r2mm/logging/Logger';
    import Profile from '../../model/Profile';
    import ThunderstoreMod from '../../model/ThunderstoreMod';
    import DownloadModModal from './DownloadModModal.vue';
    import { ExpandableCard, ExternalLink, Modal, LocalModCard } from '../all';
    import ModListTooltipManager from '../../r2mm/mods/ModListTooltipManager';
    import ModListSort from '../../r2mm/mods/ModListSort';
    import { SortDirection } from '../../model/real_enums/sort/SortDirection';
    import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
    import { SortNaming } from '../../model/real_enums/sort/SortNaming';

    @Component({
        components: {
            DownloadModModal,
            ExternalLink,
            ExpandableCard,
            LocalModCard,
            Modal,
            Draggable,
        }
    })
    export default class LocalModList extends Vue {

        get modifiableModList(): ManifestV2[] {
            return ModListSort.sortLocalModList(this.$store.state.localModList, this.sortDirection,
                this.sortDisabledPosition, this.sortOrder);
        }
        
        get sortableModList() {
            return [...this.searchableModList];
        }
        
        set sortableModList(value: ManifestV2[]) {
            const profile = Profile.getActiveProfile();
            const updatedList = ProfileModList.saveModList(profile, value) ?? ProfileModList.getModList(profile);
            if (updatedList instanceof R2Error) {
                this.$emit('error', updatedList);
                return;
            }
            this.$store.dispatch("updateModList", updatedList);
            this.filterModList();
        }

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList;
        }

        private searchableModList: ManifestV2[] = [];
        private settings: ManagerSettings = ManagerSettings.getSingleton();
        private showingDependencyList: boolean = false;
        private selectedManifestMod: ManifestV2 | null = null;
        private manifestModAsThunderstoreMod: ThunderstoreMod | null = null;
        private dependencyListDisplayType: string = 'view';

        // Filtering
        private sortDisabledPosition: SortLocalDisabledMods = SortLocalDisabledMods.CUSTOM;
        private sortOrder: SortNaming = SortNaming.CUSTOM;
        private sortDirection: SortDirection = SortDirection.STANDARD;
        private searchQuery: string = '';

        @Watch('modifiableModList')
        modListUpdated() {
            this.filterModList();
        }

        @Watch('searchQuery')
        filterModList() {
            if (this.searchQuery.trim() === '') {
                this.searchableModList = {...this.modifiableModList};
            }
            this.searchableModList = this.modifiableModList.filter((x: ManifestV2) => {
                return x.getName().toLowerCase().search(this.searchQuery.toLowerCase()) >= 0;
            });
        }

        isLatest(vueMod: any): boolean {
            return ModBridge.isLatestVersion(vueMod);
        }

        getMissingDependencies(vueMod: any): string[] {
            const mod: Mod = new Mod().fromReactive(vueMod);
            return mod.getDependencies().filter((dependency: string) => {
                // Include in filter if mod isn't found.
                return this.modifiableModList.find((localMod: ManifestV2) => dependency.toLowerCase().startsWith(localMod.getName().toLowerCase() + "-")) === undefined;
            });
        }

        getDependantList(mod: ManifestV2): Set<ManifestV2> {
            return Dependants.getDependantList(mod, this.modifiableModList);
        }

        getDependencyList(mod: ManifestV2): Set<ManifestV2> {
            return Dependants.getDependencyList(mod, this.modifiableModList);
        }

        performUninstallMod(mod: ManifestV2): R2Error | void {
            const uninstallError: R2Error | null = ProfileInstaller.uninstallMod(mod);
            if (uninstallError instanceof R2Error) {
                // Uninstall failed
                this.$emit('error', uninstallError);
                return uninstallError;
            }
            const modList: ManifestV2[] | R2Error = ProfileModList.removeMod(mod);
            if (modList instanceof R2Error) {
                // Failed to remove mod from local list.
                this.$emit('error', modList);
                return modList;
            }
            this.$store.dispatch("updateModList",modList);
        }

        disableMod(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            try {
                Dependants.getDependantList(mod, this.modifiableModList).forEach(dependant => {
                    const result = this.performDisable(dependant);
                    if (result instanceof R2Error) {
                        this.$emit('error', result);
                        return;
                    }
                });
                const result = this.performDisable(mod);
                if (result instanceof R2Error) {
                    this.$emit('error', result);
                    return;
                }
            } catch (e) {
                // Failed to disable mod.
                const err: R2Error = e;
                Logger.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
            }
            this.selectedManifestMod = null;
        }

        performDisable(mod: ManifestV2): R2Error | void {
            const disableErr: R2Error | void = ProfileInstaller.disableMod(mod);
            if (disableErr instanceof R2Error) {
                // Failed to disable
                this.$emit('error', disableErr);
                return disableErr;
            }
            const updatedList = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
                updatingMod.disable();
            });
            if (updatedList instanceof R2Error) {
                // Failed to update mod list.
                this.$emit('error', updatedList);
                return updatedList;
            }
             this.$store.dispatch("updateModList",updatedList);
            this.filterModList();
        }

        uninstallMod(vueMod: any) {
            let mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            try {
                Dependants.getDependantList(mod, this.modifiableModList).forEach(dependant => {
                    const result = this.performUninstallMod(dependant);
                    if (result instanceof R2Error) {
                        this.$emit('error', result);
                        return;
                    }
                });
                const result = this.performUninstallMod(mod);
                if (result instanceof R2Error) {
                    this.$emit('error', result);
                    return;
                }
            } catch (e) {
                // Failed to uninstall mod.
                const err: R2Error = e;
                Logger.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
            }
            this.selectedManifestMod = null;
            const result: ManifestV2[] | R2Error = ProfileModList.getModList(Profile.getActiveProfile());
            if (result instanceof R2Error) {
                this.$emit('error', result);
                return;
            }
             this.$store.dispatch("updateModList",result);
            this.filterModList();
        }

        showDependencyList(vueMod: any, displayType: string) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            this.selectedManifestMod = mod;
            this.dependencyListDisplayType = displayType;
            this.showingDependencyList = true;
        }

        /**
         * @returns whether the mod was uninstalled. If the mod was not uninstalled, an uninstall comfirmation is shown
         */
        uninstallModRequireConfirmation(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2();
            if (vueMod instanceof ThunderstoreMod) {
                vueMod = this.searchableModList.find((local: ManifestV2) => local.getName() === vueMod!.getFullName());
                if (vueMod === undefined) {
                    return;
                }
            }
            
            mod.fromReactive(vueMod);
            
            if (this.getDependantList(mod).size === 0) {
                this.performUninstallMod(mod);
                this.filterModList();
                return true;
            } else {
                this.showDependencyList(mod, DependencyListDisplayType.UNINSTALL);
                return false;
            }
        }

        disableModRequireConfirmation(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            if (this.getDependantList(mod).size === 0) {
                this.performDisable(mod);
            } else {
                this.showDependencyList(mod, DependencyListDisplayType.DISABLE);
            }
        }

        viewDependencyList(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            this.showDependencyList(mod, DependencyListDisplayType.VIEW);
        }

        enableMod(vueMod: any) {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            try {
                Dependants.getDependencyList(mod, this.modifiableModList).forEach(dependant => {
                    const result = this.performEnable(dependant);
                    if (result instanceof R2Error) {
                        throw result;
                    }
                });
                const result = this.performEnable(mod);
                if (result instanceof R2Error) {
                    throw result;
                }
            } catch (e) {
                // Failed to disable mod.
                const err: R2Error = e;
                Logger.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
            }
        }
        
        toggleMod(vueMod: any, enabled: boolean) {
            if (enabled) {
                this.enableMod(vueMod);
            } else {
                this.disableModRequireConfirmation(vueMod);
            }
        }

        performEnable(vueMod: any): R2Error | void {
            const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
            const disableErr: R2Error | void = ProfileInstaller.enableMod(mod);
            if (disableErr instanceof R2Error) {
                // Failed to disable
                this.$emit('error', disableErr);
                return disableErr;
            }
            const updatedList = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
                updatingMod.enable();
            });
            if (updatedList instanceof R2Error) {
                // Failed to update mod list.
                this.$emit('error', updatedList);
                return updatedList;
            }
             this.$store.dispatch("updateModList",updatedList);
            this.filterModList();
        }

        updateMod(vueMod: any) {
            this.selectedManifestMod = new ManifestV2().fromReactive(vueMod);
            const mod = ModBridge.getThunderstoreModFromMod(
                this.selectedManifestMod,
                this.thunderstorePackages
            );
            if (mod instanceof ThunderstoreMod) {
                this.manifestModAsThunderstoreMod = mod;
            } else {
                this.manifestModAsThunderstoreMod = null;
            }
        }

        downloadDependency(missingDependency: string) {
            const mod: ThunderstoreMod | undefined = this.thunderstorePackages.find(
                (tsMod: ThunderstoreMod) => missingDependency.toLowerCase().startsWith(tsMod.getFullName().toLowerCase() + "-")
            );
            if (mod === undefined) {
                this.manifestModAsThunderstoreMod = null;
                const error = new R2Error(
                    `${missingDependency} could not be found`,
                    'You may be offline, or the mod was removed from Thunderstore.',
                    'The dependency may not yet be published to Thunderstore and may be available elsewhere.'
                );
                this.$emit('error', error);
                return;
            }
            this.manifestModAsThunderstoreMod = mod;
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
        
        startSort() {
            if (!this.canSort()) {
                return false;
            }
            
            (this.$refs.draggable as Vue).$el.classList.add('sorting');
            this.$emit('sort-start');
        }
        
        endSort() {
            (this.$refs.draggable as Vue).$el.classList.remove('sorting');
            this.$emit('sort-end')
        }

        canSort() {
            return this.sortDirection === SortDirection.STANDARD
                && this.sortOrder === SortNaming.CUSTOM
                && this.sortDisabledPosition === SortLocalDisabledMods.CUSTOM;
        }

        created() {
            this.filterModList();
        }

        emitError(error: R2Error) {
            this.$emit('error', error);
        }

    }

</script>
