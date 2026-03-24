<template>
	<div>
		<Hero :title="`Getting started on ${platformName}`" subtitle="Let's configure the game properly" heroType="primary" />
		<br/>
        <div class="container margin-bottom" v-if="alreadyHadValuesSet && isFlatpak">
            <div class="notification is-warning">
                <p>{{ $t('LinuxNativeGameSetup.it_looks_like_you_ve_previousl') }}</p>
                <p>{{ $t('LinuxNativeGameSetup.the_flatpak_version_of') }} {{ appName }} {{ $t('LinuxNativeGameSetup.now_uses_a_different_wrapper_s') }}</p>
                <p>{{ $t('LinuxNativeGameSetup.you_must_update_your_launch_ar') }}</p>
            </div>
        </div>
		<div class="container"> {{ $t('LinuxNativeGameSetup.to_be_able_to_launch') }} {{ activeGame.displayName }} {{ $t('LinuxNativeGameSetup.on_linux_you_must_first_setup') }}<br/>
			{{ $t('LinuxNativeGameSetup.this_needs_to_be_done_because') }}<br/>
			<br/> {{ $t('LinuxNativeGameSetup.please_copy_and_paste_the_foll') }} {{ activeGame.displayName }} {{ $t('LinuxNativeGameSetup.launch_options') }}<br/>
			<code id="copyableArgs">{{ finalArgs }}</code>
			<br/>
			<br/>
			<a id="copy-action" class="button margin-right margin-right--half-width" @click="copy">{{ $t('LinuxNativeGameSetup.copy_to_clipboard') }}</a>
			<a class="button is-info" @click="acknowledge">{{ $t('LinuxNativeGameSetup.continue') }}</a>
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
        result = `${WineDllOverridesValue.value} `;
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
