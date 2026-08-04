<template>
    <div id="setup-body">
		<Hero
			:title="t('translations.pages.linuxSetup.hero.title', { platformName })"
			:subtitle="t('translations.pages.linuxSetup.hero.subtitle')"
			heroType="primary"
		/>
		<br/>
        <div class="container margin-bottom" v-if="alreadyHadValuesSet && isFlatpak">
            <div class="notification is-warning">
                <p>{{ t('translations.pages.linuxSetup.flatpakWarning.existingArguments') }}</p>
                <p>{{ t('translations.pages.linuxSetup.flatpakWarning.notice', { appName }) }}</p>
                <p>{{ t('translations.pages.linuxSetup.flatpakWarning.mustUpdate') }}</p>
            </div>
        </div>
		<div class="container">
			{{ t('translations.pages.linuxSetup.instructions.intro', { gameName: activeGame.displayName }) }}<br/>
			{{ t('translations.pages.linuxSetup.instructions.whyNeeded') }}<br/>
			<br/>
			{{ t('translations.pages.linuxSetup.instructions.copyInstruction', { gameName: activeGame.displayName }) }}<br/>
			<code id="copyableArgs">{{ finalArgs }}</code>
			<br/>
			<br/>
			<a id="copy-action" class="button margin-right margin-right--half-width" @click="copy">
				{{ isCopied ? t('translations.pages.linuxSetup.actions.copied') : t('translations.pages.linuxSetup.actions.copy') }}
			</a>
			<a class="button is-info" @click="acknowledge">{{ t('translations.pages.linuxSetup.actions.continue') }}</a>
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
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
let router = useRouter();
const { t } = useI18n();

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

const isCopied = ref<boolean>(false);

function copy(){
    let range = document.createRange();
    range.selectNode(document.getElementById('copyableArgs') as Node);
    const selection = window.getSelection();
    if(selection !== null) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
    InteractionProviderImpl.instance.copyToClipboard(finalArgs.value);
    isCopied.value = true;
    setTimeout(() => {
        isCopied.value = false;
    }, 2000);
}

async function acknowledge(){
    router.push({path: "/profiles"});
}
</script>

<style lang="scss" scoped>
#setup-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
}
</style>
