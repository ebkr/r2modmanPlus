import { getStore } from '../../providers/generic/store/StoreProvider';
import RequestItem from '../../model/requests/RequestItem';

export function useSplashComposable() {
    const store = getStore<any>();

    function reduceRequests() {
        return store.state.splash.requests.reduce((x: RequestItem, y: RequestItem) => x.merge(y));
    }

    return {
        reduceRequests,
    }
}
