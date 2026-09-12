import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: 'Setări',
        subtitle: 'Opțiuni avansate pentru {appName}: {version}',
    },
    nav: {
        label: 'Secțiuni',
        categories: {
            all: 'Toate',
            directories: 'Dosare',
            profile: 'Profiluri',
            appearance: 'Aspect',
            debugging: 'Depanare',
            modpacks: 'Pachete de mod-uri',
            other: 'Altele',
        }
    },
    search: {
        label: 'Căutare',
        placeholder: 'Caută o setare',
    },
    actions: {
        change: 'Schimbă',
        browse: 'Parcurge',
        notSet: 'Nu e setat',
    },
    entries: {
        changeLaunchBehaviour: {
            title: 'Schimbă comportamentul de lansare',
            description: 'Selectează un comportament specific de lansare. Poți spune managerului că un joc folosește explicit fie modul Nativ, fie Proton.',
            current: 'Comportamentul curent de lansare este setat la:',
            searchTerms: [
                'Schimbă comportamentul de lansare',
                'Setează modul de lansare',
                'Proton',
                'Nativ',
                'Auto',
            ],
        },
        cleanOnlineModListCache: {
            title: 'Curăță cache-ul pentru lista online de mod-uri',
            description: 'Șterge copia locală a listei de mod-uri și obține o listă nouă.',
            action: 'Curăță lista online de mod-uri',
            searchTerms: [
                'Curăță lista online de mod-uri',
                'Resetează',
            ],
        },
        copyLogToClipboard: {
            title: 'Copie fișierul de log-uri în clipboard',
            description: 'Copie conținutul fișierului de log-uri în clipboard, formatat pentru Discord.',
            searchTerms: [
                'Copie fișierul de log-uri în clipboard',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
            ],
        },
        copyTroubleshooting: {
            title: 'Copie informațiile de depanare în clipboard',
            description: 'Copie setările și alte informații în clipboard, formatat pentru Discord. Distribuie asta când soliciți asistență.',
            searchTerms: [
                'Copie informațiile de depanare în clipboard',
                'Discord',
                'Asistență',
                'Ajutor',
                'Sistem',
            ],
        },
        dataDirectory: {
            title: 'Dosarele de date și profil',
            description: 'Dosarul în care sunt stocate mod-urile pentru toate jocurile și profilurile.',
            warning: 'Schimarea dosarului de date nu mută și nici nu șterge profilurile existente. Totuși, ele vor rămâne în dosarul vechi.',
            dataFolder: 'Dosar date',
            profileFolder: 'Dosar profil',
            dialog: {
                title: 'Selectează un dosar nou pentru a stoca datele {appName}',
                button: 'Selectează dosarul de date',
            },
            searchTerms: [
                'Dosarele de date și profil',
                'Change',
                'Browse',
                'Folder',
                'Directory',
            ],
        },
        downloadCache: {
            title: 'Cache pentru descărcări',
            description: 'Când e activ, nu vor fi făcute descărcări dacă există o copie în cache.',
            enabled: 'Activ (recomandat)',
            disabled: 'Inactiv',
            searchTerms: [
                'Comută cache pentru descărcări',
                'Cache pentru descărcări',
                'Comută',
            ],
        },
        expandCards: {
            title: 'Extinde planșetele în mod implicit',
            description: ' Arată planșetele mod-urilor extinse complet în loc să fie restrânse când deschizi o listă de mod-uri.',
            expanded: 'Extins',
            collapsed: 'Restrâns',
            searchTerms: [
                'Extinde planșetele în mod implicit',
                'Comută',
                'Restrâns',
                'Extins',
            ],
        },
        exportProfile: {
            title: 'Exportă profil',
            description: 'Exportă lista de mod-uri și configurațiile ca să o împărtășești cu prieteni și să obții un profil identic rapid și facil.',
            asFile: 'Sub formă de fișier',
            asCode: 'Sub formă de cod',
            dialog: {
                title: 'Selectează un dosar în care să exporți profilul',
                button: 'Selectează dosar de export',
            },
            searchTerms: [
                'Exportă profil',
                'Sub formă de fișier',
                'Sub formă de cod',
            ],
        },
        funkyMode: {
            title: 'Activează modul Funky',
            description: 'E modul Funky.',
            enabled: 'Activ',
            disabled: 'Inactiv',
            searchTerms: [
                'Activează modul Funky',
                'Comută',
                'Dezactivează'
            ],
        },
        gameDirectory: {
            title: 'Dosar {gameName}',
            description: 'Dosarul jocului e necesar pentru a amplasa fișierele potrivite în mod corect.',
            warning: '{gameName} va fi lansat fără mod-uri dacă asta nu e setată în mod potrivit.',
            unsure: 'Nu știu sigur ce ar trebui să pun aici',
            searchTerms: [
                'Dosar {gameName}',
                'Schimbă',
                'Vizualizează',
                'Joc',
                'Dosar',
                'Dosare',
            ],
        },
        importLocalMod: {
            title: 'Importă un mod local',
            description: 'Instalează un mod în mod offline din fișierele tale. Nu toate mod-urile pot fi instalate local.',
            searchTerms: [
                'Importă un mod local',
                'Instalează offline',
                'Importă',
            ],
        },
        launchArguments: {
            title: 'Parametri de lansare',
            description: 'Furnizează parametri de lansare personalizați care sunt adăugați când jocul e lansat.',
            action: 'Setează parametri de lansare',
            searchTerms: [
                'Setează parametri de lansare personalizați',
                'Parametri de lansare',
            ],
        },
        modCache: {
            title: 'Cache de mod-uri',
            description: 'Mod-urile descărcate sunt păstrate într-un cache pentru a evita descărcarea lor repetată.',
            stillWritten: 'Mod-urile vor fi scrise în cache în continuare și vor continua să folosească spațiu pe disc.',
            action: 'Curăță cache',
            actionDescription: 'Șterge mod-urile stocate în cache care nu sunt folosite în niciun profil pentru a elibera spațiu pe disc.',
            enabled: 'Activ',
            disabled: 'Inactiv',
            enabledHint: 'Va reutiliza descărcările stocate în cache (recomandat)',
            disabledHint: 'Ignoră cache-ul la descărcarea mod-urilor. Va descărca din nou de fiecare dată.',
            searchTerms: [
                'Cache de mod-uri',
                'Descărcări',
                'Reutilizează descărcările stocate în cache',
                'Comută',
                'Curăță cache-ul de mod-uri',
                'Eliberează spațiu',
                'Curăță',
                'Stocare',
            ],
        },
        modState: {
            title: 'Schimbă starea mod-urilor',
            description: 'Activează / dezactivează toate mod-urile în profilul tău.',
            enableAll: 'Activează toate mod-urile',
            disableAll: 'Dezactivează toate mod-urile',
            allEnabled: 'Toate mod-urile tale sunt active la moment.',
            allDisabled: 'Toate mod-urile tale sunt inactive la moment.',
            someDisabled: 'Ai 1 mod inactiv. | Ai {count} mod-uri inactive.',
            searchTerms: [
                'Schimbă starea mod-urilor',
                'Comută',
                'Activează toate mod-urile',
                'Dezactivează toate mod-urile',
            ],
        },
        onlineModList: {
            title: 'Lista de mod-uri online',
            description: 'Verifică apariția unor mod-uri noi, sau curăță copia locală.',
            refresh: 'Actualizează',
            deleteCopy: 'Șterge copia',
            states: {
                refreshing: 'Actualizare...',
                error: 'Eroare în timpul actualizării listei de mod-uri: {message}',
                disabledWhileDownloading: 'Actualizarea listei de mod-uri este dezactivată în timp ce există descărcări active.',
                lastUpdated: 'Ultima actualizare la: {date}',
                noApiInfo: 'Nu sunt disponibile informații de la API',
            },
            searchTerms: [
                'Actualizează lista de mod-uri online',
                'Verifică apariția unor mod-uri noi',
                'Curăță lista de mod-uri online din cache',
                'Resetează lista de mod-uri din cache',
            ],
        },
        refreshOnlineModList: {
            title: 'Actualizează lista de mod-uri online',
            description: 'Verifică apariția unor mod-uri noi. {status}',
            action: 'Actualizează',
            states: {
                refreshing: 'Actualizare...',
                error: 'Eroare în timpul actualizării listei de mod-uri: {message}',
                disabledWhileDownloading: 'Actualizarea listei de mod-uri este dezactivată în timp ce există descărcări active.',
                cacheDate: 'Data salvării în cache: {date}',
                noApiInfo: 'Nu sunt disponibile informații de la API',
            },
            searchTerms: [
                'Actualizează lista de mod-uri online',
                'Verifică apariția unor mod-uri noi',
                'Mod-uri Thunderstore',
            ],
        },
        resetGameInstallation: {
            title: 'Resetează instalația {gameName}',
            description: 'Repară problemele cauzate de fișiere corupte sau fișiere lăsate în urmă după tentative de modare manuală. Asta va șterge toate conținuturile dosarului {folderName} și va verifica fișierele prin Steam.',
            action: 'Resetează instalația',
            searchTerms: [
                'Resetează instalația {gameName}',
                'Validează fișierele',
                'Verifică integritatea',
                'Corupt',
                'Fișier',
            ],
        },
        showDependencyStrings: {
            title: 'Arată identificatorii de dependențe',
            description: 'Arată o listă de mod-uri instalate împreună cu identificatorii lor de versiune, așa cum apar în cadrul listei de dependențe a unui fișier manifest.json. Va arăta identificatorii de dependențe pentru {modCount} mod(-uri).',
            searchTerms: [
                'Arată identificatorii de dependențe',
            ],
        },
        steamDirectory: {
            title: 'Dosar Steam',
            description: 'Dosarul Steam care conține executabilul Steam.',
            value: 'Asta e modalitatea prin care {appName} va lansa jocul.',
            searchTerms: [
                'Schimbă dosarul Steam',
                'Vizualizează',
                'Dosare',
            ],
        },
        theme: {
            title: 'Temă',
            description: 'Alege între un aspect luminos sau întunecat al managerului.',
            light: 'Luminos',
            dark: 'Întunecat',
            searchTerms: [
                'Temă',
                'Luminos',
                'Întunecat',
                'Aspect',
            ],
        },
        toggleCdn: {
            title: 'Schimbă CDN-ul Thunderstore preferat',
            description: 'Schimbă CDN-ul până la repornirea aplicației. Asta ar putea să rezolve problemele de descărcare a mod-urilor.',
            action: 'Schimbă CDN-ul preferat',
            current: 'Actual: {label}',
            searchTerms: [
                'Schimbă CDN-ul Thunderstore preferat',
                'Comută',
            ],
        },
        updateAllMods: {
            title: 'Actualizează toate mod-urile',
            description: 'Actualizează rapid fiecare mod instalat până la ultimele lor versiuni. {status}',
            status: '1 mod are o actualizare disponibilă. | {count} mod-uri au o actualizare disponibilă.',
            searchTerms: [
                'Actualizează toate mod-urile',
            ],
        },
    }
};
