<template>
    <div id="q-app" :class="[{'html--funky':settings.funkyModeEnabled}]">

        <router-view @error="showError" v-if="visible"/>

        <div id='errorModal' :class="['modal', {'is-active':(errorMessage !== '')}]">
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
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import 'bulma-steps/dist/js/bulma-steps.min.js';
    import R2Error from './model/errors/R2Error';
    import ManagerSettings from './r2mm/manager/ManagerSettings';
    import ProfileProvider from './providers/ror2/model_implementation/ProfileProvider';
    import ProfileImpl from './r2mm/model_implementation/ProfileImpl';
    import LogOutput from './r2mm/data/LogOutput';
    import LogOutputProvider from './providers/ror2/data/LogOutputProvider';
    import ThunderstoreDownloaderProvider from './providers/ror2/downloading/ThunderstoreDownloaderProvider';
    import BetterThunderstoreDownloader from './r2mm/downloading/BetterThunderstoreDownloader';
    import { ipcRenderer } from "electron";
    import PathResolver from './r2mm/manager/PathResolver';
    import path from "path";
    import ThemeManager from './r2mm/manager/ThemeManager';
    import LoggerProvider, {LogSeverity} from './providers/ror2/logging/LoggerProvider';
    import ManagerInformation from './_managerinf/ManagerInformation';
    import LocalModInstallerProvider from './providers/ror2/installing/LocalModInstallerProvider';
    import LocalModInstaller from './r2mm/installing/LocalModInstaller';
    import ProfileInstallerProvider from './providers/ror2/installing/ProfileInstallerProvider';
    import ProfileInstaller from './r2mm/installing/ProfileInstaller';
    import { Logger } from './r2mm/logging/Logger';
    import FileUtils from './utils/FileUtils';
    import LinkProvider from './providers/components/LinkProvider';
    import LinkImpl from './r2mm/component_override/LinkImpl';
    import FsProvider from './providers/generic/file/FsProvider';
    import NodeFs from './providers/generic/file/NodeFs';

    @Component
    export default class App extends Vue {

        private errorMessage: string = '';
        private errorStack: string = '';
        private errorSolution: string = '';
        private settings: ManagerSettings = ManagerSettings.getSingleton();

        private visible: boolean = false;

        showError(error: R2Error) {
            this.errorMessage = error.name;
            this.errorStack = error.message;
            this.errorSolution = error.solution;
        }

        closeErrorModal() {
            this.errorMessage = '';
            this.errorStack = '';
            this.errorSolution = '';
        }

        created() {

            ipcRenderer.once('receive-appData-directory', (_sender: any, appData: string) => {

                PathResolver.APPDATA_DIR = path.join(appData, 'r2modmanPlus-local');
                FileUtils.ensureDirectory(PathResolver.APPDATA_DIR);
                ThemeManager.apply();
                ipcRenderer.once('receive-is-portable', (_sender: any, isPortable: boolean) => {
                    ManagerInformation.IS_PORTABLE = isPortable;
                    // TODO: Re-enable folder migration
                    // this.loadingText = 'Migrating mods (this may take a while)';
                    // setTimeout(() => {
                    //     FolderMigration.checkAndMigrate()
                    //         .then(this.checkForUpdates);
                    // }, 100);
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

            const fs = new NodeFs();
            FsProvider.provide(() => fs);

            ProfileProvider.provide(() => new ProfileImpl());
            LogOutputProvider.provide(() => LogOutput.getSingleton());

            const betterThunderstoreDownloader = new BetterThunderstoreDownloader();
            ThunderstoreDownloaderProvider.provide(() => betterThunderstoreDownloader);

            LocalModInstallerProvider.provide(() => new LocalModInstaller());
            ProfileInstallerProvider.provide(() => new ProfileInstaller());
            LoggerProvider.provide(() => new Logger());

            LinkProvider.provide(() => new LinkImpl());
        }

    }
</script>
