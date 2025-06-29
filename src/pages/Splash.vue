<template>
    <div>
        <hero :title=heroTitle :subtitle='splashText' :heroType=heroType />
        <div class='notification is-warning'>
            <p>Game updates may break mods. If a new update has been released, please be patient.</p>
        </div>
        <Progress
            :max='store.state.splash.requests.length * 100'
            :value='reduceRequests().getProgress() > 0 ? reduceRequests().getProgress() : undefined'
            :className='[reduceRequests().getProgress() > 0 ? "is-info" : ""]' />
        <div class='columns'>
            <div class='column is-one-quarter'>
                <aside class='menu'>
                    <p class='menu-label'>Help</p>
                    <ul class='menu-list'>
                        <li><a @click="view = 'about'" :class="[view === 'about' ? 'is-active' : '']">About</a></li>
                        <li><a @click="view = 'faq'" :class="[view === 'faq' ? 'is-active' : '']">FAQ</a></li>
                        <li>
                            <ExternalLink url="https://github.com/ebkr/r2modmanPlus">
                                <i class='fab fa-github fa-lg' aria-hidden='true' />
                            </ExternalLink>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class='column is-three-quarters'>
                <div>
                    <article class='media'>
                        <div class='media-content'>
                            <div class='content'>
                                <div class='container' v-if="view !== 'main'">
                                    <i class='fas fa-long-arrow-alt-left margin-right' />
                                    <strong><a @click="view = 'main'">Go back</a></strong>
                                    <br /><br />
                                </div>
                                <div class='container' v-if="view === 'main'">
                                    <p>
                    <span class='icon margin-right margin-right--half-width'>
                      <i class='fas fa-info-circle' />
                    </span>
                                        <strong>Did you know?</strong>
                                    </p>
                                    <ul class='margin-right'>
                                        <li>
                                            <p>
                                                You can use the "Install with Mod Manager" button on
                                                <ExternalLink url="https://thunderstore.io">Thunderstore</ExternalLink>
                                                with r2modman.
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                You can export the selected profile from the settings screen as either a
                                                file, or a code.
                                                This makes it easy to share your mod list with friends!
                                            </p>
                                        </li>
                                    </ul>
                                    <p>
                    <span class='icon margin-right margin-right--half-width'>
                      <i class='fas fa-question-circle' />
                    </span>
                                        <strong>Having trouble?</strong>
                                    </p>
                                    <p>
                                        Send a screenshot of the error in the Thunderstore modding discord server. Feel
                                        free to ping me
                                        if it doesn't get resolved.
                                    </p>
                                </div>
                                <div class='container' v-else-if="view === 'about'">
                                    <p>
                    <span class='icon margin-right margin-right--half-width'>
                      <i class='fas fa-address-card' />
                    </span>
                                        <strong>About r2modman</strong>
                                    </p>
                                    <p>It's created by Ebkr, using Quasar.</p>
                                    <p>Quasar provides the following development tools that r2modman is built upon:</p>
                                    <ul>
                                        <li>Electron</li>
                                        <li>Node</li>
                                        <li>Vue</li>
                                        <li>TypeScript</li>
                                    </ul>
                                </div>
                                <div class='container' v-else-if="view === 'faq'">
                                    <p>
                    <span class='icon margin-right margin-right--half-width'>
                      <i class='fas fa-question-circle' />
                    </span>
                                        <strong>FAQ</strong>
                                    </p>
                                    <ul>
                                        <li>
                                            <p><strong>How do I get started?</strong></p>
                                            <p>
                                                Head on over to the online tab, and download BepInEx and R2API.
                                            </p>
                                        </li>
                                        <li>
                                            <p><strong>Starting the game with mods</strong></p>
                                            <p>
                                                You have to start the game from within the manager. Starting through
                                                Steam will not work
                                                without taking manual steps.
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import * as path from 'path';
import { ipcRenderer } from 'electron';
import { ExternalLink, Hero, Progress } from '../components/all';
import Game from '../model/game/Game';
import RequestItem from '../model/requests/RequestItem';
import FsProvider from '../providers/generic/file/FsProvider';
import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import LinuxGameDirectoryResolver from '../r2mm/manager/linux/GameDirectoryResolver';
import PathResolver from '../r2mm/manager/PathResolver';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { State } from '../store';
import { getStore } from '../providers/generic/store/StoreProvider';
import VueRouter from 'vue-router';
import { useSplashComposable } from '../components/composables/SplashComposable';

const store = getStore<State>();
let router!: VueRouter;

onMounted(() => {
    router = getCurrentInstance()!.proxy.$router;
})

const {
    getRequestItem,
    reduceRequests
} = useSplashComposable();

const heroTitle = ref<string>('Starting r2modman');
const heroType = ref<string>('primary');
const view = ref<string>('main');
const splashText = computed(() => store.state.splash.splashText);

store.commit('splash/initialiseRequests');

// Ensure that the manager isn't outdated.
function checkForUpdates() {
    store.dispatch('splash/setSplashText', 'Preparing');
    ipcRenderer.once('update-done', async () => {
        const updateCheck: RequestItem = await store.dispatch('splash/getRequestItem', 'UpdateCheck');
        updateCheck.setProgress(100);
        await store.dispatch('splash/getThunderstoreMods');
        moveToNextScreen();
    });
    ipcRenderer.send('update-app');
}

async function moveToNextScreen() {
    if (process.platform === 'linux') {
        const activeGame: Game = store.state.activeGame;

        if (!await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).isProtonGame(activeGame)) {
            console.log('Not proton game');
            await ensureWrapperInGameFolder();
            const launchArgs = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).getLaunchArgs(activeGame);
            console.log(`Launch arguments for this game:`, launchArgs);
            if (typeof launchArgs === 'string' && !launchArgs.startsWith(path.join(PathResolver.MOD_ROOT, 'linux_wrapper.sh'))) {
                router.push({name: 'linux'});
                return;
            }
        }
    } else if (process.platform === 'darwin') {
        await ensureWrapperInGameFolder();
        router.push({name: 'linux'});
        return;
    }
    router.push({name: 'profiles'});
}

async function ensureWrapperInGameFolder() {
    const wrapperName = process.platform === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh';
    const activeGame: Game = store.state.activeGame;
    console.log(`Ensuring wrapper for current game ${activeGame.displayName} in ${path.join(PathResolver.MOD_ROOT, wrapperName)}`);
    try {
        await FsProvider.instance.stat(path.join(PathResolver.MOD_ROOT, wrapperName));
        const oldBuf = (await FsProvider.instance.readFile(path.join(PathResolver.MOD_ROOT, wrapperName)));
        const newBuf = (await FsProvider.instance.readFile(path.join(__statics, wrapperName)));
        if (!oldBuf.equals(newBuf)) {
            throw new Error('Outdated buffer');
        }
    } catch (_) {
        if (await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, wrapperName))) {
            await FsProvider.instance.unlink(path.join(PathResolver.MOD_ROOT, wrapperName));
        }
        await FsProvider.instance.copyFile(path.join(__statics, wrapperName), path.join(PathResolver.MOD_ROOT, wrapperName));
    }
    await FsProvider.instance.chmod(path.join(PathResolver.MOD_ROOT, wrapperName), 0o755);
}

onMounted(() => {
    store.dispatch('splash/setSplashText', 'Checking for updates');
    setTimeout(checkForUpdates, 100);
})
</script>
