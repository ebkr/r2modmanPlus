import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Edytor konfiguracji',
        subtitle: 'Wybierz plik konfiguracyjny do edycji'
    },

    warning: {
        content: 'Pliki konfiguracyjne są generowane przy pierwszym uruchomieniu gry z zainstalowanym modem.'
    },

    loading: 'Wyszukiwanie plików konfiguracyjnych',

    actions: {
        delete: 'Usuń',
        editConfig: 'Edytuj konfigurację',
        openFile: 'Otwórz plik',
        search: {
            label: 'Szukaj',
            placeholder: 'Wyszukaj plik konfiguracyjny',
        },
        sort: {
            label: 'Sortuj'
        }
    },

    editConfig: {
        actions: {
            cancel: 'Anuluj',
            save: 'Zapisz',
            showMore: 'Pokaż więcej',
            showLess: 'Pokaż mniej'
        },
        sections: 'Sekcje',
        hiddenCount: '(1 ukryty) | ({count} ukryte)',
        selectOption: 'Wybierz opcję',
        subtitle: 'Edycja pliku konfiguracyjnego'
    }
};
