import CreateCommunitiesTable from './migrations/1__CreateCommunitiesTable';
import CreatePackagesTable from './migrations/2__CreatePackagesTable';
import CreateVersionsTable from './migrations/3__CreateVersionsTable';
import CreateDependenciesTable from './migrations/4__CreateDependenciesTable';
import CreateIndexChunkHashesTable from './migrations/5__CreateIndexChunkHashesTable';

export function getPackageCacheMigrations() {
    return [
        CreateCommunitiesTable,
        CreatePackagesTable,
        CreateVersionsTable,
        CreateDependenciesTable,
        CreateIndexChunkHashesTable,
    ];
}
