import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: 'Modlu başlat',
            startVanilla: 'Modsuz başlat'
        },
        modsActions: {
            label: 'Modlar',
            installed: 'Yüklü',
            online: 'Çevrimiçi'
        },
        otherActions: {
            label: 'Diğer',
            configEditor: 'Yapılandırma düzenleyici',
            settings: 'Ayarlar',
            help: 'Yardım',
        },
        profileSwitcher: {
            label: 'Profil',
            gameIconAltText: 'Oyun görseli',
            close: 'Kapat',
        },
        activityBar: {
            exportProfile: 'Profili dışa aktar',
            exportToCode: 'Kod olarak dışa aktar',
            exportToFile: 'Dosya olarak dışa aktar',
            refreshingModList: 'Mod listesi yenileniyor: %{progress}',
        }
    },
    installed: {
        noModsInstalled: {
            title: 'Görünüşe göre hiç mod yüklemediniz',
            content: 'Mevcut tüm modlara göz atmak için soldaki Çevrimiçi sekmesine tıklayabilirsiniz.',
        },
        searchAndSort: {
            search: {
                label: 'Ara',
                placeholder: 'Yüklü bir mod arayın',
            },
            sort: {
                label: 'Sırala',
                disabledPositions: {
                    label: 'Devre dışı',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: 'Kullanımdan kalktı',
                disabled: 'Devre dışı'
            },
            display: {
                byline: 'v{version}, yapımcı: {author}',
                installedAt: 'Yüklenme tarihi: {formattedDate}',
                releasedAt: 'Yayınlanma tarihi: {formattedDate}',
            },
            concerning: {
                recommendation: 'Bu modu kaldırmanız önerilir.',
            },
            tooltips: {
                updateAvailable: 'Güncelleme mevcut',
                dependencyIssue: 'Bu modun bağımlılıklarında bir sorun var',
                disable: 'Devre dışı bırak',
                enable: 'Etkinleştir',
                donate: 'Mod yapımcısına bağış yap',
                willNotBeUsed: 'Bu mod oyunda kullanılmayacak',
            },
            actions: {
                uninstall: 'Kaldır',
                disable: 'Devre dışı bırak',
                enable: 'Etkinleştir',
                associated: 'İlişkili',
                openWebsite: 'Web sitesi',
                update: 'Güncelle',
                downloadDependency: 'Bağımlılığı indir',
                enableSpecific: '{dependencyName} etkinleştir',
                donate: 'Bağış yap',
            }
        },
        expandableCard: {
            imageAltText: 'Mod görseli',
            funkyModeAltText: 'Funky mod katmanı',
            tooltips: {
                dragToReorder: 'Sıralamak için sürükleyin',
                expand: 'Genişlet',
                collapse: 'Daralt',
            }
        },
    },
    online: {
        previewPanel: {
            author: 'Yapımcı: {author}',
            metadata: {
                downloads: 'İndirme: {downloads}',
                likes: 'Beğeni: {likes}',
                lastUpdated: 'Son güncelleme: {date}',
                categories: 'Kategoriler: {categories}',
            },
            actions: {
                download: 'İndir',
                viewOnline: 'Çevrimiçi görüntüle',
                donate: 'Bağış yap',
            },
            tabs: {
                readme: 'BENİOKU',
                changelog: 'DEĞİŞİKLİKLER',
                dependencies: 'Bağımlılıklar ({dependencyCount})',
            },
            packageInformation: 'Paket bilgisi',
            nsfwWarning: 'Bu mod müstehcen içerik barındırabilir',
            fetchingData: 'Veriler alınıyor',
            noDependencies: 'Bu modun bağımlılığı yok',
            unableToFetchReadme: 'BENİOKU alınamadı',
            unableToFetchChangelog: 'DEĞİŞİKLİKLER alınamadı',
        },
        topbar: {
            search: {
                label: 'Ara',
                placeholder: 'Bir mod arayın',
            },
            sort: 'Sırala',
            filter: 'Filtrele',
        },
        pagination: {
            changePageInfo: 'Sayfa değiştirmek için aşağıdaki numaraları kullanın',
            noFoundMods: 'Aramayla eşleşen mod bulunamadı',
            noMods: 'Mevcut mod yok',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: 'Sabitlendi',
                    long: 'Thunderstore\'da sabitlendi'
                },
                deprecated: {
                    short: 'Kullanımdan kalktı',
                    long: 'Bu mod bozuk olabilir'
                },
                donate: 'Mod yapımcısına bağış yap',
                installed: 'Mod zaten yüklü',
                nsfw: 'Mod NSFW olarak işaretlenmiş',
            },
            mod: {
                author: 'Yapımcı: {author}'
            },
            actions: {
                download: 'İndir',
                website: 'Web sitesi',
            }
        }
    },
    actions: {
        locateGameExecutable: '{gameName} çalıştırılabilir dosyasını bul',
        selectExecutable: 'Çalıştırılabilir dosyayı seç',
        locateGameLaunchHelper: 'gamelaunchhelper çalıştırılabilir dosyasını bul',
        locateSteamExecutable: 'Steam çalıştırılabilir dosyasını bul',
    }
}
