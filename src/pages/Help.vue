<template>
    <div>
        <Hero :title="$t('pages.help.title')" :subtitle="$t('pages.help.subtitle')" hero-type="is-info"/>
        <div
            class="tabs sticky-top sticky-top--opaque sticky-top--no-shadow sticky-top--no-padding has-background-">
            <ul>
                <li v-for="(key, index) in tabs" :key="`tab-${key}`"
                    :class="[{'is-active': activeTab === key}]"
                    @click="changeTab(key)">
                    <a>{{ $t(`pages.help.tabs["${key.toLowerCase()}"]`) }}</a>
                </li>
            </ul>
        </div>
        <div class="container margin-right">
            <br/>
            <div ref="General" v-if="activeTab === 'General'">
                <h2 class="title is-5">{{ $t(`pages.help.startTitle`) }}</h2>
                <p>
                    {{ $t(`pages.help.startInfo`) }}
                </p>
                <i18n path="pages.help.startTip" tag="p">
                    <template v-slot:strong>
                        <strong>{{ $t('pages.help.strong') }}</strong>
                    </template>
                </i18n>
                <hr/>
                <h2 class='title is-5'>{{ $t(`pages.help.slowTitle`) }}</h2>
                <i18n path="pages.help.slowInfo" tag="p">
                    <template v-slot:br>
                        <br/>
                    </template>
                </i18n>
                <hr/>
                <h2 class='title is-5'>{{ $t(`pages.help.dedicatedTitle`) }}</h2>
                <p>
                    {{ $t(`pages.help.dedicatedInfo`) }}
                </p>
                <hr/>
                <h2 class='title is-5'>{{ $t(`pages.help.launchingTitle`) }}</h2>
                <i18n path="pages.help.launchingInfo" tag="p">
                    <template v-slot:br>
                        <br/>
                    </template>
                    <template v-slot:code>
                        <code v-if="doorstopTarget.length > 0">{{ doorstopTarget }}</code>
                        <code v-else>{{ $t(`pages.help.codeElse`) }}</code>
                    </template>
                </i18n>
            </div>
            <div ref="Game won't start" v-if="activeTab === `Game won't start`">
                <h2 class='title is-5'>{{ $t(`pages.help.failStartTitle1`) }}</h2>
                <p>{{ $t(`pages.help.failStartTip1`) }}</p>
                <hr/>
                <h2 class='title is-5'>{{ $t(`pages.help.failStartTitle2`) }}</h2>
                <p>{{ $t(`pages.help.failStartTip2`) }}</p>
                <hr/>
                <h2 class='title is-5'>{{ $t(`pages.help.failStartTitle3`) }}</h2>
                <p>{{ $t(`pages.help.failStartTip3`) }}</p>
                <p>{{ $t(`pages.help.failStartTip4`) }}</p>
            </div>
            <div ref="Mods not appearing" v-if="activeTab === 'Mods not appearing'">
                <h2 class='title is-5'>{{ $t(`pages.help.modsTitle`) }}</h2>
                <i18n path="pages.help.modsInfo" tag="p">
                    <template v-slot:link>
                        <Link target="external" url="https://github.com/ebkr/r2modmanPlus/wiki/Why-aren't-my-mods-working%3F">
                            {{ $t(`pages.help.here`) }}
                        </Link>
                    </template>
                </i18n>
            </div>
            <div ref="Updating" v-if="activeTab === 'Updating'">
                <h2 class='title is-5'>{{ $t(`pages.help.updatingTitle1`) }}</h2>
                <p>{{ $t(`pages.help.updatingTip1`) }}</p>
                <p>{{ $t(`pages.help.updatingTip2`) }}</p>
                <i18n path="pages.help.updatingTip3" tag="p">
                    <template v-slot:i>
                        <i>{{ $t(`pages.help.old`) }}</i>
                    </template>
                </i18n>
<!--                <p>You may receive a prompt to run <i>old_uninstaller</i> as an admin. This is the updater.</p>-->
                <p>{{ $t(`pages.help.updatingTip4`) }}</p>
                <hr/>
                <h2 class='title is-5'>{{ $t(`pages.help.updatingTitle2`) }}</h2>
                <p>
                    {{ $t(`pages.help.updatingTip5`) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import { Component, Vue } from 'vue-property-decorator';
    import {Hero, Link} from '../components/all';
    import GameRunnerProvider from '../providers/generic/game/GameRunnerProvider';
    import R2Error from '../model/errors/R2Error';

    @Component({
        components: {
            Link,
            Hero
        }
    })
    export default class Help extends Vue {
        private activeTab = 'General';
        private tabs = ['General', 'Game won\'t start', 'Mods not appearing', 'Updating'];
        private doorstopTarget = "";

        changeTab(key: string) {
            this.activeTab = key;
        }

        mounted() {
            GameRunnerProvider.instance.getGameArguments(
                this.$store.state.activeGame,
                this.$store.getters['profile/activeProfile']
            ).then(target => {
                if (target instanceof R2Error) {
                    this.doorstopTarget = "";
                } else {
                    this.doorstopTarget = target;
                }
            });
        }

    }
</script>
