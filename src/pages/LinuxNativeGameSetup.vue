<template>
	<div>
		<hero :title="$t('pages.linux.title', {name: platformName})" :subtitle="$t('pages.help.subtitle')" heroType="is-warning" />
		<br/>
		<div class="container">
            {{ $t('pages.linux.tip1', { game: activeGame }) }}<br/>
            {{ $t('pages.linux.tip2') }}<br/>
			<br/>
            {{ $t('pages.linux.tip3', { game: activeGame }) }}<br/>
			<code ref="launchargs">{{ launchArgs }} %command%</code>
			<br/>
			<br/>
			<a ref="copy" class="button margin-right margin-right--half-width" @click="copy">{{ $t(`pages.linux.copyTo`) }}</a>
			<a class="button is-info" @click="acknowledge">{{ $t(`pages.linux.continue`) }}</a>
		</div>
	</div>
</template>

<script lang='ts'>
import PathResolver from '../r2mm/manager/PathResolver';
import { Component, Vue } from 'vue-property-decorator';
import { Hero } from '../components/all';
import * as path from 'path';

@Component({
    components: {
        'hero': Hero
    }
})
export default class LinuxFirstTimeSetup extends Vue {

	data() {
		return {
			activeGame: this.$store.state.activeGame.displayName,
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
		(this.$refs.copy as Element).innerHTML = this.$t('pages.linux.copied');
		setTimeout(() => {
			(this.$refs.copy as Element).innerHTML = this.$t('pages.linux.copyTo');
		}, 2000);
	}

	private async acknowledge(){
		this.$router.push({path: "/profiles"});
	}

}
</script>
