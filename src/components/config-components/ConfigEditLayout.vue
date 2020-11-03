<template>
    <div>
        <Hero
            :title="configFile.getName()"
            subtitle="Editing config file"
            hero-type="is-info"
        />
        <br/>
        <div class="sticky-top sticky-top--buttons margin-right">
            <button class="button is-info" @click="save">Save</button>
            &nbsp;
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
                    <div class="container">
                        <h4 :id="key" class='subtitle is-4'>{{ key }}</h4>
                    </div>
                </div>
                <div class="panel-block is-block settings-panel" v-for="(line, variable) in value" :key="`${configFile.getName()}-${key}-${variable}-${line.commentsExpanded}`">
                    <div class="settings-panel__content">
                        <p class="title is-6 is-marginless selectable">{{variable}}</p>
                        <p class="subtitle is-italic is-bold is-6 is-marginless">
                            <template v-if="getCommentDisplay(line.comments).split('\n').length > 4">
                                <span class="pre selectable" v-if="!line.commentsExpanded">{{getCommentDisplayShort(line.comments)}}</span>
                                <span class="pre selectable" v-else="!line.commentsExpanded">{{getCommentDisplay(line.comments)}}</span>
                                <a @click="toggleEntryExpansion(key, variable)">
                                    <span v-if="!line.commentsExpanded">Show more</span>
                                    <span v-else>Show less</span>
                                </a>
                            </template>
                            <span class="pre" v-else>{{getCommentDisplay(line.comments)}}</span>
                        </p>
                        <br/>
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
                <br/>
            </div>
        </div>
        <div class='container' v-else>
            <QuillEditor v-model="fileText" @input="updateFreeText"/>
        </div>
    </div>
</template>

<script lang="ts">

    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import ConfigLine from '../../model/file/ConfigLine';
    import * as fs from 'fs-extra';
    import ConfigFile from '../../model/file/ConfigFile';
    import Hero from '../Hero.vue';
    import QuillEditor from '../QuillEditor.vue';

    @Component({
        components: { Hero, QuillEditor }
    })
    export default class ConfigEditLayout extends Vue {

        @Prop({required: true})
        private configFile!: ConfigFile;

        private fileText: string = "";

        private dumpedConfigVariables: { [section: string]: { [variable: string]: ConfigLine } } = {};

        created() {
            this.fileText = fs.readFileSync(this.configFile.getPath()).toString();
            if (this.configFile.getPath().toLowerCase().endsWith(".cfg")) {
                // Find all variables offered within config script.
                this.dumpedConfigVariables = {};
                let section = 'root';
                let comments: string[] = [];
                const allowedValues: Set<String> = new Set();
                this.fileText.split('\n').forEach((line: string) => {
                    if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                        section = line.trim().substring(1, line.trim().length - 1);
                        this.dumpedConfigVariables[section] = {};
                        comments = [];
                    } else if (!line.trim().startsWith('#') && line.search('=') > 0) {
                        const sides = line.split('=');
                        const rightSide = sides.splice(1).join("=");
                        if (comments.find(value => value.trim().startsWith("# Setting type: Boolean"))) {
                            if (allowedValues.size === 0) {
                                allowedValues.add("true");
                                allowedValues.add("false");
                            }
                        }
                        const finalAcceptableValues: string[] = [];
                        allowedValues.forEach(value => {
                            finalAcceptableValues.push(value.toString());
                        })
                        this.dumpedConfigVariables[section][sides[0].trim()] = new ConfigLine(rightSide.trim(), comments, finalAcceptableValues);
                        comments = [];
                        allowedValues.clear();
                    } else if (line.trim().startsWith('#')) {
                        comments.push(line.trim());
                    }
                });
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

        saveCfg() {
            let builtString = '';
            let section = 'root';
            this.fileText.split('\n').forEach((line: string) => {
                if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                    section = line.trim().substring(1, line.trim().length - 1);
                    builtString += line + '\n';
                } else if (!line.trim().startsWith('#') && line.search('=') > 0) {
                    const sides = line.split('=');
                    builtString += `${sides[0].trim()} = ${this.dumpedConfigVariables[section][sides[0].trim()].value}\n`;
                } else {
                    builtString += line + '\n';
                }
            });
            fs.writeFileSync(this.configFile.getPath(), builtString.trim());
            window.scrollTo(0, 0);
            this.$emit("changed");
        }

        saveNonCfg() {
            fs.writeFileSync(this.configFile.getPath(), this.fileText);
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
                .replace(new RegExp("#+", "g"), "")
                .replace(new RegExp("\n\\s", "g"), "\n")
                .trim();
        }

        getCommentDisplayShort(comments: string[]): string {
            return comments.map(value => value.trim())
                .slice(0, 4)
                .join("\n")
                .replace(new RegExp("#+", "g"), "")
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


    }

</script>
