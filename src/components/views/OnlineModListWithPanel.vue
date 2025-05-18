<template>
    <div>
        <OnlineRowCard
            v-for='(key, index) in pagedModList' :key="`online-${key.getFullName()}-${index}`"
            :image="getImageUrl(key)"
            :id="index"
            :is-selected="selectedMod === key"
            @click="() => emitCardClick(key)">
            <template v-slot:title>
                <div>
                    <span class="selectable">{{key.getName()}}</span>
                    <div>
                        <span class="card-byline">{{key.getOwner()}}</span>
                    </div>
                </div>
            </template>
            <template v-slot:other-icons>
                <span class='card-header-icon' v-if="isModDeprecated(key)">
                    <i class='fas fa-exclamation-triangle' v-tooltip.left="'This mod is potentially broken'"></i>
                </span>
                <span class='card-header-icon' v-if="key.isPinned() && !readOnly">
                    <i class='fas fa-map-pin' v-tooltip.left="'Pinned on Thunderstore'"></i>
                </span>
                <span class='card-header-icon' v-if="key.getDonationLink() && !readOnly">
                    <ExternalLink :url="key.getDonationLink()" target="external" tag="span">
                        <i class='fas fa-heart' v-tooltip.left="'Donate to the mod author'"></i>
                    </ExternalLink>
                </span>
                <span class='card-header-icon' v-if="isThunderstoreModInstalled(key) && !readOnly">
                    <i class='fas fa-check' v-tooltip.left="'Mod already installed'"></i>
                </span>
            </template>
        </OnlineRowCard>
    </div>
</template>

<script lang="ts">

import { Prop, Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { ExpandableCard, ExternalLink } from '../all';
import DownloadModModal from './DownloadModModal.vue';
import ManifestV2 from '../../model/ManifestV2';
import DonateButton from '../../components/buttons/DonateButton.vue';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import OnlineRowCard from '../OnlineRowCard.vue';

@Component({
    components: {
        OnlineRowCard,
        DonateButton,
        DownloadModModal,
        ExpandableCard,
        ExternalLink
    }
})
export default class OnlineModListWithPanel extends Vue {

    @Prop()
    pagedModList!: ThunderstoreMod[];

    @Prop()
    selectedMod: ThunderstoreMod | null = null;

    @Prop({default: false})
    readOnly!: boolean;

    get localModList(): ManifestV2[] {
        return this.$store.state.profile.modList;
    }

    get deprecationMap(): Map<string, boolean> {
        return this.$store.state.tsMods.deprecated;
    }

    isModDeprecated(mod: ThunderstoreMod) {
        return this.deprecationMap.get(mod.getFullName()) || false;
    }

    isThunderstoreModInstalled(mod: ThunderstoreMod) {
        return this.localModList.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
    }

    getImageUrl(mod: ThunderstoreMod): string {
        return CdnProvider.replaceCdnHost(mod.getIcon());
    }

    emitCardClick(mod: ThunderstoreMod) {
        this.$emit("selected-mod", mod);
    }

}

</script>
