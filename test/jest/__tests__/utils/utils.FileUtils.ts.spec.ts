import FileUtils from "../../../../src/utils/FileUtils";

describe("FileUtils.hideWindowsUsername", () => {
    it("Doesn't change slashes", () => {
        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\Alice\\appData')
        ).toStrictEqual('C:\\Users\\***\\appData');

        expect(
            FileUtils.hideWindowsUsername('C:/Users/Bob/appData')
        ).toStrictEqual('C:/Users/***/appData');
    });

    it("Doesn't change drive letters", () => {
        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\Charlie\\appData')
        ).toStrictEqual('C:\\Users\\***\\appData');

        expect(
            FileUtils.hideWindowsUsername('x:\\Users\\David\\appData')
        ).toStrictEqual('x:\\Users\\***\\appData');
    });

    it("Doesn't change the rest of the path", () => {
        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\Eve\\')
        ).toStrictEqual('C:\\Users\\***\\');

        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\Frank\\Desktop')
        ).toStrictEqual('C:\\Users\\***\\Desktop');

        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\Grace\\Desktop\\')
        ).toStrictEqual('C:\\Users\\***\\Desktop\\');

        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\Heidi\\Desktop\\file.txt')
        ).toStrictEqual('C:\\Users\\***\\Desktop\\file.txt');
    });

    it("Doesn't affect other paths", () => {
        expect(
            FileUtils.hideWindowsUsername('C:\\LUsers\\Ivan\\')
        ).toStrictEqual('C:\\LUsers\\Ivan\\');

        expect(
            FileUtils.hideWindowsUsername('C:\\temp\\Users\\Judy\\')
        ).toStrictEqual('C:\\temp\\Users\\Judy\\');
    });

    it("Isn't tricked by odd usernames", () => {
        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\123\\')
        ).toStrictEqual('C:\\Users\\***\\');

        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\@admin\\')
        ).toStrictEqual('C:\\Users\\***\\');

        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\_\\')
        ).toStrictEqual('C:\\Users\\***\\');

        expect(
            FileUtils.hideWindowsUsername('C:\\Users\\***\\')
        ).toStrictEqual('C:\\Users\\***\\');
    });
});
