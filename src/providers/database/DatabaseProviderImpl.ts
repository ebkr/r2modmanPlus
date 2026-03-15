import { DatabaseProvider } from './DatabaseProvider';

export class DatabaseProviderImpl extends DatabaseProvider {

    constructor(dbName: string) {
        const id = window.db.open(dbName);
        super(id, dbName);
    }

    override async query(q: string, ...args: any): Promise<Record<string, any>[]> {
        return window.db.query(this._id, q, ...args);
    }

    protected override async _executeTransaction(q: string, argSets: any[][]): Promise<void> {
        return window.db.transaction(this._id, q, argSets);
    }
}
