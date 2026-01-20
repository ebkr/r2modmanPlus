import GameInstructionGenerator from "../GameInstructionGenerator";
import Game from "../../../../../model/game/Game";
import Profile from "../../../../../model/Profile";
import { GameInstruction } from "../../GameInstructions";
import { DynamicGameInstruction } from "../../DynamicGameInstruction";
import path from '../../../../../providers/node/path/path';

export class CustomInstructions extends GameInstructionGenerator {
    private readonly instructions: () => GameInstruction;

    constructor(instructions?: () => GameInstruction) {
        super();
        if (instructions) {
            this.instructions = instructions;
        } else {
            this.instructions = () => {
                return {
                    moddedParameterList: [],
                    vanillaParameterList: []
                };
            };
        }
    }

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return this.instructions();
    }
}

export class ModsPathInstructions extends CustomInstructions {
    constructor() {
        super(() => {
            return {
                moddedParameterList: [
                    '--mods-path',
                    path.join(DynamicGameInstruction.PROFILE_DIRECTORY, 'mods')
                ],
                vanillaParameterList: []
            };
        });
    }
}
