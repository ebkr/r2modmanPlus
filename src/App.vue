<template>
    <div>

        <router-view @error="showError" v-if="visible"/>

        <div id='errorModal' :class="['modal', 'z-top', {'is-active':(errorMessage !== '')}]">
            <div class="modal-background" @click="closeErrorModal()"></div>
            <div class='modal-content'>
                <div class='notification is-danger'>
                    <h3 class='title'>Error</h3>
                    <h5 class="title is-5">{{errorMessage}}</h5>
                    <p>{{errorStack}}</p>
                    <div v-if="errorSolution !== ''">
                        <br/>
                        <h5 class="title is-5">Suggestion</h5>
                        <p>{{errorSolution}}</p>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeErrorModal()"></button>
        </div>

    </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import ManagerSettings from './r2mm/manager/ManagerSettings';
import ProfileProvider from './providers/ror2/model_implementation/ProfileProvider';
import ProfileImpl from './r2mm/model_implementation/ProfileImpl';
import LogOutput from './r2mm/data/LogOutput';
import LogOutputProvider from './providers/ror2/data/LogOutputProvider';
import ThunderstoreDownloaderProvider from './providers/ror2/downloading/ThunderstoreDownloaderProvider';
import BetterThunderstoreDownloader from './r2mm/downloading/BetterThunderstoreDownloader';
import { ipcRenderer } from 'electron';
import PathResolver from './r2mm/manager/PathResolver';
import path from 'path';
import ThemeManager from './r2mm/manager/ThemeManager';
import 'bulma-switch/dist/css/bulma-switch.min.css';
import LoggerProvider, { LogSeverity } from './providers/ror2/logging/LoggerProvider';
import ManagerInformation from './_managerinf/ManagerInformation';
import LocalModInstallerProvider from './providers/ror2/installing/LocalModInstallerProvider';
import LocalModInstaller from './r2mm/installing/LocalModInstaller';
import { Logger } from './r2mm/logging/Logger';
import FileUtils from './utils/FileUtils';
import LinkProvider from './providers/components/LinkProvider';
import LinkImpl from './r2mm/component_override/LinkImpl';
import FsProvider from './providers/generic/file/FsProvider';
import NodeFs from './providers/generic/file/NodeFs';
import InteractionProvider from './providers/ror2/system/InteractionProvider';
import InteractionProviderImpl from './r2mm/system/InteractionProviderImpl';
import ZipProvider from './providers/generic/zip/ZipProvider';
import AdmZipProvider from './providers/generic/zip/AdmZipProvider';
import ManagerSettingsMigration from './r2mm/manager/ManagerSettingsMigration';
import BindLoaderImpl from './providers/components/loaders/bind_impls/BindLoaderImpl';
import GameManager from './model/game/GameManager';
import PlatformInterceptorProvider from './providers/generic/game/platform_interceptor/PlatformInterceptorProvider';
import PlatformInterceptorImpl from './providers/generic/game/platform_interceptor/PlatformInterceptorImpl';
import ProfileInstallerProvider from './providers/ror2/installing/ProfileInstallerProvider';
import InstallationRules from './r2mm/installing/InstallationRules';
import InstallationRuleApplicator from './r2mm/installing/default_installation_rules/InstallationRuleApplicator';
import GenericProfileInstaller from './r2mm/installing/profile_installers/GenericProfileInstaller';
import ConnectionProviderImpl from './r2mm/connection/ConnectionProviderImpl';
import ConnectionProvider from './providers/generic/connection/ConnectionProvider';
import UtilityMixin from './components/mixins/UtilityMixin.vue';

@Component
export default class App extends mixins(UtilityMixin) {
    private settings: ManagerSettings | null = null;
    private visible: boolean = false;

    async created() {
        // Use as default game for settings load.
        GameManager.activeGame = GameManager.defaultGame;

        this.hookThunderstoreModListRefresh();
        this.hookProfileModListRefresh();
        await this.checkCdnConnection();

        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        this.settings = settings;

        InstallationRuleApplicator.apply();
        InstallationRules.validate();

        ipcRenderer.once('receive-appData-directory', async (_sender: any, appData: string) => {
            PathResolver.APPDATA_DIR = path.join(appData, 'r2modmanPlus-local');
            // Legacy path. Needed for migration.
            PathResolver.CONFIG_DIR = path.join(PathResolver.APPDATA_DIR, "config");

            if (ManagerSettings.NEEDS_MIGRATION) {
                await ManagerSettingsMigration.migrate();
            }

            PathResolver.ROOT = settings.getContext().global.dataDirectory || PathResolver.APPDATA_DIR;

            // If ROOT directory was set previously but no longer exists (EG: Drive disconnected) then fallback to original.
            try {
                await FileUtils.ensureDirectory(PathResolver.ROOT);
            } catch (e) {
                PathResolver.ROOT = PathResolver.APPDATA_DIR;
            }

            await FileUtils.ensureDirectory(PathResolver.APPDATA_DIR);

            await ThemeManager.apply();
            ipcRenderer.once('receive-is-portable', async (_sender: any, isPortable: boolean) => {
                ManagerInformation.IS_PORTABLE = isPortable;
                LoggerProvider.instance.Log(LogSeverity.INFO, `Starting manager on version ${ManagerInformation.VERSION.toString()}`);
                this.visible = true;
            });
            ipcRenderer.send('get-is-portable');
        });
        ipcRenderer.send('get-appData-directory');

        this.$watch('$q.dark.isActive', () => {
            document.documentElement.classList.toggle('html--dark', this.$q.dark.isActive);
        });
    }

    beforeCreate() {

        ConnectionProvider.provide(() => new ConnectionProviderImpl());
        FsProvider.provide(() => new NodeFs());

        ProfileProvider.provide(() => new ProfileImpl());
        LogOutputProvider.provide(() => LogOutput.getSingleton());

        const betterThunderstoreDownloader = new BetterThunderstoreDownloader();
        ThunderstoreDownloaderProvider.provide(() => betterThunderstoreDownloader);

        ZipProvider.provide(() => new AdmZipProvider());
        LocalModInstallerProvider.provide(() => new LocalModInstaller());
        ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
        LoggerProvider.provide(() => new Logger());
        LinkProvider.provide(() => new LinkImpl());
        InteractionProvider.provide(() => new InteractionProviderImpl());

        PlatformInterceptorProvider.provide(() => new PlatformInterceptorImpl());

        BindLoaderImpl.bind();
    }

}
</script>
