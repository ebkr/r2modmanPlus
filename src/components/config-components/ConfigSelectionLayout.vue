<template>
    <div>
        <Hero
            title="Config editor"
            subtitle="Select a configuration file to edit"
            hero-type="primary"
        />
        <div class="notification is-warning is-square">
            <div class="container">
                <p>
                    Configuration files are generated after launching the game, with the mod installed, at least once.
                </p>
            </div>
        </div>
        <div class='is-shadowless'>
            <div class='no-padding-left card-header-title'>

                <div class="input-group input-group--flex margin-right">
                    <label for="config-search" class="non-selectable">Search</label>
                    <input
                        v-model="filterText"
                        id="config-search"
                        class="input margin-right"
                        type="text"
                        placeholder="Search for config files"
                        autocomplete="off"
                    />
                </div>

                <div class="input-group margin-right">
                    <label for="config-sort-order" class="non-selectable">Sort</label>
                    <select id="config-sort-order" class="select select--content-spacing margin-right margin-right--half-width" v-model="sortOrder">
                        <option v-for="(key, index) in getSortOrderOptions()" :key="`${index}-deprecated-position-option`">
                            {{key}}
                        </option>
                    </select>
                    <select id="config-sort-direction" class="select select--content-spacing" v-model="sortDirection">
                        <option v-for="(key, index) in getSortDirectionOptions()" :key="`${index}-deprecated-position-option`">
                            {{key}}
                        </option>
                    </select>
                </div>

            </div>
        </div>
        <div class="margin-right">
            <div v-for="(file, index) in sortedConfigFiles" :key="`config-file-${file.getName()}`">
                <ExpandableCard
                    :id="`config-file-${index}`"
                    :visible="false">
                    <template v-slot:title>
                        <span>{{file.getName()}}</span>
                    </template>
                    <a class='card-footer-item' @click="editConfig(file)">Edit Config</a>
                    <a class='card-footer-item' @click="openConfig(file)">Open File</a>
                    <a class='card-footer-item' @click="deleteConfig(file)">Delete</a>
                </ExpandableCard>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ConfigFile from '../../model/file/ConfigFile';
import FileTree from '../../model/file/FileTree';
import R2Error from '../../model/errors/R2Error';
import { ExpandableCard, Hero } from '../all';
import { SortConfigFile } from '../../model/real_enums/sort/SortConfigFile';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import ConfigSort from '../../r2mm/configs/ConfigSort';
import FsProvider from '../../providers/generic/file/FsProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import LinkProvider from '../../providers/components/LinkProvider';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import { computed, onMounted, ref, watch } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import path from '../../providers/node/path/path';

const store = getStore<State>();

const emits = defineEmits<{
    (e: 'edit', file: ConfigFile): void;
}>()

const configFiles = ref<ConfigFile[]>([]);
const shownConfigFiles = ref<ConfigFile[]>([]);

const filterText = ref<string>('');
const sortOrder = ref<SortConfigFile>(SortConfigFile.NAME);
const sortDirection = ref<SortDirection>(SortDirection.STANDARD);

function updateShownConfigFiles(configFiles: ConfigFile[]) {
    shownConfigFiles.value = configFiles
        .filter((conf: ConfigFile) => conf.getName().toLowerCase().indexOf(filterText.value.toLowerCase()) >= 0);
}

watch(filterText, () => {
    updateShownConfigFiles(configFiles.value as ConfigFile[])
});

function getSortOrderOptions() {
    return Object.values(SortConfigFile);
}

function getSortDirectionOptions() {
    return Object.values(SortDirection);
}

const sortedConfigFiles = computed(() => {
    return ConfigSort.sort(shownConfigFiles.value as ConfigFile[], sortOrder.value, sortDirection.value);
});

onMounted(async () => {
    const fs = FsProvider.instance;
    const configLocation = store.getters['profile/activeProfile'].getProfilePath();
    const tree = await FileTree.buildFromLocation(configLocation);
    if (tree instanceof R2Error) {
        return;
    }
    tree.removeDirectories("dotnet");
    tree.removeDirectories("_state");
    tree.navigateAndPerform(plugins => {
        plugins.getDirectories().forEach(value => {
            plugins.navigateAndPerform(sub => {
                // Remove all manifest.json files from the root of the plugins subdirectory.
                sub.removeFilesWithBasename("manifest.json");
            }, value.getDirectoryName())
        });
    }, "BepInEx", "plugins");
    const files = tree.getDirectories().flatMap(value => value.getRecursiveFiles());
    const supportedExtensions = ProfileModList.SUPPORTED_CONFIG_FILE_EXTENSIONS;
    for (const file of files) {
        if (supportedExtensions.includes(path.extname(file).toLowerCase())) {
            const fileStat = await fs.lstat(file);
            configFiles.value.push(new ConfigFile(file.substring(configLocation.length + 1), file, fileStat.mtime));
        }
    }

    // HACK: Force the UE4SS-settings.ini file for shimloader mod installs to be visible.
    const ue4ssSettingsPath = tree.getFiles().find(x => x.toLowerCase().endsWith("ue4ss-settings.ini"));
    if (ue4ssSettingsPath) {
        const lstat = await fs.lstat(ue4ssSettingsPath);
        configFiles.value.push(new ConfigFile("UE4SS-settings.ini", ue4ssSettingsPath, lstat.mtime));
    }

    shownConfigFiles.value = [...configFiles.value];
});

async function deleteConfig(file: ConfigFile) {
    const fs = FsProvider.instance;
    try {
        await fs.unlink(file.getPath());
        configFiles.value = configFiles.value.filter(value => value.getName() !== file.getName());
        updateShownConfigFiles(configFiles.value as ConfigFile[]);
    } catch (e) {
        store.commit("error/handleError", R2Error.fromThrownValue(
            e,
            "Failed to delete config file",
            `Try running ${ManagerInformation.APP_NAME} as an administrator.`
        ));
    }
}

function editConfig(file: ConfigFile) {
    emits('edit', file);
}

function openConfig(file: ConfigFile) {
    LinkProvider.instance.openLink(file.getPath());
}

</script>
