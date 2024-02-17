<template>
    <keep-alive>
        <div class="">
            <div class='row-card is-shadowless' :class="[{'disabled-card': !enabled}, {'row-card--expanded': visible}]">
                <div @click='toggleVisibility()' class='cursor-pointer' ref="card-expansion">
                    <header class='card-header is-shadowless' :id='id'>
                        <div class='card-header-icon mod-logo' v-if="image !== ''">
                            <figure class='image is-48x48 image-parent'>
                                <img :src='image' alt='Mod Logo' class='image-overlap'/>
                                <img v-if="funkyMode" src='../assets/funky_mode.png' alt='Mod Logo' class='image-overlap'/>
                            </figure>
                        </div>
                        <span ref="title" class='card-header-title'><slot name='title'></slot></span>
                        <slot name='other-icons'></slot>
                        <!-- Allow movement of mod order -->
                        <a v-if='showSort' class='card-header-icon handle'>
                            <i class="fas fa-grip-vertical" v-tooltip.left="'Drag to reorder'"></i>
                        </a>
                        <a class='card-header-icon'>
                            <span class='icon'>
                                <i class='fas fa-angle-right' aria-hidden='true' v-if='!visible' v-tooltip.left="'Expand'"></i>
                                <i class='fas fa-angle-down' aria-hidden='true' v-if='visible' v-tooltip.left="'Collapse'"></i>
                            </span>
                        </a>
                    </header>
                </div>
                <div class='card-content' v-show='visible' v-if="description !== ''">
                    <div class='content'>
                        <p ref="description">{{description}}</p>
                        <slot name='description'></slot>
                    </div>
                </div>
                <footer class='card-footer card-footer-borderless' v-show='visible' ref="footer">
                    <slot></slot>
                    <div class="is-divider"></div>
                </footer>
            </div>
        </div>
    </keep-alive>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import { Component, Prop, Watch } from 'vue-property-decorator'

    @Component
    export default class ExpandableCard extends Vue {

        @Prop({default: ''})
        image: string | undefined;

        @Prop({default: ''})
        description: string | undefined;

        @Prop()
        id: string | undefined;

        @Prop({default: false})
        funkyMode: boolean | undefined;

        @Prop({default: false})
        expandedByDefault: boolean | undefined;

        @Prop({default: false})
        showSort: boolean | undefined;

        @Prop({default: true})
        enabled: boolean | undefined;

        // Keep track of visibility
        visible: boolean | undefined = false;

        @Watch('expandedByDefault')
        visibilityChanged(current: boolean) {
            this.visible = current;
        }

        toggleVisibility() {
            this.visible = !this.visible;
        }

        async created() {
            this.visible = this.expandedByDefault;
        }
    }
</script>


<style lang="scss" scoped>
.card-header-title {
    word-break: break-all;
}
</style>
