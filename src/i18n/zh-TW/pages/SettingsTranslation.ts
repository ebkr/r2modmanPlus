import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: '設定',
        subtitle: '{appName} 進階選項：{version}',
    },
    nav: {
        label: '區段',
        categories: {
            all: '全部',
            directories: '目錄',
            profile: '設定檔',
            appearance: '外觀',
            debugging: '除錯',
            modpacks: '模組包',
            other: '其他',
        }
    },
    search: {
        label: '搜尋',
        placeholder: '搜尋設定項',
    },
    actions: {
        change: '更改',
        browse: '瀏覽',
        notSet: '未設定',
    },
    entries: {
        changeLaunchBehaviour: {
            title: '更改啟動行為',
            description: '選擇遊戲的啟動方式，指定使用原生（Native）模式或 Proton。',
            current: '目前啟動行為設定為：',
            searchTerms: [
                '更改啟動行為',
                '設定啟動模式',
                'Proton',
                '原生',
                '自動',
            ],
        },
        cleanOnlineModListCache: {
            title: '清理線上模組清單快取',
            description: '刪除模組清單的本機副本並重新取得。',
            action: '清理線上模組清單',
            searchTerms: [
                '清理線上模組清單快取',
                '重置',
            ],
        },
        copyLogToClipboard: {
            title: '複製記錄到剪貼簿',
            description: '將記錄檔內容複製到剪貼簿，並保留 Discord 格式。',
            searchTerms: [
                '複製記錄檔內容到剪貼簿',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
                '記錄',
            ],
        },
        copyTroubleshooting: {
            title: '複製疑難排解資訊到剪貼簿',
            description: '將設定及其他資訊複製到剪貼簿，並保留 Discord 格式。請求支援時請分享此資訊。',
            searchTerms: [
                '複製疑難排解資訊到剪貼簿',
                'Discord',
                '支援',
                '系統',
                '疑難排解',
            ],
        },
        dataDirectory: {
            title: '資料與設定檔資料夾',
            description: '存放所有遊戲和設定檔模組的資料夾。',
            warning: '更改資料資料夾不會移動或刪除現有設定檔，但它們仍會保留在舊的資料夾中。',
            dataFolder: '資料資料夾',
            profileFolder: '設定檔資料夾',
            dialog: {
                title: '選擇用於儲存 {appName} 資料的新資料夾',
                button: '選擇資料資料夾',
            },
            searchTerms: [
                '資料與設定檔目錄',
                '更改',
                '瀏覽',
                '資料夾',
                '目錄',
            ],
        },
        downloadCache: {
            title: '下載快取',
            description: '啟用後，如果快取中已有相同副本，將跳過重複下載。',
            enabled: '已啟用（推薦）',
            disabled: '已停用',
            searchTerms: [
                '切換下載快取',
                '下載快取',
                '切換',
            ],
        },
        expandCards: {
            title: '預設展開卡片',
            description: '開啟模組清單時，預設完整展開模組卡片而不是收合顯示。',
            expanded: '展開',
            collapsed: '收合',
            searchTerms: [
                '預設展開卡片',
                '切換',
                '收合',
                '展開',
            ],
        },
        exportProfile: {
            title: '匯出設定檔',
            description: '匯出您的模組清單和設定，與朋友分享，快速輕鬆地獲得完全一致的設定。',
            asFile: '匯出為檔案',
            asCode: '匯出為代碼',
            dialog: {
                title: '選擇匯出設定檔的目標資料夾',
                button: '選擇匯出資料夾',
            },
            searchTerms: [
                '匯出設定檔',
                '匯出為檔案',
                '匯出為代碼',
            ],
        },
        funkyMode: {
            title: '啟用趣味模式',
            description: '就是趣味模式。',
            enabled: '已啟用',
            disabled: '已停用',
            searchTerms: [
                '啟用趣味模式',
                '切換',
                '停用'
            ],
        },
        gameDirectory: {
            title: '{gameName} 資料夾',
            description: '需要正確設定遊戲目錄，才能將相應檔案放置到位。',
            warning: '如果設定不當，{gameName} 將以未安裝模組的狀態啟動。',
            unsure: '我不確定應該選擇哪個',
            searchTerms: [
                '{gameName} 資料夾',
                '更改',
                '瀏覽',
                '遊戲',
                '目錄',
            ],
        },
        importLocalMod: {
            title: '匯入本機模組',
            description: '從本機檔案離線安裝模組。並非所有模組都能以本機方式安裝。',
            searchTerms: [
                '匯入本機模組',
                '離線安裝',
                '匯入',
            ],
        },
        launchArguments: {
            title: '啟動參數',
            description: '提供啟動遊戲時附加的自訂參數。',
            action: '設定啟動參數',
            searchTerms: [
                '設定自訂啟動參數',
                '啟動參數',
            ],
        },
        modCache: {
            title: '模組快取',
            description: '下載的模組會保留在快取中，無需重複下載。',
            stillWritten: '模組仍會寫入快取並繼續佔用磁碟空間。',
            action: '清理快取',
            actionDescription: '移除不在任何設定檔中的快取模組以釋放儲存空間。',
            enabled: '已啟用',
            disabled: '已停用',
            enabledHint: '重複使用快取的下載（推薦）',
            disabledHint: '下載模組時忽略快取，每次都會重新下載。',
            searchTerms: [
                '模組快取',
                '下載',
                '重複使用快取的下載',
                '切換',
                '清理模組快取',
                '釋放空間',
                '清除',
                '儲存',
            ],
        },
        modState: {
            title: '更改模組狀態',
            description: '啟用 / 停用設定檔中的所有模組。',
            enableAll: '啟用所有模組',
            disableAll: '停用所有模組',
            allEnabled: '目前所有模組均已啟用。',
            allDisabled: '目前所有模組均已停用。',
            someDisabled: '您停用了 1 個模組。 | 您停用了 {count} 個模組。',
            searchTerms: [
                '更改模組狀態',
                '切換',
                '啟用所有模組',
                '停用所有模組',
            ],
        },
        onlineModList: {
            title: '線上模組清單',
            description: '檢查是否有新發布的模組，或清除本機副本。',
            refresh: '重新整理',
            deleteCopy: '刪除副本',
            states: {
                refreshing: '正在重新整理……',
                error: '重新整理模組清單時出錯：{message}',
                disabledWhileDownloading: '有正在進行的下載時，無法重新整理模組清單。',
                lastUpdated: '最後更新於：{date}',
                noApiInfo: '沒有可用的 API 資訊',
            },
            searchTerms: [
                '重新整理線上模組清單',
                '檢查新模組釋出',
                '清理線上模組清單快取',
                '重置模組清單快取',
            ],
        },
        refreshOnlineModList: {
            title: '重新整理線上模組清單',
            description: '檢查是否有新發布的模組。{status}',
            action: '重新整理',
            states: {
                refreshing: '正在重新整理……',
                error: '重新整理模組清單時出錯：{message}',
                disabledWhileDownloading: '有正在進行的下載時，無法重新整理模組清單。',
                cacheDate: '快取日期：{date}',
                noApiInfo: '沒有可用的 API 資訊',
            },
            searchTerms: [
                '重新整理線上模組清單',
                '檢查新模組釋出',
                'Thunderstore 模組',
            ],
        },
        resetGameInstallation: {
            title: '重置 {gameName} 安裝',
            description: '修復檔案損壞，或手動安裝模組後殘留檔案所造成的問題。這將刪除 {folderName} 資料夾中的所有內容，並透過 Steam 驗證檔案完整性。',
            action: '重置安裝',
            searchTerms: [
                '重置 {gameName} 安裝',
                '校驗檔案',
                '驗證完整性',
                '損壞',
                '檔案',
            ],
        },
        showDependencyStrings: {
            title: '顯示相依套件字串',
            description: '檢視已安裝模組及其版本字串的清單，即 manifest.json 檔案 dependencies 陣列中使用的格式。顯示 {modCount} 個模組的相依套件字串。',
            searchTerms: [
                '顯示相依套件字串',
            ],
        },
        steamDirectory: {
            title: 'Steam 資料夾',
            description: '包含 Steam 執行檔的 Steam 資料夾。',
            value: '{appName} 將透過它啟動遊戲。',
            searchTerms: [
                '更改 Steam 資料夾',
                '更改 Steam 目錄',
                '瀏覽',
                '目錄',
            ],
        },
        theme: {
            title: '主題',
            description: '在管理器的淺色和深色外觀之間選擇。',
            light: '淺色',
            dark: '深色',
            searchTerms: [
                '主題',
                '淺色',
                '深色',
                '外觀',
            ],
        },
        toggleCdn: {
            title: '切換首選 Thunderstore CDN',
            description: '切換 CDN，直到應用程式重新啟動為止。這可能有助於解決下載模組時遇到的問題。',
            action: '切換首選 CDN',
            current: '目前：{label}',
            searchTerms: [
                '切換首選 Thunderstore CDN',
                '更改',
            ],
        },
        updateAllMods: {
            title: '更新所有模組',
            description: '快速將所有已安裝的模組更新到最新版本。{status}',
            status: '1 個模組有可用更新。 | {count} 個模組有可用更新。',
            searchTerms: [
                '更新所有模組',
            ],
        },
    }
};
