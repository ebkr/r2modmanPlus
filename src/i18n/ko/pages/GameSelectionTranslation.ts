import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: '게임 선택',
            server: '서버 선택',
        },
        subtitle: {
            game: '어떤 게임에서 모드를 관리하실 건가요?',
            server: '어떤 서버에서 모드를 관리하실 건가요?',
        }
    },
    migrationNotice: {
        requiresUpdate: '매니저가 백그라운드에서 업데이트를 진행 중입니다.',
        actionsDisabled: '게임을 선택할 수 있는 옵션은 작업이 완료될 때까지 사용할 수 없습니다.',
    },
    tabs: {
        game: '게임',
        server: '서버'
    },
    noResults: {
        empty: {
            game: '"{filterText}"와 일치하는 게임이 없습니다',
            server: '"{filterText}"와 일치하는 서버가 없습니다',
        },
        title: '원하시는걸 찾을 수 없나요?',
        suggestion: '다른 이름이나 줄임말을 입력해 보세요. 저희가 아직 그 게임을 지원하지 않을 수 있습니다.',
    },
    actions: {
        select: {
            game: '게임 선택',
            server: '서버 선택'
        },
        setAsDefault: '기본값으로 설정',
        request: {
            game: '새로운 게임 요청',
            server: '새로운 서버 요청',
        }
    },
    filter: {
        placeholder: {
            game: '게임 검색',
            server: '서버 검색',
        }
    },
    cardView: {
        imageAltText: '게임 이미지',
        newBadge: '신규',
        sections: {
            favourites: '즐겨찾기',
            games: '게임',
            servers: '서버',
            newlyAdded: {
                games: '신규 게임',
                servers: '신규 서버',
            },
            searchResults: '검색 결과',
            hiddenGames: '숨겨진 게임',
            hiddenGamesNotice: '이 게임들은 더 이상 지원되지 않습니다.',
        }
    },
    ecosystemUpdate: {
        updating: '게임 목록 업데이트 중',
        upToDate: '이미 목록이 최신 상태입니다',
        failed: '게임 목록 업데이트 실패',
        retry: '게임 목록 업데이트 재시도',
    },
    loading: '게임 준비 중',
}
