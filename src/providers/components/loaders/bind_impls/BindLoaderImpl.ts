import SettingsViewProvider from '../SettingsViewProvider';
import LocalModListProvider from '../LocalModListProvider';
import OnlineModListProvider from '../OnlineModListProvider';
import HelpPageProvider from '../HelpPageProvider';
import NavigationMenuProvider from 'src/providers/components/loaders/NavigationMenuProvider';

export default class BindLoaderImpl {

    static bind() {
        SettingsViewProvider.provide(() => import("../../../../components/settings-components/SettingsView.vue"));
        LocalModListProvider.provide(() => import("../../../../components/views/LocalModList.vue"));
        OnlineModListProvider.provide(() => import("../../../../components/views/OnlineModList.vue"));
        HelpPageProvider.provide(() => import("../../../../components/views/Help.vue"));
        NavigationMenuProvider.provide(() => import("../../../../components/navigation/NavigationMenu.vue"));
    }

}
