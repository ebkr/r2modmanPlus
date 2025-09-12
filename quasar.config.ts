// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app/wrappers';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig((ctx) => {
    return {
        // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
        // preFetch: true,

        // app boot file (/src/boot)
        // --> boot files are part of "main.js"
        // https://v2.quasar.dev/quasar-cli-vite/boot-files
        boot: [
            'i18n',
            'axios',
            'floating-vue'
        ],

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
        css: [
            'app.scss'
        ],

        // https://github.com/quasarframework/quasar/tree/dev/extras
        extras: [
            // 'ionicons-v4',
            // 'mdi-v7',
            // 'fontawesome-v6',
            // 'eva-icons',
            // 'themify',
            // 'line-awesome',
            // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

            'roboto-font', // optional, you are not bound to it
            'material-icons', // optional, you are not bound to it
        ],

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
        build: {
            target: {
                browser: [ 'esnext' ],
                node: 'esnext'
            },

            typescript: {
                strict: true,
                vueShim: true
                // extendTsConfig (tsConfig) {}
            },

            vueRouterMode: 'hash', // available values: 'hash', 'history'
            // vueRouterBase,
            // vueDevtools,
            // vueOptionsAPI: false,

            rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

            publicPath: '/',
            // analyze: true,
            // env: {},
            // rawDefine: {}
            // ignorePublicFolder: true,
            minify: 'esbuild',
            polyfillModulePreload: true,
            // distDir

            // extendViteConf (viteConf) {},
            // viteVuePluginOptions: {},

            win: {
                publish: {
                    provider: 'github'
                }
            },
            linux: {
                publish: {
                    provider: 'github'
                }
            },

            vitePlugins: [
            ]
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
        devServer: {
            https: false,
            port: 9020,
            open: true // opens browser window automatically
        },

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
        framework: {
            config: {},

            iconSet: 'material-icons', // Quasar icon set
            lang: 'en-US', // Quasar language pack

            // For special cases outside of where the auto-import strategy can have an impact
            // (like functional components as one of the examples),
            // you can manually specify Quasar components/directives to be available everywhere:
            //
            // components: [],
            // directives: [],

            // Quasar plugins
            plugins: []
        },

        // animations: 'all', // --- includes all animations
        // https://v2.quasar.dev/options/animations
        animations: [],

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#sourcefiles
        sourceFiles: {
            rootComponent: 'src/AppWrapper.vue',
            // router: 'src/router/index',
            // store: 'src/store/index',
            //   pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
            //   pwaServiceWorker: 'src-pwa/custom-service-worker',
            //   pwaManifestFile: 'src-pwa/manifest.json',
            electronMain: 'src-electron/electron-main',
            electronPreload: 'src-electron/electron-preload'
            //   bexManifestFile: 'src-bex/manifest.json
        },

        // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
        ssr: {
            prodPort: 3000, // The default port that the production server should use
                            // (gets superseded if process.env.PORT is specified at runtime)

            middlewares: [
                'render' // keep this as last one
            ],

            // extendPackageJson (json) {},
            // extendSSRWebserverConf (esbuildConf) {},

            // manualStoreSerialization: true,
            // manualStoreSsrContextInjection: true,
            // manualStoreHydration: true,
            // manualPostHydrationTrigger: true,

            pwa: false
            // pwaOfflineHtmlFilename: 'offline.html', // do NOT use index.html as name!

            // pwaExtendGenerateSWOptions (cfg) {},
            // pwaExtendInjectManifestOptions (cfg) {}
        },

        // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
        pwa: {
            workboxMode: 'GenerateSW' // 'GenerateSW' or 'InjectManifest'
            // swFilename: 'sw.js',
            // manifestFilename: 'manifest.json',
            // extendManifestJson (json) {},
            // useCredentialsForManifestTag: true,
            // injectPwaMetaTags: false,
            // extendPWACustomSWConf (esbuildConf) {},
            // extendGenerateSWOptions (cfg) {},
            // extendInjectManifestOptions (cfg) {}
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
        cordova: {
            // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
        capacitor: {
            hideSplashscreen: true
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
        electron: {

            // extendElectronMainConf (esbuildConf) {},
            // extendElectronPreloadConf (esbuildConf) {},

            // extendPackageJson (json) {},

            // Electron preload scripts (if any) from /src-electron, WITHOUT file extension
            preloadScripts: [ 'electron-preload' ],

            // specify the debugging port to use for the Electron app when running in development mode
            inspectPort: 5858,

            bundler: 'builder', // 'packager' or 'builder'

            packager: {
                // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

                // OS X / Mac App Store
                // appBundleId: '',
                // appCategoryType: '',
                // osxSign: '',
                // protocol: 'myapp://path',

                // Windows only
                // win32metadata: { ... }
            },

            builder: {
                // https://www.electron.build/configuration/configuration

                appId: 'ebkr-r2modman',
                win: {
                    target: ['nsis', 'portable'],
                    icon: 'src/assets/icon.ico'
                },
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true,
                    allowElevation: false,
                    perMachine: false,
                    include: 'build/installer.nsh'
                },
                linux: {
                    target: ['AppImage', 'tar.gz', 'deb', 'rpm', 'pacman'],
                    icon: 'src/assets/icon',
                    maintainer: 'ebkr',
                    vendor: 'ebkr',
                    synopsis: 'Risk of Rain 2 Mod Manager',
                    category: 'Game',
                    mimeTypes: [
                        "x-scheme-handler/ror2mm"
                    ]
                },
                mac: {
                    category: "games",
                    icon: "src/assets/icon"
                }
            },

            nodeIntegration: true,
        },

        // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
        bex: {
            // extendBexScriptsConf (esbuildConf) {},
            // extendBexManifestJson (json) {},

            /**
             * The list of extra scripts (js/ts) not in your bex manifest that you want to
             * compile and use in your browser extension. Maybe dynamic use them?
             *
             * Each entry in the list should be a relative filename to /src-bex/
             *
             * @example [ 'my-script.ts', 'sub-folder/my-other-script.js' ]
             */
            extraScripts: []
        }
    }
});
