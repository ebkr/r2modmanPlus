import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'Artık Thunderstore\'da bulunamayan modlarınız var.',
        action: 'Paketleri incelemek için buraya tıklayın.',
    },
    managerUpdate: {
        title: 'Yeni bir {appName} güncellemesi mevcut.',
        linkText: 'Sürüm sayfasına gitmek için buraya tıklayın.',
    },
    modListUpdate: {
        error: 'Mod listesi yenilenirken hata oluştu.',
        viewDetails: 'Hata ayrıntılarını görüntüle',
        willKeepTrying: 'Yönetici, mod listesini arka planda yenilemeye çalışmaya devam edecek.',
        errorOccurred: 'Mod listesi Thunderstore\'dan yenilenirken bir hata oluştu.',
        blockedByDownloads: 'Ancak devam eden mod indirmeleri varken mod listesi yenilenemez.',
        waitForDownloads: 'Devam etmeden önce lütfen indirmelerin bitmesini bekleyin.',
        retryPrompt: 'Mod listesi Thunderstore\'dan yenilenirken bir hata oluştu. {retryAction} ister misiniz?',
        retryAction: 'şimdi tekrar denemek',
    },
    updatableMods: {
        text: `
        Güncellemesi bulunan {numberOfModsWithUpdates} modunuz var. |
        Güncellemesi bulunan {numberOfModsWithUpdates} modunuz var.
        `,
        updateAction: 'Hepsi güncellensin mi?',
    }
}
