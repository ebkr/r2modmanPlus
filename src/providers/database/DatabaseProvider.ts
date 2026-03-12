type Statement = [q: string, ...args: any[]];

export abstract class DatabaseProvider {

    protected readonly _id: string;
    protected readonly _name: string;

    protected constructor(id: string, dbName: string) {
        this._id = id;
        this._name = dbName;
    }

    abstract query(q: string, ...args: any): Promise<Record<string, any>[]>;

    async transaction(...statements: Statement[]): Promise<void> {
        const txId = await this._beginTransaction();
        await Promise.all(statements.map(([q, ...args]) => this._nextStatement(txId, q, ...args)));
        return this._commitTransaction(txId);
    }

    protected abstract _beginTransaction(): Promise<string>;
    protected abstract _nextStatement(txId: string, q: string, ...args: any[]): Promise<void>;
    protected abstract _commitTransaction(txId: string): Promise<void>;
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
