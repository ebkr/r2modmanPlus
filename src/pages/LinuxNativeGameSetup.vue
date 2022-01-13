<template>
	<div>
		<hero :title="`Getting started on ${platformName}`" subtitle="Let's configure the game properly" heroType="is-warning" />
		<br/>
		<div class="container">
			To be able to launch {{ activeGame }} on Linux, you must first setup your Steam launch options correctly.<br/>
			This needs to be done because of how the BepInEx injection works on Unix systems.<br/>
			<br/>
			Please copy and paste the following to your {{ activeGame }} launch options:<br/>
			<code ref="launchargs">{{ launchArgs }} %command%</code>
			<br/>
			<br/>
			<a ref="copy" class="button" @click="copy">Copy to clipboard</a>&nbsp;
			<a class="button is-info" @click="acknowledge">Continue</a>
		</div>
	</div>
</template>

<script lang='ts'>
import PathResolver from '../r2mm/manager/PathResolver';
import { Vue, Component } from 'vue-property-decorator';
import { Hero } from '../components/all';
import GameManager from '../model/game/GameManager';
import * as path from 'path';

@Component({
    components: {
        'hero': Hero
    }
})
export default class LinuxFirstTimeSetup extends Vue {

	data() {
		return {
			activeGame: GameManager.activeGame.displayName,
			launchArgs: `"${path.join(PathResolver.MOD_ROOT, process.platform === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh')}"`
		}
	}

    get platformName(): string {
        return process.platform === 'darwin' ? 'macOS' : process.platform
    }

	private copy(){
		let range = document.createRange();
		range.selectNode(this.$refs.launchargs as Node);
		const selection = window.getSelection();
		if(selection !== null) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
		document.execCommand("copy");
		(this.$refs.copy as Element).innerHTML = "Copied!";
		setTimeout(() => {
			(this.$refs.copy as Element).innerHTML = "Copy to clipboard";
		}, 2000);
	}

	private async acknowledge(){
		this.$router.push({path: "/profiles"});
	}

}
</script>
