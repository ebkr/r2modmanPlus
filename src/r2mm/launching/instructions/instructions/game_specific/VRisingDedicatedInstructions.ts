import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import BepInExGameInstructions from 'src/r2mm/launching/instructions/instructions/loader/BepInExGameInstructions';

export default class VRisingDedicatedInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const bepInExArgs = await new BepInExGameInstructions().generate(game, profile);
        return {
            moddedParameters: `${bepInExArgs.moddedParameters} -persistentDataPath .\\save-data -serverName "My V Rising Server" -saveName "world1" -logFile ".\\logs\\VRisingServer.log"`,
            vanillaParameters: `${bepInExArgs.vanillaParameters} -persistentDataPath .\\save-data -serverName "My V Rising Server" -saveName "world1" -logFile ".\\logs\\VRisingServer.log"`
        };
    }

}
