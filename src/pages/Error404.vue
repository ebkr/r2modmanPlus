<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">{{ $t('Error404.sorry_nothing_here') }}<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      :label="$t('Error404.go_back')"
    />
  </div>
</template>

<script lang="ts" setup>

</script>
