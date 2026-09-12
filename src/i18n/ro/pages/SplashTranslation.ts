import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: 'Lansare {appName}',
    gameUpdatesWarning: 'Actualizările de joc pot strica mod-urile. Dacă o actualizare nouă a fost lansată, te rugăm să ai răbdare.',
    menu: {
        helpLabel: 'Ajutor',
        helpItems: {
            about: 'Despre',
            faq: 'Întrebări frecvente'
        },
    },
    actions: {
        goBack: 'Înapoi',
    },
    content: {
        main: {
            didYouKnow: 'Ai știut despre asta?',
            externalInstallWithModManager: `
            Poți să folosești butonul ”Install with Mod Manager” pe
            Thunderstore pentru a instala mod-uri folosind {appName}.
            `,
            goToThunderstore: 'Accesează Thunderstore',
            exportProfile: `
            Poți exporta profilul selectat din ecranul de setări ori sub formă de fișier, ori sub formă de cod.
            Asta face mai facilă împărtășirea listei de mod-uri cu prieteni!
            `,
            havingTrouble: {
                title: 'Ai probleme?',
                body: 'Trimite o captură de ecran a erorii în canalul de suport a serverului Discord pentru {appName}.',
                serverLinkText: 'Alătură-te serverului Discord pentru {appName}',
            },
        },
        about: {
            title: 'Despre {appName}',
            creator: 'Este creat de către Ebkr.',
            techStack: {
                builtUsing: 'Aplicația a fost construită folosind Quasar, care furnizează următoarea stivă de tehnologii:',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: 'Întrebări frecvente',
            howToGetStarted: {
                title: 'Cum încep?',
                body: 'Accesează fila Online și descarcă mod-urile tale favorite. Apasă pe "Lansează cu mod-uri" și distrează-te.'
            },
            startingWithMods: {
                title: 'Lansarea jocului cu mod-uri',
                body: `
                Trebuie să lansezi jocul prin intermediul managerului.
                Lansarea prin Steam nu va funcționa fără modificări manuale.
                `
            }
        }
    },
    states: {
        preparing: 'Pregătire',
        checkingForUpdates: 'Căutăm actualizări',
        checkingForLocalCache: 'Căutăm lista de mod-uri în cache-ul local',
        checkingForThunderstoreUpdates: 'Căutăm actualizări ale listei de mod-uri din Thunderstore',
        loadingLatestThunderstoreList: 'Încărcăm cea mai actuală listă de mod-uri din Thunderstore',
        pruningLocalCache: 'Scoatem mod-urile șterse din cache-ul local',
        processingModList: 'Procesăm lista de mod-uri',
    }
}
