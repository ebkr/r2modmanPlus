import * as path from "path";

import InMemoryFsProvider from "../stubs/providers/InMemory.FsProvider";
import GameManager from "../../../../src/model/game/GameManager";
import { StorePlatform } from "../../../../src/model/game/StorePlatform";
import Profile, { ImmutableProfile } from "../../../../src/model/Profile";
import FsProvider from "../../../../src/providers/generic/file/FsProvider";
import ProfileProvider from "../../../../src/providers/ror2/model_implementation/ProfileProvider";


class ProfileProviderImpl extends ProfileProvider {
    ensureProfileDirectory(directory: string, profile: string): void {
        FsProvider.instance.mkdirs(path.join(directory, profile));
    }
}

function activateGame(name: string) {
    const game = GameManager.gameList.find(value => value.internalFolderName === name);

    if (!game) {
        throw new Error(`Unknown Game "${name}"`);
    }

    GameManager.activate(game, StorePlatform.STEAM);
}

describe("ImmutableProfile", () => {
    beforeAll(async () => {
        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        InMemoryFsProvider.clear();

        ProfileProvider.provide(() => new ProfileProviderImpl());
    });

    it("Initializing ImmutableProfile doesn't affect Profile", () => {
        activateGame("RiskOfRain2");
        new Profile("ActiveProfile");
        const immutable = new ImmutableProfile("Immutable");

        expect(immutable.getProfileName()).toStrictEqual("Immutable");
        expect(immutable.getPathOfProfile()).toMatch(/Immutable$/);
        expect(Profile.getActiveProfile().getProfileName()).toStrictEqual("ActiveProfile");
        expect(Profile.getActiveProfile().getPathOfProfile()).toMatch(/ActiveProfile$/);
    });
});

describe("Profile", () => {

    beforeAll(async () => {
        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        InMemoryFsProvider.clear();

        ProfileProvider.provide(() => new ProfileProviderImpl());
    });

    it("Initializing Profile doesn't affect ImmutableProfile", () => {
        activateGame("RiskOfRain2");
        const immutable = new ImmutableProfile("Immutable");
        new Profile("ActiveProfile");

        expect(immutable.getProfileName()).toStrictEqual("Immutable");
        expect(immutable.getPathOfProfile()).toMatch(/Immutable$/);
        expect(Profile.getActiveProfile().getProfileName()).toStrictEqual("ActiveProfile");
        expect(Profile.getActiveProfile().getPathOfProfile()).toMatch(/ActiveProfile$/);
    });
});
