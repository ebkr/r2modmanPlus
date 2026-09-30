import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: '开始在 {platformName} 上游玩',
        subtitle: '让我们正确配置游戏'
    },
    flatpakWarning: {
        existingArguments: '检测到您之前已经设置过启动参数。',
        notice: '{appName} 的 Flatpak 版本现已改用不同的封装脚本。',
        mustUpdate: '您必须更新启动参数以适配此变更。'
    },
    instructions: {
        intro: '要在 Linux 上启动 {gameName}，您必须先正确设置 Steam 启动选项。',
        whyNeeded: '这是因为 BepInEx 在 Unix 系统上的注入方式所致。',
        copyInstruction: '请将以下内容复制粘贴到 {gameName} 的启动选项中：'
    },
    actions: {
        copy: '复制到剪贴板',
        copied: '已复制！',
        continue: '继续'
    }
};
