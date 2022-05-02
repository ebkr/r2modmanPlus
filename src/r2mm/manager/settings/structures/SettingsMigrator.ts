import SettingsMigrator_v3 from 'src/r2mm/manager/settings/structures/v3/SettingsMigrator_v3';

export default class SettingsMigrator {

    private static MIGRATIONS = [new SettingsMigrator_v3()]

    public static async runMigrations(currentMigrationVersion: number) {
        const validMigrationsSorted = [...this.MIGRATIONS]
            .filter(value => value.version() > currentMigrationVersion)
            .sort((a, b) => a.version() - b.version());

        for (const value of validMigrationsSorted) {
            await value.migrate();
        }
    }

    public static areMigrationVersionsValid(): boolean {
        const migrationVersions = this.MIGRATIONS.map(value => value.version());
        return [...new Set(migrationVersions)].length === migrationVersions.length;
    }

}
