<template>
    <div class="installed-view">
        <div v-if="localModList.length === 0" class="relative-position full-height--minus-em" id="no-mods-installed-info">
            <div class="absolute-center text-center top">
                <div class="margin-right">
                    <div>
                        <i class="fas fa-exclamation fa-5x"></i>
                    </div>
                    <br/>
                    <h3 class="title is-4">Looks like you don't have any mods installed</h3>
                    <h4 class="subtitle is-5">
                        Click the Online tab on the left, or click
                        <a @click="$router.push({name: 'manager.online'})">here</a>.
                    </h4>
                </div>
            </div>
        </div>
        <template v-else-if="localModList.length > 0">
            <LocalModList>
                <template v-slot:above-list v-if="numberOfModsWithUpdates > 0 && !dismissedUpdateAll">
                    <div class="margin-bottom">
                        <div class="notification is-warning margin-right">
                            <span>
                                You have {{ numberOfModsWithUpdates }} available mod update{{ numberOfModsWithUpdates > 1 ? "s" : ""}}.
                                Would you like to <a @click="$store.commit('openUpdateAllModsModal')">update all</a>?
                            </span>
                            <a class="float-right cursor-pointer" @click="$store.commit('profile/dismissUpdateAll')">
                                <i class="fas fa-times" />
                            </a>
                        </div>
                    </div>
                </template>
            </LocalModList>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import ManifestV2 from "../../model/ManifestV2";
import LocalModListProvider from "../../providers/components/loaders/LocalModListProvider";

@Component({
    components: {
        LocalModList: LocalModListProvider.provider,
    }
})

export default class InstalledModView extends Vue {
    get dismissedUpdateAll() {
        return this.$store.state.profile.dismissedUpdateAll;
    }

    get localModList(): ManifestV2[] {
        return this.$store.state.profile.modList;
    }

    get numberOfModsWithUpdates(): number {
        return this.$store.getters['profile/modsWithUpdates'].length;
    }
};
</script>

<style lang="scss" scoped>
.installed-view {
    display: flex;
    flex: 1;
    width: 100%;
}

#no-mods-installed-info {
    width: 100%;
}
</style>
