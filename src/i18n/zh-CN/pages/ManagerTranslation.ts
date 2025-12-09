import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    updateAvailable: {
        title: '有可用更新。',
        linkText: '点击前往发布页面。',
    },
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
            gameIconAltText: '游戏图标'
        }
    },
    installed: {
        noModsInstalled: {
            title: '你似乎没有安装任何模组',
            content: '您可点击左侧的“在线”页面浏览所有可用模组。',
        },
        updatableModsBanner: {
            text: `
            你有 {numberOfModsWithUpdates} 个模组更新可用。 |
            你有 {numberOfModsWithUpdates} 个模组更新可用。
            `,
            updateAction: '更新所有?'
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
                deprecated: '弃用',
                disabled: '禁用'
            },
            display: {
                byline: 'v{version} 作者: {author}',
                installedAt: '安装于: {formattedDate}',
            },
            tooltips: {
                updateAvailable: '有可用更新',
                dependencyIssue: '此模组的依赖存在问题',
                disable: '禁用',
                enable: '启用',
                donate: '为模组作者赞助',
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
            funkyModeAltText: '炫酷模式悬浮窗',
            tooltips: {
                dragToReorder: '拖动以重新排序',
                expand: '展开',
                collapse: '折叠',
            }
        },
    },
    modals: {
        failedToSetSteamFolder: {
            title: '无法设置Steam文件夹',
            steamExecutableNotSelected: 'Steam 可执行文件未被选中。',
            solution: '如果出现此错误但可执行文件正确，请以管理员身份运行。'
        },
        failedToSetTheGameFolder: {
            title: '无法设置 {gameName} 文件夹',
            listedExecutableNames: '可执行文件必须是以下任一类型："{options}"。',
            solution: '如果出现此错误但可执行文件正确，请以管理员身份运行。'
        },
        clearingGameDirectory: {
            title: '清除 {gameName} 安装文件夹',
            waitToLaunchGame: `
                在 Steam 验证游戏文件完整性之前，您将无法启动游戏。
                `,
            steamWillBeStarted: `
                Steam 将启动并尝试验证 {gameName} 的文件完整性。
                `,
            checkSteamForProgress: `
                请查看Steam窗口以确认验证进度。
                若窗口尚未出现，请耐心等待。
                `,
            confirmation: '我明白了'
        },
        dependencyStrings: {
            title: '依赖名称列表',
            dependency: '{modName}-{versionNumber}',
            close: '关闭'
        },
        launchArguments: {
            title: '设置自定义启动参数',
            someProvidedByDefault: '某些参数默认提供:',
            moddedLabel: '模组:',
            availableAfterInstallingLoader: '安装模组加载器后，这些参数将可用。',
            vanillaLabel: '原版:',
            pleaseNote: `
                请注意，这些参数是针对 Steam 可执行文件调用的。
                输入自定义启动参数时请务必谨慎。
                `,
            placeholder: '输入参数',
            updateArguments: '更新启动参数',
        },
        categorySelector: {
            selectCategory: '选择类别',
            noCategoriesSelected: '未选择类别',
        },
        importLocalMod: {
            title: '从文件导入模组',
            actions: {
                selectFile: '选择文件',
                importLocalMod: '导入本地模组',
            },
            content: {
                instructToSelect: '请选择要导入的 zip 或 DLL 文件。',
                dataEntryInfo: `
                包含清单文件的压缩包将自动预填部分信息。
                若无法提供清单文件，则需手动输入相关内容。
                `,
                waitingForSelection: '正在等待文件。这可能需要一分钟。',
                form: {
                    modName: {
                        label: '模组名称',
                        placeholder: '输入模组名称',
                    },
                    modAuthor: {
                        label: '作者',
                        placeholder: '输入作者名称',
                    },
                    description: {
                        label: '描述 (可选)',
                        placeholder: '输入模组描述',
                    },
                    version: {
                        label: '版本',
                        majorLabel: '主要',
                        minorLabel: '次要',
                        patchLabel: '补丁'
                    }
                }
            },
            validationMessages: {
                modNameEmpty: '模组名称不能为空。',
                authorNameEmpty: '模组作者不得为空。',
                invalidVersion: '版本号必须是大于0的整数。',
                nonNumericVersion: '版本号必须均为数字。',
                noProfileSelected: '未选择档案'
            }
        },
        codeExport: {
            title: '档案导出',
            description: '您的代码已复制到剪贴板，也可手动复制如下：',
            done: '完成了',
        },
        downloadProgress: {
            states: {
                downloading: '正在下载 {modName}',
                installing: '正在安装 {modName}',
            },
            downloadProgress: '下载进度: {progress}% 大小： {totalSize}',
            installProgress: '安装进度: {progress}%',
            extractionProgress: '导出进度: {progress}% 大小: {totalSize}',
            waitingForDownload: '正在安装：等待下载完成',
        },
        downloadModVersionSelect: {
            title: '选择要下载的 {modName} 版本',
            content: {
                recommendedDisclaimer: '建议选择所有模组的最新版本。',
                outdatedModsAdvice: '使用老旧的版本可能会出现问题。',
            },
            tags: {
                select: '您必须选择一个版本',
                recommended: '{version} 是推荐版本',
                latest: '{version} 是最新版本',
                outdated: '{version} 是老旧版本'
            },
            download: '下载（包含依赖项）',
        },
        updateAllInstalledMods: {
            noModsToUpdate: {
                title: '没有可更新的模组',
                content: '要么所有已安装的模组都是最新的，要么根本没有安装任何模组。',
                close: '关闭',
            },
            hasModsToUpdate: {
                title: '更新所有已安装的模组',
                content: {
                    willBeUpdated: '所有已安装的模组都将更新至最新版本。',
                    missingDependenciesInstalled: '任何缺失的依赖将被安装。',
                    whatWillHappen: '以下模组将被下载并安装：',
                    modUpdatedTo: '{modName} 将会更新到: {version}',
                },
                updateAll: '更新所有',
            }
        },
        launchType: {
            title: '设置启动行为',
            auto: {
                NATIVE: '您的游戏将原生启动',
                PROTON: '您的游戏将通过“Proton”启动',
            },
            native: {
                unsureWrapperArgsPresent: '无法确认所需的封装参数是否已设置。',
                addArgumentsInfo: '若您尚未手动添加，请将以下启动参数添加至 Steam 的游戏属性中',
            },
            actions: {
                copyLaunchArgs: '复制启动参数',
                update: '更新'
            }
        }
    },
    online: {
        modals: {
            modFilter: {
                title: '筛选模组类别',
                languageDisclaimer: '类别由 Thunderstore 提供，无法进行翻译。',
                selectors: {
                    atLeastOneCategory: '模组必须包含以下类别中的至少一项',
                    allCategories: '模组必须包含以下所有类别',
                    noneCategories: '模组不得包含以下任何类别'
                },
                allowNsfw: '允许NSFW（可能包含露骨内容）的模组',
                showDeprecated: '显示已弃用的模组',
                apply: '应用筛选'
            },
            sort: {
                title: '更改模组的排序',
                sortBehaviour: '排序行为',
                sortDirection: '排序方向',
                close: '关闭'
            },
        },
        previewPanel: {
            author: '作者: {author}',
            metadata: {
                downloads: '下载量: {downloads}',
                likes: '点赞量: {likes}',
                lastUpdated: '最后更新: {date}',
                categories: '类别: {categories}',
            },
            actions: {
                download: '下载',
                viewOnline: '显示在线',
                donate: '赞助',
            },
            tabs: {
                readme: 'README',
                changelog: '更新日志',
                dependencies: '依赖 ({dependencyCount})',
            },
            fetchingData: '拉取数据',
            noDependencies: '该模组没有依赖。',
            unableToFetchReadme: '无法拉取 README',
            unableToFetchChangelog: '无法拉取 CHANGELOG',
        },
        topbar: {
            search: {
                label: '搜索',
                placeholder: '搜索',
            },
            sort: '排序',
            filter: '筛选',
        },
        pagination: {
            changePageInfo: '使用下面的数字切换页面',
            noFoundMods: '未找到符合搜索条件的模组',
            noMods: '没有可用模组',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: '置顶',
                    long: '置顶在 Thunderstore 上'
                },
                deprecated: {
                    short: '已弃用',
                    long: '此模组可能无法使用'
                },
                donate: '向模组作者赞助',
                installed: '模组已安装',
            },
            mod: {
                author: '作者: {author}'
            },
            actions: {
                download: '下载',
                website: '网站',
            }
        }
    },
    actions: {
        locateGameExecutable: '定位 {gameName} 可执行文件位置',
        selectExecutable: '选择可执行文件',
        locateGameLaunchHelper: '定位游戏启动助手可执行文件',
        locateSteamExecutable: '定位 Steam 可执行文件',
    }
}
