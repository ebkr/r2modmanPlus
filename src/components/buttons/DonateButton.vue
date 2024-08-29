<template>
    <Link :url="mod?.getDonationLink()"
          :target="'external'"
          class="card-footer-item"
          v-tooltip.left="{content: 'Donate to the mod author', distance: 0}">
        <i class='fas fa-heart margin-right margin-right--half-width'></i>
        Donate
    </Link>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { Link } from '../../components/all';

@Component({
    components: {
        Link
    }
})
export default class DonateButton extends Vue {

    @Prop({required: true})
    mod: ThunderstoreMod | undefined;

}

</script>
