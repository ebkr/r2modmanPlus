<template>
    <div id="help-view">
        <Hero :title="t('translations.pages.help.hero.title')" :subtitle="t('translations.pages.help.hero.subtitle')" hero-type="primary"/>
        <div
            class="tabs sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding has-background-">
            <ul>
                <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                    :class="[{'is-active': activeTab === key}]"
                    @click="changeTab(key)">
                    <a>{{ t(`translations.pages.help.tabs.${key}`) }}</a>
                </li>
            </ul>
        </div>
        <div class="margin-right">
            <br/>
            <div ref="general" v-if="activeTab === 'general'">
                <h2 class="title is-5">
                    {{ t('translations.pages.help.general.gettingStarted.title') }}
                </h2>
                <p>{{ t('translations.pages.help.general.gettingStarted.whereToFindMods') }}</p>
                <i18n-t tag="p" keypath="translations.pages.help.general.gettingStarted.onceInstalled">
                    <template v-slot:startModdedAction>
                        <strong>{{ t('translations.pages.manager.navigation.gameActions.startModded') }}</strong>
                    </template>
                </i18n-t>
                <hr/>
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.general.slowGame.title') }}
                </h2>
                <p>
                    {{ t('translations.pages.help.general.slowGame.likelyCause') }}
                </p>
                <p>
                    {{ t('translations.pages.help.general.slowGame.issuePersisting') }}
                </p>
                <p class="margin-top">
                    {{ t('translations.pages.help.general.slowGame.ifStutters') }}
                </p>
                <hr/>
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.general.dedicatedServers.title') }}
                </h2>
                <p>{{ t('translations.pages.help.general.dedicatedServers.content') }}</p>
                <hr/>
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.general.launchingExternally.title') }}
                </h2>
                <p>
                    {{ t('translations.pages.help.general.launchingExternally.howTo') }}
                </p>
                <p class="margin-top">
                    {{ t('translations.pages.help.general.launchingExternally.whereToPlace') }}
                </p>
                <p>
                    {{ t('translations.pages.help.general.launchingExternally.forSteam') }}
                </p>
                <p class="margin-top">
                    {{ t('translations.pages.help.general.launchingExternally.yourCurrentArgument') }}
                    <code v-if="launchArgs.length > 0">{{ launchArgs }}</code>
                    <code v-else>{{ t('translations.pages.help.general.launchingExternally.loaderNotInstalled') }}</code>
                    <br/>
                </p>
                <template v-if="doorstopTarget.length > 0">
                    <p>
                        <button class="button" @click="copyLaunchArgsToClipboard" v-if="!copyingDoorstopText">
                            <i class="fas fa-clipboard"></i>
                            <span class="margin-left--half-width smaller-font">
                                {{ t('translations.pages.help.general.launchingExternally.copyArguments') }}
                            </span>
                        </button>
                        <button class="button is-loading" v-else>
                            {{ t('translations.pages.help.general.launchingExternally.copyArguments') }}
                        </button>
                    </p>
                </template>
            </div>
            <div ref="gameWontStart" v-if="activeTab === 'gameWontStart'">
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.gameWontStart.errorModal.title') }}
                </h2>
                <p>{{ t('translations.pages.help.gameWontStart.errorModal.solution') }}</p>
                <hr/>
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.gameWontStart.redirectedToStorePage.title') }}
                </h2>
                <p>{{ t('translations.pages.help.gameWontStart.redirectedToStorePage.solution', { appName: appName }) }}</p>
                <hr/>
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.gameWontStart.consoleCloses.title') }}
                </h2>
                <p>{{ t('translations.pages.help.gameWontStart.consoleCloses.tryRunning') }}</p>
                <p>{{ t('translations.pages.help.gameWontStart.consoleCloses.ifPersists') }}</p>
            </div>
            <div ref="modsNotShowing" v-if="activeTab === 'modsNotShowing'">
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.modsNotShowing.potentialSolutions.title') }}
                </h2>
                <p>{{ t('translations.pages.help.modsNotShowing.potentialSolutions.instructToWiki') }}</p>
                <p class="margin-top">
                    <ExternalLink url="https://github.com/ebkr/r2modmanPlus/wiki/Why-aren't-my-mods-working%3F">
                        {{ t('translations.pages.help.modsNotShowing.potentialSolutions.goToWiki') }}
                    </ExternalLink>
                </p>
            </div>
            <div ref="updating" v-if="activeTab === 'updating'">
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.updating.autoUpdates.title') }}
                </h2>
                <p>{{ t('translations.pages.help.updating.autoUpdates.whenDoesItUpdate') }}</p>
                <p>{{ t('translations.pages.help.updating.autoUpdates.downloadedInBackground') }}</p>
                <i18n-t tag="p" keypath="translations.pages.help.updating.autoUpdates.promptToRunOldInstaller" class="margin-top">
                    <template v-slot:oldInstaller>
                        <i>old_uninstaller</i>
                    </template>
                </i18n-t>
                <p class="margin-top">{{ t('translations.pages.help.updating.autoUpdates.ifProblemOccurs') }}</p>
                <hr/>
                <h2 class='title is-5'>
                    {{ t('translations.pages.help.updating.ignoreUpdates.title') }}
                </h2>
                <p>{{ t('translations.pages.help.updating.ignoreUpdates.content') }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ExternalLink, Hero} from '../components/all';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import R2Error from '../model/errors/R2Error';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';
import {onMounted, ref, watchEffect, computed} from 'vue';
import {getStore} from '../providers/generic/store/StoreProvider';
import {State} from '../store';
import {getDeterminedLaunchType} from "../utils/LaunchUtils";
import {ComputedWrapperLaunchArguments} from "../components/computed/WrapperArguments";
import {getLaunchType, LaunchType} from "../model/real_enums/launch/LaunchType";
import { useI18n } from 'vue-i18n';
import ManagerInformation from '../_managerinf/ManagerInformation';

const store = getStore<State>();
const { t } = useI18n();

const activeTab = ref('general');
const tabs = ref(['general', 'gameWontStart', 'modsNotShowing', 'updating']);
const doorstopTarget = ref("");
const copyingDoorstopText = ref(false);
const launchArgs = ref("");
const appName = computed(() => ManagerInformation.APP_NAME);

watchEffect(async () => {
    const loaderArgs = doorstopTarget.value;
    const prerequisiteText = ComputedWrapperLaunchArguments.value;
    if (process.platform === 'win32') {
        launchArgs.value = loaderArgs;
        return;
    }
    const storedLaunchType = await getLaunchType(store.state.activeGame);
    const launchType = await getDeterminedLaunchType(store.state.activeGame, storedLaunchType);
    if (launchType === LaunchType.NATIVE) {
        launchArgs.value = `${prerequisiteText} ${loaderArgs}`;
    } else {
        launchArgs.value = `%command% ${loaderArgs}`;
    }
});

function changeTab(key: string) {
    activeTab.value = key;
}

function copyLaunchArgsToClipboard() {
    InteractionProvider.instance.copyToClipboard(launchArgs.value);
    copyingDoorstopText.value = true;
    setTimeout(stopShowingCopy, 400);
}

function stopShowingCopy() {
    copyingDoorstopText.value = false;
}

onMounted(() => {
    GameRunnerProvider.instance.getGameArguments(
        store.state.activeGame,
        store.getters['profile/activeProfile']
    ).then(target => {
        if (target instanceof R2Error) {
            doorstopTarget.value = "";
            return;
        } else {
            doorstopTarget.value = target;
        }
    });
});
</script>

<style lang="scss" scoped>
#help-view {
    width: 100%;
}
</style>
