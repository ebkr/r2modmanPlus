<template>
    <div>
        <Hero
            :title="$t('config.selection.title')"
            :subtitle="$t('config.selection.subtitle')"
            hero-type="is-info"
        />
        <div class="notification is-warning is-square">
            <div class="container">
                <p>
                    {{ $t('config.selection.notification') }}
                </p>
            </div>
        </div>
        <div class='is-shadowless'>
            <div class='no-padding-left card-header-title'>

                <div class="input-group input-group--flex margin-right">
                    <label for="local-search" class="non-selectable">{{ $t('config.selection.search') }}</label>
                    <input id="local-search" v-model='filterText' class="input margin-right" type="text" :placeholder="$t('config.selection.searchPH')"/>
                </div>

                <div class="input-group margin-right">
                    <label for="config-sort-order" class="non-selectable">{{ $t('config.selection.sort') }}</label>
                    <select id="config-sort-order" class="select select--content-spacing margin-right margin-right--half-width" v-model="sortOrder">
                        <option v-for="(key, index) in getSortOrderOptions()" :key="`${index}-deprecated-position-option`" :value="key">
                            {{ $t(`config.selection.SortConfigFile.${key}`) }}
                        </option>
                    </select>
                    <select id="config-sort-direction" class="select select--content-spacing" v-model="sortDirection">
                        <option v-for="(key, index) in getSortDirectionOptions()" :key="`${index}-deprecated-position-option`" :value="key">
                            {{ $t(`config.selection.SortDirection.${key}`) }}
                        </option>
                    </select>
                </div>

            </div>
        </div>
        <div class="margin-right">
            <div v-for="(file, index) in sortedConfigFiles" :key="`config-file-${file.getName()}`">
                <ExpandableCard
                    :id="index"
                    :visible="false">
                    <template v-slot:title>
                        <span>{{file.getName()}}</span>
                    </template>
                    <a class='card-footer-item' @click="editConfig(file)">{{ $t('config.selection.edit') }}</a>
                    <a class='card-footer-item' @click="openConfig(file)">{{ $t('config.selection.open') }}</a>
                    <a class='card-footer-item' @click="deleteConfig(file)">{{ $t('config.selection.delete') }}</a>
                </ExpandableCard>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator';
import ConfigFile from '../../model/file/ConfigFile';
import * as path from 'path';
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

@Component({
        components: {
            Hero,
            ExpandableCard,
        }
    })
    export default class ConfigSelectionLayout extends Vue {

        private configFiles: ConfigFile[] = [];
        private shownConfigFiles: ConfigFile[] = [];

        private filterText: string = '';
        private sortOrder: SortConfigFile = SortConfigFile.NAME;
        private sortDirection: SortDirection = SortDirection.STANDARD;

        @Watch('filterText')
        textChanged() {
            this.shownConfigFiles = this.configFiles.filter((conf: ConfigFile) => conf.getName().toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0);
        }

        getSortOrderOptions() {
            return Object.values(SortConfigFile);
        }

        getSortDirectionOptions() {
            return Object.values(SortDirection);
        }

        get sortedConfigFiles(): ConfigFile[] {
            return ConfigSort.sort(this.shownConfigFiles, this.sortOrder, this.sortDirection);
        }

        async created() {
            const fs = FsProvider.instance;
            const configLocation = this.$store.getters['profile/activeProfile'].getPathOfProfile();
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
                    this.configFiles.push(new ConfigFile(file.substring(configLocation.length + 1), file, fileStat.mtime));
                }
            }

            // HACK: Force the UE4SS-settings.ini file for shimloader mod installs to be visible.
            const ue4ssSettingsPath = tree.getFiles().find(x => x.toLowerCase().endsWith("ue4ss-settings.ini"));
            if (ue4ssSettingsPath) {
                const lstat = await fs.lstat(ue4ssSettingsPath);
                this.configFiles.push(new ConfigFile("UE4SS-settings.ini", ue4ssSettingsPath, lstat.mtime));
            }

            this.shownConfigFiles = [...this.configFiles];
        }

        async deleteConfig(file: ConfigFile) {
            const fs = FsProvider.instance;
            try {
                await fs.unlink(file.getPath());
                this.configFiles = this.configFiles.filter(value => value.getName() !== file.getName());
                this.textChanged();
            } catch (e) {
                this.$store.commit("error/handleError", R2Error.fromThrownValue(
                    e,
                    this.$t('config.selection.failed'),
                    this.$t('config.selection.try',{ appName: ManagerInformation.APP_NAME })
                ));
            }
        }

        editConfig(file: ConfigFile) {
            this.$emit("edit", file);
        }

        openConfig(file: ConfigFile) {
            LinkProvider.instance.openLink(file.getPath());
        }

    }

</script>
