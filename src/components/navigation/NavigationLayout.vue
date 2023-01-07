<template>
    <div id="content" class="columns">
        <div class="column non-selectable is-one-quarter">
            <NavigationMenu @error="$emit('error', $event)" />
        </div>
        <div class="column">
            <router-view @error="$emit('error', $event)" />
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import NavigationMenu from './NavigationMenu.vue';

@Component({
    components: {NavigationMenu}
})
export default class NavigationLayout extends Vue {}

</script>
