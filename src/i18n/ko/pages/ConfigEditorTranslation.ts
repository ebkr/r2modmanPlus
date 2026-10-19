import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: '구성 편집기',
        subtitle: '편집할 구성 파일을 선택하세요'
    },
    warning: {
        content: '구성 파일은 모드를 설치하고 최소 1번 게임을 실행해야 생성됩니다.'
    },
    loading: '구성 파일 로딩 중',
    actions: {
        delete: '삭제',
        editConfig: '구성 편집',
        openFile: '파일 열기',
        search: {
            label: '검색',
            placeholder: '구성 파일 검색',
        },
        sort: {
            label: '정렬'
        }
    },
    editConfig: {
        actions: {
            cancel: '취소',
            save: '저장',
            showMore: '자세하게',
            showLess: '간략하게'
        },
        sections: '섹션',
        hiddenCount: '(1개 숨겨짐) | ({count}개 숨겨짐)',
        selectOption: '옵션 선택',
        subtitle: '구성 파일 편집'
    }
};
