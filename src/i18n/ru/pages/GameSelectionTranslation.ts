import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: 'Выбор игры',
            server: 'Выбор сервера',
        },
        subtitle: {
            game: 'Для какой игры вы управляете модами?',
            server: 'Для какого выделенного сервера вы управляете модами?',
        }
    },
    migrationNotice: {
        requiresUpdate: 'Менеджер был обновлён и должен выполнить фоновую работу.',
        actionsDisabled: 'Выбор игры недоступен, пока работа не завершится.',
    },
    tabs: {
        game: 'Игра',
        server: 'Сервер'
    },
    noResults: {
        empty: {
            game: 'Игры по запросу «{filterText}» не найдены',
            server: 'Серверы по запросу «{filterText}» не найдены',
        },
        title: 'Не можете найти то, что ищете?',
        suggestion: 'Попробуйте другое название или ключевое слово. Возможно, эта игра пока не поддерживается.',
    },
    actions: {
        select: {
            game: 'Выбрать игру',
            server: 'Выбрать сервер'
        },
        setAsDefault: 'Сделать по умолчанию',
        request: {
            game: 'Запросить новую игру',
            server: 'Запросить новый сервер',
        }
    },
    filter: {
        placeholder: {
            game: 'Поиск игры',
            server: 'Поиск сервера',
        }
    },
    cardView: {
        imageAltText: 'Изображение игры',
        newBadge: 'Новое',
        sections: {
            favourites: 'Избранное',
            games: 'Игры',
            servers: 'Серверы',
            newlyAdded: {
                games: 'Новые игры',
                servers: 'Новые серверы',
            },
            searchResults: 'Результаты поиска',
            hiddenGames: 'Скрытые игры',
            hiddenGamesNotice: 'Эти игры больше не поддерживаются.',
        }
    },
    ecosystemUpdate: {
        updating: 'Обновление списка игр',
        upToDate: 'У вас актуальный список игр',
        failed: 'Не удалось обновить список игр',
        retry: 'Повторить обновление списка игр',
    },
    loading: 'Подготовка игр',
}
