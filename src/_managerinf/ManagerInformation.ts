import VersionNumber from '../model/VersionNumber';

export default class ManagerInformation {
    public static VERSION: VersionNumber = new VersionNumber('3.2.1');
    public static IS_PORTABLE: boolean = false;
    public static APP_NAME: string = "r2modman";
}
