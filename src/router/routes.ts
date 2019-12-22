import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
    {
        path: '/',
        component: () => import('pages/Splash.vue')
    },
    {
        path: '/manager',
        component: () => import('pages/Manager.vue')
    },
    {
        path: '/profiles',
        component: () => import('pages/Profiles.vue')
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
