import { computed, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

export function useDateLocale() {
    const { messages, locale } = useI18n();

    function getDateLocale(): ComputedRef<string> {
        return computed<string>(() => {
            const catalogue = messages.value[locale.value] as { metadata?: { locale?: string } } | undefined;
            return catalogue?.metadata?.locale ?? locale.value;
        });
    }

    return {
        getDateLocale,
    }
}
