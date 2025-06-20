<template>
	<div>
		<Hero :title="`Getting started on ${platformName}`" subtitle="Let's configure the game properly" heroType="warning" />
		<br/>
		<div class="container">
			To be able to launch {{ activeGame }} on Linux, you must first setup your Steam launch options correctly.<br/>
			This needs to be done because of how the BepInEx injection works on Unix systems.<br/>
			<br/>
			Please copy and paste the following to your {{ activeGame }} launch options:<br/>
			<code id="copyableArgs">{{ ComputedWrapperLaunchArguments }}</code>
			<br/>
			<br/>
			<a id="copy-action" class="button margin-right margin-right--half-width" @click="copy">Copy to clipboard</a>
			<a class="button is-info" @click="acknowledge">Continue</a>
		</div>
	</div>
</template>

<script lang='ts' setup>
import { Hero } from '../components/all';
import { computed } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import { useRouter } from 'vue-router';
import { ComputedWrapperLaunchArguments } from '../components/computed/WrapperArguments';
import InteractionProviderImpl from '../r2mm/system/InteractionProviderImpl';

const store = getStore<State>();
let router = useRouter();

const activeGame = computed(() => store.state.activeGame.displayName);
const platformName = computed<string>(() => process.platform === 'darwin' ? 'macOS' : process.platform);

function copy(){
    let range = document.createRange();
    range.selectNode(document.getElementById('copyableArgs') as Node);
    const selection = window.getSelection();
    if(selection !== null) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
    InteractionProviderImpl.instance.copyToClipboard(ComputedWrapperLaunchArguments.value);
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
