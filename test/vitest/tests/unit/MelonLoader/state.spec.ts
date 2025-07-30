import Sinon from 'sinon';
import TestSetup from '../../test-setup';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import VersionNumber from '../../../../../src/model/VersionNumber';
import Profile, { ImmutableProfile } from 'src/model/Profile';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import ProfileProvider from '../../../../../src/providers/ror2/model_implementation/ProfileProvider';
import yaml from 'yaml';
import ModFileTracker from '../../../../../src/model/installing/ModFileTracker';
import ConflictManagementProviderImpl from '../../../../../src/r2mm/installing/ConflictManagementProviderImpl';
import StateTracker from '../../../../../src/model/installing/StateTracker';
import GenericProfileInstaller from '../../../../../src/r2mm/installing/profile_installers/GenericProfileInstaller';
import GameManager from '../../../../../src/model/game/GameManager';
import ConflictManagementProvider from '../../../../../src/providers/generic/installing/ConflictManagementProvider';
import { addToStateFile } from '../../../../../src/installers/InstallRuleInstaller';
import { describe, beforeEach, afterEach, test, expect } from 'vitest';
import {providePathImplementation} from "../../../../../src/providers/node/path/path";
import {TestPathProvider} from "../../../stubs/providers/node/Node.Path.Provider";
import StubProfileProvider from '../../../stubs/providers/stub.ProfileProvider';

providePathImplementation(() => TestPathProvider);

let sandbox = Sinon.createSandbox();
let mlProfileInstaller: GenericProfileInstaller;
let conflictManagement: ConflictManagementProviderImpl;

let beforeSetup = () => {
    TestSetup.stubSetUp();
    sandbox = Sinon.createSandbox();
    mlProfileInstaller = new GenericProfileInstaller();
    conflictManagement = new ConflictManagementProviderImpl();
    GameManager.activeGame = GameManager.gameList.find(value => value.internalFolderName === "BONEWORKS")!;
    ConflictManagementProvider.provide(() => conflictManagement);

    const profileProvider = new StubProfileProvider();
    const stubbedProfileProvider = sandbox.stub(profileProvider);
    ProfileProvider.provide(() => stubbedProfileProvider);
}

describe("State testing", () => {

    describe("State file", () => {

        beforeEach(beforeSetup);
        afterEach(() => {
            sandbox.restore();
        });

        // File should be created with the correct contents.
        test("Adding state file", async () => {
            const fakeMod = createMod("Author", "Mod", "1.0.0");
            const files: [string, string][] = [["cachedFileA", "fileInstallLocationA"], ["cachedFileB", "fileInstallLocationB"]];
            const fileMap = new Map<string, string>(files);

            process.stdout.write(`profile instance: ${!!ProfileProvider.instance}\n`);
            const profile = new ImmutableProfile("stub");

            const fsStub = sandbox.stub(FsProvider.instance);
            FsProvider.provide(() => fsStub);

            fsStub.exists.withArgs(profile.joinToProfilePath("_state")).returns(Promise.resolve(true));
            fsStub.exists.withArgs(profile.joinToProfilePath("_state", `${fakeMod.getName()}-state.yml`)).returns(Promise.resolve(false));

            await addToStateFile(
                fakeMod,
                fileMap,
                profile
            );

            const out = fsStub.writeFile.args[0][1] as unknown as string;
            const parsed = yaml.parse(out) as ModFileTracker;
            expect(parsed.modName).toBe(fakeMod.getName());
            // JSON serialization for speed comparison
            expect(JSON.stringify(parsed.files)).toBe(JSON.stringify(files));
        });

        // Files recorded in state should be removed.
        // Once files are removed, state should be deleted as no longer relevant.
        test("Removing state file", async () => {
            const fakeMod = createMod("Author", "Mod", "1.0.0");
            const files: [string, string][] = [["cachedFileA", "fileInstallLocationA"], ["cachedFileB", "fileInstallLocationB"]];

            const profile = new ImmutableProfile("stub");

            const fsStub = sandbox.stub(FsProvider.instance);
            FsProvider.provide(() => fsStub);

            fsStub.exists.withArgs(profile.joinToProfilePath("_state", `${fakeMod.getName()}-state.yml`)).returns(Promise.resolve(true));
            files.forEach(([cached, installed]) => {
                fsStub.exists.withArgs(profile.joinToProfilePath(installed)).returns(Promise.resolve(true));
            });

            fsStub.readFile.withArgs(profile.joinToProfilePath("_state", `${fakeMod.getName()}-state.yml`)).returns(Promise.resolve(Buffer.from(yaml.stringify(
                {
                    modName: fakeMod.getName(),
                    files: files
                } as ModFileTracker
            ))));

            fsStub.readdir.returns(Promise.resolve([]));

            await mlProfileInstaller.uninstallMod(fakeMod, profile);

            files.forEach(([cached, installed]) => {
                expect(fsStub.unlink.withArgs(profile.joinToProfilePath(installed)).callCount).toBe(1);
            });
            expect(fsStub.unlink.withArgs(profile.joinToProfilePath("_state", `${fakeMod.getName()}-state.yml`)).callCount).toBe(1);

        });
    });

    describe("Conflict resolution", () => {

        beforeEach(beforeSetup);
        afterEach(() => {
            sandbox.restore();
        });

        // Assume conflict resolution is optimal.
        // No change should be expected.
        test("Ordinary state", async () => {

            const modA = createMod("Author", "ModA", "1.0.0");
            const modB = createMod("Author", "ModB", "1.2.1");

            // Create ModStateTrackers.
            const modFileTrackerA: ModFileTracker = {
                modName: modA.getName(),
                files: [["cacheA", "realA"]]
            }

            const modFileTrackerB: ModFileTracker = {
                modName: modB.getName(),
                files: [["cacheB", "realB"]]
            }

            const outputState = await processConflictManagement(modA, modFileTrackerA, modB, modFileTrackerB);

            expect(outputState.currentState.join(",")).toBe([[modFileTrackerA.files[0][1], modA.getName()], [modFileTrackerB.files[0][1], modB.getName()]].join(","));

        });

        // Replicates a scenario where two mods share the same file.
        // In this case, the higher priority files should be reflected in the finalized state.
        test("New files have higher priority", async () => {

            const modA = createMod("Author", "ModA", "1.0.0");
            const modB = createMod("Author", "ModB", "1.2.1");

            // Create ModStateTrackers.
            const modFileTrackerA: ModFileTracker = {
                modName: modA.getName(),
                files: [["cacheA", "real"]]
            }

            const modFileTrackerB: ModFileTracker = {
                modName: modB.getName(),
                files: [["cacheB", "real"]]
            }

            const outputState = await processConflictManagement(modA, modFileTrackerA, modB, modFileTrackerB);

            expect(outputState.currentState.join(",")).toBe([[modFileTrackerB.files[0][1], modB.getName()]].join(","));
        });

        // If a mod is disabled, the mod files should not exist if highest priority for those files.
        test("Disabled mod file is ignored in new state", async () => {
            const modA = createMod("Author", "ModA", "1.0.0");
            const modB = createMod("Author", "ModB", "1.2.1");

            modA.disable();

            // Create ModStateTrackers.
            const modFileTrackerA: ModFileTracker = {
                modName: modA.getName(),
                files: [["cacheA", "realA"]]
            }

            const modFileTrackerB: ModFileTracker = {
                modName: modB.getName(),
                files: [["cacheB", "realB"]]
            }

            const outputState = await processConflictManagement(modA, modFileTrackerA, modB, modFileTrackerB);

            expect(outputState.currentState.join(",")).toBe([[`${modFileTrackerA.files[0][1]}.manager.disabled`, modA.getName()], [modFileTrackerB.files[0][1], modB.getName()]].join(","));
        });

        // If a mod is disabled, any lower priority files should not be overwritten.
        test("Disabled mod file is does not overwrite lower priority if disabled", async () => {
            const modA = createMod("Author", "ModA", "1.0.0");
            const modB = createMod("Author", "ModB", "1.2.1");

            modB.disable();

            // Create ModStateTrackers.
            const modFileTrackerA: ModFileTracker = {
                modName: modA.getName(),
                files: [["cacheA", "A"]]
            }

            const modFileTrackerB: ModFileTracker = {
                modName: modB.getName(),
                files: [["cacheB", "B"]]
            }

            const outputState = await processConflictManagement(modA, modFileTrackerA, modB, modFileTrackerB);

            expect(outputState.currentState.join(",")).toBe([[modFileTrackerA.files[0][1], modA.getName()], [`${modFileTrackerB.files[0][1]}.manager.disabled`, modB.getName()]].join(","));
        });

    });

});

let createMod = (author: string, name: string, versionNumber: string) => {
    const mod = new ManifestV2();
    mod.setAuthorName(author);
    mod.setDisplayName(name)
    mod.setName(`${author}-${name}`);
    mod.setVersionNumber(new VersionNumber(versionNumber));
    return mod;
}

let processConflictManagement = async (modA: ManifestV2, modFileTrackerA: ModFileTracker, modB: ManifestV2, modFileTrackerB: ModFileTracker): Promise<StateTracker> => {
    const profile = new Profile("stub");

    const fsStub = sandbox.stub(FsProvider.instance);
    FsProvider.provide(() => fsStub);

    // Ensure that on state file check; exists returns true.
    [modA, modB].forEach(value => {
        fsStub.exists.withArgs(profile.joinToProfilePath("_state", `${value.getName()}-state.yml`)).returns(Promise.resolve(true));
    });

    // Attach MSTs to readFile.
    fsStub.readFile.withArgs(profile.joinToProfilePath("_state", `${modA.getName()}-state.yml`))
        .returns(Promise.resolve(Buffer.from(yaml.stringify(modFileTrackerA))));

    fsStub.readFile.withArgs(profile.joinToProfilePath("_state", `${modB.getName()}-state.yml`))
        .returns(Promise.resolve(Buffer.from(yaml.stringify(modFileTrackerB))));

    // No need to check if file exists or not.
    fsStub.exists.withArgs(profile.joinToProfilePath("_state", "installation_state.yml")).returns(Promise.resolve(false));

    // No need to create state directory. Ensure no extra stubbing needed.
    fsStub.exists.withArgs(profile.joinToProfilePath("_state")).returns(Promise.resolve(true));

    await conflictManagement.resolveConflicts([modA, modB], profile.asImmutableProfile());

    return yaml.parse(fsStub.writeFile.args[0][1] as unknown as string) as StateTracker;
}
