import R2Error from '../errors/R2Error';

import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';

/**
 * The purpose of this class is to create a navigatable tree.
 * This tree ensures mods will go in their correct locations for Manifest V1.
 */
export default class FileTree {

    private files: string[] = [];
    private directories: FileTree[] = [];
    private directoryName: string = '';

    public static async buildFromLocation(location: string): Promise<FileTree | R2Error> {
        const fs = FsProvider.instance;
        const currentTree = new FileTree();
        currentTree.setDirectoryName(path.basename(location));
        try {
            const dir = await fs.readdir(location);
            for (const file of dir) {
                if ((await fs.lstat(path.join(location, file))).isDirectory()) {
                    const directoryAddError = await currentTree.addDirectory(location, file);
                    if (directoryAddError instanceof R2Error) {
                        return directoryAddError;
                    }
                } else {
                    currentTree.addFile(location, file);
                }
            }
        } catch (e) {
            const err: Error = e;
            return Promise.resolve(
                new R2Error(
                    `Error reading directory in FileTree build for directory: ${location}`,
                    err.message,
                    'Relaunch the manager as admin, directory failed to be read.'
                )
            );
        }
        return Promise.resolve(currentTree);
    }

    private addFile(location: string, file: string) {
        this.files = [...this.files, path.join(location, file)];
    }

    public removeFiles(...args: string[]) {
        this.files = this.files.filter(value => !args.map(arg => arg.toLowerCase()).includes(value.toLowerCase()));
    }

    private async addDirectory(location: string, directoryName: string): Promise<R2Error | null> {
        const directory: FileTree | R2Error = await FileTree.buildFromLocation(path.join(location, directoryName));
        if (directory instanceof R2Error) {
            return directory;
        }
        this.directories = [...this.directories, directory];
        return null;
    }

    private setDirectoryName(name: string) {
        this.directoryName = name;
    }

    public getFiles(): string[] {
        return this.files;
    }

    public getRecursiveFiles(): string[] {
        const files = [...this.files];
        this.directories.forEach(tree => {
            files.push(...tree.getRecursiveFiles());
        });
        return files;
    }

    public getDirectories(): FileTree[] {
        return this.directories;
    }

    public getDirectoryName(): string {
        return this.directoryName;
    }

}
