import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: 'Oyun seçimi',
            server: 'Sunucu seçimi',
        },
        subtitle: {
            game: 'Hangi oyunun modlarını yönetiyorsunuz?',
            server: 'Hangi özel sunucunun modlarını yönetiyorsunuz?',
        }
    },
    migrationNotice: {
        requiresUpdate: 'Yönetici güncellendi ve arka planda bazı işlemler yapması gerekiyor.',
        actionsDisabled: 'Bu işlemler tamamlanana kadar oyun seçme seçenekleri devre dışıdır.',
    },
    tabs: {
        game: 'Oyun',
        server: 'Sunucu'
    },
    noResults: {
        empty: {
            game: '"{filterText}" ile eşleşen oyun bulunamadı',
            server: '"{filterText}" ile eşleşen sunucu bulunamadı',
        },
        title: 'Aradığınızı bulamıyor musunuz?',
        suggestion: 'Farklı bir oyun adı veya anahtar kelime deneyin. Bu oyunu henüz desteklemiyor olabiliriz.',
    },
    actions: {
        select: {
            game: 'Oyunu seç',
            server: 'Sunucuyu seç'
        },
        setAsDefault: 'Varsayılan yap',
        request: {
            game: 'Yeni bir oyun iste',
            server: 'Yeni bir sunucu iste',
        }
    },
    filter: {
        placeholder: {
            game: 'Bir oyun arayın',
            server: 'Bir sunucu arayın',
        }
    },
    cardView: {
        imageAltText: 'Oyun görseli',
        newBadge: 'Yeni',
        sections: {
            favourites: 'Favoriler',
            games: 'Oyunlar',
            servers: 'Sunucular',
            newlyAdded: {
                games: 'Yeni oyunlar',
                servers: 'Yeni sunucular',
            },
            searchResults: 'Arama sonuçları',
            hiddenGames: 'Gizli oyunlar',
            hiddenGamesNotice: 'Bu oyunlar artık desteklenmiyor.',
        }
    },
    ecosystemUpdate: {
        updating: 'Oyun listesi güncelleniyor',
        upToDate: 'Oyun listeniz güncel',
        failed: 'Oyun listesi güncellenemedi',
        retry: 'Oyun listesi güncellemesini tekrar dene',
    },
    loading: 'Oyunlar hazırlanıyor',
}
