import GameInstructionGenerator from "../GameInstructionGenerator";
import Game from "../../../../../model/game/Game";
import Profile from "../../../../../model/Profile";
import * as path from 'path';
import { GameInstruction } from "../../GameInstructions";
import { DynamicGameInstruction } from "../../DynamicGameInstruction";

export class CustomInstructions extends GameInstructionGenerator {
    private readonly instructions: GameInstruction;

    constructor(instructions?: GameInstruction) {
        super();
        this.instructions = instructions || {
            moddedParameters: '',
            vanillaParameters: ''
        };
    }

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return this.instructions;
    }
}

export class ModsPathInstructions extends CustomInstructions {
    constructor() {
        super({
            moddedParameters: `--mods-path "${path.join(DynamicGameInstruction.PROFILE_DIRECTORY, "mods")}"`,
            vanillaParameters: ''
        });
    }
}
