import { chunk } from "../../../../src/utils/ArrayUtils";

describe("ArrayUtils.chunk", () => {
    it("Validates chunkSize parameter", () => {
        const expected = new Error("chunk requires positive integer as chunkSize");
        expect(() => chunk([], -1)).toThrowError(expected);
        expect(() => chunk([], 0)).toThrowError(expected);
        expect(() => chunk([], 1.234)).toThrowError(expected);
        expect(() => chunk([], NaN)).toThrowError(expected);
        expect(() => chunk([], Infinity)).toThrowError(expected);
    });

    it("Doesn't mutate the original array", () => {
        let original = [0, 1];
        chunk(original, 1);
        expect(original.length).toBe(2);
        expect(original[0]).toStrictEqual(0);
        expect(original[1]).toStrictEqual(1);
    });

    it("Chunks empty arrays", () => {
        const actual = chunk([], 1);
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toStrictEqual(0);
    });

    it("Chunks divisible arrays", () => {
        const actual1 = chunk([1, 2, 3, 4], 1);
        expect(Array.isArray(actual1)).toBeTruthy();
        expect(actual1.length).toStrictEqual(4);
        expect(actual1[0][0]).toStrictEqual(1);
        expect(actual1[1][0]).toStrictEqual(2);
        expect(actual1[2][0]).toStrictEqual(3);
        expect(actual1[3][0]).toStrictEqual(4);

        const actual2 = chunk(["a", "b", "c", "d"], 2);
        expect(Array.isArray(actual2)).toBeTruthy();
        expect(actual2.length).toStrictEqual(2);
        expect(actual2[0][0]).toStrictEqual("a");
        expect(actual2[0][1]).toStrictEqual("b");
        expect(actual2[1][0]).toStrictEqual("c");
        expect(actual2[1][1]).toStrictEqual("d");

        const actual3 = chunk([{x: 1}, {x: "a"}, {x: () => null}, {x: []}], 4);
        expect(Array.isArray(actual3)).toBeTruthy();
        expect(actual3.length).toStrictEqual(1);
        expect(actual3[0][0]["x"]).toStrictEqual(1);
        expect(actual3[0][1]["x"]).toStrictEqual("a");
        expect(typeof actual3[0][2]["x"]).toStrictEqual("function");
        expect(Array.isArray(actual3[0][3]["x"])).toBeTruthy();
    });

    it("Chunks arrays with orphans", () => {
        const actual1 = chunk([1, 2, 3], 2);
        expect(Array.isArray(actual1)).toBeTruthy();
        expect(actual1.length).toStrictEqual(2);
        expect(actual1[0].length).toStrictEqual(2);
        expect(actual1[1].length).toStrictEqual(1);

        const actual2 = chunk([1, 2, 3, "a", "b", "c", 4, 5], 3);
        expect(Array.isArray(actual2)).toBeTruthy();
        expect(actual2.length).toStrictEqual(3);
        expect(actual2[0].length).toStrictEqual(3);
        expect(actual2[1].length).toStrictEqual(3);
        expect(actual2[2].length).toStrictEqual(2);
    });
});
