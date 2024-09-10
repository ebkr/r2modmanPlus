<template>
    <div>
        <div v-if="localModList.length === 0" class="relative-position full-height--minus-em">
            <div class="absolute-center text-center top">
                <div class="margin-right">
                    <div>
                        <i class="fas fa-exclamation fa-5x"></i>
                    </div>
                    <br/>
                    <h3 class="title is-4">{{ $t('views.installed.noInstall') }}</h3>
                    <h4 class="subtitle is-5">
                        {{ $t('views.installed.click') }}
                        <a @click="$router.push({name: 'manager.online'})">{{ $t('views.installed.here') }}</a>.
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
                                {{ $t('views.installed.available', {number:numberOfModsWithUpdates, s: numberOfModsWithUpdates > 1 ? "s" : ""}) }}
                                <a @click="$store.commit('openUpdateAllModsModal')">{{ $t('views.installed.updateAll') }}</a>?
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
