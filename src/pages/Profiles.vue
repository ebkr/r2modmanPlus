<template>
  <div>
    <CreateProfileModal />
    <DeleteProfileModal />
    <RenameProfileModal />
    <ImportProfileModal />
    <!-- Content -->
    <hero
      title="Profile selection"
      subtitle="Profiles help to organise mods easily"
      heroType="is-info"
    />
    <div class="columns">
      <div class="column is-full">
        <div>
          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class='notification'>
                    <div class="container">
                        <i class='fas fa-long-arrow-alt-left margin-right' />
                        <strong><a @click="backToGameSelection">Back to game selection</a></strong>
                    </div>
                </div>
                <div v-for="(profileName) of profileList" :key="profileName">
                  <a @click="setSelectedProfile(profileName)">
                    <div class="container">
                      <div class="border-at-bottom">
                        <div class="card is-shadowless">
                          <p
                            :class="['card-header-title', {'has-text-info':activeProfileName === profileName}]"
                          >{{profileName}}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
                <div class="container">
                  <nav class="level">
                    <div class="level-item">
                      <a id="select-profile" class="button is-info" @click="moveToNextScreen()">Select profile</a>
                    </div>
                      <div class="level-item">
                          <a id="rename-profile-disabled" class="button" v-if="activeProfileName === 'Default'" :disabled="true">Rename</a>
                          <a id="rename-profile" class="button" @click="openRenameProfileModal()" v-else>Rename</a>
                      </div>
                    <div class="level-item">
                      <a id="create-profile" class="button" @click="openCreateProfileModal()">Create new</a>
                    </div>
                    <div class="level-item">
                      <a class="button" @click="openImportProfileModal()">Import / Update</a>
                    </div>
                    <div class="level-item">
                        <a class="button is-danger" @click="openDeleteProfileModal()">Delete</a>
                    </div>
                  </nav>
                </div>
                </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Component from 'vue-class-component';
import { Hero, Progress } from '../components/all';

import R2Error from '../model/errors/R2Error';
import ManagerSettings from '../r2mm/manager/ManagerSettings';

import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import DeleteProfileModal from "../components/profiles-modals/DeleteProfileModal.vue";
import RenameProfileModal from "../components/profiles-modals/RenameProfileModal.vue";
import CreateProfileModal from "../components/profiles-modals/CreateProfileModal.vue";
import ImportProfileModal from "../components/profiles-modals/ImportProfileModal.vue";
import ProfilesMixin from "../components/mixins/ProfilesMixin.vue";


@Component({
    components: {
        ImportProfileModal,
        CreateProfileModal,
        hero: Hero,
        'progress-bar': Progress,
        DeleteProfileModal,
        RenameProfileModal,
    },
})
export default class Profiles extends ProfilesMixin {

    openCreateProfileModal() {
        this.$store.commit('openCreateProfileModal');
    }

    openDeleteProfileModal() {
        this.$store.commit('openDeleteProfileModal');
    }

    openRenameProfileModal() {
        this.$store.commit('openRenameProfileModal');
    }

    openImportProfileModal() {
        this.$store.commit('openImportProfileModal');
    }

    async moveToNextScreen() {
        await this.$router.push({name: 'manager.installed'});
    }

    async created() {
        const settings = await this.$store.getters.settings;
        await settings.load();

        const lastProfileName = await this.$store.dispatch('profile/loadLastSelectedProfile');

        // If the view was entered via game selection, the mod list was updated
        // and the cache cleared. The profile is already set in the Vuex store
        // but we want to trigger the cache prewarming. Always doing this for
        // empty profiles is deemed a fair tradeoff. On the other hand there's
        // no point to trigger this when returning from the manager view and the
        // mods are already cached.
        if (this.$store.state.tsMods.cache.size === 0) {
            await this.setSelectedProfile(lastProfileName);
        }

        // Set default paths
        if (settings.getContext().gameSpecific.gameDirectory === null) {
            const result = await GameDirectoryResolverProvider.instance.getDirectory(this.$store.state.activeGame);
            if (!(result instanceof R2Error)) {
                await settings.setGameDirectory(result);
            }
        }

        if (settings.getContext().global.steamDirectory === null) {
            const result = await GameDirectoryResolverProvider.instance.getSteamDirectory();
            if (!(result instanceof R2Error)) {
                await settings.setSteamDirectory(result);
            }
        }

        await this.updateProfileList();
    }

    async setSelectedProfile(profileName: string, prewarmCache = true) {
        try {
            await this.$store.dispatch('profiles/setSelectedProfile', { profileName: profileName, prewarmCache: prewarmCache });
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error while selecting profile');
            this.$store.commit('error/handleError', err);
        }
    }

    async updateProfileList() {
        try {
            await this.$store.dispatch('profiles/updateProfileList');
        } catch (e) {
            const err = R2Error.fromThrownValue(e, 'Error whilst updating ProfileList');
            this.$store.commit('error/handleError', err);
        }
    }

    private async backToGameSelection() {
        await ManagerSettings.resetDefaults();
        await this.$router.push({name: "index"});
    }
}
</script>
