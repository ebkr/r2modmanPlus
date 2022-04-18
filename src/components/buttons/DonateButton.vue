<template>
    <Link :url="mod.getDonationLink()"
          :target="'external'"
          class="card-footer-item">
        <div class="has-tooltip-left has-tooltip-multiline" data-tooltip="Donate to the mod author">
            <i class='fas fa-dollar-sign margin-right margin-right--half-width'></i>
            Donate
        </div>
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
