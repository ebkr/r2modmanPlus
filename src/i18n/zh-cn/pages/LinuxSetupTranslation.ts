import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: '在 {platformName} 上开始使用',
        subtitle: '让我们把游戏正确配置好'
    },
    flatpakWarning: {
        existingArguments: '看起来你之前设置过启动参数。',
        notice: '{appName} 的 Flatpak 版本现在使用不同的包装脚本。',
        mustUpdate: '你必须更新启动参数才能支持这一变更。'
    },
    instructions: {
        intro: '要在 Linux 上启动 {gameName}，你必须先正确设置 Steam 的启动选项。',
        whyNeeded: '之所以需要这样做，是因为 BepInEx 在 Unix 系统上的注入机制。',
        copyInstruction: '请将以下内容复制并粘贴到 {gameName} 的启动选项：'
    },
    actions: {
        copy: '复制到剪贴板',
        copied: '已复制！',
        continue: '继续'
    }
}

