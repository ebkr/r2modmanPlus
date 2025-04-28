import { jest } from '@jest/globals';

interface Table<T, K> {
    where: (index: string) => Table<T, K>;
    anyOf: (values: any[]) => Table<T, K>;
    toArray: () => Promise<T[]>;
    count: () => Promise<number>;
}

class MockVersion {
    stores = () => this;
}

// Create the base Dexie mock function
const Dexie = jest.fn();

// Create a mock Dexie class
class MockDexie {
    packages!: Table<any, any>;

    constructor(dbName: string) {}

    version(version: number): MockVersion {
        return new MockVersion();
    }
}

// Create a mock Dexie class that extends MockDexie
class MockPackageDexieStore extends MockDexie {
    private static mockPackages: any[] = [];

    static setMockPackages(modPackages: any[]) {
        this.mockPackages = modPackages;
    }

    static addMockPackage(modPackage: any) {
        this.mockPackages.push(modPackage);
    }

    static resetMockPackages() {
        this.mockPackages = [];
    }

    constructor() {
        super('tsPackages');
        this.packages = {
            where: (index: string) => {
                const table = {
                    anyOf: (keys: [string, string][]) => {
                        const matchingPackages = MockPackageDexieStore.mockPackages.filter(pkg => {
                            return keys.some(([community, full_name]) => {
                                return pkg.community === community && pkg.full_name === full_name;
                            });
                        });
                        return {
                            toArray: async () => matchingPackages
                        };
                    },
                    toArray: async () => MockPackageDexieStore.mockPackages,
                    count: async () => MockPackageDexieStore.mockPackages.length,
                };
                return table;
            },
            anyOf: (keys: string[]) => {
                const matchingPackages = MockPackageDexieStore.mockPackages.filter(pkg => {
                    const key = `${pkg.community}-${pkg.full_name}-${pkg.versions[0].version_number}`;
                    return keys.includes(key);
                });
                return {
                    toArray: async () => matchingPackages
                };
            },
            toArray: async () => MockPackageDexieStore.mockPackages,
            count: async () => MockPackageDexieStore.mockPackages.length,
        } as unknown as Table<any, any>;
    }
}

// Set up the prototype chain
Object.setPrototypeOf(MockDexie, Dexie);
Object.setPrototypeOf(MockPackageDexieStore, MockDexie);

// Set up the mock implementation
Dexie.mockImplementation((...args: unknown[]) => {
    const dbName = args[0] as string;
    return dbName === 'tsPackages' ? new MockPackageDexieStore() : new MockDexie(dbName);
});

// Expose the setMockPackages method
(Dexie as any).setMockPackages = (modPackages: any[]) => {
    MockPackageDexieStore.setMockPackages(modPackages);
};

(Dexie as any).addMockPackage = (modPackage: any) => {
    MockPackageDexieStore.addMockPackage(modPackage);
};

(Dexie as any).resetMockPackages = () => {
    MockPackageDexieStore.resetMockPackages();
};

(Dexie as any).Promise = Promise;

export default Dexie;
