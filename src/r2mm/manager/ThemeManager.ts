import { Dark } from "quasar";
import ManagerSettings from "./ManagerSettings";
import GameManager from 'src/model/game/GameManager';

export default class ThemeManager {

    public static async apply () {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        await settings.load();
        Dark.set(settings.getContext().global.darkTheme);
    }

}
