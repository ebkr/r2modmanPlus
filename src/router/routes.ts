import { RouteConfig } from 'vue-router'
import Profile from '../model/Profile';

const routes: RouteConfig[] = [
    {
        path: '/',
        component: () => import('pages/Splash.vue'),
        meta: {
            title: () => 'r2modman'
        }
    },
    {
        path: '/linux-first-time-setup',
        component: () => import('pages/LinuxFirstTimeSetup.vue'),
        meta: {
            title: () => 'r2modman'
        }
    },
    {
        path: '/profiles',
        component: () => import('pages/Profiles.vue'),
        meta: {
            title: () => 'r2modman'
        }
    },
    {
        path: '/manager',
        component: () => import('pages/Manager.vue'),
        meta: {
            title: () => 'r2modman - ' + Profile.getActiveProfile().getProfileName()
        }
    },
    {
        path: '/config-editor',
        component: () => import('src/pages/ConfigEditor.vue'),
        meta: {
            title: () => 'r2modman - ' + Profile.getActiveProfile().getProfileName()
        }
    },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue'),
    });
}

export default routes;
