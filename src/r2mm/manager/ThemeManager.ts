import { Dark } from "quasar";
import ManagerSettings from "./ManagerSettings";
import GameManager from '../../model/game/GameManager';
import { i18n } from '../../i18n/instance';

export default class ThemeManager {

    public static async apply () {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        await settings.load();
        Dark.set(settings.getContext().global.darkTheme);
        const savedLanguage = settings.getContext().global.language || 'en';
        i18n.global.locale.value = savedLanguage;
    }

}
