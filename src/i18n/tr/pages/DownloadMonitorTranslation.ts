import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: 'İndirmeler',
        subtitle: 'İndirmelerin ilerleyişini takip edin'
    },
    actions: {
        retry: 'Tekrar dene',
        remove: 'Kaldır'
    },
    state: {
        hasNothing: {
            inform: `Şu anda indirilen bir şey yok`,
            action: 'Bir şey indirmek için buraya tıklayın'
        },
        hasContent: {
            action: 'Bitenleri temizle',
            downloadFailed: 'İndirme başarısız oldu',
            downloadComplete: 'İndirme tamamlandı'
        },
        modProgress: {
            downloading: 'İndiriliyor: {modName}',
            extracting: 'Ayıklanıyor: {modName}',
            progress: '{totalSize} boyutun %{progress} kadarı',
            installing: 'Yükleniyor: {modName}',
            waiting: 'İndirmenin bitmesi bekleniyor',
            installProgress: '%{progress} tamamlandı',
        }
    }
}
