import * as yaml from 'yaml';
import { ImmutableProfile } from '../../model/Profile';
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
import FileUtils from '../../utils/FileUtils';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import LinkProvider from '../../providers/components/LinkProvider';
import AsyncLock from 'async-lock';
import FileTree from '../../model/file/FileTree';
import ZipBuilder from '../../providers/generic/zip/ZipBuilder';
import InteractionProvider from '../../providers/ror2/system/InteractionProvider';
import { ProfileApiClient } from '../profiles/ProfilesClient';
import path from '../../providers/node/path/path';

export default class ProfileModList {

    public static SUPPORTED_CONFIG_FILE_EXTENSIONS = [".cfg", ".txt", ".json", ".yml", ".yaml", ".ini"];
    public static readonly MAX_EXPORT_AS_CODE_SIZE = 20000000; // 20MB

    private static lock = new AsyncLock();

    public static async requestLock(fn: () => any) {
        return this.lock.acquire("acquire", fn);
    }

    public static async getModList(profile: ImmutableProfile): Promise<ManifestV2[] | R2Error> {
        const fs = FsProvider.instance;
        await FileUtils.ensureDirectory(profile.getProfilePath());
        if (!await fs.exists(profile.joinToProfilePath('mods.yml'))) {
            await fs.writeFile(profile.joinToProfilePath('mods.yml'), JSON.stringify([]));
        }
        try {
            try {
                const fileContent = (await fs.readFile(profile.joinToProfilePath('mods.yml'))).toString();
                const parsedYaml = yaml.parse(fileContent) || [];
                for(let modIndex in parsedYaml){
                    const mod = new ManifestV2().fromJsObject(parsedYaml[modIndex]);
                    await this.setIconPath(mod, profile);
                    parsedYaml[modIndex] = mod;
                }
                return parsedYaml;
            } catch(e) {
                const err: Error = e as Error;
                console.error(err);
                return new YamlParseError(
                    `Failed to parse yaml file of profile: ${profile.getProfileName()}/mods.yml`,
                    err.message,
                    null
                );
            }
        } catch(e) {
            const err: Error = e as Error;
            return new FileNotFoundError(
                'Unable to locate file',
                err.message,
                null
            )
        }
    }

    public static async saveModList(profile: ImmutableProfile, modList: ManifestV2[]): Promise<R2Error | null> {
        const fs = FsProvider.instance;
        try {
            const yamlModList: string = yaml.stringify(modList);
            try {
                await fs.writeFile(
                    profile.joinToProfilePath('mods.yml'),
                    yamlModList
                );
            } catch(e) {
                const err: Error = e as Error;
                return new FileWriteError(
                    `Failed to create mods.yml for profile: ${profile.getProfileName()}`,
                    err.message,
                    `Try running ${ManagerInformation.APP_NAME} as an administrator`
                )
            }
        } catch(e) {
            const err: Error = e as Error;
            return new YamlConvertError(
                'Failed to convert modList to yaml',
                err.message,
                null
            );
        }
        return null;
    }

    public static async addMod(mod: ManifestV2, profile: ImmutableProfile): Promise<ManifestV2[] | R2Error> {
        mod.setInstalledAtTime(Number(new Date())); // Set InstalledAt to current epoch millis
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
        // Reinsert mod in list at same position if previously found
        if (modIndex >= 0) {
            currentModList.splice(modIndex, 0, mod);
        } else {
            currentModList.push(mod);
        }
        const saveError: R2Error | null = await this.saveModList(profile, currentModList);
        if (saveError !== null) {
            return saveError;
        }
        return this.getModList(profile);
    }

    public static async removeMod(mod: ManifestV2, profile: ImmutableProfile): Promise<ManifestV2[] | R2Error> {
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

    public static async updateMods(mods: ManifestV2[], profile: ImmutableProfile, apply: (mod: ManifestV2) => void): Promise<ManifestV2[] | R2Error> {
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

    public static async updateMod(mod: ManifestV2, profile: ImmutableProfile, apply: (mod: ManifestV2) => Promise<void>): Promise<ManifestV2[] | R2Error> {
        const list: ManifestV2[] | R2Error = await this.getModList(profile);
        if (list instanceof R2Error) {
            return list;
        }
        for (const modToApply of list.filter((filteringMod: ManifestV2) => filteringMod.getName() === mod.getName())) {
            await apply(modToApply);
        }
        const saveErr = await this.saveModList(profile, list);
        if (saveErr instanceof R2Error) {
            return saveErr;
        }
        return this.getModList(profile);
    }

    private static async createExport(profile: ImmutableProfile): Promise<ZipBuilder | R2Error> {
        const list: ManifestV2[] | R2Error = await this.getModList(profile);
        if (list instanceof R2Error) {
            return list;
        }
        const exportModList: ExportMod[] = list.map((manifestMod: ManifestV2) => ExportMod.fromManifest(manifestMod));
        const exportFormat = new ExportFormat(profile.getProfileName(), exportModList);
        const builder = ZipProvider.instance.zipBuilder();
        await builder.addBuffer("export.r2x", window.node.buffer.from(yaml.stringify(exportFormat)));
        if (await FsProvider.instance.exists(profile.joinToProfilePath("BepInEx", "config"))) {
            await builder.addFolder("config", profile.joinToProfilePath('BepInEx', 'config'));
        }
        const tree = await FileTree.buildFromLocation(profile.getProfilePath());
        if (tree instanceof R2Error) {
            return tree;
        }
        tree.removeDirectories("dotnet");
        tree.removeDirectories("_state");
        tree.navigateAndPerform(bepInExDir => {
            bepInExDir.removeDirectories("config");
            bepInExDir.navigateAndPerform(pluginDir => {
                pluginDir.getDirectories().forEach(value => value.removeFiles(profile.joinToProfilePath("BepInEx", "plugins", value.getDirectoryName(), "manifest.json")));
            }, "plugins");
        }, "BepInEx");
        tree.removeDirectories("MelonLoader");
        tree.navigateAndPerform(gdWeaveDir => {
            gdWeaveDir.removeDirectories("core");
            gdWeaveDir.removeDirectories("mods");
            gdWeaveDir.removeFiles("GDWeave.log");
        }, "GDWeave");
        // Add all tree contents to buffer.
        for (const file of tree.getRecursiveFiles()) {
            const fileLower = file.toLowerCase();
            if (
                this.SUPPORTED_CONFIG_FILE_EXTENSIONS.some(value => fileLower.endsWith(value)) &&
                !fileLower.endsWith('mods.yml')
            ) {
                const content = await FsProvider.instance.readFile(file);
                const bufferContent = window.node.buffer.from(content, 'utf8');
                await builder.addBuffer(path.relative(profile.getProfilePath(), file), bufferContent);
            }
        }
        return builder;
    }

    public static async exportModListToFile(profile: ImmutableProfile): Promise<R2Error | string> {
        const exportDirectory = path.join(PathResolver.MOD_ROOT, 'exports');
        try {
            await FileUtils.ensureDirectory(exportDirectory);
        } catch(e) {
            const err: Error = e as Error;
            return new R2Error('Failed to ensure folder exists', err.message,
                `Try running ${ManagerInformation.APP_NAME} as an administrator`);
        }
        const dir = await InteractionProvider.instance.selectFolder({
            title: `Select the folder to export your profile to`,
            defaultPath: exportDirectory,
            buttonLabel: 'Select export folder'
        });
        if (dir.length === 0) {
            return new R2Error("Failed to export profile", "No export folder was selected", null);
        }
        const builder = await this.createExport(profile);
        if (builder instanceof R2Error) {
            return builder;
        }
        const exportPath = path.join(dir[0], `${profile.getProfileName()}_${new Date().getTime()}.r2z`);
        await builder.createZip(exportPath);
        LinkProvider.instance.selectFile(exportPath);
        return exportPath;
    }

    public static async exportModListAsCode(profile: ImmutableProfile, callback: (code: string, err: R2Error | null) => void): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        const exportDirectory = path.join(PathResolver.MOD_ROOT, 'exports');
        await FileUtils.ensureDirectory(exportDirectory);
        const exportPath = path.join(exportDirectory, `${profile.getProfileName()}.r2z`);
        const exportBuilder: R2Error | ZipBuilder = await this.createExport(profile);
        if (exportBuilder instanceof R2Error) {
            return exportBuilder;
        } else {
            try {
                await exportBuilder.createZip(exportPath);
            } catch (e) {
                return R2Error.fromThrownValue(e);
            }

            const zipStats = await fs.lstat(exportPath);
            if (zipStats.size > this.MAX_EXPORT_AS_CODE_SIZE) {
                const zipSize = FileUtils.humanReadableSize(zipStats.size);
                const maxSize = FileUtils.humanReadableSize(this.MAX_EXPORT_AS_CODE_SIZE);
                const fileTypes = this.SUPPORTED_CONFIG_FILE_EXTENSIONS.join(', ');
                const configFolder = profile.joinToProfilePath('BepInEx', 'config');
                return new R2Error(
                    'The profile is too large to be exported as a code',
                    `Exported profile size is ${zipSize} while the maximum supported size is ${maxSize}.
                     Exported profile includes ${fileTypes} files and all the contents of ${configFolder}`,
                    'You can still try exporting the profile as a file from the settings view.'
                );
            }

            const profileBuffer = '#r2modman\n' + (await fs.base64FromZip(exportPath));
            try {
                const storageResponse = await ProfileApiClient.createProfile(profileBuffer);
                callback(storageResponse.data.key, null);
            } catch (e: R2Error | unknown) {
                callback('', R2Error.fromThrownValue(e, "Failed to export profile"));
            }
        }
    }

    public static getDisabledModCount(modList: ManifestV2[]): number {
        return modList.filter(value => !value.isEnabled()).length;
    }

    public static async setIconPath(mod: ManifestV2, profile: ImmutableProfile): Promise<void> {
        const paths = [
            path.join(profile.getProfilePath(), "BepInEx", "plugins", mod.getName(), "icon.png"),
            path.join(PathResolver.MOD_ROOT, "cache", mod.getName(), mod.getVersionNumber().toString(), "icon.png"),
        ]

        return new Promise(async (resolve, reject) => {
            try {
                for (const iconPath of paths) {
                    const exists = await FsProvider.instance.exists(iconPath);
                    if (exists) {
                        const content = await FsProvider.instance.base64FromZip(iconPath);
                        mod.setIcon(`data:image/png;base64,${content}`);
                        resolve(true);
                        break;
                    }
                }
                resolve(false);
            } catch (e) {
                reject(e);
            }
        }).then(resolved => {
            if (!resolved) {
                mod.setIcon("/unknown.png");
            }
        });
    }
}
