import LinkProvider from '../../providers/components/LinkProvider';

export default class LinkImpl extends LinkProvider {

    openLink(url: string | null | undefined): void {
        if (url !== null && url !== undefined) {
            window.electron.openExternal(url);
        }
    }

    selectFile(url: string | null | undefined): void {
        if (url !== null && url !== undefined) {
            window.electron.selectFile(url);
        }
    }

    openPath(path: string): void {
        window.electron.openPath(path);
    }

}
