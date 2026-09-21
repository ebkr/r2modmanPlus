import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue';
import { useI18n } from 'vue-i18n';

import SearchUtils from '../../utils/SearchUtils';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

export type SettingSearchPhrases = MaybeRefOrGetter<(string | undefined | null)[]>;

function isNonEmptyPhrase(phrase: string | undefined | null): phrase is string {
    return phrase !== null && phrase !== undefined && phrase !== '';
}

export function useSettingSearch(
    searchTerm: MaybeRefOrGetter<string | undefined>,
    termsKey: string,
    extraPhrases?: SettingSearchPhrases
): { isVisible: ComputedRef<boolean> } {
    const store = getStore<State>();
    const { tm, rt } = useI18n();

    const localisedPhrases = computed<string[]>(() => {
        const phrases = tm(termsKey) as unknown[];
        const named = { gameName: store.state.activeGame.displayName };
        return Array.isArray(phrases) ? phrases.map((phrase) => rt(phrase as string, named)) : [];
    });

    const isVisible = computed<boolean>(() => {
        const activeSearchTerm = toValue(searchTerm);
        if (!activeSearchTerm) {
            return true;
        }

        const searchKeys = SearchUtils.makeKeys(activeSearchTerm);

        const resolvedPhrases = [...localisedPhrases.value, ...(toValue(extraPhrases) ?? [])];
        const searchableText = resolvedPhrases.filter(isNonEmptyPhrase).join(' ');

        return SearchUtils.isSearched(searchKeys, searchableText);
    });

    return { isVisible };
}
