import { AppWindowImplementation } from './AppWindowImplementation';

export type AppWindowProvider = {
    getPlatform: () => string;
}

let implementation: () => AppWindowProvider;

function getImplementation(): AppWindowProvider {
    if (!implementation) {
        return AppWindowImplementation;
    }
    return implementation();
}

export function provideAppWindowImplementation(provider: () => AppWindowProvider) {
    implementation = provider;
}

const appWindow: AppWindowProvider = {
    getPlatform: () => getImplementation().getPlatform(),
};

export default appWindow;
