<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
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
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import VueRouter from 'vue-router';
import {getLaunchType, LaunchType} from "../../model/real_enums/launch/LaunchType";
import {LaunchTypeModalOpen} from "../../components/modals/launch-type/LaunchTypeRefs";
import appWindow from '../../providers/node/app/app_window';

const { t } = useI18n();
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
        t('SettingsView.items.browse_data_folder.action'),
        t('SettingsView.items.browse_data_folder.description'),
        async () => PathResolver.ROOT,
        'fa-door-open',
        () => {
            emitInvoke('BrowseDataFolder');
        }
    ),
    new SettingsRow(
        'Locations',
        t('SettingsView.items.change_game_folder.action', {game: activeGame.value.displayName}),
        t('SettingsView.items.change_game_folder.description', {game: activeGame.value.displayName, app: appName.value}),
        async () => {
            if (settings.value.getContext().gameSpecific.gameDirectory !== null) {
                const directory = await GameDirectoryResolverProvider.instance.getDirectory(activeGame.value);
                if (!(directory instanceof R2Error)) {
                    return directory;
                }
            }
            return t('SettingsView.items.change_game_folder.please_set_manually');
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
        t('SettingsView.items.browse_profile_folder.action'),
        t('SettingsView.items.browse_profile_folder.description'),
        async () => {
            return store.getters['profile/activeProfile'].getProfilePath();
        },
        'fa-door-open',
        () => emitInvoke('BrowseProfileFolder')
    ),
    new SettingsRow(
        'Locations',
        t('SettingsView.items.change_data_folder.action'),
        t('SettingsView.items.change_data_folder.description'),
        async () => {
            return PathResolver.ROOT;
        },
        'fa-folder-open',
        () => emitInvoke('ChangeDataFolder')
    ),
    new SettingsRow(
        'Debugging',
        t('SettingsView.items.copy_log_to_clipboard.action'),
        t('SettingsView.items.copy_log_to_clipboard.description'),
        async () => logOutput.value.exists ? t('SettingsView.items.copy_log_to_clipboard.exists') : t('SettingsView.items.copy_log_to_clipboard.not_exists'),
        'fa-clipboard',
        () => {
            if (logOutput.value.exists) {
                emitInvoke('CopyLogToClipboard')
            }
        }
    ),
    new SettingsRow(
        'Debugging',
        t('SettingsView.items.copy_troubleshooting_info.action'),
        t('SettingsView.items.copy_troubleshooting_info.description'),
        async () => t('SettingsView.items.copy_troubleshooting_info.share_info'),
        'fa-clipboard',
        () => emitInvoke('CopyTroubleshootingInfoToClipboard')
    ),
    new SettingsRow(
        'Debugging',
        t('SettingsView.items.toggle_download_cache.action'),
        t('SettingsView.items.toggle_download_cache.description'),
        async () => {
            return store.state.download.ignoreCache
                ? t('SettingsView.items.toggle_download_cache.disabled')
                : t('SettingsView.items.toggle_download_cache.enabled');
        },
        'fa-exchange-alt',
        () => emitInvoke('ToggleDownloadCache')
    ),
    new SettingsRow(
        'Debugging',
        t('SettingsView.items.set_launch_parameters.action'),
        t('SettingsView.items.set_launch_parameters.description'),
        async () => t('SettingsView.items.set_launch_parameters.steam_exec'),
        'fa-wrench',
        () => emitInvoke('SetLaunchParameters')
    ),
    new SettingsRow(
        'Debugging',
        t('SettingsView.items.clean_mod_cache.action'),
        t('SettingsView.items.clean_mod_cache.description'),
        async () => t('SettingsView.items.clean_mod_cache.check_profiles'),
        'fa-trash',
        () => emitInvoke('CleanCache')
    ),
    new SettingsRow(
        'Debugging',
        t('SettingsView.items.clean_online_mod_list.action'),
        t('SettingsView.items.clean_online_mod_list.description'),
        async () => store.dispatch('tsMods/getActiveGameCacheStatus'),
        'fa-trash',
        () => store.dispatch('tsMods/resetActiveGameCache')
    ),
    new SettingsRow(
        'Debugging',
        t('SettingsView.items.toggle_thunderstore_cdn.action'),
        t('SettingsView.items.toggle_thunderstore_cdn.description'),
        async () => t('SettingsView.items.toggle_thunderstore_cdn.current', {label: CdnProvider.current.label, url: CdnProvider.current.url}),
        'fa-exchange-alt',
        CdnProvider.togglePreferredCdn
    ),
    new SettingsRow(
        'Profile',
        t('SettingsView.items.change_profile.action'),
        t('SettingsView.items.change_profile.description'),
        async () => {
            return t('SettingsView.items.change_profile.current', {name: store.getters['profile/activeProfile'].getProfileName()});
        },
        'fa-file-import',
        () => emitInvoke('ChangeProfile')
    ),
    new SettingsRow(
        'Profile',
        t('SettingsView.items.enable_all_mods.action'),
        t('SettingsView.items.enable_all_mods.description'),
        async () => t('SettingsView.items.enable_all_mods.status', {enabled: localModList.value.length - ProfileModList.getDisabledModCount(localModList.value), total: localModList.value.length}),
        'fa-file-import',
        () => emitInvoke('EnableAll')
    ),
    new SettingsRow(
        'Profile',
        t('SettingsView.items.disable_all_mods.action'),
        t('SettingsView.items.disable_all_mods.description'),
        async () => t('SettingsView.items.disable_all_mods.status', {disabled: ProfileModList.getDisabledModCount(localModList.value), total: localModList.value.length}),
        'fa-file-import',
        () => emitInvoke('DisableAll')
    ),
    new SettingsRow(
        'Profile',
        t('SettingsView.items.import_local_mod.action'),
        t('SettingsView.items.import_local_mod.description'),
        async () => t('SettingsView.items.import_local_mod.not_all_installable'),
        'fa-file-import',
        () => store.commit("openLocalFileImportModal")
    ),
    new SettingsRow(
        'Profile',
        t('SettingsView.items.export_profile_file.action'),
        t('SettingsView.items.export_profile_file.description'),
        async () => t('SettingsView.items.export_profile_file.share_easily'),
        'fa-file-export',
        () => store.dispatch("profileExport/exportProfileAsFile")
    ),
    new SettingsRow(
        'Profile',
        t('SettingsView.items.export_profile_code.action'),
        t('SettingsView.items.export_profile_code.description'),
        async () => t('SettingsView.items.export_profile_code.share_easily'),
        'fa-file-export',
        () => store.dispatch("profileExport/exportProfileAsCode")
    ),
    new SettingsRow(
        'Profile',
        t('SettingsView.items.update_all_mods.action'),
        t('SettingsView.items.update_all_mods.description'),
        async () => {
            const outdatedMods = store.getters['profile/modsWithUpdates'];
            if (outdatedMods.length === 1) {
                return t('SettingsView.items.update_all_mods.one_update');
            }
            return t('SettingsView.items.update_all_mods.multi_updates', {count: outdatedMods.length});
        },
        'fa-cloud-upload-alt',
        () => emitInvoke('UpdateAllMods')
    ),
    new SettingsRow(
        'Other',
        t('SettingsView.items.funky_mode.action'),
        t('SettingsView.items.funky_mode.description'),
        async () => {
            return settings.value.getContext().global.funkyModeEnabled
                ? t('SettingsView.items.funky_mode.enabled')
                : t('SettingsView.items.funky_mode.disabled');
        },
        'fa-exchange-alt',
        () => emitInvoke('ToggleFunkyMode')
    ),
    new SettingsRow(
        'Other',
        t('SettingsView.items.switch_theme.action'),
        t('SettingsView.items.switch_theme.description'),
        async () => {
            return settings.value.getContext().global.darkTheme
                ? t('SettingsView.items.switch_theme.dark')
                : t('SettingsView.items.switch_theme.light');
        },
        'fa-exchange-alt',
        () => emitInvoke('SwitchTheme')
    ),
    new SettingsRow(
        'Other',
        t('SettingsView.items.switch_card_type.action'),
        t('SettingsView.items.switch_card_type.description'),
        async () => {
            return settings.value.getContext().global.expandedCards
                ? t('SettingsView.items.switch_card_type.expanded')
                : t('SettingsView.items.switch_card_type.collapsed');
        },
        'fa-exchange-alt',
        () => emitInvoke('SwitchCard')
    ),
    new SettingsRow(
        'Other',
        t('SettingsView.items.refresh_online_mod_list.action'),
        t('SettingsView.items.refresh_online_mod_list.description'),
        async () => {
                if (store.state.tsMods.isThunderstoreModListUpdateInProgress) {
                    return store.state.tsMods.thunderstoreModListUpdateStatus || t('SettingsView.items.refresh_online_mod_list.refreshing');
                }
                if (store.state.tsMods.thunderstoreModListUpdateError) {
                    return t('SettingsView.items.refresh_online_mod_list.error', {error: store.state.tsMods.thunderstoreModListUpdateError.message});
                }
                if (store.getters['download/activeDownloadCount'] > 0) {
                    return t('SettingsView.items.refresh_online_mod_list.disabled_downloads');
                }
                if (store.state.tsMods.modsLastUpdated !== undefined) {
                    return t('SettingsView.items.refresh_online_mod_list.cache_date', {date: moment(store.state.tsMods.modsLastUpdated).format("MMMM Do YYYY, h:mm:ss a")});
                }
                return t('SettingsView.items.refresh_online_mod_list.no_api');
            },
        'fa-exchange-alt',
        async () => await store.dispatch("tsMods/syncPackageList")
    ),
    new SettingsRow(
      'Other',
      t('SettingsView.items.change_game.action'),
      t('SettingsView.items.change_game.description'),
      async () => "",
        'fa-gamepad',
        async () => {
            await ManagerSettings.resetDefaults();
            await router.push({name: 'index'});
        }
    ),
    new SettingsRow(
        'Modpacks',
        t('SettingsView.items.show_dependency_strings.action'),
        t('SettingsView.items.show_dependency_strings.description'),
        async () => t('SettingsView.items.show_dependency_strings.status', {count: localModList.value.length}),
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
                t('SettingsView.items.change_steam_folder.action'),
                t('SettingsView.items.change_steam_folder.description', {app: appName.value}),
                async () => {
                    if (settings.value.getContext().global.steamDirectory !== null) {
                        const directory = await GameDirectoryResolverProvider.instance.getSteamDirectory();
                        if (!(directory instanceof R2Error)) {
                            return directory;
                        }
                    }
                    return t('SettingsView.items.change_steam_folder.please_set_manually');
                },
                'fa-folder-open',
                () => emitInvoke('ChangeSteamDirectory')
            ),
            new SettingsRow(
                'Debugging',
                t('SettingsView.items.reset_installation.action', {game: activeGame.value.displayName}),
                t('SettingsView.items.reset_installation.description'),
                async () => t('SettingsView.items.reset_installation.status', {game: activeGame.value.displayName, folder: activeGame.value.steamFolderName}),
                'fa-wrench',
                () => emitInvoke('ValidateSteamInstallation')
            )
        )
    }

    if (['linux', 'darwin'].includes(appWindow.getPlatform()) && activeGame.value.activePlatform.storePlatform === Platform.STEAM) {
        settingsList.push(
            new SettingsRow(
                'Debugging',
                t('SettingsView.items.change_launch_behaviour.action'),
                t('SettingsView.items.change_launch_behaviour.description'),
                async () => {
                    const launchType = await getLaunchType(activeGame.value);
                    return t('SettingsView.items.change_launch_behaviour.current', {type: launchType});
                },
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

function getTabDisplay(tab: string) {
    return t(`SettingsView.tabs.${tab.toLowerCase()}`);
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
        <Hero :title="$t('SettingsView.settings')"
              :subtitle='`Advanced options for ${appName}: ` + managerVersionNumber.toString()'
              heroType='primary'/>
        <div class="margin-right">
            <div class="sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding">
                <div class='border-at-bottom'>
                    <div class='card is-shadowless is-square'>
                        <div class='card-header-title'>
                            <span class="non-selectable margin-right">{{ $t('SettingsView.search') }}</span>
                            <input v-model='search' class="input" type="text" :placeholder="$t('SettingsView.search_for_a_setting')"/>
                        </div>
                    </div>
                </div>
                <div class="tabs">
                    <ul>
                        <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                            :class="[{'is-active': activeTab === key}]"
                            @click="changeTab(key)">
                            <a>{{ getTabDisplay(key) }}</a>
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
