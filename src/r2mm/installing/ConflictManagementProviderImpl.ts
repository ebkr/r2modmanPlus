import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import FsProvider from '../../providers/generic/file/FsProvider';
import * as path from 'path';
import yaml from 'yaml';
import ModFileTracker from '../../model/installing/ModFileTracker';
import StateTracker from '../../model/installing/StateTracker';
import Profile from '../../model/Profile';
import FileUtils from '../../utils/FileUtils';

export default class ConflictManagementProviderImpl extends ConflictManagementProvider {

    // TODO: Override files in conflict management state file to say they belong to the following mod.
    async overrideInstalledState(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        let stateFileContents: string | undefined;
        const modStateFilePath = path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`);
        if (await FsProvider.instance.exists(modStateFilePath)) {
            stateFileContents = (await FsProvider.instance.readFile(modStateFilePath)).toString();
        }
        if (stateFileContents === undefined) {
            return new R2Error(
                `Unable to find state file for ${mod.getName()}`,
                `No state file found for ${mod.getName()} at location: ${modStateFilePath}`,
                null
            );
        }
        const modState = (yaml.parse(stateFileContents) as ModFileTracker);
        const totalState = await this.getTotalState(profile);
        const modMap = new Map<string, string>(totalState.currentState);
        modState.files.forEach(([key, value]) => {
            modMap.set(value, mod.getName());
        });
        const totalStateFilePath = path.join(profile.getPathOfProfile(), "_state", "installation_state.yml");
        await FileUtils.ensureDirectory(path.dirname(totalStateFilePath));
        await FsProvider.instance.writeFile(totalStateFilePath, yaml.stringify({
            currentState: Array.from(modMap.entries())
        } as StateTracker));
    }

    // TODO: Iterate through mods array and look for anything out of place.
    async resolveConflicts(mods: ManifestV2[], profile: Profile): Promise<R2Error | void> {
        const overallState = new Map<string, string>();
        const modStates = new Map<string, ModFileTracker>();
        const modNameToManifestV2 = new Map<string, ManifestV2>();
        for (const mod of mods) {
            let stateFileContents: string | undefined;
            const modStateFilePath = path.join(profile.getPathOfProfile(), "_state", `${mod.getName()}-state.yml`);
            if (await FsProvider.instance.exists(modStateFilePath)) {
                stateFileContents = (await FsProvider.instance.readFile(modStateFilePath)).toString();
            }
            if (stateFileContents === undefined) {
                continue;
            }
            const modState: ModFileTracker = yaml.parse(stateFileContents);
            modState.files.forEach(([key, value]) => {
                if (mod.isEnabled()) {
                    overallState.set(value, mod.getName());
                } else {
                    overallState.set(value + ".manager.disabled", mod.getName());
                }
                modStates.set(mod.getName(), modState);
                modNameToManifestV2.set(mod.getName(), mod);
            });
        }
        const totalState = await this.getTotalState(profile);
        for (const file of Array.from(overallState.keys())) {
            const stateMap = new Map<string, string>(totalState.currentState);
            let copyAcross = false;
            if (!stateMap.has(file)) {
                // Need to install
                copyAcross = true;
            } else if (stateMap.get(file) !== overallState.get(file)) {
                copyAcross = true;
            } else if (!(await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), file)))) {
                copyAcross = true;
            }
            if (copyAcross) {
                const modFiles = modStates.get(overallState.get(file)!)!;
                for (const [key, value] of modFiles.files) {
                    if (value === file) {
                        await FileUtils.ensureDirectory(path.dirname(path.join(profile.getPathOfProfile(), file)));
                        if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), file))) {
                            await FsProvider.instance.unlink(path.join(profile.getPathOfProfile(), file));
                        }
                        if (!file.toLowerCase().endsWith(".manager.disabled")) {
                            await FsProvider.instance.copyFile(key, path.join(profile.getPathOfProfile(), file));
                        }
                        break;
                    }
                }
            }
        }
        const totalStateFilePath = path.join(profile.getPathOfProfile(), "_state", "installation_state.yml");
        await FileUtils.ensureDirectory(path.dirname(totalStateFilePath));
        await FsProvider.instance.writeFile(totalStateFilePath, yaml.stringify({
            currentState: Array.from(overallState.entries())
        } as StateTracker));
    }

    public async isFileActive(mod: ManifestV2, profile: Profile, file: string) {
        const state = await this.getTotalState(profile);
        for (const [stateFile, stateMod] of state.currentState) {
            if (stateFile === file) {
                 return mod.getName() === stateMod;
            }
        }
        return false;
    }

    private async getTotalState(profile: Profile): Promise<StateTracker> {
        const totalStateFilePath = path.join(profile.getPathOfProfile(), "_state", "installation_state.yml");
        let totalState: StateTracker = {
            currentState: []
        };
        if ((await FsProvider.instance.exists(totalStateFilePath))) {
            totalState = yaml.parse((await FsProvider.instance.readFile(totalStateFilePath)).toString());
        }
        return totalState;
    }

}
