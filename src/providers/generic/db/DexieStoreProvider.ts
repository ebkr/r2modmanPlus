import ProviderUtils from '../ProviderUtils';
import { PackageDexieStore } from '../../../r2mm/manager/PackageDexieStore';

export default abstract class DexieStoreProvider {
    private static provider: () => PackageDexieStore;

    static provide(provided: () => PackageDexieStore): void {
        this.provider = provided;
    }

    public static get instance(): PackageDexieStore {
        if (DexieStoreProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("DexieStoreProvider");
        }
        return DexieStoreProvider.provider();
    }
}

