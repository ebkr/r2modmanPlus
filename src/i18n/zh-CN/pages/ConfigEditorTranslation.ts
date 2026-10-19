import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: '配置编辑器',
        subtitle: '选择要编辑的配置文件'
    },
    warning: {
        content: '配置文件需要在安装模组并至少启动一次游戏后才会生成。'
    },
    loading: '正在查找配置文件',
    actions: {
        delete: '删除',
        editConfig: '编辑配置',
        openFile: '打开文件',
        search: {
            label: '搜索',
            placeholder: '搜索配置文件',
        },
        sort: {
            label: '排序'
        }
    },
    editConfig: {
        actions: {
            cancel: '取消',
            save: '保存',
            showMore: '显示更多',
            showLess: '收起'
        },
        sections: '分区',
        hiddenCount: '（隐藏 1 项） | （隐藏 {count} 项）',
        selectOption: '选择一个选项',
        subtitle: '正在编辑配置文件'
    }
};
