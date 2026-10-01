import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: '帮助',
        subtitle: '常见问题及其可能的解决办法'
    },
    tabs: {
        general: '通用',
        gameWontStart: '游戏无法启动',
        modsNotShowing: '模组未显示',
        updating: '更新',
    },
    general: {
        gettingStarted: {
            title: '从安装模组开始',
            whereToFindMods: `
            前往 "{''}@:translations.pages.manager.navigation.modsActions.online{''}" 标签页，找到想要的模组，然后点击下载。
            它还会一并下载依赖，替你省下时间。
            `,
            onceInstalled: '安装好你想使用的模组后，只需点击左上角的 {startModdedAction}。',
        },
        slowGame: {
            title: '装了模组后游戏变慢或卡顿？',
            likelyCause: `
            这很可能是某个模组在不断报错导致的。
            一个办法是停用一半模组，然后观察问题是否依然存在。
            `,
            issuePersisting: `
            如果问题依旧，就再停用另一半。
            如此反复，直到问题解决为止。
            `,
            ifStutters: '如果只是卡顿，也许有一些优化类模组能帮上忙。',
        },
        dedicatedServers: {
            title: '专用服务器',
            content: `
            管理器并不直接支持专用服务器，不过有一个变通办法：
            把你配置档文件夹的内容复制到专用服务器文件夹中。
            `,
        },
        launchingExternally: {
            title: '从模组管理器之外启动游戏',
            howTo: '这是有意为之：通过 Steam 启动游戏时会以原版（未装模组）状态运行。',
            whereToPlace: '你需要把对应的参数填入你所在平台相关的启动参数设置处。',
            forSteam: '对于 Steam，它位于游戏的属性中。',
            yourCurrentArgument: '你当前的参数是：',
            loaderNotInstalled: '安装模组加载器之后，这些参数才会可用。',
            copyArguments: '复制启动参数',
        },
    },
    gameWontStart: {
        errorModal: {
            title: '尝试启动游戏时弹出一个红色框',
            solution: '红框底部通常会给出建议，它可能就能解决问题。',
        },
        redirectedToStorePage: {
            title: '我被跳转到了 Steam 商店页面',
            solution: '使用 {appName} 时你必须拥有游戏的合法副本。你可以在商店页面购买。',
        },
        consoleCloses: {
            title: '弹出的文本窗口立刻关闭了',
            tryRunning: '试着在设置页面执行「重置 {gameName} 安装」。', // TODO - Reference translation via Settings screen
            ifPersists: '如果问题依旧，请强制退出 Steam，并在 Steam 关闭的状态下以模组模式启动。',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: '可能的解决办法',
            instructToWiki: '最常见的问题都可以通过严格按 wiki 上的说明操作来解决。',
            goToWiki: '前往 wiki',
        }
    },
    updating: {
        autoUpdates: {
            title: '自动更新',
            whenDoesItUpdate: '如果有可用更新，管理器会在关闭时自动更新。',
            downloadedInBackground: '更新会在后台下载。',
            promptToRunOldInstaller: '你可能会看到以管理员身份运行 “{oldInstaller}” 的提示。那是更新程序。',
            ifProblemOccurs: '如果更新过程中出现问题，请下载并运行最新的安装程序。',
        },
        ignoreUpdates: {
            title: '我不想更新',
            content: 'GitHub 上有一个不会自动更新的便携版。不过它仍然会提示有可用更新。'
        }
    }
}

