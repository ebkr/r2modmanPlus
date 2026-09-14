<script lang="ts" setup>
import { computed, ref } from 'vue';
import VersionNumber from '../../model/VersionNumber';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import appWindow from '../../providers/node/app/app_window';
import { Hero, DeferredInput } from '../all';
import SettingsSection from './SettingsSection.vue';
import GameDirectory from './entries/GameDirectory.vue';
import DataDirectory from './entries/DataDirectory.vue';
import SteamDirectory from './entries/SteamDirectory.vue';
import ExportProfile from './entries/ExportProfile.vue';
import Theme from './entries/Theme.vue';
import ExpandCards from './entries/ExpandCards.vue';
import FunkyMode from './entries/FunkyMode.vue';
import OnlineModList from './entries/OnlineModList.vue';
import ModState from './entries/ModState.vue';
import UpdateAllMods from './entries/UpdateAllMods.vue';
import ModCache from './entries/ModCache.vue';
import CopyLogToClipboard from './entries/CopyLogToClipboard.vue';
import CopyTroubleshooting from './entries/CopyTroubleshooting.vue';
import ImportLocalMod from './entries/ImportLocalMod.vue';
import ToggleCdn from './entries/ToggleCdn.vue';
import LaunchArguments from './entries/LaunchArguments.vue';
import ShowDependencyStrings from './entries/ShowDependencyStrings.vue';
import ResetGameInstallation from './entries/ResetGameInstallation.vue';
import ChangeLaunchBehaviour from './entries/ChangeLaunchBehaviour.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const searchTerm = ref<string>('');

const managerVersionNumber = ref<VersionNumber>(ManagerInformation.VERSION);
const appName = computed(() => ManagerInformation.APP_NAME);

const store = getStore<State>();
const isSteamGame = computed<boolean>(() => store.state.activeGame.isInstalledViaSteam);
const isSteamAndNotWindows = computed<boolean>(() => ['linux', 'darwin'].includes(appWindow.getPlatform()) && isSteamGame.value);

const categories = ['All', 'Directories', 'Profile', 'Appearance', 'Debugging', 'Modpacks', 'Other'] as const;
type Category = typeof categories[number];

const activeCategory = ref<Category>('All');

function isVisible(section: Category): boolean {
    return activeCategory.value === 'All' || activeCategory.value === section;
}
</script>

<template>
    <div id="settings-view">
        <Hero
            :title="t('translations.pages.settings.hero.title')"
            :subtitle="t('translations.pages.settings.hero.subtitle', { appName, version: managerVersionNumber.toString() })"
            heroType="primary"
        />
        <div class="settings-shell">
            <aside class="menu settings-nav">
                <p class="menu-label">{{ t('translations.pages.settings.nav.label') }}</p>
                <ul class="menu-list">
                    <li v-for="category in categories" :key="category">
                        <a
                            :class="{ 'is-active': activeCategory === category }"
                            @click="activeCategory = category"
                        >
                            {{ t(`translations.pages.settings.nav.categories.${category.toLowerCase()}`) }}
                        </a>
                    </li>
                </ul>
            </aside>

            <div class="settings-list">

                <div class="inherit-background-colour sticky-top sticky-top--search non-selectable border-at-bottom">
                    <div class="is-shadowless is-square">
                        <div class="no-padding-left card-header-title">
                            <div class="input-group input-group--flex margin-right">
                                <label for="installed-search" class="non-selectable">{{ t('translations.pages.settings.search.label') }}</label>
                                <DeferredInput
                                    :modelValue="searchTerm"
                                    @update:modelValue="$event => (searchTerm = $event)"
                                    id="installed-search"
                                    class="input margin-right"
                                    type="text"
                                    :placeholder="t('translations.pages.settings.search.placeholder')"
                                    autocomplete="off"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <SettingsSection v-if="isVisible('Directories')" :name="t('translations.pages.settings.nav.categories.directories')">
                    <DataDirectory :search-term="searchTerm"/>
                        <GameDirectory :search-term="searchTerm"/>
                    <template v-if="isSteamGame">
                        <SteamDirectory :search-term="searchTerm"/>
                    </template>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Profile')" :name="t('translations.pages.settings.nav.categories.profile')">
                    <ExportProfile :search-term="searchTerm"/>
                    <ModState :search-term="searchTerm"/>
                    <UpdateAllMods :search-term="searchTerm"/>
                    <ImportLocalMod :search-term="searchTerm"/>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Appearance')" :name="t('translations.pages.settings.nav.categories.appearance')">
                    <Theme :search-term="searchTerm"/>
                    <ExpandCards :search-term="searchTerm"/>
                    <FunkyMode :search-term="searchTerm"/>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Debugging')" :name="t('translations.pages.settings.nav.categories.debugging')">
                    <LaunchArguments :search-term="searchTerm"/>
                    <template v-if="isSteamGame">
                        <ResetGameInstallation :search-term="searchTerm"/>
                    </template>
                    <template v-if="isSteamAndNotWindows">
                        <ChangeLaunchBehaviour :search-term="searchTerm"/>
                    </template>
                    <CopyLogToClipboard :search-term="searchTerm"/>
                    <CopyTroubleshooting :search-term="searchTerm"/>
                    <ModCache :search-term="searchTerm"/>
                    <ToggleCdn :search-term="searchTerm"/>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Modpacks')" :name="t('translations.pages.settings.nav.categories.modpacks')">
                    <ShowDependencyStrings :search-term="searchTerm"/>
                </SettingsSection>

                <SettingsSection v-if="isVisible('Other')" :name="t('translations.pages.settings.nav.categories.other')">
                    <OnlineModList :search-term="searchTerm"/>
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
