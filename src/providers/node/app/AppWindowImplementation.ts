import { AppWindowProvider } from './app_window';

export const AppWindowImplementation: AppWindowProvider = {
    getPlatform: () => window.app.getPlatform(),
}
