<template>
    <div>
        <Hero
            title="Config editor"
            subtitle="Select a configuration file to edit"
            hero-type="is-info"
        />
        <div class="notification is-warning is-square">
            <div class="container">
                <p>
                    Configuration files are generated after launching the game, with the mod installed, at least once.
                </p>
            </div>
        </div>
        <div class='card is-shadowless'>
            <div class='card-header-title'>

                <div class="input-group input-group--flex margin-right">
                    <label for="local-search" class="non-selectable">Search</label>
                    <input id="local-search" v-model='filterText' class="input margin-right" type="text" placeholder="Search for config files"/>
                </div>

                <div class="input-group margin-right">
                    <label for="config-sort-order" class="non-selectable">Sort</label>
                    <select id="config-sort-order" class="select select--content-spacing" v-model="sortOrder">
                        <option v-for="(key, index) in getSortOrderOptions()" :key="`${index}-deprecated-position-option`">
                            {{key}}
                        </option>
                    </select>
                    <span>&nbsp;</span>
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
                    :id="index"
                    :visible="false">
                    <template v-slot:title>
                        <span>{{file.name}}</span>
                    </template>
                    <a class='card-footer-item' @click="editConfig(file)">Edit Config</a>
                    <a class='card-footer-item' @click="deleteConfig(file)">Delete</a>
                </ExpandableCard>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import { Component, Vue, Watch } from 'vue-property-decorator';
    import ConfigFile from '../../model/file/ConfigFile';
    import Profile from '../../model/Profile';
    import * as path from 'path';
    import BepInExTree from '../../model/file/BepInExTree';
    import R2Error from '../../model/errors/R2Error';
    import { ExpandableCard, Hero } from '../all';
    import { SortConfigFile } from '../../model/real_enums/sort/SortConfigFile';
    import { SortDirection } from '../../model/real_enums/sort/SortDirection';
    import ConfigSort from '../../r2mm/configs/ConfigSort';
    import FsProvider from '../../providers/generic/file/FsProvider';
    import ManagerInformation from '../../_managerinf/ManagerInformation';

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
            this.shownConfigFiles = this.configFiles.filter((conf: ConfigFile) => conf.getName().toLowerCase().match(this.filterText.toLowerCase()));
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
            const configLocation = path.join(Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "config");
            const bepInExTree = await BepInExTree.buildFromLocation(configLocation);
            if (bepInExTree instanceof R2Error) {
                return;
            }
            for (const file of bepInExTree.getRecursiveFiles()) {
                if (path.extname(file).toLowerCase() === '.cfg' || path.extname(file).toLowerCase() === '.txt' || path.extname(file).toLowerCase() === '.xml') {
                    const fileStat = await fs.lstat(file);
                    this.configFiles.push(new ConfigFile(file.substring(configLocation.length + 1, file.length - 4), file, fileStat.mtime));
                } else if (path.extname(file).toLowerCase() === '.json') {
                    const fileStat = await fs.lstat(file);
                    this.configFiles.push(new ConfigFile(file.substring(configLocation.length + 1, file.length - 5), file, fileStat.mtime));
                }
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
                this.$emit("error", new R2Error(
                    "Failed to delete config file",
                    e.message,
                    `Try running ${ManagerInformation.APP_NAME} as an administrator.`
                ));
            }
        }

        editConfig(file: ConfigFile) {
            this.$emit("edit", file);
        }

    }

</script>
