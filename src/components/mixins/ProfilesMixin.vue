<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import sanitize from "sanitize-filename";

const VALID_PROFILE_CODE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Component
export default class ProfilesMixin extends Vue {

    get profileList(): string[] {
        return this.$store.state.profiles.profileList;
    }

    get activeProfileName(): string {
        return this.$store.getters['profile/activeProfileName'];
    }

    set activeProfileName(value: string) {
        this.$store.dispatch('profiles/setSelectedProfile', {profileName: value, prewarmCache: false});
    }

    doesProfileExist(nameToCheck: string): boolean {
        if ((nameToCheck.match(new RegExp('^([a-zA-Z0-9])(\\s|[a-zA-Z0-9]|_|-|[.])*$'))) === null) {
            return true;
        }
        const safe: string = this.makeProfileNameSafe(nameToCheck);
        return (this.profileList.some(function (profile: string) {
            return profile.toLowerCase() === safe.toLowerCase()
        }));
    }

    makeProfileNameSafe(nameToSanitize: string): string {
        return sanitize(nameToSanitize);
    }

    isProfileCodeValid(profileImportCode: string): boolean {
        return VALID_PROFILE_CODE_REGEX.test(profileImportCode);
    }

}
</script>
