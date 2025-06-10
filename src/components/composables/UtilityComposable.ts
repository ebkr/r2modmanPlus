import InteractionProvider from '../../providers/ror2/system/InteractionProvider';
import R2Error, { throwForR2Error } from '../../model/errors/R2Error';
import { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import { getStore } from '../../providers/generic/store/StoreProvider';
import VueRouter from 'vue-router';
import { InstallMode } from '../../utils/DependencyUtils';

export function useUtilityComposable() {

    const store = getStore<any>();

    const refreshInterval = 5 * 60 * 1000;
    let tsBackgroundRefreshFailed = false;

    function hookBackgroundUpdateThunderstoreModList(router: VueRouter) {
        setInterval(() => backgroundRefreshThunderstoreModList(router), refreshInterval);
    }

    function hookModInstallingViaProtocol(router: VueRouter) {
        InteractionProvider.instance.hookModInstallProtocol(async (protocolUrl) => {
            const profileSelectedRoutes = ["manager", "manager.installed", "manager.online", "manager.settings", "config-editor", "help", "downloads"];
            if (router.currentRoute.name && !profileSelectedRoutes.includes(router.currentRoute.name)) {
                store.commit('error/handleError', {
                    error: new R2Error(
                        "Unable to install mod(s)",
                        "Mod installation via a link is not possible when a game and a profile are not selected",
                        "Please select a game and a profile before attempting to install a mod via a link."
                    ),
                    severity: LogSeverity.ACTION_STOPPED
                });
                return;
            }

            try {
                const game = store.state.activeGame;
                const profile = store.getters['profile/activeProfile'].asImmutableProfile();
                const combos = [throwForR2Error(await ThunderstoreCombo.fromProtocol(protocolUrl, game))];
                const installMode = InstallMode.INSTALL_SPECIFIC;
                await store.dispatch('download/downloadAndInstallCombos', {combos, game, installMode, profile});

                const modList = throwForR2Error(await ProfileModList.getModList(profile));
                await store.dispatch('profile/updateModList', modList);
            } catch (err) {
                store.commit('error/handleError', {
                    error: R2Error.fromThrownValue(err),
                    severity: LogSeverity.ACTION_STOPPED
                });
            }
        });
    }

    /**
     * Periodically refresh the Thunderstore mod list in the background.
     *
     * Thunderstore's Sentry gets regular errors about this failing with
     * HTTP status code 0. The assumption is that it's caused by users
     * closing the window while update is in progress. Ignore the first
     * failure to see how this affects the number of reported errors.
     */
    async function backgroundRefreshThunderstoreModList(router: VueRouter) {
        // Don't do background update on index route since the game
        // isn't really chosen yet, nor in the splash screen since it
        // proactively updates the package list.
        const exemptRoutes = ["index", "splash"];

        if (router.currentRoute.name && exemptRoutes.includes(router.currentRoute.name)) {
            return;
        }

        await store.dispatch("tsMods/syncPackageList");

        if (store.state.tsMods.thunderstoreModListUpdateError) {
            if (tsBackgroundRefreshFailed) {
                console.error("Two consecutive background refresh attempts failed");
                throw store.state.tsMods.thunderstoreModListUpdateError;
            }

            tsBackgroundRefreshFailed = true;
            return;
        }

        tsBackgroundRefreshFailed = false;
    }

    /**
     * Set internal state of CdnProvider to prefer a mirror CDN if the
     * main CDN is unreachable.
     */
    async function checkCdnConnection() {
        try {
            await CdnProvider.checkCdnConnection();
        } catch (error: unknown) {
            if (error instanceof R2Error) {
                store.commit('error/handleError', error);
            } else {
                console.error(error);
            }
        }
    }

    return {
        hookBackgroundUpdateThunderstoreModList,
        hookModInstallingViaProtocol,
        checkCdnConnection,
    }
}
