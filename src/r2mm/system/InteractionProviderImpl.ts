import InteractionProvider, {
    InteractionProviderFileProperties,
    InteractionProviderFolderProperties
} from '../../providers/ror2/system/InteractionProvider';
import { clipboard, ipcRenderer, OpenDialogOptions } from 'electron';

export default class InteractionProviderImpl extends InteractionProvider {

    restartApp(): void {
        ipcRenderer.send('restart');
    }

    async selectFolder(options: InteractionProviderFolderProperties): Promise<string[]> {
        return new Promise(resolve => {

            const fileOpts = options as unknown as OpenDialogOptions;
            fileOpts.properties = ['openDirectory'];


            ipcRenderer.once('receive-open-dialog', (_, args) => {
                resolve(args.filePaths);
            });
            ipcRenderer.send('show-open-dialog', fileOpts);
        });
    }


    async selectFile(options: InteractionProviderFileProperties): Promise<string[]> {
        return new Promise(resolve => {

            const fileOpts = options as unknown as OpenDialogOptions;
            fileOpts.properties = ['openFile'];

            ipcRenderer.once('receive-open-dialog', (_, args) => {
                resolve(args.filePaths);
            });
            ipcRenderer.send('show-open-dialog', fileOpts);
        });
    }


    hookModInstallProtocol(callback: (data: any) => void) {
        ipcRenderer.removeAllListeners('install-from-thunderstore-string');
        ipcRenderer.on('install-from-thunderstore-string', (_sender: any, data: string) => {
            callback(data);
        });
    }


    copyToClipboard(value: string) {
        clipboard.writeText(value, 'clipboard');
    }
}
