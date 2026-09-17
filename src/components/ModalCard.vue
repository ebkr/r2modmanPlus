<template>
    <div :class="['modal', {'is-active': isActive}]" :id="id">
        <div class="modal-background" @click="closeModal"/>
        <div class="modal-card py-4">
            <header class="modal-card-head">
                <slot name="header"/>
            </header>
            <template v-if="!!$slots.body">
                <section class="modal-card-body">
                    <slot name="body"/>
                </section>
            </template>
            <template v-if="!!$slots.footer">
                <footer class="modal-card-foot">
                    <slot name="footer"/>
                </footer>
            </template>
        </div>
        <button v-if="canClose" class="modal-close is-large" aria-label="close" @click="closeModal"/>
    </div>
</template>

<script lang="ts" setup>
type ModalCardProps = {
    id: string;
    isActive?: boolean;
    canClose?: boolean;
}

const props = withDefaults(defineProps<ModalCardProps>(), {
    isActive: false,
    canClose: true,
});
const emits = defineEmits<{
    (e: 'close-modal'): void;
}>();

function closeModal() {
    if (props.canClose) {
        emits('close-modal');
    }
}
</script>


<style scoped lang="scss">
.modal {
    backdrop-filter: blur(5px);
}
</style>
