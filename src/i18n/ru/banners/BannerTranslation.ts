import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'У вас есть моды, которые больше не найти на Thunderstore.',
        action: 'Нажмите, чтобы просмотреть пакеты.',
    },
    managerUpdate: {
        title: 'Доступно обновление {appName}.',
        linkText: 'Нажмите, чтобы перейти на страницу релиза.',
    },
    modListUpdate: {
        error: 'Ошибка обновления списка модов.',
        viewDetails: 'Посмотреть подробности ошибки',
        willKeepTrying: 'Менеджер продолжит пытаться обновить список модов в фоне.',
        errorOccurred: 'При обновлении списка модов с Thunderstore произошла ошибка.',
        blockedByDownloads: 'Однако список модов нельзя обновить, пока идёт скачивание модов.',
        waitForDownloads: 'Дождитесь завершения загрузок, чтобы продолжить.',
        retryPrompt: 'При обновлении списка модов с Thunderstore произошла ошибка. Хотите {retryAction}?',
        retryAction: 'повторить сейчас',
    },
    updatableMods: {
        text: `
        {numberOfModsWithUpdates} мод с доступным обновлением. |
        {numberOfModsWithUpdates} мода с доступным обновлением. |
        {numberOfModsWithUpdates} модов с доступным обновлением. |
        {numberOfModsWithUpdates} мода с доступным обновлением.
        `,
        updateAction: 'Обновить все?',
    }
}
