<template>
    <div>
        <hero :title=heroTitle :subtitle='loadingText' :heroType=heroType />
        <div class='notification is-warning'>
            <p>{{ $t(`pages.splash.notification`) }}</p>
        </div>
        <progress-bar
            v-if="!isOffline"
            :max='requests.length * 100'
            :value='reduceRequests().getProgress() > 0 ? reduceRequests().getProgress() : undefined'
            :className='[reduceRequests().getProgress() > 0 ? "is-info" : ""]' />
        <div class='columns'>
            <div class='column is-one-quarter'>
                <aside class='menu'>
                    <p class='menu-label'>{{ $t(`pages.splash.help`) }}</p>
                    <ul class='menu-list'>
                        <li><a @click="view = 'about'" :class="[view === 'about' ? 'is-active' : '']">{{ $t(`pages.splash.about`) }}</a></li>
                        <li><a @click="view = 'faq'" :class="[view === 'faq' ? 'is-active' : '']">{{ $t(`pages.splash.FAQ`) }}</a></li>
                        <li>
                            <link-component :url="'https://github.com/ebkr/r2modmanPlus'" :target="'external'">
                                <i class='fab fa-github fa-lg' aria-hidden='true' />
                            </link-component>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class='column is-three-quarters'>
                <div class='container'>
                    <br />
                    <nav class='level' v-if='isOffline'>
                        <div class='level-item'>
                            <a class='button is-info margin-right margin-right--half-width' @click='continueOffline()'>{{ $t(`pages.splash.offline`) }}</a>
                            <a class='button' @click='retryConnection()'>{{ $t(`pages.splash.reconnect`) }}</a>
                        </div>
                        <br /><br />
                    </nav>
                </div>
                <div>
                    <article class='media'>
                        <div class='media-content'>
                            <div class='content'>
                                <div class='container' v-if="view !== 'main'">
                                    <i class='fas fa-long-arrow-alt-left margin-right' />
                                    <strong><a @click="view = 'main'">{{ $t(`pages.splash.back`) }}</a></strong>
                                    <br /><br />
                                </div>
                                <div class='container' v-if="view === 'main'">
                                    <p>
                    <span class='icon margin-right margin-right--half-width'>
                      <i class='fas fa-info-circle' />
                    </span>
                                        <strong>{{ $t(`pages.splash.know`) }}</strong>
                                    </p>
                                    <ul class='margin-right'>
                                        <li>
                                            <i18n path="pages.splash.installTip" tag="p">
                                                <template v-slot:link>
                                                    <link-component
                                                        :url="'https://thunderstore.io'" :target="'external'">Thunderstore
                                                    </link-component>
                                                </template>
                                            </i18n>
                                        </li>
                                        <li>
                                            <p>
                                                {{ $t(`pages.splash.exportProfile`) }}
                                            </p>
                                        </li>
                                    </ul>
                                    <p>
                    <span class='icon margin-right margin-right--half-width'>
                      <i class='fas fa-question-circle' />
                    </span>
                                        <strong>{{ $t(`pages.splash.trouble`) }}</strong>
                                    </p>
                                    <p>
                                        {{ $t(`pages.splash.troubleTip`) }}
                                    </p>
                                </div>
                                <div class='container' v-else-if="view === 'about'">
                                    <p>
                    <span class='icon margin-right margin-right--half-width'>
                      <i class='fas fa-address-card' />
                    </span>
                                        <strong>{{ $t(`pages.splash.r2modman`) }}</strong>
                                    </p>
                                    <p>{{ $t(`pages.splash.created`) }}</p>
                                    <p>{{ $t(`pages.splash.quasar`) }}</p>
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
                                        <strong>{{ $t(`pages.splash.FAQ`) }}</strong>
                                    </p>
                                    <ul>
                                        <li>
                                            <p><strong>{{ $t(`pages.splash.questions[0]`) }}</strong></p>
                                            <p>
                                                {{ $t(`pages.splash.answers[0]`) }}
                                            </p>
                                        </li>
                                        <li>
                                            <p><strong>{{ $t(`pages.splash.questions[1]`) }}</strong></p>
                                            <p>
                                                {{ $t(`pages.splash.answers[1]`) }}
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

<script lang='ts'>
import * as path from 'path';

import { ipcRenderer } from 'electron';
import Component, { mixins } from 'vue-class-component';

import { Hero, Link, Progress } from '../components/all';
import SplashMixin from '../components/mixins/SplashMixin.vue';
import Game from '../model/game/Game';
import RequestItem from '../model/requests/RequestItem';
import FsProvider from '../providers/generic/file/FsProvider';
import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import LinuxGameDirectoryResolver from '../r2mm/manager/linux/GameDirectoryResolver';
import PathResolver from '../r2mm/manager/PathResolver';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
        'link-component': Link
    }
})
export default class Splash extends mixins(SplashMixin) {
    heroTitle: string = this.$t(`pages.splash.starting`);
    loadingText: string = this.$t(`pages.splash.initialising`);
    view: string = 'main';

    requests = [
        new RequestItem('UpdateCheck', 0),
        new RequestItem('ThunderstoreDownload', 0),
        new RequestItem('ExclusionsList', 0),
        new RequestItem('CacheOperations', 0)
    ];

    // Ensure that r2modman isn't outdated.
    private checkForUpdates() {
        this.loadingText = 'Preparing';
        ipcRenderer.once('update-done', async () => {
            this.getRequestItem('UpdateCheck').setProgress(100);
            await this.getExclusions();
            await this.getThunderstoreMods();
        });
        ipcRenderer.send('update-app');
    }

    async moveToNextScreen() {
        if (process.platform === 'linux') {
            const activeGame: Game = this.$store.state.activeGame;

            if (!await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).isProtonGame(activeGame)) {
                console.log('Not proton game');
                await this.ensureWrapperInGameFolder();
                const launchArgs = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).getLaunchArgs(activeGame);
                console.log(`Launch arguments for this game:`, launchArgs);
                if (typeof launchArgs === 'string' && !launchArgs.startsWith(path.join(PathResolver.MOD_ROOT, 'linux_wrapper.sh'))) {
                    this.$router.push({name: 'linux'});
                    return;
                }
            }
        } else if (process.platform === 'darwin') {
            await this.ensureWrapperInGameFolder();
            this.$router.push({name: 'linux'});
            return;
        }
        this.$router.push({name: 'profiles'});
    }

    retryConnection() {
        this.resetRequestProgresses();
        this.isOffline = false;
        this.checkForUpdates();
    }

    private async ensureWrapperInGameFolder() {
        const wrapperName = process.platform === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh';
        const activeGame: Game = this.$store.state.activeGame;
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

    async created() {
        this.loadingText = this.$t(`pages.splash.checking`);
        setTimeout(this.checkForUpdates, 100);
    }
}
</script>
