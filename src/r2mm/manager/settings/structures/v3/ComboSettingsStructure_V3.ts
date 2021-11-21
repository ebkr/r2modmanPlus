import GlobalSettingsStructure_V3, { InternalGlobalSettingsStructure_V3 } from './GlobalSettingsStructure_V3';
import GameSettingsStructure_V3, { InternalGameSettingsStructure_V3 } from './GameSettingsStructure_V3';

export default interface ComboSettingsStructure_V3 {
    globalFormat: GlobalSettingsStructure_V3;
    gameFormat: GameSettingsStructure_V3;
    global: InternalGlobalSettingsStructure_V3;
    gameSpecific: InternalGameSettingsStructure_V3;
}
