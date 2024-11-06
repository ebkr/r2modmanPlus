import R2Error from "../model/errors/R2Error";
import FileTree from "../model/file/FileTree";
import { ImmutableProfile } from "../model/Profile";
import ManifestV2 from "../model/ManifestV2";
import FsProvider from "../providers/generic/file/FsProvider";

export type InstallArgs = {
    mod: ManifestV2;
    profile: ImmutableProfile;
    packagePath: string;
};

export interface PackageInstaller {
    install(args: InstallArgs): Promise<void>;
    uninstall?(args: InstallArgs): Promise<void>;
    enable?(args: InstallArgs): Promise<void>;
    disable?(args: InstallArgs): Promise<void>;
}

export async function disableModByRenamingFiles(folderName: string) {
    const tree = await FileTree.buildFromLocation(folderName);
    if (tree instanceof R2Error) {
        throw tree;
    }

    for (const filePath of tree.getRecursiveFiles()) {
        if (!filePath.toLowerCase().endsWith(".old")) {
            await FsProvider.instance.rename(filePath, `${filePath}.old`);
        }
    }
}

export async function enableModByRenamingFiles(folderName: string) {
    const tree = await FileTree.buildFromLocation(folderName);
    if (tree instanceof R2Error) {
        throw tree;
    }

    for (const filePath of tree.getRecursiveFiles()) {
        if (filePath.toLowerCase().endsWith(".old")) {
            await FsProvider.instance.rename(
                filePath,
                filePath.substring(0, filePath.length - ('.old').length)
            );
        }
    }
}
