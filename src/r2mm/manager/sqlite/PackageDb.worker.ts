import * as Comlink from 'comlink';

const api = {
    init(): void {
        console.log('Web worker hit');
    },
};

export type PackageDbApi = typeof api;

Comlink.expose(api);
