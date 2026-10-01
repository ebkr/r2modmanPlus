import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: '正在启动 {appName}',
    gameUpdatesWarning: '游戏更新可能会导致模组失效。如果发布了新更新，请耐心等待。',
    menu: {
        helpLabel: '帮助',
        helpItems: {
            about: '关于',
            faq: '常见问题'
        },
    },
    actions: {
        goBack: '返回',
    },
    content: {
        main: {
            didYouKnow: '你知道吗？',
            externalInstallWithModManager: `
                            你可以使用 Thunderstore 上的 “Install with Mod Manager” 按钮，
                            通过 {appName} 来安装模组。
                        `,
            goToThunderstore: '前往 Thunderstore',
            exportProfile: `
                        你可以在设置页面把选中的配置档导出为文件或代码。
                        这样就能轻松地把模组列表分享给朋友！
                        `,
            havingTrouble: {
                title: '遇到问题？',
                body: '在 {appName} Discord 服务器的支持频道中发送错误截图。',
                serverLinkText: '加入 {appName} Discord 服务器',
            },
        },
        about: {
            title: '关于 {appName}',
            creator: '由 Ebkr 开发。',
            techStack: {
                builtUsing: '本应用使用 Quasar 构建，技术栈如下：',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: '常见问题',
            howToGetStarted: {
                title: '我该如何开始？',
                body: '前往「在线」标签页，下载你喜欢的模组。点击「启动模组模式」即可尽情享受。'
            },
            startingWithMods: {
                title: '以模组模式启动游戏',
                body: `
                            你必须从管理器内部启动游戏。
                            直接通过 Steam 启动在没有手动改动的情况下不会生效。
                            `
            }
        }
    },
    states: {
        preparing: '正在准备',
        checkingForUpdates: '正在检查更新',
        checkingForLocalCache: '正在检查本地缓存中的模组列表',
        checkingForThunderstoreUpdates: '正在从 Thunderstore 检查模组列表更新',
        loadingLatestThunderstoreList: '正在从 Thunderstore 加载最新的模组列表',
        pruningLocalCache: '正在从本地缓存中清理已下架的模组',
        processingModList: '正在处理模组列表',
    }
}

