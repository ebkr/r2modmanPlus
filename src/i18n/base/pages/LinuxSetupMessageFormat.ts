export type LinuxSetupMessageFormat = {
    hero: {
        title: string;
        subtitle: string;
    },
    flatpakWarning: {
        existingArguments: string;
        notice: string;
        mustUpdate: string;
    },
    instructions: {
        intro: string;
        whyNeeded: string;
        copyInstruction: string;
    },
    actions: {
        copy: string;
        copied: string;
        continue: string;
    }
}
