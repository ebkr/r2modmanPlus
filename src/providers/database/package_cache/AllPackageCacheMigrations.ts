import CreateCommunitiesTable from './migrations/1__CreateCommunitiesTable';
import CreatePackagesTable from './migrations/2__CreatePackagesTable';
import CreateIndexChunkHashesTable from './migrations/3__CreateIndexChunkHashesTable';

export function getPackageCacheMigrations() {
    return [
        CreateCommunitiesTable,
        CreatePackagesTable,
        CreateIndexChunkHashesTable,
    ];
}
