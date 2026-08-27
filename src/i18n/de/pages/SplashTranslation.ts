import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: 'Starte {appName}',
    gameUpdatesWarning: 'Spielupdates können Mods beschädigen. Wenn ein neues Update veröffentlicht wurde, habe bitte etwas Geduld.',
    menu: {
        helpLabel: 'Hilfe',
        helpItems: {
            about: 'Über',
            faq: 'FAQ'
        },
    },
    actions: {
        goBack: 'Zurück',
    },
    content: {
        main: {
            didYouKnow: 'Wusstest du schon?',
            externalInstallWithModManager: `
                            Du kannst die Schaltfläche "Mit Mod Manager installieren" auf
                            Thunderstore verwenden, um Mods mit {appName} zu installieren.
                        `,
            goToThunderstore: 'Zu Thunderstore',
            exportProfile: `
                        Du kannst das ausgewählte Profil über die Einstellungen entweder als Datei oder als Code exportieren.
                        So kannst du deine Mod-Liste ganz einfach mit Freunden teilen!
                        `,
            havingTrouble: {
                title: 'Probleme?',
                body: 'Sende einen Screenshot des Fehlers im Support-Kanal des {appName}-Discord-Servers.',
                serverLinkText: 'Dem {appName}-Discord-Server beitreten',
            },
        },
        about: {
            title: 'Über {appName}',
            creator: 'Erstellt von Ebkr.',
            techStack: {
                builtUsing: 'Die Anwendung wurde mit Quasar erstellt und verwendet den folgenden Technologie-Stack:',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: 'FAQ',
            howToGetStarted: {
                title: 'Wie fange ich an?',
                body: 'Gehe zum Tab "Online" und lade deine Lieblingsmods herunter. Klicke auf "Mit Mods starten" und viel Spaß.'
            },
            startingWithMods: {
                title: 'Das Spiel mit Mods starten',
                body: `
                            Du musst das Spiel über den Manager starten.
                            Ein Start über Steam funktioniert ohne manuelle Änderungen nicht.
                            `
            }
        }
    },
    states: {
        preparing: 'Wird vorbereitet',
        checkingForUpdates: 'Suche nach Updates',
        checkingForLocalCache: 'Suche nach der Mod-Liste im lokalen Cache',
        checkingForThunderstoreUpdates: 'Suche nach Aktualisierungen der Mod-Liste auf Thunderstore',
        loadingLatestThunderstoreList: 'Lade die neueste Mod-Liste von Thunderstore',
        pruningLocalCache: 'Entferne gelöschte Mods aus dem lokalen Cache',
        processingModList: 'Verarbeite die Mod-Liste',
    }
}
