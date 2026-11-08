import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: 'Getting started on {platformName}',
        subtitle: 'Let\'s configure the game properly'
    },
    flatpakWarning: {
        existingArguments: 'It looks like you\'ve previously set launch arguments.',
        notice: 'The Flatpak version of {appName} now uses a different wrapper script.',
        mustUpdate: 'You must update your launch arguments to support this.'
    },
    instructions: {
        intro: 'To be able to launch {gameName} on Linux, you must first setup your Steam launch options correctly.',
        whyNeeded: 'This needs to be done because of how the BepInEx injection works on Unix systems.',
        copyInstruction: 'Please copy and paste the following to your {gameName} launch options:'
    },
    actions: {
        copy: 'Copy to clipboard',
        copied: 'Copied!',
        continue: 'Continue'
    }
};
