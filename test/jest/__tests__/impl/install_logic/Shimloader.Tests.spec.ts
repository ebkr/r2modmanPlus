import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../../stubs/providers/InMemory.FsProvider';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import * as path from 'path';
import VersionNumber from '../../../../../src/model/VersionNumber';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import Profile from '../../../../../src/model/Profile';
import ProfileProvider from '../../../../../src/providers/ror2/model_implementation/ProfileProvider';
import ProfileInstallerProvider from '../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import GameManager from 'src/model/game/GameManager';
import GenericProfileInstaller from 'src/r2mm/installing/profile_installers/GenericProfileInstaller';
import InstallationRuleApplicator from 'src/r2mm/installing/default_installation_rules/InstallationRuleApplicator';
import ConflictManagementProvider from 'src/providers/generic/installing/ConflictManagementProvider';
import ConflictManagementProviderImpl from 'src/r2mm/installing/ConflictManagementProviderImpl';

class ProfileProviderImpl extends ProfileProvider {
    ensureProfileDirectory(directory: string, profile: string): void {
        FsProvider.instance.mkdirs(path.join(directory, profile));
    }
}

const createManifest = (name: string, author: string, version: VersionNumber): ManifestV2 => {
    return new ManifestV2().make({
        ManifestVersion: 2,
        AuthorName: author,
        Name: `${author}-${name}`,
        DisplayName: name,
        Version: version.toString(),
    }) as ManifestV2;
};

describe('Installer Tests', () => {

    describe('Shimloader Package', () => {

        beforeEach(() => {
            const inMemoryFs = new InMemoryFsProvider();
            FsProvider.provide(() => inMemoryFs);
            InMemoryFsProvider.clear();
            PathResolver.MOD_ROOT = 'MODS';
            inMemoryFs.mkdirs(PathResolver.MOD_ROOT);
            ProfileProvider.provide(() => new ProfileProviderImpl());
            new Profile('TestProfile');
            inMemoryFs.mkdirs(Profile.getActiveProfile().getPathOfProfile());
            GameManager.activeGame = GameManager.gameList.find(value => value.internalFolderName === "Palworld")!;
            InstallationRuleApplicator.apply();
            ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
            InMemoryFsProvider.setMatchMode("CASE_SENSITIVE");
        });

        test('Shimloader Package', async () => {
            const fs = FsProvider.instance;
            const pkg = createManifest("test_mod", "auth", new VersionNumber("1.0.0"));
            const name = pkg.getName();

            const sourceToExpectedDestination = {
                "README.md": `shimloader/mod/${name}/README.md`,
                "manifest.json": `shimloader/mod/${name}/manifest.json`,
                "icon.png": `shimloader/mod/${name}/icon.png`,
                "pak/blueprint.pak": `shimloader/pak/${name}/blueprint.pak`,
                "mod/scripts/main.lua": `shimloader/mod/${name}/scripts/main.lua`,
                "mod/scripts/other.lua": `shimloader/mod/${name}/scripts/other.lua`,
                "mod/dll/mod.dll": `shimloader/mod/${name}/dll/mod.dll`,
                "cfg/package.cfg": `shimloader/cfg/package.cfg`,
            };
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, "cache", pkg.getName(), pkg.getVersionNumber().toString());
            await fs.mkdirs(cachePkgRoot);

            for (const sourcePath in sourceToExpectedDestination) {
                const destPath = path.join(cachePkgRoot, sourcePath);
                await fs.mkdirs(path.dirname(destPath));
                await fs.writeFile(destPath, "");
                expect(await fs.exists(destPath));
            }

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());
            const profilePath = Profile.getActiveProfile().getPathOfProfile();

            // Purely to make debugging easier if & when the test fails
            async function getTree(target: string) {
                const result: string[] = [];
                for (const entry of (await fs.readdir(target))) {
                    const fullPath = path.join(target, entry);
                    if ((await fs.stat(fullPath)).isDirectory()) {
                        for (const subPath of (await getTree(fullPath))) {
                            result.push(subPath);
                        }
                    } else {
                        result.push(fullPath);
                    }
                }
                return result;
            }
            console.log(JSON.stringify(await getTree(profilePath), null, 2));

            for (const destPath of Object.values(sourceToExpectedDestination)) {
                expect(await fs.exists(path.join(profilePath, destPath))).toBeTruthy();
            }
        });
    });
});
