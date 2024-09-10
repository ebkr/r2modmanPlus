<template>
    <div>
        <Hero :title="$t('settings.view.title')"
              :subtitle="$t('settings.view.subtitle', {name: appName, version: managerVersionNumber.toString()})"
              heroType='is-info'/>
        <div class="margin-right">
            <div class="sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding">
                <div class='border-at-bottom'>
                    <div class='card is-shadowless is-square'>
                        <div class='card-header-title'>
                            <span class="non-selectable margin-right">{{ $t('settings.view.search') }}</span>
                            <input v-model='search' class="input" type="text" :placeholder="$t('settings.view.searchPH')"/>
                        </div>
                    </div>
                </div>
                <div class="tabs">
                    <ul>
                        <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                            :class="[{'is-active': activeTab === key}]"
                            @click="changeTab(key)">
                            <a>{{ $t(`settings.view.tabs.${key.toLowerCase()}`) }}</a>
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

<script lang="ts">

import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
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
import ManifestV2 from '../../model/ManifestV2';
import Game from '../../model/game/Game';
import { StorePlatform } from '../../model/game/StorePlatform';
import moment from 'moment';
import UtilityMixin from '../mixins/UtilityMixin.vue';
import CdnProvider from '../../providers/generic/connection/CdnProvider';

@Component({
        components: {
            SettingsItem,
            Hero
        }
    })
    export default class SettingsView extends mixins(UtilityMixin) {

        private activeTab: string = 'All';
        private tabs = ['All', 'Profile', 'Locations', 'Debugging', 'Modpacks', 'Other'];
        private logOutput: LogOutputProvider = LogOutputProvider.instance;
        private search: string = '';
        private managerVersionNumber: VersionNumber = ManagerInformation.VERSION;
        private searchableSettings: SettingsRow[] = [];

        get activeGame(): Game {
            return this.$store.state.activeGame;
        }

        get settings(): ManagerSettings {
            return this.$store.getters['settings'];
        };

        get localModList(): ManifestV2[] {
            return this.$store.state.profile.modList;
        }

        get appName(): string {
            return ManagerInformation.APP_NAME;
        }

        private settingsList = [
            new SettingsRow(
                'Locations',
                this.$t('settings.view.actions[0]'),
                this.$t('settings.view.descriptions[0]'),
                async () => PathResolver.ROOT,
                'fa-door-open',
                () => {
                    this.emitInvoke('BrowseDataFolder');
                }
            ),
            new SettingsRow(
                'Locations',
                this.$t('settings.view.actions[1]', {name: this.activeGame.displayName}),
                this.$t('settings.view.descriptions[1]', {name: this.activeGame.displayName, appName: this.appName}),
                async () => {
                    if (this.settings.getContext().gameSpecific.gameDirectory !== null) {
                        const directory = await GameDirectoryResolverProvider.instance.getDirectory(this.activeGame);
                        if (!(directory instanceof R2Error)) {
                            return directory;
                        }
                    }
                    return this.$t('settings.view.returns[0]');
                },
                'fa-folder-open',
                () => {
                    if (StorePlatform.XBOX_GAME_PASS == this.activeGame.activePlatform.storePlatform) {
                        this.emitInvoke('ChangeGameDirectoryGamePass');
                    }
                    else {
                        this.emitInvoke('ChangeGameDirectory');
                    }
                }
            ),
            new SettingsRow(
                'Locations',
                this.$t('settings.view.actions[2]'),
                this.$t('settings.view.descriptions[2]'),
                async () => {
                    return this.$store.getters['profile/activeProfile'].getPathOfProfile();
                },
                'fa-door-open',
                () => this.emitInvoke('BrowseProfileFolder')
            ),
            new SettingsRow(
                'Locations',
                this.$t('settings.view.actions[3]'),
                this.$t('settings.view.descriptions[3]'),
                async () => {
                    return PathResolver.ROOT;
                },
                'fa-folder-open',
                () => this.emitInvoke('ChangeDataFolder')
            ),
            new SettingsRow(
                'Debugging',
                this.$t('settings.view.actions[4]'),
                this.$t('settings.view.descriptions[4]'),
                async () => this.doesLogFileExist(),
                'fa-clipboard',
                () => this.emitInvoke('CopyLogToClipboard')
            ),
            new SettingsRow(
                'Debugging',
                this.$t('settings.view.actions[5]'),
                this.$t('settings.view.descriptions[5]'),
                async () => {
                    return this.settings.getContext().global.ignoreCache
                        ? this.$t('settings.view.values[0]')
                        : this.$t('settings.view.values[1]');
                },
                'fa-exchange-alt',
                () => this.emitInvoke('ToggleDownloadCache')
            ),
            new SettingsRow(
                'Debugging',
                this.$t('settings.view.actions[6]'),
                this.$t('settings.view.descriptions[6]'),
                async () => this.$t('settings.view.values[2]', {name: this.activeGame.dataFolderName}),
                'fa-wrench',
                () => this.emitInvoke('RunPreloaderFix')
            ),
            new SettingsRow(
                'Debugging',
                this.$t('settings.view.actions[7]'),
                this.$t('settings.view.descriptions[7]'),
                async () => this.$t('settings.view.values[3]'),
                'fa-wrench',
                () => this.emitInvoke('SetLaunchParameters')
            ),
            new SettingsRow(
                'Debugging',
                this.$t('settings.view.actions[8]'),
                this.$t('settings.view.descriptions[8]'),
                async () => this.$t('settings.view.values[4]'),
                'fa-trash',
                () => this.emitInvoke('CleanCache')
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
                this.$t('settings.view.actions[9]'),
                this.$t('settings.view.descriptions[9]'),
                async () => {
                    return this.$t('settings.view.values[5]', {name: this.$store.getters['profile/activeProfile'].getProfileName()})
                },
                'fa-file-import',
                () => this.emitInvoke('ChangeProfile')
            ),
            new SettingsRow(
                'Profile',
                this.$t('settings.view.actions[10]'),
                this.$t('settings.view.descriptions[10]'),
                async () => this.$t('settings.view.values[6]', [this.localModList.length - ProfileModList.getDisabledModCount(this.localModList), this.localModList.length]),
                'fa-file-import',
                () => this.emitInvoke('EnableAll')
            ),
            new SettingsRow(
                'Profile',
                this.$t('settings.view.actions[11]'),
                this.$t('settings.view.descriptions[11]'),
                async () => this.$t('settings.view.values[7]', [ProfileModList.getDisabledModCount(this.localModList), this.localModList.length]),
                'fa-file-import',
                () => this.emitInvoke('DisableAll')
            ),
            new SettingsRow(
                'Profile',
                this.$t('settings.view.actions[12]'),
                this.$t('settings.view.descriptions[12]'),
                async () => this.$t('settings.view.values[26]'),
                'fa-file-import',
                () => this.emitInvoke('ImportLocalMod')
            ),
            new SettingsRow(
                'Profile',
                this.$t('settings.view.actions[13]'),
                this.$t('settings.view.descriptions[13]'),
                async () => this.$t('settings.view.values[8]'),
                'fa-file-export',
                () => this.emitInvoke('ExportFile')
            ),
            new SettingsRow(
                'Profile',
                this.$t('settings.view.actions[14]'),
                this.$t('settings.view.descriptions[14]'),
                async () => this.$t('settings.view.values[9]'),
                'fa-file-export',
                () => this.emitInvoke('ExportCode')
            ),
            new SettingsRow(
                'Profile',
                this.$t('settings.view.actions[15]'),
                this.$t('settings.view.descriptions[15]'),
                async () => {
                    const outdatedMods = this.$store.getters['profile/modsWithUpdates'];
                    if (outdatedMods.length === 1) {
                        return this.$t('settings.view.values[10]');
                    }
                    return this.$t('settings.view.values[11]', [outdatedMods.length]);
                },
                'fa-cloud-upload-alt',
                () => this.emitInvoke('UpdateAllMods')
            ),
            new SettingsRow(
                'Other',
                this.$t('settings.view.actions[16]'),
                this.$t('settings.view.descriptions[16]'),
                async () => {
                    return this.settings.getContext().global.funkyModeEnabled
                        ? this.$t('settings.view.values[12]')
                        : this.$t('settings.view.values[13]');
                },
                'fa-exchange-alt',
                () => this.emitInvoke('ToggleFunkyMode')
            ),
            new SettingsRow(
                'Other',
                this.$t('settings.view.actions[17]'),
                this.$t('settings.view.descriptions[17]'),
                async () => {
                    return this.settings.getContext().global.darkTheme
                        ? this.$t('settings.view.values[14]')
                        : this.$t('settings.view.values[15]');
                },
                'fa-exchange-alt',
                () => this.emitInvoke('SwitchTheme')
            ),
            new SettingsRow(
                'Other',
                this.$t('settings.view.actions[18]'),
                this.$t('settings.view.descriptions[18]'),
                async () => {
                    return this.settings.getContext().global.expandedCards
                        ? this.$t('settings.view.values[16]')
                        : this.$t('settings.view.values[17]');
                },
                'fa-exchange-alt',
                () => this.emitInvoke('SwitchCard')
            ),
            new SettingsRow(
                'Other',
                this.$t('settings.view.actions[19]'),
                this.$t('settings.view.descriptions[19]'),
                async () => {
                        if (this.$store.state.tsMods.isBackgroundUpdateInProgress) {
                            return this.$t('settings.view.values[18]');
                        }
                        if (this.$store.state.tsMods.connectionError.length > 0) {
                            return this.$t('settings.view.values[19]', [this.$store.state.tsMods.connectionError]);
                        }
                        if (this.$store.state.tsMods.modsLastUpdated !== undefined) {
                            return this.$t('settings.view.values[20]', [moment(this.$store.state.tsMods.modsLastUpdated).format("MMMM Do YYYY, h:mm:ss a")]);
                        }
                        return this.$t('settings.view.values[21]');
                    },
                'fa-exchange-alt',
                async () => {
                    if (this.$store.state.tsMods.isBackgroundUpdateInProgress) {
                        return;
                    }

                    this.$store.commit("tsMods/startBackgroundUpdate");
                    this.$store.commit("tsMods/setConnectionError", "");

                    try {
                        await this.refreshThunderstoreModList();
                    } catch (e) {
                        this.$store.commit("tsMods/setConnectionError", e);
                    } finally {
                        this.$store.commit("tsMods/finishBackgroundUpdate");
                    }
                }
            ),
            new SettingsRow(
              'Other',
                this.$t('settings.view.actions[20]'),
                this.$t('settings.view.descriptions[20]'),
              async () => "",
                'fa-gamepad',
                async () => {
                    await ManagerSettings.resetDefaults();
                    await this.$router.push({name: 'index'});
                }
            ),
            new SettingsRow(
                'Modpacks',
                this.$t('settings.view.actions[21]'),
                this.$t('settings.view.descriptions[21]'),
                async () => this.$t('settings.view.values[22]', [this.localModList.length]),
                'fa-file-alt',
                () => this.emitInvoke('ShowDependencyStrings')
            ),
            new SettingsRow(
                'Other',
                this.$t('settings.view.actions[23]'),
                this.$t('settings.view.descriptions[23]'),
                async () => Languages[this.$i18n.locale],
                'fa-language',
                () => this.emitInvoke('SetDisplayLanguage')
            ),
        ];

        @Watch('search')
        onSearchChange() {
            this.searchableSettings = this.settingsList
                .filter(value =>
                    value.action.toLowerCase().indexOf(this.search.toLowerCase()) >= 0
                    || value.description.toLowerCase().indexOf(this.search.toLowerCase()) >= 0);
        }

        getFilteredSettings(): Array<SettingsRow> {
            return this.searchableSettings.filter(value => value.group.toLowerCase() === this.activeTab.toLowerCase())
                .sort((a, b) => a.action.localeCompare(b.action));
        }

        async created() {
            if ([StorePlatform.STEAM, StorePlatform.STEAM_DIRECT].includes(this.activeGame.activePlatform.storePlatform)) {
                this.settingsList.push(
                    new SettingsRow(
                        'Locations',
                        this.$t('settings.view.actions[22]'),
                        this.$t('settings.view.descriptions[22]',{name: this.appName}),
                        async () => {
                            if (this.settings.getContext().global.steamDirectory !== null) {
                                const directory = await GameDirectoryResolverProvider.instance.getSteamDirectory();
                                if (!(directory instanceof R2Error)) {
                                    return directory;
                                }
                            }
                            return this.$t('settings.view.values[23]');
                        },
                        'fa-folder-open',
                        () => this.emitInvoke('ChangeSteamDirectory')
                    )
                )
            }
            this.settingsList = this.settingsList.sort((a, b) => a.action.localeCompare(b.action));
            this.searchableSettings = this.settingsList;

            const gameDirectory = await GameDirectoryResolverProvider.instance.getDirectory(this.activeGame);
            if (!(gameDirectory instanceof R2Error)) {
                await this.settings.setGameDirectory(gameDirectory);
            }

            const steamDirectory = await GameDirectoryResolverProvider.instance.getSteamDirectory();
            if (!(steamDirectory instanceof R2Error)) {
                await this.settings.setSteamDirectory(steamDirectory);
            }
        }

        changeTab(tab: string) {
            this.activeTab = tab;
        }

        emitInvoke(invoked: string) {
            this.$emit('setting-invoked', invoked);
        }

        doesLogFileExist() {
            return this.logOutput.exists ? this.$t('settings.view.values[24]') : this.$t('settings.view.values[25]');
        }
    }
</script>
