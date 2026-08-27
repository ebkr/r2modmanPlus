import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: 'Erste Schritte auf {platformName}',
        subtitle: 'Wir richten das Spiel richtig ein'
    },
    flatpakWarning: {
        existingArguments: 'Es sieht so aus, als hättest du bereits Startargumente festgelegt.',
        notice: 'Die Flatpak-Version von {appName} verwendet jetzt ein anderes Wrapper-Skript.',
        mustUpdate: 'Du musst deine Startargumente aktualisieren, damit dies unterstützt wird.'
    },
    instructions: {
        intro: 'Um {gameName} unter Linux starten zu können, musst du zunächst die Steam-Startoptionen korrekt einrichten.',
        whyNeeded: 'Dies ist aufgrund der Funktionsweise der BepInEx-Injection auf Unix-Systemen erforderlich.',
        copyInstruction: 'Bitte kopiere Folgendes und füge es in die Startoptionen von {gameName} ein:'
    },
    actions: {
        copy: 'In die Zwischenablage kopieren',
        copied: 'Kopiert!',
        continue: 'Weiter'
    }
};

