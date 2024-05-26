<template>
    <div class="input-group">
        <label>{{ title }}:</label>
        <div class="input-group margin-bottom">
            <select class="select select--content-spacing" @change="emitSelected">
                <option selected disabled>
                    Select a category
                </option>
                <option v-for="(key, index) in selectableCategories" :key="`category--${key}-${index}`">
                    {{ key }}
                </option>
            </select>
        </div>
        <div class="field has-addons" v-if="selectedCategories.length > 0">
            <div class="control" v-for="(key, index) in selectedCategories" :key="`${key}-${index}`">
                <span class="block margin-right">
                    <a href="#" @click="emitDeselected(key)">
                        <span class="tags has-addons">
                            <span class="tag">{{ key }}</span>
                            <span class="tag is-danger">
                                <i class="fas fa-times"></i>
                            </span>
                        </span>
                    </a>
                </span>
            </div>
        </div>
        <div class="field has-addons" v-else>
            <span class="tags">
                <span class="tag">No categories selected</span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ChangeSelectorModal extends Vue {

    @Prop({required: true})
    private title!: string;

    @Prop({required: true})
    private selectedCategories!: string[]

    @Prop({required: true})
    private selectableCategories!: string[]

    emitSelected(event: Event) {
        this.$emit("selected-category", event);
    }

    emitDeselected(key: string) {
        this.$emit("deselected-category", key);
    }

}
</script>
