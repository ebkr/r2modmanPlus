import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';

import routes from './routes';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function(/* { store, ssrContext } */) {
    const Router = new VueRouter({
        linkActiveClass: 'is-active',
        scrollBehavior: () => ({ x: 0, y: 0 }),
        routes,

        // Leave these as is and change from quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: "hash",
        base: "/"
    });

    Router.afterEach((to: Route, ignored: Route) => {
        document.title = to.meta!.title();
    });
    return Router;
}
