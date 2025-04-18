import LinkProvider from '../../providers/components/LinkProvider';
import { shell } from "electron";

export default class LinkImpl extends LinkProvider {

    openLink(url: string): void {
        shell.openExternal(url);
    }

    openWebOnlyLink(url: string): void {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            shell.openExternal(url);
        }
    }

    selectFile(url: string): void {
        shell.showItemInFolder(url);
    }

}
