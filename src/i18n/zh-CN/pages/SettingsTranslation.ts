import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    title: {
        subtitle: '{appName}: {version} 进阶设置'
    },
    actions: {
        search: {
            text: '搜索:',
            placeholder: '搜索设置选项',
        }
    },
    groups: {
        all: '所有',
        profile: '档案',
        locations: '位置',
        debugging: '调试',
        other: '其他',
        modpacks: '模组包',
    },
    locations: {
        browseDataFolder: {
            title: '浏览数据文件夹',
            description: '打开存储所有游戏和配置文件模组的文件夹。',
        },
        changeGameFolder: {
            title: '更改 {gameName} 文件夹',
            description: '更改 {appName} 使用的 {gameName} 的文件夹位置。',
            setManually: '您必须通过点击此处手动设置游戏文件夹'
        },
        browseProfileFolder: {
            title: '浏览档案文件夹',
            description: '打开当前档案中存储模组的文件夹。',
        },
        changeDataFolder: {
            title: '更改数据文件夹',
            description: '更改所有游戏和档案的模组存储文件夹。该文件夹不会被删除，现有档案也不会被转移。',
        },
        changeSteamFolder: {
            title: `更改 {''}@:translations.platforms.STEAM{''} 文件夹`,
            description: `更改 {appName} 使用的 @:translations.platforms.STEAM 文件夹位置.`,
            states: {
                setManually: '您必须点击此设置并手动设置该文件夹'
            }
        }
    },
    debugging: {
        copyLogFile: {
            title: '将日志文件内容复制到剪贴板',
            description: '将LogOutput.log文件内的文本复制到剪贴板，并保留Discord格式。',
            logFileExists: '日志文件存在',
            logFileDoesNotExist: '日志文件不存在',
        },
        copyTroubleshootingInfo: {
            title: '将故障排除信息复制到剪贴板',
            description: '将设置及其他信息复制到剪贴板，并保留Discord格式。',
            value: '在 Discord 上请求支持时请提供此信息。',
        },
        toggleDownloadCache: {
            title: '切换下载缓存',
            description: '下载模组时将忽略缓存中存储的模组。模组仍会存入缓存。',
            enabled: '当前：缓存已启用（推荐）',
            disabled: '当前：缓存已禁用',
        },
        setLaunchArguments: {
            title: '设置启动参数',
            description: '提供用于启动游戏的自定义参数。',
            value: '这些命令在游戏启动时针对 Steam 可执行文件执行'
        },
        cleanModCache: {
            title: '清理模组缓存',
            description: '清理未使用的缓存模组所占用的可用空间。',
            value: '检查所有档案中的未使用模组并清除缓存',
        },
        cleanOnlineModList: {
            title: '清理在线模组列表',
            description: '删除本地模组列表缓存，强制下次刷新时获取新的列表。',
            states: {
                updating: '在线模组列表正在更新中，请等待操作完成',
                hasCopy: '{gameName} 有本地缓存',
                doesNotHaveCopy: '{gameName} 没有本地缓存',
                errorOccurred: '检查模组列表状态时发生错误',
                unknown: '未知状态'
            }
        },
        toggleThunderstoreCdn: {
            title: '切换首选Thunderstore CDN',
            description: '切换CDN直至应用程序重启，此操作可能绕过下载模组时出现的问题。',
            current: '当前: {label} ({url})'
        },
        resetGameInstallation: {
            title: '重置 {gameName} 安装',
            description: '修复因文件损坏或手动修改尝试后残留的文件所导致的问题。',
            value: `这将删除 "{folderName}" 文件夹中所有内容，并使用 @:translations.platforms.STEAM 验证文件完整性`
        },
        changeLaunchBehaviour: {
            title: '更改启动行为',
            description: '选择特定启动行为，例如强制Steam通过Proton启动',
            value: `当前启动行为设置为： @:translations.enums.launchType.{launchType}`
        }
    },
    profile: {
        changeProfile: {
            title: '更改档案',
            description: '更改当前使用的档案。',
            value: '当前档案： {profileName}',
        },
        enableAllMods: {
            title: '启用所有模组',
            description: '启用当前档案中的所有模组。',
            value: `
            当前未启用任何模组。你有 {totalModCount} 个模组 |
            在 {totalModCount} 个模组中，已启用一个模组 |
            在 {totalModCount} 个模组中，已启用 {enabledModCount} 个模组
            `
        },
        disableAllMods: {
            title: '禁用所有模组',
            description: '禁用当前档案中的所有模组。',
            value: `
            当前未禁用任何模组。你有 {totalModCount} 个模组 |
            在 {totalModCount} 个模组中，已禁用一个模组 |
            在 {totalModCount} 个模组中，已禁用 {disabledModCount} 个模组
            `,
        },
        importLocalMod: {
            title: '导入本地模组',
            description: `安装了一个未从 "{''}@:translations.pages.manager.navigation.modsActions.online{''}" 选项卡下载的模组。`,
            value: '管理器将尝试正确安装模组，但无法保证正常安装。'
        },
        exportProfileAsFile: {
            title: '导出档案为文件',
            description: '将您的模组列表和配置导出为文件。',
            value: '导出的文件可与朋友共享，快速轻松地获取完全相同的配置文件。',
        },
        exportProfileAsCode: {
            title: '导出档案为代码',
            description: '将您的模组列表和配置导出为代码。',
            value: '导出的代码可以与朋友共享，快速轻松地获取完全相同的配置文件。',
        },
        updateAllMods: {
            title: '更新所有模组',
            description: '更新当前档案中的所有模组到最新版本。',
            value: `
            目前没有可更新的模组。 |
            你有一个模组可以更新 |
            你有 {count} 个模组可以更新
            `,
        }
    },
    other: {
        toggleFunkyMode: {
            title: '切换 Funky 模式',
            description: '切换 Funky 模式，以获得更独特的体验。',
            states: {
                enabled: '已启用 Funky 模式',
                disabled: '已禁用 Funky 模式',
            },
        },
        switchTheme: {
            title: '切换主题',
            description: '在浅色和深色主题之间切换。',
            themes: {
                light: '当前： 亮色主题 （默认）',
                dark: '当前： 深色主题',
            },
        },
        switchCardDisplayType: {
            title: '切换卡片显示类型',
            description: '在展开或折叠的卡片之间切换。',
            states: {
                expanded: '当前：展开',
                collapsed: '当前：折叠（默认）'
            }
        },
        refreshOnlineModList: {
            title: '刷新在线模组列表',
            description: '检查是否有新模组发布。',
            states: {
                refreshing: '刷新中',
                errorRefreshing: '刷新模组列表时出现问题： {errorText}',
                disabledWhilstDownloading: '正在下载时，模组列表的刷新功能将被禁用',
                cacheDate: '缓存时间： {formattedDate}',
                apiUnavailable: '没有可用的API信息',
            }
        },
        changeGame: {
            title: '切换游戏',
            description: '切换当前游戏。',
        }
    },
    modpacks: {
        showDependencyStrings: {
            title: '显示依赖名称',
            description: '查看已安装模组及其版本名称的列表。用于在 manifest.json 文件的 dependencies 数组内部。',
            value: `
            由于未安装任何模组，因此不存在依赖 |
            显示 1 个模组的依赖 |
            显示 {n} 个模组的依赖
            `
        }
    }
}
