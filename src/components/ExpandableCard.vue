<template>
    <div class="border-at-bottom">
        <div class='card is-shadowless'>
            <a @click='toggleVisibility()'>
                <header class='card-header is-shadowless' :id='id'>
                    <div class='card-header-icon'>
                        <figure class='image is-48x48'>
                            <img :src='image' alt='Mod Logo'/>
                        </figure>
                    </div>
                    <p class='card-header-title'><slot name='title'></slot></p>
                    <slot name='other-icons'></slot>
                    <a href='#' class='card-header-icon' aria-label='more options'>
                        <span class='icon'>
                            <i class='fas fa-angle-right' aria-hidden='true' v-if='!visible'></i>
                            <i class='fas fa-angle-down' aria-hidden='true' v-if='visible'></i>
                        </span>
                    </a>
                </header>
            </a>
            <div class='card-content' v-show='visible'>
                <div class='content'>
                    <p>{{description}}</p>
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

    @Prop({default: null})
    title: string | undefined;

    @Prop({default: ''})
    description: string | undefined;

    @Prop()
    id: string | undefined;

    // Keep track of visibility
    visible: boolean | undefined = false;

    @Watch('visible')
    visibilityChanged(current: boolean): boolean {
        return current;
    }


    toggleVisibility() {
        this.visible = !this.visible;
    }
}
</script>