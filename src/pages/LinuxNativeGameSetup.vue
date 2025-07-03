<template>
	<div>
		<Hero :title="`Getting started on ${platformName}`" subtitle="Let's configure the game properly" heroType="warning" />
		<br/>
		<div class="container">
			To be able to launch {{ activeGame }} on Linux, you must first setup your Steam launch options correctly.<br/>
			This needs to be done because of how the BepInEx injection works on Unix systems.<br/>
			<br/>
			Please copy and paste the following to your {{ activeGame }} launch options:<br/>
			<code ref="copyableArgs">{{ launchArgs }} %command%</code>
			<br/>
			<br/>
			<a id="copy-action" class="button margin-right margin-right--half-width" @click="copy">Copy to clipboard</a>
			<a class="button is-info" @click="acknowledge">Continue</a>
		</div>
	</div>
</template>

<script lang='ts' setup>
import PathResolver from '../r2mm/manager/PathResolver';
import { Hero } from '../components/all';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import VueRouter from 'vue-router';
import path from '../providers/node/path/path';
import InteractionProviderImpl from "src/r2mm/system/InteractionProviderImpl";

const store = getStore<State>();
let router!: VueRouter;

onMounted(() => {
    router = getCurrentInstance()!.proxy.$router;
})

const copyableArgs = ref<HTMLInputElement>();

const activeGame = computed(() => store.state.activeGame.displayName);
const launchArgs = computed(() => `"${path.join(PathResolver.MOD_ROOT, process.platform === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh')}"`);
const platformName = computed<string>(() => process.platform === 'darwin' ? 'macOS' : process.platform);

function copy(){
    let range = document.createRange();
    range.selectNode(copyableArgs.value as Node);
    const selection = window.getSelection();
    if(selection !== null) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
    InteractionProviderImpl.instance.copyToClipboard(launchArgs.value);
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
