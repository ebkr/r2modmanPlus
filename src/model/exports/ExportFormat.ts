import ExportMod from './ExportMod';

export default class ExportFormat {
    private profileName: string = '';
    private profileGameDisplayName: string = '';
    private profileGame: string = '';
    private mods: ExportMod[] = [];

    public constructor(name: string, gameDisplayName: string,  game: string, modList: ExportMod[]) {
        this.profileName = name;
        this.profileGameDisplayName = gameDisplayName;
        this.profileGame = game;
        this.mods = modList;
    }

    public getProfileName(): string {
        return this.profileName;
    }

    public getProfileGame(): string {
        return this.profileGame;
    }

    public getProfileGameDisplayName(): string {
        return this.profileGameDisplayName;
    }

    public getMods(): ExportMod[] {
        return this.mods;
    }
}