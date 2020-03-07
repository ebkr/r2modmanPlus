<template>
    <div>
        <hero title='Config editor' subtitle='Make changes to your configuration files' heroType='is-info' />
        <div class='notification is-warning'>
            <p class='container'>Configuration files are generated after launching the game, with the mod installed, at least once.</p>
        </div>
        <div class='columns'>
            <div class='column is-full'>
                <article class='media'>
                    <div class='media-content'>
                        <div class='content'>
                            <div class='container' v-if="editing === false">
                                <div>
                                    <i class='fas fa-long-arrow-alt-left margin-right'/>
                                    <strong><a @click="backToManager()">Go back</a></strong>
                                    <br/><br/>
                                </div>
                                <div v-for='(file, index) in configFiles' :key="`config-file-${file.name}`">
                                    <expandable-card
                                        :id="index"
                                        :visible="false">
                                            <template v-slot:title>
                                                <span>{{file.name}}</span>
                                            </template>
                                            <a class='card-footer-item' @click="editFile(file.name)">Edit Config</a>
                                            <a class='card-footer-item' @click="deleteConfig(file.name)">Delete</a>
                                    </expandable-card>
                                </div>
                            </div>
                            <div class='container' v-else>
                                <div>
                                    <div class='sticky-top sticky-top--buttons'>
                                        <button class='button is-info' @click="saveChanges()">Save changes</button>
                                        <button class='button is-danger' @click="editing = false;">Cancel</button>
                                        <button class='button has-tooltip-bottom' @click="switchVariableListMode()" v-if='variableListMode' data-tooltip='Changes will be discarded'>Full view</button>
                                        <button class='button has-tooltip-bottom' @click="switchVariableListMode()" v-else-if='!variableListMode' data-tooltip='Changes will be discarded'>List view</button>
                                    </div>
                                    <br/>
                                    <h4 class='title is-4'>{{loadedFile}}</h4>
                                    <pre id='editor' v-if="!variableListMode" contenteditable>{{fileText}}</pre>
                                    <div v-else>
                                        <h5 class='subtitle is-5'>Sections</h5>
                                        <ul>
                                            <li v-for='(_, key) in variables' :key="`section-link-${key}`">
                                                <a :href="`#section-${key}`">{{key}}</a>
                                            </li>
                                        </ul>
                                        <hr/>
                                        <div v-for='(vars, key) in variables' :key="`section-${key}`">
                                            <br/>
                                            <h5 :id="`section-${key}`" class='subtitle is-5 sticky-top'>[{{key}}]</h5>
                                            <div v-for='(varValue, varName) in vars' :key="`vars-${varName}`">
                                                <div class='field has-addons'>
                                                    <div class='control is-expanded'>
                                                        <input class='input' type='text' :value="varName" width="250" disabled readonly/>
                                                    </div>
                                                    <div class='control is-expanded'>
                                                        <input :id="`${key}-${varName}`" class='input' type='text' :value="varValue" @change="updateVariableText(key, varName, this)"/>
                                                    </div>
                                                    <hr class='hr'/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, ExpandableCard } from '../components/all';

import Profile from 'src/model/Profile';
import ConfigFile from 'src/model/file/ConfigFile';

import { Logger, LogSeverity } from 'src/r2mm/logging/Logger';

import * as fs from 'fs-extra';
import * as path from 'path';
import BepInExTree from '../model/file/BepInExTree';
import R2Error from '../model/errors/R2Error';

@Component({
    components: {
        'hero': Hero,
        'expandable-card': ExpandableCard,
    }
})
export default class ConfigEditor extends Vue {
    
    private configFiles: ConfigFile[] = [];
    private loadedFile: string = '';
    private fileText: string = '';

    private editing: boolean = false;
    private variableListMode: boolean = true;
    private variables: {[section: string]:{[variable: string]: string}} = {};

    editFile(fileName: string) {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        this.loadedFile = fileName;
        this.fileText = fs.readFileSync(path.join(configLocation, `${fileName}.cfg`)).toString();

        // Find all variables offered within config script.
        this.variables = {};
        let section = 'root';
        this.fileText.split('\n').forEach((line: string) => {
            if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                section = line.trim().substring(1, line.trim().length - 1);
                this.variables[section] = {};
            } else if (!line.trim().startsWith('#') && line.search('=') > 0) {
                const sides = line.split('=');
                this.variables[section][sides[0].trim()] = sides[1].trim();
            }
        });
        this.editing = true;
    }

    saveChanges() {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        if (!this.variableListMode) {
            const updated: HTMLElement | null = document.getElementById('editor');
            if (updated instanceof HTMLElement) {
                fs.writeFileSync(path.join(configLocation, `${this.loadedFile}.cfg`), updated.innerText);
            }
        } else {
            let builtString = '';
            let section = 'root';
            this.fileText.split('\n').forEach((line: string) => {
                if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                    section = line.trim().substring(1, line.trim().length - 1);
                    builtString += line + '\n';
                } else if (!line.trim().startsWith('#') && line.search('=') > 0) {
                    const sides = line.split('=');
                    builtString += `${sides[0].trim()} = ${this.variables[section][sides[0].trim()]}\n`;
                } else {
                    builtString += line + '\n';
                }
            });
            fs.writeFileSync(path.join(configLocation, `${this.loadedFile}.cfg`), builtString);
        }
        this.editing = false;
    }

    backToManager() {
        this.$router.push('/manager');
    }

    switchVariableListMode() {
        this.variableListMode = !this.variableListMode;
    }

    updateVariableText(section: string, variable: string) {
        const element: HTMLElement | null = document.getElementById(`${section}-${variable}`);
        if (element instanceof HTMLElement) {
            const inputField = element as HTMLInputElement;
            this.variables[section][variable] = inputField.value;
        }
    }

    deleteConfig(fileName: string) {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        const filePath: string = path.join(configLocation, `${fileName}.cfg`);
        fs.removeSync(filePath);
        this.configFiles = this.configFiles.filter(file => file.getName() !== fileName);
    }

    created() {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        if (fs.pathExistsSync(configLocation)) {
            const tree: BepInExTree | R2Error = BepInExTree.buildFromLocation(configLocation);
            if (tree instanceof BepInExTree) {
                tree.getRecursiveFiles().forEach(file => {
                    if (path.extname(file).toLowerCase() === '.cfg') {
                        this.configFiles.push(new ConfigFile(file.substring(configLocation.length + 1, file.length - 4), file));
                    }
                });
            } else {
                Logger.Log(LogSeverity.ACTION_STOPPED, `${tree.name}\n-> ${tree.message}`);
            }
        }
    }

}
</script>
