import { DatabaseProvider } from './DatabaseProvider';

export class DatabaseProviderImpl extends DatabaseProvider {

    constructor(dbName: string) {
        const id = window.db.open(dbName);
        super(id, dbName);
    }

    override async query(q: string, ...args: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
