import GameInstructionGenerator from "../../instructions/GameInstructionGenerator";
import Game from "../../../../../model/game/Game";
import Profile from "../../../../../model/Profile";
import { GameInstruction } from "../../GameInstructions";
import path from "path";

export class NickelGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const profileDir = profile.getPathOfProfile();
        const modDir = path.join(profileDir, "ModLibrary");
        const saveDir = path.join(profileDir, "ModSaves");

        return {
            moddedParameters: `--modsPath ${modDir} --savePath ${saveDir} --initSteam`,
            vanillaParameters: "--vanilla --initSteam"
        }
    }
}
