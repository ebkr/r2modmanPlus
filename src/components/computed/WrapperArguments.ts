import {computed, ref} from "vue";
import path from "../../providers/node/path/path";
import PathResolver from "../../r2mm/manager/PathResolver";
import appWindow from '../../providers/node/app/app_window';
import {isManagerRunningOnFlatpak} from "../../utils/LaunchUtils";
import {getStore} from "../../providers/generic/store/StoreProvider";
import {State} from "../../store";

const store = getStore<State>();

const activeGame = computed(() => store.state.activeGame);
const isFlatpakExecutable = ref<boolean>(false);
isManagerRunningOnFlatpak()
    .then(value => isFlatpakExecutable.value = value);

function determineWrapperArguments() {
    // Trigger a computed update
    // @ts-ignore
    const _ = activeGame.value;

    let wrapperPath = "";
    if (isFlatpakExecutable.value) {
        wrapperPath = `${path.join(PathResolver.MOD_ROOT, 'web_start_wrapper.sh')}`
    } else {
        wrapperPath = path.join(PathResolver.MOD_ROOT, appWindow.getPlatform() === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh');
    }
    return `"${wrapperPath}" %command%`;
}

export const ComputedWrapperLaunchArguments = computed(determineWrapperArguments);
export const WineDllOverridesValue = ref<string>(`WINEDLLOVERRIDES="winhttp,version=n,b"`);
