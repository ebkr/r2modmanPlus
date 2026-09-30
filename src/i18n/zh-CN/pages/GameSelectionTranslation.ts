import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: '游戏选择',
            server: '服务器选择',
        },
        subtitle: {
            game: '您想为哪个游戏管理模组？',
            server: '您想为哪个专用服务器管理模组？',
        }
    },
    migrationNotice: {
        requiresUpdate: '管理器已更新，需要执行一些后台工作。',
        actionsDisabled: '在工作完成之前，选择游戏的选项将被禁用。',
    },
    tabs: {
        game: '游戏',
        server: '服务器'
    },
    noResults: {
        empty: {
            game: '未找到与“{filterText}”匹配的游戏',
            server: '未找到与“{filterText}”匹配的服务器',
        },
        title: '找不到您想找的内容？',
        suggestion: '试试其他游戏名称或关键词。也可能是我们尚未支持这款游戏。',
    },
    actions: {
        select: {
            game: '选择游戏',
            server: '选择服务器'
        },
        setAsDefault: '设为默认',
        request: {
            game: '申请新游戏',
            server: '申请新服务器',
        }
    },
    filter: {
        placeholder: {
            game: '搜索游戏',
            server: '搜索服务器',
        }
    },
    cardView: {
        imageAltText: '游戏图片',
        newBadge: '新',
        sections: {
            favourites: '收藏',
            games: '游戏',
            servers: '服务器',
            newlyAdded: {
                games: '新游戏',
                servers: '新服务器',
            },
            searchResults: '搜索结果',
            hiddenGames: '已隐藏的游戏',
            hiddenGamesNotice: '这些游戏已不再受支持。',
        }
    },
    ecosystemUpdate: {
        updating: '正在更新游戏列表',
        upToDate: '您的游戏列表已是最新',
        failed: '更新游戏列表失败',
        retry: '重试游戏列表更新',
    },
    loading: '正在准备游戏列表',
}
