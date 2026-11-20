import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'Thunderstore上で削除された(又は非公開になった)Modがインストールされてます。',
        action: '削除されたModを確認する',
    },
    managerUpdate: {
        title: '{appName}のアップデートが可能です。',
        linkText: 'リリースページを確認する',
    },
    modListUpdate: {
        error: 'Modリストを更新する際にエラーが発生しました。',
        viewDetails: 'エラー情報を表示',
        willKeepTrying: 'Modリストを更新回数が多すぎます。しばらくしてから再度更新してください。',
        errorOccurred: 'Thunderstore内のModリストを更新する際にエラーが発生しました。',
        blockedByDownloads: 'Modをダウンロードしてる間はModリストを更新することが出来ません。',
        waitForDownloads: 'ダウンロードが完了するまでしばらくお待ちください。',
        retryPrompt: 'Thunderstore内のModリストを更新する際にエラーが発生しました。 {retryAction}しますか？',
        retryAction: '再実行',
    },
    updatableMods: {
        text: `
        アップデートが可能なModが{numberOfModsWithUpdates}件あります。 |
        アップデートが可能なModが{numberOfModsWithUpdates}件あります。 
        `,
        updateAction: '全てアップデートする',
    }
}
