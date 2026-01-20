import GameInstructionGenerator from "../GameInstructionGenerator";
import { GameInstruction } from "../../GameInstructions";
import Game from "src/model/game/Game";
import Profile from "src/model/Profile";

export default class RivetGameInstructions extends GameInstructionGenerator {
    /*
    Rivet parses arguments in the following formats:

    -key value
    -key=value
    -key (for boolean flags, equivalent to -key true)

    Supported keys are:
    rivetEnable (bool): enable or disable Rivet Doorstop for this launch. Overrides Doorstop.enable.
    rivetLog (string): path to the log file. Overrides Doorstop.log.
    rivetTarget (string): name or path of the target DLL to load. Overrides Doorstop.target.
    rivetHideConsole (bool): hide the Rivet console window. Overrides Doorstop.hideConsole.
    rivetSaveConfig (bool): when true, save the effective configuration back to Rivet.ini.
    rivetDirectory (string): mods directory. Overrides Loader.directory.

    Example command line:
    -rivetEnable true -rivetTarget rivet.dll -rivetDirectory Mods -rivetLog rivet.log
    */

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `-rivetEnable true -rivetTarget ${profile.joinToProfilePath("Rivet", "Loader.dll")} -rivetDirectory ${profile.joinToProfilePath("Rivet", "Mods")}`,
            vanillaParameters: `-rivetEnable false`
        }
    }
}