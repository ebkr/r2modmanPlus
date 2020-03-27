import ManagerSettings from "./ManagerSettings";
import { isNull, isUndefined } from "util";

let darkThemeNode: any = undefined;

export default class ThemeManager {

    public static apply() {
        const settings = new ManagerSettings();
        settings.load();
        if (!settings.darkTheme) {
            document.head.childNodes.forEach(node => {
                if (!isNull(node.textContent)) {
                    if (node.textContent.startsWith('/*! bulmaswatch')) {
                        // Is dark theme
                        darkThemeNode = node;
                        node.remove();
                    }
                }
            });
        } else {
            if (!isUndefined(darkThemeNode)) {
                document.head.appendChild(darkThemeNode);
            }
        }
    }

}