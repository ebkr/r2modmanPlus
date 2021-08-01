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

describe("State testing", () => {

    const sandbox = Sinon.createSandbox();
    const mlProfileInstaller = new MelonLoaderProfileInstaller();

    beforeEach(() => {
        sandbox.reset();
        TestSetup.stubSetUp();
    });

    afterEach(() => {
        sandbox.restore();
    })

    test("Adding state file", async () => {
        const fakeMod = new ManifestV2();
        fakeMod.setAuthorName("Author");
        fakeMod.setDisplayName("Mod");
        fakeMod.setName("Author-Mod");
        fakeMod.setVersionNumber(new VersionNumber("1.0.0"));
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

});
