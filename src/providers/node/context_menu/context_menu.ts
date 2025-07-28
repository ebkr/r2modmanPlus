import { ContextMenuProcessImplementation } from './ContextMenuImplementation';

export type ContextMenuOptions = {
    readonly: boolean
}

export type ContextMenuProcessProvider = {
    showContextMenu: (options: ContextMenuOptions) => Promise<void>;
}

let implementation: () => ContextMenuProcessProvider;

function getImplementation(): ContextMenuProcessProvider {
    if (!implementation) {
        return ContextMenuProcessImplementation;
    }
    return implementation();
}

export function provideContextMenuImplementation(provider: () => ContextMenuProcessProvider) {
    implementation = provider;
}

const contextMenu: ContextMenuProcessProvider = {
    showContextMenu: (options) => getImplementation().showContextMenu(options),
};

export default contextMenu;
