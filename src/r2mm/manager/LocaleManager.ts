import ManagerSettings from "./ManagerSettings";
import GameManager from '../../model/game/GameManager';
import { i18n } from '../../i18n/instance';

export const FALLBACK_LOCALE = 'en';

export default class LocaleManager {

    public static async apply() {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        await settings.load();
        LocaleManager.set(await settings.getLocale());
    }

    public static async save(locale: string) {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        await settings.setLocale(locale);
        LocaleManager.set(locale);
    }

    private static set(locale: string | undefined) {
        i18n.global.locale.value = (locale !== undefined && i18n.global.availableLocales.includes(locale))
            ? locale
            : FALLBACK_LOCALE;
    }

}
