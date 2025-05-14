import ProviderUtils from '../ProviderUtils';
import { Store } from 'vuex';
import { State } from '../../../store';

let provider: () => Store<any>;

export function provideStoreImplementation(provided: () => Store<State>) {
    provider = provided;
}

export function getStore<T>(): Store<T> {
    if (!provider) {
        ProviderUtils.throwNotProvidedError("StoreProvider");
    }
    return provider();
}
