import path from "../../providers/node/path/path";
import ManagerInformation from "../../_managerinf/ManagerInformation";
import R2Error from "../../model/errors/R2Error";
import FsProvider from "../../providers/generic/file/FsProvider";
import { DataFolderProvider } from "../../providers/ror2/system/DataFolderProvider";
import InteractionProvider from "../../providers/ror2/system/InteractionProvider";
import PathResolver from "../../r2mm/manager/PathResolver";

export class DataFolderProviderImpl extends DataFolderProvider {
    readonly overrideFile: string = ".ddir.mm"

    /***
     * @returns folder path as string, null if user cancelled selection.
     */
    async showSelectionDialog(): Promise<string|null> {
        const files = await InteractionProvider.instance.selectFolder({
            title: `Select a new folder to store ${ManagerInformation.APP_NAME} data`,
            defaultPath: PathResolver.ROOT,
            buttonLabel: "Select data folder"
        });

        // User closed the dialog without selecting a folder.
        if (files.length === 0) {
            return null;
        }

        if (files.length === 1) {
            return files[0];
        }

        // Shouldn't be possible to select multiple folders but someone always finds a way.
        throw new R2Error("Select exactly one folder", `${files.length} items were selected.`);
    }

    async throwForInvalidFolder(folderPath: string): Promise<void> {
        // Default DataFolder is always valid.
        if (folderPath === PathResolver.APPDATA_DIR) {
            return;
        }

        const filesInFolder = await FsProvider.instance.readdir(folderPath);
        const hasOverrideFile = filesInFolder.some(
            file => file.toLowerCase() === this.overrideFile
        );

        // Previously used DataFolders are valid.
        if (hasOverrideFile) {
            return;
        }

        // Empty folders are valid.
        if (filesInFolder.length === 0) {
            return;
        }

        throw new R2Error(
            "Selected folder is not empty",
            `${folderPath} contains ${filesInFolder.length} files.`,
            "Select an empty folder or create a new one."
        );
    }

    async writeOverrideFile(folderPath: string): Promise<void> {
        const filePath = path.join(folderPath, this.overrideFile);

        try {
            await FsProvider.instance.writeFile(filePath, "");
        } catch (err) {
            throw R2Error.fromThrownValue(err, "Failed to change data folder");
        }
    }
}
