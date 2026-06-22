import * as Comlink from 'comlink';

import type { PackageDbApi } from './PackageDb.worker';

let api: Comlink.Remote<PackageDbApi> | undefined;

function getApi(): Comlink.Remote<PackageDbApi> {
    if (api === undefined) {
        const worker = new Worker(
            new URL('./PackageDb.worker.ts', import.meta.url),
            { type: 'module' }
        );
        api = Comlink.wrap<PackageDbApi>(worker);
    }
    return api;
}

export async function initPackageDbWorker(): Promise<void> {
    await getApi().init();
}
