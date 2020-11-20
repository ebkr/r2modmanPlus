import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import * as yaml from 'yaml';
import R2Error from '../../model/errors/R2Error';
import YamlParseError from '../../model/errors/Yaml/YamlParseError';
import FileWriteError from '../../model/errors/FileWriteError';
import YamlConvertError from '../../model/errors/Yaml/YamlConvertError';
import PathResolver from './PathResolver';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import FileUtils from '../../utils/FileUtils';

export default class ManagerSettings {

    private static LOADED_SETTINGS: ManagerSettings | undefined;

    public static async getSingleton(): Promise<ManagerSettings> {
        if (this.LOADED_SETTINGS === undefined) {
            this.LOADED_SETTINGS = new ManagerSettings();
            await this.LOADED_SETTINGS.load();
        }
        return this.LOADED_SETTINGS;
    }

    public riskOfRain2Directory: string | null = null;
    public steamDirectory: string | null = null;
    public lastSelectedProfile: string = 'Default';
    public funkyModeEnabled: boolean = false;
    public expandedCards: boolean = false;
    public linkedFiles: string[] = [];
    public darkTheme: boolean = false;
    public launchParameters: string = '';
    public ignoreCache: boolean = false;
    public dataDirectory: string = '';
    public installedSortBy: string = EnumResolver.from(SortNaming, SortNaming.CUSTOM)!;
    public installedSortDirection: string = EnumResolver.from(SortDirection, SortDirection.STANDARD)!;
    public installedDisablePosition: string = EnumResolver.from(SortLocalDisabledMods, SortLocalDisabledMods.CUSTOM)!;

    public async load(): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        const configPath = path.join(PathResolver.CONFIG_DIR);
        const configFile = path.join(configPath, "conf.yml");
        await FileUtils.ensureDirectory(configPath);
        if (await fs.exists(configFile)) {
            try {
                const parsedYaml = yaml.parse((await fs.readFile(configFile)).toString());
                this.riskOfRain2Directory = parsedYaml.riskOfRain2Directory;
                this.linkedFiles = parsedYaml.linkedFiles || [];
                this.lastSelectedProfile = parsedYaml.lastSelectedProfile || 'Default';
                this.steamDirectory = parsedYaml.steamDirectory;
                this.expandedCards = parsedYaml.expandedCards || false;
                this.darkTheme = parsedYaml.darkTheme;
                this.launchParameters = parsedYaml.launchParameters || '';
                this.ignoreCache = parsedYaml.ignoreCache || false;
                this.dataDirectory = parsedYaml.dataDirectory || PathResolver.APPDATA_DIR;
                this.installedSortBy = parsedYaml.installedSortBy || this.installedSortBy;
                this.installedSortDirection = parsedYaml.installedSortDirection || this.installedSortDirection;
                this.installedDisablePosition = parsedYaml.installedDisablePosition || this.installedDisablePosition;
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    'Failed to parse conf.yml',
                    err.message,
                    'Did you modify the conf.yml file? If not, delete it, and re-launch the manager'
                );
            }
        }
    }

    public async setRiskOfRain2Directory(dir: string): Promise<R2Error | void> {
        this.riskOfRain2Directory = dir;
        return await this.save();
    }

    public async setSteamDirectory(dir: string): Promise<R2Error | void> {
        this.steamDirectory = dir;
        return await this.save();
    }

    public async setLinkedFiles(linkedFiles: string[]): Promise<R2Error | void> {
        this.linkedFiles = linkedFiles;
        return await this.save();
    }

    private async save(): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        const configFile = path.join(PathResolver.CONFIG_DIR, "conf.yml");
        try {
            const writeableYaml = yaml.stringify(this);
            try {
                await fs.writeFile(configFile, writeableYaml);
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    'Failed to write conf.yml',
                    err.message,
                    'Try running r2modman as an administrator'
                )
            }
        } catch(e) {
            const err: Error = e;
            return new YamlConvertError(
                'Failed to write convert yaml',
                err.message,
                null
            )
        }
    }

    public async setProfile(profile: string): Promise<R2Error | void> {
        this.lastSelectedProfile = profile;
        return await this.save();
    }

    public async setFunkyMode(enabled: boolean): Promise<R2Error | void> {
        this.funkyModeEnabled = enabled;
        return await this.save();
    }

    public async expandCards(): Promise<R2Error | void> {
        this.expandedCards = true;
        return await this.save();
    }

    public async collapseCards(): Promise<R2Error | void> {
        this.expandedCards = false;
        return await this.save();
    }

    public async toggleDarkTheme(): Promise<R2Error | void> {
        this.darkTheme = !this.darkTheme;
        return await this.save();
    }

    public async setLaunchParameters(launchParams: string): Promise<R2Error | void> {
        this.launchParameters = launchParams;
        return await this.save();
    }

    public async setIgnoreCache(ignore: boolean): Promise<R2Error | void> {
        this.ignoreCache = ignore;
        return await this.save();
    }

    public async setDataDirectory(dataDirectory: string): Promise<R2Error | void> {
        this.dataDirectory = dataDirectory;
        return await this.save();
    }

    public getInstalledSortBy() {
        return Object.entries(SortNaming).filter(value => value[0] === this.installedSortBy)[0][1];
    }

    public async setInstalledSortBy(sortNaming: string): Promise<R2Error | void> {
        this.installedSortBy = EnumResolver.from(SortNaming, sortNaming)!;
        return await this.save();
    }

    public getInstalledSortDirection() {
        return Object.entries(SortDirection).filter(value => value[0] === this.installedSortDirection)[0][1];
    }

    public async setInstalledSortDirection(sortDirection: string): Promise<R2Error | void> {
        this.installedSortDirection = EnumResolver.from(SortDirection, sortDirection)!;
        return await this.save();
    }

    public getInstalledDisablePosition() {
        return Object.entries(SortLocalDisabledMods).filter(value => value[0] === this.installedDisablePosition)[0][1];
    }

    public async setInstalledDisablePosition(disablePosition: string): Promise<R2Error | void> {
        this.installedDisablePosition = EnumResolver.from(SortLocalDisabledMods, disablePosition)!;
        return await this.save();
    }
}
