import * as yaml from 'yaml';
import Profile from '../../model/Profile';

import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import FileNotFoundError from '../../model/errors/FileNotFoundError';
import R2Error from '../../model/errors/R2Error';
import YamlParseError from '../../model/errors/Yaml/YamlParseError';
import YamlConvertError from '../../model/errors/Yaml/YamlConvertError';
import FileWriteError from '../../model/errors/FileWriteError';
import ManifestV2 from '../../model/ManifestV2';
import ExportFormat from '../../model/exports/ExportFormat';
import ExportMod from '../../model/exports/ExportMod';
import PathResolver from '../manager/PathResolver';
import ZipProvider from '../../providers/generic/zip/ZipProvider';
import Axios from 'axios';
import FileUtils from '../../utils/FileUtils';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import LinkProvider from '../../providers/components/LinkProvider';
import AsyncLock from 'async-lock';
import { BEPINEX_VARIANTS } from '../installing/ProfileInstaller';
import GameManager from 'src/model/game/GameManager';

export default class ProfileModList {

    private static lock = new AsyncLock();

    public static async requestLock(fn: () => any) {
        return this.lock.acquire("acquire", fn);
    }

    public static async getModList(profile: Profile): Promise<ManifestV2[] | R2Error> {
        const fs = FsProvider.instance;
        if (!await fs.exists(path.join(profile.getPathOfProfile(), 'mods.yml'))) {
            await fs.writeFile(path.join(profile.getPathOfProfile(), 'mods.yml'), JSON.stringify([]));
        }
        try {
            try {
                return await fs.readFile(path.join(profile.getPathOfProfile(), 'mods.yml'))
                    .then(value => value.toString())
                    .then(value => {
                        return yaml.parse(value)
                            .map((mod: ManifestV2) => new ManifestV2().fromReactive(mod))
                            .map((mod: ManifestV2) => {
                                if (
                                    BEPINEX_VARIANTS[GameManager.activeGame.internalFolderName]
                                        .find(x => x.packageName === mod.getName()) !== undefined
                                ) // BepInEx is not a plugin, and the only place where we can get its icon is from the cache
                                    mod.setIcon(path.resolve(profile.getPathOfProfile(), "BepInEx", "core", "icon.png"));
                                else
                                    mod.setIcon(path.resolve(profile.getPathOfProfile(), "BepInEx", "plugins", mod.getName(), "icon.png"));
                                return mod;
                            });
                    });
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    `Failed to parse yaml file of profile: ${profile.getProfileName()}/mods.yml`,
                    err.message,
                    null
                );
            }
        } catch(e) {
            const err: Error = e;
            return new FileNotFoundError(
                'Unable to locate file',
                err.message,
                null
            )
        }
    }

    private static async saveModList(profile: Profile, modList: ManifestV2[]): Promise<R2Error | null> {
        const fs = FsProvider.instance;
        try {
            const yamlModList: string = yaml.stringify(modList);
            try {
                await fs.writeFile(
                    path.join(profile.getPathOfProfile(), 'mods.yml'),
                    yamlModList
                );
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to create mods.yml for profile: ${profile.getProfileName()}`,
                    err.message,
                    `Try running ${ManagerInformation.APP_NAME} as an administrator`
                )
            }
        } catch(e) {
            const err: Error = e;
            return new YamlConvertError(
                'Failed to convert modList to yaml',
                err.message,
                null
            );
        }
        return null;
    }

    public static async addMod(mod: ManifestV2, profile: Profile): Promise<ManifestV2[] | R2Error> {
        let currentModList: ManifestV2[] | R2Error = await this.getModList(profile);
        if (currentModList instanceof R2Error) {
            currentModList = [];
        }
        const modIndex: number = currentModList.findIndex((search: ManifestV2) => search.getName() === mod.getName());
        await this.removeMod(mod, profile);
        currentModList = await this.getModList(profile);
        if (currentModList instanceof R2Error) {
            currentModList = [];
        }
        if (modIndex >= 0) {
            currentModList.splice(modIndex, 0, mod);
        } else {
            currentModList.push(mod);
        }
        const saveError: R2Error | null = await this.saveModList(profile, currentModList);
        if (saveError !== null) {
            return saveError;
        }
        // Return mod list, or R2 error. We don't care at this point as this is handled elsewhere.
        return this.getModList(profile);
    }

    public static async removeMod(mod: ManifestV2, profile: Profile): Promise<ManifestV2[] | R2Error> {
        const currentModList: ManifestV2[] | R2Error = await this.getModList(profile);
        if (currentModList instanceof R2Error) {
            return currentModList;
        }
        const newModList = currentModList.filter((m: ManifestV2) => m.getName() !== mod.getName());
        const saveError: R2Error | null = await this.saveModList(profile, newModList);
        if (saveError !== null) {
            return saveError;
        }
        // Return mod list, or R2 error. We don't care at this point.
        return this.getModList(profile);
    }

    public static async updateMods(mods: ManifestV2[], profile: Profile, apply: (mod: ManifestV2) => void): Promise<ManifestV2[] | R2Error> {
        const list: ManifestV2[] | R2Error = await this.getModList(profile);
        if (list instanceof R2Error) {
            return list;
        }
        for (let mod of mods) {
            list.filter((filteringMod: ManifestV2) => filteringMod.getName() === mod.getName())
                .forEach((filteringMod: ManifestV2) => {
                    apply(filteringMod);
                });
        }
        const saveErr = await this.saveModList(profile, list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(profile);
    }

    public static async updateMod(mod: ManifestV2, profile: Profile, apply: (mod: ManifestV2) => void): Promise<ManifestV2[] | R2Error> {
        const list: ManifestV2[] | R2Error = await this.getModList(profile);
        if (list instanceof R2Error) {
            return list;
        }
        list.filter((filteringMod: ManifestV2) => filteringMod.getName() === mod.getName())
            .forEach((filteringMod: ManifestV2) => {
                apply(filteringMod);
            });
        const saveErr = await this.saveModList(profile, list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(profile);
    }

    public static async exportModListToFile(profile: Profile): Promise<R2Error | string> {
        const exportDirectory = path.join(PathResolver.MOD_ROOT, 'exports');
        try {
            await FileUtils.ensureDirectory(exportDirectory);
        } catch(e) {
            const err: Error = e;
            return new R2Error('Failed to ensure directory exists', err.message,
                `Try running ${ManagerInformation.APP_NAME} as an administrator`);
        }
        const list: ManifestV2[] | R2Error = await this.getModList(profile);
        if (list instanceof R2Error) {
            return list;
        }
        const exportModList: ExportMod[] = list.map((manifestMod: ManifestV2) => ExportMod.fromManifest(manifestMod));
        const exportFormat = new ExportFormat(profile.getProfileName(), exportModList);
        const exportPath = path.join(exportDirectory, `${profile.getProfileName()}.r2z`);
        const builder = ZipProvider.instance.zipBuilder();
        await builder.addBuffer("export.r2x", Buffer.from(yaml.stringify(exportFormat)));
        await builder.addFolder("config", path.join(profile.getPathOfProfile(), 'BepInEx', 'config'));
        await builder.createZip(exportPath);
        return exportPath;
    }

    public static async exportModList(profile: Profile): Promise<R2Error | void> {
        const exportResult: R2Error | string = await this.exportModListToFile(profile);
        if (exportResult instanceof R2Error) {
            return exportResult;
        } else {
            LinkProvider.instance.selectFile(exportResult);
        }
    }

    public static async exportModListAsCode(profile: Profile, callback: (code: string, err: R2Error | null) => void): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        const exportResult: R2Error | string = await this.exportModListToFile(profile);
        if (exportResult instanceof R2Error) {
            return exportResult;
        } else {
            const profileBuffer = '#r2modman\n' + (await fs.base64FromZip(exportResult));
            Axios.post('https://r2modman-hastebin.herokuapp.com/documents', profileBuffer)
                .then(resp => callback(resp.data.key, null))
                .catch(e => {
                    const err: Error = e;
                    callback('', new R2Error('Failed to export profile', err.message, null));
                });
        }
    }

    public static async shiftModEntryUp(mod: ManifestV2, profile: Profile): Promise<ManifestV2[] | R2Error> {
        let list: ManifestV2[] | R2Error = await this.getModList(profile);
        if (list instanceof R2Error) {
            return list;
        }
        const index = list.findIndex((stored: ManifestV2) => stored.getName() === mod.getName())
        if (index === 0) {
            return list;
        } else {
            list = list.filter((stored: ManifestV2) => stored.getName() !== mod.getName());
            const start = list.slice(0, index - 1);
            const end = list.slice(index - 1);
            list = [...start, mod, ...end];
        }
        const saveErr = await this.saveModList(profile, list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(profile);
    }

    public static async shiftModEntryDown(mod: ManifestV2, profile: Profile): Promise<ManifestV2[] | R2Error> {
        let list: ManifestV2[] | R2Error = await this.getModList(profile);
        if (list instanceof R2Error) {
            return list;
        }
        const index = list.findIndex((stored: ManifestV2) => stored.getName() === mod.getName())
        if (index === list.length) {
            return list;
        } else {
            list = list.filter((stored: ManifestV2) => stored.getName() !== mod.getName());
            const start = list.slice(0, index + 1);
            const end = list.slice(index + 1);
            list = [...start, mod, ...end];
        }
        const saveErr = await this.saveModList(profile, list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(profile);
    }

    public static getDisabledModCount(modList: ManifestV2[]): number {
        return modList.filter(value => !value.isEnabled()).length;
    }

}
