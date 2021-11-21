import Dexie from 'dexie';
import { gamesTableName, globalTableName } from 'src/r2mm/manager/settings/SettingsStore';

export function schemaSetup_v3(db: Dexie) {
    db.version(3).stores({
        [globalTableName]: `++id,structure,version`,
        [gamesTableName]: `++id,structure,version`
    });
}
