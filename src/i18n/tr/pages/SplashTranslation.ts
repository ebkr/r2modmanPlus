import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: '{appName} başlatılıyor',
    gameUpdatesWarning: 'Oyun güncellemeleri modları bozabilir. Yeni bir güncelleme yayınlandıysa lütfen sabırlı olun.',
    menu: {
        helpLabel: 'Yardım',
        helpItems: {
            about: 'Hakkında',
            faq: 'SSS'
        },
    },
    actions: {
        goBack: 'Geri dön',
    },
    content: {
        main: {
            didYouKnow: 'Biliyor muydunuz?',
            externalInstallWithModManager: `
                            Thunderstore'daki "Install with Mod Manager" düğmesini kullanarak
                            modları {appName} ile yükleyebilirsiniz.
                        `,
            goToThunderstore: 'Thunderstore\'a git',
            exportProfile: `
                        Seçili profili ayarlar ekranından dosya veya kod olarak dışa aktarabilirsiniz.
                        Bu sayede mod listenizi arkadaşlarınızla kolayca paylaşabilirsiniz!
                        `,
            havingTrouble: {
                title: 'Sorun mu yaşıyorsunuz?',
                body: 'Hatanın ekran görüntüsünü {appName} Discord sunucusunun destek kanalına gönderin.',
                serverLinkText: '{appName} Discord sunucusuna katıl',
            },
        },
        about: {
            title: '{appName} hakkında',
            creator: 'Ebkr tarafından geliştirilmiştir.',
            techStack: {
                builtUsing: 'Uygulama, aşağıdaki teknolojileri sağlayan Quasar ile geliştirilmiştir:',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: 'SSS',
            howToGetStarted: {
                title: 'Nasıl başlarım?',
                body: 'Çevrimiçi sekmesine gidin ve sevdiğiniz modları indirin. "Modlu başlat" düğmesine tıklayın ve keyfini çıkarın.'
            },
            startingWithMods: {
                title: 'Oyunu modlarla başlatmak',
                body: `
                            Oyunu yöneticinin içinden başlatmanız gerekir.
                            Steam üzerinden başlatmak, elle değişiklik yapılmadan çalışmaz.
                            `
            }
        }
    },
    states: {
        preparing: 'Hazırlanıyor',
        checkingForUpdates: 'Güncellemeler denetleniyor',
        checkingForLocalCache: 'Yerel önbellekte mod listesi aranıyor',
        checkingForThunderstoreUpdates: 'Thunderstore\'dan mod listesi güncellemeleri denetleniyor',
        loadingLatestThunderstoreList: 'Güncel mod listesi Thunderstore\'dan yükleniyor',
        pruningLocalCache: 'Kaldırılan modlar yerel önbellekten temizleniyor',
        processingModList: 'Mod listesi işleniyor',
    }
}
