import EventEmitter from "events";
import { getStore } from "src/providers/generic/store/StoreProvider";
import ProfileModList from "src/r2mm/mods/ProfileModList";
import { State } from "src/store";
import { PartialConfigurationFile } from "src/utils/ConfigUtils";
import { onMounted, onUnmounted, ref } from "vue";

// Keep in sync with {@link src-electon/preload/config-editor-preload.ts}
export const RECEIVE_CONFIG_FILE_EVENT_KEY = 'receive-config-file'

let _composableId = 1;

export function useConfigSelectionComposable() {

    const store = getStore<State>();

    let id = _composableId++;
    let version = 1;
    const emitter = new EventEmitter();

    const partialConfigFiles = ref<PartialConfigurationFile[]>([]);

    function hookStreamConfigFiles(hook: (file: PartialConfigurationFile) => void) {
        function internalHook(responseVersion: number, file: PartialConfigurationFile) {
            if (version === responseVersion) {
                hook(file);
            }
        }

        emitter.addListener(`${RECEIVE_CONFIG_FILE_EVENT_KEY}::${id}`, internalHook);

        function unhookStreamConfigFileEvent() {
            emitter.removeListener(`${RECEIVE_CONFIG_FILE_EVENT_KEY}::${id}`, hook);
        }

        return {
            unhookStreamConfigFileEvent
        }
    }

    function loadConfigFiles() {
        const v = ++version;
        partialConfigFiles.value = [];
        window.configEditor.fetchAllConfigFiles(id, version, store.state.profile.activeProfile.getProfilePath(), file => {
            emitter.emit(`${RECEIVE_CONFIG_FILE_EVENT_KEY}::${id}`, v, file);
        });
    }

    const { unhookStreamConfigFileEvent } = hookStreamConfigFiles(file => {
        const isExt = ProfileModList.SUPPORTED_CONFIG_FILE_EXTENSIONS.some(ext => file.filename.endsWith(ext.toLowerCase()));
        // TODO - Only remove when `BepInEx/plugins`
        if (file.filename.toLowerCase() === 'manifest.json') {
            return;
        }
        if (file.relative.startsWith('_state') || file.relative.startsWith('dotnet')) {
            return;
        }
        if (file.relative === file.filename) {
            return;
        }
        if (isExt) {
            partialConfigFiles.value.push(file);
        }
        if (file.filename.toLowerCase().endsWith('ue4ss-settings.ini')) {
            partialConfigFiles.value.push({
                filename: 'UE4SS-settings.ini',
                path: file.path,
                relative: file.relative,
            });
        }
    });

    onUnmounted(() => {
        unhookStreamConfigFileEvent
    })

    return {
        partialConfigFiles,
        loadConfigFiles,
        unhookStreamConfigFileEvent
    }

}
