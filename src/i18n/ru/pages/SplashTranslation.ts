import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: 'Запуск {appName}',
    gameUpdatesWarning: 'Обновления игры могут сломать моды. Если вышло новое обновление, наберитесь терпения.',
    menu: {
        helpLabel: 'Справка',
        helpItems: {
            about: 'О программе',
            faq: 'Вопросы и ответы'
        },
    },
    actions: {
        goBack: 'Назад',
    },
    content: {
        main: {
            didYouKnow: 'Знаете ли вы?',
            externalInstallWithModManager: `
                            Вы можете использовать кнопку «Install with Mod Manager» на
                            Thunderstore, чтобы устанавливать моды через {appName}.
                        `,
            goToThunderstore: 'Перейти на Thunderstore',
            exportProfile: `
                        Вы можете экспортировать выбранный профиль из настроек в виде файла или кода.
                        Так легко делиться списком модов с друзьями!
                        `,
            havingTrouble: {
                title: 'Возникли проблемы?',
                body: 'Отправьте скриншот ошибки в канал поддержки Discord-сервера {appName}.',
                serverLinkText: 'Присоединиться к Discord-серверу {appName}',
            },
        },
        about: {
            title: 'О {appName}',
            creator: 'Создан Ebkr.',
            techStack: {
                builtUsing: 'Приложение создано на Quasar, который использует следующий стек:',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: 'Вопросы и ответы',
            howToGetStarted: {
                title: 'С чего начать?',
                body: 'Перейдите на вкладку «Онлайн» и скачайте любимые моды. Нажмите «Запустить с модами» и наслаждайтесь.'
            },
            startingWithMods: {
                title: 'Запуск игры с модами',
                body: `
                            Игру нужно запускать из менеджера.
                            Запуск через Steam не сработает без ручных изменений.
                            `
            }
        }
    },
    states: {
        preparing: 'Подготовка',
        checkingForUpdates: 'Проверка обновлений',
        checkingForLocalCache: 'Проверка списка модов в локальном кеше',
        checkingForThunderstoreUpdates: 'Проверка обновлений списка модов на Thunderstore',
        loadingLatestThunderstoreList: 'Загрузка последнего списка модов с Thunderstore',
        pruningLocalCache: 'Очистка локального кеша от удалённых модов',
        processingModList: 'Обработка списка модов',
    }
}
