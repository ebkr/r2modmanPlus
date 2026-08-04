<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <i18n-t tag="p" class="text-faded" keypath="translations.pages.error404.message">
      <template v-slot:code><strong>(404)</strong></template>
    </i18n-t>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      :label="t('translations.pages.error404.actions.goBack')"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
