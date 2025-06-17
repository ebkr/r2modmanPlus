<template>
    <div>
        <main>
            <router-view v-if="visible"/>
        </main>
        <ErrorModal />
    </div>
</template>

<script lang="ts" setup>
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
import { DataFolderProvider } from './providers/ror2/system/DataFolderProvider';
import { DataFolderProviderImpl } from './r2mm/system/DataFolderProviderImpl';
import InteractionProvider from './providers/ror2/system/InteractionProvider';
import InteractionProviderImpl from './r2mm/system/InteractionProviderImpl';
import ZipProvider from './providers/generic/zip/ZipProvider';
import AdmZipProvider from './providers/generic/zip/AdmZipProvider';
import ManagerSettingsMigration from './r2mm/manager/ManagerSettingsMigration';
import BindLoaderImpl from './providers/components/loaders/bind_impls/BindLoaderImpl';
import PlatformInterceptorProvider from './providers/generic/game/platform_interceptor/PlatformInterceptorProvider';
import PlatformInterceptorImpl from './providers/generic/game/platform_interceptor/PlatformInterceptorImpl';
import ProfileInstallerProvider from './providers/ror2/installing/ProfileInstallerProvider';
import InstallationRules from './r2mm/installing/InstallationRules';
import InstallationRuleApplicator from './r2mm/installing/default_installation_rules/InstallationRuleApplicator';
import GenericProfileInstaller from './r2mm/installing/profile_installers/GenericProfileInstaller';
import ErrorModal from './components/modals/ErrorModal.vue';
import { provideStoreImplementation } from './providers/generic/store/StoreProvider';
import baseStore from './store';
import { getCurrentInstance, onMounted, ref, watchEffect } from 'vue';
import { useUtilityComposable } from './components/composables/UtilityComposable';
import { Dark } from 'quasar';

const store = baseStore();
provideStoreImplementation(() => store);

document.addEventListener('auxclick', e => {
    const target = e.target! as any;
    if (target.localName == 'a') {
        LinkProvider.instance.openLink(target.getAttribute("href"))
    }
    e.preventDefault();
}, false);

const {
    hookBackgroundUpdateThunderstoreModList,
    hookModInstallingViaProtocol,
    checkCdnConnection,
} = useUtilityComposable();

const visible = ref<boolean>(false);

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
DataFolderProvider.provide(() => new DataFolderProviderImpl());

PlatformInterceptorProvider.provide(() => new PlatformInterceptorImpl());

BindLoaderImpl.bind();

onMounted(async () => {
    // Load settings using the default game before the actual game is selected.
    const router = getCurrentInstance()!.proxy.$router;
    const settings: ManagerSettings = await store.dispatch('resetActiveGame');

    hookBackgroundUpdateThunderstoreModList(router);
    hookModInstallingViaProtocol(router);
    await checkCdnConnection();

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
            visible.value = true;
        });
        ipcRenderer.send('get-is-portable');
    });
    ipcRenderer.send('get-appData-directory');

    store.commit('updateModLoaderPackageNames');
    store.dispatch('tsMods/updateExclusions');
});

watchEffect(() => {
    document.documentElement.classList.toggle('html--dark', Dark.isActive);
})
</script>

<style lang="scss">
html {
    overflow: hidden;
    overflow-y: auto;
}

main {
    display: grid;
    grid-template-rows: 100vh;
}
</style>
