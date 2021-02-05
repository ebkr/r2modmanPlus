import Dexie, { DexieOptions } from 'dexie';

export default class SettingsDexieStore extends Dexie {

    value: Dexie.Table<SettingsInterface, number>;

    constructor() {
        super("settings_dsp");
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
    dysonSphereProgramDirectory: string | null;
}
