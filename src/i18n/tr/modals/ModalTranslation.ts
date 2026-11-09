import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: 'Steam klasörü ayarlanamadı',
        steamExecutableNotSelected: 'Steam çalıştırılabilir dosyası seçilmedi.',
        solution: 'Bu hata çıktığı halde seçilen dosya doğruysa lütfen yönetici olarak çalıştırın.'
    },
    failedToSetTheGameFolder: {
        title: '{gameName} klasörü ayarlanamadı',
        listedExecutableNames: 'Çalıştırılabilir dosya şunlardan biri olmalıdır: "{options}".',
        executableMustBeOneOf: 'Seçilen çalıştırılabilir dosya aşağıdakilerden biri olmalıdır:',
        solution: 'Bu hata çıktığı halde seçilen dosya doğruysa lütfen yönetici olarak çalıştırın.'
    },
    clearingGameDirectory: {
        title: '{gameName} kurulum klasörünü temizle',
        warning: 'Bu işlem oyun klasöründeki tüm dosyaları silecek.',
        steamWillBeStarted: `
            Bu işlem oyun klasörünü silecek ve Steam'den {gameName} dosyalarının bütünlüğünü doğrulamasını isteyecek.
        `,
        checkSteamForProgress: `
            Doğrulamanın ilerleyişini görmek için lütfen Steam penceresine bakın.
            Pencere henüz açılmadıysa lütfen sabırlı olun.
            `,
        confirmation: 'Anladım'
    },
    dependencyStrings: {
        title: 'Bağımlılık dizesi listesi',
        dependency: '{modName}-{versionNumber}',
        close: 'Kapat'
    },
    launchArguments: {
        title: 'Özel başlatma parametreleri ayarla',
        someProvidedByDefault: 'Bazı parametreler varsayılan olarak eklenir:',
        moddedLabel: 'Modlu:',
        availableAfterInstallingLoader: 'Bu parametreler bir mod yükleyici kurulduktan sonra kullanılabilir olacak.',
        vanillaLabel: 'Modsuz:',
        pleaseNote: `
            Bunların Steam çalıştırılabilir dosyasına iletildiğini unutmayın.
            Özel başlatma parametreleri girerken dikkatli olun.
            `,
        placeholder: 'Parametreleri girin',
        updateArguments: 'Başlatma parametrelerini güncelle',
    },
    categorySelector: {
        selectCategory: 'Bir kategori seçin',
        noCategoriesSelected: 'Kategori seçilmedi',
    },
    importLocalMod: {
        title: 'Dosyadan mod içe aktar',
        dialogTitle: 'Dosyadan yerel mod içe aktar',
        actions: {
            selectFile: 'Dosya seç',
            importLocalMod: 'Yerel modu içe aktar',
        },
        content: {
            instructToSelect: 'Lütfen içe aktarılacak bir zip veya DLL dosyası seçin.',
            dataEntryInfo: `
            Manifest dosyası içeren zip dosyalarında bazı bilgiler önceden doldurulur.
            Manifest yoksa bu bilgilerin elle girilmesi gerekir.
            `,
            waitingForSelection: 'Dosya bekleniyor. Bu bir dakika sürebilir.',
            form: {
                modName: {
                    label: 'Mod adı',
                    placeholder: 'Modun adını girin',
                },
                modAuthor: {
                    label: 'Yapımcı',
                    placeholder: 'Yapımcının adını girin',
                },
                description: {
                    label: 'Açıklama (isteğe bağlı)',
                    placeholder: 'Bir açıklama girin'
                },
                version: {
                    label: 'Sürüm',
                    majorLabel: 'Ana',
                    minorLabel: 'Ara',
                    patchLabel: 'Yama'
                }
            }
        },
        validationMessages: {
            modNameEmpty: 'Mod adı boş olamaz.',
            authorNameEmpty: 'Mod yapımcısı boş olamaz.',
            invalidVersion: 'Ana, ara ve yama sürümleri 0\'dan büyük tam sayılar olmalıdır.',
            nonNumericVersion: 'Ana, ara ve yama sürümlerinin tümü sayı olmalıdır.',
            noProfileSelected: 'Profil seçilmedi.'
        }
    },
    concerningPackage: {
        title: '{modName} modunu incele',
        notFound: 'Bu mod aslen Thunderstore\'dan indirildi, ancak artık sitede bulunamıyor.',
        whyRemoved: 'Modlar yapımcının isteğiyle, kural ihlalleri nedeniyle veya moderatörler tarafından doğrulanırken kaldırılabilir.',
        recommendation: 'Thunderstore\'dan kaldırılan modları kaldırmanız genellikle önerilir.',
        exportWarning: 'Diğer kişiler dışa aktarılan profillerden bu modu içe aktaramaz.',
        actions: {
            markSafe: 'Sürümü güvenli olarak işaretle',
            remove: 'Modu kaldır',
            review: 'Modu incele',
        }
    },
    gameRunning: {
        starting: '{gameName} başlatılıyor',
        launchingViaSteam: '{gameName} Steam üzerinden başlatılıyor',
        closeToContinue: 'Mod yönetimine devam etmek için bu mesajı kapatın.',
        takingAWhile: 'Bu biraz uzun sürüyorsa, büyük olasılıkla Steam açıldığı içindir.',
        bePatient: 'Lütfen sabırlı olun ve iyi eğlenceler!',
        close: 'Kapat',
    },
    error: {
        title: 'Hata',
        suggestion: 'Öneri',
        close: 'Kapat',
    },
    disableMod: {
        title: '{modName} devre dışı bırakılıyor',
        dependantsWarning: 'Başka modlar bu moda bağımlı. Bağımlı modları devre dışı bırakmak için {disableAllAction} seçeneğini seçin, aksi halde hatalara neden olabilirler.',
        modsToBeDisabled: 'Devre dışı bırakılacak modlar',
        actions: {
            disableAll: 'Tümünü devre dışı bırak',
            disableAllRecommended: 'Tümünü devre dışı bırak (önerilen)',
            disableOnly: 'Yalnızca {modName} modunu devre dışı bırak',
        }
    },
    uninstallMod: {
        title: '{modName} kaldırılıyor',
        dependantsWarning: 'Başka modlar bu moda bağımlı. Bağımlı modları kaldırmak için {uninstallAllAction} seçeneğini seçin, aksi halde hatalara neden olabilirler.',
        modsToBeUninstalled: 'Kaldırılacak modlar',
        actions: {
            uninstallAll: 'Tümünü kaldır',
            uninstallAllRecommended: 'Tümünü kaldır (önerilen)',
            uninstallOnly: 'Yalnızca {modName} modunu kaldır',
        }
    },
    associatedMods: {
        title: '{modName} ile ilişkili modlar',
        dependencies: 'Bağımlılıklar',
        dependants: 'Buna bağımlı olanlar',
        none: 'Bu modun bağımlılığı yok ve ona bağımlı bir mod da yok.',
        done: 'Tamam',
    },
    codeExport: {
        title: 'Profil dışa aktarıldı',
        description: 'Kodunuz panonuza kopyalandı, ancak aşağıdan elle de kopyalayabilirsiniz:',
        done: 'Tamam',
        copied: 'Panoya kopyalandı',
    },
    downloadProgress: {
        states: {
            downloading: '{modName} indiriliyor',
            installing: '{modName} yükleniyor',
        },
        complete: 'İndirme tamamlandı',
        close: 'Kapat',
        downloadProgress: 'İndiriliyor: {totalSize} boyutun %{progress} kadarı',
        installProgress: 'Yükleniyor: %{progress}',
        extractionProgress: 'Ayıklanıyor: {totalSize} boyutun %{progress} kadarı',
        waitingForDownload: 'Yükleniyor: indirmenin bitmesi bekleniyor',
    },
    downloadModVersionSelect: {
        title: 'İndirilecek {modName} sürümünü seçin',
        content: {
            recommendedDisclaimer: 'Tüm modların en son sürümünü seçmeniz önerilir.',
            outdatedModsAdvice: 'Eski sürümleri kullanmak sorunlara yol açabilir.',
        },
        tags: {
            select: 'Bir sürüm seçmelisiniz',
            recommended: '{version} önerilen sürümdür',
            latest: '{version} en son sürümdür',
            outdated: '{version} eski bir sürümdür'
        },
        download: 'Bağımlılıklarla birlikte indir',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: 'Güncellenecek mod yok',
            content: 'Ya tüm yüklü modlar güncel ya da yüklü mod yok.',
            close: 'Kapat',
        },
        hasModsToUpdate: {
            title: 'Tüm yüklü modları güncelle',
            content: {
                willBeUpdated: 'Tüm yüklü modlar en son sürümlerine güncellenecek.',
                missingDependenciesInstalled: 'Eksik bağımlılıklar yüklenecek.',
                whatWillHappen: 'Aşağıdaki modlar indirilip yüklenecek:',
                modUpdatedTo: '{modName} şu sürüme güncellenecek: {version}',
            },
            updateAll: 'Tümünü güncelle',
        }
    },
    launchType: {
        title: 'Başlatma davranışını ayarla',
        auto: {
            NATIVE: 'Oyununuz "Yerel" seçeneğiyle başlatılacak',
            PROTON: 'Oyununuz "Proton" seçeneğiyle başlatılacak',
        },
        native: {
            unsureWrapperArgsPresent: 'Gerekli sarmalayıcı parametrelerinin ayarlanıp ayarlanmadığını belirleyemedik.',
            addArgumentsInfo: 'Bunu henüz elle yapmadıysanız, lütfen aşağıdaki başlatma parametrelerini Steam\'de oyunun özelliklerine ekleyin:',
        },
        actions: {
            copyLaunchArgs: 'Başlatma parametrelerini kopyala',
            update: 'Güncelle'
        }
    },
    modFilter: {
        title: 'Mod kategorilerini filtrele',
        languageDisclaimer: 'Kategoriler Thunderstore tarafından sağlanır ve çevrilemez.',
        selectors: {
            atLeastOneCategory: 'Modlar bu kategorilerden en az birini içermeli',
            allCategories: 'Modlar bu kategorilerin tümünü içermeli',
            noneCategories: 'Modlar bu kategorilerin hiçbirini içeremez'
        },
        allowNsfw: 'NSFW (müstehcen olabilecek) modlara izin ver',
        showDeprecated: 'Kullanımdan kalkmış modları göster',
        apply: 'Filtreleri uygula'
    },
    sort: {
        title: 'Modların sıralamasını değiştir',
        sortBehaviour: 'Sıralama ölçütü',
        sortDirection: 'Sıralama yönü',
        close: 'Kapat',
    },
    createProfile: {
        title: 'Profil oluştur',
        description: 'Bu profil, kendi modlarını diğer profillerden bağımsız olarak saklayacak.',
        tagStates: {
            required: 'Bir profil adı girmelisiniz',
            valid: '"{profileName}" geçerli bir profil adı',
            error: '"{profileName}" zaten kullanılıyor ya da geçersiz karakterler içeriyor'
        },
        actions: {
            create: 'Oluştur'
        }
    },
    deleteProfile: {
        title: 'Profili sil',
        content: {
            resultingAction: 'Bu işlem, bu profile yüklenmiş tüm modları ve yapılandırma dosyalarını kaldıracak.',
            preventAction: 'Bunu yanlışlıkla yaptıysanız karartılmış alana veya sağ üstteki çarpıya tıklayın.',
            confirmation: 'Bu profili silmek istediğinizden emin misiniz?',
        },
        actions: {
            delete: 'Profili sil',
        }
    },
    renameProfile: {
        title: 'Profili yeniden adlandır',
        content: 'Bu profil, kendi modlarını diğer profillerden bağımsız olarak saklayacak.',
        actions: {
            rename: 'Yeniden adlandır',
        },
        tagStates: {
            required: 'Bir profil adı girmelisiniz',
            valid: '"{profileName}" geçerli bir profil adı',
            error: '"{profileName}" zaten kullanılıyor ya da geçersiz karakterler içeriyor'
        },
    },
    importProfile: {
        dialogTitle: 'Profili içe aktar',
        dialogButton: 'İçe aktar',
        states: {
            fileCodeSelection: {
                title: 'Profili nasıl içe aktarıyorsunuz?',
                actions: {
                    fromFile: 'Dosyadan',
                    fromCode: 'Koddan'
                }
            },
            fromFile: {
                title: 'Dosya yükleniyor',
                content: 'Bir dosya seçme penceresi açılacak. Profil seçildikten sonra işlem birkaç saniye sürebilir.',
            },
            importCode: {
                title: 'Profil kodunu girin',
                enterCodePlaceholder: 'Profil kodunu girin',
                tagStates: {
                    invalid: 'Geçersiz kod, yazım hatalarını kontrol edin',
                },
                actions: {
                    loading: 'Yükleniyor',
                    proceed: 'Devam et'
                }
            },
            refresh: {
                title: 'Çevrimiçi mod listesi yenileniyor',
                content: {
                    description: `
                    Profildeki bazı paketler mod yöneticisi tarafından tanınmıyor.
                    Çevrimiçi mod listesini yenilemek sorunu çözebilir. Lütfen bekleyin.
                    `,
                    waitingForModDownloads: 'Çevrimiçi mod listesini yenilemeden önce mod indirmelerinin bitmesi bekleniyor',
                }
            },
            reviewImport: {
                title: 'Yüklenecek paketler',
                content: {
                    notFoundDisclaimer: 'Profildeki şu paketler Thunderstore\'da bulunamadı ve yüklenmeyecek:',
                    ensureCorrectProfile: 'Profilin şu anda seçili oyun için olduğundan emin olun.',
                    packagesWillBeInstalled: 'Şu paketler yüklenecek:',
                },
                actions: {
                    acknowledgement: 'Bazı modların içe aktarılmayacağını anlıyorum',
                    proceed: 'İçe aktar'
                }
            },
            willImportOrUpdate: {
                title: 'Mevcut bir profili mi güncelleyeceksiniz, yoksa yeni bir profil mi oluşturacaksınız?',
                actions: {
                    newProfile: 'Yeni profil olarak içe aktar',
                    existingProfile: 'Mevcut profili güncelle',
                }
            },
            addProfile: {
                title: 'Profil içe aktar',
                content: {
                    create: {
                        description: 'Bu profil, kendi modlarını diğer profillerden bağımsız olarak saklayacak.'
                    },
                    update: {
                        contentsWillBeOverwritten: 'Profilin tüm içeriğinin üzerine kodun/dosyanın içeriği yazılacak.',
                        selectProfile: 'Aşağıdan bir profil seçin:'
                    }
                },
                tagStates: {
                    required: 'Bir profil adı girmelisiniz',
                    valid: '"{profileName}" geçerli bir profil adı',
                    error: '"{profileName}" zaten kullanılıyor ya da geçersiz karakterler içeriyor'
                },
                actions: {
                    create: 'Oluştur',
                    update: 'Profili güncelle: {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: 'Modlar indiriliyor: %{progress}',
                    downloadingModsWithGoal: `Modlar indiriliyor: {totalSize} boyutun %{progress} kadarı`,
                    cleaningUp: 'Temizleniyor',
                    applyChanges: 'Değişiklikler güncellenen profile uygulanıyor',
                    copyingModsToProfile: 'Modlar profile kopyalanıyor: %{progress}',
                    copyingConfigsToProfile: 'Yapılandırmalar profile kopyalanıyor: %{progress}'

                },
                content: {
                    waitMessage: 'Dosyalar indirilip ayıklanıp kopyalandığı için bu biraz zaman alabilir.',
                    doNotClose: 'Lütfen {appName} uygulamasını kapatmayın.'
                }
            }
        }
    },
    platform: {
        header: "Oyununuzu hangi mağaza yönetiyor?",
        selectAction: "Platformu seç",
    },
    settingsLoader: {
        managerProblem: 'Bu, mod yöneticisinin kendisiyle ilgili bir sorun. Yöneticinin daha yeni bir sürümü varsa onu yüklemeyi deneyin.',
        loadFailed: 'Yerel kullanıcı ayarları yüklenemedi. Ayarları sıfırlamak için aşağıdaki düğmeyi kullanabilirsiniz, ancak tüm oyunlar için tüm ayarların kaybolacağını ve bunun geri alınamayacağını unutmayın.',
        resetAction: 'Ayarları sıfırla',
        resetFailed: 'Ayarlar sıfırlanamadı. Bu {instructionsLink} izleyerek ayarları elle sıfırlamayı yine de deneyebilirsiniz.',
        instructionsLinkText: 'talimatları',
        resetDidNotHelp: 'Yerel olarak saklanan ayarlar sıfırlandı, ancak bu ayarların yüklenmesindeki sorunu çözmedi. Yöneticinin daha yeni bir sürümü varsa onu yüklemeyi deneyin.'
    },
    actions: {
        close: 'Kapat',
    },
}
