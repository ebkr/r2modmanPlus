<template>
    <div>
        <ExpandableCard
            v-for='(key, index) in pagedModList' :key="`online-${key.getFullName()}-${index}-${settings.getContext().global.expandedCards}`"
            :image="getImageUrl(key)"
            :id="index"
            :description="key.getVersions()[0].getDescription()">
            <template v-slot:title>
                <span v-if="key.isPinned()">
                    <span class="tag is-info margin-right margin-right--half-width"
                          v-tooltip.right="'Pinned on Thunderstore'">
                        Pinned
                    </span>
                    <span class="selectable">{{key.getName()}} <span class="card-byline">by {{key.getOwner()}}</span></span>
                </span>
                <span v-else-if="isModDeprecated(key)">
                    <span class="tag is-danger margin-right margin-right--half-width"
                          v-tooltip.right="'This mod is potentially broken'">
                        Deprecated
                    </span>
                    <strike class="selectable">{{key.getName()}} <span class="card-byline">by {{key.getOwner()}}</span></strike>
                </span>
                <span v-else class='selectable'>
                    {{key.getName()}} <span class="card-byline">by {{key.getOwner()}}</span>
                </span>
            </template>
            <template v-slot:other-icons>
                <span class='card-header-icon' v-if="key.getDonationLink()">
                    <Link :url="key.getDonationLink()" target="external" tag="span">
                        <i class='fas fa-heart' v-tooltip.left="'Donate to the mod author'"></i>
                    </Link>
                </span>
                <span class='card-header-icon' v-if="isThunderstoreModInstalled(key)">
                    <i class='fas fa-check' v-tooltip.left="'Mod already installed'"></i>
                </span>
            </template>
            <template v-slot:description>
                <p class='card-timestamp'><strong>Last updated:</strong> {{getReadableDate(key.getDateUpdated())}}</p>
                <p class='card-timestamp'><strong>Categories:</strong> {{getReadableCategories(key)}}</p>
            </template>
            <a class='card-footer-item' @click='showDownloadModal(key)'>Download</a>
            <Link :url="key.getPackageUrl()" :target="'external'" class='card-footer-item'>
                Website <i class="fas fa-external-link-alt margin-left margin-left--half-width"></i>
            </Link>
            <template v-if="key.getDonationLink() !== undefined">
                <DonateButton :mod="key"/>
            </template>
            <div class='card-footer-item non-selectable'>
                <span><i class='fas fa-download'/> {{key.getTotalDownloads()}}</span>
            </div>
            <div class='card-footer-item non-selectable'>
                <span><i class='fas fa-thumbs-up'/> {{key.getRating()}}</span>
            </div>
        </ExpandableCard>

    </div>
</template>

<script lang="ts">

import { Prop, Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import { ExpandableCard, Link } from '../all';
import DownloadModModal from './DownloadModModal.vue';
import ManifestV2 from '../../model/ManifestV2';
import DonateButton from '../../components/buttons/DonateButton.vue';
import CdnProvider from '../../providers/generic/connection/CdnProvider';

@Component({
    components: {
        DonateButton,
        DownloadModModal,
        ExpandableCard,
        Link
    }
})
export default class OnlineModList extends Vue {

    @Prop()
    pagedModList!: ThunderstoreMod[];

    private cardExpanded: boolean = false;
    private funkyMode: boolean = false;

    get settings(): ManagerSettings {
        return this.$store.getters["settings"];
    };

    get localModList(): ManifestV2[] {
        return this.$store.state.profile.modList;
    }

    get deprecationMap(): Map<string, boolean> {
        return this.$store.state.tsMods.deprecated;
    }

    isModDeprecated(key: any) {
        const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(key);
        return this.deprecationMap.get(mod.getFullName()) || false;
    }

    isThunderstoreModInstalled(vueMod: any) {
        const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(vueMod);
        return this.localModList.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
    }

    showDownloadModal(mod: any) {
        const modToDownload = new ThunderstoreMod().fromReactive(mod);
        this.$store.commit("openDownloadModModal", modToDownload);
    }

    getReadableDate(date: Date): string {
        const dateObject: Date = new Date(date);
        return `${dateObject.toDateString()}, ${dateObject.toLocaleTimeString()}`
    }

    getReadableCategories(tsMod: ThunderstoreMod) {
        const mod = new ThunderstoreMod().fromReactive(tsMod);
        return mod.getCategories().join(", ");
    }

    getImageUrl(tsMod: ThunderstoreMod): string {
        return CdnProvider.replaceCdnHost(
            tsMod.getVersions()[0].getIcon()
        );
    }

    async created() {
        this.cardExpanded = this.settings.getContext().global.expandedCards;
        this.funkyMode = this.settings.getContext().global.funkyModeEnabled;
    }

}

</script>
