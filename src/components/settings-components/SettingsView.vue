<script lang="ts" setup>
import SettingsItem from './SettingsItem.vue';
import SettingsRow from '../../model/settings/SettingsRow';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../../r2mm/manager/PathResolver';
import LogOutputProvider from '../../providers/ror2/data/LogOutputProvider';
import VersionNumber from '../../model/VersionNumber';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import { Hero } from '../all';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import { Platform } from '../../model/schema/ThunderstoreSchema';
import moment from 'moment';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import { computed, onMounted, ref, watch } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import {useRouter} from 'vue-router';
import {getLaunchType, LaunchType} from "../../model/real_enums/launch/LaunchType";
import {LaunchTypeModalOpen} from "../../components/modals/launch-type/LaunchTypeRefs";
import {useI18n} from "vue-i18n";

const store = getStore<State>();
let router = useRouter();
const { t } = useI18n();

const activeTab = ref<string>('All');
const tabs = ref<string[]>(['All', 'Profile', 'Locations', 'Debugging', 'Modpacks', 'Other']);
const logOutput = ref<LogOutputProvider>(LogOutputProvider.instance);
const search = ref<string>('');
const managerVersionNumber = ref<VersionNumber>(ManagerInformation.VERSION);
const searchableSettings = ref<SettingsRow[]>([]);

const activeGame = computed(() => store.state.activeGame);
const settings = computed(() => store.getters['settings']);
const localModList = computed(() => store.state.profile.modList);
const appName = computed(() => ManagerInformation.APP_NAME);

let settingsList = [
    new SettingsRow(
        'locations',
        t('translations.pages.settings.locations.browseDataFolder.title'),
        t('translations.pages.settings.locations.browseDataFolder.description'),
        async () => PathResolver.ROOT,
        'fa-door-open',
        () => {
            emitInvoke('BrowseDataFolder');
        }
    ),
    new SettingsRow(
        'locations',
        t('translations.pages.settings.locations.changeGameFolder.title', { gameName: activeGame.value.displayName }),
        t('translations.pages.settings.locations.changeGameFolder.description', { gameName: activeGame.value.displayName, appName: appName.value }),
        async () => {
            if (settings.value.getContext().gameSpecific.gameDirectory !== null) {
                const directory = await GameDirectoryResolverProvider.instance.getDirectory(activeGame.value);
                if (!(directory instanceof R2Error)) {
                    return directory;
                }
            }
            return t('translations.pages.settings.locations.changeGameFolder.setManually');
        },
        'fa-folder-open',
        () => {
            if (Platform.XBOX_GAME_PASS == activeGame.value.activePlatform.storePlatform) {
                emitInvoke('ChangeGameDirectoryGamePass');
            }
            else {
                emitInvoke('ChangeGameDirectory');
            }
        }
    ),
    new SettingsRow(
        'locations',
        t('translations.pages.settings.locations.browseProfileFolder.title'),
        t('translations.pages.settings.locations.browseProfileFolder.description'),
        async () => {
            return store.getters['profile/activeProfile'].getProfilePath();
        },
        'fa-door-open',
        () => emitInvoke('BrowseProfileFolder')
    ),
    new SettingsRow(
        'locations',
        t('translations.pages.settings.locations.changeDataFolder.title'),
        t('translations.pages.settings.locations.changeDataFolder.description'),
        async () => {
            return PathResolver.ROOT;
        },
        'fa-folder-open',
        () => emitInvoke('ChangeDataFolder')
    ),
    new SettingsRow(
        'debugging',
        t('translations.pages.settings.debugging.copyLogFile.title'),
        t('translations.pages.settings.debugging.copyLogFile.description'),
        async () =>  t(`translations.pages.settings.debugging.copyLogFile.${logOutput.value.exists ? 'logFileExists' : 'logFileDoesNotExist'}`),
        'fa-clipboard',
        () => {
            if (logOutput.value.exists) {
                emitInvoke('CopyLogToClipboard')
            }
        }
    ),
    new SettingsRow(
        'debugging',
        t('translations.pages.settings.debugging.copyTroubleshootingInfo.title'),
        t('translations.pages.settings.debugging.copyTroubleshootingInfo.description'),
        async () => t('translations.pages.settings.debugging.copyTroubleshootingInfo.value'),
        'fa-clipboard',
        () => emitInvoke('CopyTroubleshootingInfoToClipboard')
    ),
    new SettingsRow(
        'debugging',
        t('translations.pages.settings.debugging.toggleDownloadCache.title'),
        t('translations.pages.settings.debugging.toggleDownloadCache.description'),
        async () => {
            return store.state.download.ignoreCache
                ? t('translations.pages.settings.debugging.toggleDownloadCache.enabled')
                : t('translations.pages.settings.debugging.toggleDownloadCache.disabled');
        },
        'fa-exchange-alt',
        () => emitInvoke('ToggleDownloadCache')
    ),
    new SettingsRow(
        'debugging',
        t('translations.pages.settings.debugging.setLaunchArguments.title'),
        t('translations.pages.settings.debugging.setLaunchArguments.description'),
        async () => t('translations.pages.settings.debugging.setLaunchArguments.value'),
        'fa-wrench',
        () => emitInvoke('SetLaunchParameters')
    ),
    new SettingsRow(
        'debugging',
        t('translations.pages.settings.debugging.cleanModCache.title'),
        t('translations.pages.settings.debugging.cleanModCache.description'),
        async () => t('translations.pages.settings.debugging.cleanModCache.value'),
        'fa-trash',
        () => emitInvoke('CleanCache')
    ),
    new SettingsRow(
        'debugging',
        t('translations.pages.settings.debugging.cleanOnlineModList.title'),
        t('translations.pages.settings.debugging.cleanOnlineModList.description'),
        async () => store.dispatch('tsMods/getActiveGameCacheStatus').then(status => t(`translations.pages.settings.debugging.cleanOnlineModList.states.${status}`, { gameName: activeGame.value.displayName})),
        'fa-trash',
        () => store.dispatch('tsMods/resetActiveGameCache')
    ),
    new SettingsRow(
        'debugging',
        t('translations.pages.settings.debugging.toggleThunderstoreCdn.title'),
        t('translations.pages.settings.debugging.toggleThunderstoreCdn.description'),
        async () => t('translations.pages.settings.debugging.toggleThunderstoreCdn.current', { label: CdnProvider.current.label, url: CdnProvider.current.url }),
        'fa-exchange-alt',
        CdnProvider.togglePreferredCdn
    ),
    new SettingsRow(
        'profile',
        t('translations.pages.settings.profile.changeProfile.title'),
        t('translations.pages.settings.profile.changeProfile.description'),
        async () => t('translations.pages.settings.profile.changeProfile.value', { profileName: store.getters['profile/activeProfile'].getProfileName() }),
        'fa-file-import',
        () => emitInvoke('ChangeProfile')
    ),
    new SettingsRow(
        'profile',
        t('translations.pages.settings.profile.enableAllMods.title'),
        t('translations.pages.settings.profile.enableAllMods.description'),
        async () => t(
            'translations.pages.settings.profile.enableAllMods.value',
            localModList.value.length - ProfileModList.getDisabledModCount(localModList.value),
            {
                named: {
                    enabledModCount: localModList.value.length - ProfileModList.getDisabledModCount(localModList.value),
                    totalModCount: localModList.value.length
                }
            }
        ),
        'fa-file-import',
        () => emitInvoke('EnableAll')
    ),
    new SettingsRow(
        'profile',
        t('translations.pages.settings.profile.disableAllMods.title'),
        t('translations.pages.settings.profile.disableAllMods.description'),
        async () => t(
            'translations.pages.settings.profile.disableAllMods.value',
            ProfileModList.getDisabledModCount(localModList.value),
            {
                named: {
                    disabledModCount: ProfileModList.getDisabledModCount(localModList.value),
                    totalModCount: localModList.value.length
                }
            }
        ),
        'fa-file-import',
        () => emitInvoke('DisableAll')
    ),
    new SettingsRow(
        'profile',
        t('translations.pages.settings.profile.importLocalMod.title'),
        t('translations.pages.settings.profile.importLocalMod.description'),
        async () => t('translations.pages.settings.profile.importLocalMod.value'),
        'fa-file-import',
        () => store.commit("openLocalFileImportModal")
    ),
    new SettingsRow(
        'profile',
        t('translations.pages.settings.profile.exportProfileAsFile.title'),
        t('translations.pages.settings.profile.exportProfileAsFile.description'),
        async () => t('translations.pages.settings.profile.exportProfileAsFile.value'),
        'fa-file-export',
        () => store.dispatch("profileExport/exportProfileAsFile")
    ),
    new SettingsRow(
        'profile',
        t('translations.pages.settings.profile.exportProfileAsCode.title'),
        t('translations.pages.settings.profile.exportProfileAsCode.description'),
        async () => t('translations.pages.settings.profile.exportProfileAsCode.value'),
        'fa-file-export',
        () => store.dispatch("profileExport/exportProfileAsCode")
    ),
    new SettingsRow(
        'profile',
        t('translations.pages.settings.profile.updateAllMods.title'),
        t('translations.pages.settings.profile.updateAllMods.description'),
        async () => t('translations.pages.settings.profile.updateAllMods.value', store.getters['profile/modsWithUpdates'].length),
        'fa-cloud-upload-alt',
        () => emitInvoke('UpdateAllMods')
    ),
    new SettingsRow(
        'Other',
        'Toggle funky mode',
        'Enable/disable funky mode.',
        async () => {
            return settings.value.getContext().global.funkyModeEnabled
                ? 'Current: enabled'
                : 'Current: disabled (default)';
        },
        'fa-exchange-alt',
        () => emitInvoke('ToggleFunkyMode')
    ),
    new SettingsRow(
        'Other',
        'Switch theme',
        'Switch between light and dark themes.',
        async () => {
            return settings.value.getContext().global.darkTheme
                ? 'Current: dark theme'
                : 'Current: light theme (default)';
        },
        'fa-exchange-alt',
        () => emitInvoke('SwitchTheme')
    ),
    new SettingsRow(
        'Other',
        'Switch card display type',
        'Switch between expanded or collapsed cards.',
        async () => {
            return settings.value.getContext().global.expandedCards
                ? 'Current: expanded'
                : 'Current: collapsed (default)';
        },
        'fa-exchange-alt',
        () => emitInvoke('SwitchCard')
    ),
    new SettingsRow(
        'Other',
        'Refresh online mod list',
        'Check for any new mod releases.',
        async () => {
                if (store.state.tsMods.isThunderstoreModListUpdateInProgress) {
                    return store.state.tsMods.thunderstoreModListUpdateStatus || "Refreshing...";
                }
                if (store.state.tsMods.thunderstoreModListUpdateError) {
                    return `Error refreshing the mod list: ${store.state.tsMods.thunderstoreModListUpdateError.message}`;
                }
                if (store.getters['download/activeDownloadCount'] > 0) {
                    return "Refreshing the mod list is disabled while there are active downloads.";
                }
                if (store.state.tsMods.modsLastUpdated !== undefined) {
                    return "Cache date: " + moment(store.state.tsMods.modsLastUpdated).format("MMMM Do YYYY, h:mm:ss a");
                }
                return "No API information available";
            },
        'fa-exchange-alt',
        async () => await store.dispatch("tsMods/syncPackageList")
    ),
    new SettingsRow(
      'Other',
      'Change game',
      'Change the current game',
      async () => "",
        'fa-gamepad',
        async () => {
            await ManagerSettings.resetDefaults();
            await router.push({name: 'index'});
        }
    ),
    new SettingsRow(
        'Modpacks',
        'Show dependency strings',
        'View a list of installed mods with their version strings. Used inside the dependencies array inside the manifest.json file.',
        async () => `Show dependency strings for ${localModList.value.length} mod(s)`,
        'fa-file-alt',
        () => emitInvoke('ShowDependencyStrings')
    ),
];

watch(search, () => {
    searchableSettings.value = settingsList
        .filter(value =>
            value.action.toLowerCase().indexOf(search.value.toLowerCase()) >= 0
            || value.description.toLowerCase().indexOf(search.value.toLowerCase()) >= 0);
});

function getFilteredSettings() {
    return searchableSettings.value.filter(value => value.group.toLowerCase() === activeTab.value.toLowerCase())
        .sort((a, b) => a.action.localeCompare(b.action));
}

onMounted(async () => {
    if ([Platform.STEAM, Platform.STEAM_DIRECT].includes(activeGame.value.activePlatform.storePlatform)) {
        settingsList.push(
            new SettingsRow(
                'locations',
                t('translations.pages.settings.locations.changeSteamFolder.title'),
                t('translations.pages.settings.locations.changeSteamFolder.description', { appName: appName.value }),
                async () => {
                    if (settings.value.getContext().global.steamDirectory !== null) {
                        const directory = await GameDirectoryResolverProvider.instance.getSteamDirectory();
                        if (!(directory instanceof R2Error)) {
                            return directory;
                        }
                    }
                    return t('translations.pages.settings.locations.changeSteamFolder.state.setManually');
                },
                'fa-folder-open',
                () => emitInvoke('ChangeSteamDirectory')
            ),
            new SettingsRow(
                'debugging',
                t('translations.pages.settings.debugging.resetGameInstallation.title', { gameName: activeGame.value.displayName }),
                t('translations.pages.settings.debugging.resetGameInstallation.description'),
                async () => t('translations.pages.settings.debugging.resetGameInstallation.value', { folderName: activeGame.value.steamFolderName }),
                'fa-wrench',
                () => emitInvoke('ValidateSteamInstallation')
            )
        )
    }

    if (['linux', 'darwin'].includes(process.platform) && activeGame.value.activePlatform.storePlatform === Platform.STEAM) {
        settingsList.push(
            new SettingsRow(
                'debugging',
                t('translations.pages.settings.debugging.changeLaunchBehaviour.title'),
                t('translations.pages.settings.debugging.changeLaunchBehaviour.description'),
                async () => t('translations.pages.settings.debugging.changeLaunchBehaviour.value', { launchType: await getLaunchType(activeGame.value) }),
                'fa-gamepad',
                () => {
                    LaunchTypeModalOpen.value = true;
                }
            )
        );
    }
    settingsList = settingsList.sort((a, b) => a.action.localeCompare(b.action));
    searchableSettings.value = settingsList;

    const gameDirectory = await GameDirectoryResolverProvider.instance.getDirectory(activeGame.value);
    if (!(gameDirectory instanceof R2Error)) {
        await settings.value.setGameDirectory(gameDirectory);
    }

    const steamDirectory = await GameDirectoryResolverProvider.instance.getSteamDirectory();
    if (!(steamDirectory instanceof R2Error)) {
        await settings.value.setSteamDirectory(steamDirectory);
    }
});

function changeTab(tab: string) {
    activeTab.value = tab;
}

const emits = defineEmits<{
    (e: 'setting-invoked', setting: string): void;
}>();

function emitInvoke(invoked: string) {
    emits('setting-invoked', invoked);
}

</script>

<template>
    <div id="settings-view">
        <Hero title='Settings'
              :subtitle='`Advanced options for ${appName}: ` + managerVersionNumber.toString()'
              heroType='primary'/>
        <div class="margin-right">
            <div class="sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding">
                <div class='border-at-bottom'>
                    <div class='card is-shadowless is-square'>
                        <div class='card-header-title'>
                            <span class="non-selectable margin-right">Search:</span>
                            <input v-model='search' class="input" type="text" placeholder="Search for a setting"/>
                        </div>
                    </div>
                </div>
                <div class="tabs">
                    <ul>
                        <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                            :class="[{'is-active': activeTab === key}]"
                            @click="changeTab(key)">
                            <a>{{key}}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <template v-if="activeTab === 'All'">
                <SettingsItem v-for="(key, _) in searchableSettings" :key="`setting-${key.action}`"
                              :action="key.action"
                              :description="key.description"
                              :value="key.value"
                              :icon="key.icon"
                              @click="key.clickAction()"/>
            </template>
            <template v-else>
                <SettingsItem v-for="(key, _) in getFilteredSettings()" :key="`setting-${key.action}`"
                              :action="key.action"
                              :description="key.description"
                              :value="key.value"
                              :icon="key.icon"
                              @click="key.clickAction()"/>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#settings-view {
    width: 100%;
}
</style>
