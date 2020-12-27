import { Dark } from "quasar";
import ManagerSettings from "./ManagerSettings";

export default class ThemeManager {

    public static async apply () {
        const settings = await ManagerSettings.getSingleton();
        await settings.load();
        Dark.set(settings.darkTheme);
    }

}
