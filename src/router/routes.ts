import { RouteRecordRaw } from 'vue-router';
import Profile from '../model/Profile';
import ManagerInformation from '../_managerinf/ManagerInformation';

const appTitle = () => `${ManagerInformation.APP_NAME} (${ManagerInformation.VERSION.toString()})`;
const profileTitle = () => `${appTitle()} - ${Profile.getActiveProfile().getProfileName()}`;

const routes: RouteRecordRaw[] = [
    {
        name: 'index',
        path: '/',
        component: () => import("pages/GameSelectionScreen.vue"),
        meta: {title: appTitle}
    },
    {
        name: 'splash',
        path: '/splash/',
        component: () => import('pages/Splash.vue'),
        meta: {title: appTitle}
    },
    {
        name: 'linux',
        path: '/linux-native-game-setup/',
        component: () => import('pages/LinuxNativeGameSetup.vue'),
        meta: {
            title: () => ManagerInformation.APP_NAME
        }
    },
    {
        name: 'profiles',
        path: '/profiles/',
        component: () => import('pages/Profiles.vue'),
        meta: {title: appTitle}
    },
    {
        path: '/',
        component: () => import('components/navigation/NavigationLayout.vue'),
        meta: {title: appTitle},
        children: [
            {
                name: 'manager',
                path: 'manager/',
                component: () => import('pages/Manager.vue'),
                meta: {title: () => profileTitle()},
                children: [
                    {
                        name: 'manager.installed',
                        path: 'installed/',
                        alias: '',
                        components: {
                            subview: () => import('components/views/InstalledModView.vue')
                        },
                        meta: {title: () => profileTitle()}
                    },
                    {
                        name: 'manager.online',
                        path: 'online/',
                        components: {
                            subview: () => import('components/views/OnlineModView.vue')
                        },
                        meta: {title: () => profileTitle()}
                    },
                    {
                        name: 'manager.settings',
                        path: 'settings/',
                        components: {
                            subview: () => import('components/settings-components/SettingsView.vue')
                        },
                        meta: {title: () => profileTitle()}
                    }
                ]
            },
            {
                name: 'config-editor',
                path: 'config-editor/',
                component: () => import('pages/ConfigEditor.vue'),
                meta: {title: () => profileTitle()}
            },
            {
                name: 'help',
                path: 'help/',
                component: () => import('pages/Help.vue'),
                meta: {title: () => profileTitle()}
            },
            {
                name: 'downloads',
                path: 'downloads/',
                component: () => import('pages/DownloadMonitor.vue'),
                meta: {title: () => profileTitle()}
            }
        ]
    }
];

export default routes;
