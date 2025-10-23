import Game from '../../model/game/Game';
import StorePlatformMetadata from '../../model/game/StorePlatformMetadata';
import PathResolver from '../../r2mm/manager/PathResolver';
import FileUtils from '../../utils/FileUtils';
import { EcosystemSchema, Platform } from '../schema/ThunderstoreSchema';
import path from '../../providers/node/path/path';

export default class GameManager {

    private static _activeGame: Game;

    static get activeGame(): Game {
        return this._activeGame;
    }

    static set activeGame(game: Game) {
        this._activeGame = game;
    }

    // Used for loading game specific settings before game is selected.
    static get defaultGame(): Game {
        return this.gameList.find(value => value.internalFolderName === "RiskOfRain2")!;
    }

    static get gameList(): Game[] {
        return EcosystemSchema.supportedGames.map((game) => new Game(
            game.meta.displayName,
            game.internalFolderName,
            game.settingsIdentifier,
            game.steamFolderName,
            game.exeNames,
            game.dataFolderName,
            game.packageIndex,
            game.distributions.map(
                (x) => new StorePlatformMetadata(x.platform, x.identifier || undefined)
            ),
            game.meta.iconUrl || "thunderstore-beta.webp",
            game.gameSelectionDisplayMode,
            game.gameInstanceType,
            game.packageLoader,
            game.additionalSearchStrings,
        ));
    }

    public static async activate(game: Game, platform: Platform) {
        this._activeGame = game;
        this._activeGame.setActivePlatformByStore(platform);
        PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, game.internalFolderName);
        await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
    }

    public static findByFolderName(name?: string|null) {
        return name
            ? this.gameList.find((game) => game.internalFolderName === name)
            : undefined;
    }
}
