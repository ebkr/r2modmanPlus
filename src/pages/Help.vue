<template>
    <div id="help-view">
        <Hero :title="$t('Help.help')" subtitle="Common problems and their potential solutions" hero-type="primary"/>
        <div
            class="tabs sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding has-background-">
            <ul>
                <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                    :class="[{'is-active': activeTab === key}]"
                    @click="changeTab(key)">
                    <a>{{key}}</a>
                </li>
            </ul>
        </div>
        <div class="margin-right">
            <br/>
            <div ref="General" v-if="activeTab === 'General'">
                <h2 class="title is-5">{{ $t('Help.getting_started_with_installin') }}</h2>
                <p>
                    {{ $t('Help.go_to_the_online_tab_find_a_mo') }}
                </p>
                <p>{{ $t('Help.once_you_ve_installed_the_mods') }} <strong>{{ $t('Help.start_modded') }}</strong> {{ $t('Help.in_the_top_left') }}</p>
                <hr/>
                <h2 class='title is-5'>{{ $t('Help.slow_game_with_mods_stuttering') }}</h2>
                <p>
                    {{ $t('Help.this_is_likely_due_to_a_mod_th') }}
                    <br/>
                    {{ $t('Help.if_the_issue_still_remains_the') }}
                    <br/><br/>
                    {{ $t('Help.in_the_case_of_stuttering_ther') }}
                </p>
                <hr/>
                <h2 class='title is-5'>{{ $t('Help.dedicated_servers') }}</h2>
                <p>
                    {{ $t('Help.dedicated_servers') }} {{ $t('Help.aren_t_directly_supported_thro') }} </p>
                <hr/>
                <h2 class='title is-5'>{{ $t('Help.launching_the_game_from_outsid') }}</h2>
                <p>
                    {{ $t('Help.by_design_your_experience_by_s') }}
                    <br/><br/>
                    {{ $t('Help.you_will_need_to_place_the_cor') }}
                    <br/>
                    {{ $t('Help.for_steam_this_would_be_locate') }}
                    <br/><br/>
                    {{ $t('Help.your_current_argument_would_be') }}
                    <code v-if="launchArgs.length > 0">{{ launchArgs }}</code>
                    <code v-else>{{ $t('Help.these_parameters_will_be_avail') }}</code>
                    <br/>
                </p>
                <br/>
                <template v-if="doorstopTarget.length > 0">
                    <p>
                        <button class="button" @click="copyLaunchArgsToClipboard" v-if="!copyingDoorstopText">
                            <i class="fas fa-clipboard"></i>
                            <span class="margin-left--half-width smaller-font">{{ $t('Help.copy_launch_arguments') }}</span>
                        </button>
                        <button class="button is-loading" v-else>{{ $t('Help.copy_launch_arguments') }}</button>
                    </p>
                    <br/>
                </template>
            </div>
            <div ref="Game won't start" v-if="activeTab === `Game won't start`">
                <h2 class='title is-5'>{{ $t('Help.a_red_box_appears_when_i_try_t') }}</h2>
                <p>{{ $t('Help.read_the_suggestion_at_the_bot') }}</p>
                <hr/>
                <h2 class='title is-5'>{{ $t('Help.i_m_taken_to_the_steam_store_p') }}</h2>
                <p>{{ $t('Help.that_s_because_you_don_t_legal') }}</p>
                <hr/>
                <h2 class='title is-5'>{{ $t('Help.a_text_window_appears_and_clos') }}</h2>
                <p>{{ $t('Help.try_running_reset') }} {{store.state.activeGame.displayName}} {{ $t('Help.installation_on_the_settings_s') }}</p>
                <p>{{ $t('Help.if_it_persists_force_exit_stea') }}</p>
            </div>
            <div ref="Mods not appearing" v-if="activeTab === 'Mods not appearing'">
                <h2 class='title is-5'>{{ $t('Help.potential_solutions') }}</h2>
                <p>{{ $t('Help.the_most_common_issues_are_sol') }} <ExternalLink url="https://github.com/ebkr/r2modmanPlus/wiki/Why-aren't-my-mods-working%3F"> {{ $t('Help.here') }} </ExternalLink>
                </p>
            </div>
            <div ref="Updating" v-if="activeTab === 'Updating'">
                <h2 class='title is-5'>{{ $t('Help.auto_updates') }}</h2>
                <p>{{ $t('Help.the_manager_updates_automatica') }}</p>
                <p>{{ $t('Help.updates_are_downloaded_in_the') }}</p>
                <p>{{ $t('Help.you_may_receive_a_prompt_to_ru') }} <i>{{ $t('Help.old_uninstaller') }}</i> {{ $t('Help.as_an_admin_this_is_the_update') }}</p>
                <p>{{ $t('Help.if_a_problem_occurs_with_an_up') }}</p>
                <hr/>
                <h2 class='title is-5'>{{ $t('Help.i_don_t_want_updates') }}</h2>
                <p> {{ $t('Help.on_github_there_is_a_portable') }} </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ExternalLink, Hero} from '../components/all';
import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
import R2Error from '../model/errors/R2Error';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';
import {onMounted, ref, watchEffect} from 'vue';
import {getStore} from '../providers/generic/store/StoreProvider';
import {State} from '../store';
import {getDeterminedLaunchType} from "../utils/LaunchUtils";
import {ComputedWrapperLaunchArguments} from "../components/computed/WrapperArguments";
import {getLaunchType, LaunchType} from "../model/real_enums/launch/LaunchType";
import appWindow from '../providers/node/app/app_window';

const store = getStore<State>();

const activeTab = ref('General');
const tabs = ref(['General', 'Game won\'t start', 'Mods not appearing', 'Updating']);
const doorstopTarget = ref("");
const copyingDoorstopText = ref(false);
const launchArgs = ref("");

watchEffect(async () => {
    const loaderArgs = doorstopTarget.value;
    const prerequisiteText = ComputedWrapperLaunchArguments.value;
    if (appWindow.getPlatform() === 'win32') {
        launchArgs.value = loaderArgs;
        return;
    }
    const storedLaunchType = await getLaunchType(store.state.activeGame);
    const launchType = await getDeterminedLaunchType(store.state.activeGame, storedLaunchType);
    if (launchType === LaunchType.NATIVE) {
        launchArgs.value = `${prerequisiteText} ${loaderArgs}`;
    } else {
        launchArgs.value = `%command% ${loaderArgs}`;
    }
});

function changeTab(key: string) {
    activeTab.value = key;
}

function copyLaunchArgsToClipboard() {
    InteractionProvider.instance.copyToClipboard(launchArgs.value);
    copyingDoorstopText.value = true;
    setTimeout(stopShowingCopy, 400);
}

function stopShowingCopy() {
    copyingDoorstopText.value = false;
}

onMounted(() => {
    GameRunnerProvider.instance.getGameArguments(
        store.state.activeGame,
        store.getters['profile/activeProfile']
    ).then(target => {
        if (target instanceof R2Error) {
            doorstopTarget.value = "";
            return;
        } else {
            doorstopTarget.value = target.map(value => `"${value}"`).join(' ');
        }
    });
});
</script>

<style lang="scss" scoped>
#help-view {
    width: 100%;
}
</style>
