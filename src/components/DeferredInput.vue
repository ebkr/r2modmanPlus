<script lang="ts">
import debounce from 'lodash.debounce';
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class DeferredInput extends Vue {
    @Model('change')
    readonly value!: string;

    @Prop({type: Number, required: false, default: 250})
    readonly delay!: number;

    internalValue = this.value;

    @Watch('internalValue')
    onInternalValueChange = debounce(this.emitChange, this.delay);

    emitChange() {
        this.$emit('change', this.internalValue);
    }
}
</script>

<template>
    <input v-model="internalValue" />
</template>

<style scoped lang="scss">

</style>
