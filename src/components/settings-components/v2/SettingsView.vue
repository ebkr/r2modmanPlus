<script lang="ts" setup>
import { computed, ref } from 'vue';
import VersionNumber from '../../../model/VersionNumber';
import ManagerInformation from '../../../_managerinf/ManagerInformation';
import { Hero } from '../../all';
import SettingsSection from './SettingsSection.vue';
import GameDirectory from './entries/GameDirectory.vue';
import DataDirectory from './entries/DataDirectory.vue';
import ExportProfile from './entries/ExportProfile.vue';
import Theme from './entries/Theme.vue';
import ExpandCards from './entries/ExpandCards.vue';
import FunkyMode from './entries/FunkyMode.vue';
import RefreshOnlineModList from './entries/RefreshOnlineModList.vue';
import ModState from './entries/ModState.vue';

const searchTerm = ref<string>('');

const managerVersionNumber = ref<VersionNumber>(ManagerInformation.VERSION);
const appName = computed(() => ManagerInformation.APP_NAME);

const categories = ['All', 'Directories', 'Profile', 'Appearance', 'Other'] as const;
type Category = typeof categories[number];

const activeCategory = ref<Category>('All');

function isVisible(section: Category): boolean {
    return activeCategory.value === 'All' || activeCategory.value === section;
}
</script>

<template>
    <div id="settings-view">
        <Hero
            title="Settings"
            :subtitle="`Advanced options for ${appName}: ${managerVersionNumber.toString()}`"
            heroType="primary"
        />
        <div class="settings-shell">
            <aside class="menu settings-nav">
                <p class="menu-label">Sections</p>
                <ul class="menu-list">
                    <li v-for="category in categories" :key="category">
                        <a
                            :class="{ 'is-active': activeCategory === category }"
                            @click="activeCategory = category"
                        >
                            {{ category }}
                        </a>
                    </li>
                </ul>
            </aside>

            <div class="settings-list">

                <div class="sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding">
                    <div class='border-at-bottom'>
                        <div class='card is-shadowless is-square'>
                            <div class='card-header-title'>
                                <span class="non-selectable margin-right">Search:</span>
                                <input v-model='searchTerm' class="input" type="text" placeholder="Search for a setting"/>
                            </div>
                        </div>
                    </div>
                </div>

                <SettingsSection v-if="isVisible('Directories')" name="Directories">
                    <DataDirectory :search-term="searchTerm"/>
                        <GameDirectory :search-term="searchTerm"/>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Profile')" name="Profile">
                    <ExportProfile :search-term="searchTerm"/>
                    <ModState :search-term="searchTerm"/>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Appearance')" name="Appearance">
                    <Theme :search-term="searchTerm"/>
                    <ExpandCards :search-term="searchTerm"/>
                    <FunkyMode :search-term="searchTerm"/>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Other')" name="Other">
                    <RefreshOnlineModList :search-term="searchTerm"/>
                </SettingsSection>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#settings-view {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.settings-shell {
    display: flex;
    align-items: flex-start;
    flex: 1 0 auto;
}

.settings-nav {
    flex: 0 0 200px;
    padding: 1.25rem 1rem;
    position: sticky;
    top: 0;
    align-self: flex-start;
    max-height: 100vh;
    overflow-y: auto;
}

.settings-list {
    flex: 1;
    min-width: 0;
    padding: 1rem 1.25rem 1rem;
}
</style>
