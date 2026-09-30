import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: '设置',
        subtitle: '{appName} 高级选项：{version}',
    },
    nav: {
        label: '分区',
        categories: {
            all: '全部',
            directories: '目录',
            profile: '档案',
            appearance: '外观',
            debugging: '调试',
            modpacks: '模组包',
            other: '其他',
        }
    },
    search: {
        label: '搜索',
        placeholder: '搜索设置项',
    },
    actions: {
        change: '更改',
        browse: '浏览',
        notSet: '未设置',
    },
    entries: {
        changeLaunchBehaviour: {
            title: '更改启动行为',
            description: '选择特定的启动行为。您可以告诉管理器该游戏明确使用原生（Native）还是 Proton 启动。',
            current: '当前启动行为设置为：',
            searchTerms: [
                '更改启动行为',
                '设置启动模式',
                'Proton',
                '原生',
                '自动',
            ],
        },
        cleanOnlineModListCache: {
            title: '清理在线模组列表缓存',
            description: '删除模组列表的本地副本并重新获取。',
            action: '清理在线模组列表',
            searchTerms: [
                '清理在线模组列表缓存',
                '重置',
            ],
        },
        copyLogToClipboard: {
            title: '复制日志到剪贴板',
            description: '将日志文件内容复制到剪贴板，并保留 Discord 格式。',
            searchTerms: [
                '复制日志文件内容到剪贴板',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
                '日志',
            ],
        },
        copyTroubleshooting: {
            title: '复制故障排除信息到剪贴板',
            description: '将设置及其他信息复制到剪贴板，并保留 Discord 格式。请求支持时请分享此信息。',
            searchTerms: [
                '复制故障排除信息到剪贴板',
                'Discord',
                '支持',
                '系统',
                '故障排除',
            ],
        },
        dataDirectory: {
            title: '数据与档案文件夹',
            description: '存放所有游戏和档案模组的文件夹。',
            warning: '更改数据文件夹不会移动或删除现有档案，但它们仍会保留在旧的文件夹中。',
            dataFolder: '数据文件夹',
            profileFolder: '档案文件夹',
            dialog: {
                title: '选择用于存储 {appName} 数据的新文件夹',
                button: '选择数据文件夹',
            },
            searchTerms: [
                '数据与档案目录',
                '更改',
                '浏览',
                '文件夹',
                '目录',
            ],
        },
        downloadCache: {
            title: '下载缓存',
            description: '启用后，如果缓存中已有相同副本，将跳过重复下载。',
            enabled: '已启用（推荐）',
            disabled: '已禁用',
            searchTerms: [
                '切换下载缓存',
                '下载缓存',
                '切换',
            ],
        },
        expandCards: {
            title: '默认展开卡片',
            description: '打开模组列表时，默认完整展开模组卡片而不是折叠显示。',
            expanded: '展开',
            collapsed: '折叠',
            searchTerms: [
                '默认展开卡片',
                '切换',
                '折叠',
                '展开',
            ],
        },
        exportProfile: {
            title: '导出档案',
            description: '导出您的模组列表和配置，与朋友分享，快速轻松地获得完全一致的配置。',
            asFile: '导出为文件',
            asCode: '导出为代码',
            dialog: {
                title: '选择导出档案的目标文件夹',
                button: '选择导出文件夹',
            },
            searchTerms: [
                '导出档案',
                '导出为文件',
                '导出为代码',
            ],
        },
        funkyMode: {
            title: '启用趣味模式',
            description: '就是趣味模式。',
            enabled: '已启用',
            disabled: '已禁用',
            searchTerms: [
                '启用趣味模式',
                '切换',
                '禁用'
            ],
        },
        gameDirectory: {
            title: '{gameName} 文件夹',
            description: '需要正确设置游戏目录，才能将相应文件放置到位。',
            warning: '如果设置不当，{gameName} 将以未安装模组的状态启动。',
            unsure: '我不确定应该选择哪个',
            searchTerms: [
                '{gameName} 文件夹',
                '更改',
                '浏览',
                '游戏',
                '目录',
            ],
        },
        importLocalMod: {
            title: '导入本地模组',
            description: '从本地文件离线安装模组。并非所有模组都能以本地方式安装。',
            searchTerms: [
                '导入本地模组',
                '离线安装',
                '导入',
            ],
        },
        launchArguments: {
            title: '启动参数',
            description: '提供启动游戏时附加的自定义参数。',
            action: '设置启动参数',
            searchTerms: [
                '设置自定义启动参数',
                '启动参数',
            ],
        },
        modCache: {
            title: '模组缓存',
            description: '下载的模组会保留在缓存中，无需重复下载。',
            stillWritten: '模组仍会写入缓存并继续占用磁盘空间。',
            action: '清理缓存',
            actionDescription: '移除不在任何档案中的缓存模组以释放存储空间。',
            enabled: '已启用',
            disabled: '已禁用',
            enabledHint: '重复使用缓存的下载（推荐）',
            disabledHint: '下载模组时忽略缓存，每次都会重新下载。',
            searchTerms: [
                '模组缓存',
                '下载',
                '重复使用缓存的下载',
                '切换',
                '清理模组缓存',
                '释放空间',
                '清除',
                '存储',
            ],
        },
        modState: {
            title: '更改模组状态',
            description: '启用 / 禁用档案中的所有模组。',
            enableAll: '启用所有模组',
            disableAll: '禁用所有模组',
            allEnabled: '当前所有模组均已启用。',
            allDisabled: '当前所有模组均已禁用。',
            someDisabled: '您禁用了 1 个模组。 | 您禁用了 {count} 个模组。',
            searchTerms: [
                '更改模组状态',
                '切换',
                '启用所有模组',
                '禁用所有模组',
            ],
        },
        onlineModList: {
            title: '在线模组列表',
            description: '检查是否有新发布的模组，或清除本地副本。',
            refresh: '刷新',
            deleteCopy: '删除副本',
            states: {
                refreshing: '正在刷新……',
                error: '刷新模组列表时出错：{message}',
                disabledWhileDownloading: '有正在进行的下载时，无法刷新模组列表。',
                lastUpdated: '最后更新于：{date}',
                noApiInfo: '没有可用的 API 信息',
            },
            searchTerms: [
                '刷新在线模组列表',
                '检查新模组发布',
                '清理在线模组列表缓存',
                '重置模组列表缓存',
            ],
        },
        refreshOnlineModList: {
            title: '刷新在线模组列表',
            description: '检查是否有新发布的模组。{status}',
            action: '刷新',
            states: {
                refreshing: '正在刷新……',
                error: '刷新模组列表时出错：{message}',
                disabledWhileDownloading: '有正在进行的下载时，无法刷新模组列表。',
                cacheDate: '缓存日期：{date}',
                noApiInfo: '没有可用的 API 信息',
            },
            searchTerms: [
                '刷新在线模组列表',
                '检查新模组发布',
                'Thunderstore 模组',
            ],
        },
        resetGameInstallation: {
            title: '重置 {gameName} 安装',
            description: '修复由文件损坏或手动打模组尝试后残留的文件导致的问题。这将删除 {folderName} 文件夹中的全部内容，并通过 Steam 验证文件。',
            action: '重置安装',
            searchTerms: [
                '重置 {gameName} 安装',
                '校验文件',
                '验证完整性',
                '损坏',
                '文件',
            ],
        },
        showDependencyStrings: {
            title: '显示依赖字符串',
            description: '查看已安装模组及其版本字符串的列表，即 manifest.json 文件 dependencies 数组中使用的格式。显示 {modCount} 个模组的依赖字符串。',
            searchTerms: [
                '显示依赖字符串',
            ],
        },
        steamDirectory: {
            title: 'Steam 文件夹',
            description: '包含 Steam 可执行文件的 Steam 文件夹。',
            value: '{appName} 将通过它启动游戏。',
            searchTerms: [
                '更改 Steam 文件夹',
                '更改 Steam 目录',
                '浏览',
                '目录',
            ],
        },
        theme: {
            title: '主题',
            description: '在管理器的浅色和深色外观之间选择。',
            light: '浅色',
            dark: '深色',
            searchTerms: [
                '主题',
                '浅色',
                '深色',
                '外观',
            ],
        },
        toggleCdn: {
            title: '切换首选 Thunderstore CDN',
            description: '在应用重启前切换 CDN。这可能绕过下载模组时遇到的问题。',
            action: '切换首选 CDN',
            current: '当前：{label}',
            searchTerms: [
                '切换首选 Thunderstore CDN',
                '更改',
            ],
        },
        updateAllMods: {
            title: '更新所有模组',
            description: '快速将所有已安装的模组更新到最新版本。{status}',
            status: '1 个模组有可用更新。 | {count} 个模组有可用更新。',
            searchTerms: [
                '更新所有模组',
            ],
        },
    }
};
