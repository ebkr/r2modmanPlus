import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: '无法设置 Steam 文件夹',
        steamExecutableNotSelected: '未选择 Steam 可执行文件。',
        solution: '如果可执行文件正确但仍出现此错误，请尝试以管理员身份运行。'
    },
    failedToSetTheGameFolder: {
        title: '无法设置 {gameName} 文件夹',
        listedExecutableNames: '可执行文件必须是以下之一："{options}"。',
        executableMustBeOneOf: '所选的可执行文件必须是以下之一：',
        solution: '如果可执行文件正确但仍出现此错误，请尝试以管理员身份运行。'
    },
    clearingGameDirectory: {
        title: '正在清理 {gameName} 安装目录',
        waitToLaunchGame: `
            在 Steam 验证游戏文件完整性之前，您将无法启动游戏。
            `,
        steamWillBeStarted: `
            Steam 将会启动，并尝试验证 {gameName} 的文件完整性。
            `,
        checkSteamForProgress: `
            请在 Steam 窗口中查看验证进度。
            如果窗口尚未出现，请耐心等待。
            `,
        confirmation: '我明白了'
    },
    dependencyStrings: {
        title: '依赖字符串列表',
        dependency: '{modName}-{versionNumber}',
        close: '关闭'
    },
    launchArguments: {
        title: '设置自定义启动参数',
        someProvidedByDefault: '某些参数是默认提供的：',
        moddedLabel: '模组模式：',
        availableAfterInstallingLoader: '这些参数将在安装模组加载器后可用。',
        vanillaLabel: '原版模式：',
        pleaseNote: `
            请注意，这些参数是针对 Steam 可执行文件执行的。
            输入自定义启动参数时请务必谨慎。
            `,
        placeholder: '输入参数',
        updateArguments: '更新启动参数',
    },
    categorySelector: {
        selectCategory: '选择类别',
        noCategoriesSelected: '未选择任何类别',
    },
    importLocalMod: {
        title: '从文件导入模组',
        dialogTitle: '从文件导入本地模组',
        actions: {
            selectFile: '选择文件',
            importLocalMod: '导入本地模组',
        },
        content: {
            instructToSelect: '请选择要导入的 zip 压缩包或 DLL 文件。',
            dataEntryInfo: `
            包含清单文件的压缩包会自动预填部分信息。
            如果没有清单文件，则需要手动输入。
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
                    label: '描述（可选）',
                    placeholder: '输入描述'
                },
                version: {
                    label: '版本',
                    majorLabel: '主版本',
                    minorLabel: '次版本',
                    patchLabel: '修订号'
                }
            }
        },
        validationMessages: {
            modNameEmpty: '模组名称不能为空。',
            authorNameEmpty: '模组作者不能为空。',
            invalidVersion: '主版本、次版本和修订号必须是大于 0 的整数。',
            nonNumericVersion: '主版本、次版本和修订号必须是数字。',
            noProfileSelected: '未选择档案。'
        }
    },
    concerningPackage: {
        title: '审查 {modName}',
        notFound: '此模组最初下载自 Thunderstore，但现在已无法在该网站上找到。',
        whyRemoved: '模组可能因作者要求、违反规则，或正在接受审核而被移除。',
        recommendation: '一般建议移除已从 Thunderstore 下架的模组。',
        exportWarning: '其他人将无法从导出的档案中导入此模组。',
        actions: {
            markSafe: '标记此版本为安全',
            remove: '移除模组',
            review: '审查模组',
        }
    },
    gameRunning: {
        starting: '{gameName} 正在启动',
        launchingViaSteam: '{gameName} 正在通过 Steam 启动',
        closeToContinue: '关闭此消息以继续操作。',
        takingAWhile: '如果启动耗时较长，很可能是因为 Steam 正在启动。',
        bePatient: '请耐心等待，祝您玩得开心！',
        close: '关闭',
    },
    error: {
        title: '错误',
        suggestion: '建议',
        close: '关闭',
    },
    disableMod: {
        title: '正在禁用 {modName}',
        dependantsWarning: '其他模组依赖此模组。选择{disableAllAction}以一并禁用依赖它的模组，否则它们可能会引发错误。',
        modsToBeDisabled: '将要禁用的模组',
        actions: {
            disableAll: '全部禁用',
            disableAllRecommended: '全部禁用（推荐）',
            disableOnly: '仅禁用 {modName}',
        }
    },
    uninstallMod: {
        title: '正在卸载 {modName}',
        dependantsWarning: '其他模组依赖此模组。选择{uninstallAllAction}以一并卸载依赖它的模组，否则它们可能会引发错误。',
        modsToBeUninstalled: '将要卸载的模组',
        actions: {
            uninstallAll: '全部卸载',
            uninstallAllRecommended: '全部卸载（推荐）',
            uninstallOnly: '仅卸载 {modName}',
        }
    },
    associatedMods: {
        title: '与 {modName} 关联的模组',
        dependencies: '依赖',
        dependants: '被依赖',
        none: '此模组没有依赖或被依赖的模组。',
        done: '完成',
    },
    codeExport: {
        title: '档案已导出',
        description: '您的代码已复制到剪贴板，您也可以在下方手动复制：',
        done: '完成',
        copied: '已复制到剪贴板',
    },
    downloadProgress: {
        states: {
            downloading: '正在下载 {modName}',
            installing: '正在安装 {modName}',
        },
        complete: '下载完成',
        close: '关闭',
        downloadProgress: '正在下载：{progress}%（共 {totalSize}）',
        installProgress: '正在安装：{progress}%',
        extractionProgress: '正在解压：{progress}%（共 {totalSize}）',
        waitingForDownload: '正在安装：等待下载完成',
    },
    downloadModVersionSelect: {
        title: '选择要下载的 {modName} 版本',
        content: {
            recommendedDisclaimer: '建议选择所有模组的最新版本。',
            outdatedModsAdvice: '使用过旧的版本可能会导致问题。',
        },
        tags: {
            select: '您必须选择一个版本',
            recommended: '{version} 是推荐版本',
            latest: '{version} 是最新版本',
            outdated: '{version} 是过时的版本'
        },
        download: '连同依赖一起下载',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: '没有可更新的模组',
            content: '所有已安装的模组均为最新版本，或者尚未安装任何模组。',
            close: '关闭',
        },
        hasModsToUpdate: {
            title: '更新所有已安装的模组',
            content: {
                willBeUpdated: '所有已安装的模组都将更新到最新版本。',
                missingDependenciesInstalled: '缺失的依赖将被安装。',
                whatWillHappen: '以下模组将被下载并安装：',
                modUpdatedTo: '{modName} 将更新到：{version}',
            },
            updateAll: '全部更新',
        }
    },
    launchType: {
        title: '设置启动方式',
        auto: {
            NATIVE: '您的游戏将使用"原生（Native）"方式启动',
            PROTON: '您的游戏将使用"Proton"方式启动',
        },
        native: {
            unsureWrapperArgsPresent: '我们无法确定所需的封装器参数是否已设置。',
            addArgumentsInfo: '如果您尚未手动设置，请在 Steam 上将该游戏的属性中添加以下启动参数：',
        },
        actions: {
            copyLaunchArgs: '复制启动参数',
            update: '更新'
        }
    },
    modFilter: {
        title: '筛选模组类别',
        languageDisclaimer: '类别由 Thunderstore 提供，无法翻译。',
        selectors: {
            atLeastOneCategory: '模组必须包含这些类别中的至少一个',
            allCategories: '模组必须包含所有这些类别',
            noneCategories: '模组不能包含这些类别中的任何一个'
        },
        allowNsfw: '允许 NSFW（可能含露骨内容）的模组',
        showDeprecated: '显示已弃用的模组',
        apply: '应用筛选'
    },
    sort: {
        title: '更改模组排序',
        sortBehaviour: '排序方式',
        sortDirection: '排序方向',
        close: '关闭',
    },
    createProfile: {
        title: '创建档案',
        description: '此档案将独立于其他档案存储自己的模组。',
        tagStates: {
            required: '您必须输入档案名称',
            valid: '"{profileName}" 是有效的档案名称',
            error: '"{profileName}" 已被使用或包含无效字符'
        },
        actions: {
            create: '创建'
        }
    },
    deleteProfile: {
        title: '删除档案',
        content: {
            resultingAction: '这将移除此档案中安装的所有模组及其配置文件。',
            preventAction: '如果这是误操作，请点击变暗的区域，或右上角的叉号。',
            confirmation: '您确定要删除此档案吗？',
        },
        actions: {
            delete: '删除档案',
        }
    },
    renameProfile: {
        title: '重命名档案',
        content: '此档案将独立于其他档案存储自己的模组。',
        actions: {
            rename: '重命名',
        },
        tagStates: {
            required: '您必须输入档案名称',
            valid: '"{profileName}" 是有效的档案名称',
            error: '"{profileName}" 已被使用或包含无效字符'
        },
    },
    importProfile: {
        dialogTitle: '导入档案',
        dialogButton: '导入',
        states: {
            fileCodeSelection: {
                title: '您想以哪种方式导入档案？',
                actions: {
                    fromFile: '从文件',
                    fromCode: '从代码'
                }
            },
            fromFile: {
                title: '正在加载文件',
                content: '将弹出文件选择窗口。选择档案后可能需要一些时间。',
            },
            importCode: {
                title: '输入档案代码',
                enterCodePlaceholder: '输入档案代码',
                tagStates: {
                    invalid: '代码无效，请检查是否有拼写错误',
                },
                actions: {
                    loading: '加载中',
                    proceed: '继续'
                }
            },
            refresh: {
                title: '正在刷新在线模组列表',
                content: {
                    description: `
                    档案中的某些模组包无法被模组管理器识别。
                    刷新在线模组列表可能会解决此问题。请稍候。
                    `,
                    waitingForModDownloads: '正在等待模组下载完成，随后刷新在线模组列表',
                }
            },
            reviewImport: {
                title: '将要安装的模组包',
                content: {
                    notFoundDisclaimer: '档案中的这些模组包在 Thunderstore 上未找到，将不会被安装：',
                    ensureCorrectProfile: '请确保此档案适用于当前选择的游戏。',
                    packagesWillBeInstalled: '这些模组包将被安装：',
                },
                actions: {
                    acknowledgement: '我了解部分模组将不会被导入',
                    proceed: '导入'
                }
            },
            willImportOrUpdate: {
                title: '您要更新现有档案，还是创建新档案？',
                actions: {
                    newProfile: '导入为新档案',
                    existingProfile: '更新现有档案',
                }
            },
            addProfile: {
                title: '导入档案',
                content: {
                    create: {
                        description: '此档案将独立于其他档案存储自己的模组。'
                    },
                    update: {
                        contentsWillBeOverwritten: '档案中的全部内容都将被代码/文件中的内容覆盖。',
                        selectProfile: '在下方选择一个档案：'
                    }
                },
                tagStates: {
                    required: '您必须输入档案名称',
                    valid: '"{profileName}" 是有效的档案名称',
                    error: '"{profileName}" 已被使用或包含无效字符'
                },
                actions: {
                    create: '创建',
                    update: '更新档案：{profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: '正在下载模组：{progress}%',
                    downloadingModsWithGoal: '正在下载模组：{progress}%（共 {totalSize}）',
                    cleaningUp: '正在清理',
                    applyChanges: '正在将更改应用到已更新的档案',
                    copyingModsToProfile: '正在将模组复制到档案：{progress}%',
                    copyingConfigsToProfile: '正在将配置复制到档案：{progress}%'
                },
                content: {
                    waitMessage: '这可能需要一段时间，因为文件正在下载、解压和复制。',
                    doNotClose: '请勿关闭 {appName}。'
                }
            }
        }
    },
    platform: {
        header: '哪个商店管理着您的游戏？',
        selectAction: '选择平台',
    },
    settingsLoader: {
        managerProblem: '这是模组管理器本身的问题。如果有更新版本的管理器可用，请尝试安装。',
        loadFailed: '加载本地用户设置失败。您可以使用下方的按钮重置设置，但请注意，所有游戏的全部设置都将丢失，且此操作无法撤销。',
        resetAction: '重置设置',
        resetFailed: '重置设置失败。您仍可以按照这些{instructionsLink}尝试手动重置设置。',
        instructionsLinkText: '说明',
        resetDidNotHelp: '本地存储的设置已重置，但仍未能解决加载设置的问题。如果有更新版本的管理器可用，请尝试安装。'
    },
    actions: {
        close: '关闭',
    },
}
