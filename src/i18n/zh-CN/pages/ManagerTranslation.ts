import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: '启动模组',
            startVanilla: '启动原版'
        },
        modsActions: {
            label: '模组',
            installed: '已安装',
            online: '在线'
        },
        otherActions: {
            label: '其他',
            configEditor: '配置编辑器',
            settings: '设置',
            help: '帮助',
        },
        profileSwitcher: {
            label: '档案',
            gameIconAltText: '游戏图标',
            close: '关闭',
        },
        activityBar: {
            exportProfile: '导出档案',
            exportToCode: '导出为代码',
            exportToFile: '导出为文件',
            refreshingModList: '正在刷新模组列表：{progress}%',
        }
    },
    installed: {
        noModsInstalled: {
            title: '您似乎没有安装任何模组',
            content: '您可以点击左侧的“在线”标签页浏览所有可用模组。',
        },
        searchAndSort: {
            search: {
                label: '搜索',
                placeholder: '搜索已安装的模组',
            },
            sort: {
                label: '排序',
                disabledPositions: {
                    label: '禁用',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: '已弃用',
                disabled: '已禁用'
            },
            display: {
                byline: 'v{version} 作者：{author}',
                installedAt: '安装于：{formattedDate}',
                releasedAt: '发布于：{formattedDate}',
            },
            concerning: {
                recommendation: '建议您移除此模组。',
            },
            tooltips: {
                updateAvailable: '有可用更新',
                dependencyIssue: '此模组的依赖存在问题',
                disable: '禁用',
                enable: '启用',
                donate: '赞助模组作者',
                willNotBeUsed: '此模组在游戏中不会被启用',
            },
            actions: {
                uninstall: '卸载',
                disable: '禁用',
                enable: '启用',
                associated: '关联',
                openWebsite: '网站',
                update: '更新',
                downloadDependency: '下载依赖',
                enableSpecific: '启用 {dependencyName}',
                donate: '赞助',
            }
        },
        expandableCard: {
            imageAltText: '模组图片',
            funkyModeAltText: '趣味模式遮罩',
            tooltips: {
                dragToReorder: '拖动以重新排序',
                expand: '展开',
                collapse: '折叠',
            }
        },
    },
    online: {
        previewPanel: {
            author: '作者：{author}',
            metadata: {
                downloads: '下载量：{downloads}',
                likes: '点赞数：{likes}',
                lastUpdated: '最后更新：{date}',
                categories: '类别：{categories}',
            },
            actions: {
                download: '下载',
                viewOnline: '在线查看',
                donate: '赞助',
            },
            tabs: {
                readme: 'README',
                changelog: '更新日志',
                dependencies: '依赖（{dependencyCount}）',
            },
            packageInformation: '模组包信息',
            nsfwWarning: '此模组可能包含露骨内容',
            fetchingData: '正在获取数据',
            noDependencies: '此模组没有依赖',
            unableToFetchReadme: '无法获取 README',
            unableToFetchChangelog: '无法获取更新日志',
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
            changePageInfo: '使用下方数字切换页面',
            noFoundMods: '未找到符合搜索条件的模组',
            noMods: '没有可用模组',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: '已置顶',
                    long: '在 Thunderstore 上置顶'
                },
                deprecated: {
                    short: '已弃用',
                    long: '此模组可能已无法使用'
                },
                donate: '赞助模组作者',
                installed: '模组已安装',
                nsfw: '被标记为 NSFW 的模组',
            },
            mod: {
                author: '作者：{author}'
            },
            actions: {
                download: '下载',
                website: '网站',
            }
        }
    },
    actions: {
        locateGameExecutable: '定位 {gameName} 可执行文件',
        selectExecutable: '选择可执行文件',
        locateGameLaunchHelper: '定位游戏启动辅助程序',
        locateSteamExecutable: '定位 Steam 可执行文件',
    }
}
