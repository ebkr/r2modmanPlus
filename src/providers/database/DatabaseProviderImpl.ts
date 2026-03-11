import { DatabaseProvider } from './DatabaseProvider';

export class DatabaseProviderImpl extends DatabaseProvider {

    constructor(dbName: string) {
        const id = window.db.open(dbName);
        super(id, dbName);
    }

    override async query(q: string, ...args: any): Promise<Record<string, any>[]> {
        return window.db.query(this._id, q, ...args);
    }
}
