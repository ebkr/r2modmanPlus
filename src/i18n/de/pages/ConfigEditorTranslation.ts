import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Konfigurationseditor',
        subtitle: 'Wählen Sie eine Konfigurationsdatei zum Bearbeiten aus'
    },
    warning: {
        content: 'Konfigurationsdateien werden nach dem Start des Spiels erstellt, sobald die Mod mindestens einmal installiert und gestartet wurde.'
    },
    loading: 'Suche nach Konfigurationsdateien',
    actions: {
        delete: 'Löschen',
        editConfig: 'Konfiguration bearbeiten',
        openFile: 'Datei öffnen',
        search: {
            label: 'Suchen',
            placeholder: 'Nach einer Konfigurationsdatei suchen',
        },
        sort: {
            label: 'Sortieren'
        }
    },
    editConfig: {
        actions: {
            cancel: 'Abbrechen',
            save: 'Speichern',
            showMore: 'Mehr anzeigen',
            showLess: 'Weniger anzeigen'
        },
        sections: 'Abschnitte',
        hiddenCount: '(1 ausgeblendet) | ({count} ausgeblendet)',
        selectOption: 'Option auswählen',
        subtitle: 'Konfigurationsdatei wird bearbeitet'
    }
};
