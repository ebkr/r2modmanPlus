import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: '{platformName}에서 시작하기',
        subtitle: '게임을 올바르게 설정해 보겠습니다'
    },
    flatpakWarning: {
        existingArguments: '이전에 시작 옵션을 설정한 것으로 보입니다.',
        notice: '{appName}의 Flatpak 버전은 이제 다른 래퍼 스크립트를 사용합니다.',
        mustUpdate: '이를 지원하려면 시작 옵션을 업데이트해야 합니다'
    },
    instructions: {
        intro: 'Linux에서 {gameName}을(를) 실행하려면 먼저 스팀 시작 옵션을 올바르게 설정해야 합니다.',
        whyNeeded: 'Unix 시스템에서 BepInEx가 주입되는 방식 때문에 이 작업이 필요합니다.',
        copyInstruction: '{gameName}의 시작 옵션에 다음 내용을 복사하여 붙여넣어 주세요:'
    },
    actions: {
        copy: '클립보드에 복사',
        copied: '복사됨!',
        continue: '계속'
    }
};
