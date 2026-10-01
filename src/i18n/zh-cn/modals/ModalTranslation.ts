import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: '设置 Steam 文件夹失败',
        steamExecutableNotSelected: '未选择 Steam 可执行文件。',
        solution: '如果出现此错误但可执行文件本身是正确的，请以管理员身份运行。'
    },
    failedToSetTheGameFolder: {
        title: '设置 {gameName} 文件夹失败',
        listedExecutableNames: '可执行文件必须是下列之一：“{options}”。',
        executableMustBeOneOf: '所选的可执行文件必须是下列之一：',
        solution: '如果出现此错误但可执行文件本身是正确的，请以管理员身份运行。'
    },
    clearingGameDirectory: {
        title: '正在清空 {gameName} 的安装目录',
        waitToLaunchGame: `
            在 Steam 校验完游戏文件的完整性之前，
            你将无法启动游戏。
            `,
        steamWillBeStarted: `
            Steam 将会启动，并尝试校验
            {gameName} 的完整性。
            `,
        checkSteamForProgress: `
            请在 Steam 窗口中查看校验进度。
            如果窗口还没出现，请耐心等待。
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
        someProvidedByDefault: '部分参数是默认提供的：',
        moddedLabel: '模组模式：',
        availableAfterInstallingLoader: '这些参数会在安装模组加载器后可用。',
        vanillaLabel: '原版：',
        pleaseNote: `
            请注意，这些参数是针对 Steam 可执行文件调用的。
            填写自定义启动参数时请务必小心。
            `,
        placeholder: '输入参数',
        updateArguments: '更新启动参数',
    },
    categorySelector: {
        selectCategory: '选择一个分类',
        noCategoriesSelected: '未选择任何分类',
    },
    importLocalMod: {
        title: '从文件导入模组',
        dialogTitle: '从文件导入本地模组',
        actions: {
            selectFile: '选择文件',
            importLocalMod: '导入本地模组',
        },
        content: {
            instructToSelect: '请选择要导入的 zip 或 DLL 文件。',
            dataEntryInfo: `
            包含 manifest 文件的 zip 会预先填入部分信息。
            如果没有 manifest，就需要手动填写。
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
                    majorLabel: '主版本号',
                    minorLabel: '次版本号',
                    patchLabel: '修订号'
                }
            }
        },
        validationMessages: {
            modNameEmpty: '模组名称不能为空。',
            authorNameEmpty: '模组作者不能为空。',
            invalidVersion: '主版本号、次版本号和修订号必须是大于 0 的整数。',
            nonNumericVersion: '主版本号、次版本号和修订号都必须是数字。',
            noProfileSelected: '未选择配置档。'
        }
    },
    concerningPackage: {
        title: '审查 {modName}',
        notFound: '此模组最初是从 Thunderstore 下载的，但现在已无法在该站点上找到。',
        whyRemoved: '模组可能因作者要求、违反规定，或正在接受版主审核而被移除。',
        recommendation: '通常建议移除那些已从 Thunderstore 下架的模组。',
        exportWarning: '其他人将无法从导出的配置档中导入此模组。',
        actions: {
            markSafe: '将该版本标记为安全',
            remove: '移除模组',
            review: '审查模组',
        }
    },
    gameRunning: {
        starting: '{gameName} 正在启动',
        launchingViaSteam: '{gameName} 正在通过 Steam 启动',
        closeToContinue: '关闭此提示即可继续管理模组。',
        takingAWhile: '如果这一步耗时较久，通常是 Steam 正在启动所致。',
        bePatient: '请耐心等待，玩得开心！',
        close: '关闭',
    },
    error: {
        title: '错误',
        suggestion: '建议',
        close: '关闭',
    },
    disableMod: {
        title: '正在停用 {modName}',
        dependantsWarning: '有其他模组依赖此模组。选择「{disableAllAction}」来停用被依赖的模组，否则它们可能会报错。',
        modsToBeDisabled: '将要停用的模组',
        actions: {
            disableAll: '全部停用',
            disableAllRecommended: '全部停用（推荐）',
            disableOnly: '仅停用 {modName}',
        }
    },
    uninstallMod: {
        title: '正在卸载 {modName}',
        dependantsWarning: '有其他模组依赖此模组。选择「{uninstallAllAction}」来卸载被依赖的模组，否则它们可能会报错。',
        modsToBeUninstalled: '将要卸载的模组',
        actions: {
            uninstallAll: '全部卸载',
            uninstallAllRecommended: '全部卸载（推荐）',
            uninstallOnly: '仅卸载 {modName}',
        }
    },
    associatedMods: {
        title: '与 {modName} 关联的模组',
        dependencies: '依赖项',
        dependants: '被依赖项',
        none: '此模组没有依赖项，也没有被依赖项。',
        done: '完成',
    },
    codeExport: {
        title: '配置档已导出',
        description: '你的代码已复制到剪贴板，也可以在下方手动复制：',
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
            recommendedDisclaimer: '建议为所有模组选择最新版本。',
            outdatedModsAdvice: '使用过旧的版本可能会导致问题。',
        },
        tags: {
            select: '你必须选择一个版本',
            recommended: '{version} 是推荐版本',
            latest: '{version} 是最新版本',
            outdated: '{version} 是过旧的版本'
        },
        download: '连同依赖一起下载',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: '没有可更新的模组',
            content: '要么所有已安装的模组都是最新的，要么没有安装任何模组。',
            close: '关闭',
        },
        hasModsToUpdate: {
            title: '更新全部已安装的模组',
            content: {
                willBeUpdated: '所有已安装的模组都会被更新到最新版本。',
                missingDependenciesInstalled: '缺失的依赖会被一并安装。',
                whatWillHappen: '以下模组将会被下载并安装：',
                modUpdatedTo: '{modName} 将被更新到：{version}',
            },
            updateAll: '全部更新',
        }
    },
    launchType: {
        title: '设置启动方式',
        auto: {
            NATIVE: '你的游戏将使用「原生」选项启动',
            PROTON: '你的游戏将使用「Proton」选项启动',
        },
        native: {
            unsureWrapperArgsPresent: '我们无法确定所需的包装参数是否已经设置。',
            addArgumentsInfo: '如果你还没有手动完成这一步，请把以下启动参数添加到 Steam 中该游戏的属性里：',
        },
        actions: {
            copyLaunchArgs: '复制启动参数',
            update: '更新'
        }
    },
    modFilter: {
        title: '筛选模组分类',
        languageDisclaimer: '分类由 Thunderstore 提供，无法翻译。',
        selectors: {
            atLeastOneCategory: '模组必须至少包含其中任一分类',
            allCategories: '模组必须包含全部这些分类',
            noneCategories: '模组不能包含其中任何分类'
        },
        allowNsfw: '允许 NSFW（可能含有成人内容）的模组',
        showDeprecated: '显示已弃用的模组',
        apply: '应用筛选'
    },
    sort: {
        title: '更改模组的排序方式',
        sortBehaviour: '排序依据',
        sortDirection: '排序方向',
        close: '关闭',
    },
    createProfile: {
        title: '新建配置档',
        description: '此配置档会独立存放自己的模组，与其他配置档互不影响。',
        tagStates: {
            required: '你必须输入配置档名称',
            valid: '“{profileName}” 是有效的配置档名称',
            error: '“{profileName}” 已被使用，或包含无效字符'
        },
        actions: {
            create: '创建'
        }
    },
    deleteProfile: {
        title: '删除配置档',
        content: {
            resultingAction: '这会移除此配置档内安装的所有模组及其模组配置文件。',
            preventAction: '如果这只是误操作，可以点击变暗的区域，或右上角的叉号。',
            confirmation: '确定要删除此配置档吗？',
        },
        actions: {
            delete: '删除配置档',
        }
    },
    renameProfile: {
        title: '重命名配置档',
        content: '此配置档会独立存放自己的模组，与其他配置档互不影响。',
        actions: {
            rename: '重命名',
        },
        tagStates: {
            required: '你必须输入配置档名称',
            valid: '“{profileName}” 是有效的配置档名称',
            error: '“{profileName}” 已被使用，或包含无效字符'
        },
    },
    importProfile: {
        dialogTitle: '导入配置档',
        dialogButton: '导入',
        states: {
            fileCodeSelection: {
                title: '你想以哪种方式导入配置档？',
                actions: {
                    fromFile: '从文件导入',
                    fromCode: '从代码导入'
                }
            },
            fromFile: {
                title: '正在加载文件',
                content: '将会弹出一个文件选择窗口。选定配置档后可能需要等待片刻。',
            },
            importCode: {
                title: '输入配置档代码',
                enterCodePlaceholder: '输入配置档代码',
                tagStates: {
                    invalid: '代码无效，请检查是否有拼写错误',
                },
                actions: {
                    loading: '正在加载',
                    proceed: '继续'
                }
            },
            refresh: {
                title: '正在刷新在线模组列表',
                content: {
                    description: `
                    配置档中的部分模组包无法被模组管理器识别。
                    刷新在线模组列表也许能解决该问题。请稍候。
                    `,
                    waitingForModDownloads: '正在等待模组下载完成，然后再刷新在线模组列表',
                }
            },
            reviewImport: {
                title: '将要安装的模组包',
                content: {
                    notFoundDisclaimer: '配置档中的这些模组包在 Thunderstore 上找不到，因此不会被安装：',
                    ensureCorrectProfile: '请确认该配置档确实是针对当前所选游戏的。',
                    packagesWillBeInstalled: '以下模组包将会被安装：',
                },
                actions: {
                    acknowledgement: '我明白部分模组将不会被导入',
                    proceed: '导入'
                }
            },
            willImportOrUpdate: {
                title: '你是要更新已有的配置档，还是新建一个？',
                actions: {
                    newProfile: '导入为新配置档',
                    existingProfile: '更新已有配置档',
                }
            },
            addProfile: {
                title: '导入配置档',
                content: {
                    create: {
                        description: '此配置档会独立存放自己的模组，与其他配置档互不影响。'
                    },
                    update: {
                        contentsWillBeOverwritten: '配置档的全部内容都会被代码 / 文件的内容覆盖。',
                        selectProfile: '在下方选择一个配置档：'
                    }
                },
                tagStates: {
                    required: '你必须输入配置档名称',
                    valid: '“{profileName}” 是有效的配置档名称',
                    error: '“{profileName}” 已被使用，或包含无效字符'
                },
                actions: {
                    create: '创建',
                    update: '更新配置档：{profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: '正在下载模组：{progress}%',
                    downloadingModsWithGoal: `正在下载模组：{progress}%（共 {totalSize}）`,
                    cleaningUp: '正在清理',
                    applyChanges: '正在把更改应用到更新后的配置档',
                    copyingModsToProfile: '正在把模组复制到配置档：{progress}%',
                    copyingConfigsToProfile: '正在把模组配置复制到配置档：{progress}%'

                },
                content: {
                    waitMessage: '这一步可能比较耗时，因为需要下载、解压并复制文件。',
                    doNotClose: '请不要关闭 {appName}。'
                }
            }
        }
    },
    platform: {
        header: "你的游戏由哪个平台管理？",
        selectAction: "选择平台",
    },
    settingsLoader: {
        managerProblem: '这是模组管理器本身的问题。如果有更新版本的管理器，请尝试安装。',
        loadFailed: '加载本地用户设置失败。你可以用下方的按钮重置设置，但请注意所有游戏的设置都会丢失，而且此操作无法撤销。',
        resetAction: '重置设置',
        resetFailed: '重置设置失败。你仍然可以按照这些{instructionsLink}手动重置设置。',
        instructionsLinkText: '说明',
        resetDidNotHelp: '本地存储的设置已重置，但这并没有解决设置加载的问题。如果有更新版本的管理器，请尝试安装。'
    },
    actions: {
        close: '关闭',
    },
}

