<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error, { throwForR2Error } from '../../model/errors/R2Error';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import InteractionProvider from '../../providers/ror2/system/InteractionProvider';
import { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import { ModpackDependencyStrategy } from '../../utils/DependencyUtils';

@Component
export default class UtilityMixin extends Vue {
    readonly REFRESH_INTERVAL = 5 * 60 * 1000;
    private tsBackgroundRefreshFailed = false;

    hookBackgroundUpdateThunderstoreModList() {
        setInterval(this.backgroundRefreshThunderstoreModList, this.REFRESH_INTERVAL);
    }

    hookModInstallingViaProtocol() {
        InteractionProvider.instance.hookModInstallProtocol(async (protocolUrl) => {
            const profileSelectedRoutes = ["manager", "manager.installed", "manager.online", "manager.settings", "config-editor", "help", "downloads"];

            if (this.$route.name && !profileSelectedRoutes.includes(this.$route.name)) {
                this.$store.commit('error/handleError', {
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
                const game = this.$store.state.activeGame;
                const profile = this.$store.getters['profile/activeProfile'].asImmutableProfile();
                const combos = [throwForR2Error(await ThunderstoreCombo.fromProtocol(protocolUrl, game))];

                await this.$store.dispatch('download/downloadAndInstallCombos', {
                    combos,
                    profile,
                    game,
                    modpackDependencyStrategy: ModpackDependencyStrategy.USE_EXACT_VERSION
                });

                const modList = throwForR2Error(await ProfileModList.getModList(profile));
                await this.$store.dispatch('profile/updateModList', modList);
            } catch (err) {
                this.$store.commit('error/handleError', {
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
    private async backgroundRefreshThunderstoreModList() {
        // Don't do background update on index route since the game
        // isn't really chosen yet, nor in the splash screen since it
        // proactively updates the package list.
        const exemptRoutes = ["index", "splash"];

        if (this.$route.name && exemptRoutes.includes(this.$route.name)) {
            return;
        }

        await this.$store.dispatch("tsMods/syncPackageList");

        if (this.$store.state.tsMods.thunderstoreModListUpdateError) {
            if (this.tsBackgroundRefreshFailed) {
                console.error("Two consecutive background refresh attempts failed");
                throw this.$store.state.tsMods.thunderstoreModListUpdateError;
            }

            this.tsBackgroundRefreshFailed = true;
            return;
        }

        this.tsBackgroundRefreshFailed = false;
    }

    /**
     * Set internal state of CdnProvider to prefer a mirror CDN if the
     * main CDN is unreachable.
     */
    async checkCdnConnection() {
        try {
            await CdnProvider.checkCdnConnection();
        } catch (error: unknown) {
            if (error instanceof R2Error) {
                this.$store.commit('error/handleError', error);
            } else {
                console.error(error);
            }
        }
    }
}
</script>
