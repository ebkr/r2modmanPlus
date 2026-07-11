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

const managerVersionNumber = ref<VersionNumber>(ManagerInformation.VERSION);
const appName = computed(() => ManagerInformation.APP_NAME);

const categories = ['All', 'Directories', 'Profile', 'Debugging', 'Modpacks', 'Other'] as const;
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
                <SettingsSection v-if="isVisible('Directories')" name="Directories">
                    <GameDirectory />
                    <DataDirectory />
                </SettingsSection>

                <SettingsSection v-if="isVisible('Profile')" name="Profile">
                    <ExportProfile />
                </SettingsSection>

                <SettingsSection v-if="isVisible('Other')" name="Other">
                    <Theme />
                    <ExpandCards />
                    <FunkyMode />
                    <RefreshOnlineModList />
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
