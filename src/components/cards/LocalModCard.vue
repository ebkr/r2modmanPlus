<template>
    <div class='card is-shadowless card--is-clickable card--is-cozy cursor-pointer' 
       :class="{'card--is-disabled': !manifest.isEnabled(), 'card--is-deprecated': manifest.isDeprecated()}">
        <figure class='card-image image is-72x72 image-parent mod-logo' v-if="manifest.icon !== ''">
            <img :src='manifest.icon' alt='Mod Logo' class='image-overlap'/>
            <img v-if="funkyMode" src='../../assets/funky_mode.png' alt='Mod Logo' class='image-overlap'/>
        </figure>
        <header class='card-header is-shadowless' :id='id'>
            <span class='card-header-title'>
                <div class="field card-toggle has-tooltip-top"
                     :data-tooltip='`This mod is ${manifest.isEnabled() ? "enabled" : "disabled"}.`'>
                        <input :id="`toggle${id}`" type="checkbox" class="switch is-info is-rounded"
                               ref="switch"
                               :checked='manifest.isEnabled()' 
                               @click.prevent="toggle">
                        <label :for="`toggle${id}`"></label>
                </div>
                <span class='card-title card-title--is-large'>{{manifest.getDisplayName()}}</span>
                <span v-if="manifest.isDeprecated()" class="tag is-danger has-tooltip-top"
                      data-tooltip='This mod has been marked as deprecated, suggesting that an alternative be used instead.'>
                        Deprecated
                </span>
            </span>
        </header>
        <div class='card-header-icons'>
            <div>
                <a v-if="missingDependencies.length > 0"
                    class='card-header-icon button is-warning has-tooltip-top'
                    :data-tooltip="`Missing ${missingDependencies.length} dependencies`">
                        <span class='icon'>
                            <i class='fas fa-exclamation-circle'></i>
                        </span>
                        <span class='card-header-icon-label requires-card-hover'>Install missing dependency</span>
                </a>
            </div>
            <a v-if="!isLatest()" class='card-header-icon button is-info' @click='$emit("update-mod")'>
                <span class='icon'>
                    <i class='fas fa-cloud-download-alt' aria-hidden='true'></i>
                </span>
                <span class='card-header-icon-label requires-card-hover'>Update</span>
            </a>
            <a class='card-header-icon button is-info requires-card-hover' @click='$emit("view-associated-mods")'>
                <span class='icon'>
                    <i class='fas fa-project-diagram' aria-hidden='true'></i>
                </span>
                <span class='card-header-icon-label'>Associated mods</span>
            </a>
            <a class='card-header-icon button is-danger is-colored-button-only requires-card-hover' @click='$emit("uninstall-mod")'>
                <span class='icon'>
                    <i class='fas fa-trash' aria-hidden='true'></i>
                </span>
                <span class='card-header-icon-label'>Uninstall</span>
            </a>
        </div>
        <footer class='card-footer card-footer-borderless'>
            <span class='card-footer-item non-selectable'>
                <external-link v-if='manifest.getAuthorName()' target="link" 
                               :url="`https://thunderstore.io/package/${manifest.getAuthorName()}`">
                                   {{manifest.getAuthorName()}}
                </external-link>
            </span>
            <span class='card-footer-item non-selectable'>
                <external-link :url="`${manifest.getWebsiteUrl()}${manifest.getVersionNumber().toString()}`"
                               :target="'external'"
                               class="card-version">
                                <i class='fas fa-code-branch'></i>
                                {{manifest.getVersionNumber().toString()}}
                </external-link>
            </span>
        </footer>
        <div class='card-content card-content--is-compressed'>
            <div class='content'>
                <template v-if="manifest.description !== ''">
                    <p class="card-description">
                        {{manifest.description}}
                    </p>
                    <slot name='description'></slot>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import ManifestV2 from 'src/model/ManifestV2';
import ThunderstoreMod from 'src/model/ThunderstoreMod';
import ModBridge from 'src/r2mm/mods/ModBridge';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator'
import ExternalLink from '../ExternalLink.vue';

@Component({
    components: {
        ExternalLink,
    }
})
export default class LocalModCard extends Vue {

    @Prop()
    id: string | undefined;
    
    @Prop()
    manifest: ManifestV2 | undefined;
    
    @Prop({default: () => []})
    missingDependencies: string[] | undefined;

    @Prop({default: false})
    funkyMode: boolean | undefined;
    
    toggle() {
        setTimeout(() => {
            // for some reason this only works if it's delayed until after the event is over
            this.$emit("update:enabled", !(this.$refs.switch as HTMLInputElement).checked);
        }, 1);
    }
    
    // when the manifest changes, re-render this component
    @Watch("manifest", {deep: true})
    onManifestChange() {
        this.$forceUpdate();
    }
    
    emitMove(direction: string) {
        this.$emit("move" + direction);
    }
    
    isLatest() {
        return ModBridge.isLatestVersion(this.manifest);
    }
}
</script>
