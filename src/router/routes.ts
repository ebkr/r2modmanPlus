import { RouteConfig } from 'vue-router';
import Profile from '../model/Profile';
import ManagerInformation from 'src/_managerinf/ManagerInformation';

const routes: RouteConfig[] = [
    {
        path: '/',
        component: () => import("pages/GameSelectionScreen.vue"),
        meta: {
            title: () => ManagerInformation.APP_NAME
        }
    },
    {
        path: '/splash',
        component: () => import('pages/Splash.vue'),
        meta: {
            title: () => ManagerInformation.APP_NAME
        }
    },
    {
        path: '/profiles',
        component: () => import('pages/Profiles.vue'),
        meta: {
            title: () => ManagerInformation.APP_NAME
        }
    },
    {
        path: '/manager',
        component: () => import('pages/Manager.vue'),
        meta: {
            title: () => `${ManagerInformation.APP_NAME} - ${Profile.getActiveProfile().getProfileName()}`
        }
    },
    {
        path: '/config-editor',
        component: () => import('src/pages/ConfigEditor.vue'),
        meta: {
            title: () => `${ManagerInformation.APP_NAME} - ${Profile.getActiveProfile().getProfileName()}`
        }
    },
    {
        path: '/help',
        component: () => import('src/pages/Help.vue'),
        meta: {
            title: () => `${ManagerInformation.APP_NAME} - ${Profile.getActiveProfile().getProfileName()}`
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
