<template>
    <div>
        <DownloadModModal
            :show-download-modal="modToDownload !== null"
            :thunderstore-mod="modToDownload"
            :update-all-mods="false"
            @closed-modal="modToDownload = null;"
            @error="emitError($event)"
        />
        <div>
            <online-mod-card v-for='(key, index) in pagedModList' :key="'online-' + key.getFullName()"
                             :id="index"
                             :mod="key"
                             :funkyMode="settings.funkyModeEnabled"
                             @install-mod="showDownloadModal(key)"
                             @uninstall-mod="$emit('uninstall-mod', key)">
            </online-mod-card>
        </div>
    </div>
</template>

<script lang="ts">

    import { Prop, PropSync, Vue } from 'vue-property-decorator';
    import Component from 'vue-class-component';
    import ThunderstoreMod from '../../model/ThunderstoreMod';
    import ManagerSettings from '../../r2mm/manager/ManagerSettings';
    import { ExpandableCard, ExternalLink, OnlineModCard } from '../all';
    import DownloadModModal from './DownloadModModal.vue';
    import ThunderstorePackages from '../../r2mm/data/ThunderstorePackages';
    import ManifestV2 from '../../model/ManifestV2';
    import R2Error from '../../model/errors/R2Error';

    @Component({
        components: {
            DownloadModModal,
            ExpandableCard,
            ExternalLink,
            OnlineModCard,
        }
    })
    export default class OnlineModList extends Vue {

        @Prop()
        pagedModList!: ThunderstoreMod[];

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList;
        }

        private settings: ManagerSettings = ManagerSettings.getSingleton();
        private modToDownload: ThunderstoreMod | null = null;

        get localModList(): ManifestV2[] {
            return this.$store.state.localModList;
        }

        isModDeprecated(key: any) {
            if (key.deprecated) {
                return true;
            } else {
                const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(key);
                if (this.isModDependencyDeprecated(mod)) {
                    return true;
                }
            }
            return false;
        }

        isModDependencyDeprecated(mod: ThunderstoreMod): boolean {
            let shouldStrikethrough = false;
            this.thunderstorePackages.forEach((tsMod: ThunderstoreMod) => {
                if (!shouldStrikethrough) {
                    mod.getDependencies().forEach((dependency: string) => {
                        if (dependency.startsWith(tsMod.getFullName())) {
                            if (tsMod.isDeprecated()) {
                                shouldStrikethrough = true;
                                return;
                            } else {
                                shouldStrikethrough = this.isModDependencyDeprecated(tsMod);
                            }
                        }
                    });
                }
            });
            return shouldStrikethrough;
        }

        isThunderstoreModInstalled(vueMod: any) {
            const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(vueMod);
            return this.localModList.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
        }

        showDownloadModal(mod: any) {
            const tsMod = new ThunderstoreMod().fromReactive(mod);
            this.modToDownload = tsMod;
        }

        emitError(error: R2Error) {
            this.$emit('error', error);
        }

    }

</script>
