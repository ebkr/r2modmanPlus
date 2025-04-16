import Game from '../../model/game/Game';
import StorePlatformMetadata from '../../model/game/StorePlatformMetadata';
import { getStorePlatformFromName, StorePlatform } from '../../model/game/StorePlatform';
import { displayModeFromString } from '../../model/game/GameSelectionDisplayMode';
import { gameInstanceTypeFromString } from '../../model/game/GameInstanceType';
import { installerVariantFromString } from '../../model/installing/PackageLoader';
import PathResolver from '../../r2mm/manager/PathResolver';
import FileUtils from '../../utils/FileUtils';
import * as path from 'path';
import { EcosystemSchema } from '../schema/ThunderstoreSchema';

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
        return EcosystemSchema.supportedGames.map((game) => {
            const r2mm = game.r2modman;

            const distributions = game.distributions.map((x) => new StorePlatformMetadata(
                    getStorePlatformFromName(x.platform),
                    x.identifier || undefined,
                )
            );

            return new Game(
                game.meta.displayName,
                r2mm.internalFolderName,
                r2mm.settingsIdentifier,
                r2mm.steamFolderName,
                r2mm.exeNames,
                r2mm.dataFolderName,
                r2mm.packageIndex,
                distributions,
                game.meta.iconUrl || "ThunderstoreBeta.jpg",
                displayModeFromString(r2mm.gameSelectionDisplayMode),
                gameInstanceTypeFromString(r2mm.gameInstanceType),
                installerVariantFromString(r2mm.packageLoader),
                r2mm.additionalSearchStrings,
            );
        });
    }

    public static async activate(game: Game, platform: StorePlatform) {
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
