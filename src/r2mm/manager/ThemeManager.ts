import { Dark } from "quasar";
import ManagerSettings from "./ManagerSettings";

export default class ThemeManager {

    public static apply () {
        const settings = ManagerSettings.getSingleton();
        Dark.set(settings.darkTheme);
    }

}
