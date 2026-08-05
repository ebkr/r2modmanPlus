<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import R2Error from '../../model/errors/R2Error';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed, ComputedRef, ref, watch } from 'vue';

const { t, locale } = useI18n();

const store = getStore<State>();

const error: ComputedRef<R2Error | null> = computed(() => store.state.error.error);
const name = computed(() => error.value ? error.value.name : '');
const message = computed(() => error.value ? error.value.message : '');
const solution = computed(() => error.value ? error.value.solution : '');

const showInEnglish = ref<boolean>(false);
const canToggleLanguage = computed<boolean>(() => locale.value !== 'en');
const displayLocale = computed<string>(() => showInEnglish.value ? 'en' : locale.value);

watch(error, () => showInEnglish.value = false);

function close() {
    store.commit('error/discardError');
}
</script>

<template>
    <div v-if="error !== null" id="errorModal" class="modal z-top is-active">
        <div class="modal-background" @click="close"></div>
        <div class="modal-content">
            <div class="notification is-danger">
                <h3 class="title">{{ t('translations.modals.error.title', {}, { locale: displayLocale }) }}</h3>
                <h5 class="title is-5">{{name}}</h5>
                <p>{{message}}</p>
                <div v-if="solution">
                    <h5 class="title is-5">{{ t('translations.modals.error.suggestion', {}, { locale: displayLocale }) }}</h5>
                    <p>{{solution}}</p>
                </div>
                <div class="mt-3 error-actions" v-if="canToggleLanguage || (error && error.action)">
                    <a
                        v-if="canToggleLanguage"
                        href="#"
                        @click.prevent="showInEnglish = !showInEnglish"
                    >
                        {{ t(
                            showInEnglish
                                ? 'translations.modals.error.actions.showTranslated'
                                : 'translations.modals.error.actions.showInEnglish'
                        ) }}
                    </a>
                    <button v-if="error && error.action" class="button is-white" @click="() => { error?.action?.function(); close(); }">
                        {{error.action.label}}
                    </button>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" :aria-label="t('translations.modals.error.close')" @click="close"></button>
    </div>
</template>

<style scoped lang="scss">
    p + div {
        margin-top: 1.5rem;
    }

    .error-actions {
        display: flex;
        align-items: center;
    }

    .error-actions .button {
        margin-left: auto;
    }
</style>
