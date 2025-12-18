import InteractionProvider, {
    InteractionProviderFileProperties,
    InteractionProviderFolderProperties
} from '../../../../src/providers/ror2/system/InteractionProvider';

export default class StubInteractionProvider extends InteractionProvider {

    copyToClipboard(value: string): void {
        throw new Error("Stub access must be mocked or spied");
    }

    hookModInstallProtocol(callback: (data: any) => void): void {
        throw new Error("Stub access must be mocked or spied");
    }

    restartApp(): void {
        throw new Error("Stub access must be mocked or spied");
    }

    async selectFile(options: InteractionProviderFileProperties): Promise<string[]> {
        throw new Error("Stub access must be mocked or spied");
    }

    async selectFolder(options: InteractionProviderFolderProperties): Promise<string[]> {
        throw new Error("Stub access must be mocked or spied");
    }

    async getEnvironmentVariables(): Promise<string[]> {
        throw new Error("Stub access must be mocked or spied");
    }

}
