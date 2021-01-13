import R2Error from '../../model/errors/R2Error';
import PathResolver from './PathResolver';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import SettingsDexieStore, { ManagerSettingsInterface } from './SettingsDexieStore';

export default class ManagerSettings {

    private static LOADED_SETTINGS: ManagerSettings | undefined;
    private static DEXIE_STORE = new SettingsDexieStore();
    public static NEEDS_MIGRATION = false;

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

    public async mapJsonToClass(itf: ManagerSettingsInterface): Promise<R2Error | void> {
        this.riskOfRain2Directory = itf.riskOfRain2Directory;
        this.linkedFiles = itf.linkedFiles || [];
        this.lastSelectedProfile = itf.lastSelectedProfile || 'Default';
        this.steamDirectory = itf.steamDirectory;
        this.expandedCards = itf.expandedCards || false;
        this.darkTheme = itf.darkTheme;
        this.launchParameters = itf.launchParameters || '';
        this.ignoreCache = itf.ignoreCache || false;
        this.dataDirectory = itf.dataDirectory || PathResolver.APPDATA_DIR;
        this.installedSortBy = itf.installedSortBy || this.installedSortBy;
        this.installedSortDirection = itf.installedSortDirection || this.installedSortDirection;
        this.installedDisablePosition = itf.installedDisablePosition || this.installedDisablePosition;
    }

    public createDefaultSettingsObject(): ManagerSettingsInterface {
        return {
            riskOfRain2Directory: null,
            steamDirectory: null,
            lastSelectedProfile: 'Default',
            funkyModeEnabled: false,
            expandedCards: false,
            linkedFiles: [],
            darkTheme: false,
            launchParameters: '',
            ignoreCache: false,
            dataDirectory: '',
            installedSortBy: EnumResolver.from(SortNaming, SortNaming.CUSTOM)!,
            installedSortDirection: EnumResolver.from(SortDirection, SortDirection.STANDARD)!,
            installedDisablePosition: EnumResolver.from(SortLocalDisabledMods, SortLocalDisabledMods.CUSTOM)!
        };
    }

    public async load(): Promise<R2Error | void> {
        const db = ManagerSettings.DEXIE_STORE;
        await db.value.toArray().then(result => {
            if (result.length > 0) {
                const value = result[result.length - 1];
                const parsed = JSON.parse(value.settings) as ManagerSettingsInterface;
                return this.mapJsonToClass(parsed);
            } else {
                ManagerSettings.NEEDS_MIGRATION = true;
                const obj = this.createDefaultSettingsObject();
                db.value.put({settings: JSON.stringify(obj)});
                return this.mapJsonToClass(obj);
            }
        });
    }

    private async save(): Promise<R2Error | void> {
        const db = ManagerSettings.DEXIE_STORE;
        await db.value.toArray().then(result => {
            for (let settingsInterface of result) {
                db.value.update(settingsInterface.id!, {settings: JSON.stringify(this)});
            }
        });
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
