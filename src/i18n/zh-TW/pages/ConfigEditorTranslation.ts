import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: '設定編輯器',
        subtitle: '選擇要編輯的組態檔'
    },
    warning: {
        content: '組態檔需要在安裝模組並至少啟動一次遊戲後才會生成。'
    },
    loading: '正在查詢組態檔',
    actions: {
        delete: '刪除',
        editConfig: '編輯設定',
        openFile: '開啟檔案',
        search: {
            label: '搜尋',
            placeholder: '搜尋組態檔',
        },
        sort: {
            label: '排序'
        }
    },
    editConfig: {
        actions: {
            cancel: '取消',
            save: '儲存',
            showMore: '顯示更多',
            showLess: '收起'
        },
        sections: '區段',
        hiddenCount: '（隱藏 1 項） | （隱藏 {count} 項）',
        selectOption: '選擇一個選項',
        subtitle: '正在編輯組態檔'
    }
};
