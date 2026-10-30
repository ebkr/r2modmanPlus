import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: 'Запустить с модами',
            startVanilla: 'Запустить без модов'
        },
        modsActions: {
            label: 'Моды',
            installed: 'Установленные',
            online: 'Онлайн'
        },
        otherActions: {
            label: 'Другое',
            configEditor: 'Редактор конфигов',
            settings: 'Настройки',
            help: 'Справка',
        },
        profileSwitcher: {
            label: 'Профиль',
            gameIconAltText: 'Изображение игры',
            close: 'Закрыть',
        },
        activityBar: {
            exportProfile: 'Экспорт профиля',
            exportToCode: 'Экспорт в код',
            exportToFile: 'Экспорт в файл',
            refreshingModList: 'Обновление списка модов: {progress}%',
        }
    },
    installed: {
        noModsInstalled: {
            title: 'Похоже, у вас не установлено ни одного мода',
            content: 'Нажмите вкладку "Онлайн" слева, чтобы просмотреть все доступные моды.',
        },
        searchAndSort: {
            search: {
                label: 'Поиск',
                placeholder: 'Поиск установленного мода',
            },
            sort: {
                label: 'Сортировка',
                disabledPositions: {
                    label: 'Отключённые',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: 'Устаревший',
                disabled: 'Отключён'
            },
            display: {
                byline: 'v{version} от {author}',
                installedAt: 'Установлен: {formattedDate}',
                releasedAt: 'Опубликован: {formattedDate}',
            },
            concerning: {
                recommendation: 'Рекомендуется удалить этот мод.',
            },
            tooltips: {
                updateAvailable: 'Доступно обновление',
                dependencyIssue: 'Есть проблема с зависимостями этого мода',
                disable: 'Отключить',
                enable: 'Включить',
                donate: 'Поддержать автора мода',
                willNotBeUsed: 'Этот мод не будет использоваться в игре',
            },
            actions: {
                uninstall: 'Удалить',
                disable: 'Отключить',
                enable: 'Включить',
                associated: 'Связанные',
                openWebsite: 'Сайт',
                update: 'Обновить',
                downloadDependency: 'Скачать зависимость',
                enableSpecific: 'Включить {dependencyName}',
                donate: 'Поддержать',
            }
        },
        expandableCard: {
            imageAltText: 'Изображение мода',
            funkyModeAltText: 'Оверлей Funky Mode',
            tooltips: {
                dragToReorder: 'Перетащите, чтобы изменить порядок',
                expand: 'Развернуть',
                collapse: 'Свернуть',
            }
        },
    },
    online: {
        previewPanel: {
            author: 'Автор: {author}',
            metadata: {
                downloads: 'Скачиваний: {downloads}',
                likes: 'Лайков: {likes}',
                lastUpdated: 'Обновлён: {date}',
                categories: 'Категории: {categories}',
            },
            actions: {
                download: 'Скачать',
                viewOnline: 'Открыть на сайте',
                donate: 'Поддержать',
            },
            tabs: {
                readme: 'README',
                changelog: 'CHANGELOG',
                dependencies: 'Зависимости ({dependencyCount})',
            },
            packageInformation: 'Информация о пакете',
            nsfwWarning: 'Этот мод может содержать материалы для взрослых',
            fetchingData: 'Загрузка данных',
            noDependencies: 'У этого мода нет зависимостей',
            unableToFetchReadme: 'Не удалось загрузить README',
            unableToFetchChangelog: 'Не удалось загрузить CHANGELOG',
        },
        topbar: {
            search: {
                label: 'Поиск',
                placeholder: 'Поиск мода',
            },
            sort: 'Сортировка',
            filter: 'Фильтр',
        },
        pagination: {
            changePageInfo: 'Используйте номера ниже, чтобы сменить страницу',
            noFoundMods: 'Моды по запросу не найдены',
            noMods: 'Нет доступных модов',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: 'Закреплён',
                    long: 'Закреплён на Thunderstore'
                },
                deprecated: {
                    short: 'Устаревший',
                    long: 'Этот мод может быть нерабочим'
                },
                donate: 'Поддержать автора мода',
                installed: 'Мод уже установлен',
                nsfw: 'Мод помечен как NSFW',
            },
            mod: {
                author: 'Автор: {author}'
            },
            actions: {
                download: 'Скачать',
                website: 'Сайт',
            }
        }
    },
    actions: {
        locateGameExecutable: 'Указать путь к исполняемому файлу {gameName}',
        selectExecutable: 'Выбрать исполняемый файл',
        locateGameLaunchHelper: 'Указать путь к gamelaunchhelper',
        locateSteamExecutable: 'Указать путь к исполняемому файлу Steam',
    }
}
