import * as path from "path";
import GameManager from "../../../../../src/model/game/GameManager";
import Profile from "../../../../../src/model/Profile";
import { DynamicGameInstruction } from "../../../../../src/r2mm/launching/instructions/DynamicGameInstruction";
import { CustomInstructions, ModsPathInstructions } from "../../../../../src/r2mm/launching/instructions/instructions/loader/CustomInstructions";
import MioGameInstructions from "../../../../../src/r2mm/launching/instructions/instructions/loader/MioGameInstructions";
import FsProvider from "../../../../../src/providers/generic/file/FsProvider";
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideAppWindowImplementation } from '../../../../../src/providers/node/app/app_window';
import { providePathImplementation } from '../../../../../src/providers/node/path/path';
import { TestPathProvider } from '../../../stubs/providers/node/Node.Path.Provider';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';

const game = GameManager.findByFolderName("RiskOfRain2")!;
const profile = new Profile("Default");

describe("CustomInstructions", () => {

    beforeEach(() => {
        providePathImplementation(() => TestPathProvider);
    })

    test("Returns empty launch args by default", async () => {
        const expected = {
            moddedParameterList: [],
            vanillaParameterList: []
        };

        const actual = await new CustomInstructions().generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });

    test("Handles basic strings", async () => {
        const expected = {
            moddedParameterList: ["--foo", "bar", "--baz", "-q"],
            vanillaParameterList: ["--sleep", "8"]
        };

        const actual = await new CustomInstructions(() => expected).generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });

    test("Handles dynamic instructions", async () => {
        const expected = {
            moddedParameterList: ['--bep', '@bepInExPreloaderPath'],
            vanillaParameterList: ["@profileName"]
        };

        const actualParameters = {
            moddedParameterList: ['--bep', DynamicGameInstruction.BEPINEX_PRELOADER_PATH],
            vanillaParameterList: [DynamicGameInstruction.PROFILE_NAME]
        };

        const actual = await new CustomInstructions(() => actualParameters).generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });
});

describe("ModsPathInstructions", () => {
    test("Uses predefined values", async () => {
        const expected = {
            moddedParameterList: ['--mods-path', path.join("@profileDirectory", "mods")],
            vanillaParameterList: []
        };

        const actual = await new ModsPathInstructions().generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });
});

describe("MioGameInstructions", () => {

    beforeEach(() => {
        providePathImplementation(() => TestPathProvider);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Points the loader to the profile", async () => {
        provideAppWindowImplementation(() => ({ getPlatform: () => "win32" }));
        const expected = {
            moddedParameterList: [
                "--mods-path", profile.joinToProfilePath("mods"),
                "--mods-config-path", profile.joinToProfilePath("modconfig"),
            ],
            vanillaParameterList: ["--vanilla"]
        };

        const actual = await new MioGameInstructions().generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });

    test("Uses Wine paths on Linux", async () => {
        provideAppWindowImplementation(() => ({ getPlatform: () => "linux" }));
        providePathImplementation(() => path.posix);
        FsProvider.provide(() => new InMemoryFsProvider());
        vi.spyOn(profile, "getProfilePath").mockReturnValue("/home/user/profiles/Default");
        const expected = {
            moddedParameterList: [
                "--mods-path", "Z:/home/user/profiles/Default/mods",
                "--mods-config-path", "Z:/home/user/profiles/Default/modconfig",
            ],
            vanillaParameterList: ["--vanilla"]
        };

        const actual = await new MioGameInstructions().generate(game, profile);

        expect(actual).toStrictEqual(expected);
    });
});
