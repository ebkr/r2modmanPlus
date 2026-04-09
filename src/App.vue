<template>
    <div>
        <div class="main-wrapper">
            <main>
                <div class="router" v-if="visible">
                    <router-view />
                </div>
            </main>
            <div id="activity-bar">
            </div>
        </div>
        <ErrorModal />
    </div>
</template>

<script lang="ts" setup>
import 'bulma-steps/dist/js/bulma-steps.min.js';
import ManagerSettings from './r2mm/manager/ManagerSettings';
import PathResolver from './r2mm/manager/PathResolver';
import path from './providers/node/path/path';
import ThemeManager from './r2mm/manager/ThemeManager';
import 'bulma-switch/dist/css/bulma-switch.min.css';
import LoggerProvider, { LogSeverity } from './providers/ror2/logging/LoggerProvider';
import ManagerInformation from './_managerinf/ManagerInformation';
import InstallationRules from './r2mm/installing/InstallationRules';
import FileUtils from './utils/FileUtils';
import LinkProvider from './providers/components/LinkProvider';
import ManagerSettingsMigration from './r2mm/manager/ManagerSettingsMigration';
import ErrorModal from './components/modals/ErrorModal.vue';
import baseStore from './store';
import { onMounted, ref, watchEffect } from 'vue';
import { useUtilityComposable } from './components/composables/UtilityComposable';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const store = baseStore;
const router = useRouter();

const quasar = useQuasar();

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

onMounted(async () => {
    const settings: ManagerSettings = await store.dispatch('resetActiveGame');

    hookBackgroundUpdateThunderstoreModList(router);
    hookModInstallingViaProtocol(router);
    await checkCdnConnection();

    InstallationRules.apply();
    InstallationRules.validate();

    window.app.getAppDataDirectory().then(async (appData: string) => {
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

        window.app.isApplicationPortable().then((isPortable: boolean) => {
            ManagerInformation.IS_PORTABLE = isPortable;
            LoggerProvider.instance.Log(LogSeverity.INFO, `Starting manager on version ${ManagerInformation.VERSION.toString()}`);
            visible.value = true;
        });
    });

    store.commit('updateModLoaderPackageNames');
    store.dispatch('tsMods/updateExclusions');
});

watchEffect(() => {
    document.documentElement.classList.toggle('html--dark', quasar.dark.isActive);
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

<style lang="scss" scoped>
.main-wrapper {
    display: flex;
    height: 100vh;
    flex-direction: column;

    main {
        flex: 1;
        overflow-y: hidden;
        display: flex;
    }
}

.router {
    display: flex;
    flex: 1;
    overflow-y: hidden;
    overflow-x: hidden;
}

#activity-bar {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;

    &:has(> *) {
        background-color: var(--preview-panel-background-color);
        border-top: 1px solid var(--border, #e1e1e1);
        padding: 0.25rem 0.75rem;
        gap: 0.5rem;
        overflow: hidden;
    }
}
</style>
