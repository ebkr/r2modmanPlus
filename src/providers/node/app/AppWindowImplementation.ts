import { AppWindowProvider } from './app_window';

let execIdentifier = 0;

export const AppWindowImplementation: AppWindowProvider = {
    getPlatform: () => window.app.getPlatform(),
}
