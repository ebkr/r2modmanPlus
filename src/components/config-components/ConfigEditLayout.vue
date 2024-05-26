<template>
    <div>
        <Hero
            :title="configFile.getName()"
            subtitle="Editing config file"
            hero-type="is-info"
        />
        <br/>
        <div class="sticky-top sticky-top--buttons margin-right">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <div v-if="configFile.getPath().toLowerCase().endsWith('.cfg')" class="margin-right non-selectable">
            <h3 class='subtitle is-3'>Sections</h3>
            <ul>
                <li v-for="(value, key) in dumpedConfigVariables" :key="`${key}-${value.toString()}-tab`">
                    <a :href="`#${key}`">{{ key }}</a>
                </li>
            </ul>
            <br/>
            <div v-for="(value, key) in dumpedConfigVariables" :key="`${key}-${value.toString()}-tab`">
                <div class="notification is-grey-lighter sticky-top">
                    <h4 :id="key" class='subtitle is-4'>{{ key }}</h4>
                </div>
                <div class="panel-block is-block settings-panel" v-for="(line, variable) in value" :key="`${configFile.getName()}-${key}-${variable}-${line.commentsExpanded}`">
                    <div class="settings-panel__content">
                        <p class="title is-6 is-marginless selectable">{{variable}}</p>
                        <p class="subtitle is-italic is-bold is-6 is-marginless">
                            <template v-if="getCommentDisplay(line.comments).split('\n').length > 4">
                                <span class="pre selectable" v-if="!line.commentsExpanded">{{getCommentDisplayShort(line.comments)}}</span>
                                <span class="pre selectable" v-else>{{getCommentDisplay(line.comments)}}</span>
                                <a @click="toggleEntryExpansion(key, variable)">
                                    <span v-if="!line.commentsExpanded">Show more</span>
                                    <span v-else>Show less</span>
                                </a>
                            </template>
                            <span class="pre" v-else>{{getCommentDisplay(line.comments)}}</span>
                        </p>
                        <br/>
                        <div class='settings-input-container'>
                            <template v-if='line.hasRange'>
                                <input
                                    type="range"
                                    class="slider is-fullwidth is-circle is-small"
                                    v-on:input="e => setConfigLineValue(line, e.target.value)"
                                    :value="parseFloat(line.value)"
                                    :min="line.getMinRange()"
                                    :max="line.getMaxRange()" />
                            </template>
                            <template v-if="line.allowedValues.length > 0">
                                <select class="select select--full" v-model="line.value">
                                    <option v-for="(opt, index) in line.allowedValues" :key="`opt-${key}-${configFile.getName()}-${variable}-${index}`">
                                        {{opt}}
                                    </option>
                                </select>
                            </template>
                            <input class="input" v-model="line.value" v-else/>
                        </div>
                    </div>
                </div>
                <br/>
            </div>
        </div>
        <div class='container margin-right' v-else>
            <QuillEditor v-model="fileText" @input="updateFreeText"/>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import ConfigLine from '../../model/file/ConfigLine';
import FsProvider from '../../providers/generic/file/FsProvider';
import ConfigFile from '../../model/file/ConfigFile';
import Hero from '../Hero.vue';
import QuillEditor from '../QuillEditor.vue';
import BepInExConfigUtils from '../../utils/BepInExConfigUtils';

@Component({
        components: { Hero, QuillEditor }
    })
    export default class ConfigEditLayout extends Vue {

        @Prop({required: true})
        private configFile!: ConfigFile;

        private fileText: string = "";

        private dumpedConfigVariables: { [section: string]: { [variable: string]: ConfigLine } } = {};

        async created() {
            const fs = FsProvider.instance;
            this.fileText = (await fs.readFile(this.configFile.getPath())).toString();
            if (this.configFile.getPath().toLowerCase().endsWith(".cfg")) {
                const config = await BepInExConfigUtils.getBepInExConfigBreakdown(this.configFile.getPath());
                this.dumpedConfigVariables = config;
            }
            window.scrollTo(0, 0);
        }

        save() {
            if (this.configFile.getPath().toLowerCase().endsWith(".cfg")) {
                this.saveCfg();
            } else {
                this.saveNonCfg();
            }
        }

        async saveCfg() {
            await BepInExConfigUtils.updateBepInExConfigFile(this.configFile.getPath(), this.fileText, this.dumpedConfigVariables);
            window.scrollTo(0, 0);
            this.$emit("changed");
        }

        async saveNonCfg() {
            const fs = FsProvider.instance;
            await fs.writeFile(this.configFile.getPath(), this.fileText);
            window.scrollTo(0, 0);
            this.$emit("changed");
        }

        cancel() {
            window.scrollTo(0, 0);
            this.$emit("changed");
        }

        updateFreeText(text: string) {
            this.fileText = text;
        }

        getCommentDisplay(comments: string[]): string {
            return comments.map(value => value.trim())
                .join("\n")
                .trim()
                .replace(new RegExp("#+", "g"), "")
                .replace(new RegExp(";+", "g"), "")
                .replace(new RegExp("\n\\s", "g"), "\n")
                .trim();
        }

        getCommentDisplayShort(comments: string[]): string {
            return comments.map(value => value.trim())
                .slice(0, 4)
                .join("\n")
                .trim()
                .replace(new RegExp("#+", "g"), "")
                .replace(new RegExp(";+", "g"), "")
                .replace(new RegExp("\n\\s+", "g"), "\n")
                .trim();
        }

        toggleEntryExpansion(key: string, variable: string) {
            const oldLine = this.dumpedConfigVariables[key][variable];
            const newLine = new ConfigLine(oldLine.value, oldLine.comments, oldLine.allowedValues);
            newLine.commentsExpanded = !oldLine.commentsExpanded;
            this.dumpedConfigVariables[key][variable] = newLine;
            this.dumpedConfigVariables = JSON.parse(JSON.stringify(this.dumpedConfigVariables));
        }

        setConfigLineValue(line: ConfigLine, value: number) {
            line.value = value.toString();
        }

    }

</script>
