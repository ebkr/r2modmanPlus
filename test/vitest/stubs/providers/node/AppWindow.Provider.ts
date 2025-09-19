import { AppWindowProvider } from '../../../../../src/providers/node/app/app_window';

export const TestAppWindowProvider = {
    getPlatform: () => process.platform,
} as AppWindowProvider;
