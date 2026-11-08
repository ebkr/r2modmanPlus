import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: 'Yardım',
        subtitle: 'Sık karşılaşılan sorunlar ve olası çözümleri'
    },
    tabs: {
        general: 'Genel',
        gameWontStart: 'Oyun başlamıyor',
        modsNotShowing: 'Modlar görünmüyor',
        updating: 'Güncelleme',
    },
    general: {
        gettingStarted: {
            title: 'Mod yükleyerek başlayın',
            whereToFindMods: `
            "{''}@:translations.pages.manager.navigation.modsActions.online{''}" sekmesine gidin, bir mod bulun ve indir'e basın.
            Bağımlılıkları da indirerek size zaman kazandırır.
            `,
            onceInstalled: 'Kullanmak istediğiniz modları yükledikten sonra sol üstteki {startModdedAction} düğmesine tıklamanız yeterli.',
        },
        slowGame: {
            title: 'Oyun modlarla yavaş mı çalışıyor / takılıyor mu?',
            likelyCause: `
            Bunun nedeni büyük olasılıkla hata veren bir moddur.
            Bir çözüm, modlarınızın yarısını devre dışı bırakıp sorunun devam edip etmediğine bakmaktır.
            `,
            issuePersisting: `
            Sorun hâlâ devam ediyorsa kalanların yarısını da devre dışı bırakın.
            Sorun çözülene kadar bunu sürdürün.
            `,
            ifStutters: 'Takılma sorununda yardımcı olabilecek optimizasyon modları olabilir.',
        },
        dedicatedServers: {
            title: 'Özel sunucular',
            content: `
            Özel sunucular yönetici tarafından doğrudan desteklenmez, ancak bir çözüm olarak
            profil klasörünüzün içeriğini özel sunucu klasörünüze kopyalayabilirsiniz.
            `,
        },
        launchingExternally: {
            title: 'Oyunu mod yöneticisi dışından başlatmak',
            howTo: 'Tasarım gereği, oyunu Steam üzerinden başlattığınızda oyun modsuz (vanilla) çalışır.',
            whereToPlace: 'İlgili parametreyi platformunuzun başlatma parametreleri alanına eklemeniz gerekir.',
            forSteam: 'Steam için bu alan oyunun özelliklerinde bulunur.',
            yourCurrentArgument: 'Mevcut parametreniz şu olur:',
            loaderNotInstalled: 'Bu parametreler bir mod yükleyici kurulduktan sonra kullanılabilir olacak.',
            copyArguments: 'Başlatma parametrelerini kopyala',
        },
    },
    gameWontStart: {
        errorModal: {
            title: 'Oyunu başlatmaya çalıştığımda kırmızı bir kutu çıkıyor',
            solution: 'Kırmızı kutunun altında genellikle bir öneri bulunur. Sorunu çözebilir.',
        },
        redirectedToStorePage: {
            title: 'Steam mağaza sayfasına yönlendiriliyorum',
            solution: '{appName} kullanırken oyunun yasal bir kopyasına sahip olmanız gerekir. Oyunu mağaza sayfasından satın alabilirsiniz.',
        },
        consoleCloses: {
            title: 'Bir metin penceresi açılıp hemen kapanıyor',
            tryRunning: 'Ayarlar ekranında "{gameName} kurulumunu sıfırla" seçeneğini çalıştırmayı deneyin.', // TODO - Reference translation via Settings screen
            ifPersists: 'Sorun devam ederse Steam\'i zorla kapatın ve Steam kapalıyken modlu başlatın.',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: 'Olası çözümler',
            instructToWiki: 'En yaygın sorunlar, wiki\'deki talimatlar aynen uygulanarak çözülür.',
            goToWiki: 'Wiki\'ye git',
        }
    },
    updating: {
        autoUpdates: {
            title: 'Otomatik güncellemeler',
            whenDoesItUpdate: 'Bir güncelleme varsa yönetici kapatılırken otomatik olarak güncellenir.',
            downloadedInBackground: 'Güncellemeler arka planda indirilir.',
            promptToRunOldInstaller: '"{oldInstaller}" dosyasını yönetici olarak çalıştırmanız istenebilir. Bu, güncelleyicidir.',
            ifProblemOccurs: 'Bir güncellemede sorun çıkarsa en son yükleyiciyi indirip çalıştırın.',
        },
        ignoreUpdates: {
            title: 'Güncelleme istemiyorum',
            content: 'GitHub\'da otomatik güncellenmeyen taşınabilir bir sürüm var. Ancak yine de güncelleme olduğunda bilgilendirilirsiniz.'
        }
    }
}
