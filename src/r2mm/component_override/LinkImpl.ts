import LinkProvider from '../../providers/components/LinkProvider';
import { shell } from "electron";

export default class LinkImpl extends LinkProvider {

    openLink(url: string): void {
        shell.openItem(url);
    }

    selectFile(url: string): void {
        shell.openItem(url);
    }

}
