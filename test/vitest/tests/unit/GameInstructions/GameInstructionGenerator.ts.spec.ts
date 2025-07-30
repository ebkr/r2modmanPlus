import * as path from "path";
import GameManager from "../../../../../src/model/game/GameManager";
import Profile from "../../../../../src/model/Profile";
import { DynamicGameInstruction } from "../../../../../src/r2mm/launching/instructions/DynamicGameInstruction";
import { CustomInstructions, ModsPathInstructions } from "../../../../../src/r2mm/launching/instructions/instructions/loader/CustomInstructions";
import {describe, test, expect} from 'vitest';

const game = GameManager.findByFolderName("RiskOfRain2")!;
const profile = new Profile("Default");

describe("CustomInstructions", () => {
    test("Returns empty launch args by default", async () => {
        const expected = {
            moddedParameters: "",
            vanillaParameters: ""
        };

        const actual = await new CustomInstructions().generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });

    test("Handles basic strings", async () => {
        const expected = {
            moddedParameters: "--foo bar --baz -q",
            vanillaParameters: "--sleep 8"
        };

        const actual = await new CustomInstructions(expected).generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });

    test("Handles dynamic instructions", async () => {
        const expected = {
            moddedParameters: '--bep "@bepInExPreloaderPath"',
            vanillaParameters: "@profileName"
        };

        const actual = await new CustomInstructions({
            moddedParameters: `--bep "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"`,
            vanillaParameters: DynamicGameInstruction.PROFILE_NAME
        }).generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });
});

describe("ModsPathInstructions", () => {
    test("Uses predefined values", async () => {
        const expected = {
            moddedParameters: `--mods-path "${path.join("@profileDirectory", "mods")}"`,
            vanillaParameters: ""
        };

        const actual = await new ModsPathInstructions().generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });
});
