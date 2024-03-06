<template>
    <div>
        <SearchAndSort />
        <DisableModModal />
        <UninstallModModal />
        <AssociatedModsModal />

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
        private contextProfile: Profile | null = null;
        settings: ManagerSettings = new ManagerSettings();
        private cardExpanded: boolean = false;
        private funkyMode: boolean = false;

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList || [];
        }

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
