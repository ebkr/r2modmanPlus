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

    test("CopyFile", async () => {
        await FsProvider.instance.mkdirs("Test_Pre");
        await FsProvider.instance.mkdirs("Test_Post");
        await FsProvider.instance.writeFile(path.join("Test_Pre", "TestWriteFile"), "test_content");
        await FsProvider.instance.copyFile(path.join("Test_Pre", "TestWriteFile"), path.join("Test_Post", "TestWriteFileCopied"));
        const content = await FsProvider.instance.readFile(path.join("Test_Post", "TestWriteFileCopied"));
        expect(content.toString()).toBe("test_content");
    });

    test("CopyFolder", async () => {
        await FsProvider.instance.mkdirs(path.join("Test", "Pre"));
        await FsProvider.instance.writeFile(path.join("Test", "Pre", "TestWriteFile"), "test_content");
        await FsProvider.instance.copyFolder(path.join("Test", "Pre"), path.join("Test", "Post"));
        const content = await FsProvider.instance.readFile(path.join("Test", "Post", "TestWriteFile"));
        expect(content.toString()).toBe("test_content");
    });

    test("Rename throws for missing source", async() => {
        await expect(
            async () => await FsProvider.instance.rename("foo", "bar")
        ).rejects.toThrowError("ENOENT: no such file or directory, rename 'foo' -> 'bar'");
    });

    test("Rename throws for missing target path", async() => {
        const sourcePath = path.join("original", "file.txt");
        const targetPath = path.join("new", "file.txt")
        await FsProvider.instance.mkdirs(path.dirname(sourcePath));
        await FsProvider.instance.writeFile(sourcePath, "content");

        await expect(
            async () => await FsProvider.instance.rename(sourcePath, targetPath)
        ).rejects.toThrowError(`ENOENT: no such file or directory, rename '${sourcePath}' -> '${targetPath}'`);
    });

    test("Rename a file in same dir", async() => {
        const sourcePath = path.join("dir", "file.txt");
        const targetPath = path.join("dir", "file.txt.old");
        await FsProvider.instance.mkdirs(path.dirname(sourcePath));
        await FsProvider.instance.writeFile(sourcePath, "content");
        expect(await FsProvider.instance.exists(sourcePath)).toBeTruthy();
        expect(await FsProvider.instance.exists(targetPath)).toBeFalsy();
        expect(
            (await FsProvider.instance.lstat(sourcePath)).isFile()
        ).toBeTruthy();

        await FsProvider.instance.rename(sourcePath, targetPath);

        expect(await FsProvider.instance.exists(sourcePath)).toBeFalsy();
        expect(await FsProvider.instance.exists(targetPath)).toBeTruthy();
        expect(
            (await FsProvider.instance.lstat(targetPath)).isFile()
        ).toBeTruthy();
    });

    test("Rename a file into another dir", async() => {
        const sourcePath = path.join("dir", "file.txt");
        const targetPath = path.join("landaa", "file.txt");
        await FsProvider.instance.mkdirs(path.dirname(sourcePath));
        await FsProvider.instance.writeFile(sourcePath, "content");
        await FsProvider.instance.mkdirs(path.dirname(targetPath));
        expect(await FsProvider.instance.exists(sourcePath)).toBeTruthy();
        expect(await FsProvider.instance.exists(targetPath)).toBeFalsy();
        expect(
            (await FsProvider.instance.lstat(sourcePath)).isFile()
        ).toBeTruthy();

        await FsProvider.instance.rename(sourcePath, targetPath);

        expect(await FsProvider.instance.exists(sourcePath)).toBeFalsy();
        expect(await FsProvider.instance.exists(targetPath)).toBeTruthy();
        expect(
            (await FsProvider.instance.lstat(targetPath)).isFile()
        ).toBeTruthy();
    });

    test("Rename a file with relative path", async() => {
        const sourcePath = path.join("root", "middle", "file.txt");
        const targetPath = path.join(path.dirname(sourcePath), "..", "file.txt");
        await FsProvider.instance.mkdirs(path.dirname(sourcePath));
        await FsProvider.instance.writeFile(sourcePath, "content");
        expect(await FsProvider.instance.exists(sourcePath)).toBeTruthy();
        expect(await FsProvider.instance.exists(targetPath)).toBeFalsy();
        expect(
            (await FsProvider.instance.lstat(sourcePath)).isFile()
        ).toBeTruthy();

        await FsProvider.instance.rename(sourcePath, targetPath);

        expect(await FsProvider.instance.exists(sourcePath)).toBeFalsy();
        expect(await FsProvider.instance.exists(targetPath)).toBeTruthy();
        expect(
            (await FsProvider.instance.lstat(targetPath)).isFile()
        ).toBeTruthy();
    });

    test("Rename a dir in same dir", async() => {
        const sourcePath = path.join("dir", "subdir");
        const targetPath = path.join("dir", "newdir");
        await FsProvider.instance.mkdirs(sourcePath);
        expect(await FsProvider.instance.exists(sourcePath)).toBeTruthy();
        expect(await FsProvider.instance.exists(targetPath)).toBeFalsy();
        expect(
            (await FsProvider.instance.lstat(sourcePath)).isDirectory()
        ).toBeTruthy();

        await FsProvider.instance.rename(sourcePath, targetPath);

        expect(await FsProvider.instance.exists(sourcePath)).toBeFalsy();
        expect(await FsProvider.instance.exists(targetPath)).toBeTruthy();
        expect(
            (await FsProvider.instance.lstat(targetPath)).isDirectory()
        ).toBeTruthy();
    });

    test("Rename a dir into another dir", async() => {
        const sourcePath = path.join("dir", "lan", "daa");
        const targetPath = path.join("dar", "lan", "daa");
        await FsProvider.instance.mkdirs(sourcePath);
        await FsProvider.instance.mkdirs(path.dirname(targetPath));
        expect(await FsProvider.instance.exists(sourcePath)).toBeTruthy();
        expect(await FsProvider.instance.exists(targetPath)).toBeFalsy();
        expect(
            (await FsProvider.instance.lstat(sourcePath)).isDirectory()
        ).toBeTruthy();

        await FsProvider.instance.rename(sourcePath, targetPath);

        expect(await FsProvider.instance.exists(sourcePath)).toBeFalsy();
        expect(await FsProvider.instance.exists(targetPath)).toBeTruthy();
        expect(
            (await FsProvider.instance.lstat(targetPath)).isDirectory()
        ).toBeTruthy();
    });

    test("Rename a dir with relative path", async() => {
        const sourcePath = path.join("root", "middle", "leaf");
        const targetPath = path.join("root", "middle", "..", "leaf");
        await FsProvider.instance.mkdirs(sourcePath);
        await FsProvider.instance.mkdirs(path.dirname(targetPath));
        expect(await FsProvider.instance.exists(sourcePath)).toBeTruthy();
        expect(await FsProvider.instance.exists(targetPath)).toBeFalsy();
        expect(
            (await FsProvider.instance.lstat(sourcePath)).isDirectory()
        ).toBeTruthy();

        await FsProvider.instance.rename(sourcePath, targetPath);

        expect(await FsProvider.instance.exists(sourcePath)).toBeFalsy();
        expect(await FsProvider.instance.exists(targetPath)).toBeTruthy();
        expect(
            (await FsProvider.instance.lstat(targetPath)).isDirectory()
        ).toBeTruthy();
    });

    test("SetModifiedTime", async () => {
        const testFilePath = path.join("Test", "TestFile");
        await FsProvider.instance.mkdirs(path.dirname(testFilePath));
        await FsProvider.instance.writeFile(testFilePath, "test_content");
        const statOriginal = await FsProvider.instance.stat(testFilePath);
        const dateWritten = statOriginal.mtime;
        console.log("Original time:", statOriginal.mtime.getTime());
        const fakeDate = new Date();
        fakeDate.setFullYear(2021);
        console.log("Fake time:", fakeDate.getTime());
        await FsProvider.instance.setModifiedTime(testFilePath, fakeDate);
        const statNew = await FsProvider.instance.stat(testFilePath);
        const modifiedDate = statNew.mtime;
        console.log("New time:", statNew.mtime.getTime());
        expect(dateWritten.getTime()).toBeGreaterThan(modifiedDate.getTime());
    });

    test("File size", async () => {
        const testFilePath = path.join("Test", "TestFile");
        await FsProvider.instance.mkdirs(path.dirname(testFilePath));
        await FsProvider.instance.writeFile(testFilePath, "test_content");
        const stat = await FsProvider.instance.stat(testFilePath);
        expect(stat.size).toBe("test_content".length);
    });

});
