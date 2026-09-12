import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: 'Lansează cu mod-uri',
            startVanilla: 'Lansează vanilla'
        },
        modsActions: {
            label: 'Mod-uri',
            installed: 'Instalate',
            online: 'Online'
        },
        otherActions: {
            label: 'Altele',
            configEditor: 'Editor de configurări',
            settings: 'Setări',
            help: 'Ajutor',
        },
        profileSwitcher: {
            label: 'Profil',
            gameIconAltText: 'Imagine joc',
            close: 'Închide',
        },
        activityBar: {
            exportProfile: 'Exportă profilul',
            exportToCode: 'Exportă cod',
            exportToFile: 'Exportă fișier',
        }
    },
    installed: {
        noModsInstalled: {
            title: 'Se pare că nu ai niciun mod instalat',
            content: 'Poți să apeși pe fila Online în partea stângă pentru a parcurge toate mod-urile disponibile.',
        },
        searchAndSort: {
            search: {
                label: 'Căutare',
                placeholder: 'Caută un mod instalat',
            },
            sort: {
                label: 'Sortează',
                disabledPositions: {
                    label: 'Inactiv',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: 'Scos din uz',
                disabled: 'Inactiv'
            },
            display: {
                byline: 'v{version} de către {author}',
                installedAt: 'Instalat pe: {formattedDate}',
                releasedAt: 'Lansat pe: {formattedDate}',
            },
            concerning: {
                recommendation: 'E recomandat să ștergi acest mod.',
            },
            tooltips: {
                updateAvailable: 'O actualizare este disponibilă',
                dependencyIssue: 'Este o problemă cu dependențele acestui mod',
                disable: 'Dezactivează',
                enable: 'Activează',
                donate: 'Donează către autorul mod-ului',
                willNotBeUsed: 'Acest mod nu va fi folosit în cadrul jocului',
            },
            actions: {
                uninstall: 'Dezinstalează',
                disable: 'Dezactivează',
                enable: 'Activează',
                associated: 'Asociate',
                openWebsite: 'Site web',
                update: 'Actualizare',
                downloadDependency: 'Descarcă dependență',
                enableSpecific: 'Activează {dependencyName}',
                donate: 'Donează',
            }
        },
        expandableCard: {
            imageAltText: 'Imagine mod',
            funkyModeAltText: 'Suprapunere mod Funky',
            tooltips: {
                dragToReorder: 'Trage pentru a reorganiza',
                expand: 'Extinde',
                collapse: 'Restrânge',
            }
        },
    },
    online: {
        previewPanel: {
            author: 'De către {author}',
            metadata: {
                downloads: 'Descărcări: {downloads}',
                likes: 'Aprecieri: {likes}',
                lastUpdated: 'Ultima actualizare: {date}',
                categories: 'Categorii: {categories}',
            },
            actions: {
                download: 'Descarcă',
                viewOnline: 'Vezi online',
                donate: 'Donează',
            },
            tabs: {
                readme: 'README',
                changelog: 'CHANGELOG',
                dependencies: 'Dependențe ({dependencyCount})',
            },
            packageInformation: 'Informații pachet',
            nsfwWarning: 'Acest mod poate conține materiale cu caracter potențial explicit',
            fetchingData: 'Aducem date',
            noDependencies: 'Acest mod nu are dependențe',
            unableToFetchReadme: 'Nu se poate prelua README',
            unableToFetchChangelog: 'Nu se poate prelua CHANGELOG',
        },
        topbar: {
            search: {
                label: 'Căutare',
                placeholder: 'Caută un mod',
            },
            sort: 'Sortare',
            filter: 'Filtrare',
        },
        pagination: {
            changePageInfo: 'Folosește numerele de mai jos pentru a schimba pagina',
            noFoundMods: 'Nu au fost găsite mod-uri care să se potrivească cu căutarea',
            noMods: 'Nu sunt mod-uri disponibile',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: 'Fixat',
                    long: 'Fixat pe Thunderstore'
                },
                deprecated: {
                    short: 'Scos din uz',
                    long: 'E posibil ca acest mod să fie stricat'
                },
                donate: 'Donează către autorul mod-ului',
                installed: 'Mod deja instalat',
                nsfw: 'Mod marcat ca NSFW',
            },
            mod: {
                author: 'De către {author}'
            },
            actions: {
                download: 'Descarcă',
                website: 'Site web',
            }
        }
    },
    actions: {
        locateGameExecutable: 'Localizează executabilul {gameName}',
        selectExecutable: 'Selectează executabilul',
        locateGameLaunchHelper: 'Localizează executabilul gamelaunchhelper',
        locateSteamExecutable: 'Localizează executabilul Steam',
    }
}
