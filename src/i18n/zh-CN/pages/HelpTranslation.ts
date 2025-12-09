import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: '帮助',
        subtitle: '常见问题及解决方案'
    },
    tabs: {
        general: '常规',
        gameWontStart: '游戏无法启动',
        modsNotShowing: '模组未启用',
        updating: '更新',
    },
    general: {
        gettingStarted: {
            title: '开始安装模组',
            whereToFindMods: `
            前往 "{''}@:translations.pages.manager.navigation.modsActions.online{''}" 页面, 找到您想要的模组下载。
            管理器会同时下载依赖项，节省您的时间。
            `,
            onceInstalled: '安装完所需的模组后，只需点击左上角的 {startModdedAction} 即可启动',
        },
        slowGame: {
            title: '使用模组时游戏运行缓慢/卡顿？',
            likelyCause: `
            这可能是某个模组出现问题导致。
            请尝试禁用一些的模组后，检查问题是否仍旧存在。
            `,
            issuePersisting: `
            如果问题依旧存在。
            则继续尝试禁用剩余模组。
            `,
            ifStutters: '针对卡顿问题，或许有优化模组能改善这种情况。',
        },
        dedicatedServers: {
            title: '专用服务器',
            content: `
            专用服务器虽无法通过管理器直接支持，但可通过将配置文件夹内容复制到专用服务器文件夹中实现替代方案。
            `,
        },
        launchingExternally: {
            title: '从模组管理器外部启动游戏',
            howTo: '通过 Steam 启动游戏时，您的游戏将会是没有模组的原版状态。',
            whereToPlace: '您需要将相应的启动参数配置在您平台的相关启动参数设置中。',
            forSteam: '对于Steam平台，该选项位于游戏属性中。',
            yourCurrentArgument: '您当前的启动参数是:',
            loaderNotInstalled: '这些参数将在安装模组加载器后可用。',
            copyArguments: '复制启动参数',
        },
    },
    gameWontStart: {
        errorModal: {
            title: '当我尝试启动游戏时，出现红色方框。',
            solution: '红色框的底部通常会提供一个建议，这可能有助于解决问题。',
        },
        redirectedToStorePage: {
            title: '我跳转到了游戏Steam商店页面',
            solution: '游玩 {appName} 时，你必须有正版的完整游戏。你可以通过商店购买。',
        },
        consoleCloses: {
            title: '一个文本窗口出现并立即关闭',
            tryRunning: '尝试在设置界面 "重置 {gameName} 安装"。', // TODO - Reference translation via Settings screen
            ifPersists: '若问题仍然存在，请强制退出Steam，并在关闭 Steam 的情况下启动模组。',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: '潜在解决方案',
            instructToWiki: '最常见的问题可通过严格遵循维基百科上列出的说明来解决。',
            goToWiki: '前往维基百科',
        }
    },
    updating: {
        autoUpdates: {
            title: '自动更新',
            whenDoesItUpdate: '若有可用更新，管理器将在关闭时自动更新。',
            downloadedInBackground: '更新将在后台进行下载。',
            promptToRunOldInstaller: '您可能会被要求以管理员身份运行 "{oldInstaller}"。这是更新程序。',
            ifProblemOccurs: '如果更新过程中出现问题，请下载并运行最新的安装程序。',
        },
        ignoreUpdates: {
            title: '我不想要更新',
            content: 'GitHub 上有一个便携版，它不会自动更新。不过当有更新可用时，系统会提示你。'
        }
    }
}
