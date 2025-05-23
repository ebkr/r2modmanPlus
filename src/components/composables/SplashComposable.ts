import { getStore } from '../../providers/generic/store/StoreProvider';
import RequestItem from '../../model/requests/RequestItem';

export function useSplashComposable() {
    const store = getStore<any>();

    function getRequestItem(name: string) {
        const item = store.state.splash.requests.find((ri: RequestItem) => ri.getName() === name);

        if (item === undefined) {
            throw new Error(`Unknown RequestItem "${name}"`);
        }

        return item;
    }

    function reduceRequests() {
        return store.state.splash.requests.reduce((x: RequestItem, y: RequestItem) => x.merge(y));
    }

    return {
        getRequestItem,
        reduceRequests,
    }
}
