import ManifestV2 from '../../model/ManifestV2';

export default class ModListTooltipManager {

    public static getTooltipText(mod: ManifestV2) {
        const arr = new Array<string>();
        if (mod.isDeprecated()) {
            arr.push("This mod is deprecated and could be broken")
        }
        if (!mod.isEnabled()) {
            arr.push("This mod will not be used in-game");
        }
        return arr.join("\n");
    }

}
