type Statement = [q: string, ...args: any[]];

export abstract class DatabaseProvider {

    protected readonly _id: string;
    protected readonly _name: string;

    protected constructor(id: string, dbName: string) {
        this._id = id;
        this._name = dbName;
    }

    abstract query(q: string, ...args: any): Promise<Record<string, any>[]>;

    async transaction(q: string, argSets: any[][]): Promise<void> {
        if (argSets.length === 0) return;
        return this._executeTransaction(q, argSets);
    }

    protected abstract _executeTransaction(q: string, argSets: any[][]): Promise<void>;
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
