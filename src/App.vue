<template>
    <div id="q-app" :class="[{'html--funky':settings.funkyModeEnabled}]">

        <router-view @error="showError"/>

        <div id='errorModal' :class="['modal', {'is-active':(errorMessage !== '')}]">
            <div class="modal-background" @click="closeErrorModal()"></div>
            <div class='modal-content'>
                <div class='notification is-danger'>
                    <h3 class='title'>Error</h3>
                    <h5 class="title is-5">{{errorMessage}}</h5>
                    <p>{{errorStack}}</p>
                    <div v-if="errorSolution !== ''">
                        <br/>
                        <h5 class="title is-5">Suggestion</h5>
                        <p>{{errorSolution}}</p>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeErrorModal()"></button>
        </div>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import 'bulma-steps/dist/js/bulma-steps.min.js';
    import R2Error from './model/errors/R2Error';
    import ManagerSettings from './r2mm/manager/ManagerSettings';

    @Component
    export default class App extends Vue {

        errorMessage: string = '';
        errorStack: string = '';
        errorSolution: string = '';
        settings: ManagerSettings = ManagerSettings.getSingleton();

        showError(error: R2Error) {
            this.errorMessage = error.name;
            this.errorStack = error.message;
            this.errorSolution = error.solution;
        }

        closeErrorModal() {
            this.errorMessage = '';
            this.errorStack = '';
            this.errorSolution = '';
        }

        created() {
            this.$watch('$q.dark.isActive', () => {
                document.documentElement.classList.toggle('html--dark', this.$q.dark.isActive);
            });
        }

    }
</script>
