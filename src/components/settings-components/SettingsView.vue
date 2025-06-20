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
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import VueRouter from 'vue-router';

const store = getStore<State>();
let router!: VueRouter;

onMounted(() => {
    router = getCurrentInstance()!.proxy.$router;
})

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
        'Locations',
        'Browse data folder',
        'Open the folder where mods are stored for all games and profiles.',
        async () => PathResolver.ROOT,
        'fa-door-open',
        () => {
            emitInvoke('BrowseDataFolder');
        }
    ),
    new SettingsRow(
        'Locations',
        `Change ${activeGame.value.displayName} folder`,
        `Change the location of the ${activeGame.value.displayName} folder that ${appName.value} uses.`,
        async () => {
            if (settings.value.getContext().gameSpecific.gameDirectory !== null) {
                const directory = await GameDirectoryResolverProvider.instance.getDirectory(activeGame.value);
                if (!(directory instanceof R2Error)) {
                    return directory;
                }
            }
            return 'Please set manually';
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
        'Locations',
        'Browse profile folder',
        'Open the folder where mods are stored for the current profile.',
        async () => {
            return store.getters['profile/activeProfile'].getProfilePath();
        },
        'fa-door-open',
        () => emitInvoke('BrowseProfileFolder')
    ),
    new SettingsRow(
        'Locations',
        'Change data folder',
        'Change the folder where mods are stored for all games and profiles. The folder will not be deleted, and existing profiles will not carry across.',
        async () => {
            return PathResolver.ROOT;
        },
        'fa-folder-open',
        () => emitInvoke('ChangeDataFolder')
    ),
    new SettingsRow(
        'Debugging',
        'Copy log file contents to clipboard',
        'Copy the text inside the LogOutput.log file to the clipboard, with Discord formatting.',
        async () => doesLogFileExist(),
        'fa-clipboard',
        () => emitInvoke('CopyLogToClipboard')
    ),
    new SettingsRow(
        'Debugging',
        'Copy troubleshooting information to clipboard',
        'Copy settings and other information to the clipboard, with Discord formatting.',
        async () => 'Share this information when requesting support on Discord.',
        'fa-clipboard',
        () => emitInvoke('CopyTroubleshootingInfoToClipboard')
    ),
    new SettingsRow(
        'Debugging',
        'Toggle download cache',
        'Downloading a mod will ignore mods stored in the cache. Mods will still be placed in the cache.',
        async () => {
            return store.state.download.ignoreCache
                ? 'Current: cache is disabled'
                : 'Current: cache is enabled (recommended)';
        },
        'fa-exchange-alt',
        () => emitInvoke('ToggleDownloadCache')
    ),
    new SettingsRow(
        'Debugging',
        'Set launch parameters',
        'Provide custom arguments used to start the game.',
        async () => 'These commands are used against the Steam executable on game startup',
        'fa-wrench',
        () => emitInvoke('SetLaunchParameters')
    ),
    new SettingsRow(
        'Debugging',
        'Clean mod cache',
        'Free extra space caused by cached mods that are not currently in a profile.',
        async () => 'Check all profiles for unused mods and clear cache',
        'fa-trash',
        () => emitInvoke('CleanCache')
    ),
    new SettingsRow(
        'Debugging',
        'Clean online mod list',
        'Deletes local copy of mod list, forcing the next refresh to fetch a new one.',
        async () => store.dispatch('tsMods/getActiveGameCacheStatus'),
        'fa-trash',
        () => store.dispatch('tsMods/resetActiveGameCache')
    ),
    new SettingsRow(
        'Debugging',
        'Toggle preferred Thunderstore CDN',
        'Switch the CDN until app is restarted. This might bypass issues with downloading mods.',
        async () => `Current: ${CdnProvider.current.label} (${CdnProvider.current.url})`,
        'fa-exchange-alt',
        CdnProvider.togglePreferredCdn
    ),
    new SettingsRow(
        'Profile',
        'Change profile',
        'Change the mod profile.',
        async () => {
            return `Current profile: ${store.getters['profile/activeProfile'].getProfileName()}`
        },
        'fa-file-import',
        () => emitInvoke('ChangeProfile')
    ),
    new SettingsRow(
        'Profile',
        'Enable all mods',
        'Enable all mods for the current profile',
        async () => `${localModList.value.length - ProfileModList.getDisabledModCount(localModList.value)}/${localModList.value.length} enabled`,
        'fa-file-import',
        () => emitInvoke('EnableAll')
    ),
    new SettingsRow(
        'Profile',
        'Disable all mods',
        'Disable all mods for the current profile',
        async () => `${ProfileModList.getDisabledModCount(localModList.value)}/${localModList.value.length} disabled`,
        'fa-file-import',
        () => emitInvoke('DisableAll')
    ),
    new SettingsRow(
        'Profile',
        'Import local mod',
        'Install a mod offline from your files.',
        async () => 'Not all mods can be installed locally',
        'fa-file-import',
        () => store.commit("openLocalFileImportModal")
    ),
    new SettingsRow(
        'Profile',
        'Export profile as a file',
        'Export your mod list and configs as a file.',
        async () => 'The exported file can be shared with friends to get an identical profile quickly and easily',
        'fa-file-export',
        () => store.dispatch("profileExport/exportProfileAsFile")
    ),
    new SettingsRow(
        'Profile',
        'Export profile as a code',
        'Export your mod list and configs as a code.',
        async () => 'The exported code can be shared with friends to get an identical profile quickly and easily',
        'fa-file-export',
        () => store.dispatch("profileExport/exportProfileAsCode")
    ),
    new SettingsRow(
        'Profile',
        'Update all mods',
        'Quickly update every installed mod to their latest versions.',
        async () => {
            const outdatedMods = store.getters['profile/modsWithUpdates'];
            if (outdatedMods.length === 1) {
                return "1 mod has an update available";
            }
            return `${outdatedMods.length} mods have an update available`;
        },
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
                'Locations',
                'Change Steam folder',
                `Change the location of the Steam folder that ${appName.value} uses.`,
                async () => {
                    if (settings.value.getContext().global.steamDirectory !== null) {
                        const directory = await GameDirectoryResolverProvider.instance.getSteamDirectory();
                        if (!(directory instanceof R2Error)) {
                            return directory;
                        }
                    }
                    return 'Please set manually';
                },
                'fa-folder-open',
                () => emitInvoke('ChangeSteamDirectory')
            ),
            new SettingsRow(
                'Debugging',
                `Reset ${activeGame.value.displayName} installation`,
                'Fix problems caused by corrupted files or files left over from manual modding attempts.',
                async () => `This will delete all contents of the ${activeGame.value.steamFolderName} folder, and verify the files through Steam`,
                'fa-wrench',
                () => emitInvoke('ValidateSteamInstallation')
            )
        )
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

function doesLogFileExist() {
    return logOutput.value.exists ? 'Log file exists' : 'Log file does not exist';
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
