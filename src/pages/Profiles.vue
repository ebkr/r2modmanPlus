<template>
    <div>
        <!-- Create modal -->
        <div :class="['modal', {'is-active':(addingProfile !== false)}]">
            <div class="modal-background" @click="closeNewProfileModal()"></div>
            <div class='modal-content'>
                 <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title'>Create a new profile</p>
                    </header>
                    <div class='card-content'>
                        <p>This profile will store its own mods independently from other profiles.</p>
                        <br/>
                        <input class='input' v-model='newProfileName'/>
                        <br/><br/>
                        <span class="tag is-dark" v-if="newProfileName === '' || makeProfileNameSafe(newProfileName) === ''">Profile name required</span>
                        <span class="tag is-success" v-else-if='!doesProfileExist(newProfileName)'>"{{makeProfileNameSafe(newProfileName)}}" is available</span>
                        <span class="tag is-danger" v-else-if='doesProfileExist(newProfileName)'>"{{makeProfileNameSafe(newProfileName)}}" is already in use</span>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="createProfile(newProfileName)">Create</button>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeNewProfileModal()"></button>
        </div>
        <!-- Delete modal -->
        <div :class="['modal', {'is-active':(removingProfile !== false)}]">
            <div class="modal-background" @click="closeRemoveProfileModal()"></div>
            <div class='modal-content'>
                 <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title'>Delete profile</p>
                    </header>
                    <div class='card-content'>
                        <p>This will remove all mods, and their config files, installed within this profile.</p>
                        <p>If this was an accident, click either the darkened area, or the cross inside located in the top right.</p>
                        <p>Are you sure you'd like to delete this profile?</p>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-danger" @click="removeProfileAfterConfirmation()">Delete profile</button>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeRemoveProfileModal()"></button>
        </div>
        <!-- Content -->
        <hero title='Profile selection' subtitle='Profiles help to organise mods easily' heroType='is-info' />
        <div class='columns'>
            <div class='column is-full'>
                <div>
                    <article class='media'>
                        <div class='media-content'>
                            <div class='content'>
                                <div v-for='(profileName) of profileList' :key="profileName">
                                    <a @click="selectProfile(profileName)">
                                        <div class='container'>
                                            <div class='border-at-bottom'>
                                                <div class='card is-shadowless'>
                                                    <p :class="['card-header-title', {'has-text-info':selectedProfile === profileName}]">{{profileName}}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <nav class='level'>
                                <div class='level-item'>
                                    <a class='button is-info' @click="setProfileAndContinue()">Use selected profile</a>
                                </div>
                                <div class='level-item'>
                                    <a class='button is-primary' @click="newProfile()">Create new</a>
                                </div>
                                <div class='level-item'>
                                    <a class='button is-danger' @click="removeProfile()">Delete selected profile</a>
                                </div>
                            </nav>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, Progress } from '../components/all';
import { Prop } from 'vue-property-decorator';
import Profile from '../model/Profile';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import { isUndefined } from 'util';
import sanitize from 'sanitize-filename';

import * as fs from 'fs-extra';
import * as path from 'path';

let settings: ManagerSettings;

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
    }
})
export default class Profiles extends Vue {
    
    @Prop()
    private profileList: string[] = ['Default'];

    private selectedProfile: string = '';

    private addingProfile: boolean = false;
    private newProfileName: string = '';

    private removingProfile: boolean = false;

    doesProfileExist(nameToCheck: string): boolean {
        const safe: string | undefined = sanitize(nameToCheck);
        if (isUndefined(safe)) {
            return true;
        }
        return !isUndefined(this.profileList.find((profile: string) => profile.toLowerCase() === safe.toLowerCase()));
    }

    selectProfile(profile: string) {
        new Profile(profile);
        this.selectedProfile = profile;
        settings.setProfile(profile);
    }

    newProfile() {
        this.newProfileName = '';
        this.addingProfile = true;
    }

    createProfile(profile: string) {
        const safeName = this.makeProfileNameSafe(profile);
        if (safeName === '') {
            return;
        }
        new Profile(safeName);
        this.profileList.push(safeName);
        this.selectedProfile = Profile.getActiveProfile().getProfileName();
        this.addingProfile = false;
    }

    closeNewProfileModal() {
        this.addingProfile = false;
    }

    removeProfile() {
        this.removingProfile = true;
    }

    removeProfileAfterConfirmation() {
        fs.emptyDirSync(Profile.getActiveProfile().getPathOfProfile());
        fs.removeSync(Profile.getActiveProfile().getPathOfProfile());
        if (Profile.getActiveProfile().getProfileName().toLowerCase() === 'default') {
            new Profile('Default');
            this.selectedProfile = Profile.getActiveProfile().getProfileName();
            this.closeRemoveProfileModal();
            return;
        }
        for(let profileIteration = 0; profileIteration < this.profileList.length; profileIteration++) {
            if (this.profileList[profileIteration] === Profile.getActiveProfile().getProfileName()) {
                this.profileList.splice(profileIteration, 1);
                break;
            }
        }
        this.closeRemoveProfileModal();
    }

    closeRemoveProfileModal() {
        this.removingProfile = false;
    }

    makeProfileNameSafe(nameToSanitize: string): string {
        const safe: string | undefined = sanitize(nameToSanitize);
        if (isUndefined(safe)) {
            return '';
        }
        return safe;
    }

    setProfileAndContinue() {
        settings.setProfile(Profile.getActiveProfile().getProfileName());
        this.$router.push({path: '/manager'});
    }

    created() {
        settings = new ManagerSettings();
        settings.load();

        this.selectedProfile = settings.lastSelectedProfile;
        new Profile(this.selectedProfile);

        try {
            const profilesDirectory: string = Profile.getActiveProfile().getDirectory();
            fs.readdirSync(profilesDirectory)
                .forEach((file: string) => {
                    if (fs.lstatSync(path.join(profilesDirectory, file)).isDirectory() && file.toLowerCase() !== 'default') {
                        this.profileList.push(file);
                    }
                })
        } catch(e) {
            return;
        }
    }

}
</script>
