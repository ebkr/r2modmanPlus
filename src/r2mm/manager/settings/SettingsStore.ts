import Game from 'src/model/game/Game';
import ComboSettingsStructure_V3 from 'src/r2mm/manager/settings/structures/v3/ComboSettingsStructure_V3';
import Dexie from 'dexie';
import GameSettingsStructure_V3 from 'src/r2mm/manager/settings/structures/v3/GameSettingsStructure_V3';
import GlobalSettingsStructure_V3 from 'src/r2mm/manager/settings/structures/v3/GlobalSettingsStructure_V3';
import SettingsMigrator from 'src/r2mm/manager/settings/structures/SettingsMigrator';
import { schemaSetup_v3 } from 'src/r2mm/manager/settings/structures/v3/SchemaSetup_v3';

export const settingsDbName = "settings_v3";
export const settingsVersion = 3;
export const globalTableName = "global";
export const gamesTableName = "games";

/**
 * A better implementation of SettingsDexieStore.
 * Kept the original class for migrating.
 */
export default class SettingsStore extends Dexie {

    private readonly globalTable: Dexie.Table<GlobalSettingsStructure_V3, number>;
    private readonly gameTable: Dexie.Table<GameSettingsStructure_V3, number>;

    private context!: ComboSettingsStructure_V3;

    constructor() {
        super(settingsDbName);
        schemaSetup_v3(this);
        this.globalTable = this.table(globalTableName);
        this.gameTable = this.table(gamesTableName);

        // Tell Dexie to map results to class objects.
        this.globalTable.mapToClass(GlobalSettingsStructure_V3);
        this.gameTable.mapToClass(GameSettingsStructure_V3);
    }

    public async init(game: Game) {
        const latestSupportedGlobalVersion = await this.getLatestMigrationNumberFromSupportedForTable(this.globalTable);
        const latestSupportedGameVersion = await this.getLatestMigrationNumberFromSupportedForTable(this.gameTable);

        if (latestSupportedGlobalVersion !== latestSupportedGameVersion) {
            throw new Error("Setting versions out of sync");
        }

        if (!SettingsMigrator.areMigrationVersionsValid()) {
            throw new Error("Migration versions are not unique");
        }

        await SettingsMigrator.runMigrations(latestSupportedGlobalVersion);
        await this.destroyNewer(this.globalTable);
        await this.destroyNewer(this.gameTable);

        const latestGlobal = await this.getMigrationForTable<GlobalSettingsStructure_V3>(this.globalTable);
        await latestGlobal.init();

        const latestGame = await this.getMigrationForTable<GameSettingsStructure_V3>(this.gameTable);
        await latestGame.init();

        this.context = {
            globalFormat: latestGlobal,
            global: latestGlobal.structure,
            gameFormat: latestGame,
            gameSpecific: await latestGame.getGame(game)
        }
    }

    private async getLatestMigrationNumberFromSupportedForTable(table: Dexie.Table) {
        const migrations = await table.where('version')
            .belowOrEqual(settingsVersion)
            .toArray();
        if (migrations.length === 0) {
            return 2;
        } else {
            return migrations.map(value => value.version)
                .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue));
        }
    }

    private async getMigrationForTable<T>(table: Dexie.Table): Promise<T> {
        const migrations = await table.where('version')
            .equals(settingsVersion)
            .toArray();
        if (migrations.length === 0) {
            throw new Error("Latest migration not saved");
        }
        return migrations[0] as T;
    }

    private async destroyNewer(db: Dexie.Table) {
        const laterMigrations = await db.where('version').above(settingsVersion).toArray();
        for (const value of laterMigrations) {
            await db.delete(value.id!);
        }
    }

    public async saveAll(context: ComboSettingsStructure_V3) {
        await context.globalFormat.save();
        await context.gameFormat.save();
    }

    public getContext(): ComboSettingsStructure_V3 {
        return this.context;
    }
}
