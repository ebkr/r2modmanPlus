import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Yapılandırma düzenleyici',
        subtitle: 'Düzenlemek için bir yapılandırma dosyası seçin'
    },
    warning: {
        content: 'Yapılandırma dosyaları, mod yüklüyken oyun en az bir kez başlatıldıktan sonra oluşturulur.'
    },
    loading: 'Yapılandırma dosyaları aranıyor',
    actions: {
        delete: 'Sil',
        editConfig: 'Yapılandırmayı düzenle',
        openFile: 'Dosyayı aç',
        search: {
            label: 'Ara',
            placeholder: 'Bir yapılandırma dosyası arayın',
        },
        sort: {
            label: 'Sırala'
        }
    },
    editConfig: {
        actions: {
            cancel: 'İptal',
            save: 'Kaydet',
            showMore: 'Daha fazla göster',
            showLess: 'Daha az göster'
        },
        sections: 'Bölümler',
        hiddenCount: '(1 gizli) | ({count} gizli)',
        selectOption: 'Bir seçenek belirleyin',
        subtitle: 'Yapılandırma dosyası düzenleniyor'
    }
};
