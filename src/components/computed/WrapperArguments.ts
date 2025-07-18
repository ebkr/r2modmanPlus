import {computed} from "vue";
import path from "path";
import PathResolver from "../../r2mm/manager/PathResolver";

export const ComputedWrapperLaunchArguments = computed(() => `"${path.join(PathResolver.MOD_ROOT, process.platform === 'darwin' ? 'macos_proxy' : 'linux_wrapper.sh')}" %command%`);
