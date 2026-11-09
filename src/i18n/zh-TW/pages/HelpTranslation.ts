import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: '說明',
        subtitle: '常見問題及解決方案'
    },
    tabs: {
        general: '一般',
        gameWontStart: '遊戲無法啟動',
        modsNotShowing: '模組未啟用',
        updating: '更新',
    },
    general: {
        gettingStarted: {
            title: '開始安裝模組',
            whereToFindMods: `
            前往「{''}@:translations.pages.manager.navigation.modsActions.online{''}」分頁，找到想要的模組並下載。
            管理器會同時下載相依模組，節省您的時間。
            `,
            onceInstalled: '安裝完所需的模組後，只需點選左上角的 {startModdedAction} 即可啟動',
        },
        slowGame: {
            title: '使用模組時遊戲執行緩慢/卡頓？',
            likelyCause: `
            這可能是某個模組出現問題導致。
            請先停用一半的模組，再檢查問題是否仍然存在。
            `,
            issuePersisting: `
            如果問題仍然存在，請再停用剩餘模組的一半。
            重複此步驟，直到問題解決。
            `,
            ifStutters: '針對卡頓問題，或許有最佳化模組能改善這種情況。',
        },
        dedicatedServers: {
            title: '專用伺服器',
            content: `
            管理器尚未直接支援專用伺服器，但您可以將設定檔資料夾的內容複製到專用伺服器資料夾中。
            `,
        },
        launchingExternally: {
            title: '從模組管理器外部啟動遊戲',
            howTo: '透過 Steam 啟動遊戲時，遊戲預設會以未安裝模組的原版模式執行。',
            whereToPlace: '您需要將對應的啟動參數填入遊戲平台的啟動選項中。',
            forSteam: '在 Steam 中，這個選項位於遊戲的內容設定中。',
            yourCurrentArgument: '您目前的啟動參數是：',
            loaderNotInstalled: '這些參數將在安裝模組載入器後可用。',
            copyArguments: '複製啟動參數',
        },
    },
    gameWontStart: {
        errorModal: {
            title: '當我嘗試啟動遊戲時，出現紅色方框。',
            solution: '紅色框的底部通常會提供一個建議，這可能有助於解決問題。',
        },
        redirectedToStorePage: {
            title: '啟動後開啟了遊戲的 Steam 商店頁面',
            solution: '使用 {appName} 時，您必須擁有正版遊戲。您可以在商店頁面購買。',
        },
        consoleCloses: {
            title: '一個文字視窗出現並立即關閉',
            tryRunning: '請嘗試在設定頁面執行「重置 {gameName} 安裝」。', // TODO - Reference translation via Settings screen
            ifPersists: '若問題仍然存在，請強制結束 Steam，並在關閉 Steam 的情況下啟動模組版。',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: '潛在解決方案',
            instructToWiki: '最常見的問題都可以透過確實依照 wiki 中的說明操作來解決。',
            goToWiki: '前往 wiki',
        }
    },
    updating: {
        autoUpdates: {
            title: '自動更新',
            whenDoesItUpdate: '若有可用更新，管理器將在關閉時自動更新。',
            downloadedInBackground: '更新將在背景進行下載。',
            promptToRunOldInstaller: '您可能會被要求以系統管理員身分執行 "{oldInstaller}"。這是更新程式。',
            ifProblemOccurs: '如果更新過程中出現問題，請下載並執行最新的安裝程式。',
        },
        ignoreUpdates: {
            title: '我不想要更新',
            content: 'GitHub 上有一個可攜版，它不會自動更新。不過當有更新可用時，系統會提示您。'
        }
    }
}
