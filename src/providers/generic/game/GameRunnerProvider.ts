import ProviderUtils from '../ProviderUtils';
import R2Error from '../../../model/errors/R2Error';

export default abstract class GameRunnerProvider {

    private static provider: () => GameRunnerProvider;
    static provide(provided: () => GameRunnerProvider): void {
        this.provider = provided;
    }

    public static get instance(): GameRunnerProvider {
        if (GameRunnerProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("GameRunnerProvider");
        }
        return GameRunnerProvider.provider();
    }

    public abstract startModded(): Promise<void | R2Error>;
    public abstract startVanilla(): Promise<void | R2Error>;

}
