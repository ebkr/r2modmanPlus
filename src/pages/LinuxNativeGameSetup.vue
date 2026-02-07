<template>
	<div>
		<Hero :title="`Getting started on ${platformName}`" subtitle="Let's configure the game properly" heroType="primary" />
		<br/>
        <div class="container margin-bottom" v-if="alreadyHadValuesSet && isFlatpak">
            <div class="notification is-warning">
                <p>It looks like you've previously set launch arguments.</p>
                <p>The Flatpak version of {{ appName }} now uses a different wrapper script.</p>
                <p>You must update your launch arguments to support this.</p>
            </div>
        </div>
		<div class="container">
			To be able to launch {{ activeGame.displayName }} on {{ platformName }}, you must first setup your Steam launch options correctly.<br/>
			This needs to be done because of how the BepInEx injection works on Unix systems.<br/>
			<br/>
			Please copy and paste the following to your {{ activeGame.displayName }} launch options:<br/>
			<code id="copyableArgs">{{ finalArgs }}</code>
			<br/>
			<br/>
			<a id="copy-action" class="button margin-right margin-right--half-width" @click="copy">Copy to clipboard</a>
			<a class="button is-info" @click="acknowledge">Continue</a>
		</div>
	</div>
</template>

<script lang='ts' setup>
import {Hero} from '../components/all';
import {computed, ref} from 'vue';
import {getStore} from '../providers/generic/store/StoreProvider';
import {State} from '../store';
import {useRouter} from 'vue-router';
import {ComputedWrapperLaunchArguments, WineDllOverridesValue} from '../components/computed/WrapperArguments';
import InteractionProviderImpl from '../r2mm/system/InteractionProviderImpl';
import appWindow from '../providers/node/app/app_window';
import {
    areAnyWrapperArgumentsProvided,
    isManagerRunningOnFlatpak
} from '../utils/LaunchUtils';
import ManagerInformation from "../_managerinf/ManagerInformation";

const store = getStore<State>();
let router = useRouter();

const appName = computed(() => ManagerInformation.APP_NAME);
const activeGame = computed(() => store.state.activeGame);
const platformName = computed<string>(() => appWindow.getPlatform() === 'darwin' ? 'macOS' : appWindow.getPlatform());

const finalArgs = computed(() => {
    let result = '';
    if (WineDllOverridesValue.value) {
        // Using env to set environment variables is needed for Steam on MacOS compatibility.
        result = `/usr/bin/env ${WineDllOverridesValue.value} `;
    }
    return result + ComputedWrapperLaunchArguments.value;
});

const alreadyHadValuesSet = ref<boolean>(false);
areAnyWrapperArgumentsProvided(activeGame.value).then(value => alreadyHadValuesSet.value = value);

const isFlatpak = ref<boolean>(false);
isManagerRunningOnFlatpak().then(value => isFlatpak.value = value);

function copy(){
    let range = document.createRange();
    range.selectNode(document.getElementById('copyableArgs') as Node);
    const selection = window.getSelection();
    if(selection !== null) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
    InteractionProviderImpl.instance.copyToClipboard(finalArgs.value);
    document.getElementById('copy-action')!.innerHTML = 'Copied!';
    setTimeout(() => {
        const element = document.getElementById('copy-action');
        if (element) {
            element.innerHTML = 'Copy to clipboard';
        }
    }, 2000);
}

async function acknowledge(){
    router.push({path: "/profiles"});
}
</script>
