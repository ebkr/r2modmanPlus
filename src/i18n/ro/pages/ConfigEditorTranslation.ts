import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Editor de configurări',
        subtitle: 'Selectează un fișier de configurare pentru a-l edita'
    },
    warning: {
        content: 'Fișierele de configurare sunt create după lansarea jocului măcar o dată, cu mod-ul instalat.'
    },
    loading: 'Căutăm fișiere de configurare',
    actions: {
        delete: 'Șterge',
        editConfig: 'Editează configurare',
        openFile: 'Deschide fișier',
        search: {
            label: 'Caută',
            placeholder: 'Caută un fișier de configurare',
        },
        sort: {
            label: 'Sortare'
        }
    },
    editConfig: {
        actions: {
            cancel: 'Anulează',
            save: 'Salvează',
            showMore: 'Arată mai mult',
            showLess: 'Arată mai puțin'
        },
        sections: 'Secțiuni',
        hiddenCount: '(1 ascuns) | ({count} ascunse)',
        selectOption: 'Selectează o opțiune',
        subtitle: 'Editare fișier de configurare'
    }
};
