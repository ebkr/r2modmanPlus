import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: '启动模组模式',
            startVanilla: '启动原版'
        },
        modsActions: {
            label: '模组',
            installed: '已安装',
            online: '在线'
        },
        otherActions: {
            label: '其他',
            configEditor: '模组配置编辑器',
            settings: '设置',
            help: '帮助',
        },
        profileSwitcher: {
            label: '配置档',
            gameIconAltText: '游戏图片',
            close: '关闭',
        },
        activityBar: {
            exportProfile: '导出配置档',
            exportToCode: '导出为代码',
            exportToFile: '导出为文件',
            refreshingModList: '正在刷新模组列表：{progress}%',
        }
    },
    installed: {
        noModsInstalled: {
            title: '看起来你还没有安装任何模组',
            content: '你可以点击左侧的「在线」标签页来浏览所有可用的模组。',
        },
        searchAndSort: {
            search: {
                label: '搜索',
                placeholder: '搜索已安装的模组',
            },
            sort: {
                label: '排序',
                disabledPositions: {
                    label: '已停用',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: '已弃用',
                disabled: '已停用'
            },
            display: {
                byline: 'v{version}，作者 {author}',
                installedAt: '安装于：{formattedDate}',
                releasedAt: '发布于：{formattedDate}',
            },
            concerning: {
                recommendation: '建议移除此模组。',
            },
            tooltips: {
                updateAvailable: '有可用更新',
                dependencyIssue: '此模组的依赖存在问题',
                disable: '停用',
                enable: '启用',
                donate: '打赏模组作者',
                willNotBeUsed: '此模组不会在游戏内生效',
            },
            actions: {
                uninstall: '卸载',
                disable: '停用',
                enable: '启用',
                associated: '关联模组',
                openWebsite: '官网',
                update: '更新',
                downloadDependency: '下载依赖',
                enableSpecific: '启用 {dependencyName}',
                donate: '打赏',
            }
        },
        expandableCard: {
            imageAltText: '模组图片',
            funkyModeAltText: '花哨模式叠加层',
            tooltips: {
                dragToReorder: '拖动以重新排序',
                expand: '展开',
                collapse: '收起',
            },
        },
    },
    online: {
        previewPanel: {
            author: '作者 {author}',
            metadata: {
                downloads: '下载量：{downloads}',
                likes: '点赞数：{likes}',
                lastUpdated: '最后更新：{date}',
                categories: '分类：{categories}',
            },
            actions: {
                download: '下载',
                viewOnline: '在线查看',
                donate: '打赏',
            },
            tabs: {
                readme: 'README',
                changelog: 'CHANGELOG',
                dependencies: '依赖（{dependencyCount}）',
            },
            packageInformation: '模组包信息',
            nsfwWarning: '此模组可能包含成人内容',
            fetchingData: '正在获取数据',
            noDependencies: '此模组没有依赖',
            unableToFetchReadme: '无法获取 README',
            unableToFetchChangelog: '无法获取 CHANGELOG',
        },
        topbar: {
            search: {
                label: '搜索',
                placeholder: '搜索模组',
            },
            sort: '排序',
            filter: '筛选',
        },
        pagination: {
            changePageInfo: '使用下方的页码来切换页面',
            noFoundMods: '没有找到匹配的模组',
            noMods: '没有可用的模组',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: '已置顶',
                    long: '已在 Thunderstore 置顶'
                },
                deprecated: {
                    short: '已弃用',
                    long: '此模组可能已经无法正常使用'
                },
                donate: '打赏模组作者',
                installed: '模组已安装',
                nsfw: '模组被标记为 NSFW',
            },
            mod: {
                author: '作者 {author}'
            },
            actions: {
                download: '下载',
                website: '官网',
            }
        }
    },
    actions: {
        locateGameExecutable: '定位 {gameName} 可执行文件',
        selectExecutable: '选择可执行文件',
        locateGameLaunchHelper: '定位 gamelaunchhelper 可执行文件',
        locateSteamExecutable: '定位 Steam 可执行文件',
    }
}

