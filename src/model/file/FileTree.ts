import R2Error from '../errors/R2Error';
import FsProvider from '../../providers/generic/file/FsProvider';
import path from '../../providers/node/path/path';

/**
 * The purpose of this class is to create a navigatable tree.
 * This tree ensures mods will go in their correct locations for Manifest V1.
 */
export default class FileTree {

    private files: string[] = [];
    private directories: FileTree[] = [];
    private directoryName: string = '';
    private target: string = '';

    public static async buildFromLocation(location: string): Promise<FileTree | R2Error> {
        const fs = FsProvider.instance;
        const currentTree = new FileTree();
        currentTree.target = location;
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
            const err: Error = e as Error;
            return Promise.resolve(
                new R2Error(
                    `Error reading folder in FileTree build for folder: ${location}`,
                    err.message,
                    'Relaunch the manager as admin, folder failed to be read.'
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

    public removeFilesWithBasename(...args: string[]) {
        this.files = this.files.filter(value => !args.map(arg => arg.toLowerCase()).includes(path.basename(value).toLowerCase()));
    }

    public removeDirectories(...args: string[]) {
        this.directories = this.directories.filter(value => !args.map(arg => arg.toLowerCase()).includes(value.getDirectoryName().toLowerCase()));
    }

    public navigateAndPerform(onFound: (fileTree: FileTree) => void, ...args: string[]) {
        const dir = this.navigate(...args);
        if (dir !== undefined) {
            onFound(dir);
        }
    }

    public navigate(...args: string[]): FileTree | undefined {
        if (args[0] !== undefined) {
            const foundDir = this.directories.find(value => value.directoryName.toLowerCase() === args[0].toLowerCase());
            if (foundDir !== undefined) {
                return foundDir.subNavigate(...args.splice(1));
            }
        }
    }

    private subNavigate(...args: string[]): FileTree | undefined {
        if (args[0] !== undefined) {
            const foundDir = this.directories.find(value => value.directoryName.toLowerCase() === args[0].toLowerCase());
            if (foundDir !== undefined) {
                return foundDir.subNavigate(...args.splice(1));
            }
        } else {
            return this;
        }
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
        return [...this.files];
    }

    /**
     * Returns an array of files with absolute (full) paths
     */
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

    public getTarget(): string {
        return this.target;
    }

}
