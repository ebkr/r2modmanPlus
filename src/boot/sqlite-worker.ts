import { defineBoot } from '#q-app/wrappers';
import { initPackageDbWorker } from 'src/r2mm/manager/sqlite/PackageDbClient';

export default defineBoot(async () => {
    await initPackageDbWorker();
});
