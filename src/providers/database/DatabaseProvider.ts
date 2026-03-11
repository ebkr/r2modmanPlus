export abstract class DatabaseProvider {

    protected readonly _id: string;
    protected readonly _name: string;

    protected constructor(id: string, dbName: string) {
        this._id = id;
        this._name = dbName;
    }

    abstract query(q: string, ...args: any): Promise<Record<string, any>[]>;
}

const databaseProviders: Map<string, DatabaseProvider> = new Map();

export function provideDatabaseProviderImplementation(key: string, provider: DatabaseProvider) {
    databaseProviders.set(key, provider);
}

export function getDatabaseProvider(key: string) {
    const db = databaseProviders.get(key);
    if (!db) {
        throw new Error(`No DatabaseProvider for key [${key}]`);
    }
    return db;
}
