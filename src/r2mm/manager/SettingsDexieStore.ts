import Dexie, { DexieOptions } from 'dexie';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';

export default class SettingsDexieStore extends Dexie {

    value: Dexie.Table<SettingsInterface, number>;

    constructor() {
        super("settings");
        this.version(1).stores({
            value: `++id,settings`
        });
        this.value = this.table("value");
    }
}

interface SettingsInterface {
    id?: number;
    settings: string;
}

export interface ManagerSettingsInterface {
    riskOfRain2Directory: string | null;
    steamDirectory: string | null;
    lastSelectedProfile: string;
    funkyModeEnabled: boolean;
    expandedCards: boolean;
    linkedFiles: string[];
    darkTheme: boolean;
    launchParameters: string;
    ignoreCache: boolean;
    dataDirectory: string;
    installedSortBy: string;
    installedSortDirection: string;
    installedDisablePosition: string;
}
