import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: '正在啟動 {appName}',
    gameUpdatesWarning: '遊戲更新可能導致模組失效。若新版本已釋出，請耐心等待。',
    menu: {
        helpLabel: '說明',
        helpItems: {
            about: '關於',
            faq: '常見問題'
        },
    },
    actions: {
        goBack: '返回',
    },
    content: {
        main: {
            didYouKnow: '您知道嗎？',
            externalInstallWithModManager: `
                            您可以在 Thunderstore 上使用「Install with Mod Manager」按鈕，
                            透過 {appName} 安裝模組。
                        `,
            goToThunderstore: '前往 Thunderstore',
            exportProfile: `
                        您可以在設定頁面將選定的設定檔匯出為檔案或代碼。
                        這讓您能輕鬆與朋友分享您的模組清單！
                        `,
            havingTrouble: {
                title: '遇到麻煩了嗎？',
                body: '請將錯誤截圖傳送至 {appName} Discord 伺服器的支援頻道。',
                serverLinkText: '加入 {appName} Discord 伺服器',
            },
        },
        about: {
            title: '關於 {appName}',
            creator: '它由 Ebkr 建立。',
            techStack: {
                builtUsing: '此應用程式使用 Quasar 建置，採用以下技術：',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: '常見問題',
            howToGetStarted: {
                title: '我該如何開始？',
                body: '前往「線上」分頁下載喜歡的模組。點選「啟動模組版」即可暢玩。'
            },
            startingWithMods: {
                title: '啟動啟用模組的遊戲',
                body: `
                            您必須在管理器內啟動遊戲。
                            若不進行手動修改，透過 Steam 啟動將不能啟用模組。
                            `
            }
        }
    },
    states: {
        preparing: '準備中',
        checkingForUpdates: '檢查更新',
        checkingForLocalCache: '正在檢查本機模組清單快取',
        checkingForThunderstoreUpdates: '正在檢查 Thunderstore 的模組清單更新',
        loadingLatestThunderstoreList: '正在從 Thunderstore 載入最新模組清單',
        pruningLocalCache: '正在從本機快取中清理已移除的模組',
        processingModList: '正在處理模組清單',
    }
}
