import InteractionProvider, {
    InteractionProviderFileProperties,
    InteractionProviderFolderProperties
} from 'src/providers/ror2/system/InteractionProvider';

export default class StubInteractionProvider extends InteractionProvider {

    copyToClipboard(value: string): void {
    }

    hookModInstallProtocol(callback: (data: any) => void): void {
    }

    restartApp(): void {
    }

    async selectFile(options: InteractionProviderFileProperties): Promise<string[]> {
        return Promise.resolve([]);
    }

    async selectFolder(options: InteractionProviderFolderProperties): Promise<string[]> {
        return Promise.resolve([]);
    }



}
