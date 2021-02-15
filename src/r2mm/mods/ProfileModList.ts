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

export default class ProfileModList {

    private static lock = new AsyncLock();

    public static async requestLock(fn: () => any) {
        return this.lock.acquire("acquire", fn);
    }

    public static async getModList(profile: Profile): Promise<ManifestV2[] | R2Error> {
        const fs = FsProvider.instance;
        console.log("Mod list", profile.getPathOfProfile());
        if (!await fs.exists(path.join(profile.getPathOfProfile(), 'mods.yml'))) {
            await fs.writeFile(path.join(profile.getPathOfProfile(), 'mods.yml'), JSON.stringify([]));
        }
        try {
            try {
                return await fs.readFile(path.join(profile.getPathOfProfile(), 'mods.yml'))
                    .then(value => value.toString())
                    .then(value => {
                        return yaml.parse(value)
                            .map((mod: ManifestV2) => new ManifestV2().fromReactive(mod));
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

    public static async addMod(mod: ManifestV2): Promise<ManifestV2[] | R2Error> {
        let currentModList: ManifestV2[] | R2Error = await this.getModList(Profile.getActiveProfile());
        if (currentModList instanceof R2Error) {
            currentModList = [];
        }
        const modIndex: number = currentModList.findIndex((search: ManifestV2) => search.getName() === mod.getName());
        await this.removeMod(mod);
        currentModList = await this.getModList(Profile.getActiveProfile());
        if (currentModList instanceof R2Error) {
            currentModList = [];
        }
        if (modIndex >= 0) {
            currentModList.splice(modIndex, 0, mod);
        } else {
            currentModList.push(mod);
        }
        const saveError: R2Error | null = await this.saveModList(Profile.getActiveProfile(), currentModList);
        if (saveError !== null) {
            return saveError;
        }
        // Return mod list, or R2 error. We don't care at this point as this is handled elsewhere.
        return this.getModList(Profile.getActiveProfile());
    }

    public static async removeMod(mod: ManifestV2): Promise<ManifestV2[] | R2Error> {
        const currentModList: ManifestV2[] | R2Error = await this.getModList(Profile.getActiveProfile());
        if (currentModList instanceof R2Error) {
            return currentModList;
        }
        const newModList = currentModList.filter((m: ManifestV2) => m.getName() !== mod.getName());
        const saveError: R2Error | null = await this.saveModList(Profile.getActiveProfile(), newModList);
        if (saveError !== null) {
            return saveError;
        }
        // Return mod list, or R2 error. We don't care at this point.
        return this.getModList(Profile.getActiveProfile());
    }

    public static async updateMods(mods: ManifestV2[], apply: (mod: ManifestV2) => void): Promise<ManifestV2[] | R2Error> {
        const list: ManifestV2[] | R2Error = await this.getModList(Profile.getActiveProfile());
        if (list instanceof R2Error) {
            return list;
        }
        for (let mod of mods) {
            list.filter((filteringMod: ManifestV2) => filteringMod.getName() === mod.getName())
                .forEach((filteringMod: ManifestV2) => {
                    apply(filteringMod);
                });
        }
        const saveErr = await this.saveModList(Profile.getActiveProfile(), list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(Profile.getActiveProfile());
    }

    public static async updateMod(mod: ManifestV2, apply: (mod: ManifestV2) => void): Promise<ManifestV2[] | R2Error> {
        const list: ManifestV2[] | R2Error = await this.getModList(Profile.getActiveProfile());
        if (list instanceof R2Error) {
            return list;
        }
        list.filter((filteringMod: ManifestV2) => filteringMod.getName() === mod.getName())
            .forEach((filteringMod: ManifestV2) => {
                apply(filteringMod);
            });
        const saveErr = await this.saveModList(Profile.getActiveProfile(), list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(Profile.getActiveProfile());
    }

    public static async exportModListToFile(): Promise<R2Error | string> {
        const exportDirectory = path.join(PathResolver.MOD_ROOT, 'exports');
        try {
            await FileUtils.ensureDirectory(exportDirectory);
        } catch(e) {
            const err: Error = e;
            return new R2Error('Failed to ensure directory exists', err.message,
                `Try running ${ManagerInformation.APP_NAME} as an administrator`);
        }
        const list: ManifestV2[] | R2Error = await this.getModList(Profile.getActiveProfile());
        if (list instanceof R2Error) {
            return list;
        }
        const exportModList: ExportMod[] = list.map((manifestMod: ManifestV2) => ExportMod.fromManifest(manifestMod));
        const exportFormat = new ExportFormat(Profile.getActiveProfile().getProfileName(), exportModList);
        const exportPath = path.join(exportDirectory, `${Profile.getActiveProfile().getProfileName()}.r2z`);
        const builder = ZipProvider.instance.zipBuilder();
        await builder.addBuffer("export.r2x", Buffer.from(yaml.stringify(exportFormat)));
        await builder.addFolder("config", path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config'));
        await builder.createZip(exportPath);
        return exportPath;
    }

    public static async exportModList(): Promise<R2Error | void> {
        const exportResult: R2Error | string = await this.exportModListToFile();
        if (exportResult instanceof R2Error) {
            return exportResult;
        } else {
            LinkProvider.instance.selectFile(exportResult);
        }
    }

    public static async exportModListAsCode(callback: (code: string, err: R2Error | null) => void): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        const exportResult: R2Error | string = await this.exportModListToFile();
        if (exportResult instanceof R2Error) {
            return exportResult;
        } else {
            const profileBuffer = '#r2modman\n' + (await fs.readFile(exportResult)).toString('base64');
            Axios.post('https://r2modman-hastebin.herokuapp.com/documents', profileBuffer)
                .then(resp => callback(resp.data.key, null))
                .catch(e => {
                    const err: Error = e;
                    callback('', new R2Error('Failed to export profile', err.message, null));
                });
        }
    }

    public static async shiftModEntryUp(mod: ManifestV2): Promise<ManifestV2[] | R2Error> {
        let list: ManifestV2[] | R2Error = await this.getModList(Profile.getActiveProfile());
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
        const saveErr = await this.saveModList(Profile.getActiveProfile(), list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(Profile.getActiveProfile());
    }

    public static async shiftModEntryDown(mod: ManifestV2): Promise<ManifestV2[] | R2Error> {
        let list: ManifestV2[] | R2Error = await this.getModList(Profile.getActiveProfile());
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
        const saveErr = await this.saveModList(Profile.getActiveProfile(), list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(Profile.getActiveProfile());
    }

    public static getDisabledModCount(modList: ManifestV2[]): number {
        return modList.filter(value => !value.isEnabled()).length;
    }

}
