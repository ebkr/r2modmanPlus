<template>
    <div id="help-view">
        <Hero title="Help" subtitle="Common problems and their potential solutions" hero-type="primary"/>
        <div
            class="tabs sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding has-background-">
            <ul>
                <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                    :class="[{'is-active': activeTab === key}]"
                    @click="changeTab(key)">
                    <a>{{key}}</a>
                </li>
            </ul>
        </div>
        <div class="margin-right">
            <br/>
            <div ref="General" v-if="activeTab === 'General'">
                <h2 class="title is-5">Getting started with installing mods</h2>
                <p>
                    Go to the "Online" tab, find a mod, and hit download.
                    It'll also download the dependencies saving you time.
                </p>
                <p>Once you've installed the mods you'd like, just click <strong>Start modded</strong> in the top left.</p>
                <hr/>
                <h2 class='title is-5'>Slow game with mods / stuttering?</h2>
                <p>
                    This is likely due to a mod throwing errors.
                    One solution is to attempt to disable half of your mods and check to see if the issue persists.
                    <br/>
                    If the issue still remains then disable another half. Continue doing this until the issue is
                    solved.
                    <br/><br/>
                    In the case of stuttering there may be optimization mods to help with this.
                </p>
                <hr/>
                <h2 class='title is-5'>Dedicated servers</h2>
                <p>
                    Dedicated servers aren't directly supported through the manager however a solution is to instead
                    copy the contents of your profile folder into your dedicated server folder yourself.
                </p>
                <hr/>
                <h2 class='title is-5'>Launching the game from outside the mod manager</h2>
                <p>
                    By design your experience by starting the game through Steam will be vanilla (un-modded).
                    <br/><br/>
                    You will need to place the corresponding argument in your platform's relevant launch parameter area.
                    <br/>
                    For Steam, this would be located in the game's properties.
                    <br/><br/>
                    Your current argument would be:
                    <code v-if="doorstopTarget.length > 0">{{ doorstopTarget }}</code>
                    <code v-else>These parameters will be available after installing BepInEx.</code>
                    <br/>
                </p>
                <br/>
                <template v-if="doorstopTarget.length > 0">
                    <p>
                        <button class="button" @click="copyDoorstopTargetToClipboard" v-if="!copyingDoorstopText">
                            <i class="fas fa-clipboard"></i>
                            <span class="margin-left--half-width smaller-font">Copy launch arguments</span>
                        </button>
                        <button class="button is-loading" v-else>Copy launch arguments</button>
                    </p>
                    <br/>
                </template>
            </div>
            <div ref="Game won't start" v-if="activeTab === `Game won't start`">
                <h2 class='title is-5'>A red box appears when I try to start the game</h2>
                <p>Read the suggestion at the bottom of the red box.</p>
                <hr/>
                <h2 class='title is-5'>I'm taken to the Steam store page</h2>
                <p>That's because you don't legally own the game. The manager only supports legal copies.</p>
                <hr/>
                <h2 class='title is-5'>A text window appears and closes immediately.</h2>
                <p>Try running "Reset {{$store.state.activeGame.displayName}} installation" on the Settings screen.</p>
                <p>If it persists, force exit Steam and start modded with Steam closed.</p>
            </div>
            <div ref="Mods not appearing" v-if="activeTab === 'Mods not appearing'">
                <h2 class='title is-5'>Potential solutions</h2>
                <p>The most common issues are solved by following the instructions exactly as listed
                    <ExternalLink url="https://github.com/ebkr/r2modmanPlus/wiki/Why-aren't-my-mods-working%3F">
                        here
                    </ExternalLink>
                </p>
            </div>
            <div ref="Updating" v-if="activeTab === 'Updating'">
                <h2 class='title is-5'>Auto-updates</h2>
                <p>The manager updates automatically on close assuming an update is available.</p>
                <p>Updates are downloaded in the background.</p>
                <p>You may receive a prompt to run <i>old_uninstaller</i> as an admin. This is the updater.</p>
                <p>If a problem occurs with an update, download and run the latest installer.</p>
                <hr/>
                <h2 class='title is-5'>I don't want updates</h2>
                <p>
                    On GitHub there is a portable version that doesn't auto update. You are however prompted that an
                    update is available.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Hero, ExternalLink } from '../components/all';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import R2Error from '../model/errors/R2Error';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';
import { onMounted, ref } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';

const store = getStore<State>();

const activeTab = ref('General');
const tabs = ref(['General', 'Game won\'t start', 'Mods not appearing', 'Updating']);
const doorstopTarget = ref("");
const copyingDoorstopText = ref(false);

function changeTab(key: string) {
    activeTab.value = key;
}

function copyDoorstopTargetToClipboard() {
    InteractionProvider.instance.copyToClipboard(doorstopTarget.value);
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
