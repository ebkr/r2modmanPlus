import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'Ai modificări care nu mai pot fi găsite pe Thunderstore.',
        action: 'Apasă aici pentru a verifica pachetele.',
    },
    managerUpdate: {
        title: 'O actualizare pentru {appName} este disponibilă.',
        linkText: 'Apasă aici pentru a te duce către pagina de descărcări.',
    },
    modListUpdate: {
        error: 'Eroare în timpul actualizării listei de modificări.',
        viewDetails: 'Vezi detaliile erorii',
        willKeepTrying: 'Managerul va încerca în continuare să actualizeze lista de modificări în fundal.',
        errorOccurred: 'A apărut o eroare în timpul actualizării listei de modificări din Thunderstore.',
        blockedByDownloads: 'Totuși, lista de modificări nu poate fi actualizată în timp ce sunt descărcate modificări în fundal.',
        waitForDownloads: 'Te rugăm să aștepți până ce descărcările se termină înainte de a continua.',
        retryPrompt: 'A apărut o eroare în timpul actualizării listei de modificări din Thunderstore. Dorești să {retryAction}?',
        retryAction: 'încerci încă o dată',
    },
    updatableMods: {
        text: `
        Ai {numberOfModsWithUpdates} modificare cu o actualizare disponibilă. |
        Ai {numberOfModsWithUpdates} modificări cu o actualizare disponibilă.
        `,
        updateAction: 'Actualizează toate?',
    }
}
