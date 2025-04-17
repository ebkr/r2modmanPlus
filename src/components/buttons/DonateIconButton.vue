<template>
    <span v-if="mod && mod.getDonationLink() && extraRenderCondition" class="card-header-icon">
        <Link :url="mod.getDonationLink()" target="external" tag="span">
            <i class="fas fa-heart" v-tooltip.left="'Donate to the mod author'"></i>
        </Link>
    </span>
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
export default class DonateIconButton extends Vue {

    @Prop({required: true})
    mod: ThunderstoreMod | undefined;

    @Prop({default: true})
    extraRenderCondition!: boolean;

}

</script>
