import Game from '../../../../../model/game/Game';
import Dexie from 'dexie';
import { gamesTableName, settingsDbName, settingsVersion } from 'src/r2mm/manager/settings/SettingsStore';
import EnumResolver from 'src/model/enums/_EnumResolver';
import { SortLocalDisabledMods } from 'src/model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from 'src/model/real_enums/sort/SortNaming';
import { SortDirection } from 'src/model/real_enums/sort/SortDirection';
import GameManager from 'src/model/game/GameManager';
import { schemaSetup_v3 } from 'src/r2mm/manager/settings/structures/v3/SchemaSetup_v3';

export interface InternalGameSettingsStructure_V3 {
    version: number;
    gameDirectory: string | null;
    lastSelectedProfile: string;
    linkedFiles: string[];
    launchParameters: string;
    installedSortBy: string;
    installedSortDirection: string;
    installedDisablePosition: string;
}

let gameTable: Dexie.Table<GameSettingsStructure_V3, number>;

export default class GameSettingsStructure_V3 {

    id?: number;
    version: number;
    structure: {[gameName: string]: InternalGameSettingsStructure_V3};

    constructor(version: number, structure: {[gameName: string]: InternalGameSettingsStructure_V3}, id?: number) {
        if (id) {
            this.id = id;
        }
        this.version = version;
        this.structure = structure;
    }

    public async init() {
        const db = new Dexie(settingsDbName);
        schemaSetup_v3(db);

        gameTable = db.table(gamesTableName);
        gameTable.mapToClass(GameSettingsStructure_V3);
    }

    public async save() {
        await gameTable.put(new GameSettingsStructure_V3(this.version, this.structure, this.id))
            .then(value => this.id = value);
    }

    public async getGame(game: Game): Promise<InternalGameSettingsStructure_V3> {
        if (this.structure[game.settingsIdentifier] === undefined) {
            this.structure[game.settingsIdentifier] = GameSettingsStructure_V3.createNewGame();
        }
        await this.save();
        return this.structure[game.settingsIdentifier];
    }

    private static createNewGame(): InternalGameSettingsStructure_V3 {
        return {
            version: settingsVersion,
            gameDirectory: null,
            lastSelectedProfile: "Default",
            linkedFiles: [],
            launchParameters: "",
            installedSortBy: EnumResolver.from(SortNaming, SortNaming.CUSTOM)!,
            installedSortDirection: EnumResolver.from(SortDirection, SortDirection.STANDARD)!,
            installedDisablePosition: EnumResolver.from(SortLocalDisabledMods, SortLocalDisabledMods.CUSTOM)!,
        }
    }

    public static createNewInstance(version: number): GameSettingsStructure_V3 {
        const gameStore: {[gameName: string]: InternalGameSettingsStructure_V3} = {};
        GameManager.gameList.forEach(game => {
            gameStore[game.settingsIdentifier] = this.createNewGame();
        });
        return new GameSettingsStructure_V3(version, gameStore);
    }
}
