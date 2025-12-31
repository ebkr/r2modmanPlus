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
import { ExternalLink, Hero, Progress } from '../components/all';
import Game from '../model/game/Game';
import FsProvider from '../providers/generic/file/FsProvider';
import PathResolver from '../r2mm/manager/PathResolver';
import { computed, onMounted, ref } from 'vue';
import { State } from '../store';
import { getStore } from '../providers/generic/store/StoreProvider';
import { useRouter } from 'vue-router';
import { useSplashComposable } from '../components/composables/SplashComposable';
import path from '../providers/node/path/path';
import FileUtils from '../utils/FileUtils';
import { areWrapperArgumentsProvided, getDeterminedLaunchType, isManagerRunningOnFlatpak } from '../utils/LaunchUtils';
import appWindow from '../providers/node/app/app_window';
import Buffer from '../providers/node/buffer/buffer';
import ProtocolProvider from '../providers/generic/protocol/ProtocolProvider';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import { LaunchType } from '../model/real_enums/launch/LaunchType';

const store = getStore<State>();
const router = useRouter();

const {
    reduceRequests
} = useSplashComposable();

const heroTitle = ref<string>('Starting r2modman');
const heroType = ref<string>('primary');
const view = ref<string>('main');
const splashText = computed(() => store.state.splash.splashText);

store.commit('splash/initialiseRequests');

async function moveToNextScreen() {
    if (appWindow.getPlatform() === 'linux') {
        const activeGame: Game = store.state.activeGame;
        const settings = await ManagerSettings.getSingleton(activeGame);
        await ensureWrapperInGameFolder('linux_wrapper.sh');
        await ensureWrapperInGameFolder('steam_executable_launch.sh');
        await ensureWrapperInGameFolder('web_start_wrapper.sh');
        const gameIsProton = await getDeterminedLaunchType(activeGame, settings.getLaunchType() || LaunchType.AUTO) === LaunchType.PROTON;
        if (!gameIsProton || await isManagerRunningOnFlatpak()) {
            if (!(await areWrapperArgumentsProvided(activeGame))) {
                return router.push({name: 'linux'});
            }
        }
    } else if (appWindow.getPlatform() === 'darwin') {
        await ensureWrapperInGameFolder('linux_wrapper.sh');
        return router.push({name: 'linux'});
    }
    return router.push({name: 'profiles'});
}

type WrapperScript = 'linux_wrapper.sh' | 'steam_executable_launch.sh' | 'web_start_wrapper.sh';

async function ensureWrapperInGameFolder(wrapperName: WrapperScript) {
    const staticsDirectory = window.app.getStaticsDirectory();
    const activeGame: Game = store.state.activeGame;
    console.log(`Ensuring wrapper for current game ${activeGame.displayName} in ${path.join(PathResolver.MOD_ROOT, wrapperName)}`);
    try {
        await FsProvider.instance.stat(path.join(PathResolver.MOD_ROOT, wrapperName));
        const oldBuf = (await FsProvider.instance.readFile(path.join(PathResolver.MOD_ROOT, wrapperName)));
        const newBuf = (await FsProvider.instance.readFile(path.join(staticsDirectory, wrapperName)));
        if (!oldBuf.equals(newBuf)) {
            throw new Error('Outdated buffer');
        }
    } catch (_) {
        await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
        if (await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, wrapperName))) {
            await FsProvider.instance.unlink(path.join(PathResolver.MOD_ROOT, wrapperName));
        }
        const wrapperFileResult = await fetch(ProtocolProvider.getPublicAssetUrl(`/${wrapperName}`)).then(res => res.arrayBuffer());
        const wrapperFileContent = Buffer.from(wrapperFileResult);
        await FsProvider.instance.writeFile(path.join(PathResolver.MOD_ROOT, wrapperName), wrapperFileContent);
        await FsProvider.instance.writeFile(path.join(PathResolver.MOD_ROOT, wrapperName), wrapperFileContent);
    }
    await FsProvider.instance.chmod(path.join(PathResolver.MOD_ROOT, wrapperName), 0o755);
}

onMounted(async () => {
    store.commit('splash/updateRequestItem', {
        requestName: 'UpdateCheck',
        value: 100
    } as UpdateRequestItemBody);
    await store.dispatch('splash/getThunderstoreMods');
    moveToNextScreen();
})
</script>
