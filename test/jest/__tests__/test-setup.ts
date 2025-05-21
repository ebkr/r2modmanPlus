import Sinon from 'sinon';
import { SinonStub, createStubInstance } from 'sinon';

import PathResolver from '../../../src/r2mm/manager/PathResolver';
import FsProvider from '../../../src/providers/generic/file/FsProvider';
import Profile from '../../../src/model/Profile';
import FileUtils from '../../../src/utils/FileUtils';
import NodeFs from '../../../src/providers/generic/file/NodeFs';
import StubFsProvider from './stubs/providers/stub.FsProvider';
import StubInteractionProvider from './stubs/providers/stub.InteractionProvider';
import InteractionProvider from '../../../src/providers/ror2/system/InteractionProvider';
import StubLinkProvider from './stubs/providers/stub.LinkProvider';
import LinkProvider from '../../../src/providers/components/LinkProvider';
import StubProfileProvider from 'app/test/jest/__tests__/stubs/providers/stub.ProfileProvider';
import ProfileProvider from 'src/providers/ror2/model_implementation/ProfileProvider';
import DexieStoreProvider from 'src/providers/generic/db/DexieStoreProvider';
import { StubDexieStore } from './stubs/providers/stub.DexieStore';
import { DexiePackage } from 'src/r2mm/manager/PackageDexieStore';
import ThunderstoreCombo from '../../../src/model/ThunderstoreCombo';
import ThunderstoreMod from '../../../src/model/ThunderstoreMod';
import ThunderstoreVersion from '../../../src/model/ThunderstoreVersion';
import VersionNumber from '../../../src/model/VersionNumber';

interface DexieVersion {
    full_name: string;
    name: string;
    version_number: string;
    uuid4: string;
    dependencies: string[];
    description: string;
    icon: string;
    is_active: boolean;
    downloads: number;
    download_url: string;
    website_url: string;
    file_size: number;
    date_created: Date;
}

interface PackageWithDeps extends DexiePackage {
    versions: DexieVersion[];
    community: string;
    dependencies?: string[];
}

export default class TestSetup {

    public static setUp() {
        const fs = new NodeFs();
        FsProvider.provide(() => fs);
        PathResolver.APPDATA_DIR = '__test_data__';
        new Profile('Default');
    }

    public static async tearDown() {
        const fs = FsProvider.instance;
        await FileUtils.emptyDirectory(PathResolver.APPDATA_DIR);
        await fs.rmdir(PathResolver.APPDATA_DIR);
    }

    public static stubSetUp() {
        const db = createStubInstance(StubDexieStore);
        const packages: PackageWithDeps[] = [];

        // Debug function to verify package additions
        const debugPackages = () => {
            console.log('Current packages in Dexie store:');
            packages.forEach(pkg => {
                console.log(`- ${pkg.full_name} (${pkg.versions.map(v => v.version_number).join(', ')})`);
            });
        };

        // Helper function to get all dependencies recursively
        const getAllDependencies = (pkg: PackageWithDeps, versionNumber: string, visited = new Set<string>(), useLatestVersion = false): PackageWithDeps[] => {
            const version = pkg.versions.find(v => v.version_number === versionNumber) || pkg.versions[0];
            if (!version?.dependencies || visited.has(pkg.full_name)) {
                return [pkg];
            }

            visited.add(pkg.full_name);
            const deps = version.dependencies.flatMap(depStr => {
                const [depName, depVersion] = depStr.split('-');
                const dep = packages.find(p => p.full_name === depName);
                if (!dep) return [];

                // If useLatestVersion is true, use the latest version
                // Otherwise, use the exact version specified
                const targetVersion = useLatestVersion ?
                    dep.versions[0].version_number :
                    depVersion;

                return getAllDependencies(dep, targetVersion, visited, useLatestVersion);
            });

            return [pkg, ...deps];
        };

        // Stub the table properties
        db.packages = {
            add: Sinon.stub().callsFake((pkg: PackageWithDeps) => {
                packages.push(pkg);
                debugPackages();
                return Promise.resolve(pkg);
            }),
            where: Sinon.stub().callsFake((query: string | { community?: string, full_name?: string }) => {
                // Handle compound index query
                if (typeof query === 'string' && query === '[community+full_name]') {
                    return {
                        anyOf: Sinon.stub().callsFake((keys: string[]) => ({
                            toArray: Sinon.stub().callsFake(async () => {
                                return packages.filter(pkg => {
                                    const key = `${pkg.community}-${pkg.full_name}`;
                                    return keys.includes(key);
                                });
                            })
                        }))
                    };
                }
                // Handle regular query
                const queryObj = query as { community?: string, full_name?: string };
                return {
                    first: Sinon.stub().callsFake(async () => {
                        return packages.find(p =>
                            (!queryObj.community || p.community === queryObj.community) &&
                            (!queryObj.full_name || p.full_name === queryObj.full_name)
                        );
                    }),
                    toArray: Sinon.stub().callsFake(async () => {
                        return packages.filter(p =>
                            (!queryObj.community || p.community === queryObj.community) &&
                            (!queryObj.full_name || p.full_name === queryObj.full_name)
                        );
                    })
                };
            }),
            anyOf: Sinon.stub().callsFake((keys: string[]) => ({
                toArray: Sinon.stub().callsFake(async () => {
                    return packages.filter(pkg => {
                        const key = `${pkg.community}-${pkg.full_name}-${pkg.versions[0].version_number}`;
                        return keys.includes(key);
                    });
                })
            })),
            clear: Sinon.stub().callsFake(() => {
                packages.length = 0;
                return Promise.resolve();
            }),
            getLatestVersion: Sinon.stub().callsFake((fullName: string) => {
                const pkg = packages.find(p => p.full_name === fullName);
                if (!pkg) return null;
                return pkg.versions[0];
            }),
            getVersion: Sinon.stub().callsFake((fullName: string, version: string) => {
                const pkg = packages.find(p => p.full_name === fullName);
                if (!pkg) return null;
                return pkg.versions.find(v => v.version_number === version) || pkg.versions[0];
            }),
            toArray: Sinon.stub().callsFake(async () => {
                return [...packages];
            }),
            getCombosByDependencyStrings: Sinon.stub().callsFake(async (game: any, dependencyStrings: string[], useLatestVersion = false) => {
                const community = game.internalFolderName;
                const result: ThunderstoreCombo[] = [];
                const processed = new Set<string>();
                const dependencyOrder = new Map<string, number>();

                // Debug logging
                console.log('Current packages in store:', packages.map(p => `${p.full_name} (${p.versions.map(v => v.version_number).join(', ')})`));
                console.log('Looking for dependencies:', dependencyStrings);
                console.log('Community:', community);
                console.log('Use latest version:', useLatestVersion);

                // Helper function to process a dependency string and its dependencies
                const processDependency = async (depStr: string, depth: number = 0): Promise<void> => {
                    // Debug logging
                    console.log('Processing dependency:', depStr, 'at depth:', depth);
                    console.log('Current processed set:', Array.from(processed));

                    // Split the dependency string into name and version
                    // For "author-main-1.0.0", we want:
                    // fullName = "author-main"
                    // version = "1.0.0"
                    const lastDashIndex = depStr.lastIndexOf('-');
                    const fullName = depStr.substring(0, lastDashIndex);
                    const version = depStr.substring(lastDashIndex + 1);

                    // Find the package by matching the full_name
                    const pkg = packages.find(p => p.community === community && p.full_name === fullName);

                    // Debug logging
                    console.log('Looking for package:', fullName);
                    console.log('Found package:', pkg ? `${pkg.full_name} (${pkg.versions.map(v => v.version_number).join(', ')})` : 'not found');

                    if (!pkg) {
                        // Try finding the package by matching the full dependency string
                        const fullDepStr = depStr;
                        const matchingVersion = packages.find(p =>
                            p.community === community &&
                            p.versions.some(v => `${p.full_name}-${v.version_number}` === fullDepStr)
                        );

                        if (matchingVersion) {
                            console.log('Found package by full dependency string:', matchingVersion.full_name);
                            return processDependency(matchingVersion.full_name, depth);
                        }
                        return;
                    }

                    // Create combo for this package
                    const combo = new ThunderstoreCombo();
                    const mod = new ThunderstoreMod();
                    mod.setName(pkg.name);
                    mod.setFullName(pkg.full_name);
                    mod.setDependencies(pkg.dependencies || []);
                    mod.setCategories(pkg.categories || []);
                    combo.setMod(mod);

                    const versionObj = new ThunderstoreVersion();
                    // For modpacks, always use the exact version specified
                    // For regular mods, use latest version if specified
                    const isModpack = pkg.categories.includes('Modpacks');
                    const targetVersion = isModpack ?
                        pkg.versions.find(v => v.version_number === version) || pkg.versions[0] :
                        useLatestVersion ?
                            pkg.versions[0] :
                            pkg.versions.find(v => v.version_number === version) || pkg.versions[0];

                    versionObj.setVersionNumber(new VersionNumber(targetVersion.version_number));
                    versionObj.setName(`${pkg.owner}-${pkg.name}-${targetVersion.version_number}`);
                    versionObj.setDependencies(targetVersion.dependencies || []);
                    combo.setVersion(versionObj);

                    // Process dependencies recursively before adding this combo
                    if (targetVersion.dependencies) {
                        for (const dep of targetVersion.dependencies) {
                            // For modpacks, always use the exact version specified in the dependency
                            // For regular mods, use latest version if specified
                            await processDependency(dep, depth + 1);
                        }
                    }

                    // Only add this combo if we haven't processed it before
                    const comboStr = combo.getDependencyString();
                    if (!processed.has(comboStr)) {
                        processed.add(comboStr);
                        dependencyOrder.set(comboStr, depth);
                        result.push(combo);
                    } else {
                        // Update the order if this path is deeper
                        const currentOrder = dependencyOrder.get(comboStr) || 0;
                        if (depth > currentOrder) {
                            dependencyOrder.set(comboStr, depth);
                        }
                    }
                };

                // Process all initial dependency strings
                for (const depStr of dependencyStrings) {
                    await processDependency(depStr);
                }

                // Debug logging
                console.log('Final result:', result.map(combo => combo.getDependencyString()));

                // Sort results based on dependency order (deeper dependencies come first)
                return result.sort((a, b) => {
                    const orderA = dependencyOrder.get(a.getDependencyString()) || 0;
                    const orderB = dependencyOrder.get(b.getDependencyString()) || 0;
                    return orderB - orderA;
                });
            })
        } as any;

        db.indexHashes = {
            add: Sinon.stub().resolves(),
            where: Sinon.stub().returns({
                equals: Sinon.stub().returns({
                    first: Sinon.stub().resolves(undefined),
                    toArray: Sinon.stub().resolves([])
                }),
                anyOf: Sinon.stub().returns({
                    toArray: Sinon.stub().resolves([])
                })
            }),
            clear: Sinon.stub().resolves()
        } as any;

        DexieStoreProvider.provide(() => db as unknown as StubDexieStore);
        FsProvider.provide(() => new StubFsProvider());
        ProfileProvider.provide(() => new StubProfileProvider());
        InteractionProvider.provide(() => new StubInteractionProvider());
        LinkProvider.provide(() => new StubLinkProvider());
    }

    public static stubTearDown() {
        DexieStoreProvider.provide(() => { throw new Error("DexieStoreProvider not initialized"); });
        FsProvider.provide(() => { throw new Error("FsProvider not initialized"); });
        ProfileProvider.provide(() => { throw new Error("ProfileProvider not initialized"); });
        InteractionProvider.provide(() => { throw new Error("InteractionProvider not initialized"); });
        LinkProvider.provide(() => { throw new Error("LinkProvider not initialized"); });
    }
}
