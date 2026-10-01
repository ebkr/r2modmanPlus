import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: '设置',
        subtitle: '{appName} 的高级选项：{version}',
    },
    nav: {
        label: '分区',
        categories: {
            all: '全部',
            directories: '目录',
            profile: '配置档',
            appearance: '外观',
            debugging: '调试',
            modpacks: '整合包',
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
            title: '更改启动方式',
            description: '选择特定的启动方式。你可以告诉管理器某个游戏明确使用原生（Native）还是 Proton。',
            current: '当前的启动方式为：',
            searchTerms: [
                '更改启动方式',
                '设置启动模式',
                'Proton',
                'Native',
                'Auto',
            ],
        },
        cleanOnlineModListCache: {
            title: '清理在线模组列表缓存',
            description: '删除模组列表的本地副本并重新获取一份。',
            action: '清理在线模组列表',
            searchTerms: [
                '清理在线模组列表缓存',
                '重置',
            ],
        },
        copyLogToClipboard: {
            title: '复制日志到剪贴板',
            description: '把日志文件的内容复制到剪贴板，格式适用于 Discord。',
            searchTerms: [
                '复制日志文件内容到剪贴板',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
            ],
        },
        copyTroubleshooting: {
            title: '复制故障排查信息到剪贴板',
            description: '把设置及其他信息复制到剪贴板，格式适用于 Discord。寻求支持时请分享这些内容。',
            searchTerms: [
                '复制故障排查信息到剪贴板',
                'Discord',
                '支持',
                '系统',
            ],
        },
        dataDirectory: {
            title: '数据与配置档文件夹',
            description: '存放所有游戏和配置档模组的文件夹。',
            warning: '更改数据文件夹不会移动或删除已有的配置档。不过它们仍会留在旧文件夹中。',
            dataFolder: '数据文件夹',
            profileFolder: '配置档文件夹',
            dialog: {
                title: '选择存放 {appName} 数据的新文件夹',
                button: '选择数据文件夹',
            },
            searchTerms: [
                '数据与配置档目录',
                '更改',
                '浏览',
                '文件夹',
                '目录',
            ],
        },
        downloadCache: {
            title: '下载缓存',
            description: '启用后，如果本地缓存中已有副本，将跳过下载。',
            enabled: '已启用（推荐）',
            disabled: '已停用',
            searchTerms: [
                '切换下载缓存',
                '下载缓存',
                '开关',
            ],
        },
        expandCards: {
            title: '默认展开卡片',
            description: '打开模组列表时，模组卡片默认完全展开而不是收起。',
            expanded: '已展开',
            collapsed: '已收起',
            searchTerms: [
                '默认展开卡片',
                '开关',
                '已收起',
                '已展开',
            ],
        },
        exportProfile: {
            title: '导出配置档',
            description: '导出你的模组列表和模组配置，以便分享给朋友，快速轻松地得到完全相同的配置档。',
            asFile: '导出为文件',
            asCode: '导出为代码',
            dialog: {
                title: '选择导出配置档的目标文件夹',
                button: '选择导出文件夹',
            },
            searchTerms: [
                '导出配置档',
                '导出为文件',
                '导出为代码',
            ],
        },
        funkyMode: {
            title: '启用花哨模式',
            description: '就是花哨模式。',
            enabled: '已启用',
            disabled: '已停用',
            searchTerms: [
                '启用花哨模式',
                '开关',
                '停用'
            ],
        },
        gameDirectory: {
            title: '{gameName} 文件夹',
            description: '需要游戏目录才能把相关文件放到正确的位置。',
            warning: '如果这里设置不当，{gameName} 将以原版（无模组）方式启动。',
            unsure: '我不确定这里该填什么',
            searchTerms: [
                '{gameName} 文件夹',
                '更改',
                '浏览',
                '游戏',
                '目录',
                '文件夹',
            ],
        },
        importLocalMod: {
            title: '导入本地模组',
            description: '从你的文件离线安装模组。并非所有模组都能通过本地方式安装。',
            searchTerms: [
                '导入本地模组',
                '离线安装',
                '导入',
            ],
        },
        launchArguments: {
            title: '启动参数',
            description: '提供启动游戏时会附加的自定义参数。',
            action: '设置启动参数',
            searchTerms: [
                '设置自定义启动参数',
                '启动参数',
            ],
        },
        modCache: {
            title: '模组缓存',
            description: '下载的模组会保存在缓存中，这样就不必重复下载。',
            stillWritten: '模组仍会被写入缓存，并继续占用磁盘空间。',
            action: '清理缓存',
            actionDescription: '删除不在任何配置档中的缓存模组，以释放存储空间。',
            enabled: '已启用',
            disabled: '已停用',
            enabledHint: '复用缓存中的下载（推荐）',
            disabledHint: '下载模组时忽略缓存，每次都重新下载。',
            searchTerms: [
                '模组缓存',
                '下载',
                '复用缓存中的下载',
                '开关',
                '清理模组缓存',
                '释放空间',
                '清除',
                '存储',
            ],
        },
        modState: {
            title: '更改模组状态',
            description: '批量启用 / 停用配置档中的所有模组。',
            enableAll: '启用全部模组',
            disableAll: '停用全部模组',
            allEnabled: '你所有的模组当前都处于启用状态。',
            allDisabled: '你所有的模组当前都处于停用状态。',
            someDisabled: '有 1 个模组已停用。 | 有 {count} 个模组已停用。',
            searchTerms: [
                '更改模组状态',
                '开关',
                '启用全部模组',
                '停用全部模组',
            ],
        },
        onlineModList: {
            title: '在线模组列表',
            description: '检查新的模组发布，或清除本地副本。',
            refresh: '刷新',
            deleteCopy: '删除副本',
            states: {
                refreshing: '正在刷新……',
                error: '刷新模组列表时出错：{message}',
                disabledWhileDownloading: '在有活动下载任务时无法刷新模组列表。',
                lastUpdated: '最后更新于：{date}',
                noApiInfo: '没有可用的 API 信息',
            },
            searchTerms: [
                '刷新在线模组列表',
                '检查新的模组发布',
                '清理在线模组列表缓存',
                '重置模组列表缓存',
            ],
        },
        refreshOnlineModList: {
            title: '刷新在线模组列表',
            description: '检查是否有新的模组发布。{status}',
            action: '刷新',
            states: {
                refreshing: '正在刷新……',
                error: '刷新模组列表时出错：{message}',
                disabledWhileDownloading: '在有活动下载任务时无法刷新模组列表。',
                cacheDate: '缓存在：{date}',
                noApiInfo: '没有可用的 API 信息',
            },
            searchTerms: [
                '刷新在线模组列表',
                '检查新的模组发布',
                'Thunderstore 模组',
            ],
        },
        resetGameInstallation: {
            title: '重置 {gameName} 安装',
            description: '修复因文件损坏或手动装模组的残留文件所导致的问题。这会删除 {folderName} 文件夹的全部内容，并通过 Steam 校验游戏文件。',
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
            description: '查看已安装模组及其版本字符串的列表，格式与 manifest.json 文件的 dependencies 数组中使用的相同。共显示 {modCount} 个模组的依赖字符串。',
            searchTerms: [
                '显示依赖字符串',
            ],
        },
        steamDirectory: {
            title: 'Steam 文件夹',
            description: '包含 Steam 可执行文件的 Steam 文件夹。',
            value: '{appName} 将以这种方式启动游戏。',
            searchTerms: [
                '更改 Steam 文件夹',
                '更改 Steam 目录',
                '浏览',
                '目录',
            ],
        },
        theme: {
            title: '主题',
            description: '在浅色或深色外观之间切换管理器界面。',
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
            title: '切换首选的 Thunderstore CDN',
            description: '在应用重启前切换 CDN。这可能绕开模组下载方面的问题。',
            action: '切换首选 CDN',
            current: '当前：{label}',
            searchTerms: [
                '切换首选的 Thunderstore CDN',
                '更改',
            ],
        },
        updateAllMods: {
            title: '更新全部模组',
            description: '快速把所有已安装的模组更新到最新版本。{status}',
            status: '有 1 个模组可以更新。 | 有 {count} 个模组可以更新。',
            searchTerms: [
                '更新全部模组',
            ],
        },
    }
};

