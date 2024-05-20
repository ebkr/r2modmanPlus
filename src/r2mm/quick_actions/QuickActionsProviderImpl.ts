import { QuickAction, QuickActionProvider } from './QuickActionProvider';
import { Vue } from 'vue-property-decorator';

export class QuickActionsProviderImpl implements QuickActionProvider {

    getDefaultQuickActions(): QuickAction[] {
        return [
            CHANGE_GAME_ACTION,
            CHANGE_PROFILE_ACTION,
            EXPORT_PROFILE_CODE_ACTION
        ];
    }

    getQuickAction(name: string): QuickAction | undefined {
        return this.getQuickActions().find(value => value.name() === name);
    }

    getQuickActions(): QuickAction[] {
        return [
            CHANGE_GAME_ACTION,
            CHANGE_PROFILE_ACTION,
            EXPORT_PROFILE_FILE_ACTION,
            EXPORT_PROFILE_CODE_ACTION
        ];
    }

}

const CHANGE_GAME_ACTION = {
    name: () => {
        return "CHANGE_GAME"
    },
    displayName: () => {
        return "Change game"
    },
    icon: () => {
        return "fa-gamepad";
    },
    onClick: (eventBus: Vue) => {
        eventBus.$emit("change-route", "index");
    }
};

const CHANGE_PROFILE_ACTION = {
    name: () => {
        return "CHANGE_PROFILE"
    },
    displayName: () => {
        return "Change profile"
    },
    icon: () => {
        return "fa-file-import";
    },
    onClick: (eventBus: Vue) => {
        eventBus.$emit("change-route", "profiles")
    }
};

const EXPORT_PROFILE_FILE_ACTION = {
    name: () => {
        return "EXPORT_PROFILE_AS_FILE"
    },
    displayName: () => {
        return "Export profile as file"
    },
    icon: () => {
        return "fa-file-export";
    },
    onClick: (eventBus: Vue) => {

    }
};

const EXPORT_PROFILE_CODE_ACTION = {
    name: () => {
        return "EXPORT_PROFILE_AS_CODE"
    },
    displayName: () => {
        return "Export profile as code"
    },
    icon: () => {
        return "fa-file-export";
    },
    onClick: (eventBus: Vue) => {

    }
};
