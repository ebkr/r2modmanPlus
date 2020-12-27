<template>
    <div v-if="helpPage === 'tips-and-tricks'">
        <Hero title='Tips and tricks' heroType='is-info'/>
        <br/>
        <h5 class='title is-5'>Install with Mod Manager</h5>
        <p>Thunderstore has a way to install mods without having to search for them in the mod
            manager.
        </p>
        <p>Just go to the Settings tab, and associate r2modman with Thunderstore!</p>
        <br/>
        <br/>
        <h5 class='title is-5'>If only I could create a modpack</h5>
        <p>If only you could. Oh wait, you can.</p>
        <p>You can export your profile, and friends can later import the file and download the exact
            same mods.
        </p>
        <p>It makes joining servers easy, as well as removing the annoying clicks you'll all have to
            do.
        </p>
    </div>
    <div v-else-if="helpPage === 'game-wont-start'">
        <hero :title="'Game won\'t start'" heroType='is-info'/>
        <br/>
        <h5 class='title is-5'>If the BepInEx console appears</h5>
        <p>It's very likely due to a broken mod.</p>
        <p>Remove (or disable) all mods except for BepInEx and R2API. See if the problem still
            occurs.
        </p>
        <br/>
        <h5 class='title is-5'>If it doesn't appear</h5>
        <p>Locate your Risk of Rain 2 install directory via the Settings page.</p>
        <p>If you're unsure where to find it, navigate to Steam, right click your game, and go to
            "Manage > Browse local files"
        </p>
        <br/>
        <h5 class='title is-5'>Symlink errors?</h5>
        <p>
            Follow
            <link-component
                :url="'https://github.com/ebkr/r2modmanPlus/wiki/Error:-Failed-to-produce-a-symlink-between-profile-and-RoR2'"
                :target="'external'" class='selectable'>
                this guide
            </link-component>
            for more information.
        </p>
    </div>
    <div v-else-if="helpPage === 'mods-not-working'">
        <hero :title="'Mods aren\'t working'" heroType='is-info'/>
        <br/>
        <h5 class='title is-5'>Are all dependencies installed?</h5>
        <p>Did you uninstall a mod's dependency?</p>
        <p>Almost every mod has something it depends upon.</p>
        <p>Look for the missing dependency icon (<i class='fas fa-exclamation-circle'></i>) on the
            "Installed" tab.
        </p>
        <p>If there is a missing dependency, you'll be able to resolve it by either reinstalling the
            mod, or by clicking the "Download dependency" button.
        </p>
        <br/>
        <h5 class='title is-5'>Are all of your mods up-to-date?</h5>
        <p>Your mods may have a fix to get it working with the latest version of Risk of Rain 2.</p>
        <p>You can update mods by going to the "Installed" tab, clicking on mods with the update
            icon, and clicking the update button.
        </p>
        <p>Mods with updates have the (<i class='fas fa-cloud-upload-alt'></i>) icon.</p>
    </div>
    <div v-else-if="helpPage === 'like-r2'">
        <hero :title="'Enjoying the manager?'" :subtitle="'I hope so!'" heroType='is-danger'/>
        <br/>
        <h5 class='title is-5'>You can help support r2modman in multiple ways!</h5>
        <div class="content">
            <ul>
                <li>Leave a thumbs-up on
                    <link-component url='https://thunderstore.io/package/ebkr/r2modman/'
                                    :target="'external'" class='selectable'>
                        r2modman's Thunderstore page
                    </link-component>
                    .
                </li>
                <li>Star the project on
                    <link-component url='https://github.com/ebkr/r2modmanPlus/'
                                    :target="'external'" class='selectable'>
                        GitHub
                    </link-component>
                    .
                </li>
                <li>Don't forget to show your friends!</li>
            </ul>
        </div>
        <p>But most importantly, recommend new feature ideas! r2modman needs your help to be the
            best possible mod manager for Risk of Rain 2!
        </p>
    </div>
    <div v-else>
        <hero :title="'Help with r2modman'" heroType='is-info'/>
        <br/>
        <h5 class='title is-5'>How do I install mods?</h5>
        <p>Go to the "Online" tab, find a mod, and hit download. It'll also download the
            dependencies, saving you time.
        </p>
        <p>Once you've done that, start the game modded.</p>
        <br/>
        <h5 class='title is-5'>Launching the game modded using Steam</h5>
        <p>If you want to launch the game modded using Steam, you need to launch the game via
            r2modman at least once (per profile switch).
        </p>
        <p>
            Once you've done that,
            <link-component
                url='https://github.com/risk-of-thunder/R2Wiki/wiki/Running-modded-and-unmodded-game-with-shortcuts'
                :target="'external'"
                class='selectable'
            >follow this guide
            </link-component>,
            replacing <span class="code">"BepInEx\core\BepInEx.Preloader.dll" with
            "r2modman\BepInEx\core\BepInEx.Preloader.dll"
        </p>
        <br/>
        <h5 class='title is-5'>Something isn't working</h5>
        <p>If you get any issues, look at the other pages that have appeared.</p>
        <p>Failing that, mention me on the
            <link-component url='https://discord.gg/5MbXZvd' :target="'external'" class='selectable'>Thunderstore
                Discord Server!
            </link-component>
            @ Ebkr#3660
        </p>
    </div>
</template>

<script lang="ts">

    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Hero from '../Hero.vue';
    import { Link } from '../../components/all';

    @Component({
        components: {
            Hero,
            "link-component": Link
        }
    })
    export default class Help extends Vue {

        @Prop({default: ""})
        private helpPage!: string;

    }

</script>
