<template>
    <div class="margin-right">
        <div class="tabs">
            <ul>
                <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                    :class="[{'is-active': activeTab === key}]"
                    @click="changeTab(key)">
                    <a>{{key}}</a>
                </li>
            </ul>
        </div>
        <template v-if="activeTab === 'All'">
                <SettingsItem v-for="(key, index) in settingsList" :key="`setting-${key.action}`"
                    :action="key.action"
                    :description="key.description"
                    :value="key.value()"
                    :icon="key.icon"
                    @click="key.clickAction()"/>
        </template>
        <template v-else>
            <SettingsItem v-for="(key, index) in getFilteredSettings()" :key="`setting-${key.action}`"
                          :action="key.action"
                          :description="key.description"
                          :value="key.value()"
                          :icon="key.icon"
                          @click="key.clickAction()"/>
        </template>
    </div>
</template>

<script lang="ts">

    import { Vue } from 'vue-property-decorator';
    import Component from 'vue-class-component';
    import SettingsItem from './SettingsItem.vue';
    import SettingsRow from '../../model/settings/SettingsRow';
    import ManagerSettings from '../../r2mm/manager/ManagerSettings';
    import GameDirectoryResolver from '../../r2mm/manager/GameDirectoryResolver';
    import R2Error from '../../model/errors/R2Error';
    import PathResolver from '../../r2mm/manager/PathResolver';
    import Profile from '../../model/Profile';
    import LogOutput from '../../r2mm/data/LogOutput';

    @Component({
        components: {
            SettingsItem
        }
    })
    export default class SettingsView extends Vue {

        private activeTab: string = 'All';

        private tabs = ["All", "Profile", "Locations", "Debugging", "Other"];

        private logOutput: LogOutput = LogOutput.getSingleton();

        private settingsList = [
            new SettingsRow(
                'Locations',
                'Browse data folder',
                'Open the directory where mods and profiles are stored.',
                () => PathResolver.ROOT,
                'fa-door-open',
                () => {
                    this.emitInvoke("BrowseDataFolder");
                }
            ),
            new SettingsRow(
                'Locations',
                'Change Risk of Rain 2 directory',
                'Change the location of the Risk of Rain 2 directory that r2modman uses.',
                () => {
                    const directory = GameDirectoryResolver.getDirectory();
                    if (directory instanceof R2Error) {
                        return "Please set manually";
                    }
                    return directory;
                },
                'fa-folder-open',
                () => this.emitInvoke("ChangeGameDirectory")
            ),
            new SettingsRow(
                'Locations',
                'Change Steam directory',
                'Change the location of the Steam directory that r2modman uses.',
                () => {
                    const directory = GameDirectoryResolver.getSteamDirectory();
                    if (directory instanceof R2Error) {
                        return "Please set manually";
                    }
                    return directory;
                },
                'fa-folder-open',
                () => this.emitInvoke("ChangeSteamDirectory")
            ),
            new SettingsRow(
                'Locations',
                'Browse profile folder',
                'Open the directory where mods are stored for the current profile.',
                () => {
                    return Profile.getActiveProfile().getPathOfProfile();
                },
                'fa-door-open',
                () => this.emitInvoke("BrowseProfileFolder")
            ),
            new SettingsRow(
                'Debugging',
                'Copy LogOutput contents to clipboard',
                'Copy the text inside the LogOutput.log file to the clipboard, with Discord formatting.',
                this.doesLogOutputExist,
                'fa-clipboard',
                () => this.emitInvoke("CopyLogToClipboard")
            ),
            new SettingsRow(
                'Debugging',
                'Switch mod install mode',
                'Changes the installation method used for compatibility. This option will disable the config editor.',
                () => {
                    const settings = ManagerSettings.getSingleton();
                    return settings.legacyInstallMode ? 'Current: legacy (no config editor)' : 'Current: symlink (preferred)';
                },
                'fa-exchange-alt',
                () => this.emitInvoke("SwitchModInstallMode")
            ),
            new SettingsRow(
                'Debugging',
                'Toggle download cache',
                'Downloading a mod will ignore mods stored in the cache. Mods will still be placed in the cache.',
                () => {
                    const settings = ManagerSettings.getSingleton();
                    return settings.ignoreCache ? 'Current: cache is disabled' : 'Current: cache is enabled (recommended)';
                },
                'fa-exchange-alt',
                () => this.emitInvoke("ToggleDownloadCache")
            ),
            new SettingsRow(
                'Debugging',
                'Run preloader fix',
                'Run this to fix most errors mentioning the preloader, or about duplicate assemblies.',
                () => 'This will delete the Risk of Rain 2/Managed folder, and verify the files through Steam',
                'fa-wrench',
                () => this.emitInvoke("RunPreloaderFix")
            ),
            new SettingsRow(
                'Debugging',
                'Set launch parameters',
                'Provide custom arguments used to start the game.',
                () => 'These commands are used against the Steam.exe on game startup',
                'fa-wrench',
                () => this.emitInvoke("SetLaunchParameters")
            ),
            new SettingsRow(
                'Profile',
                'Change profile',
                'Change the mod profile.',
                () => `Current profile: ${Profile.getActiveProfile().getProfileName()}`,
                'fa-file-import',
                () => this.emitInvoke("ChangeProfile")
            ),
            new SettingsRow(
                'Profile',
                'Import local mod',
                'Install a mod offline from your files.',
                () => 'Not all mods can be installed locally',
                'fa-file-import',
                () => this.emitInvoke("ImportLocalMod")
            ),
            new SettingsRow(
                'Profile',
                'Export profile as a file',
                'Export your mod list and configs as a file.',
                () => 'The exported file can be shared with friends to get an identical profile quickly and easily',
                'fa-file-export',
                () => this.emitInvoke("ExportFile")
            ),
            new SettingsRow(
                'Profile',
                'Export profile as a code',
                'Export your mod list and configs as a code.',
                () => 'The exported code can be shared with friends to get an identical profile quickly and easily',
                'fa-file-export',
                () => this.emitInvoke("ExportCode")
            ),
            new SettingsRow(
                'Other',
                'Toggle funky mode',
                'Enable/disable funky mode.',
                () => {
                    const settings = ManagerSettings.getSingleton();
                    return settings.funkyModeEnabled ? 'Current: enabled' : 'Current: disabled (default)';
                },
                'fa-exchange-alt',
                () => this.emitInvoke("ToggleFunkyMode")
            ),
            new SettingsRow(
                'Other',
                'Switch theme',
                'Switch between light and dark themes.',
                () => {
                    const settings = ManagerSettings.getSingleton();
                    return settings.darkTheme ? 'Current: dark theme' : 'Current: light theme (default)';
                },
                'fa-exchange-alt',
                () => this.emitInvoke("SwitchTheme")
            ),
            new SettingsRow(
                'Other',
                'Switch card display type',
                'Switch between expanded or collapsed cards',
                () => {
                    const settings = ManagerSettings.getSingleton();
                    return settings.expandedCards ? 'Current: expanded' : 'Current: collapsed (default)';
                },
                'fa-exchange-alt',
                () => this.emitInvoke("SwitchCard")
            ),
        ];

        getFilteredSettings(): Array<SettingsRow> {
            return this.settingsList.filter(value => value.group.toLowerCase() === this.activeTab.toLowerCase())
                .sort((a, b) => a.action.localeCompare(b.action))
        }

        created() {
            this.settingsList = this.settingsList.sort((a, b) => a.action.localeCompare(b.action));
        }

        changeTab(tab: string) {
            this.activeTab = tab;
        }

        emitInvoke(invoked: string) {
            this.$emit("setting-invoked", invoked);
        }

        doesLogOutputExist() {
            return this.logOutput.exists ? "LogOutput.log exists" : "LogOutput.log does not exist";
        }

    }
</script>
