import Game from '../../model/game/Game';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';
import ThunderstoreGameSchema from 'src/model/ThunderstoreGameSchema';
import ObjectResponse from 'src/model/api/ObjectResponse';

export default class ThunderstorePackages {

    public static GAME_SCHEMA: ThunderstoreGameSchema | null = null;

    /**
     * Fetch latest schema and apply to {GAME_SCHEMA}
     */
    public static async update(game: Game) {
        var schema = (await ConnectionProvider.instance.getSchema()).data;
        if (Object.prototype.hasOwnProperty.call(schema.games, game.thunderstoreLabel)) {
            this.GAME_SCHEMA = ThunderstoreGameSchema.parseFromThunderstoreData(schema.games[game.thunderstoreLabel])
        }
        return this.GAME_SCHEMA;
    }

    public static handleSchemaApiResponse(game: Game, response: ObjectResponse) {
        var schema = response.data;
        if (Object.prototype.hasOwnProperty.call(schema.games, game.thunderstoreLabel)) {
            this.GAME_SCHEMA = ThunderstoreGameSchema.parseFromThunderstoreData(schema.games[game.thunderstoreLabel]);
        } else {
            this.GAME_SCHEMA = null;
        }
        return this.GAME_SCHEMA;
    }


}
