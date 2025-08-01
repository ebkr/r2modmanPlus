<template>
    <div>
        <hero :title="t('translations.pages.splash.pageTitle', {appName: appName})" :subtitle='t(splashText)' :heroType=heroType />
        <div class='notification is-warning'>
            <p>{{ t('translations.pages.splash.gameUpdatesWarning') }}</p>
        </div>
        <Progress
            :max='store.state.splash.requests.length * 100'
            :value='reduceRequests().getProgress() > 0 ? reduceRequests().getProgress() : undefined'
            :className='[reduceRequests().getProgress() > 0 ? "is-info" : ""]' />
        <div class='columns margin-top'>
            <div class='column is-one-quarter'>
                <aside class='menu'>
                    <p class='menu-label'>{{ t('translations.pages.splash.menu.helpLabel') }}</p>
                    <ul class='menu-list'>
                        <li>
                            <a @click="view = 'about'" :class="[view === 'about' ? 'is-active' : '']">
                                {{ t('translations.pages.splash.menu.helpItems.about') }}
                            </a>
                        </li>
                        <li>
                            <a @click="view = 'faq'" :class="[view === 'faq' ? 'is-active' : '']">
                                {{ t('translations.pages.splash.menu.helpItems.faq') }}
                            </a>
                        </li>
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
                                    <strong>
                                        <a @click="view = 'main'">
                                            {{ t('translations.pages.splash.actions.goBack') }}
                                        </a>
                                    </strong>
                                    <br /><br />
                                </div>
                                <div class='container' v-if="view === 'main'">
                                    <p>
                                        <span class='icon margin-right margin-right--half-width'>
                                          <i class='fas fa-info-circle' />
                                        </span>
                                        <strong>{{ t('translations.pages.splash.content.main.didYouKnow') }}</strong>
                                    </p>
                                    <ul class='margin-right'>
                                        <li>
                                            <p>{{ t('translations.pages.splash.content.main.externalInstallWithModManager', {appName: appName}) }}</p>
                                        </li>
                                        <li>
                                            <p>{{ t('translations.pages.splash.content.main.exportProfile') }}</p>
                                        </li>
                                    </ul>
                                    <p>
                                        <ExternalLink url="https://thunderstore.io">
                                            {{ t('translations.pages.splash.content.main.goToThunderstore') }}
                                        </ExternalLink>
                                    </p>
                                    <p>
                    <span class='icon margin-right margin-right--half-width margin-top'>
                                          <i class='fas fa-question-circle' />
                                        </span>
                                        <strong>{{ t('translations.pages.splash.content.main.havingTrouble.title') }}</strong>
                                    </p>
                                    <p>{{ t('translations.pages.splash.content.main.havingTrouble.body') }}</p>
                                    <p>
                                        <ExternalLink url="https://discord.gg/p4yW4bxfSa">
                                            {{ t('translations.pages.splash.content.main.havingTrouble.serverLinkText', appName) }}
                                        </ExternalLink>
                                    </p>
                                </div>
                                <div class='container' v-else-if="view === 'about'">
                                    <p>
                                        <span class='icon margin-right margin-right--half-width'>
                                          <i class='fas fa-address-card' />
                                        </span>
                                        <strong>
                                            {{ t('translations.pages.splash.content.about.title') }}
                                        </strong>
                                    </p>
                                    <p>{{ t('translations.pages.splash.content.about.creator') }}</p>
                                    <p>{{ t('translations.pages.splash.content.about.techStack.builtUsing') }}</p>
                                    <ul>
                                        <li>{{ t('translations.pages.splash.content.about.techStack.electron') }}</li>
                                        <li>{{ t('translations.pages.splash.content.about.techStack.node') }}</li>
                                        <li>{{ t('translations.pages.splash.content.about.techStack.vue') }}</li>
                                        <li>{{ t('translations.pages.splash.content.about.techStack.typescript') }}</li>
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
                                            <p>
                                                <strong>
                                                    {{ t('translations.pages.splash.content.faq.howToGetStarted.title') }}
                                                </strong>
                                            </p>
                                            <p>
                                                {{ t('translations.pages.splash.content.faq.howToGetStarted.body') }}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>
                                                    {{ t('translations.pages.splash.content.faq.startingWithMods.title') }}
                                                </strong>
                                            </p>
                                            <p>
                                                {{ t('translations.pages.splash.content.faq.startingWithMods.body') }}
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
import { UpdateRequestItemBody } from '../store/modules/SplashModule';
import FileUtils from "../utils/FileUtils";
import {areWrapperArgumentsProvided, isProtonRequired} from '../utils/LaunchUtils';
import appWindow from '../providers/node/app/app_window';
import Buffer from '../providers/node/buffer/buffer';
import { useI18n } from 'vue-i18n';
import ManagerInformation from '../_managerinf/ManagerInformation';

const store = getStore<State>();
const router = useRouter();
const { t } = useI18n();

const {
    reduceRequests
} = useSplashComposable();

const heroType = ref<string>('primary');
const view = ref<string>('main');
const splashText = computed(() => store.state.splash.splashText);
const appName = computed(() => ManagerInformation.APP_NAME);

store.commit('splash/initialiseRequests');

// Ensure that the manager isn't outdated.
function checkForUpdates() {
    store.dispatch('splash/setSplashText', 'translations.pages.splash.states.preparing');
    window.app.checkForApplicationUpdates()
        .then(async () => {
            store.commit('splash/updateRequestItem', {
                requestName: 'UpdateCheck',
                value: 100
            } as UpdateRequestItemBody);
            await store.dispatch('splash/getThunderstoreMods');
            moveToNextScreen();
        })
}

async function moveToNextScreen() {
    if (appWindow.getPlatform() === 'linux') {
        const activeGame: Game = store.state.activeGame;

        if (!(await isProtonRequired(activeGame))) {
            console.log('Not proton game');
            await ensureWrapperInGameFolder();
            if (!(await areWrapperArgumentsProvided(activeGame))) {
                router.push({name: 'linux'});
                return;
            }
        }
    } else if (appWindow.getPlatform() === 'darwin') {
        await ensureWrapperInGameFolder();
        router.push({name: 'linux'});
        return;
    }
    router.push({name: 'profiles'});
}

async function ensureWrapperInGameFolder() {
    const staticsDirectory = window.app.getStaticsDirectory();
    const wrapperName = appWindow.getPlatform() === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh';
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
        const wrapperFileResult = await fetch(`/${wrapperName}`).then(res => res.arrayBuffer());
        const wrapperFileContent = Buffer.from(wrapperFileResult);
        await FsProvider.instance.writeFile(path.join(PathResolver.MOD_ROOT, wrapperName), wrapperFileContent);
    }
    await FsProvider.instance.chmod(path.join(PathResolver.MOD_ROOT, wrapperName), 0o755);
}

onMounted(() => {
    store.dispatch('splash/setSplashText', 'translations.pages.splash.states.checkingForUpdates');
    setTimeout(checkForUpdates, 100);
})
</script>
