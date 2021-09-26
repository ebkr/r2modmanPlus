import FsProvider from '../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../stubs/providers/InMemory.FsProvider';
import * as path from 'path';

describe("InMemoryFsProvider", () => {

    beforeEach(() => {
        FsProvider.provide(() => new InMemoryFsProvider());
        InMemoryFsProvider.clear();
    });

    test("Exists and Mkdirs", async () => {
        const existsBefore = await FsProvider.instance.exists("Test");
        await FsProvider.instance.mkdirs("Test");
        const existsAfter = await FsProvider.instance.exists("Test");
        expect(existsBefore).toBeFalsy();
        expect(existsAfter).toBeTruthy();
    })

    test("WriteFile and ReadFile", async () => {
        await FsProvider.instance.mkdirs("Test");
        const existsBefore = await FsProvider.instance.exists(path.join("Test", "TestWriteFile"));
        await FsProvider.instance.writeFile(path.join("Test", "TestWriteFile"), "test_content");
        const existsAfter = await FsProvider.instance.exists(path.join("Test", "TestWriteFile"));
        const content = await FsProvider.instance.readFile(path.join("Test", "TestWriteFile"));
        expect(existsBefore).toBeFalsy();
        expect(existsAfter).toBeTruthy();
        expect(content.toString()).toBe("test_content");
    });

});
