<template>
  <div id="q-app">
    <router-view v-if="visible"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import ProfileProvider from './providers/ror2/model_implementation/ProfileProvider';
import ProfileImpl from './r2mm/model_implementation/ProfileImpl';
import LogOutput from './r2mm/data/LogOutput';
import LogOutputProvider from './providers/ror2/data/LogOutputProvider';
import ThunderstoreDownloaderProvider from './providers/ror2/downloading/ThunderstoreDownloaderProvider';
import BetterThunderstoreDownloader from './r2mm/downloading/BetterThunderstoreDownloader';
import { ipcRenderer } from "electron";
import PathResolver from './r2mm/manager/PathResolver';
import path from "path";
import * as fs from 'fs-extra';
import ThemeManager from './r2mm/manager/ThemeManager';
import { Logger, LogSeverity } from './r2mm/logging/Logger';
import ManagerInformation from './_managerinf/ManagerInformation';
import LocalModInstallerProvider from './providers/ror2/installing/LocalModInstallerProvider';
import LocalModInstaller from './r2mm/installing/LocalModInstaller';
import ProfileInstallerProvider from './providers/ror2/installing/ProfileInstallerProvider';
import ProfileInstaller from './r2mm/installing/ProfileInstaller';

@Component
export default class App extends Vue {

    private visible: boolean = false;

    created() {

        ipcRenderer.once('receive-appData-directory', (_sender: any, appData: string) => {
            PathResolver.APPDATA_DIR = path.join(appData, 'r2modmanPlus-local');
            fs.ensureDirSync(PathResolver.APPDATA_DIR);
            ThemeManager.apply();
            Logger.Log(LogSeverity.INFO, `Starting manager on version ${ManagerInformation.VERSION.toString()}`);
            ipcRenderer.once('receive-is-portable', (_sender: any, isPortable: boolean) => {
                ManagerInformation.IS_PORTABLE = isPortable;
                // TODO: Re-enable folder migration
                // this.loadingText = 'Migrating mods (this may take a while)';
                // setTimeout(() => {
                //     FolderMigration.checkAndMigrate()
                //         .then(this.checkForUpdates);
                // }, 100);
                this.bindProviders();
                this.visible = true;
            });
            ipcRenderer.send('get-is-portable');
        });
        ipcRenderer.send('get-appData-directory');

        this.$watch('$q.dark.isActive', () => {
            document.documentElement.classList.toggle('html--dark', this.$q.dark.isActive);
        });
    }

    bindProviders() {
        ProfileProvider.provide(() => new ProfileImpl());
        LogOutputProvider.provide(() => LogOutput.getSingleton());

        const betterThunderstoreDownloader = new BetterThunderstoreDownloader();
        ThunderstoreDownloaderProvider.provide(() => betterThunderstoreDownloader);

        LocalModInstallerProvider.provide(() => new LocalModInstaller());
        ProfileInstallerProvider.provide(() => new ProfileInstaller());
    }

}
</script>
