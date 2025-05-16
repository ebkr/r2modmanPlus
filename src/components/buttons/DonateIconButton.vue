<template>
    <span v-if="mod && mod.getDonationLink() && extraRenderCondition" class="card-header-icon">
        <ExternalLink :url="mod.getDonationLink()" tag="span">
            <i class="fas fa-heart" v-tooltip.left="'Donate to the mod author'"></i>
        </ExternalLink>
    </span>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { ExternalLink }  from '../../components/all';

@Component({
    components: {
        ExternalLink,
    }
})
export default class DonateIconButton extends Vue {

    @Prop({required: true})
    mod: ThunderstoreMod | undefined;

    @Prop({default: true})
    extraRenderCondition!: boolean;

}

</script>
