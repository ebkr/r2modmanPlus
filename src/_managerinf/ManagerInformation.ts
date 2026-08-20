import VersionNumber from '../model/VersionNumber';

export default class ManagerInformation {
    public static VERSION: VersionNumber = new VersionNumber('3.2.19');
    public static IS_PORTABLE: boolean = false;
    public static APP_NAME: string = "r2modman";
    public static WIKI_GAME_DIRECTORY_HELP_URL = "https://github.com/ebkr/r2modmanPlus/wiki/Why-aren't-my-mods-working%3F#games-via-steam";
}
