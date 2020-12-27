import InteractionProvider, {
    InteractionProviderFileProperties,
    InteractionProviderFolderProperties
} from '../../providers/ror2/system/InteractionProvider';
import { clipboard, ipcRenderer, OpenDialogOptions, remote } from 'electron';

export default class InteractionProviderImpl extends InteractionProvider {

    restartApp(): void {
        ipcRenderer.send('restart');
    }

    async selectFolder(options: InteractionProviderFolderProperties): Promise<string[]> {
        return new Promise(resolve => {

            const fileOpts = options as unknown as OpenDialogOptions;
            fileOpts.properties = ['openDirectory'];

            remote.dialog.showOpenDialog(remote.getCurrentWindow()!, fileOpts).then(value => {
                resolve(value.filePaths);
            });
        });
    }


    async selectFile(options: InteractionProviderFileProperties): Promise<string[]> {
        return new Promise(resolve => {

            const fileOpts = options as unknown as OpenDialogOptions;
            fileOpts.properties = ['openFile'];

            remote.dialog.showOpenDialog(remote.getCurrentWindow()!, fileOpts).then(value => {
                resolve(value.filePaths);
            });
        });
    }


    hookModInstallProtocol(callback: (data: any) => void) {
        ipcRenderer.on('install-from-thunderstore-string', (_sender: any, data: string) => {
            callback(data);
        });
    }


    copyToClipboard(value: string) {
        clipboard.writeText(value, 'clipboard');
    }
}
