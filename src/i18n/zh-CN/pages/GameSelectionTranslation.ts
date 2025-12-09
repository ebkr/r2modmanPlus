import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    platformModal: {
        header: "要管理哪个平台的游戏?",
        selectAction: "选择平台",
    },
    pageTitle: {
        title: {
            game: '游戏选择',
            server: '服务器选择',
        },
        subtitle: {
            game: '你想要管理哪个游戏的模组？',
            server: '你想要管理哪个服务器的模组？',
        }
    },
    migrationNotice: {
        requiresUpdate: '管理器已更新，需要执行后台任务。',
        actionsDisabled: '在任务结束前，将禁用选择游戏。',
    },
    tabs: {
        game: '游戏',
        server: '服务器'
    },
    actions: {
        select: {
            game: '选择游戏',
            server: '选择服务器',
        },
        setAsDefault: '设为默认',
    },
    filter: {
        placeholder: {
            game: '搜索游戏',
            server: '搜索服务器',
        }
    }
}
