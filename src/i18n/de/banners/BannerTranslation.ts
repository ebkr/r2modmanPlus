import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'Du hast Mods, die im Thunderstore nicht mehr gefunden werden können.',
        action: 'Klicke hier, um die Pakete zu überprüfen.',
    },
    managerUpdate: {
        title: 'Ein Update für {appName} ist verfügbar.',
        linkText: 'Klicke hier, um zur Release-Seite zu gelangen.',
    },
    modListUpdate: {
        error: 'Fehler beim Aktualisieren der Mod-Liste.',
        viewDetails: 'Fehlerdetails anzeigen',
        willKeepTrying: 'Der Manager wird weiterhin versuchen, die Mod-Liste im Hintergrund zu aktualisieren.',
        errorOccurred: 'Beim Aktualisieren der Mod-Liste von Thunderstore ist ein Fehler aufgetreten.',
        blockedByDownloads: 'Die Mod-Liste kann jedoch nicht aktualisiert werden, solange Mod-Downloads laufen.',
        waitForDownloads: 'Bitte warte, bis die Downloads abgeschlossen sind, bevor du fortfährst.',
        retryPrompt: 'Beim Aktualisieren der Mod-Liste von Thunderstore ist ein Fehler aufgetreten. Möchtest du es {retryAction}?',
        retryAction: 'jetzt erneut versuchen',
    },
    updatableMods: {
        text: `
        Du hast {numberOfModsWithUpdates} Mod mit einem verfügbaren Update. |
        Du hast {numberOfModsWithUpdates} Mods mit verfügbaren Updates.
        `,
        updateAction: 'Alle aktualisieren?',
    }
}
