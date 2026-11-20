import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: '無法設定 Steam 資料夾',
        steamExecutableNotSelected: '未選擇 Steam 執行檔。',
        solution: '如果執行檔正確但仍出現此錯誤，請嘗試以系統管理員身分執行。'
    },
    failedToSetTheGameFolder: {
        title: '無法設定 {gameName} 資料夾',
        listedExecutableNames: '執行檔必須是以下之一："{options}"。',
        executableMustBeOneOf: '所選的執行檔必須是以下之一：',
        solution: '如果執行檔正確但仍出現此錯誤，請嘗試以系統管理員身分執行。'
    },
    clearingGameDirectory: {
        title: '清理 {gameName} 安裝目錄',
        warning: '這將刪除遊戲目錄中的所有檔案。',
        steamWillBeStarted: `
            這將刪除遊戲目錄，並提示 Steam 驗證 {gameName} 的檔案完整性。
            `,
        checkSteamForProgress: `
            請在 Steam 視窗中檢視驗證進度。
            如果視窗尚未出現，請耐心等待。
            `,
        confirmation: '我明白了'
    },
    dependencyStrings: {
        title: '相依套件字串清單',
        dependency: '{modName}-{versionNumber}',
        close: '關閉'
    },
    launchArguments: {
        title: '設定自訂啟動參數',
        someProvidedByDefault: '某些參數是預設提供的：',
        moddedLabel: '模組模式：',
        availableAfterInstallingLoader: '這些參數將在安裝模組載入器後可用。',
        vanillaLabel: '原版模式：',
        pleaseNote: `
            請注意，這些參數是針對 Steam 執行檔執行的。
            輸入自訂啟動參數時請務必謹慎。
            `,
        placeholder: '輸入參數',
        updateArguments: '更新啟動參數',
    },
    categorySelector: {
        selectCategory: '選擇類別',
        noCategoriesSelected: '未選擇任何類別',
    },
    importLocalMod: {
        title: '從檔案匯入模組',
        dialogTitle: '從檔案匯入本機模組',
        actions: {
            selectFile: '選擇檔案',
            importLocalMod: '匯入本機模組',
        },
        content: {
            instructToSelect: '請選擇要匯入的 zip 壓縮檔或 DLL 檔案。',
            dataEntryInfo: `
            包含清單檔案的壓縮檔會自動預填部分資訊。
            如果沒有清單檔案，則需要手動輸入。
            `,
            waitingForSelection: '正在等待檔案。這可能需要一分鐘。',
            form: {
                modName: {
                    label: '模組名稱',
                    placeholder: '輸入模組名稱',
                },
                modAuthor: {
                    label: '作者',
                    placeholder: '輸入作者名稱',
                },
                description: {
                    label: '描述（可選）',
                    placeholder: '輸入描述'
                },
                version: {
                    label: '版本',
                    majorLabel: '主版本',
                    minorLabel: '次版本',
                    patchLabel: '修訂號'
                }
            }
        },
        validationMessages: {
            modNameEmpty: '模組名稱不能為空。',
            authorNameEmpty: '模組作者不能為空。',
            invalidVersion: '主版本、次版本和修訂號必須是大於 0 的整數。',
            nonNumericVersion: '主版本、次版本和修訂號必須是數字。',
            noProfileSelected: '未選擇設定檔。'
        }
    },
    concerningPackage: {
        title: '審查 {modName}',
        notFound: '此模組最初下載自 Thunderstore，但現在已無法在該網站上找到。',
        whyRemoved: '模組可能因作者要求、違反規則，或正在接受審核而被移除。',
        recommendation: '一般建議移除已從 Thunderstore 下架的模組。',
        exportWarning: '其他人將無法從匯出的設定檔中匯入此模組。',
        actions: {
            markSafe: '標記此版本為安全',
            remove: '移除模組',
            review: '審查模組',
        }
    },
    gameRunning: {
        starting: '{gameName} 正在啟動',
        launchingViaSteam: '{gameName} 正在透過 Steam 啟動',
        closeToContinue: '關閉此訊息以繼續操作。',
        takingAWhile: '如果啟動耗時較長，很可能是因為 Steam 正在啟動。',
        bePatient: '請耐心等待，祝您玩得開心！',
        close: '關閉',
    },
    error: {
        title: '錯誤',
        suggestion: '建議',
        close: '關閉',
    },
    disableMod: {
        title: '正在停用 {modName}',
        dependantsWarning: '其他模組需要此模組才能運作。選擇{disableAllAction}以一併停用需要它的模組，否則它們可能會引發錯誤。',
        modsToBeDisabled: '將要停用的模組',
        actions: {
            disableAll: '全部停用',
            disableAllRecommended: '全部停用（推薦）',
            disableOnly: '僅停用 {modName}',
        }
    },
    uninstallMod: {
        title: '正在解除安裝 {modName}',
        dependantsWarning: '其他模組需要此模組才能運作。選擇{uninstallAllAction}以一併解除安裝需要它的模組，否則它們可能會引發錯誤。',
        modsToBeUninstalled: '將要解除安裝的模組',
        actions: {
            uninstallAll: '全部解除安裝',
            uninstallAllRecommended: '全部解除安裝（推薦）',
            uninstallOnly: '僅解除安裝 {modName}',
        }
    },
    associatedMods: {
        title: '與 {modName} 關聯的模組',
        dependencies: '此模組需要的模組',
        dependants: '依賴此模組的模組',
        none: '此模組沒有相依模組，也沒有其他模組依賴它。',
        done: '完成',
    },
    codeExport: {
        title: '設定檔已匯出',
        description: '您的代碼已複製到剪貼簿，您也可以在下方手動複製：',
        done: '完成',
        copied: '已複製到剪貼簿',
    },
    downloadProgress: {
        states: {
            downloading: '正在下載 {modName}',
            installing: '正在安裝 {modName}',
        },
        complete: '下載完成',
        close: '關閉',
        downloadProgress: '正在下載：{progress}%（共 {totalSize}）',
        installProgress: '正在安裝：{progress}%',
        extractionProgress: '正在解壓縮：{progress}%（共 {totalSize}）',
        waitingForDownload: '正在安裝：等待下載完成',
    },
    downloadModVersionSelect: {
        title: '選擇要下載的 {modName} 版本',
        content: {
            recommendedDisclaimer: '建議選擇所有模組的最新版本。',
            outdatedModsAdvice: '使用過舊的版本可能會導致問題。',
        },
        tags: {
            select: '您必須選擇一個版本',
            recommended: '{version} 是推薦版本',
            latest: '{version} 是最新版本',
            outdated: '{version} 是過時的版本'
        },
        download: '連同相依模組一起下載',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: '沒有可更新的模組',
            content: '所有已安裝的模組均為最新版本，或者尚未安裝任何模組。',
            close: '關閉',
        },
        hasModsToUpdate: {
            title: '更新所有已安裝的模組',
            content: {
                willBeUpdated: '所有已安裝的模組都將更新到最新版本。',
                missingDependenciesInstalled: '缺少的相依模組將被安裝。',
                whatWillHappen: '以下模組將被下載並安裝：',
                modUpdatedTo: '{modName} 將更新到：{version}',
            },
            updateAll: '全部更新',
        }
    },
    launchType: {
        title: '設定啟動方式',
        auto: {
            NATIVE: '您的遊戲將使用"原生（Native）"方式啟動',
            PROTON: '您的遊戲將使用"Proton"方式啟動',
        },
        native: {
            unsureWrapperArgsPresent: '我們無法確定所需的封裝器參數是否已設定。',
            addArgumentsInfo: '如果您尚未手動設定，請在 Steam 遊戲內容設定中新增以下啟動參數：',
        },
        actions: {
            copyLaunchArgs: '複製啟動參數',
            update: '更新'
        }
    },
    modFilter: {
        title: '篩選模組類別',
        languageDisclaimer: '類別由 Thunderstore 提供，無法翻譯。',
        selectors: {
            atLeastOneCategory: '模組必須包含這些類別中的至少一個',
            allCategories: '模組必須包含所有這些類別',
            noneCategories: '模組不能包含這些類別中的任何一個'
        },
        allowNsfw: '允許 NSFW（可能含露骨內容）的模組',
        showDeprecated: '顯示已棄用的模組',
        apply: '套用篩選'
    },
    sort: {
        title: '更改模組排序',
        sortBehaviour: '排序方式',
        sortDirection: '排序方向',
        close: '關閉',
    },
    createProfile: {
        title: '建立設定檔',
        description: '此設定檔將獨立於其他設定檔儲存自己的模組。',
        tagStates: {
            required: '您必須輸入設定檔名稱',
            valid: '"{profileName}" 是有效的設定檔名稱',
            error: '"{profileName}" 已被使用或包含無效字元'
        },
        actions: {
            create: '建立'
        }
    },
    deleteProfile: {
        title: '刪除設定檔',
        content: {
            resultingAction: '這將移除此設定檔中安裝的所有模組及其組態檔。',
            preventAction: '如果您不想刪除，請點選暗色背景區域或右上角的關閉按鈕。',
            confirmation: '您確定要刪除此設定檔嗎？',
        },
        actions: {
            delete: '刪除設定檔',
        }
    },
    renameProfile: {
        title: '重新命名設定檔',
        content: '此設定檔將獨立於其他設定檔儲存自己的模組。',
        actions: {
            rename: '重新命名',
        },
        tagStates: {
            required: '您必須輸入設定檔名稱',
            valid: '"{profileName}" 是有效的設定檔名稱',
            error: '"{profileName}" 已被使用或包含無效字元'
        },
    },
    importProfile: {
        dialogTitle: '匯入設定檔',
        dialogButton: '匯入',
        states: {
            fileCodeSelection: {
                title: '您想以哪種方式匯入設定檔？',
                actions: {
                    fromFile: '從檔案',
                    fromCode: '從代碼'
                }
            },
            fromFile: {
                title: '正在載入檔案',
                content: '將彈出檔案選擇視窗。選擇設定檔後可能需要一些時間。',
            },
            importCode: {
                title: '輸入設定檔代碼',
                enterCodePlaceholder: '輸入設定檔代碼',
                tagStates: {
                    invalid: '代碼無效，請檢查是否有輸入錯誤',
                },
                actions: {
                    loading: '載入中',
                    proceed: '繼續'
                }
            },
            refresh: {
                title: '正在重新整理線上模組清單',
                content: {
                    description: `
                    設定檔中的某些模組包無法被模組管理器識別。
                    重新整理線上模組清單可能會解決此問題。請稍候。
                    `,
                    waitingForModDownloads: '正在等待模組下載完成，隨後重新整理線上模組清單',
                }
            },
            reviewImport: {
                title: '將要安裝的模組包',
                content: {
                    notFoundDisclaimer: '設定檔中的這些模組包在 Thunderstore 上未找到，將不會被安裝：',
                    ensureCorrectProfile: '請確保此設定檔適用於目前選擇的遊戲。',
                    packagesWillBeInstalled: '這些模組包將被安裝：',
                },
                actions: {
                    acknowledgement: '我了解部分模組將不會被匯入',
                    proceed: '匯入'
                }
            },
            willImportOrUpdate: {
                title: '您要更新現有設定檔，還是建立新設定檔？',
                actions: {
                    newProfile: '匯入為新設定檔',
                    existingProfile: '更新現有設定檔',
                }
            },
            addProfile: {
                title: '匯入設定檔',
                content: {
                    create: {
                        description: '此設定檔將獨立於其他設定檔儲存自己的模組。'
                    },
                    update: {
                        contentsWillBeOverwritten: '設定檔中的全部內容都將被代碼/檔案中的內容覆蓋。',
                        selectProfile: '在下方選擇一個設定檔：'
                    }
                },
                tagStates: {
                    required: '您必須輸入設定檔名稱',
                    valid: '"{profileName}" 是有效的設定檔名稱',
                    error: '"{profileName}" 已被使用或包含無效字元'
                },
                actions: {
                    create: '建立',
                    update: '更新設定檔：{profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: '正在下載模組：{progress}%',
                    downloadingModsWithGoal: '正在下載模組：{progress}%（共 {totalSize}）',
                    cleaningUp: '正在清理',
                    applyChanges: '正在將變更套用到已更新的設定檔',
                    copyingModsToProfile: '正在將模組複製到設定檔：{progress}%',
                    copyingConfigsToProfile: '正在將設定複製到設定檔：{progress}%'
                },
                content: {
                    waitMessage: '這可能需要一段時間，因為檔案正在下載、解壓縮和複製。',
                    doNotClose: '請勿關閉 {appName}。'
                }
            }
        }
    },
    platform: {
        header: '哪個商店管理著您的遊戲？',
        selectAction: '選擇平台',
    },
    settingsLoader: {
        managerProblem: '這是模組管理器本身的問題。如果有更新版本的管理器可用，請嘗試安裝。',
        loadFailed: '載入本機使用者設定失敗。您可以使用下方的按鈕重置設定，但請注意，所有遊戲的全部設定都將遺失，且此操作無法復原。',
        resetAction: '重置設定',
        resetFailed: '重置設定失敗。您仍可以按照這些{instructionsLink}嘗試手動重置設定。',
        instructionsLinkText: '說明',
        resetDidNotHelp: '本機儲存的設定已重置，但仍未能解決載入設定的問題。如果有更新版本的管理器可用，請嘗試安裝。'
    },
    actions: {
        close: '關閉',
    },
}
