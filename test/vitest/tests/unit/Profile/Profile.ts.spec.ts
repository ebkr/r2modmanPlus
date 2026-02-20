import * as path from 'path';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import GameManager from '../../../../../src/model/game/GameManager';
import Profile, { ImmutableProfile } from '../../../../../src/model/Profile';
import { Platform } from '../../../../../src/model/schema/ThunderstoreSchema';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import ProfileProvider from '../../../../../src/providers/ror2/model_implementation/ProfileProvider';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import { beforeAll, describe, expect, test } from 'vitest';
import { replaceEcosystemWithRealData } from '../../../utils/EcosystemTestHandler';
import { providePathImplementation } from '../../../../../src/providers/node/path/path';
import { TestPathProvider } from '../../../stubs/providers/node/Node.Path.Provider';


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
    GameManager.activate(game, Platform.STEAM);
}

describe("ImmutableProfile", () => {

    beforeAll(async () => {
        replaceEcosystemWithRealData();
        providePathImplementation(() => TestPathProvider);
        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        ProfileProvider.provide(() => new ProfileProviderImpl());
        InMemoryFsProvider.clear();
    });

    test("Initializing ImmutableProfile doesn't affect Profile", () => {
        activateGame("RiskOfRain2");
        new Profile("ActiveProfile");
        const immutable = new ImmutableProfile("Immutable");

        expect(immutable.getProfileName()).toStrictEqual("Immutable");
        expect(immutable.getProfilePath()).toMatch(/Immutable$/);
        expect(Profile.getActiveProfile().getProfileName()).toStrictEqual("ActiveProfile");
        expect(Profile.getActiveProfile().getProfilePath()).toMatch(/ActiveProfile$/);
    });

    test("joinToProfilePath is immutable if active game changes", () => {
        activateGame("Valheim");
        const profile = new ImmutableProfile("MyProfile");
        const expected = path.join(PathResolver.MOD_ROOT, "profiles", "MyProfile", "foo", "bar");
        let actual = profile.joinToProfilePath("foo", "bar");
        expect(expected).toStrictEqual(actual);

        activateGame("GTFO");
        actual = profile.joinToProfilePath("foo", "bar");
        expect(expected).toStrictEqual(actual);
    });

    test("joinToProfilePath is immutable if active profile changes", () => {
        activateGame("Valheim");
        const profile = new ImmutableProfile("MyProfile");
        const expected = path.join(PathResolver.MOD_ROOT, "profiles", "MyProfile", "BepInEx");
        let actual = profile.joinToProfilePath("BepInEx");
        expect(expected).toStrictEqual(actual);

        new Profile("NewActiveProfile")
        actual = profile.joinToProfilePath("BepInEx");
        expect(expected).toStrictEqual(actual);
    });
});

describe("Profile", () => {

    beforeAll(async () => {
        providePathImplementation(() => TestPathProvider);
        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        InMemoryFsProvider.clear();

        ProfileProvider.provide(() => new ProfileProviderImpl());
    });

    test("Initializing Profile doesn't affect ImmutableProfile", () => {
        activateGame("RiskOfRain2");
        const immutable = new ImmutableProfile("Immutable");
        new Profile("ActiveProfile");

        expect(immutable.getProfileName()).toStrictEqual("Immutable");
        expect(immutable.getProfilePath()).toMatch(/Immutable$/);
        expect(Profile.getActiveProfile().getProfileName()).toStrictEqual("ActiveProfile");
        expect(Profile.getActiveProfile().getProfilePath()).toMatch(/ActiveProfile$/);
    });

    // Active game shouldn't change without the active profile resetting but test
    // the cases separately anyway for better granularity.
    test("joinToProfilePath mutates if active game changes", () => {
        activateGame("Valheim");
        new Profile("Original");
        let expected = path.join(PathResolver.MOD_ROOT, "profiles", "Original", "foo", "bar");
        let actual = Profile.getActiveProfile().joinToProfilePath("foo", "bar");
        expect(expected).toStrictEqual(actual);

        activateGame("GTFO");
        expected = path.join(PathResolver.MOD_ROOT, "profiles", "Original", "foo", "bar");
        actual = Profile.getActiveProfile().joinToProfilePath("foo", "bar");
        expect(expected).toStrictEqual(actual);
    });

    test("joinToProfilePath mutates if active profile changes", () => {
        activateGame("Valheim");
        new Profile("MyProfile");
        let expected = path.join(PathResolver.MOD_ROOT, "profiles", "MyProfile", "BepInEx");
        let actual = Profile.getActiveProfile().joinToProfilePath("BepInEx");
        expect(expected).toStrictEqual(actual);

        new Profile("new-active-profile")
        expected = path.join(PathResolver.MOD_ROOT, "profiles", "new-active-profile", "BepInEx");
        actual = Profile.getActiveProfile().joinToProfilePath("BepInEx");
        expect(expected).toStrictEqual(actual);
    });
});
