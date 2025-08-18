import {
    createMemoryHistory,
    createRouter,
    RouteLocationNormalized,
    RouteMeta
} from 'vue-router';
import routes from './routes';

const createHistory = createMemoryHistory;
const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    linkActiveClass: 'is-active',

    // Leave this as is and make changes in the quasar.config file instead!
    // quasar.config file -> build -> vueRouterMode
    // quasar.config file -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
});

Router.afterEach((to: RouteLocationNormalized, ignored: RouteLocationNormalized) => {
    const meta: RouteMeta = to.meta;
    const title = meta.title as Function;
    document.title = title();
});

export default Router;
