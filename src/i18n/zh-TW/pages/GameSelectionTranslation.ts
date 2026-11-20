import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: '遊戲選擇',
            server: '伺服器選擇',
        },
        subtitle: {
            game: '您想為哪個遊戲管理模組？',
            server: '您想為哪個專用伺服器管理模組？',
        }
    },
    migrationNotice: {
        requiresUpdate: '管理器已更新，需要執行一些背景工作。',
        actionsDisabled: '在工作完成之前，選擇遊戲的選項將被停用。',
    },
    tabs: {
        game: '遊戲',
        server: '伺服器'
    },
    noResults: {
        empty: {
            game: '未找到與「{filterText}」符合的遊戲',
            server: '未找到與「{filterText}」符合的伺服器',
        },
        title: '找不到您想找的內容？',
        suggestion: '請嘗試其他遊戲名稱或關鍵字。也可能是我們尚未支援這款遊戲。',
    },
    actions: {
        select: {
            game: '選擇遊戲',
            server: '選擇伺服器'
        },
        setAsDefault: '設為預設',
        request: {
            game: '申請新遊戲',
            server: '申請新伺服器',
        }
    },
    filter: {
        placeholder: {
            game: '搜尋遊戲',
            server: '搜尋伺服器',
        }
    },
    cardView: {
        imageAltText: '遊戲圖片',
        newBadge: '新',
        sections: {
            favourites: '收藏',
            games: '遊戲',
            servers: '伺服器',
            newlyAdded: {
                games: '新遊戲',
                servers: '新伺服器',
            },
            searchResults: '搜尋結果',
            hiddenGames: '已隱藏的遊戲',
            hiddenGamesNotice: '這些遊戲已不再受支援。',
        }
    },
    ecosystemUpdate: {
        updating: '正在更新遊戲清單',
        upToDate: '您的遊戲清單已是最新',
        failed: '更新遊戲清單失敗',
        retry: '重試遊戲清單更新',
    },
    loading: '正在準備遊戲清單',
}
