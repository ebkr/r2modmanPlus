<template>
    <ExternalLink v-if="mod && mod.getDonationLink()"
          :url="mod.getDonationLink()"
          class="card-footer-item"
          v-tooltip.left="{content: t('translations.pages.manager.installed.localModCard.tooltips.donate'), distance: 0}">
        <i class='fas fa-heart margin-right margin-right--half-width'></i>
        {{ t('translations.pages.manager.installed.localModCard.actions.donate') }}
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
