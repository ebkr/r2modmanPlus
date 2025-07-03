import LinkProvider from '../../providers/components/LinkProvider';
// TODO QUASAR UPGRADE
// import { shell } from "electron";

export default class LinkImpl extends LinkProvider {

    openLink(url: string): void {
        window.electron.openExternal(url);
    }

    selectFile(url: string): void {
        window.electron.selectFile(url);
    }

}
