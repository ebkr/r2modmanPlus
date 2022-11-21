import ApiResponse from '../../../model/api/ApiResponse';
import Game from '../../../model/game/Game';
import ProviderUtils from '../ProviderUtils';

export type DownloadProgressed = (percentDownloaded: number) => void;

export default abstract class ConnectionProvider {

    private static provider: () => ConnectionProvider;
    static provide(provided: () => ConnectionProvider): void {
        this.provider = provided;
    }

    public static get instance(): ConnectionProvider {
        if (ConnectionProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ConnectionProvider");
        }
        return ConnectionProvider.provider();
    }

    public abstract getExclusions(downloadProgressed?: DownloadProgressed, retries?: number): Promise<string[]>;
    public abstract getPackages(
        game: Game,
        downloadProgressed?: DownloadProgressed,
        retries?: number
    ): Promise<ApiResponse>;

}
