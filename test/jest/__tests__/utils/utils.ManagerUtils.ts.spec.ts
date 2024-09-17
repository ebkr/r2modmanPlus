import ThunderstoreMod from "src/model/ThunderstoreMod";
import { filterModVersions, filterModVersionsByDate } from "../../../../src/utils/ManagerUtils";
import VersionNumber from "src/model/VersionNumber";
import ThunderstoreVersion from "src/model/ThunderstoreVersion";

type MockVersionData = string | [string, string];  // VersionNumber or [versionNumber, dateCreated]

const getMockPackage = (packageName: string, versionsData: MockVersionData[]) => {
    const versions = versionsData.map((versionData) => {
        const tv = new ThunderstoreVersion();

        if (typeof versionData === "string") {
            tv.setVersionNumber(new VersionNumber(versionData));
        } else {
            tv.setVersionNumber(new VersionNumber(versionData[0]));
            tv.setDateCreated(versionData[1]);
        }

        return tv;
    });
    const mod = new ThunderstoreMod();
    mod.setFullName(packageName);
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


describe("ManagerUtils.filterModVersionsByDate", () => {
    it("Validates date parameters", () => {
        expect(
            () => filterModVersionsByDate([], "2024-09-02", "2024-09-01")
        ).toThrowError("Argument startDate can't be greater than endDate");

        expect(
            () => filterModVersionsByDate([], "2024-09-01", "2024-09-01")
        ).not.toThrowError("Argument startDate can't be greater than endDate");

        expect(
            () => filterModVersionsByDate([], "2024-09-01", "2024-09-02")
        ).not.toThrowError("Argument startDate can't be greater than endDate");
    });

    it("Filters out versions that are too old", () => {
        const mods = [
            getMockPackage("Foo-Bar", [
                ["1.0.0", "2020-02-20T23:59:59Z"],
                ["1.1.0", "2020-02-21T00:00:00Z"],
                ["1.2.0", "2020-02-21T00:00:01Z"],
            ])
        ];

        filterModVersionsByDate(mods, "2020-02-20", undefined);
        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getVersions().length).toStrictEqual(3);

        filterModVersionsByDate(mods, "2020-02-21", undefined);

        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getVersions().length).toStrictEqual(2);
        expect(mods[0].getVersions()[0].getDateCreated()).toStrictEqual("2020-02-21T00:00:00Z");
        expect(mods[0].getVersions()[1].getDateCreated()).toStrictEqual("2020-02-21T00:00:01Z");

        filterModVersionsByDate(mods, "2020-02-21T00:00:01Z", undefined);

        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getVersions().length).toStrictEqual(1);
        expect(mods[0].getVersions()[0].getDateCreated()).toStrictEqual("2020-02-21T00:00:01Z");

        filterModVersionsByDate(mods, "2020-02-21T00:00:02Z", undefined);

        expect(mods.length).toStrictEqual(0);
    });

    it("Filters out versions that are too new", () => {
        const mods = [
            getMockPackage("Foo-Bar", [
                ["1.0.0", "2020-02-20T00:00:00Z"],
                ["1.1.0", "2020-02-20T12:00:00Z"],
                ["1.2.0", "2020-02-21T00:00:01Z"],
            ])
        ];

        filterModVersionsByDate(mods, undefined, "2020-02-21");

        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getVersions().length).toStrictEqual(2);
        expect(mods[0].getVersions()[0].getDateCreated()).toStrictEqual("2020-02-20T00:00:00Z");
        expect(mods[0].getVersions()[1].getDateCreated()).toStrictEqual("2020-02-20T12:00:00Z");

        filterModVersionsByDate(mods, undefined, "2020-02-20T12:00:00Z");

        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getVersions().length).toStrictEqual(2);
        expect(mods[0].getVersions()[0].getDateCreated()).toStrictEqual("2020-02-20T00:00:00Z");
        expect(mods[0].getVersions()[1].getDateCreated()).toStrictEqual("2020-02-20T12:00:00Z");

        filterModVersionsByDate(mods, undefined, "2020-02-20T11:59:59Z");

        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getVersions().length).toStrictEqual(1);
        expect(mods[0].getVersions()[0].getDateCreated()).toStrictEqual("2020-02-20T00:00:00Z");

        filterModVersionsByDate(mods, undefined, "2020-02-19T23:59:59Z");

        expect(mods.length).toStrictEqual(0);

    });

    it("Filters out the whole package if no matching versions are found", () => {
        const mods = [
            getMockPackage("Foo-Bar", [["1.0.0", "2025-05-05"]]),
            getMockPackage("Foo-Baz", [["1.0.0", "2025-05-09"]]),
            getMockPackage("Foo-Bak", [["1.0.0", "2025-05-05"], ["1.0.1", "2025-05-09"]]),
            getMockPackage("Foo-Bat", [["1.0.0", "2025-05-05"], ["1.0.1", "2025-05-07"], ["1.0.2", "2025-05-09"]]),
        ];

        filterModVersionsByDate(mods, "2025-05-06", "2025-05-08");

        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getFullName()).toStrictEqual("Foo-Bat");
        expect(mods[0].getVersions().length).toStrictEqual(1);
        expect(mods[0].getVersions()[0].getDateCreated()).toStrictEqual("2025-05-07");
    });

    it("Updates package's dataUpdated to match the latest remaining version and sorts the array", () => {
        const mods = [
            getMockPackage("Foo-Bar", [["1.0.0", "2025-05-05"]]),
            getMockPackage("Foo-Baz", [["1.0.0", "2025-05-06"], ["1.0.1", "2025-05-09"]]),
        ];
        mods[0].setDateUpdated("2025-05-05");
        mods[1].setDateUpdated("2025-05-09");

        filterModVersionsByDate(mods, undefined, "2025-05-08");

        expect(mods.length).toStrictEqual(2);
        expect(mods[0].getFullName()).toStrictEqual("Foo-Baz");
        expect(mods[0].getDateUpdated()).toStrictEqual("2025-05-06");
        expect(mods[1].getFullName()).toStrictEqual("Foo-Bar");
        expect(mods[1].getDateUpdated()).toStrictEqual("2025-05-05");
    });

    it("Handles zero-length time bubbles", () => {
        const mods = [
            getMockPackage("Foo-Bar", [
                ["1.0.0", "1970-01-01T01:01:00Z"],
                ["2.0.0", "1970-01-01T01:01:01Z"],
                ["3.0.0", "1970-01-01T01:01:02Z"],
            ])
        ];

        filterModVersionsByDate(mods, "1970-01-01T01:01:01Z", "1970-01-01T01:01:01Z");

        expect(mods.length).toStrictEqual(1);
        expect(mods[0].getVersions().length).toStrictEqual(1);
        expect(mods[0].getVersions()[0].getDateCreated()).toStrictEqual("1970-01-01T01:01:01Z");
    });
});
