<template>
    <div class="pane">
        <div class="search-and-sort">
            <SearchAndSort />
        </div>
        <DisableModModal />
        <UninstallModModal />
        <AssociatedModsModal />

        <slot name="above-list"></slot>

        <div class="mod-list-content">
            <div class="draggable-content">
                <draggable v-model='draggableList' group="local-mods" handle=".handle"
                           @start="drag=$store.getters['profile/canSortMods']"
                           @end="drag=false"
                           :force-fallback="true"
                           :scroll-sensitivity="100">
                    <local-mod-card
                        v-for='(mod, index) in draggableList'
                        :key="`local-${profile.getProfileName()}-${mod.getName()}-${index}`"
                        :mod="mod" />
                </draggable>
            </div>
        </div>

        <slot name="below-list"></slot>
    </div>
</template>

<script lang="ts">

import Draggable from 'vuedraggable';
import { Component, Vue } from 'vue-property-decorator';
import ManifestV2 from '../../model/ManifestV2';
import R2Error from '../../model/errors/R2Error';
import { ImmutableProfile } from '../../model/Profile';
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
        get profile(): ImmutableProfile {
            return this.$store.getters['profile/activeProfile'].asImmutableProfile();
        }

        get draggableList(): ManifestV2[] {
            return this.$store.getters['profile/visibleModList'];
        }

        set draggableList(newList: ManifestV2[]) {
            try {
                this.$store.dispatch(
                    'profile/saveModListToDisk',
                    {mods: newList, profile: this.profile}
                );
            } catch (e) {
                this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
            }
        }
    }
</script>

<style lang="scss" scoped>
.pane {
    display: flex;
    flex-direction: column;
    width: 100%;

    .mod-list-content {
        flex: 1;
        overflow-y: auto;
        padding-right: 1rem;
    }
}
</style>
