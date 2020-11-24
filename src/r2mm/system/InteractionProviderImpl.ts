import InteractionProvider, {
    InteractionProviderFileProperties,
    InteractionProviderFolderProperties
} from '../../providers/ror2/system/InteractionProvider';
import { clipboard, ipcRenderer } from 'electron';

export default class InteractionProviderImpl extends InteractionProvider {

    restartApp(): void {
        ipcRenderer.send('restart');
    }

    async selectFolder(options: InteractionProviderFolderProperties): Promise<string[]> {
        return new Promise(resolve => {
            ipcRenderer.once('receive-selection', async (_sender: any, files: string[]) => {
                resolve(files || []);
            });
            ipcRenderer.send('open-dialog', {
                title: options.title,
                defaultPath: options.defaultPath,
                properties: ['openDirectory'],
                buttonLabel: options.buttonLabel
            });
        });
    }


    async selectFile(options: InteractionProviderFileProperties): Promise<string[]> {
        return new Promise(resolve => {
            ipcRenderer.once('receive-selection', async (_sender: any, files: string[]) => {
                resolve(files || []);
            });
            ipcRenderer.send('open-dialog', {
                title: options.title,
                properties: ['openFile'],
                filters: options.filters,
                buttonLabel: options.buttonLabel
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
