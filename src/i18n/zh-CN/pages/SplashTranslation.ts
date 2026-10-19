import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: '正在启动 {appName}',
    gameUpdatesWarning: '游戏更新可能导致模组失效。若新版本已发布，请耐心等待。',
    menu: {
        helpLabel: '帮助',
        helpItems: {
            about: '关于',
            faq: 'FAQ'
        },
    },
    actions: {
        goBack: '返回',
    },
    content: {
        main: {
            didYouKnow: '您知道吗？',
            externalInstallWithModManager: `
                            您可以在Thunderstore上使用"Install with Mod Manager"按钮，
                            通过 {appName} 安装模组。
                        `,
            goToThunderstore: '前往 Thunderstore',
            exportProfile: `
                        您可以在设置界面将选定的档案导出为文件或代码。
                        这让您能轻松与朋友分享您的模组列表！
                        `,
            havingTrouble: {
                title: '遇到麻烦了吗？',
                body: '请将错误截图发送至 {appName} Discord 服务器的支持频道。',
                serverLinkText: '加入 {appName} Discord 服务器',
            },
        },
        about: {
            title: '关于 {appName}',
            creator: '它由 Ebkr 创建。',
            techStack: {
                builtUsing: '该应用程序采用Quasar构建，其技术栈如下：',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: 'FAQ',
            howToGetStarted: {
                title: '我该如何开始？',
                body: '前往“在线”标签页下载心仪的模组。点击“启动模组”即可畅玩。'
            },
            startingWithMods: {
                title: '启动启用模组的游戏',
                body: `
                            您必须在管理器内启动游戏。
                            若不进行手动修改，通过 Steam 启动将不能启用模组。
                            `
            }
        }
    },
    states: {
        preparing: '准备中',
        checkingForUpdates: '检查更新',
        checkingForLocalCache: '正在检查本地模组列表缓存',
        checkingForThunderstoreUpdates: '正在检查 Thunderstore 的模组列表更新',
        loadingLatestThunderstoreList: '正在从 Thunderstore 加载最新模组列表',
        pruningLocalCache: '正在从本地缓存中清理已移除的模组',
        processingModList: '正在处理模组列表',
    }
}
