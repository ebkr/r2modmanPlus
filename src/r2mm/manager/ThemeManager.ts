import ManagerSettings from "./ManagerSettings";
import { isNull, isUndefined } from "util";

let darkThemeNode: any = undefined;

export default class ThemeManager {

    public static apply() {
        const settings = new ManagerSettings();
        settings.load();
        if (!settings.darkTheme) {
            const node = document.getElementById('darkThemeStyle');
            if (!isNull(node)) {
                darkThemeNode = node;
                node.remove();
            }
        } else {
            if (!isUndefined(darkThemeNode)) {
                document.head.appendChild(darkThemeNode);
            }
        }
    }

}