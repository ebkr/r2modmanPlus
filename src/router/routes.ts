import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
    {
        path: '/about',
        component: () => import('pages/About.vue')
    },
    {
        path: '/',
        component: () => import('pages/Splash.vue')
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
