import { RouteConfig } from 'vue-router';
import Profile from '../model/Profile';
import ManagerInformation from '../_managerinf/ManagerInformation';

const appTitle = `${ManagerInformation.APP_NAME} (${ManagerInformation.VERSION.toString()})`

const routes: RouteConfig[] = [
    {
        path: '/',
        component: () => import("pages/GameSelectionScreen.vue"),
        meta: {
            title: () => appTitle
        }
    },
    {
        path: '/splash',
        component: () => import('pages/Splash.vue'),
        meta: {
            title: () => appTitle
        }
    },
    {
        path: '/linux-native-game-setup',
        component: () => import('pages/LinuxNativeGameSetup.vue'),
        meta: {
            title: () => ManagerInformation.APP_NAME
        }
    },
    {
        path: '/profiles',
        component: () => import('pages/Profiles.vue'),
        meta: {
            title: () => appTitle
        }
    },
    {
        path: '/manager',
        component: () => import('pages/Manager.vue'),
        meta: {
            title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
        }
    },
    {
        path: '/config-editor',
        component: () => import('pages/ConfigEditor.vue'),
        meta: {
            title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
        }
    },
    {
        path: '/help',
        component: () => import('pages/Help.vue'),
        meta: {
            title: () => `${appTitle} - ${Profile.getActiveProfile().getProfileName()}`
        }
    },
    {
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
