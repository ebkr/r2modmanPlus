import LinkProvider from '../../../../src/providers/components/LinkProvider';

export default class StubLinkProvider extends LinkProvider {

    openLink(url: string): void {
        throw new Error("Stub access must be mocked or spied");
    }

    selectFile(url: string): void {
        throw new Error("Stub access must be mocked or spied");
    }

}
