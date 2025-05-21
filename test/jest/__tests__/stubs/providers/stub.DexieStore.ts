import Dexie, { Table } from 'dexie';
import { DexiePackage, IndexChunkHash } from '../../../../../src/r2mm/manager/PackageDexieStore';

// In-memory store implementation
class InMemoryStore {
    private stores: Map<string, Map<string, any>> = new Map();

    getStore(name: string) {
        if (!this.stores.has(name)) {
            this.stores.set(name, new Map());
        }
        return this.stores.get(name)!;
    }

    async add(storeName: string, key: string, value: any) {
        const store = this.getStore(storeName);
        store.set(key, value);
    }

    async put(storeName: string, key: string, value: any) {
        const store = this.getStore(storeName);
        store.set(key, value);
    }

    async get(storeName: string, key: string) {
        const store = this.getStore(storeName);
        return store.get(key);
    }

    async getAll(storeName: string) {
        const store = this.getStore(storeName);
        return Array.from(store.values());
    }

    async clear(storeName: string) {
        const store = this.getStore(storeName);
        store.clear();
    }
}

// Configure Dexie to use our in-memory store
const inMemoryStore = new InMemoryStore();

// Mock IDBFactory
const mockIDBFactory = {
    open: (name: string) => {
        const request = {
            onsuccess: null as (() => void) | null,
            onerror: null as (() => void) | null,
            result: {
                createObjectStore: (storeName: string) => ({
                    createIndex: () => {},
                    transaction: (mode: string, stores: string[]) => {
                        const transaction = {
                            mode,
                            objectStore: (name: string) => {
                                const store = inMemoryStore.getStore(name);
                                return {
                                    add: (value: any) => {
                                        const key = value.id || value.full_name;
                                        inMemoryStore.add(name, key, value);
                                        const request = {
                                            onsuccess: null as (() => void) | null,
                                            onerror: null as (() => void) | null,
                                            result: value
                                        };
                                        setTimeout(() => request.onsuccess?.(), 0);
                                        return request;
                                    },
                                    put: (value: any) => {
                                        const key = value.id || value.full_name;
                                        inMemoryStore.put(name, key, value);
                                        const request = {
                                            onsuccess: null as (() => void) | null,
                                            onerror: null as (() => void) | null,
                                            result: value
                                        };
                                        setTimeout(() => request.onsuccess?.(), 0);
                                        return request;
                                    },
                                    clear: () => {
                                        inMemoryStore.clear(name);
                                        const request = {
                                            onsuccess: null as (() => void) | null,
                                            onerror: null as (() => void) | null,
                                            result: undefined
                                        };
                                        setTimeout(() => request.onsuccess?.(), 0);
                                        return request;
                                    },
                                    getAll: () => {
                                        const request = {
                                            onsuccess: null as (() => void) | null,
                                            onerror: null as (() => void) | null,
                                            result: Array.from(store.values())
                                        };
                                        setTimeout(() => request.onsuccess?.(), 0);
                                        return request;
                                    },
                                    get: (key: string) => {
                                        const request = {
                                            onsuccess: null as (() => void) | null,
                                            onerror: null as (() => void) | null,
                                            result: store.get(key)
                                        };
                                        setTimeout(() => request.onsuccess?.(), 0);
                                        return request;
                                    },
                                    where: (key: string) => ({
                                        equals: (value: any) => ({
                                            primaryKeys: () => {
                                                const request = {
                                                    onsuccess: null as (() => void) | null,
                                                    onerror: null as (() => void) | null,
                                                    result: Array.from(store.entries())
                                                        .filter(([_, v]) => v[key] === value)
                                                        .map(([k]) => k)
                                                };
                                                setTimeout(() => request.onsuccess?.(), 0);
                                                return request;
                                            },
                                            delete: () => {
                                                const request = {
                                                    onsuccess: null as (() => void) | null,
                                                    onerror: null as (() => void) | null,
                                                    result: undefined
                                                };
                                                setTimeout(() => request.onsuccess?.(), 0);
                                                return request;
                                            }
                                        })
                                    }),
                                    bulkDelete: (keys: string[]) => {
                                        const request = {
                                            onsuccess: null as (() => void) | null,
                                            onerror: null as (() => void) | null,
                                            result: undefined
                                        };
                                        setTimeout(() => request.onsuccess?.(), 0);
                                        return request;
                                    }
                                };
                            }
                        };
                        return transaction;
                    }
                }),
                close: () => {}
            }
        };
        setTimeout(() => request.onsuccess?.(), 0);
        return request;
    },
    deleteDatabase: (name: string) => {
        const request = {
            onsuccess: null as (() => void) | null,
            onerror: null as (() => void) | null
        };
        setTimeout(() => request.onsuccess?.(), 0);
        return request;
    },
    databases: () => {
        const request = {
            onsuccess: null as (() => void) | null,
            onerror: null as (() => void) | null,
            result: []
        };
        setTimeout(() => request.onsuccess?.(), 0);
        return request;
    }
};

// Configure Dexie to use our mock
Dexie.dependencies.indexedDB = mockIDBFactory as any;

export class StubDexieStore extends Dexie {
    packages!: Table<DexiePackage, string>;
    indexHashes!: Table<IndexChunkHash, string>;

    constructor() {
        super('StubDexieStore');

        this.version(1).stores({
            packages: '[community+full_name], [community+date_fetched]',
            indexHashes: '&community, [community+hash]'
        });

        // Initialize tables with empty collections
        this.packages = this.table('packages');
        this.indexHashes = this.table('indexHashes');
    }

    public async clear() {
        await this.packages.clear();
        await this.indexHashes.clear();
    }
}

export default class StubDexieProvider {
    private static instance: StubDexieStore;

    public static provide() {
        if (!StubDexieProvider.instance) {
            StubDexieProvider.instance = new StubDexieStore();
        }
        return StubDexieProvider.instance;
    }

    public static async clear() {
        if (StubDexieProvider.instance) {
            await StubDexieProvider.instance.clear();
        }
    }
}