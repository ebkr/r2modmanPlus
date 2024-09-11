import ThunderstoreMod from "src/model/ThunderstoreMod";
import { filterModVersions } from "../../../../src/utils/ManagerUtils";
import VersionNumber from "src/model/VersionNumber";
import ThunderstoreVersion from "src/model/ThunderstoreVersion";

const getMockPackage = (packageName: string, versionStrings: string[]) => {
    const versions = versionStrings.map((versionString) => {
        const tv = new ThunderstoreVersion();
        tv.setVersionNumber(new VersionNumber(versionString));
        return tv;
    });
    const mod = new ThunderstoreMod();
    mod.setFullName(packageName)
    mod.setVersions(versions);
    return mod;
};


describe("ManagerUtils.filterModVersions", () => {
    it("Validates dependencyString parameter", () => {
        ["", "Team-Package", "Team-Package-1.0.0-alpha", "--"].forEach((dependencyString) => {
            const expected = new Error(`Invalid dependency string "${dependencyString}"`);
            expect(() => filterModVersions([], dependencyString)).toThrowError(expected);
        });
    });

    it("Filters out other versions", () => {
        const packageName = "BepInEx-BepInExPack";
        const versions = ["5.4.2100", "5.4.2101", "5.4.2200"];

        versions.forEach((version) => {
            // Get new mods each time as the list is mutated by filterModVersions.
            const mods = [getMockPackage(packageName, versions)];
            filterModVersions(mods, `${packageName}-${version}`);

            expect(mods.length).toStrictEqual(1);
            expect(mods[0].getVersions().length).toStrictEqual(1);
            expect(mods[0].getVersions()[0].getVersionNumber().toString()).toStrictEqual(version);
        })
    });

    it("Doesn't affect other packages", () => {
        const versions = ["1.0.0", "1.0.1", "1.1.0"];
        const mods = [
            getMockPackage("Foo-Bar", versions),
            getMockPackage("Foo-Baz", versions),
            getMockPackage("Foo-Bak", versions),
        ];

        filterModVersions(mods, "Foo-Bak-1.0.0");

        expect(mods.length).toStrictEqual(3);
        expect(mods[0].getVersions().length).toStrictEqual(3);
        expect(mods[1].getVersions().length).toStrictEqual(3);
        expect(mods[2].getVersions().length).toStrictEqual(1);
        expect(mods[2].getVersions()[0].getVersionNumber().toString()).toStrictEqual("1.0.0");
    });

    it("Does nothing if there is no mods", () => {
        const mods: ThunderstoreMod[] = [];
        filterModVersions(mods, "Bar-Foo-1.0.0");

        expect(mods.length).toStrictEqual(0);
    });

    it("Does nothing if the target package is not found", () => {
        const versions = ["1.0.0"];
        const mods = [
            getMockPackage("Foo-Bar", versions),
            getMockPackage("Foo-Baz", versions),
            getMockPackage("Foo-Bak", versions),
        ];

        filterModVersions(mods, "Bar-Foo-1.0.0");

        expect(mods.length).toStrictEqual(3);
        expect(mods[0].getVersions().length).toStrictEqual(1);
        expect(mods[1].getVersions().length).toStrictEqual(1);
        expect(mods[2].getVersions().length).toStrictEqual(1);
    });

    it("Filters out the whole package if target version is not found", () => {
        const versions = ["1.0.0"];
        const mods = [
            getMockPackage("Foo-Bar", versions),
            getMockPackage("Foo-Baz", versions),
            getMockPackage("Foo-Bak", versions),
        ];

        filterModVersions(mods, "Foo-Bar-2.0.0");

        expect(mods.length).toStrictEqual(2);
        expect(mods[0].getFullName()).toStrictEqual("Foo-Baz");
        expect(mods[1].getFullName()).toStrictEqual("Foo-Bak");
    });
});
