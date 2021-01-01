import LinkProvider from '../../providers/components/LinkProvider';
import { shell } from "electron";

export default class LinkImpl extends LinkProvider {

    openLink(url: string): void {
        shell.openExternal(url);
    }

    selectFile(url: string): void {
        shell.showItemInFolder(url);
    }

}
