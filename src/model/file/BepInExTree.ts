import R2Error from "../errors/R2Error";

import fs from 'fs-extra';
import * as path from 'path';

/**
 * The purpose of this class is to create a navigatable tree.
 * This tree ensures mods will go in their correct locations for Manifest V1.
 */
export default class BepInExTree {

    private files: string[] = [];
    private directories: BepInExTree[] = [];
    private directoryName: string = '';

    public static buildFromLocation(location: string): BepInExTree | R2Error {
        const currentTree = new BepInExTree();
        currentTree.setDirectoryName(path.basename(location));
        try {
            const dir = fs.readdirSync(location);
            dir.forEach(file => {
                if (fs.lstatSync(path.join(location, file)).isDirectory()) {
                    const directoryAddError = currentTree.addDirectory(location, file);
                    if (directoryAddError instanceof R2Error) {
                        return directoryAddError;
                    }
                } else {
                    currentTree.addFile(location, file);
                }
            });
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                `Error reading directory in BepInExTree build for directory: ${location}`,
                err.message,
                'Relaunch the manager as admin, directory failed to be read.'
            )
        }
        return currentTree;
    }

    private addFile(location: string, file: string) {
        this.files = [...this.files, path.join(location, file)];
    }

    private addDirectory(location: string, directoryName: string): R2Error | null {
        const directory: BepInExTree | R2Error = BepInExTree.buildFromLocation(path.join(location, directoryName));
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

    public getDirectories(): BepInExTree[] {
        return this.directories;
    }

    public getDirectoryName(): string {
        return this.directoryName;
    }

}
