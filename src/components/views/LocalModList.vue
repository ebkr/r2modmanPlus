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
                :key="`local-${mod.getName()}-${profileName}-${index}`"
                :mod="mod" />
        </draggable>

        <slot name="below-list"></slot>

    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import ManifestV2 from '../../model/ManifestV2';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import R2Error from '../../model/errors/R2Error';
import Profile from '../../model/Profile';
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

        async created() {
            this.contextProfile = Profile.getActiveProfile();
        }
    }

</script>
