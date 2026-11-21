import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: 'Начало работы в {platformName}',
        subtitle: 'Давайте правильно настроим игру'
    },
    flatpakWarning: {
        existingArguments: 'Похоже, вы уже задавали параметры запуска.',
        notice: 'Flatpak-версия {appName} теперь использует другой скрипт-обёртку.',
        mustUpdate: 'Чтобы это работало, нужно обновить параметры запуска.'
    },
    instructions: {
        intro: 'Чтобы запускать {gameName} на Linux, сначала нужно правильно настроить параметры запуска в Steam.',
        whyNeeded: 'Это необходимо из-за того, как работает внедрение BepInEx в Unix-системах.',
        copyInstruction: 'Скопируйте и вставьте следующее в параметры запуска {gameName}:'
    },
    actions: {
        copy: 'Скопировать',
        copied: 'Скопировано!',
        continue: 'Продолжить'
    }
};
