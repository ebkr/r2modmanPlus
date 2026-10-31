import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: 'Не удалось задать папку Steam',
        steamExecutableNotSelected: 'Исполняемый файл Steam не выбран.',
        solution: 'Если эта ошибка появилась, но исполняемый файл указан верно, запустите программу от имени администратора.'
    },
    failedToSetTheGameFolder: {
        title: 'Не удалось задать папку {gameName}',
        listedExecutableNames: 'Исполняемый файл должен быть одним из следующих: «{options}».',
        executableMustBeOneOf: 'Выбранный исполняемый файл должен быть одним из следующих:',
        solution: 'Если эта ошибка появилась, но исполняемый файл указан верно, запустите программу от имени администратора.'
    },
    clearingGameDirectory: {
        title: 'Очистить папку установки {gameName}',
        warning: 'Все файлы в папке игры будут удалены.',
        steamWillBeStarted: `
            Папка игры будет удалена, а Steam получит запрос на проверку целостности {gameName}.
        `,
        checkSteamForProgress: `
            Следите за ходом проверки в окне Steam.
            Если окно ещё не появилось, наберитесь терпения.
            `,
        confirmation: 'Я понимаю'
    },
    dependencyStrings: {
        title: 'Список строк зависимостей',
        dependency: '{modName}-{versionNumber}',
        close: 'Закрыть'
    },
    launchArguments: {
        title: 'Задать свои параметры запуска',
        someProvidedByDefault: 'Некоторые параметры заданы по умолчанию:',
        moddedLabel: 'С модами:',
        availableAfterInstallingLoader: 'Эти параметры станут доступны после установки загрузчика модов.',
        vanillaLabel: 'Без модов:',
        pleaseNote: `
            Обратите внимание: они передаются исполняемому файлу Steam.
            Будьте осторожны при вводе своих параметров запуска.
            `,
        placeholder: 'Введите параметры',
        updateArguments: 'Обновить параметры запуска',
    },
    categorySelector: {
        selectCategory: 'Выберите категорию',
        noCategoriesSelected: 'Категории не выбраны',
    },
    importLocalMod: {
        title: 'Импорт мода из файла',
        dialogTitle: 'Импорт локального мода из файла',
        actions: {
            selectFile: 'Выбрать файл',
            importLocalMod: 'Импортировать локальный мод',
        },
        content: {
            instructToSelect: 'Выберите zip-архив или DLL для импорта.',
            dataEntryInfo: `
            В zip-архивах с файлом манифеста часть данных заполнится автоматически.
            Если манифеста нет, данные придётся ввести вручную.
            `,
            waitingForSelection: 'Ожидание файла. Это может занять минуту.',
            form: {
                modName: {
                    label: 'Название мода',
                    placeholder: 'Введите название мода',
                },
                modAuthor: {
                    label: 'Автор',
                    placeholder: 'Введите имя автора',
                },
                description: {
                    label: 'Описание (необязательно)',
                    placeholder: 'Введите описание'
                },
                version: {
                    label: 'Версия',
                    majorLabel: 'Мажорная',
                    minorLabel: 'Минорная',
                    patchLabel: 'Патч'
                }
            }
        },
        validationMessages: {
            modNameEmpty: 'Название мода не должно быть пустым.',
            authorNameEmpty: 'Имя автора не должно быть пустым.',
            invalidVersion: 'Мажорная, минорная версия и патч должны быть целыми числами больше 0.',
            nonNumericVersion: 'Мажорная, минорная версия и патч должны быть числами.',
            noProfileSelected: 'Профиль не выбран.'
        }
    },
    concerningPackage: {
        title: 'Проверка {modName}',
        notFound: 'Этот мод изначально был скачан с Thunderstore, но больше не найден на сайте.',
        whyRemoved: 'Моды могут удаляться по просьбе автора, за нарушение правил или на время проверки модераторами.',
        recommendation: 'Обычно моды, удалённые с Thunderstore, рекомендуется убрать.',
        exportWarning: 'Другие люди не смогут импортировать этот мод из экспортированных профилей.',
        actions: {
            markSafe: 'Пометить версию как безопасную',
            remove: 'Убрать мод',
            review: 'Проверить мод',
        }
    },
    gameRunning: {
        starting: '{gameName} запускается',
        launchingViaSteam: '{gameName} запускается через Steam',
        closeToContinue: 'Закройте это сообщение, чтобы продолжить работу с модами.',
        takingAWhile: 'Если это занимает много времени, скорее всего, запускается Steam.',
        bePatient: 'Наберитесь терпения и приятной игры!',
        close: 'Закрыть',
    },
    error: {
        title: 'Ошибка',
        suggestion: 'Рекомендация',
        close: 'Закрыть',
    },
    disableMod: {
        title: 'Отключение {modName}',
        dependantsWarning: 'Другие моды зависят от этого мода. Выберите {disableAllAction}, чтобы отключить зависимые моды, иначе они могут выдать ошибки.',
        modsToBeDisabled: 'Моды, которые будут отключены',
        actions: {
            disableAll: 'Отключить все',
            disableAllRecommended: 'Отключить все (рекомендуется)',
            disableOnly: 'Отключить только {modName}',
        }
    },
    uninstallMod: {
        title: 'Удаление {modName}',
        dependantsWarning: 'Другие моды зависят от этого мода. Выберите {uninstallAllAction}, чтобы удалить зависимые моды, иначе они могут выдать ошибки.',
        modsToBeUninstalled: 'Моды, которые будут удалены',
        actions: {
            uninstallAll: 'Удалить все',
            uninstallAllRecommended: 'Удалить все (рекомендуется)',
            uninstallOnly: 'Удалить только {modName}',
        }
    },
    associatedMods: {
        title: 'Моды, связанные с {modName}',
        dependencies: 'Зависимости',
        dependants: 'Зависимые моды',
        none: 'У этого мода нет зависимостей или зависимых модов.',
        done: 'Готово',
    },
    codeExport: {
        title: 'Профиль экспортирован',
        description: 'Код скопирован в буфер обмена, но его также можно скопировать вручную ниже:',
        done: 'Готово',
        copied: 'Скопировано в буфер обмена',
    },
    downloadProgress: {
        states: {
            downloading: 'Скачивание {modName}',
            installing: 'Установка {modName}',
        },
        complete: 'Загрузка завершена',
        close: 'Закрыть',
        downloadProgress: 'Скачивание: {progress}% из {totalSize}',
        installProgress: 'Установка: {progress}%',
        extractionProgress: 'Распаковка: {progress}% из {totalSize}',
        waitingForDownload: 'Установка: ожидание завершения загрузки',
    },
    downloadModVersionSelect: {
        title: 'Выберите версию {modName} для скачивания',
        content: {
            recommendedDisclaimer: 'Рекомендуется выбирать последнюю версию всех модов.',
            outdatedModsAdvice: 'Использование устаревших версий может вызвать проблемы.',
        },
        tags: {
            select: 'Нужно выбрать версию',
            recommended: '{version} — рекомендуемая версия',
            latest: '{version} — последняя версия',
            outdated: '{version} — устаревшая версия'
        },
        download: 'Скачать с зависимостями',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: 'Нет модов для обновления',
            content: 'Либо все установленные моды актуальны, либо моды не установлены.',
            close: 'Закрыть',
        },
        hasModsToUpdate: {
            title: 'Обновить все установленные моды',
            content: {
                willBeUpdated: 'Все установленные моды будут обновлены до последних версий.',
                missingDependenciesInstalled: 'Все недостающие зависимости будут установлены.',
                whatWillHappen: 'Следующие моды будут скачаны и установлены:',
                modUpdatedTo: '{modName} будет обновлён до версии: {version}',
            },
            updateAll: 'Обновить все',
        }
    },
    launchType: {
        title: 'Настроить способ запуска',
        auto: {
            NATIVE: 'Игра будет запущена с параметром «Native»',
            PROTON: 'Игра будет запущена с параметром «Proton»',
        },
        native: {
            unsureWrapperArgsPresent: 'Не удалось определить, заданы ли необходимые параметры обёртки.',
            addArgumentsInfo: 'Если вы ещё не сделали это вручную, добавьте следующие параметры запуска в свойства игры в Steam:',
        },
        actions: {
            copyLaunchArgs: 'Скопировать параметры запуска',
            update: 'Обновить'
        }
    },
    modFilter: {
        title: 'Фильтр категорий модов',
        languageDisclaimer: 'Категории предоставляются Thunderstore и не могут быть переведены.',
        selectors: {
            atLeastOneCategory: 'Моды должны относиться хотя бы к одной из этих категорий',
            allCategories: 'Моды должны относиться ко всем этим категориям',
            noneCategories: 'Моды не должны относиться ни к одной из этих категорий'
        },
        allowNsfw: 'Разрешить NSFW-моды (возможно, для взрослых)',
        showDeprecated: 'Показывать устаревшие моды',
        apply: 'Применить фильтры'
    },
    sort: {
        title: 'Изменить порядок модов',
        sortBehaviour: 'Способ сортировки',
        sortDirection: 'Направление сортировки',
        close: 'Закрыть',
    },
    createProfile: {
        title: 'Создание профиля',
        description: 'Этот профиль будет хранить собственные моды независимо от других профилей.',
        tagStates: {
            required: 'Нужно ввести название профиля',
            valid: '«{profileName}» — допустимое название профиля',
            error: '«{profileName}» уже используется или содержит недопустимые символы'
        },
        actions: {
            create: 'Создать'
        }
    },
    deleteProfile: {
        title: 'Удаление профиля',
        content: {
            resultingAction: 'Все моды, установленные в этом профиле, и их файлы конфигурации будут удалены.',
            preventAction: 'Если это произошло случайно, нажмите на затемнённую область или на крестик в правом верхнем углу.',
            confirmation: 'Вы уверены, что хотите удалить этот профиль?',
        },
        actions: {
            delete: 'Удалить профиль',
        }
    },
    renameProfile: {
        title: 'Переименование профиля',
        content: 'Этот профиль будет хранить собственные моды независимо от других профилей.',
        actions: {
            rename: 'Переименовать',
        },
        tagStates: {
            required: 'Нужно ввести название профиля',
            valid: '«{profileName}» — допустимое название профиля',
            error: '«{profileName}» уже используется или содержит недопустимые символы'
        },
    },
    importProfile: {
        dialogTitle: 'Импорт профиля',
        dialogButton: 'Импортировать',
        states: {
            fileCodeSelection: {
                title: 'Как вы импортируете профиль?',
                actions: {
                    fromFile: 'Из файла',
                    fromCode: 'Из кода'
                }
            },
            fromFile: {
                title: 'Загрузка файла',
                content: 'Откроется окно выбора файла. После выбора профиля может потребоваться несколько секунд.',
            },
            importCode: {
                title: 'Введите код профиля',
                enterCodePlaceholder: 'Введите код профиля',
                tagStates: {
                    invalid: 'Неверный код, проверьте на опечатки',
                },
                actions: {
                    loading: 'Загрузка',
                    proceed: 'Продолжить'
                }
            },
            refresh: {
                title: 'Обновление списка модов онлайн',
                content: {
                    description: `
                    Некоторые пакеты в профиле не распознаны менеджером модов.
                    Обновление списка модов онлайн может решить проблему. Подождите.
                    `,
                    waitingForModDownloads: 'Ожидание завершения загрузок модов перед обновлением списка модов онлайн',
                }
            },
            reviewImport: {
                title: 'Пакеты для установки',
                content: {
                    notFoundDisclaimer: 'Эти пакеты из профиля не найдены на Thunderstore и не будут установлены:',
                    ensureCorrectProfile: 'Убедитесь, что профиль предназначен для выбранной игры.',
                    packagesWillBeInstalled: 'Эти пакеты будут установлены:',
                },
                actions: {
                    acknowledgement: 'Я понимаю, что некоторые моды не будут импортированы',
                    proceed: 'Импортировать'
                }
            },
            willImportOrUpdate: {
                title: 'Вы хотите обновить существующий профиль или создать новый?',
                actions: {
                    newProfile: 'Импортировать новый профиль',
                    existingProfile: 'Обновить существующий профиль',
                }
            },
            addProfile: {
                title: 'Импорт профиля',
                content: {
                    create: {
                        description: 'Этот профиль будет хранить собственные моды независимо от других профилей.'
                    },
                    update: {
                        contentsWillBeOverwritten: 'Всё содержимое профиля будет заменено содержимым из кода/файла.',
                        selectProfile: 'Выберите профиль ниже:'
                    }
                },
                tagStates: {
                    required: 'Нужно ввести название профиля',
                    valid: '«{profileName}» — допустимое название профиля',
                    error: '«{profileName}» уже используется или содержит недопустимые символы'
                },
                actions: {
                    create: 'Создать',
                    update: 'Обновить профиль: {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: 'Скачивание модов: {progress}%',
                    downloadingModsWithGoal: `Скачивание модов: {progress}% из {totalSize}`,
                    cleaningUp: 'Очистка',
                    applyChanges: 'Применение изменений к обновлённому профилю',
                    copyingModsToProfile: 'Копирование модов в профиль: {progress}%',
                    copyingConfigsToProfile: 'Копирование конфигов в профиль: {progress}%'

                },
                content: {
                    waitMessage: 'Это может занять время: файлы скачиваются, распаковываются и копируются.',
                    doNotClose: 'Пожалуйста, не закрывайте {appName}.'
                }
            }
        }
    },
    platform: {
        header: "Какой магазин управляет вашей игрой?",
        selectAction: "Выбрать платформу",
    },
    settingsLoader: {
        managerProblem: 'Это проблема самого менеджера модов. Если доступна более новая версия менеджера, попробуйте установить её.',
        loadFailed: 'Не удалось загрузить локальные настройки пользователя. Кнопка ниже сбросит настройки, но учтите: настройки для всех игр будут потеряны, и это нельзя отменить.',
        resetAction: 'Сбросить настройки',
        resetFailed: 'Не удалось сбросить настройки. Вы можете попробовать сбросить их вручную, следуя этим {instructionsLink}.',
        instructionsLinkText: 'инструкциям',
        resetDidNotHelp: 'Локальные настройки сброшены, но проблема с их загрузкой не решена. Если доступна более новая версия менеджера, попробуйте установить её.'
    },
    actions: {
        close: 'Закрыть',
    },
}
