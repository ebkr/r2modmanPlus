import ManagerSettings from "./ManagerSettings";
import GameManager from '../../model/game/GameManager';
import { i18n } from '../../i18n/instance';

export const FALLBACK_LOCALE = 'en';
export const SYSTEM_LOCALE = 'system';

export default class LocaleManager {

    public static async apply() {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        await settings.load();

        const locale = await settings.getLocale();

        if (locale === SYSTEM_LOCALE) {
            await LocaleManager.applySystemLocale();
            return;
        }

        LocaleManager.set(locale);
    }

    public static async save(locale: string) {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        await settings.setLocale(locale);

        if (locale === SYSTEM_LOCALE) {
            await LocaleManager.applySystemLocale();
            return;
        }

        LocaleManager.set(locale);
    }

    private static async applySystemLocale() {
        try {
            const preferredLanguages = await window.electron.getPreferredSystemLanguages();
            const locale = LocaleManager.findSupportedLocale(preferredLanguages);

            LocaleManager.set(locale);
        } catch (error) {
            console.error('Failed to apply system locale:', error);
            LocaleManager.set(FALLBACK_LOCALE);
        }
    }

    private static findSupportedLocale(preferredLanguages: string[]): string {
        const availableLocales = i18n.global.availableLocales;

        for (const language of preferredLanguages) {
            const normalizedLanguage = language
                .replace('_', '-')
                .toLowerCase();

            const languageCode = normalizedLanguage.split('-')[0];

            for (const locale of availableLocales) {
                const message = i18n.global.getLocaleMessage(locale) as any;
                const metadataLocale = message?.metadata?.locale;

                if (typeof metadataLocale !== 'string') {
                    continue;
                }

                const normalizedMetadataLocale = metadataLocale
                    .replace('_', '-')
                    .toLowerCase();

                const metadataLanguageCode = normalizedMetadataLocale.split('-')[0];

                if (normalizedMetadataLocale === normalizedLanguage) {
                    return locale;
                }

                if (metadataLanguageCode === languageCode) {
                    return locale;
                }
            }
        }

        return FALLBACK_LOCALE;
    }

    private static set(locale: string | undefined) {
        i18n.global.locale.value =
            (locale !== undefined && i18n.global.availableLocales.includes(locale))
                ? locale
                : FALLBACK_LOCALE;
    }

}