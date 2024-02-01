<script lang="ts">
import debounce from 'lodash.debounce';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class DeferredInput extends Vue {
    @Prop({type: Number, required: false, default: 250})
    readonly delay!: number;

    internalValue = '';

    @Watch('internalValue')
    onInternalValueChange = debounce(this.emitChange, this.delay);

    emitChange() {
        this.$emit('changed', this.internalValue);
    }
}
</script>

<template>
    <input v-model="internalValue" />
</template>

<style scoped lang="scss">

</style>
