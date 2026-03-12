import { DatabaseProvider } from './DatabaseProvider';

export class DatabaseProviderImpl extends DatabaseProvider {

    constructor(dbName: string) {
        const id = window.db.open(dbName);
        super(id, dbName);
    }

    override async query(q: string, ...args: any): Promise<Record<string, any>[]> {
        return window.db.query(this._id, q, ...args);
    }

    protected override async _beginTransaction(): Promise<string> {
        return window.db.beginTransaction(this._id);
    }

    protected override async _nextStatement(txId: string, q: string, ...args: any[]): Promise<void> {
        return window.db.nextStatement(txId, q, ...args);
    }

    protected override async _commitTransaction(txId: string): Promise<void> {
        return window.db.commitTransaction(txId);
    }
}
