<template>
    <div class="border-at-bottom">
        <div class='card is-shadowless' :class="{'disabled-card': !enabled, 'expanded-card': visible}">
            <a @click='toggleVisibility()'>
                <header class='card-header is-shadowless' :id='id'>
                    <div class='card-header-icon mod-logo' v-if="image !== ''">
                        <figure class='image is-48x48 image-parent'>
                            <img :src='image' alt='Mod Logo' class='image-overlap'/>
                            <img v-if="funkyMode" src='../assets/funky_mode.png' alt='Mod Logo' class='image-overlap'/>
                        </figure>
                    </div>
                    <span class='card-header-title'><slot name='title'></slot></span>
                    <slot name='other-icons'></slot>
                    <!-- Allow movement of mod order -->
                    <a class='card-header-icon' v-if="manualSortUp && showSort" v-on:click.stop.prevent="emitMove('Up')">
                        <i class="fas fa-angle-double-up"></i>
                    </a>
                    <span class='card-header-icon' :class="{'has-text-grey-lighter': !darkTheme, 'has-text-grey-dark': darkTheme}" v-else-if="showSort">
                        <i class="fas fa-angle-double-up"></i>
                    </span>
                    <a class='card-header-icon' v-if="manualSortDown && showSort" v-on:click.stop.prevent="emitMove('Down')">
                        <i class="fas fa-angle-double-down"></i>
                    </a>
                    <span class='card-header-icon' :class="{'has-text-grey-lighter': !darkTheme, 'has-text-grey-dark': darkTheme}" v-else-if="showSort">
                        <i class="fas fa-angle-double-down"></i>
                    </span>
                    <a class='card-header-icon'>
                        <span class='icon'>
                            <i class='fas fa-angle-right' aria-hidden='true' v-if='!visible'></i>
                            <i class='fas fa-angle-down' aria-hidden='true' v-if='visible'></i>
                        </span>
                    </a>
                </header>
            </a>
            <div class='card-content' v-show='visible' v-if="description !== ''">
                <div class='content'>
                    <p>{{description}}</p>
                    <slot name='description'></slot>
                </div>
            </div>
            <footer class='card-footer' v-show='visible'>
                <slot></slot>
                <div class="is-divider"></div>
            </footer>
        </div>
    </div>
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

    @Prop({default: false})
    manualSortUp: boolean | undefined;

    @Prop({default: false})
    manualSortDown: boolean | undefined;

    @Prop({default: false})
    darkTheme: boolean | undefined;

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

    emitMove(direction: string) {
        this.$emit("move" + direction);
    }

    created() {
        this.visible = this.expandedByDefault;
    }
}
</script>
