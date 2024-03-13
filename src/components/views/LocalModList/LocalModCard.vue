<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { ExpandableCard, Link } from '../../all';
import DonateButton from '../../buttons/DonateButton.vue';
import R2Error from '../../../model/errors/R2Error';
import ManifestV2 from '../../../model/ManifestV2';
import ThunderstoreMod from '../../../model/ThunderstoreMod';
import { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import Dependants from '../../../r2mm/mods/Dependants';
import ModBridge from '../../../r2mm/mods/ModBridge';

@Component({
    components: {
        DonateButton,
        ExpandableCard,
        Link,
    }
})
export default class LocalModCard extends Vue {

    @Prop({required: true})
    readonly mod!: ManifestV2;

    disabledDependencies: ManifestV2[] = [];
    missingDependencies: string[] = [];

    get donationLink() {
        return this.tsMod ? this.tsMod.getDonationLink() : undefined;
    }

    get isDeprecated() {
        return this.tsMod ? this.tsMod.isDeprecated() : false;
    }

    get isLatestVersion() {
        return ModBridge.isCachedLatestVersion(this.mod);
    }

    get localModList(): ManifestV2[] {
        return this.$store.state.profile.modList;
    }

    get tsMod() {
        return ModBridge.getCachedThunderstoreModFromMod(this.mod);
    }

    @Watch("localModList")
    updateDependencies() {
        if (this.mod.getDependencies().length === 0) {
            return;
        }

        const dependencies = this.mod.getDependencies();
        const dependencyNames = dependencies.map(dependencyStringToModName);
        const foundDependencies: ManifestV2[] = [];

        for (const mod of this.localModList) {
            if (foundDependencies.length === dependencyNames.length) {
                break;
            }

            if (dependencyNames.includes(mod.getName())) {
                foundDependencies.push(mod);
            }
        }

        const foundNames = foundDependencies.map((mod) => mod.getName());

        this.disabledDependencies = foundDependencies.filter((d) => !d.isEnabled());
        this.missingDependencies = dependencies.filter(
            (d) => !foundNames.includes(dependencyStringToModName(d))
        );
    }

    async disableMod() {
        const dependants = Dependants.getDependantList(this.mod, this.localModList);

        for (const mod of dependants) {
            if (mod.isEnabled()) {
                this.$store.commit('openDisableModModal', this.mod);
                return;
            }
        }

        try {
            await this.$store.dispatch(
                'profile/disableModsFromActiveProfile',
                { mods: [this.mod] }
            );
        } catch (e) {
            this.$store.commit('error/handleError', {
                error: R2Error.fromThrownValue(e),
                severity: LogSeverity.ACTION_STOPPED
            });
        }
    }

    async enableMod(mod: ManifestV2) {
        const dependencies = Dependants.getDependencyList(mod, this.localModList);

        try {
            await this.$store.dispatch(
                'profile/enableModsOnActiveProfile',
                { mods: [...dependencies, mod] }
            );
        } catch (e) {
            this.$store.commit('error/handleError', {
                error: R2Error.fromThrownValue(e),
                severity: LogSeverity.ACTION_STOPPED
            });
        }
    }

    async uninstallMod() {
        const dependants = Dependants.getDependantList(this.mod, this.localModList);

        if (dependants.size > 0) {
            this.$store.commit('openUninstallModModal', this.mod);
            return;
        }

        try {
            await this.$store.dispatch(
                'profile/uninstallModsFromActiveProfile',
                { mods: [this.mod] }
            );
        } catch (e) {
            this.$store.commit('error/handleError', {
                error: R2Error.fromThrownValue(e),
                severity: LogSeverity.ACTION_STOPPED
            });
        }
    }

    updateMod() {
        if (this.tsMod !== undefined) {
            this.$store.commit('openDownloadModModal', this.tsMod);
        }
    }

    downloadDependency(dependencyString: string) {
        const packages: ThunderstoreMod[] = this.$store.state.thunderstoreModList;
        const lowerCaseName = dependencyStringToModName(dependencyString).toLowerCase();
        const dependency = packages.find((m) => m.getFullName().toLowerCase() === lowerCaseName);

        if (dependency === undefined) {
            const error = new R2Error(
                `${dependencyString} could not be found`,
                'You may be offline, or the mod was removed from Thunderstore.',
                'The dependency may not yet be published to Thunderstore and may be available elsewhere.'
            );
            this.$store.commit('error/handleError', error);
            return;
        }
        this.$store.commit('openDownloadModModal', dependency);
    }

    viewAssociatedMods() {
        this.$store.commit('openAssociatedModsModal', this.mod);
    }

    created() {
        this.updateDependencies();
    }
}

function dependencyStringToModName(x: string) {
    return x.substring(0, x.lastIndexOf('-'));
}
</script>

<template>
    <expandable-card
        :description="mod.getDescription()"
        :enabled="mod.isEnabled()"
        :id="`${mod.getAuthorName()}-${mod.getName()}-${mod.getVersionNumber()}`"
        :image="mod.getIcon()"
        :allowSorting="true">

        <template v-slot:title>
            <span class="non-selectable">
                <span v-if="isDeprecated"
                    class="tag is-danger margin-right margin-right--half-width"
                    v-tooltip.right="'This mod is deprecated and could be broken'">
                    Deprecated
                </span>
                <span v-if="!mod.isEnabled()"
                    class="tag is-warning margin-right margin-right--half-width"
                    v-tooltip.right="'This mod will not be used in-game'">
                    Disabled
                </span>
                <span class="card-title selectable">
                    <component :is="mod.isEnabled() ? 'span' : 'strike'" class="selectable">
                        {{mod.getDisplayName()}}
                        <span class="selectable card-byline">
                            v{{mod.getVersionNumber()}}
                        </span>
                        <span :class="`card-byline ${mod.isEnabled() && 'selectable'}`">
                            by {{mod.getAuthorName()}}
                        </span>
                    </component>
                </span>
            </span>
        </template>

        <template v-slot:other-icons>
            <!-- Show update and missing dependency icons -->
            <span v-if="donationLink" class='card-header-icon'>
                <Link :url="donationLink" target="external" tag="span">
                    <i class='fas fa-heart' v-tooltip.left="'Donate to the mod author'"></i>
                </Link>
            </span>
            <span v-if="!isLatestVersion"
                @click.prevent.stop="updateMod()"
                class='card-header-icon'>
                <i class='fas fa-cloud-upload-alt' v-tooltip.left="'An update is available'"></i>
            </span>
            <span v-if="disabledDependencies.length || missingDependencies.length"
                class='card-header-icon'>
                <i v-tooltip.left="`There is an issue with the dependencies for this mod`"
                    class='fas fa-exclamation-circle'
                ></i>
            </span>
            <span @click.prevent.stop="() => mod.isEnabled() ? disableMod() : enableMod(mod)"
                class='card-header-icon'>
                <div class="field">
                    <input id="switchExample"
                        type="checkbox"
                        name="switchExample"
                        :class='`switch is-small  ${mod.isEnabled() ? "switch is-info" : ""}`'
                        :checked="mod.isEnabled()" />
                    <label for="switchExample" v-tooltip.left="mod.isEnabled() ? 'Disable' : 'Enable'"></label>
                </div>
            </span>
        </template>

        <!-- Show bottom button row -->
        <a @click="uninstallMod()" class='card-footer-item'>
            Uninstall
        </a>

        <a v-if="mod.isEnabled()" @click="disableMod()" class='card-footer-item'>
            Disable
        </a>
        <a v-else @click="enableMod(mod)" class='card-footer-item' >
            Enable
        </a>

        <a @click="viewAssociatedMods()" class='card-footer-item'>
            Associated
        </a>

        <Link :url="mod.getWebsiteUrl()" :target="'external'" class="card-footer-item">
            Website
            <i class="fas fa-external-link-alt margin-left margin-left--half-width"></i>
        </Link>

        <a v-if="!isLatestVersion" @click="updateMod()" class='card-footer-item'>
            Update
        </a>

        <a v-if="missingDependencies.length"
            @click="downloadDependency(missingDependencies[0])"
            class='card-footer-item'>
            Download dependency
        </a>

        <a v-if="disabledDependencies.length"
            @click="enableMod(disabledDependencies[0])"
            class='card-footer-item'>
            Enable {{disabledDependencies[0].getDisplayName()}}
        </a>

        <DonateButton v-if="donationLink" :mod="tsMod"/>
    </expandable-card>
</template>

<style scoped lang="scss">

</style>
