<template>

    <div>
        <i :style="getIconColor()" :class="getIconName()"></i>
    </div>

</template>


<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";

@Component
    export default class Icon extends Vue {


        @Prop({default: ''})
        iconName: string | undefined;

        @Prop({default: ''})
        iconSize: string | undefined;

        @Prop({default: ''})
        iconColor: string | undefined;


        getIconName (){
            return 'fa fa-' + this.iconName + ' fa-' + this.iconSize;
        }
        getIconColor (){
            return this.iconColor === '' ? {color: this.iconColor} : {};
        }

    }
</script>
