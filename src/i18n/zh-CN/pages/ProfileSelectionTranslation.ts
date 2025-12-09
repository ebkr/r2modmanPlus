import {ProfileSelectionMessageFormat} from "../../base/pages/ProfileSelectionMessageFormat";

export const ProfileSelectionTranslation: ProfileSelectionMessageFormat = {
    pageTitle: {
        title: '选择档案',
        subtitle: '档案有助于轻松管理模组'
    },
    actions: {
        backToGameSelection: '返回游戏选择',
        select: '选择',
        rename: '重命名',
        create: '创建',
        import: '导入/更新',
        delete: '删除',
    },
    error: {
        selectProfile: '选择档案时出错',
        updateProfileList: '更新档案列表时出错'
    },
    createProfileModal: {
        title: '创建新档案',
        description: '该档案将独立存储其自己的模组。',
        tagStates: {
            required: '你必须为档案输入一个名称',
            valid: '"{profileName}" 是一个有效的档案名称',
            error: '"{profileName}" 已被使用或包含无效字符'
        },
        actions: {
            create: '创建档案'
        }
    },
    deleteProfileModal: {
        title: '删除档案',
        content: {
            resultingAction: '这将删除该档案中安装的所有模组及其配置文件。',
            preventAction: '若是误操作，请点击右上角的十字关闭。',
            confirmation: '您确定要删除该档案吗？',
        },
        actions: {
            delete: '删除档案',
        }
    },
    renameProfileModal: {
        title: '重命名档案',
        content: '该档案将独立存储其自身模组，与其他配置文件互不影响。',
        actions: {
            rename: '重命名',
        },
        tagStates: {
            required: '你必须为档案输入一个名称',
            valid: '"{profileName}" 是一个有效的档案名称',
            error: '"{profileName}" 已被使用或包含无效字符'
        },
    },
    importProfileModal: {
        states: {
            fileCodeSelection: {
                title: '选择导入档案的方式',
                actions: {
                    fromFile: '从文件',
                    fromCode: '从代码',
                }
            },
            fromFile: {
                title: '正在加载文件',
                content: '将弹出文件选择窗口，选择后需要稍等片刻。',
            },
            importCode: {
                title: '输入档案代码',
                enterCodePlaceholder: '输入档案代码',
                tagStates: {
                    invalid: '档案代码无效',
                },
                actions: {
                    loading: '加载中',
                    proceed: '继续',
                }
            },
            refresh: {
                title: '刷新在线模组列表',
                content: {
                    description: `
                    配置文件中的某些模组包无法被模组管理器识别。
                    刷新在线模组列表可能解决此问题，请稍候。
                    `,
                    waitingForModDownloads: '等待模组下载完成后，再刷新在线模组列表',
                    refreshStatus: {
                        checkingForUpdates: '检查 Thunderstore 的模组列表更新',
                        loadingLatestModList: '从 Thunderstore 加载最新模组列表中： {progress}%',
                        pruneCache: '修剪操作从本地缓存中移除了已安装的模组',
                        processingModList: '加载模组列表',
                        almostDone: '快完成了',
                        resettingCache: '重置模组列表缓存',
                    }
                }
            },
            reviewImport: {
                title: '待安装的模组',
                content: {
                    notFoundDisclaimer: '档案中的这些模组在Thunderstore中未找到，因此不会安装：',
                    ensureCorrectProfile: '确保该档案适用于当前选定的游戏。',
                    packagesWillBeInstalled: '以下模组将被安装：',
                },
                actions: {
                    acknowledgement: '我明白部分模组将无法导入',
                    proceed: '导入'
                }
            },
            willImportOrUpdate: {
                title: '您是要更新现有档案还是创建新档案？',
                actions: {
                    newProfile: '导入新档案',
                    existingProfile: '更新现有档案',
                }
            },
            addProfile: {
                title: '导入档案',
                content: {
                    create: {
                        description: '该档案将独立存储其自身模组，与其他配置文件互不影响'
                    },
                    update: {
                        contentsWillBeOverwritten: '档案中的所有内容都将被 代码/文件 中的内容覆盖。',
                        selectProfile: '请选择以下档案:'
                    }
                },
                tagStates: {
                    required: '你必须为档案输入一个名称',
                    valid: '"{profileName}" 是一个有效的档案名称',
                    error: '"{profileName}" 已被使用或包含无效字符'
                },
                actions: {
                    create: '创建',
                    update: '更新档案: {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: '正在下载模组: {progress}%',
                    downloadingModsWithGoal: `正在下载模组: {progress}% 大小:{totalSize}`,
                    cleaningUp: '清理',
                    applyChanges: '将更改应用于更新的档案',
                    copyingModsToProfile: '正在将模组复制到档案: {progress}%',
                    copyingConfigsToProfile: '正在将配置复制到档案: {progress}%'

                },
                content: {
                    waitMessage: '这可能需要一段时间，因为文件正在下载、解压和复制。',
                    doNotClose: '请勿关闭 {appName}.'
                }
            }
        }
    }
}
