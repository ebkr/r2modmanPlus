import DexieStoreProvider from "src/providers/generic/db/DexieStoreProvider";
import TestSetup from "../test-setup";
import { StubDexieStore } from "../stubs/providers/stub.DexieStore";
import Game from "src/model/game/Game";
import ThunderstoreCombo from "src/model/ThunderstoreCombo";

describe('Dexie test', () => {
    beforeEach(async () => {
        await TestSetup.stubSetUp();
    });

    it('should open the database and access tables', async () => {
        const db = DexieStoreProvider.instance;
        await db.open();
        expect(db.packages).toBeDefined();
        expect(db.indexHashes).toBeDefined();
    });

    it('should store and retrieve packages correctly', async () => {
        const db = DexieStoreProvider.instance as unknown as StubDexieStore;

        // Add a test package
        const testPackage = {
            community: "RiskOfRain2",
            owner: "author",
            name: "testMod",
            full_name: "author-testMod",
            uuid4: "test-uuid",
            package_url: "",
            rating_score: 0,
            is_pinned: false,
            is_deprecated: false,
            has_nsfw_content: false,
            categories: [],
            date_updated: new Date(),
            date_created: new Date(),
            donation_link: "",
            date_fetched: new Date(),
            versions: [{
                version_number: "1.0.0",
                dependencies: ["author-dep-1.0.0"],
                name: "author-testMod-1.0.0",
                full_name: "author-testMod-1.0.0",
                uuid4: "test-uuid",
                description: "",
                icon: "",
                is_active: true,
                downloads: 0,
                download_url: "",
                website_url: "",
                file_size: 0,
                date_created: new Date()
            }]
        };

        // Add the package to the store
        await db.packages.add(testPackage);

        // Verify the package was stored
        const packages = await db.packages.toArray();
        expect(packages).toHaveLength(1);
        expect(packages[0].full_name).toBe("author-testMod");
        expect(packages[0].versions[0].version_number).toBe("1.0.0");
        expect(packages[0].versions[0].dependencies).toContain("author-dep-1.0.0");

        // Test retrieving by full name and community
        const retrievedPackage = await db.packages.where({
            community: "RiskOfRain2",
            full_name: "author-testMod"
        }).first();
        expect(retrievedPackage).toBeDefined();
        expect(retrievedPackage?.full_name).toBe("author-testMod");

        // Test retrieving by community
        const communityPackages = await db.packages.where({
            community: "RiskOfRain2"
        }).toArray();
        expect(communityPackages).toHaveLength(1);
        expect(communityPackages[0].full_name).toBe("author-testMod");
    });

    it('should handle dependencies correctly', async () => {
        const db = DexieStoreProvider.instance as unknown as StubDexieStore;
        const game = {
            internalFolderName: "RiskOfRain2"
        } as Game;

        // Add a dependency package
        const depPackage = {
            community: "RiskOfRain2",
            owner: "author",
            name: "dep",
            full_name: "author-dep",
            uuid4: "dep-uuid",
            package_url: "",
            rating_score: 0,
            is_pinned: false,
            is_deprecated: false,
            has_nsfw_content: false,
            categories: [],
            date_updated: new Date(),
            date_created: new Date(),
            donation_link: "",
            date_fetched: new Date(),
            versions: [{
                version_number: "1.0.0",
                dependencies: [],
                name: "author-dep-1.0.0",
                full_name: "author-dep-1.0.0",
                uuid4: "dep-uuid",
                description: "",
                icon: "",
                is_active: true,
                downloads: 0,
                download_url: "",
                website_url: "",
                file_size: 0,
                date_created: new Date()
            }]
        };

        // Add a package that depends on the dependency
        const mainPackage = {
            community: "RiskOfRain2",
            owner: "author",
            name: "main",
            full_name: "author-main",
            uuid4: "main-uuid",
            package_url: "",
            rating_score: 0,
            is_pinned: false,
            is_deprecated: false,
            has_nsfw_content: false,
            categories: [],
            date_updated: new Date(),
            date_created: new Date(),
            donation_link: "",
            date_fetched: new Date(),
            versions: [{
                version_number: "1.0.0",
                dependencies: ["author-dep-1.0.0"],
                name: "author-main-1.0.0",
                full_name: "author-main-1.0.0",
                uuid4: "main-uuid",
                description: "",
                icon: "",
                is_active: true,
                downloads: 0,
                download_url: "",
                website_url: "",
                file_size: 0,
                date_created: new Date()
            }]
        };

        // Add both packages to the store
        await db.packages.add(depPackage);
        await db.packages.add(mainPackage);

        // Verify packages were added
        const allPackages = await db.packages.toArray();
        console.log('Packages in store after adding:', allPackages.map(p => `${p.full_name} (${p.versions.map(v => v.version_number).join(', ')})`));

        // Test getting dependencies - use the full dependency string
        const combos = await (db.packages as any).getCombosByDependencyStrings(game, ["author-main-1.0.0"], false);

        // Verify we got both the main package and its dependency
        expect(combos).toHaveLength(2);

        // Get the dependency strings
        const dependencyStrings = combos.map((combo: ThunderstoreCombo) => combo.getDependencyString());

        // Verify both packages are included
        expect(dependencyStrings).toContain("author-main-1.0.0");
        expect(dependencyStrings).toContain("author-dep-1.0.0");

        // Verify the dependency comes before the main package (deeper dependencies first)
        const depIndex = dependencyStrings.indexOf("author-dep-1.0.0");
        const mainIndex = dependencyStrings.indexOf("author-main-1.0.0");
        expect(depIndex).toBeLessThan(mainIndex);
    });
});
