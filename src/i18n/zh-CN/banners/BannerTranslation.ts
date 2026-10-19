import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: '您有模组已无法在 Thunderstore 上找到。',
        action: '点击此处审查这些模组包。',
    },
    managerUpdate: {
        title: '{appName} 有可用更新。',
        linkText: '点击前往发布页面。',
    },
    modListUpdate: {
        error: '刷新模组列表时出错。',
        viewDetails: '查看错误详情',
        willKeepTrying: '管理器将在后台持续尝试刷新模组列表。',
        errorOccurred: '从 Thunderstore 刷新模组列表时发生错误。',
        blockedByDownloads: '不过，在有模组正在下载时无法刷新模组列表。',
        waitForDownloads: '请等待下载完成后再继续。',
        retryPrompt: '从 Thunderstore 刷新模组列表时发生错误。要{retryAction}吗？',
        retryAction: '立即重试',
    },
    updatableMods: {
        text: `
        有 {numberOfModsWithUpdates} 个模组有可用更新。 |
        有 {numberOfModsWithUpdates} 个模组有可用更新。
        `,
        updateAction: '全部更新？',
    }
}
