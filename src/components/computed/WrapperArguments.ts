import {computed} from "vue";
import path from "../../providers/node/path/path";
import PathResolver from "../../r2mm/manager/PathResolver";
import appWindow from '../../providers/node/app/app_window';

export const ComputedWrapperLaunchArguments = computed(() => `"${path.join(PathResolver.MOD_ROOT, appWindow.getPlatform() === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh')}" %command%`);
