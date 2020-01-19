<template>
    <div>
        <hero title='Config editor' subtitle='Make changes to your configuration files' heroType='is-info' />
        <div class='notification is-warning'>
            <p>Configuration files are generated after launching the game, with the mod installed, at least once.</p>
        </div>
        <div class='columns'>
            <div class='column is-full'>
                <article class='media'>
                    <div class='media-content'>
                        <div class='content'>
                            <div v-for='(file, index) in configFiles' :key="`config-file-${file.name}`">
                                <expandable-card
                                    :id="index"
                                    :visible="false">
                                        <template v-slot:title>
                                            <p>{{file.name}}</p>
                                        </template>
                                        <a class='card-footer-item'>Edit Config</a>
                                        <a class='card-footer-item'>Delete</a>
                                </expandable-card>
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
export default class Profiles extends Vue {
    
    private configFiles: ConfigFile[] = [];
    private loadedFile: string = '';
    private fileText: string = '';

    created() {
        const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
        if (fs.pathExistsSync(configLocation)) {
            const files: string[] = fs.readdirSync(configLocation);
            files.forEach((file: string) => {
                console.log(file);
                console.log(path.extname(file).toLowerCase())
                if (path.extname(file).toLowerCase() === '.cfg') {
                    this.configFiles.push(new ConfigFile(file.substring(0, file.length - 4), path.join(configLocation, file)));
                }
            })
        } else {
            this.configFiles.push(new ConfigFile('no files found', ''));
        }
    }

}
</script>
