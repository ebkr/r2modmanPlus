<template>
    <keep-alive>
        <div class='row-card is-shadowless' :class="[{'row-card--expanded': isSelected}]" @click="$emit('click')">
            <div class='cursor-pointer'>
                <header class='card-header is-shadowless' :id='id'>
                    <div class='card-header-icon mod-logo' v-if="image !== ''">
                        <figure class='image is-48x48 image-parent'>
                            <img :src='image' alt='Mod Logo' class='image-overlap'/>
                            <img v-if="$store.state.profile.funkyMode" src='../assets/funky_mode.png' alt='Mod Logo' class='image-overlap'/>
                        </figure>
                    </div>
                    <span ref="title" class='card-header-title'><slot name='title'></slot></span>
                    <slot name='other-icons'></slot>
                </header>
            </div>
        </div>
    </keep-alive>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import { Component, Prop, Watch } from 'vue-property-decorator'

    @Component
    export default class OnlineRowCard extends Vue {

        @Prop()
        isSelected: boolean | undefined;

        @Prop({default: ''})
        image: string | undefined;

        @Prop()
        id: string | undefined;

        async created() {
            await this.$store.dispatch('profile/loadModCardSettings');
        }
    }
</script>


<style lang="scss" scoped>
.card-header-title {
    word-break: break-all;
}
</style>
