import ThunderstoreMod from "src/model/ThunderstoreMod";

const getMockPackage = (pinned: boolean, deprecated: boolean, updated: string) => {
    const mod = new ThunderstoreMod();
    mod.setPinnedStatus(pinned);
    mod.setDeprecatedStatus(deprecated);
    mod.setDateUpdated(updated);
    return mod;
};

// Fisher-Yates shuffle algorithm. Just calling array.sort(Math.random() - 0.5)
// seemed to result in slightly less random distribution of items.
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

describe("ThunderstoreMod.defaultOrderComparer", () => {
    it("Sorts mods list to match Thunderstore API's ordering", () => {
        const mods = [
            getMockPackage(true, true, "2024-09-01"),
            getMockPackage(true, true, "2024-08-01"),
            getMockPackage(true, false, "2024-09-01"),
            getMockPackage(true, false, "2024-08-01"),
            getMockPackage(false, true, "2024-09-01"),
            getMockPackage(false, true, "2024-08-01"),
            getMockPackage(false, false, "2024-09-01"),
            getMockPackage(false, false, "2024-08-01"),
        ]

        for (let i = 0; i < 5; i++) {
            shuffleArray(mods);

            mods.sort(ThunderstoreMod.defaultOrderComparer);

            // Pinned, non-deprecated by date
            expect(mods[0].isPinned()).toStrictEqual(true);
            expect(mods[0].isDeprecated()).toStrictEqual(false);
            expect(mods[0].getDateUpdated()).toStrictEqual("2024-09-01");
            expect(mods[1].isPinned()).toStrictEqual(true);
            expect(mods[1].isDeprecated()).toStrictEqual(false);
            expect(mods[1].getDateUpdated()).toStrictEqual("2024-08-01");

            // Pinned, deprecated by date
            expect(mods[2].isPinned()).toStrictEqual(true);
            expect(mods[2].isDeprecated()).toStrictEqual(true);
            expect(mods[2].getDateUpdated()).toStrictEqual("2024-09-01");
            expect(mods[3].isPinned()).toStrictEqual(true);
            expect(mods[3].isDeprecated()).toStrictEqual(true);
            expect(mods[3].getDateUpdated()).toStrictEqual("2024-08-01");

            // Non-pinned, non-deprecated by date
            expect(mods[4].isPinned()).toStrictEqual(false);
            expect(mods[4].isDeprecated()).toStrictEqual(false);
            expect(mods[4].getDateUpdated()).toStrictEqual("2024-09-01");
            expect(mods[5].isPinned()).toStrictEqual(false);
            expect(mods[5].isDeprecated()).toStrictEqual(false);
            expect(mods[5].getDateUpdated()).toStrictEqual("2024-08-01");

            // Non-pinned, deprecated by date
            expect(mods[6].isPinned()).toStrictEqual(false);
            expect(mods[6].isDeprecated()).toStrictEqual(true);
            expect(mods[6].getDateUpdated()).toStrictEqual("2024-09-01");
            expect(mods[7].isPinned()).toStrictEqual(false);
            expect(mods[7].isDeprecated()).toStrictEqual(true);
            expect(mods[7].getDateUpdated()).toStrictEqual("2024-08-01");
        }
    });
});
