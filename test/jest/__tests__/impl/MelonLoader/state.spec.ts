import Sinon from 'sinon';
import TestSetup from 'app/test/jest/__tests__/test-setup';
import MelonLoaderProfileInstaller
    from '../../../../../src/r2mm/installing/profile_installers/MelonLoaderProfileInstaller';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import VersionNumber from '../../../../../src/model/VersionNumber';
import Profile from 'src/model/Profile';
import FsProvider from 'src/providers/generic/file/FsProvider';
import ProfileProvider from 'src/providers/ror2/model_implementation/ProfileProvider';
import path from 'path';
import yaml from 'yaml';
import ModFileTracker from 'src/model/installing/ModFileTracker';
import ConflictManagementProviderImpl from 'src/r2mm/installing/ConflictManagementProviderImpl';
import StateTracker from 'src/model/installing/StateTracker';

let sandbox = Sinon.createSandbox();
let mlProfileInstaller: MelonLoaderProfileInstaller;
let conflictManagement: ConflictManagementProviderImpl;

let beforeSetup = () => {
    TestSetup.stubSetUp();
    sandbox = Sinon.createSandbox();
    mlProfileInstaller = new MelonLoaderProfileInstaller();
    conflictManagement = new ConflictManagementProviderImpl();
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

            sandbox.stub(ProfileProvider.instance);
            const profile = new Profile("stub");

            const fsStub = sandbox.stub(FsProvider.instance);
            FsProvider.provide(() => fsStub);

            fsStub.exists.withArgs(path.join(profile.getPathOfProfile(), "_state")).returns(Promise.resolve(true));
            fsStub.exists.withArgs(path.join(profile.getPathOfProfile(), "_state", `${fakeMod.getName()}-state.yml`)).returns(Promise.resolve(false));

            await mlProfileInstaller.addToStateFile(
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

            sandbox.stub(ProfileProvider.instance);
            const profile = new Profile("stub");

            const fsStub = sandbox.stub(FsProvider.instance);
            FsProvider.provide(() => fsStub);

            fsStub.exists.withArgs(path.join(profile.getPathOfProfile(), "_state", `${fakeMod.getName()}-state.yml`)).returns(Promise.resolve(true));
            files.forEach(([cached, installed]) => {
                fsStub.exists.withArgs(path.join(profile.getPathOfProfile(), installed)).returns(Promise.resolve(true));
            });

            fsStub.readFile.withArgs(path.join(profile.getPathOfProfile(), "_state", `${fakeMod.getName()}-state.yml`)).returns(Promise.resolve(Buffer.from(yaml.stringify(
                {
                    modName: fakeMod.getName(),
                    files: files
                } as ModFileTracker
            ))));

            await mlProfileInstaller.uninstallMod(fakeMod, profile);

            files.forEach(([cached, installed]) => {
                expect(fsStub.unlink.withArgs(path.join(profile.getPathOfProfile(), installed)).callCount).toBe(1);
            });
            expect(fsStub.unlink.withArgs(path.join(profile.getPathOfProfile(), "_state", `${fakeMod.getName()}-state.yml`)).callCount).toBe(1);

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
    sandbox.stub(ProfileProvider.instance);
    const profile = new Profile("stub");

    const fsStub = sandbox.stub(FsProvider.instance);
    FsProvider.provide(() => fsStub);

    // Ensure that on state file check; exists returns true.
    [modA, modB].forEach(value => {
        fsStub.exists.withArgs(path.join(profile.getPathOfProfile(), "_state", `${value.getName()}-state.yml`)).returns(Promise.resolve(true));
    });

    // Attach MSTs to readFile.
    fsStub.readFile.withArgs(path.join(profile.getPathOfProfile(), "_state", `${modA.getName()}-state.yml`))
        .returns(Promise.resolve(Buffer.from(yaml.stringify(modFileTrackerA))));

    fsStub.readFile.withArgs(path.join(profile.getPathOfProfile(), "_state", `${modB.getName()}-state.yml`))
        .returns(Promise.resolve(Buffer.from(yaml.stringify(modFileTrackerB))));

    // No need to check if file exists or not.
    fsStub.exists.withArgs(path.join(profile.getPathOfProfile(), "_state", "installation_state.yml")).returns(Promise.resolve(false));

    // No need to create state directory. Ensure no extra stubbing needed.
    fsStub.exists.withArgs(path.join(profile.getPathOfProfile(), "_state")).returns(Promise.resolve(true));

    await conflictManagement.resolveConflicts([modA, modB], profile);

    return yaml.parse(fsStub.writeFile.args[0][1] as unknown as string) as StateTracker;
}
