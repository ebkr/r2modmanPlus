import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: '啟動模組版',
            startVanilla: '啟動原版'
        },
        modsActions: {
            label: '模組',
            installed: '已安裝',
            online: '線上'
        },
        otherActions: {
            label: '其他',
            configEditor: '設定編輯器',
            settings: '設定',
            help: '說明',
        },
        profileSwitcher: {
            label: '設定檔',
            gameIconAltText: '遊戲圖示',
            close: '關閉',
        },
        activityBar: {
            exportProfile: '匯出設定檔',
            exportToCode: '匯出為代碼',
            exportToFile: '匯出為檔案',
            refreshingModList: '正在重新整理模組清單：{progress}%',
        }
    },
    installed: {
        noModsInstalled: {
            title: '您似乎沒有安裝任何模組',
            content: '您可以點選左側的「線上」分頁瀏覽所有可用模組。',
        },
        searchAndSort: {
            search: {
                label: '搜尋',
                placeholder: '搜尋已安裝的模組',
            },
            sort: {
                label: '排序',
                disabledPositions: {
                    label: '停用',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: '已棄用',
                disabled: '已停用'
            },
            display: {
                byline: 'v{version} 作者：{author}',
                installedAt: '安裝於：{formattedDate}',
                releasedAt: '釋出於：{formattedDate}',
            },
            concerning: {
                recommendation: '建議您移除此模組。',
            },
            tooltips: {
                updateAvailable: '有可用更新',
                dependencyIssue: '此模組的相依性存在問題',
                disable: '停用',
                enable: '啟用',
                donate: '贊助模組作者',
                willNotBeUsed: '此模組在遊戲中不會被啟用',
            },
            actions: {
                uninstall: '解除安裝',
                disable: '停用',
                enable: '啟用',
                associated: '關聯',
                openWebsite: '網站',
                update: '更新',
                downloadDependency: '下載相依模組',
                enableSpecific: '啟用 {dependencyName}',
                donate: '贊助',
            }
        },
        expandableCard: {
            imageAltText: '模組圖片',
            funkyModeAltText: '趣味模式遮罩',
            tooltips: {
                dragToReorder: '拖曳以重新排序',
                expand: '展開',
                collapse: '收合',
            }
        },
    },
    online: {
        previewPanel: {
            author: '作者：{author}',
            metadata: {
                downloads: '下載量：{downloads}',
                likes: '按讚數：{likes}',
                lastUpdated: '最後更新：{date}',
                categories: '類別：{categories}',
            },
            actions: {
                download: '下載',
                viewOnline: '線上檢視',
                donate: '贊助',
            },
            tabs: {
                readme: 'README',
                changelog: '更新紀錄',
                dependencies: '相依模組（{dependencyCount}）',
            },
            packageInformation: '模組包資訊',
            nsfwWarning: '此模組可能包含露骨內容',
            fetchingData: '正在取得資料',
            noDependencies: '此模組不需要其他相依模組',
            unableToFetchReadme: '無法取得 README',
            unableToFetchChangelog: '無法取得更新紀錄',
        },
        topbar: {
            search: {
                label: '搜尋',
                placeholder: '搜尋模組',
            },
            sort: '排序',
            filter: '篩選',
        },
        pagination: {
            changePageInfo: '使用下方數字切換頁面',
            noFoundMods: '未找到符合搜尋條件的模組',
            noMods: '沒有可用模組',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: '已置頂',
                    long: '在 Thunderstore 上置頂'
                },
                deprecated: {
                    short: '已棄用',
                    long: '此模組可能已無法使用'
                },
                donate: '贊助模組作者',
                installed: '模組已安裝',
                nsfw: '被標記為 NSFW 的模組',
            },
            mod: {
                author: '作者：{author}'
            },
            actions: {
                download: '下載',
                website: '網站',
            }
        }
    },
    actions: {
        locateGameExecutable: '尋找 {gameName} 執行檔',
        selectExecutable: '選擇執行檔',
        locateGameLaunchHelper: '尋找遊戲啟動輔助程式',
        locateSteamExecutable: '尋找 Steam 執行檔',
    }
}
