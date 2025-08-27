import Game from "../../game/Game";
import {Platform} from "../../../assets/data/ecosystemTypes";
import ManagerSettings from "../../../r2mm/manager/ManagerSettings";

export enum LaunchType {
    // AUTO implies Manager determines the best option
    AUTO = "Auto",
    NATIVE = "Native",
    PROTON = "Proton",
}

export async function getLaunchType(game: Game) {
    if (game.activePlatform.storePlatform === Platform.STEAM) {
        const settings = await ManagerSettings.getSingleton(game);
        const savedLaunchType = settings.getLaunchType();
        if (savedLaunchType) {
            return savedLaunchType;
        }
    }
    return LaunchType.AUTO;
}
