import { ContextMenuProcessProvider } from './context_menu';

let execIdentifier = 0;

export const ContextMenuProcessImplementation: ContextMenuProcessProvider = {
    showContextMenu: (options) => window.electron.showContextMenu(options),
}
