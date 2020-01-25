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
                                <div v-if="view !== 'main'">
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
                                            <a class='card-footer-item'>Delete</a>
                                    </expandable-card>
                                </div>
                            </div>
                            <div class='container' v-else>
                                <div>
                                    <p><strong>{{loadedFile}}</strong></p>
                                    <div class='sticky-top'>
                                        <button class='button is-info' @click="saveChanges()">Save changes</button>
                                        <button class='button is-danger' @click="editing = false;">Cancel</button>
                                    </div>
                                    <pre id='editor' contenteditable>{{fileText}}</pre>
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

import Profile from 'src/model/Profile'
import ConfigFile from 'src/model/file/ConfigFile'

import * as fs from 'fs-extra';
import * as path from 'path';

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

    editFile(fileName: string) {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        this.loadedFile = fileName;
        this.fileText = fs.readFileSync(path.join(configLocation, `${fileName}.cfg`)).toString();
        this.editing = true;
    }

    saveChanges() {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        const updated: HTMLElement | null = document.getElementById('editor');
        if (updated instanceof HTMLElement) {
            fs.writeFileSync(path.join(configLocation, `${this.loadedFile}.cfg`), updated.innerText);
        }
        this.editing = false;
    }

    backToManager() {
        this.$router.back();
    }

    created() {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        if (fs.pathExistsSync(configLocation)) {
            const files: string[] = fs.readdirSync(configLocation);
            files.forEach((file: string) => {
                if (path.extname(file).toLowerCase() === '.cfg') {
                    this.configFiles.push(new ConfigFile(file.substring(0, file.length - 4), path.join(configLocation, file)));
                }
            })
        }
    }

}
</script>
