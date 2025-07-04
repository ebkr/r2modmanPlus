import InteractionProvider, {
    InteractionProviderFileProperties,
    InteractionProviderFolderProperties
} from '../../providers/ror2/system/InteractionProvider';

export default class InteractionProviderImpl extends InteractionProvider {

    restartApp(): void {
        window.app.restart();
    }

    async selectFolder(options: InteractionProviderFolderProperties): Promise<string[]> {
        return window.electron.selectFolderDialog(options);
    }

    async selectFile(options: InteractionProviderFileProperties): Promise<string[]> {
        return window.electron.selectFileDialog(options);
    }

    hookModInstallProtocol(callback: (data: any) => void) {
        window.app.hookModInstallProtocol(callback);
    }

    copyToClipboard(value: string) {
        window.electron.copyToClipboard(value);
    }
}
