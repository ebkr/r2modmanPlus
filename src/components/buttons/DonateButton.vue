<template>
    <ExternalLink v-if="mod && mod.getDonationLink()"
          :url="mod.getDonationLink()"
          class="button"
          v-tooltip.top="{content: 'Donate to the mod author', distance: 10}">
        <i class='fas fa-heart margin-right margin-right--half-width'></i>
        Donate
    </ExternalLink>
</template>

<script lang="ts" setup>
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { ExternalLink } from '../../components/all';

type DonateButtonProps = {
    mod: ThunderstoreMod;
}

defineProps<DonateButtonProps>();
</script>
