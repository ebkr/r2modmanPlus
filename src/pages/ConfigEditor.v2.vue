<script lang="ts" setup>
import ManagerActivityBar from '../components/navigation/ManagerActivityBar.vue';
</script>

<template>
    <ManagerActivityBar />
    <div class="router-view">
        <router-view name="subview" />
    </div>
</template>

<style lang="scss" scoped>
.router-view {
    display: flex;
    flex: 1;
    width: 100%;
}
</style>
