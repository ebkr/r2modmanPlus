<template>
	<div>
		<hero title="Getting started on Linux" subtitle="Let's configure the game properly" heroType="is-info" />
		<br/>
		<div class="container">
			To be able to launch Risk of Rain 2 on Linux, you must first setup your Steam launch options correctly.<br/>
			This needs to be done because of how Steam Proton works.<br/>
			<br/>
			Please copy and paste the following to your Risk of Rain 2 launch options:<br/>
			<code ref="launchargs">WINEDLLOVERRIDES="winhttp=n,b" %command%</code>
			<br/>
			<br/>
			<a ref="copy" class="button" @click="copy">Copy to clipboard</a>&nbsp;
			<a class="button is-info" @click="acknowledge">Continue</a><br/><br/>
			<b>Warning: Make sure to do what's written here.<br/>
			This message won't show again!</b>
		</div>
	</div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import { Hero } from '../components/all';
import ManagerSettings from '../r2mm/manager/ManagerSettings';

@Component({
    components: {
        'hero': Hero
    }
})
export default class LinuxFirstTimeSetup extends Vue {

	private copy(){
		let range = document.createRange();
		range.selectNode(this.$refs.launchargs as Node);
		window.getSelection()?.removeAllRanges();
		window.getSelection()?.addRange(range);
		document.execCommand("copy");
		(this.$refs.copy as Element).innerHTML = "Copied!";
		setTimeout(() => {
			(this.$refs.copy as Element).innerHTML = "Copy to clipboard";
		}, 2000);
	}

	private async acknowledge(){
		const settings = await ManagerSettings.getSingleton();
		if (!settings.linuxSetupAcknowledged) {
			settings.setLinuxSetupAcknowledged(true);
			this.$router.push({path: "/profiles"});
		} else
			this.$router.push({path: "/manager"});
	}

}
</script>