import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: 'Ayarlar',
        subtitle: '{appName} için gelişmiş seçenekler: {version}',
    },
    nav: {
        label: 'Bölümler',
        categories: {
            all: 'Tümü',
            directories: 'Klasörler',
            profile: 'Profil',
            appearance: 'Görünüm',
            debugging: 'Hata ayıklama',
            modpacks: 'Mod paketleri',
            other: 'Diğer',
        }
    },
    search: {
        label: 'Ara',
        placeholder: 'Bir ayar arayın',
    },
    actions: {
        change: 'Değiştir',
        browse: 'Göz at',
        notSet: 'Ayarlanmadı',
    },
    entries: {
        changeLaunchBehaviour: {
            title: 'Başlatma davranışını değiştir',
            description: 'Belirli bir başlatma davranışı seçin. Yöneticiye bir oyunun açıkça Yerel veya Proton kullandığını bildirebilirsiniz.',
            current: 'Geçerli başlatma davranışı:',
            searchTerms: [
                'Başlatma davranışını değiştir',
                'Başlatma modunu ayarla',
                'Proton',
                'Yerel',
                'Otomatik',
            ],
        },
        cleanOnlineModListCache: {
            title: 'Çevrimiçi mod listesi önbelleğini temizle',
            description: 'Mod listesinin yerel kopyasını siler ve yenisini alır.',
            action: 'Çevrimiçi mod listesini temizle',
            searchTerms: [
                'Çevrimiçi mod listesi önbelleğini temizle',
                'Sıfırla',
            ],
        },
        copyLogToClipboard: {
            title: 'Günlüğü panoya kopyala',
            description: 'Günlük dosyasının içeriğini Discord için biçimlendirilmiş olarak panonuza kopyalayın.',
            searchTerms: [
                'Günlük dosyası içeriğini panoya kopyala',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
            ],
        },
        copyTroubleshooting: {
            title: 'Sorun giderme bilgilerini panoya kopyala',
            description: 'Ayarları ve diğer bilgileri Discord için biçimlendirilmiş olarak panonuza kopyalayın. Destek isterken bunu paylaşın.',
            searchTerms: [
                'Sorun giderme bilgilerini panoya kopyala',
                'Discord',
                'Destek',
                'Sistem',
            ],
        },
        dataDirectory: {
            title: 'Veri ve profil klasörleri',
            description: 'Tüm oyunlar ve profiller için modların saklandığı klasör.',
            warning: 'Veri klasörünü değiştirmek mevcut profilleri taşımaz veya silmez. Ancak bu profiller eski klasörde kalır.',
            dataFolder: 'Veri klasörü',
            profileFolder: 'Profil klasörü',
            dialog: {
                title: '{appName} verilerini saklamak için yeni bir klasör seçin',
                button: 'Veri klasörünü seç',
            },
            searchTerms: [
                'Veri ve profil klasörleri',
                'Değiştir',
                'Göz at',
                'Klasör',
                'Dizin',
            ],
        },
        downloadCache: {
            title: 'İndirme önbelleği',
            description: 'Etkinleştirildiğinde, önbellekte mevcut bir kopya varsa indirme atlanır.',
            enabled: 'Etkin (önerilen)',
            disabled: 'Devre dışı',
            searchTerms: [
                'İndirme önbelleğini aç/kapat',
                'İndirme önbelleği',
                'Aç/kapat',
            ],
        },
        expandCards: {
            title: 'Kartları varsayılan olarak genişlet',
            description: 'Bir mod listesi açıldığında mod kartlarını daraltılmış yerine tamamen genişletilmiş göster.',
            expanded: 'Genişletilmiş',
            collapsed: 'Daraltılmış',
            searchTerms: [
                'Kartları varsayılan olarak genişlet',
                'Aç/kapat',
                'Daraltılmış',
                'Genişletilmiş',
            ],
        },
        exportProfile: {
            title: 'Profili dışa aktar',
            description: 'Mod listenizi ve yapılandırmalarınızı dışa aktararak arkadaşlarınızla paylaşın; onlar da hızlı ve kolayca aynı profili edinsin.',
            asFile: 'Dosya olarak',
            asCode: 'Kod olarak',
            dialog: {
                title: 'Profilinizin dışa aktarılacağı klasörü seçin',
                button: 'Dışa aktarma klasörünü seç',
            },
            searchTerms: [
                'Profili dışa aktar',
                'Dosya olarak',
                'Kod olarak',
            ],
        },
        funkyMode: {
            title: 'Funky modu etkinleştir',
            description: 'Funky mod işte.',
            enabled: 'Etkin',
            disabled: 'Devre dışı',
            searchTerms: [
                'Funky modu etkinleştir',
                'Aç/kapat',
                'Devre dışı bırak'
            ],
        },
        gameDirectory: {
            title: '{gameName} klasörü',
            description: 'Gerekli dosyaların doğru yere yerleştirilmesi için oyun klasörü gereklidir.',
            warning: 'Bu doğru ayarlanmazsa {gameName} modsuz başlar.',
            unsure: 'Bunun ne olması gerektiğinden emin değilim',
            searchTerms: [
                '{gameName} klasörü',
                'Değiştir',
                'Göz at',
                'Oyun',
                'Dizin',
                'Klasörler',
            ],
        },
        importLocalMod: {
            title: 'Yerel mod içe aktar',
            description: 'Dosyalarınızdan çevrimdışı olarak bir mod yükleyin. Her mod yerel olarak yüklenemez.',
            searchTerms: [
                'Yerel mod içe aktar',
                'Çevrimdışı yükle',
                'İçe aktar',
            ],
        },
        launchArguments: {
            title: 'Başlatma parametreleri',
            description: 'Oyun başlatılırken eklenecek özel parametreler girin.',
            action: 'Başlatma parametrelerini ayarla',
            searchTerms: [
                'Özel başlatma parametreleri ayarla',
                'Başlatma parametreleri',
            ],
        },
        modCache: {
            title: 'Mod önbelleği',
            description: 'İndirilen modlar, tekrar indirilmeleri gerekmesin diye bir önbellekte tutulur.',
            stillWritten: 'Modlar yine de önbelleğe yazılacak ve disk alanı kullanmaya devam edecek.',
            action: 'Önbelleği temizle',
            actionDescription: 'Depolama alanı açmak için hiçbir profilde bulunmayan önbellekteki modları kaldırır.',
            enabled: 'Etkin',
            disabled: 'Devre dışı',
            enabledHint: 'Önbellekteki indirmeler yeniden kullanılıyor (önerilen)',
            disabledHint: 'Mod indirirken önbelleği yok sayar. Her seferinde yeniden indirir.',
            searchTerms: [
                'Mod önbelleği',
                'İndirmeler',
                'Önbellekteki indirmeleri yeniden kullan',
                'Aç/kapat',
                'Mod önbelleğini temizle',
                'Boş alan',
                'Temizle',
                'Depolama',
            ],
        },
        modState: {
            title: 'Mod durumunu değiştir',
            description: 'Profilinizdeki tüm modları etkinleştirin / devre dışı bırakın.',
            enableAll: 'Tüm modları etkinleştir',
            disableAll: 'Tüm modları devre dışı bırak',
            allEnabled: 'Tüm modlarınız şu anda etkin.',
            allDisabled: 'Tüm modlarınız şu anda devre dışı.',
            someDisabled: '1 modunuz devre dışı. | {count} modunuz devre dışı.',
            searchTerms: [
                'Mod durumunu değiştir',
                'Aç/kapat',
                'Tüm modları etkinleştir',
                'Tüm modları devre dışı bırak',
            ],
        },
        onlineModList: {
            title: 'Çevrimiçi mod listesi',
            description: 'Yeni mod sürümlerini denetleyin veya yerel kopyayı temizleyin.',
            refresh: 'Yenile',
            deleteCopy: 'Kopyayı sil',
            states: {
                refreshing: 'Yenileniyor...',
                error: 'Mod listesi yenilenirken hata oluştu: {message}',
                disabledWhileDownloading: 'Etkin indirmeler varken mod listesi yenilenemez.',
                lastUpdated: 'Son güncelleme: {date}',
                noApiInfo: 'API bilgisi yok',
            },
            searchTerms: [
                'Çevrimiçi mod listesini yenile',
                'Yeni mod sürümlerini denetle',
                'Çevrimiçi mod listesi önbelleğini temizle',
                'Mod listesi önbelleğini sıfırla',
            ],
        },
        refreshOnlineModList: {
            title: 'Çevrimiçi mod listesini yenile',
            description: 'Yeni mod sürümlerini denetleyin. {status}',
            action: 'Yenile',
            states: {
                refreshing: 'Yenileniyor...',
                error: 'Mod listesi yenilenirken hata oluştu: {message}',
                disabledWhileDownloading: 'Etkin indirmeler varken mod listesi yenilenemez.',
                cacheDate: 'Önbellek tarihi: {date}',
                noApiInfo: 'API bilgisi yok',
            },
            searchTerms: [
                'Çevrimiçi mod listesini yenile',
                'Yeni mod sürümlerini denetle',
                'Thunderstore modları',
            ],
        },
        resetGameInstallation: {
            title: '{gameName} kurulumunu sıfırla',
            description: 'Bozuk dosyaların veya elle mod kurma denemelerinden kalan dosyaların neden olduğu sorunları düzeltin. Bu işlem {folderName} klasörünün tüm içeriğini siler ve dosyaları Steam üzerinden doğrular.',
            action: 'Kurulumu sıfırla',
            searchTerms: [
                '{gameName} kurulumunu sıfırla',
                'Dosyaları doğrula',
                'Bütünlüğü doğrula',
                'Bozuk',
                'Dosya',
            ],
        },
        showDependencyStrings: {
            title: 'Bağımlılık dizelerini göster',
            description: 'Yüklü modları, bir manifest.json dosyasının dependencies dizisinde kullanıldığı biçimdeki sürüm dizeleriyle listeleyin. {modCount} mod için bağımlılık dizelerini gösterir.',
            searchTerms: [
                'Bağımlılık dizelerini göster',
            ],
        },
        steamDirectory: {
            title: 'Steam klasörü',
            description: 'Steam çalıştırılabilir dosyasını içeren Steam klasörü.',
            value: '{appName} oyunu bu şekilde başlatacak.',
            searchTerms: [
                'Steam klasörünü değiştir',
                'Steam dizinini değiştir',
                'Göz at',
                'Klasörler',
            ],
        },
        theme: {
            title: 'Tema',
            description: 'Yönetici için açık veya koyu görünüm arasında seçim yapın.',
            light: 'Açık',
            dark: 'Koyu',
            searchTerms: [
                'Tema',
                'Açık',
                'Koyu',
                'Görünüm',
            ],
        },
        toggleCdn: {
            title: 'Tercih edilen Thunderstore CDN\'ini değiştir',
            description: 'Uygulama yeniden başlatılana kadar CDN\'i değiştirin. Bu, mod indirme sorunlarını aşmanızı sağlayabilir.',
            action: 'Tercih edilen CDN\'i değiştir',
            current: 'Geçerli: {label}',
            searchTerms: [
                'Tercih edilen Thunderstore CDN\'ini değiştir',
                'Değiştir',
            ],
        },
        updateAllMods: {
            title: 'Tüm modları güncelle',
            description: 'Yüklü her modu hızlıca en son sürümüne güncelleyin. {status}',
            status: '1 modun güncellemesi var. | {count} modun güncellemesi var.',
            searchTerms: [
                'Tüm modları güncelle',
            ],
        },
    }
};
