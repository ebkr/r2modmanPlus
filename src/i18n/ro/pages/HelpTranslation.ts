import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: 'Ajutor',
        subtitle: 'Probleme întâlnite des și soluții potențiale pentru ele'
    },
    tabs: {
        general: 'General',
        gameWontStart: 'Jocul nu se pornește',
        modsNotShowing: 'Mod-urile nu apar',
        updating: 'Actualizare',
    },
    general: {
        gettingStarted: {
            title: 'Începe prin instalarea mod-urilor',
            whereToFindMods: `
            Treci la fila "{''}@:translations.pages.manager.navigation.modsActions.online{''}", caută un mod, și apasă pe ”Descărcare”.
            Managerul va descărca în același timp și dependențele mod-ului pentru a-ți salva din timp.
            `,
            onceInstalled: 'După ce ai instalat mod-urile pe care vrei să le folosești, apasă pe {startModdedAction} în colțul din stânga sus.',
        },
        slowGame: {
            title: 'Jocul funcționează greu sau se blochează?',
            likelyCause: `
            Asta poate fi cauzată de către un mod care aruncă erori.
            Una din soluții e să încerci să dezactivezi o jumătate din mod-urile tale și să verifici dacă problema persistă.
            `,
            issuePersisting: `
            Dacă problema persistă, dezactivează o altă jumătate din mod-urile rămase.
            Continuă să faci asta până la rezolvarea problemei.
            `,
            ifStutters: 'În cazul blocărilor, pot exista moduri de optimizare care pot ajuta cu asta.',
        },
        dedicatedServers: {
            title: 'Servere dedicate',
            content: `
            Serverele dedicate nu au sprijin direct în cadrul managerului, totuși o soluție ar fi să copii
            conținuturile dosarului profilului în cadrul dosarului serverului tău dedicat.
            `,
        },
        launchingExternally: {
            title: 'Lansarea jocului în afara managerului de mod-uri',
            howTo: 'În mod intenționat, când lansezi jocul prin Steam, el va fi lansat în mod ”vanilla” (fără mod-uri).',
            whereToPlace: 'Va trebui să inserezi parametrii de lansare corespunzători în cadrul opțiunilor din platforma folosită de către tine.',
            forSteam: 'Pentru Steam, parametrii pot fi specificați în cadrul proprietăților jocului.',
                yourCurrentArgument: 'Parametrii tăi curenți ar fi:',
                loaderNotInstalled: 'Acești parametri vor fi disponibili după instalarea unui încărcător de mod-uri.',
                copyArguments: 'Copie parametrii de lansare',
        },
    },
    gameWontStart: {
        errorModal: {
            title: 'O casetă roșie apare când încerc să pornesc jocul',
            solution: 'De obicei, este o sugestie în partea de jos a casetei roșii. Ea poate să rezolve problema.',
        },
        redirectedToStorePage: {
            title: 'Sunt trimis către pagina de magazin în Steam',
            solution: 'Trebuie să ai o copie legală a jocului când folosești {appName}. Poți să o cumperi de pe pagina de magazin.',
        },
        consoleCloses: {
            title: 'O fereastră cu text apare și se închide imediat',
            tryRunning: 'Încearcă să rulezi ”Resetează instalare {gameName}” pe ecranul de Setări.', // TODO - Reference translation via Settings screen
            ifPersists: 'Dacă problema persistă, închide forțat Steam și lansează cu mod-uri în timp ce Steam este închis.',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: 'Soluții potențiale',
            instructToWiki: 'Problemele cele mai frecvente pot fi rezolvate prin urmărirea instrucțiunilor exact cum sunt afișate pe wiki.',
            goToWiki: 'Accesează wiki-ul',
        }
    },
    updating: {
        autoUpdates: {
            title: 'Actualizări automate',
            whenDoesItUpdate: 'Managerul se actualizează automat la închidere dacă o actualizare este disponibilă.',
            downloadedInBackground: 'Actualizările sunt descărcate în fundal.',
            promptToRunOldInstaller: 'E posibil să fii solicitat să rulezi "{oldInstaller}" ca admin. Acesta este programul de actualizare.',
            ifProblemOccurs: 'Dacă o problemă apare după o actualizare, descarcă și rulează cel mai actual program de instalare.',
        },
        ignoreUpdates: {
            title: 'Nu vreau actualizări',
            content: 'Pe GitHub sunt disponibile versiuni portabile care nu se actualizează automat. Totuși, vei fi notificat că o actualizare este disponibilă.'
        }
    }
}
