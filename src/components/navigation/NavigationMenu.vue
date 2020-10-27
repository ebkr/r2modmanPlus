<template>
    <aside class="menu">
        <p class="menu-label">Risk of Rain 2</p>
        <ul class="menu-list">
            <li><a href="#"><i class="fas fa-play-circle"/>&nbsp;&nbsp;Start modded</a>
            </li>
            <li>
                <a href="#"><i class="far fa-play-circle"/>&nbsp;&nbsp;Start
                    vanilla</a>
            </li>
        </ul>
        <p class="menu-label">Mods</p>
        <ul class="menu-list">
            <li>
                <a href="#" data-ref="installed" @click="emitClick($event.target)"
                   :class="[view === 'installed' ? 'is-active' : '']">
                    <i class="fas fa-folder"/>&nbsp;&nbsp;Installed ({{localModList.length}})
                </a>
            </li>
            <li>
                <a href="#" data-ref="online" @click="emitClick($event.target)"
                   :class="[view === 'online' ? 'is-active' : '']">
                    <i class="fas fa-globe"/>&nbsp;&nbsp;Online ({{thunderstoreModList.length}})
                </a>
            </li>
        </ul>
        <p class='menu-label'>Other</p>
        <ul class='menu-list'>
            <li>
                <a href="#" :class="[view === 'config-editor' ? 'is-active' : '']" data-ref="config-editor" @click="emitClick($event.target)">
                    <i class="fas fa-edit"/>&nbsp;&nbsp;Config editor
                </a>
            </li>
            <li>
                <a href="#" :class="[view === 'settings' ? 'is-active' : '']"
                   data-ref="settings" @click="emitClick($event.target)">
                    <i class="fas fa-cog"/>&nbsp;&nbsp;Settings
                </a>
            </li>
            <li>
                <a href="#" :class="[view === 'help' ? 'is-active' : '']"
                   data-ref="help-page" @click="emitClick($event.target)">
                    <i class="fas fa-question-circle"/>&nbsp;&nbsp;Help</a>
                <ul v-if="view === 'help'">
                    <li>
                        <a href='#' :class="[{'is-active': helpPage === 'tips-and-tricks'}]"
                           data-ref="tips-and-tricks" @click="emitHelpSectionClick($event.target)">
                            <i class="fas fa-lightbulb"/>&nbsp;&nbsp;Tips and tricks
                        </a>
                    </li>
                    <li>
                        <a href='#' :class="[{'is-active': helpPage === 'game-wont-start'}]"
                           data-ref="game-wont-start" @click="emitHelpSectionClick($event.target)">
                            <i class="fas fa-gamepad"/>&nbsp;&nbsp;Game won't start
                        </a>
                    </li>
                    <li>
                        <a href='#' :class="[{'is-active': helpPage === 'mods-not-working'}]"
                           data-ref="mods-not-working" @click="emitHelpSectionClick($event.target)">
                            <i class="fas fa-ban"/>&nbsp;&nbsp;Mods aren't working
                        </a>
                    </li>
                    <li>
                        <a href='#' :class="[{'is-active': helpPage === 'like-r2'}]"
                           data-ref="like-r2" @click="emitHelpSectionClick($event.target)">
                            <i class="fas fa-heart"/>&nbsp;&nbsp;Like r2modman?
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </aside>
</template>

<script lang="ts">

    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class NavigationMenu extends Vue {

        @Prop({default: ""})
        private view!: string;

        @Prop({default: ""})
        private helpPage!: string;

        get thunderstoreModList() {
            return this.$store.state.thunderstoreModList;
        }

        get localModList() {
            return this.$store.state.localModList;
        }

        emitClick(element: any) {
            this.$emit("clicked-" + element.getAttribute("data-ref"));
        }

        emitHelpSectionClick(element: HTMLElement) {
            this.$emit("help-clicked-" + element.getAttribute("data-ref"));
        }
    }

</script>
