import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: '你有部分模组已无法在 Thunderstore 上找到。',
        action: '点击此处查看这些模组包。',
    },
    managerUpdate: {
        title: '有可用的 {appName} 更新。',
        linkText: '点击此处前往发行页面。',
    },
    modListUpdate: {
        error: '刷新模组列表时出错。',
        viewDetails: '查看错误详情',
        willKeepTrying: '管理器会在后台持续尝试刷新模组列表。',
        errorOccurred: '从 Thunderstore 刷新模组列表时发生错误。',
        blockedByDownloads: '不过在模组下载进行期间无法刷新模组列表。',
        waitForDownloads: '请等待下载完成后再继续。',
        retryPrompt: '从 Thunderstore 刷新模组列表时发生错误。要{retryAction}吗？',
        retryAction: '立即重试',
    },
    updatableMods: {
        text: `
        有 {numberOfModsWithUpdates} 个模组可以更新。 |
        共有 {numberOfModsWithUpdates} 个模组可以更新。
        `,
        updateAction: '全部更新？',
    }
}

