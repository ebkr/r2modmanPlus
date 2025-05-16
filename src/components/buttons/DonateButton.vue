<template>
    <ExternalLink v-if="mod && mod.getDonationLink()"
          :url="mod.getDonationLink()"
          class="card-footer-item"
          v-tooltip.left="{content: 'Donate to the mod author', distance: 0}">
        <i class='fas fa-heart margin-right margin-right--half-width'></i>
        Donate
    </ExternalLink>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { ExternalLink } from '../../components/all';

@Component({
    components: {
        ExternalLink,
    }
})
export default class DonateButton extends Vue {

    @Prop({required: true})
    mod: ThunderstoreMod | undefined;

}

</script>
