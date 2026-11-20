import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: '您有模組已無法在 Thunderstore 上找到。',
        action: '點選此處審查這些模組包。',
    },
    managerUpdate: {
        title: '{appName} 有可用更新。',
        linkText: '點選前往釋出頁面。',
    },
    modListUpdate: {
        error: '重新整理模組清單時出錯。',
        viewDetails: '檢視錯誤詳情',
        willKeepTrying: '管理器將在背景持續嘗試重新整理模組清單。',
        errorOccurred: '從 Thunderstore 重新整理模組清單時發生錯誤。',
        blockedByDownloads: '不過，在有模組正在下載時無法重新整理模組清單。',
        waitForDownloads: '請等待下載完成後再繼續。',
        retryPrompt: '從 Thunderstore 重新整理模組清單時發生錯誤。要{retryAction}嗎？',
        retryAction: '立即重試',
    },
    updatableMods: {
        text: `
        有 {numberOfModsWithUpdates} 個模組有可用更新。 |
        有 {numberOfModsWithUpdates} 個模組有可用更新。
        `,
        updateAction: '全部更新？',
    }
}
