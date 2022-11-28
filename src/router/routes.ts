import { RouteConfig } from 'vue-router';
import Profile from '../model/Profile';
import ManagerInformation from '../_managerinf/ManagerInformation';

const appTitle = `${ManagerInformation.APP_NAME} (${ManagerInformation.VERSION.toString()})`

const routes: RouteConfig[] = [
    {
        name: 'index',
        path: '/',
        component: () => import("pages/GameSelectionScreen.vue"),
        meta: {
            title: () => appTitle
        }
    },
    {
        name: 'splash',
        path: '/splash',
        component: () => import('pages/Splash.vue'),
        meta: {
            title: () => appTitle
        }
    },
    {
        name: 'linux',
        path: '/linux-native-game-setup',
        component: () => import('pages/LinuxNativeGameSetup.vue'),
        meta: {
            title: () => ManagerInformation.APP_NAME
        }
    },
    {
        name: 'profiles',
        path: '/profiles',
        component: () => import('pages/Profiles.vue'),
        meta: {
            title: () => appTitle
        }
    },
    {
        name: 'manager',
        path: '/manager/',
        component: () => import('pages/Manager.vue'),
        meta: {
            title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
        },
        children: [
            {
                name: 'manager.installed',
                path: 'installed/',
                alias: '',
                component: () => import('components/views/InstalledModView.vue'),
                meta: {
                    title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
                }
            },
            {
                name: 'manager.online',
                path: 'online/',
                component: () => import('components/views/OnlineModView.vue'),
                meta: {
                    title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
                }
            },
            {
                name: 'manager.settings',
                path: 'settings/',
                component: () => import('components/settings-components/SettingsView.vue'),
                meta: {
                    title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
                }
            }
        ]
    },
    {
        name: 'config-editor',
        path: '/config-editor',
        component: () => import('pages/ConfigEditor.vue'),
        meta: {
            title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
        }
    },
    {
        name: 'help',
        path: '/help',
        component: () => import('pages/Help.vue'),
        meta: {
            title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
        }
    },
    {
        name: 'downloads',
        path: '/downloads',
        component: () => import('pages/DownloadMonitor.vue'),
        meta: {
            title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
        }
    }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue')
    });
}

export default routes;
