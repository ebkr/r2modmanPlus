import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'Masz mody, których nie można już znaleźć na Thunderstore.',
        action: 'Kliknij tutaj, aby przejrzeć pakiety.',
    },
    managerUpdate: {
        title: 'Dostępna jest aktualizacja aplikacji {appName}.',
        linkText: 'Kliknij tutaj, aby przejść do strony wydania.',
    },
    modListUpdate: {
        error: 'Błąd podczas odświeżania listy modów.',
        viewDetails: 'Wyświetl szczegóły błędu',
        willKeepTrying: 'Menedżer będzie nadal próbował odświeżać listę modów w tle.',
        errorOccurred: 'Wystąpił błąd podczas odświeżania listy modów z Thunderstore.',
        blockedByDownloads: 'Jednak lista modów nie może zostać odświeżona, gdy trwa pobieranie modów.',
        waitForDownloads: 'Przed kontynuowaniem poczekaj na zakończenie pobierania.',
        retryPrompt: 'Wystąpił błąd podczas odświeżania listy modów z Thunderstore. Czy chcesz {retryAction}?',
        retryAction: 'spróbować ponownie teraz',
    },
    updatableMods: {
        text: `
        Masz {numberOfModsWithUpdates} mod z dostępną aktualizacją. |
        Masz {numberOfModsWithUpdates} modów z dostępnymi aktualizacjami.
        `,
        updateAction: 'Zaktualizować wszystkie?',
    }
}
