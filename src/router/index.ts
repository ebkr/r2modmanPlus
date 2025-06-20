import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteMeta } from 'vue-router';
import routes from './routes';

export default function (/* { store, ssrContext } */) {
    const createHistory = createWebHashHistory;
    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,
        linkActiveClass: 'is-active',

        // Leave this as is and make changes in the quasar.config file instead!
        // quasar.config file -> build -> vueRouterMode
        // quasar.config file -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE),
    });

    Router.afterEach((to: RouteLocationNormalized, ignored: RouteLocationNormalized) => {
        const meta: RouteMeta = to.meta;
        document.title = meta.title as string;
    });
}
