import Dexie from 'dexie';
import { StorePlatform } from '../../../../../model/game/StorePlatform';
import { globalTableName, settingsDbName } from 'src/r2mm/manager/settings/SettingsStore';
import { schemaSetup_v3 } from 'src/r2mm/manager/settings/structures/v3/SchemaSetup_v3';

let globalTable: Dexie.Table<GlobalSettingsStructure_V3, number>

export interface InternalGlobalSettingsStructure_V3 {
    darkTheme: boolean;
    dataDirectory: string;
    defaultGame: string | undefined;
    defaultStore: StorePlatform | undefined;
    expandedCards: boolean;
    favouriteGames: string[] | undefined;
    funkyModeEnabled: boolean;
    gameSelectionViewMode: string | undefined;
    ignoreCache: boolean;
    lastSelectedGame: string | null;
    steamDirectory: string | null;
    virtualDesktopDirectory: string | undefined;
}

export default class GlobalSettingsStructure_V3 {

    id?: number;
    structure: InternalGlobalSettingsStructure_V3;
    version: number;

    constructor(structure: InternalGlobalSettingsStructure_V3, version: number,
                id?: number) {

        if (id) {
            this.id = id;
        }
        this.structure = structure;
        this.version = version;
    }

    public async init() {
        const db = new Dexie(settingsDbName);
        schemaSetup_v3(db);

        globalTable = db.table(globalTableName);
        globalTable.mapToClass(GlobalSettingsStructure_V3);
    }

    public async save() {
        await globalTable.put(new GlobalSettingsStructure_V3(this.structure, this.version, this.id))
            .then(value => this.id = value);
    }
}
