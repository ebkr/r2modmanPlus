import * as path from 'path';
import { describe, beforeAll, beforeEach, test, expect } from 'vitest';

import FileTree from '../../../../../src/model/file/FileTree';
import R2Error from '../../../../../src/model/errors/R2Error';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import { providePathImplementation } from '../../../../../src/providers/node/path/path';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import { TestPathProvider } from '../../../stubs/providers/node/Node.Path.Provider';


class RacyFsProvider extends InMemoryFsProvider {
    // Names returned by readdir that don't exist in the underlying in-memory
    // fs — simulates a file that vanished between readdir and lstat.
    public phantomNames = new Map<string, string[]>();

    // Paths whose lstat should throw even though the file still exists
    // (permission denied, busy, etc.).
    public unreadablePaths = new Set<string>();

    override async readdir(p: string): Promise<string[]> {
        const real = await super.readdir(p);
        const phantoms = this.phantomNames.get(p) ?? [];
        return [...real, ...phantoms];
    }

    override async lstat(p: string) {
        if (this.unreadablePaths.has(p)) {
            throw new Error(`Access denied '${p}'.`);
        }
        return super.lstat(p);
    }
}


describe('FileTree.buildFromLocation', () => {
    let fs!: RacyFsProvider;

    beforeAll(() => {
        providePathImplementation(() => TestPathProvider);
    });

    beforeEach(() => {
        InMemoryFsProvider.clear();
        fs = new RacyFsProvider();
        FsProvider.provide(() => fs);
    });

    test('returns a descriptive R2Error when an entry vanishes between readdir and lstat', async () => {
        await fs.mkdirs('folder');
        await fs.writeFile(path.join('folder', 'a.txt'), 'a');
        fs.phantomNames.set('folder', ['gone.txt']);

        const result = await FileTree.buildFromLocation('folder');

        expect(result).toBeInstanceOf(R2Error);
        const err = result as R2Error;
        expect(err.name).toContain('vanished');
        expect(err.message).toContain('gone.txt');
    });

    test('surfaces vanished entries from nested directories', async () => {
        await fs.mkdirs(path.join('root', 'sub'));
        await fs.writeFile(path.join('root', 'sub', 'keep.txt'), 'k');
        fs.phantomNames.set(path.join('root', 'sub'), ['gone.txt']);

        const result = await FileTree.buildFromLocation('root');

        expect(result).toBeInstanceOf(R2Error);
        const err = result as R2Error;
        expect(err.name).toContain('vanished');
        expect(err.message).toContain('gone.txt');
    });

    test('returns a generic R2Error when lstat fails for an entry that still exists', async () => {
        await fs.mkdirs('folder');
        await fs.writeFile(path.join('folder', 'a.txt'), 'a');
        fs.unreadablePaths.add(path.join('folder', 'a.txt'));

        const result = await FileTree.buildFromLocation('folder');

        expect(result).toBeInstanceOf(R2Error);
        const err = result as R2Error;
        expect(err.name).toContain('Error reading folder');
        expect(err.message).toContain('Access denied');
    });
});
